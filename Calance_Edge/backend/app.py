"""
Calance Edge Backend
Flask application providing AI-powered sales enablement API endpoints
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import logging
from datetime import datetime, timezone
import json
import re
import httpx
import asyncio
import uuid
import nest_asyncio
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from PIL import Image as PILImage
import io
import base64

# Configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'calance-edge-secret-key-2024'
    OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
    OPENROUTER_BASE_URL = os.environ.get('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    # AI Model Configuration
    MODEL_CASE_STUDY_ANALYSIS = os.environ.get('MODEL_CASE_STUDY_ANALYSIS', 'anthropic/claude-sonnet-4.5')
    MODEL_CASE_STUDY_IMAGE = os.environ.get('MODEL_CASE_STUDY_IMAGE', 'google/gemini-3-pro-image-preview')
    MODEL_CASE_STUDY_REFINEMENT = os.environ.get('MODEL_CASE_STUDY_REFINEMENT', 'anthropic/claude-sonnet-4.5')
    MODEL_PRESENTATION_GENERATION = os.environ.get('MODEL_PRESENTATION_GENERATION', 'google/gemini-2.5-flash-image-preview')
    MODEL_PRESENTATION_REFINEMENT = os.environ.get('MODEL_PRESENTATION_REFINEMENT', 'anthropic/claude-sonnet-4.5')
    MODEL_RECRUITING_GENERATION = os.environ.get('MODEL_RECRUITING_GENERATION', 'anthropic/claude-haiku-4.5')

    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS',
        'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176').split(',')

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Apply nest_asyncio to allow async functions in Flask
nest_asyncio.apply()

# Enable CORS for frontend
CORS(app, origins=app.config['CORS_ORIGINS'])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# Brand Constants and Utilities
# ============================================

CALANCE_BRAND = {
    "colors": {
        "primary_navy": "#1e3a5f",
        "primary_blue": "#2563eb",
        "accent_orange": "#f97316",
        "accent_red": "#dc2626",
        "neutral_dark": "#1f2937",
        "neutral_gray": "#6b7280",
        "neutral_light": "#f3f4f6",
        "white": "#ffffff"
    },
    "typography": {
        "heading_font": "Inter, system-ui, sans-serif",
        "body_font": "Inter, system-ui, sans-serif",
        "sizes": {
            "h1": "2.25rem",
            "h2": "1.875rem",
            "h3": "1.5rem",
            "body": "1rem",
            "small": "0.875rem"
        }
    },
    "company_info": {
        "tagline": "Calance - the place to grow.",
        "website": "www.calance.com",
        "address": "888 Disneyland Drive Suite 500, Anaheim, CA 92802",
        "description": "Calance is a global IT company with operations in the United States, Canada, and India."
    }
}

def load_logo_as_base64():
    """Load Calance logo and convert to base64 data URL for image generation"""
    try:
        # Use relative path - logo is in same directory as app.py in Docker container
        import os
        logo_path = os.path.join(os.path.dirname(__file__), "calance-logo.webp")
        with open(logo_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        logger.info(f"Successfully loaded logo from {logo_path}")
        return f"data:image/webp;base64,{encoded}"
    except Exception as e:
        logger.error(f"Failed to load logo from {logo_path if 'logo_path' in locals() else 'unknown path'}: {e}")
        return None

# ============================================
# AI Service Integration
# ============================================

class AIService:
    """Service for interacting with OpenRouter API"""

    def __init__(self):
        self.api_key = app.config.get('OPENROUTER_API_KEY')
        self.base_url = app.config.get('OPENROUTER_BASE_URL')
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": app.config.get('CORS_ORIGINS', ['http://localhost:5174'])[0],  # First CORS origin
            "X-Title": "Calance Edge"
        }

    async def _analyze_freeform_content(self, raw_notes, client_name='', industry=''):
        """Step 1: Use Claude to extract CONCISE BULLET POINTS for infographic generation"""

        analysis_prompt = f"""You are extracting key information from project notes to create a ONE-PAGE INFOGRAPHIC case study.

CLIENT NOTES:
{raw_notes}

METADATA:
- Client Name: {client_name or 'Not provided'}
- Industry: {industry or 'Not provided'}

CRITICAL: Extract CONCISE bullet points, NOT paragraphs. This will be used for a visual infographic.

Return a JSON object with this structure:

{{
  "clientName": "Client name from notes",
  "industry": "Specific industry sector",

  "title": "Compelling headline with key result (8-12 words max)",
  "subtitle": "One-line value proposition (under 15 words)",

  "challengeBullets": [
    "Challenge point 1 - ONE sentence max",
    "Challenge point 2 - ONE sentence max",
    "Challenge point 3 - ONE sentence max",
    "Challenge point 4 - ONE sentence max"
  ],

  "solutionBullets": [
    "Solution point 1 - ONE sentence max",
    "Solution point 2 - ONE sentence max",
    "Solution point 3 - ONE sentence max",
    "Solution point 4 - ONE sentence max"
  ],

  "resultsBullets": [
    "Result with specific number - ONE sentence max",
    "Result with specific number - ONE sentence max",
    "Result with specific number - ONE sentence max"
  ],

  "metrics": [
    {{
      "label": "Short metric name (3-4 words)",
      "value": "The key number (e.g., '85%', '2.5x', '$2.3M')",
      "context": "Brief context (e.g., 'faster', 'increase', 'saved')"
    }}
  ],

  "technologies": ["Tech 1", "Tech 2", "Tech 3"],

  "testimonialShort": "One powerful sentence quote from client perspective",

  "roiStatement": "One sentence ROI summary with specific numbers"
}}

RULES:
1. Each bullet must be ONE SENTENCE - scannable at a glance
2. Use EXACT numbers from notes (don't make up metrics)
3. Maximum 4 bullets per section
4. Maximum 4 metrics (pick the most impactful)
5. Keep everything concise - this is for a VISUAL infographic, not a report

GOOD bullet: "Reduced deal evaluation from 3-4 weeks to same-day"
BAD bullet: "The platform significantly improved the efficiency of deal evaluation processes across all divisions, enabling teams to complete assessments much faster than before."
"""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": app.config['MODEL_CASE_STUDY_ANALYSIS'],
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional business analyst and expert storyteller creating compelling case studies. Return ONLY valid JSON with rich narrative content based on the provided notes. Use specific facts from notes while creating engaging business narratives."
                            },
                            {
                                "role": "user",
                                "content": analysis_prompt
                            }
                        ],
                        "temperature": 0.5,  # Balanced for accuracy + narrative creativity
                        "max_tokens": 6000  # Increased for full narrative content
                    },
                    timeout=90.0  # Increased timeout for longer generation
                )

            response_json = response.json()
            logger.info(f"Claude analysis response status: {response.status_code}")

            if response.status_code != 200:
                logger.error(f"Claude API error: {response_json}")
                raise Exception(f"Claude API returned status {response.status_code}")

            content = response_json['choices'][0]['message']['content']
            logger.info(f"Claude raw response: {content[:500]}...")

            # Extract JSON from response (handle markdown code blocks)
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', content, re.DOTALL)
            if json_match:
                structured_data = json.loads(json_match.group(1))
                logger.info("Extracted JSON from markdown code block")
            else:
                # Try to parse as raw JSON
                structured_data = json.loads(content)
                logger.info("Parsed response as raw JSON")

            logger.info(f"Claude extracted structured data: {json.dumps(structured_data, indent=2)}")
            return structured_data

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Claude response as JSON: {e}")
            logger.error(f"Content was: {content}")
            raise
        except Exception as e:
            logger.error(f"Claude analysis failed: {e}")
            raise

    async def _generate_complete_case_study(self, structured_data):
        """Step 2: Generate a SINGLE 8.5x11 infographic image using Gemini

        This creates ONE complete case study document as an image - ready to download and print.
        """

        # Extract bullet points from Claude's analysis
        client_name = structured_data.get('clientName', '')
        industry = structured_data.get('industry', '')
        title = structured_data.get('title', '')
        subtitle = structured_data.get('subtitle', '')

        # Get bullet points (new format)
        challenge_bullets = structured_data.get('challengeBullets', [])
        solution_bullets = structured_data.get('solutionBullets', [])
        results_bullets = structured_data.get('resultsBullets', [])
        metrics = structured_data.get('metrics', [])
        roi = structured_data.get('roiStatement', '')

        # Fallback to old format if needed
        if not challenge_bullets:
            pain_points = structured_data.get('painPoints', [])
            challenge_bullets = pain_points[:4] if pain_points else []

        if not solution_bullets:
            technologies = structured_data.get('technologies', [])
            solution_bullets = technologies[:4] if technologies else []

        # Format metrics for display
        metrics_display = []
        for m in metrics[:4]:
            label = m.get('label', '')
            value = m.get('value', m.get('improvement', ''))
            context = m.get('context', '')
            if label and value:
                metrics_display.append(f"{value} {label}")

        # Build the infographic prompt - balanced: includes branding but avoids over-detail
        # Format metrics concisely
        metrics_summary = ", ".join([f"{m.get('value','')} {m.get('label','')}" for m in metrics[:4]])

        infographic_prompt = f"""Create a one-page case study infographic.

BRANDING (use image_0 as logo reference):
- Header: Navy (#1e3a5f) bar with Calance logo on left, "CASE STUDY" badge on right
- Footer: Navy bar with "calance.com" left, "A GROUP COMPANY OF DTS CORPORATION, JAPAN" right
- Colors: Navy primary, Blue (#2563eb) accent, Orange (#f97316) highlights, white background

CONTENT:
Client: {client_name} | {industry}
Headline: {title}

Challenge: {challenge_bullets[0] if challenge_bullets else 'Manual processes'}
Solution: {solution_bullets[0] if solution_bullets else 'AI automation'}
Results: {results_bullets[0] if results_bullets else 'Significant improvement'}

Metrics: {metrics_summary}

STYLE: Professional with data visualizations for metrics."""

        try:
            # Load logo for multimodal request
            logo_base64 = load_logo_as_base64()
            if not logo_base64:
                logger.warning("Logo not available for image generation")
                return []

            logger.info("Generating single 8.5x11 infographic image...")

            request_payload = {
                "model": app.config['MODEL_CASE_STUDY_IMAGE'],
                "messages": [{
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": logo_base64}
                        },
                        {
                            "type": "text",
                            "text": infographic_prompt
                        }
                    ]
                }],
                "temperature": 0.7,
                "max_tokens": 1000,
                "modalities": ["image", "text"],
                "image_config": {
                    "aspect_ratio": "3:4"  # Close to 8.5x11 ratio
                }
            }

            logger.info(f"Request payload modalities: {request_payload.get('modalities')}")
            logger.info(f"Request model: {request_payload.get('model')}")
            logger.info(f"Request includes logo: {logo_base64[:50] if logo_base64 else 'NO LOGO'}")

            async with httpx.AsyncClient(timeout=90.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=request_payload
                )

                response_json = response.json()

                if response.status_code != 200:
                    logger.error(f"Gemini infographic generation failed: {response_json}")
                    return []

                # Log full response structure for debugging
                logger.info(f"Full response keys: {response_json.keys()}")

                # Extract image from response
                choice = response_json.get('choices', [{}])[0]
                logger.info(f"Choice keys: {choice.keys()}")

                # CHECK FOR ERROR FIRST!
                if 'error' in choice and choice['error']:
                    logger.error(f"OpenRouter returned error in choice: {choice['error']}")
                    logger.error(f"Full error details: {choice}")
                    return []

                message = choice.get('message', {})
                logger.info(f"Infographic response - message keys: {message.keys()}")

                ai_images = message.get('images', [])

                if ai_images:
                    logger.info(f"Gemini returned {len(ai_images)} infographic image(s)")
                    return [{
                        "id": "infographic_0",
                        "url": ai_images[0]["image_url"]["url"],
                        "type": "image/png",
                        "placement": "infographic",
                        "alt": f"Case study infographic for {client_name}"
                    }]
                else:
                    logger.warning("No infographic image returned from Gemini")
                    content = message.get('content', '')
                    if isinstance(content, str):
                        logger.info(f"Gemini text response (no image): {content[:300]}")
                    return []

        except Exception as e:
            logger.error(f"Infographic generation failed: {e}")
            return []

    async def generate_case_study(self, client_data):
        """Generate case study content using AI"""
        if not self.api_key:
            # Fallback to mock data if no API key
            return self._generate_mock_case_study(client_data)

        try:
            # Check if this is a refinement request
            is_refinement = 'feedback' in client_data
            feedback = client_data.get('feedback', '')

            # Determine model strategy
            if is_refinement:
                model = app.config['MODEL_CASE_STUDY_REFINEMENT']
            else:
                model = app.config['MODEL_CASE_STUDY_IMAGE']

            # Build prompt based on request type
            if is_refinement:
                prompt = self._build_refinement_prompt(client_data, feedback)
            else:
                prompt = self._build_generation_prompt(client_data)

            # Call OpenRouter API using httpx
            async with httpx.AsyncClient() as client:
                # Build messages - multimodal for image generation, text-only for refinement
                if "gemini" in model.lower() and not is_refinement:
                    # Multimodal message with logo for image generation
                    logo_base64 = load_logo_as_base64()

                    messages = [{
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {"url": logo_base64}
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }]
                    logger.info(f"Using multimodal message with logo for image generation")
                else:
                    # Text-only message for refinement
                    messages = [
                        {
                            "role": "system",
                            "content": "You are an expert case study writer for Calance. Return detailed case study content as a JSON object."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]

                api_params = {
                    "model": model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 4000,  # Increased for richer content + image generation
                }

                # Add image generation parameters ONLY for Gemini image models
                if "gemini" in model.lower() and not is_refinement:
                    api_params["modalities"] = ["image", "text"]
                    logger.info(f"Using model with image generation: {model}")
                    logger.info(f"Request params: {json.dumps({k: v for k, v in api_params.items() if k != 'messages'}, indent=2)}")

                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=api_params,
                    timeout=90.0  # Increased timeout for image generation
                )

            ai_response = response.json()
            logger.info(f"API Response keys: {list(ai_response.keys())}")

            # Log full response for debugging image generation
            logger.info(f"Full API response (first 1000 chars): {json.dumps(ai_response, indent=2)[:1000]}")

            ai_message = ai_response["choices"][0]["message"]
            ai_content = ai_message.get("content", "")

            # Extract images - handle both OpenRouter and Gemini formats
            ai_images = []

            # Try OpenRouter format first
            if "images" in ai_message:
                ai_images = ai_message["images"]
                logger.info(f"Found {len(ai_images)} images in OpenRouter format")

            # Try Gemini format (inlineData in parts)
            elif "parts" in ai_message:
                for part in ai_message["parts"]:
                    if "inlineData" in part:
                        # Convert Gemini format to OpenRouter format
                        ai_images.append({
                            "image_url": {
                                "url": f"data:{part['inlineData']['mimeType']};base64,{part['inlineData']['data']}"
                            }
                        })
                logger.info(f"Found {len(ai_images)} images in Gemini inlineData format")

            # Log for debugging
            if not ai_images:
                logger.warning("No images found in response")
                logger.info(f"Message structure: {list(ai_message.keys())}")
                logger.info(f"Full message content: {json.dumps(ai_message, indent=2)[:500]}")  # First 500 chars

            # Parse AI response into structured format
            return self._parse_ai_response(ai_content, client_data, is_refinement, ai_images)

        except Exception as e:
            logger.error(f"Error in AI generation: {str(e)}")
            # Fallback to mock data on error
            return self._generate_mock_case_study(client_data)

    def _build_generation_prompt(self, client_data):
        """Build prompt requesting BOTH a case study document image AND JSON content"""
        # Extract key information for visualization
        client_name = client_data.get('clientName', 'Client Name')
        industry = client_data.get('industry', 'Technology')
        challenge = client_data.get('challenge', 'Business challenge')
        solution = client_data.get('solution', 'Solution delivered')

        # Build brand guidelines JSON for the prompt
        brand_json = json.dumps(CALANCE_BRAND, indent=2)

        # Create hybrid prompt requesting image + JSON
        prompt = f"""You are creating a professional case study for Calance. I'm providing you with the Calance logo image and case study information.

YOUR TASK: Create a professional 8.5x11 case study DOCUMENT IMAGE that communicates the value of this project, AND provide the detailed text content as JSON.

==== CASE STUDY INFORMATION ====
Client: {client_name}
Industry: {industry}
Challenge: {challenge}
Solution: {solution}"""

        # Add optional fields
        if client_data.get('roi'):
            prompt += f"\nROI/Impact: {client_data['roi']}"
        if client_data.get('metrics'):
            prompt += "\nKey Metrics:"
            for metric in client_data.get('metrics', []):
                if metric.get('label'):
                    prompt += f"\n• {metric['label']}: {metric.get('before', '')} → {metric.get('after', '')} ({metric.get('improvement', 'Improved')})"

        prompt += f"""

==== PART 1: CREATE THE DOCUMENT IMAGE ====

Create an 8.5x11 image that looks like a professional business case study document. This should be a complete, polished document layout (NOT separate individual images).

BRAND GUIDELINES:
{brand_json}

LAYOUT REQUIREMENTS:
- Header: Place the Calance logo (provided) at top-left + tagline "{CALANCE_BRAND['company_info']['tagline']}" at top-right
- Title section: Create a compelling case study title in large navy text (use colors from brand guidelines)
- Three-column layout with visual hierarchy:
  * THE CHALLENGE (left column)
    - Key pain points in bullet format with icons
    - Highlight: "{challenge[:100]}..."
  * OUR SOLUTION (middle column)
    - Technical highlights in bullet format
    - Solution summary: "{solution[:100]}..."
  * RESULTS & IMPACT (right column)
    - Prominent financial metrics display
    - ROI visualization
- Highlight key metrics in large, eye-catching text
- Footer: Contact info - {CALANCE_BRAND['company_info']['website']} | {CALANCE_BRAND['company_info']['address']}

DESIGN STYLE:
- Clean, corporate, professional business document (NOT a flyer or poster)
- Use data visualization elements for numbers
- Color scheme: Navy (#1e3a5f), Blue (#2563eb), Orange (#f97316) accents
- Professional typography with strong visual hierarchy
- White space and clear section separation
- Similar quality to a professional consulting firm case study

CONTENT TO VISUALIZE:
- Title highlighting the transformation: "From [Challenge] to [Result]: How {client_name} Transformed {industry} Operations"
- Challenge section with 3-5 bullet points
- Solution section with 3-5 bullet points
- Results with prominent metrics (use realistic improvement numbers if not provided)

==== PART 2: PROVIDE JSON CONTENT ====

Also provide the complete case study content as a JSON object for text-based rendering.

SYNTHESIS REQUIREMENTS:
1. Create a compelling narrative arc (before/challenge → intervention/solution → transformation/results)
2. Add industry context and business impact depth
3. Emphasize business outcomes over technical details
4. Include quantified results (synthesize realistic ranges if needed)
5. Use professional, consultative tone

OUTPUT FORMAT: Return a JSON object with this structure:
{{
  "title": "Compelling headline leading with transformation/result",
  "subtitle": "Descriptive tagline about the business impact",
  "executiveSummary": "2-3 sentence hook that tells the transformation story",
  "challenge": "Enhanced narrative with industry context, business impact, and emotional resonance (3-4 rich paragraphs)",
  "solution": "How Calance uniquely addressed the challenge - approach, methodology, and why it worked (3-4 paragraphs)",
  "implementation": "Key milestones, timeline, and delivery approach (2-3 paragraphs)",
  "results": "Quantified business outcomes and ongoing impact (2-3 paragraphs)",
  "testimonial": "Client-perspective testimonial-ready quote",
  "roi": "Powerful ROI statement with specific numbers",
  "futureOutlook": "Ongoing partnership and strategic next phases (1-2 paragraphs)"
}}

Remember: Create BOTH the 8.5x11 document image AND the JSON content.
        """

        return prompt

    def _build_refinement_prompt(self, client_data, feedback):
        """Build prompt for refining existing case study"""
        prompt = f"""
Refine the following case study based on the user feedback:

Current case study:
Title: {client_data.get('title', '')}
Subtitle: {client_data.get('subtitle', '')}
Challenge: {client_data.get('challenge', '')}
Solution: {client_data.get('solution', '')}

User feedback: "{feedback}"

Please refine the case study to address the feedback while maintaining the core information. Focus on:
- Making the requested changes
- Enhancing the compelling aspects
- Maintaining professional tone
- Ensuring consistency with Calance branding
        """
        return prompt

    def _parse_ai_response(self, ai_response, client_data, is_refinement, ai_images=None):
        """Parse AI response into structured case study format - handles hybrid text+JSON responses"""
        # Try to parse JSON response from AI
        try:
            # The model may return JSON mixed with prose, so use regex to extract
            json_str = None

            # Try to find JSON in markdown code block first
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', ai_response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
                logger.info("Found JSON in markdown code block")
            else:
                # Try to find raw JSON object
                json_match = re.search(r'\{[^{]*"title"[^}]*\}', ai_response, re.DOTALL)
                if json_match:
                    # Expand to full JSON object (handle nested braces)
                    start_pos = json_match.start()
                    brace_count = 0
                    end_pos = start_pos
                    for i, char in enumerate(ai_response[start_pos:]):
                        if char == '{':
                            brace_count += 1
                        elif char == '}':
                            brace_count -= 1
                            if brace_count == 0:
                                end_pos = start_pos + i + 1
                                break
                    json_str = ai_response[start_pos:end_pos]
                    logger.info("Found raw JSON object in response")
                else:
                    # Fallback: treat entire response as JSON
                    json_str = ai_response.strip()
                    logger.info("Treating entire response as JSON")

            # Parse JSON
            ai_data = json.loads(json_str)

            # Use AI-generated content
            result = {
                "title": ai_data.get('title', f"How {client_data.get('clientName', 'Our Client')} Achieved Success"),
                "subtitle": ai_data.get('subtitle', 'A Calance Success Story'),
                "executiveSummary": ai_data.get('executiveSummary', ''),
                "challenge": ai_data.get('challenge', client_data.get('challenge', '')),
                "solution": ai_data.get('solution', client_data.get('solution', '')),
                "implementation": ai_data.get('implementation', ''),
                "results": ai_data.get('results', ''),
                "testimonial": ai_data.get('testimonial', 'Working with Calance transformed our operations.'),
                "roi": ai_data.get('roi', 'Significant ROI achieved within 6 months'),
                "futureOutlook": ai_data.get('futureOutlook', ''),
                "metrics": client_data.get('metrics', []),  # Keep user-provided metrics
                "images": []
            }

            logger.info("Successfully parsed AI-generated JSON content")

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse AI response as JSON: {str(e)}")
            logger.warning(f"AI Response: {ai_response[:500]}...")

            # Fallback: Use client data with minimal AI enhancement
            result = {
                "title": f"How {client_data.get('clientName', 'Our Client')} Transformed Their {client_data.get('industry', 'Business')} Operations",
                "subtitle": "A Calance Success Story",
                "executiveSummary": "",
                "challenge": client_data.get('challenge', ''),
                "solution": client_data.get('solution', ''),
                "implementation": "",
                "results": "",
                "testimonial": "Calance has been instrumental in transforming our operations.",
                "roi": client_data.get('roi', "Generated significant ROI within 6 months"),
                "futureOutlook": "",
                "metrics": client_data.get('metrics', []),
                "images": []
            }

        # Process AI-generated images
        if ai_images:
            placement_types = ["hero", "challenge", "solution", "metrics", "testimonial"]
            for idx, img in enumerate(ai_images):
                placement = placement_types[idx] if idx < len(placement_types) else "supplemental"
                result["images"].append({
                    "id": f"img_{idx}",
                    "url": img["image_url"]["url"],  # Base64 data URL
                    "type": "image/png",
                    "placement": placement,
                    "alt": f"Generated illustration {idx + 1}"
                })
            logger.info(f"Added {len(ai_images)} images to case study")

        return result

    def _generate_mock_case_study(self, client_data):
        """Generate mock case study data (fallback)"""
        is_refinement = 'feedback' in client_data
        feedback = client_data.get('feedback', '')

        if is_refinement:
            # Simulate refinement based on feedback keywords
            title = client_data.get('title', f"How {client_data['clientName']} Transformed Their {client_data['industry']} Operations")
            subtitle = client_data.get('subtitle', 'A Calance Success Story')

            if any(keyword in feedback.lower() for keyword in ['roi', 'metrics', 'impact']):
                title = f"How {client_data['clientName']} Achieved Exceptional ROI with Calance"
                subtitle = f"A {client_data['industry']} Transformation Story"

            if any(keyword in feedback.lower() for keyword in ['headline', 'prominent', 'stronger']):
                title = f"ROI-Driven Results: {client_data['clientName']} & Calance Partnership"

            return {
                "title": title,
                "subtitle": subtitle,
                "challenge": client_data['challenge'],
                "solution": client_data['solution'],
                "metrics": client_data.get('metrics', []),
                "testimonial": "Calance has been instrumental in transforming our operations.",
                "roi": "Achieved exceptional ROI and measurable business impact within 6 months"
            }
        else:
            # Original generation
            return {
                "title": f"How {client_data['clientName']} Transformed Their {client_data['industry']} Operations",
                "subtitle": "A Calance Success Story",
                "challenge": client_data['challenge'],
                "solution": client_data['solution'],
                "metrics": client_data.get('metrics', []),
                "testimonial": "Calance has been instrumental in transforming our operations.",
                "roi": f"Generated {client_data.get('expectedOutcomes', ['significant ROI'])[0] if client_data.get('expectedOutcomes') else 'significant ROI'} within 6 months"
            }

    async def generate_presentation(self, presentation_data):
        """Generate presentation content using AI"""
        if not self.api_key:
            return self._generate_mock_presentation(presentation_data)

        try:
            # Determine model strategy
            model = app.config['MODEL_PRESENTATION_GENERATION']

            # Build prompt for presentation generation
            prompt = self._build_presentation_prompt(presentation_data)

            # Call OpenRouter API using httpx
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an expert presentation designer for Calance. Create compelling, professional presentations that effectively communicate business ideas. Generate slides that are visually balanced, with clear titles and concise bullet points. Generate relevant images for slides that need visual impact."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "modalities": ["text", "image"],
                        "temperature": 0.7,
                        "max_tokens": 2000,
                        "image_config": {
                            "aspect_ratio": "16:9"
                        }
                    },
                    timeout=60.0
                )

            ai_response = response.json()
            ai_message = ai_response["choices"][0]["message"]
            ai_content = ai_message.get("content", "")
            ai_images = ai_message.get("images", [])

            # Parse AI response into structured presentation format
            return self._parse_presentation_response(ai_content, presentation_data, ai_images)

        except Exception as e:
            logger.error(f"Error in presentation generation: {str(e)}")
            return self._generate_mock_presentation(presentation_data)

    def _build_presentation_prompt(self, presentation_data):
        """Build prompt for presentation generation with image support"""
        duration = int(presentation_data.get('duration', '30'))
        key_points = [kp.get('text', '') for kp in presentation_data.get('keyPoints', []) if kp.get('text')]

        # Calculate number of slides based on duration
        num_slides = max(5, min(12, duration // 3))  # 1 slide per 3 minutes, min 5, max 12

        prompt = f"""You are a professional presentation designer for Calance, a premier technology consulting firm.
Create a visually impactful, professional presentation that will impress the target audience.

Presentation Details:
- Title: {presentation_data.get('title', 'Untitled Presentation')}
- Objective: {presentation_data.get('objective', '')}
- Target Audience: {presentation_data.get('audience', '')}
- Duration: {duration} minutes
- Key Talking Points:
{chr(10).join(f"- {point}" for point in key_points)}

Instructions:
1. Generate a complete, professional presentation with approximately {num_slides} slides
2. Create visually striking images for key slides using the image generation capability
3. Design a modern, business-appropriate layout with Calance's brand (navy blue, orange, white)
4. Focus on clarity, impact, and professional polish
5. Each slide should tell a story and build upon the previous one

Required Slides:
1. Title Slide: Powerful headline with a professional background image
2. Agenda: Overview of the presentation structure
3-8. Content Slides: Each covering key talking points with relevant visuals
9. Solution/Calance Value Proposition: How Calance solves the problem
10. Results/ROI: Quantifiable outcomes and benefits
11. Next Steps/Call to Action: Clear next steps for the audience

For each slide that needs a visual element, generate an appropriate image that enhances the message.
Use professional business imagery, technology visuals, charts, and diagrams that support the content.

OUTPUT FORMAT: Return ONLY a JSON object with this structure (no markdown, no explanations):
{{
  "slides": [
    {{
      "type": "title",
      "title": "Powerful presentation title",
      "subtitle": "Compelling subtitle"
    }},
    {{
      "type": "content",
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }},
    ...more slides...
  ]
}}

Generate approximately {num_slides} slides total. Each content slide should have 3-5 concise bullet points.
        """
        return prompt

    def _parse_presentation_response(self, ai_content, presentation_data, ai_images=None):
        """Parse AI response into structured presentation format with images"""
        # Try to parse JSON response from AI
        try:
            # Clean response - remove markdown code blocks if present
            cleaned_response = ai_content.strip()
            if cleaned_response.startswith('```'):
                lines = cleaned_response.split('\n')
                cleaned_response = '\n'.join(lines[1:-1] if len(lines) > 2 else lines)

            # Additional cleaning for truncated responses
            # Look for incomplete JSON and attempt to fix common issues
            if not cleaned_response.endswith('}') and not cleaned_response.endswith(']'):
                logger.warning("AI response appears to be truncated, attempting repair...")
                # Find the last complete JSON structure
                last_brace = cleaned_response.rfind('}')
                last_bracket = cleaned_response.rfind(']')

                if last_brace > last_bracket:
                    # Truncated in object, cut to last complete object
                    cleaned_response = cleaned_response[:last_brace + 1]
                elif last_bracket > last_brace:
                    # Truncated in array, cut to last complete array
                    cleaned_response = cleaned_response[:last_bracket + 1]

                # Ensure proper JSON closure
                if cleaned_response.count('{') > cleaned_response.count('}'):
                    cleaned_response += '}'
                if cleaned_response.count('[') > cleaned_response.count(']'):
                    cleaned_response += ']'

            # Parse JSON
            ai_data = json.loads(cleaned_response)
            slides = ai_data.get('slides', [])

            logger.info(f"Successfully parsed {len(slides)} slides from AI JSON response")

            # If no slides parsed, use fallback
            if not slides:
                logger.warning("No slides in AI response, using mock presentation")
                return self._generate_mock_presentation(presentation_data)

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse presentation AI response as JSON: {str(e)}")
            logger.warning(f"AI Response length: {len(ai_content)} characters")
            logger.warning(f"AI Response preview: {ai_content[:300]}...")
            # Fallback to mock
            return self._generate_mock_presentation(presentation_data)

        # Process AI-generated images and distribute to slides
        images = []
        if ai_images:
            for idx, img in enumerate(ai_images):
                images.append({
                    "id": f"slide_img_{idx}",
                    "url": img["image_url"]["url"],  # Base64 data URL
                    "type": "image/png",
                    "slideIndex": min(idx, len(slides) - 1),  # Assign to slide
                    "alt": f"Slide {idx + 1} visual"
                })
            logger.info(f"Added {len(ai_images)} images to presentation")

        # Assign images to slides
        for img in images:
            slide_idx = img['slideIndex']
            if slide_idx < len(slides):
                if 'image' not in slides[slide_idx]:
                    slides[slide_idx]['image'] = img

        return {
            "title": presentation_data.get('title', 'Untitled Presentation'),
            "objective": presentation_data.get('objective', ''),
            "audience": presentation_data.get('audience', ''),
            "duration": presentation_data.get('duration', '30'),
            "slides": slides,
            "images": images  # Include images array for reference
        }

    def _generate_mock_presentation(self, presentation_data):
        """Generate mock presentation data (fallback)"""
        key_points = [kp.get('text', '') for kp in presentation_data.get('keyPoints', []) if kp.get('text')]

        slides = [
            {
                "type": "title",
                "title": presentation_data.get('title', 'Untitled Presentation'),
                "subtitle": presentation_data.get('objective', '')
            },
            {
                "type": "content",
                "title": "Overview",
                "content": [
                    f"Duration: {presentation_data.get('duration', '30')} minutes",
                    f"Audience: {presentation_data.get('audience', '').title()}",
                    "Objectives and key takeaways"
                ]
            }
        ]

        # Add content slides for key points
        for i, point in enumerate(key_points[:4], 1):  # Max 4 key point slides
            slides.append({
                "type": "content",
                "title": f"Key Point {i}",
                "content": [point, "Supporting details and examples", "Impact and benefits"]
            })

        # Add summary slide
        slides.append({
            "type": "content",
            "title": "Summary & Next Steps",
            "content": [
                "Key takeaways",
                "Call to action",
                "Contact information"
            ]
        })

        return {
            "title": presentation_data.get('title', 'Untitled Presentation'),
            "objective": presentation_data.get('objective', ''),
            "audience": presentation_data.get('audience', ''),
            "duration": presentation_data.get('duration', '30'),
            "slides": slides
        }

    def _generate_slides_html(self, slides):
        """Generate HTML for presentation slides"""
        slides_html = ""

        for i, slide in enumerate(slides):
            slide_type = slide.get('type', 'content')
            slide_title = slide.get('title', '')
            slide_content = slide.get('content', [])

            if isinstance(slide_content, str):
                slide_content = [slide_content]

            slides_html += f"""
        <div class="slide {'active' if i == 0 else ''}" data-type="{slide_type}">
            <div class="slide-header">
                <div class="presentation-title">Calance Presentation</div>
                <div class="slide-number">{i + 1}/{len(slides)}</div>
            </div>
            <div class="slide-content">
                <h1 class="slide-title">{slide_title}</h1>
                {f'<p class="slide-subtitle">{slide.get("subtitle", "")}</p>' if slide.get('subtitle') else ''}
                {f'<div class="slide-body"><ul class="bullet-points">' + ''.join(f'<li>{point}</li>' for point in slide_content) + '</ul></div>' if slide_content else ''}
            </div>
        </div>
            """

        return slides_html

    async def generate_recruiting_artifact(self, recruiting_data):
        """Generate recruiting artifacts using AI"""
        if not self.api_key:
            return self._generate_mock_recruiting(recruiting_data)

        try:
            tool = recruiting_data.get('tool', '')
            input_text = recruiting_data.get('input', '')
            prompt = recruiting_data.get('prompt', '')

            if not input_text:
                return {"content": "Please provide input text to generate content."}

            # Build the full prompt
            full_prompt = f"""
You are an expert recruiting professional working for Calance. Generate high-quality recruiting content based on the following:

Tool: {tool}
Input: {input_text}
Instructions: {prompt}

Please generate professional, effective content that follows recruiting best practices. Be specific, actionable, and tailored to the recruiting context.
            """

            # Use configured model for recruiting tools
            model = app.config['MODEL_RECRUITING_GENERATION']

            # Call OpenRouter API using httpx
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an expert recruiting specialist with deep knowledge of talent acquisition, candidate engagement, and recruitment best practices."
                            },
                            {
                                "role": "user",
                                "content": full_prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1500,
                    },
                    timeout=60.0
                )

            ai_response = response.json()
            content = ai_response["choices"][0]["message"]["content"]

            return {
                "type": tool,
                "content": content.strip()
            }

        except Exception as e:
            logger.error(f"Error in recruiting generation: {str(e)}")
            return self._generate_mock_recruiting(recruiting_data)

    def _generate_mock_recruiting(self, recruiting_data):
        """Generate mock recruiting content (fallback)"""
        tool = recruiting_data.get('tool', '')
        input_text = recruiting_data.get('input', '')

        mock_responses = {
            'jd-enhancer': f"""
ENHANCED JOB DESCRIPTION

Position Overview
We are seeking a talented professional to join our dynamic team. This role offers an exciting opportunity to make a significant impact while growing your career.

What You'll Do
• Drive key initiatives and deliver exceptional results
• Collaborate with cross-functional teams
• Contribute to innovative solutions
• Develop and implement best practices

What We're Looking For
• Relevant experience and proven track record
• Strong communication and interpersonal skills
• Problem-solving mindset and attention to detail
• Passion for excellence and continuous learning

What We Offer
• Competitive compensation and benefits
• Flexible work environment
• Professional development opportunities
• Collaborative and inclusive culture

We are an equal opportunity employer and value diversity in our workplace.
            """.strip(),

            'sourcing-email': f"""
Subject: Exciting Opportunity at [Company Name]

Hi [Candidate Name],

I hope this message finds you well. I came across your profile and was impressed by your experience in [relevant field/industry].

I'm reaching out because we have an exciting opportunity that aligns well with your background. Our team is looking for a talented professional to join us, and your skills and experience caught my attention.

Would you be open to a brief conversation next week to learn more about this role and how your expertise could contribute to our team's success?

Best regards,
[Your Name]
[Your Title]
Calance
            """.strip(),

            'boolean-search': f"""
BOOLEAN SEARCH STRINGS

LinkedIn:
({input_text}) AND (remote OR "work from home") -recruiter -agency

Job Boards:
("{input_text}" OR related keywords) AND (senior OR lead OR principal) NOT (junior OR entry)

Additional Modifiers:
Filter by: Last 30 days, English fluency, Relevant locations
            """.strip(),

            'candidate-submittal': f"""
CANDIDATE SUBMITTAL SUMMARY

Candidate: [Candidate Name]
Position: [Position Title]
Rate: [Rate/Salary]

Summary:
[Input text suggests this candidate brings valuable experience and skills relevant to the role.]

Key Qualifications:
• Strong technical skills and domain expertise
• Proven track record of success
• Excellent communication and collaboration abilities
• Alignment with company values and culture

Recommendation:
Highly recommended for advancement based on qualifications, experience, and potential cultural fit.
            """.strip(),

            'interview-prep': f"""
INTERVIEW PREPARATION

Dear [Candidate Name],

Thank you for your interest in the [Position Title] position at Calance. We're excited to move forward with your interview process!

Interview Details:
• Date: [Date]
• Time: [Time]
• Duration: [Duration]
• Format: [Format - e.g., Video call, In-person]
• Interviewer(s): [Interviewer names/roles]

What to Prepare:
• Review your experience related to [key areas]
• Be ready to discuss [specific topics]
• Prepare questions about the role and team

Technical Requirements:
• [Any technical setup needed]

What to Expect:
• [Interview format and flow]
• [Types of questions]
• [Next steps in process]

We look forward to speaking with you!

Best regards,
The Calance Team
            """.strip(),

            'mock-interview': f"""
INTERVIEW QUESTIONS

Opening Questions:
1. Tell me about your experience with [key skill from input]
2. What interests you about this particular role?
3. Describe a challenging project you've worked on recently.

Technical/Behavioral Questions:
1. How do you approach [relevant challenge]?
2. Walk me through your process for [key responsibility]
3. Describe a time you had to [relevant scenario]
4. How do you stay updated with [industry/technology] trends?

Situational Questions:
1. How would you handle [hypothetical situation]?
2. What would be your first 30-60-90 day plan in this role?
3. How do you prioritize multiple competing deadlines?

Closing Questions:
1. What questions do you have for us?
2. What are your career aspirations?
3. When could you potentially start if offered the position?

Assessment Focus:
Based on the input provided, focus on evaluating:
- Technical proficiency in [key areas]
- Problem-solving abilities
- Communication skills
- Cultural fit
            """.strip(),

            'skills-extractor': f"""
EXTRACTED INFORMATION

Skills Identified:
• [Extract and categorize technical skills from input]
• [Extract soft skills]
• [Extract domain knowledge]

Job Titles:
• [Identify relevant job titles]
• [Seniority levels]
• [Alternative titles]

Locations:
• [Geographic preferences if mentioned]
• [Remote/hybrid preferences]

Experience Level:
• [Years of experience if indicated]
• [Level of seniority]

Key Highlights:
• [Notable achievements or qualifications]
• [Certifications or education]
• [Specialized expertise]
            """.strip(),

            'executive-summary': f"""
EXECUTIVE SUMMARY

Candidate Overview:
Based on the provided information, this candidate demonstrates strong qualifications for the role.

Key Strengths:
• [Summarize top 3-5 strengths from input]
• [Highlight relevant experience]
• [Notable achievements]

Experience & Expertise:
• [Years of relevant experience]
• [Key areas of expertise]
• [Industry knowledge]

Value Proposition:
This candidate brings [specific value] to the role and would be able to [key contributions].

Recommendation:
Recommended for consideration based on [specific reasons], with potential to excel in [areas].

Next Steps:
Proceed with [recommended next steps in process].
            """.strip()
        }

        content = mock_responses.get(tool, f"Generated content for {tool} based on:\n\n{input_text}")

        return {
            "type": tool,
            "content": content
        }

# Initialize AI service
ai_service = AIService()

# In-memory storage for version history (in production, use Redis or database)
version_history = {}

# ============================================
# Image Processing Utilities
# ============================================

def base64_to_image_buffer(data_url):
    """Convert base64 data URL to image buffer for ReportLab"""
    try:
        # Extract base64 data from data URL
        if ',' in data_url:
            header, base64_data = data_url.split(",", 1)
        else:
            base64_data = data_url

        # Decode base64
        img_bytes = base64.b64decode(base64_data)

        # Convert to PIL Image
        pil_img = PILImage.open(io.BytesIO(img_bytes))

        # Convert to RGB if necessary (removes alpha channel for PDF compatibility)
        if pil_img.mode in ('RGBA', 'LA', 'P'):
            pil_img = pil_img.convert('RGB')

        # Save to buffer
        img_buffer = io.BytesIO()
        pil_img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        return img_buffer
    except Exception as e:
        logger.error(f"Error converting base64 to image: {str(e)}")
        return None

def get_generation_id():
    """Generate unique generation ID"""
    return str(uuid.uuid4())

def save_version(generation_id, case_study_data):
    """Save case study version for undo functionality"""
    if generation_id not in version_history:
        version_history[generation_id] = []

    # Keep only last 3 versions as specified in requirements
    version_history[generation_id].append({
        'data': case_study_data,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

    if len(version_history[generation_id]) > 3:
        version_history[generation_id].pop(0)  # Remove oldest

def get_previous_version(generation_id):
    """Get previous version for undo functionality"""
    if generation_id in version_history and len(version_history[generation_id]) >= 2:
        return version_history[generation_id][-2]['data']
    return None

# ============================================
# API Routes
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/generate/case-study', methods=['POST'])
def generate_case_study():
    """Generate case study based on input data - uses two-step AI process for freeform input"""
    try:
        data = request.get_json()

        # TWO-STEP ARCHITECTURE for freeform input
        if 'rawNotes' in data and data.get('inputMode') == 'freeform':
            logger.info("Processing FreeForm case study with TWO-STEP AI architecture")
            logger.info(f"Raw notes length: {len(data.get('rawNotes', ''))} characters")

            try:
                # STEP 1: Claude Sonnet 4.5 analyzes and structures content
                logger.info("STEP 1: Starting Claude analysis...")
                structured_data = asyncio.run(ai_service._analyze_freeform_content(
                    raw_notes=data.get('rawNotes', ''),
                    client_name=data.get('clientName', ''),
                    industry=data.get('industry', '')
                ))
                logger.info(f"STEP 1 Complete: Extracted client={structured_data.get('clientName')}, "
                           f"metrics={len(structured_data.get('metrics', []))}")

                # STEP 2: Generate complete multi-page case study with Gemini
                logger.info("STEP 2: Calling Gemini to generate complete case study document...")

                # Generate complete multi-page case study using Gemini
                images = asyncio.run(ai_service._generate_complete_case_study(structured_data))

                # Return bullet points + infographic image
                result = {
                    "client_name": structured_data.get('clientName', ''),
                    "industry": structured_data.get('industry', ''),
                    "title": structured_data.get('title', ''),
                    "subtitle": structured_data.get('subtitle', ''),
                    # Bullet points for display
                    "challengeBullets": structured_data.get('challengeBullets', []),
                    "solutionBullets": structured_data.get('solutionBullets', []),
                    "resultsBullets": structured_data.get('resultsBullets', []),
                    "metrics": structured_data.get('metrics', []),
                    "technologies": structured_data.get('technologies', []),
                    "testimonial": structured_data.get('testimonialShort', ''),
                    "roi": structured_data.get('roiStatement', ''),
                    # The infographic image - this is the main artifact
                    "images": images,
                    "infographic": images[0] if images else None
                }

                logger.info(f"STEP 2 Complete: Generated infographic image (success={len(images) > 0})")

            except Exception as e:
                logger.error(f"Two-step generation failed: {e}")
                logger.error(f"Error details: {str(e)}")
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                return jsonify({"error": f"Two-step generation failed: {str(e)}"}), 500

        else:
            # Structured mode - validate required fields and use single-step process
            logger.info("Processing Structured case study input (single-step)")
            required_fields = ['clientName', 'industry', 'challenge', 'solution']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

            # Generate case study using AI service (async call)
            result = asyncio.run(ai_service.generate_case_study(data))

        # Generate or use existing generation_id for tracking
        generation_id = data.get('generation_id', get_generation_id())

        # Save version for undo functionality
        save_version(generation_id, result)

        # Add generation_id to response
        result['generation_id'] = generation_id

        return jsonify({
            "success": True,
            "data": result,
            "generation_id": generation_id
        })

    except Exception as e:
        logger.error(f"Error generating case study: {str(e)}")
        return jsonify({"error": "Failed to generate case study"}), 500

@app.route('/api/presentation/generate', methods=['POST'])
def generate_presentation():
    """Generate presentation based on input data"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['title', 'objective', 'audience', 'duration', 'keyPoints']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Generate presentation using AI service (async call)
        result = asyncio.run(ai_service.generate_presentation(data))

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        logger.error(f"Error generating presentation: {str(e)}")
        return jsonify({"error": "Failed to generate presentation"}), 500

@app.route('/api/presentation/refine', methods=['POST'])
def refine_presentation():
    """Refine a specific slide based on feedback"""
    try:
        data = request.get_json()
        presentation = data.get('presentation', {})
        slide_index = data.get('slideIndex', 0)
        feedback = data.get('feedback', '')

        if not presentation or not presentation.get('slides'):
            return jsonify({"error": "No presentation data provided"}), 400

        if slide_index < 0 or slide_index >= len(presentation['slides']):
            return jsonify({"error": f"Invalid slide index: {slide_index}"}), 400

        # TODO: Implement AI-based slide refinement
        # For now, return the presentation unchanged
        refined_presentation = presentation.copy()

        return jsonify({
            "success": True,
            "data": refined_presentation
        })

    except Exception as e:
        logger.error(f"Error refining presentation: {str(e)}")
        return jsonify({"error": "Failed to refine presentation"}), 500

@app.route('/api/recruiting/generate', methods=['POST'])
def generate_recruiting_artifact():
    """Generate recruiting artifact based on input data"""
    try:
        data = request.get_json()

        logger.info(f"Received recruiting request: {data}")

        # Validate required fields
        if 'tool' not in data or 'input' not in data:
            logger.error(f"Missing required fields. Data: {data}")
            return jsonify({"error": "Missing required fields: tool and input"}), 400

        # Generate recruiting artifact using AI service (async call)
        result = asyncio.run(ai_service.generate_recruiting_artifact(data))

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        logger.error(f"Error generating recruiting artifact: {str(e)}")
        return jsonify({"error": "Failed to generate recruiting artifact"}), 500

@app.route('/api/export/pdf', methods=['POST'])
def export_pdf():
    """Export content as PDF - prioritizes infographic image for clean, scannable output

    Two modes:
    1. INFOGRAPHIC MODE: If hero image is an infographic (from unified approach), show ONLY the infographic
       - Clean, single-page output that's easy to scan
       - No walls of text, just the visual document
    2. LEGACY MODE: If no infographic or multiple separate images, fall back to text-based layout
    """
    try:
        data = request.get_json()
        case_study_data = data.get('caseStudy', {})
        images = case_study_data.get('images', [])

        # Create PDF in memory (Letter size, 8.5x11)
        buffer = io.BytesIO()

        # Check if we have an infographic image (from unified approach)
        # Infographic mode: single hero image that IS the complete document
        hero_img = next((img for img in images if img.get('placement') == 'hero'), None)
        has_infographic = hero_img and hero_img.get('url') and len(images) == 1

        # Also check for infographic ID pattern (from new unified approach)
        if hero_img and hero_img.get('id', '').startswith('infographic_'):
            has_infographic = True

        if has_infographic:
            # INFOGRAPHIC MODE: Output just the infographic image with minimal margins
            logger.info("PDF Export: Using INFOGRAPHIC mode (single visual document)")

            doc = SimpleDocTemplate(
                buffer,
                pagesize=letter,
                rightMargin=0.25*inch,
                leftMargin=0.25*inch,
                topMargin=0.25*inch,
                bottomMargin=0.25*inch
            )

            story = []

            # Add the infographic image at full page size
            img_buffer = base64_to_image_buffer(hero_img['url'])
            if img_buffer:
                try:
                    # Calculate dimensions to fit 8.5x11 with minimal margins (8x10.5 usable)
                    rl_img = RLImage(img_buffer, width=8*inch, height=10.5*inch)
                    story.append(rl_img)
                    logger.info("Added full-page infographic to PDF")
                except Exception as e:
                    logger.error(f"Error adding infographic to PDF: {str(e)}")
                    # Fall back to legacy mode
                    has_infographic = False

            if has_infographic and story:
                doc.build(story)

                # Get PDF bytes and encode
                pdf_bytes = buffer.getvalue()
                buffer.close()

                pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
                client_name = case_study_data.get('client_name', case_study_data.get('clientName', 'export'))

                return jsonify({
                    "success": True,
                    "pdf_data": pdf_base64,
                    "filename": f"case-study-{client_name.lower().replace(' ', '-')}.pdf"
                })

        # LEGACY MODE: Full text-based layout with embedded images
        logger.info("PDF Export: Using LEGACY mode (text + images)")

        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )

        # Define styles matching draft preview
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#1e3a5f'),
            spaceAfter=8,
            fontName='Helvetica-Bold',
            leading=26
        )

        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#6b7280'),
            spaceAfter=20,
            leading=16
        )

        heading_style = ParagraphStyle(
            'HeadingStyle',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e3a5f'),
            spaceAfter=10,
            spaceBefore=16,
            fontName='Helvetica-Bold'
        )

        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#374151'),
            leading=14,
            spaceAfter=12
        )

        story = []

        # Page Header - Calance Branding
        header_data = [['CALANCE', 'CASE STUDY']]
        header_table = Table(header_data, colWidths=[3*inch, 3.5*inch])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#1e3a5f')),
            ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#1e3a5f')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, 0), 12),
            ('RIGHTPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 0.3*inch))

        # Hero Image (full width) - only if not infographic mode
        if hero_img and hero_img.get('url'):
            img_buffer = base64_to_image_buffer(hero_img['url'])
            if img_buffer:
                try:
                    rl_img = RLImage(img_buffer, width=6.5*inch, height=3.66*inch)
                    story.append(rl_img)
                    story.append(Spacer(1, 0.25*inch))
                    logger.info("Added hero image to PDF")
                except Exception as e:
                    logger.error(f"Error adding hero image to PDF: {str(e)}")

        # Title and Subtitle
        if case_study_data.get('title'):
            story.append(Paragraph(case_study_data['title'], title_style))

        if case_study_data.get('subtitle'):
            story.append(Paragraph(case_study_data['subtitle'], subtitle_style))

        # Executive Summary (if available)
        if case_study_data.get('executiveSummary'):
            story.append(Paragraph("Executive Summary", heading_style))
            story.append(Paragraph(case_study_data['executiveSummary'], body_style))

        # Challenge Section
        if case_study_data.get('challenge'):
            story.append(Paragraph("The Challenge", heading_style))
            story.append(Paragraph(case_study_data['challenge'], body_style))

        # Solution Section
        if case_study_data.get('solution'):
            story.append(Paragraph("Our Solution", heading_style))
            story.append(Paragraph(case_study_data['solution'], body_style))

        # Implementation (if available)
        if case_study_data.get('implementation'):
            story.append(Paragraph("Implementation", heading_style))

            # Timeline Image (if available)
            timeline_img = next((img for img in images if img.get('placement') == 'timeline'), None)
            if timeline_img and timeline_img.get('url'):
                img_buffer = base64_to_image_buffer(timeline_img['url'])
                if img_buffer:
                    try:
                        rl_img = RLImage(img_buffer, width=6.5*inch, height=2.44*inch)
                        story.append(rl_img)
                        story.append(Spacer(1, 0.15*inch))
                        logger.info("Added timeline image to PDF")
                    except Exception as e:
                        logger.error(f"Error adding timeline image to PDF: {str(e)}")

            story.append(Paragraph(case_study_data['implementation'], body_style))

        # Results & Impact
        if case_study_data.get('results'):
            story.append(Paragraph("Results & Impact", heading_style))
            story.append(Paragraph(case_study_data['results'], body_style))

        # Metrics Dashboard Image (visual representation)
        metrics_img = next((img for img in images if img.get('placement') == 'metrics'), None)
        if metrics_img and metrics_img.get('url'):
            story.append(Paragraph("Key Metrics", heading_style))
            img_buffer = base64_to_image_buffer(metrics_img['url'])
            if img_buffer:
                try:
                    rl_img = RLImage(img_buffer, width=6.5*inch, height=3.66*inch)
                    story.append(rl_img)
                    story.append(Spacer(1, 0.15*inch))
                    logger.info("Added metrics dashboard image to PDF")
                except Exception as e:
                    logger.error(f"Error adding metrics image to PDF: {str(e)}")

        # ROI Statement
        if case_study_data.get('roi'):
            story.append(Paragraph("ROI", heading_style))
            story.append(Paragraph(case_study_data['roi'], body_style))

        # Testimonial (if available)
        if case_study_data.get('testimonial'):
            story.append(Paragraph("Client Testimonial", heading_style))
            # Create a styled testimonial box
            testimonial_style = ParagraphStyle(
                'TestimonialStyle',
                parent=body_style,
                leftIndent=20,
                rightIndent=20,
                fontName='Helvetica-Oblique',
                textColor=colors.HexColor('#1e3a5f')
            )
            story.append(Paragraph(f'"{case_study_data["testimonial"]}"', testimonial_style))

        # Future Outlook (if available)
        if case_study_data.get('futureOutlook'):
            story.append(Paragraph("What's Next", heading_style))
            story.append(Paragraph(case_study_data['futureOutlook'], body_style))

        # Build PDF
        doc.build(story)

        # Get PDF bytes and encode
        pdf_bytes = buffer.getvalue()
        buffer.close()

        # Create base64 encoded PDF for frontend download
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        client_name = case_study_data.get('client_name', case_study_data.get('clientName', 'export'))

        return jsonify({
            "success": True,
            "pdf_data": pdf_base64,
            "filename": f"case-study-{client_name.lower().replace(' ', '-')}.pdf"
        })

    except Exception as e:
        logger.error(f"Error exporting PDF: {str(e)}")
        return jsonify({"error": "Failed to export PDF"}), 500

@app.route('/api/export/html', methods=['POST'])
def export_html():
    """Export content as HTML"""
    try:
        data = request.get_json()
        content = data.get('content', '')

        # Generate HTML template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Calance Case Study</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .header {{ border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; }}
                .content {{ margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Calance Case Study</h1>
            </div>
            <div class="content">
                {content}
            </div>
        </body>
        </html>
        """

        return jsonify({
            "success": True,
            "content": html_content
        })

    except Exception as e:
        logger.error(f"Error exporting HTML: {str(e)}")
        return jsonify({"error": "Failed to export HTML"}), 500

@app.route('/api/presentation/export/html', methods=['POST'])
def export_presentation_html():
    """Export presentation as HTML with keyboard navigation"""
    try:
        data = request.get_json()
        presentation = data.get('presentation', {})

        if not presentation or not presentation.get('slides'):
            return jsonify({"error": "No presentation data provided"}), 400

        # Helper function to format slide content
        def format_slides_html(slides):
            slides_html = ""
            for i, slide in enumerate(slides):
                slide_type = slide.get('type', 'content')
                slide_title = slide.get('title', '')
                slide_content = slide.get('content', [])

                if isinstance(slide_content, str):
                    slide_content = [slide_content]

                slides_html += f"""
        <div class="slide {'active' if i == 0 else ''}" data-type="{slide_type}">
            <div class="slide-header">
                <div class="presentation-title">Calance Presentation</div>
                <div class="slide-number">{i + 1}/{len(slides)}</div>
            </div>
            <div class="slide-content">
                <h1 class="slide-title">{slide_title}</h1>
                {f'<p class="slide-subtitle">{slide.get("subtitle", "")}</p>' if slide.get('subtitle') else ''}
                {f'<div class="slide-body"><ul class="bullet-points">' + ''.join(f'<li>{point}</li>' for point in slide_content) + '</ul></div>' if slide_content else ''}
            </div>
        </div>
                """
            return slides_html

        # Generate HTML with embedded CSS and JavaScript
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{presentation.get('title', 'Presentation')}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            overflow: hidden;
        }}

        .presentation-container {{
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .slide {{
            width: 90vw;
            max-width: 1200px;
            height: 90vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 60px;
            display: none;
            flex-direction: column;
        }}

        .slide.active {{
            display: flex;
        }}

        .slide-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #dc2626;
            margin-bottom: 40px;
        }}

        .presentation-title {{
            background: #1e3a5f;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
        }}

        .slide-number {{
            background: #1e3a5f;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
        }}

        .slide-content {{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }}

        .slide-title {{
            color: #1e3a5f;
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 30px;
            text-align: center;
        }}

        .slide-subtitle {{
            color: #666;
            font-size: 24px;
            text-align: center;
            margin-bottom: 40px;
        }}

        .slide-body {{
            color: #333;
            font-size: 20px;
            line-height: 1.6;
        }}

        .bullet-points {{
            list-style: none;
        }}

        .bullet-points li {{
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
        }}

        .bullet-points li::before {{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #f97316;
            border-radius: 50%;
            margin-right: 16px;
            margin-top: 12px;
            flex-shrink: 0;
        }}

        .navigation-hint {{
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        }}

        .navigation-hint.show {{
            opacity: 1;
        }}

        /* Title slide specific styles */
        .slide[data-type="title"] .slide-content {{
            justify-content: center;
            text-align: center;
        }}

        .slide[data-type="title"] .slide-title {{
            font-size: 64px;
            margin-bottom: 20px;
        }}

        .slide[data-type="title"] .slide-subtitle {{
            font-size: 28px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="presentation-container">
        <!-- Slides will be generated here -->
        {format_slides_html(presentation.get('slides', []))}
    </div>

    <div class="navigation-hint" id="navigationHint">
        Use arrow keys to navigate • Space to go forward • ESC to exit
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const navigationHint = document.getElementById('navigationHint');

        function showSlide(index) {{
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;

            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            currentSlide = index;
        }}

        function nextSlide() {{
            showSlide(currentSlide + 1);
        }}

        function previousSlide() {{
            showSlide(currentSlide - 1);
        }}

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {{
            switch(e.key) {{
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    showSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    showSlide(totalSlides - 1);
                    break;
                case 'Escape':
                    if (confirm('Exit presentation?')) {{
                        window.close();
                    }}
                    break;
            }}
        }});

        // Show navigation hint on load and keypress
        window.addEventListener('load', () => {{
            showSlide(0);
            navigationHint.classList.add('show');
            setTimeout(() => {{
                navigationHint.classList.remove('show');
            }}, 3000);
        }});

        document.addEventListener('keydown', () => {{
            navigationHint.classList.add('show');
            setTimeout(() => {{
                navigationHint.classList.remove('show');
            }}, 1000);
        }});

        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {{
            e.preventDefault();
            return false;
        }});

        // Fullscreen support
        document.addEventListener('dblclick', () => {{
            if (!document.fullscreenElement) {{
                document.documentElement.requestFullscreen();
            }} else {{
                document.exitFullscreen();
            }}
        }});
    </script>
</body>
</html>
        """

        return jsonify({
            "success": True,
            "content": html_content
        })

    except Exception as e:
        logger.error(f"Error exporting presentation HTML: {str(e)}")
        return jsonify({"error": "Failed to export presentation"}), 500

# ============================================
# Error Handlers
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============================================
# Main Application
# ============================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])