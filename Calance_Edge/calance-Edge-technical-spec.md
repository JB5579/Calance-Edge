# Calance Edge - Technical Specification Document

**Version:** 1.0  
**Date:** December 2, 2025  
**Status:** Ready for Development  
**Timeline:** MVP in 3-5 days  

---

## Executive Summary

Calance Edge is a unified web application that consolidates sales enablement tools for Calance leadership. It transforms fragmented AI-powered workflows into a cohesive, branded experience that demonstrates the power of AI to peers who will intuitively appreciate its value.

**Core Principle:** Simple to build, simple to use, simple to maintain.

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Architecture](#2-architecture)
3. [Module Specifications](#3-module-specifications)
4. [Shared Services](#4-shared-services)
5. [User Interface Design](#5-user-interface-design)
6. [Technical Stack](#6-technical-stack)
7. [API Specifications](#7-api-specifications)
8. [Data Models](#8-data-models)
9. [Deployment](#9-deployment)
10. [Development Phases](#10-development-phases)
11. [File Structure](#11-file-structure)
12. [Testing Strategy](#12-testing-strategy)
13. [Appendices](#13-appendices)

---

## 1. Application Overview

### 1.1 Vision Statement

> "Where sales artifacts are Edged — Case Studies, Presentations, and Recruiting materials crafted with AI precision and Calance quality."

### 1.2 Success Criteria

| Metric | Target |
|--------|--------|
| Time to create case study | < 5 minutes |
| Time to create presentation | < 10 minutes |
| User onboarding time | < 2 minutes (no training needed) |
| Output quality | Indistinguishable from professional design |

### 1.3 Core Modules

| Module | Purpose | Outputs |
|--------|---------|---------|
| **Case Study Edge** | Create client success stories | PDF, Standalone HTML |
| **Presentation Edge** | Build sales presentations | Standalone HTML, (PPTX Phase 2) |
| **Recruiting Toolkit** | Generate staffing artifacts | Copy-to-clipboard text |

### 1.4 Design Philosophy

1. **Draft → Feedback → Regenerate**: Users iterate via natural language, not pixel editing
2. **One-Click Outputs**: Every module ends with immediate, downloadable results
3. **Brand Consistency**: Calance styling applied automatically
4. **Intelligent Defaults**: Smart model routing, sensible presets, minimal configuration

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CALANCE Edge                                  │
│                        (Docker Compose Stack)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         NGINX REVERSE PROXY                          │   │
│  │                    (Port 80 → Frontend/Backend)                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│              ┌─────────────────────┼─────────────────────┐                  │
│              │                     │                     │                  │
│              ▼                     ▼                     ▼                  │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐  │
│  │     FRONTEND      │ │     BACKEND       │ │      DATA VOLUMES         │  │
│  │   (React + Vite)  │ │   (Flask API)     │ │                           │  │
│  │                   │ │                   │ │  • /data/exports/pdf      │  │
│  │  • Case Studies   │ │  • /api/generate  │ │  • /data/exports/html     │  │
│  │  • Presentations  │ │  • /api/export    │ │  • /data/templates        │  │
│  │  • Recruiting     │ │  • /api/brand     │ │  • /data/brand            │  │
│  │                   │ │                   │ │                           │  │
│  │  Port: 5173       │ │  Port: 5000       │ │                           │  │
│  └───────────────────┘ └─────────┬─────────┘ └───────────────────────────┘  │
│                                  │                                          │
│                                  ▼                                          │
│                    ┌───────────────────────────┐                            │
│                    │    EXTERNAL SERVICES      │                            │
│                    │                           │                            │
│                    │  • OpenRouter API (LLM)   │                            │
│                    │  • Nano-Banana (Phase 2)  │                            │
│                    └───────────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Container Architecture

```yaml
services:
  frontend:     # React SPA served by Nginx
  backend:      # Flask API with Gunicorn
  nginx:        # Reverse proxy (optional for dev)

volumes:
  Edge-data:   # Persistent storage for exports
```

### 2.3 Request Flow

```
User Action                    Frontend                Backend                External
     │                            │                       │                      │
     │  1. Fill case study form   │                       │                      │
     ├───────────────────────────>│                       │                      │
     │                            │  2. POST /api/generate│                      │
     │                            ├──────────────────────>│                      │
     │                            │                       │  3. OpenRouter API   │
     │                            │                       ├─────────────────────>│
     │                            │                       │  4. LLM Response     │
     │                            │                       │<─────────────────────┤
     │                            │  5. Generated content │                      │
     │                            │<──────────────────────┤                      │
     │  6. Display preview        │                       │                      │
     │<───────────────────────────┤                       │                      │
     │                            │                       │                      │
     │  7. Submit feedback        │                       │                      │
     ├───────────────────────────>│                       │                      │
     │                            │  8. POST /api/refine  │                      │
     │                            ├──────────────────────>│                      │
     │                            │        ...            │                      │
     │                            │                       │                      │
     │  9. Click "Export PDF"     │                       │                      │
     ├───────────────────────────>│                       │                      │
     │                            │  10. POST /api/export │                      │
     │                            ├──────────────────────>│                      │
     │                            │  11. PDF binary       │                      │
     │                            │<──────────────────────┤                      │
     │  12. Download file         │                       │                      │
     │<───────────────────────────┤                       │                      │
```

---

## 3. Module Specifications

### 3.1 Module 1: Case Study Edge

#### 3.1.1 Purpose
Transform client success stories into professional, branded case study documents.

#### 3.1.2 User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CASE STUDY Edge                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: INPUT                           STEP 2: PREVIEW + REFINE           │
│  ┌─────────────────────────────┐        ┌─────────────────────────────────┐ │
│  │                             │        │  ┌─────────┐ ┌────────────────┐ │ │
│  │  Client Name: [__________]  │        │  │         │ │  FEEDBACK      │ │ │
│  │  Industry:    [__________]  │        │  │  LIVE   │ │                │ │ │
│  │                             │  ───>  │  │ PREVIEW │ │  "Make the ROI │ │ │
│  │  Business Challenge:        │        │  │         │ │   more promi-  │ │ │
│  │  [_______________________]  │        │  │  (PDF   │ │   nent in the  │ │ │
│  │  [_______________________]  │        │  │  style) │ │   headline"    │ │ │
│  │                             │        │  │         │ │                │ │ │
│  │  Solution Delivered:        │        │  └─────────┘ │ [Regenerate]   │ │ │
│  │  [_______________________]  │        │              └────────────────┘ │ │
│  │                             │        └─────────────────────────────────┘ │
│  │  + Add Metric               │                                            │
│  │  + Add Benefit              │        STEP 3: EXPORT                      │
│  │                             │        ┌─────────────────────────────────┐ │
│  │  [Generate Draft]           │        │  [📄 Download PDF]              │ │
│  └─────────────────────────────┘        │  [🌐 Download HTML]             │ │
│                                         │  [📋 Copy Link]                 │ │
│                                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.1.3 Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `client_name` | text | Yes | Client/company name |
| `industry` | dropdown | Yes | Industry vertical |
| `title` | text | Yes | Case study headline |
| `subtitle` | text | No | Supporting tagline |
| `challenge` | textarea | Yes | Business problem description |
| `solution` | textarea | Yes | Solution delivered |
| `tech_stack` | text | No | Technologies used |
| `timeline` | text | No | Project duration |
| `metrics[]` | array | No | Before/after measurements |
| `benefits[]` | array | No | Key benefits list |
| `roi` | text | No | ROI summary statement |

#### 3.1.4 Output Formats

**PDF (Primary)**
- 8.5" x 11" letter size
- 2-3 pages
- Calance branding (logo, colors, typography)
- Generated via ReportLab

**Standalone HTML**
- Self-contained single file
- Embedded CSS and images (base64)
- Print-optimized media queries
- Responsive for screen viewing

#### 3.1.5 LLM Integration

```python
CASE_STUDY_PROMPTS = {
    "enhance_challenge": """
        Rewrite this business challenge to be more compelling:
        - Use specific pain points
        - Quantify impact where possible
        - Keep under 150 words
        
        Original: {challenge}
    """,
    
    "enhance_solution": """
        Enhance this solution description:
        - Lead with outcomes
        - Reference specific technologies: {tech_stack}
        - Maintain professional tone
        
        Original: {solution}
    """,
    
    "generate_headline": """
        Create a compelling case study headline that:
        - Leads with the result/transformation
        - Mentions the industry or domain
        - Is under 12 words
        
        Context: {client_name}, {industry}, ROI: {roi}
    """,
    
    "refine_with_feedback": """
        Refine this case study content based on user feedback.
        
        Current content:
        {current_content}
        
        User feedback:
        {feedback}
        
        Apply the feedback while maintaining:
        - Professional tone
        - Factual accuracy
        - Calance brand voice
    """
}
```

---

### 3.2 Module 2: Presentation Edge

#### 3.2.1 Purpose
Create professional sales presentations from key talking points.

#### 3.2.2 User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION Edge                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: SETUP                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Presentation Title: [________________________________]              │   │
│  │  Purpose/Goal:       [________________________________]              │   │
│  │  Target Audience:    [________________________________]              │   │
│  │  Theme/Tone:         [Professional ▼]                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  STEP 2: KEY POINTS (Slides will be generated from these)                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. [Introduction and context___________________________]  [−]       │   │
│  │  2. [Problem statement__________________________________]  [−]       │   │
│  │  3. [Our solution approach______________________________]  [−]       │   │
│  │  4. [Key benefits and differentiators___________________]  [−]       │   │
│  │  5. [Call to action_____________________________________]  [−]       │   │
│  │                                                                      │   │
│  │  [+ Add Key Point]                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  STEP 3: KNOWLEDGE BASE (Optional context for AI)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Paste any relevant information the AI should reference:             │   │
│  │  [_______________________________________________________________]   │   │
│  │  [_______________________________________________________________]   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Generate Presentation]                                                    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  STEP 4: PREVIEW + REFINE                                                   │
│  ┌───────────────────────────────┐  ┌─────────────────────────────────────┐│
│  │  ◀  Slide 2 of 6  ▶           │  │  FEEDBACK                           ││
│  │  ┌─────────────────────────┐  │  │                                     ││
│  │  │                         │  │  │  Current slide feedback:            ││
│  │  │   [Slide Preview]       │  │  │  [_____________________________]    ││
│  │  │                         │  │  │                                     ││
│  │  │                         │  │  │  [Regenerate This Slide]            ││
│  │  └─────────────────────────┘  │  │                                     ││
│  │                               │  │  Global feedback:                   ││
│  │  ● ○ ○ ○ ○ ○                  │  │  [_____________________________]    ││
│  └───────────────────────────────┘  │                                     ││
│                                     │  [Regenerate All]                   ││
│                                     └─────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│  STEP 5: EXPORT                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [🌐 Download HTML Presentation]  [📋 Copy Shareable Link]           │   │
│  │                                                                      │   │
│  │  ℹ️ HTML presentations work great for screen sharing via Teams/Zoom   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.3 Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | text | Yes | Presentation title |
| `purpose` | textarea | Yes | Goal/objective |
| `audience` | text | Yes | Target audience |
| `theme` | dropdown | Yes | Professional, Energetic, Technical, Executive |
| `key_points[]` | array | Yes | Main talking points (1 per slide) |
| `knowledge_base` | textarea | No | Context/data for AI reference |

#### 3.2.4 Output Format

**Standalone HTML Presentation**
- Single self-contained HTML file
- Keyboard navigation (arrow keys, spacebar)
- Responsive scaling
- Print to PDF capability
- Embedded Calance branding

```html
<!-- Example structure -->
<!DOCTYPE html>
<html>
<head>
    <style>/* All CSS embedded */</style>
</head>
<body>
    <div class="slide" id="slide-1">
        <header class="slide-header">
            <img src="data:image/png;base64,..." class="logo">
        </header>
        <main class="slide-content">
            <h1>Title Slide</h1>
            <p class="subtitle">Subtitle here</p>
        </main>
        <footer class="slide-footer">
            <span class="slide-number">1 / 6</span>
        </footer>
    </div>
    <!-- More slides... -->
    <script>/* Navigation JS embedded */</script>
</body>
</html>
```

#### 3.2.5 Slide Templates

| Template | Use Case | Content Areas |
|----------|----------|---------------|
| `title` | Opening slide | Title, subtitle, logo |
| `section` | Section divider | Section title, divider |
| `content` | Standard content | Heading, bullet points |
| `two-column` | Comparison | Left content, right content |
| `quote` | Testimonial | Quote text, attribution |
| `metrics` | Data highlight | Metric cards (up to 4) |
| `closing` | Call to action | CTA, contact info |

---

### 3.3 Module 3: Recruiting Toolkit

#### 3.3.1 Purpose
Streamline recruiting workflows with AI-powered artifact generation.

#### 3.3.2 Tab Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RECRUITING TOOLKIT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐                 │
│  │  JD  │Email │Search│Submit│ Prep │ Mock │  Src │Summ- │                 │
│  │Enhan-│ Gen  │String│ Gen  │Email │ Q&A  │Email │ary   │                 │
│  │cer   │      │      │      │      │      │      │      │                 │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘                 │
│         ▲                                                                   │
│         │ (Active Tab)                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  [Tab-specific input form]                                           │   │
│  │                                                                      │   │
│  │  ────────────────────────────────────────────────────────────────    │   │
│  │                                                                      │   │
│  │  [Generated output with copy button]                                 │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.3.3 Tool Specifications

**Tab 1: JD Enhancer**
| Input | Output |
|-------|--------|
| Raw job description (paste) | Enhanced posting with Calance branding |
| | Markdown formatted |
| | Copy-to-clipboard |

**Tab 2: Sourcing Email Generator**
| Input | Output |
|-------|--------|
| Role title | 3 subject line options |
| Candidate first name | Personalized email body |
| Key skill to highlight | Call-to-action |
| Recruiter name | Calance signature block |

**Tab 3: Boolean Search String Creator**
| Input | Output |
|-------|--------|
| Job description (paste) | LinkedIn Recruiter string |
| | Dice/Monster string |
| | Indeed string |
| | GitHub string (if technical) |

**Tab 4: Candidate Submittal Generator**
| Input | Output |
|-------|--------|
| Guided form (11 fields) | Formatted submittal document |
| Resume/career summary | 5-sentence experience summary |
| | Copy-to-clipboard |

**Tab 5: Interview Prep Email Builder**
| Input | Output |
|-------|--------|
| Guided wizard (15 steps) | Complete prep email |
| Interview logistics | Calendar-ready details |
| Job description | Key responsibilities extracted |

**Tab 6: Mock Interview Questions**
| Input | Output |
|-------|--------|
| Job description | Position summary |
| | 3 vetting questions with model answers |
| | Red flags and green lights |

**Tab 7: Skills/Title/Location Extractor**
| Input | Output |
|-------|--------|
| Job description | Technical skills list |
| | Optimized job title |
| | Location codes (ZIP, area code) |

**Tab 8: Executive Summary Writer**
| Input | Output |
|-------|--------|
| Job description | 3-5 sentence candidate summary |
| Candidate profile/resume | Quantified achievements |
| | Skills alignment |

---

## 4. Shared Services

### 4.1 LLM Router Service

#### 4.1.1 Model Presets

```python
MODEL_CONFIG = {
    "fast_draft": {
        "model": "google/gemini-flash-2.0",
        "max_tokens": 2048,
        "temperature": 0.7,
        "use_cases": ["initial_generation", "brainstorming", "iteration"]
    },
    "quality_final": {
        "model": "anthropic/claude-sonnet-4-20250514",
        "max_tokens": 4096,
        "temperature": 0.5,
        "use_cases": ["final_polish", "executive_summary", "complex_reasoning"]
    },
    "structured_extraction": {
        "model": "openai/gpt-4o-mini",
        "max_tokens": 1024,
        "temperature": 0.3,
        "use_cases": ["json_extraction", "parsing", "classification"]
    }
}

def select_model(task_type: str, is_final: bool = False) -> dict:
    """Automatically select the best model for the task."""
    if is_final:
        return MODEL_CONFIG["quality_final"]
    
    extraction_tasks = ["skills_extract", "title_extract", "parse_jd"]
    if task_type in extraction_tasks:
        return MODEL_CONFIG["structured_extraction"]
    
    return MODEL_CONFIG["fast_draft"]
```

#### 4.1.2 OpenRouter Integration

```python
import httpx
from typing import Optional

class LLMRouter:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://openrouter.ai/api/v1"
        
    async def generate(
        self,
        prompt: str,
        task_type: str,
        is_final: bool = False,
        system_prompt: Optional[str] = None
    ) -> str:
        config = select_model(task_type, is_final)
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "HTTP-Referer": "https://Edge.calance.internal",
                    "X-Title": "Calance Edge"
                },
                json={
                    "model": config["model"],
                    "messages": messages,
                    "max_tokens": config["max_tokens"],
                    "temperature": config["temperature"]
                },
                timeout=60.0
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
```

### 4.2 Brand Engine

#### 4.2.1 Brand Configuration

```python
# Extracted from calanceus.com
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
    "logo": {
        "primary": "/assets/calance-logo.png",
        "white": "/assets/calance-logo-white.png",
        "min_height": "40px",
        "max_height": "60px"
    },
    "company_info": {
        "tagline": "Calance - the place to grow.",
        "website": "www.calance.com",
        "address": "888 Disneyland Drive Suite 500, Anaheim, CA 92802",
        "description": "Calance is a global IT company with operations in the United States, Canada, and India."
    }
}
```

#### 4.2.2 CSS Variables

```css
:root {
    /* Colors */
    --Edge-primary: #1e3a5f;
    --Edge-primary-light: #2563eb;
    --Edge-accent: #f97316;
    --Edge-accent-alt: #dc2626;
    --Edge-dark: #1f2937;
    --Edge-gray: #6b7280;
    --Edge-light: #f3f4f6;
    --Edge-white: #ffffff;
    
    /* Typography */
    --Edge-font-family: 'Inter', system-ui, -apple-system, sans-serif;
    --Edge-font-size-xs: 0.75rem;
    --Edge-font-size-sm: 0.875rem;
    --Edge-font-size-base: 1rem;
    --Edge-font-size-lg: 1.125rem;
    --Edge-font-size-xl: 1.25rem;
    --Edge-font-size-2xl: 1.5rem;
    --Edge-font-size-3xl: 1.875rem;
    --Edge-font-size-4xl: 2.25rem;
    
    /* Spacing */
    --Edge-space-1: 0.25rem;
    --Edge-space-2: 0.5rem;
    --Edge-space-3: 0.75rem;
    --Edge-space-4: 1rem;
    --Edge-space-6: 1.5rem;
    --Edge-space-8: 2rem;
    --Edge-space-12: 3rem;
    
    /* Borders */
    --Edge-radius-sm: 0.25rem;
    --Edge-radius-md: 0.375rem;
    --Edge-radius-lg: 0.5rem;
    --Edge-radius-xl: 0.75rem;
    
    /* Shadows */
    --Edge-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --Edge-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --Edge-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 4.3 Export Engine

#### 4.3.1 PDF Generation (ReportLab)

```python
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, Image
from reportlab.lib.styles import ParagraphStyle

class CaseStudyPDFGenerator:
    def __init__(self, brand_config: dict):
        self.brand = brand_config
        self.styles = self._create_styles()
    
    def _create_styles(self) -> dict:
        return {
            "title": ParagraphStyle(
                "Title",
                fontName="Helvetica-Bold",
                fontSize=24,
                textColor=colors.HexColor(self.brand["colors"]["primary_navy"]),
                spaceAfter=6
            ),
            "subtitle": ParagraphStyle(
                "Subtitle",
                fontName="Helvetica",
                fontSize=14,
                textColor=colors.HexColor(self.brand["colors"]["neutral_gray"]),
                spaceAfter=12
            ),
            "heading": ParagraphStyle(
                "Heading",
                fontName="Helvetica-Bold",
                fontSize=14,
                textColor=colors.HexColor(self.brand["colors"]["primary_navy"]),
                spaceAfter=6
            ),
            "body": ParagraphStyle(
                "Body",
                fontName="Helvetica",
                fontSize=10,
                leading=14,
                textColor=colors.HexColor(self.brand["colors"]["neutral_dark"])
            )
        }
    
    def generate(self, data: dict, output_path: str) -> str:
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        elements = []
        
        # Header with logo
        elements.append(self._create_header(data))
        elements.append(Spacer(1, 0.25*inch))
        
        # Title section
        elements.append(Paragraph(data["title"], self.styles["title"]))
        elements.append(Paragraph(data["subtitle"], self.styles["subtitle"]))
        
        # Executive summary box
        elements.append(self._create_summary_box(data))
        
        # Challenge section
        elements.append(self._create_section("❌ Business Challenge", data["challenge"], "challenge"))
        
        # Solution section
        elements.append(self._create_section("✅ Solution Delivered", data["solution"], "solution"))
        
        # Metrics table
        if data.get("metrics"):
            elements.append(self._create_metrics_table(data["metrics"]))
        
        # Benefits
        if data.get("benefits"):
            elements.append(self._create_benefits_list(data["benefits"]))
        
        doc.build(elements)
        return output_path
```

#### 4.3.2 HTML Generation (Jinja2)

```python
from jinja2 import Environment, FileSystemLoader
import base64

class HTMLExporter:
    def __init__(self, template_dir: str):
        self.env = Environment(loader=FileSystemLoader(template_dir))
    
    def export_case_study(self, data: dict, output_path: str) -> str:
        template = self.env.get_template("case_study.html")
        
        # Embed logo as base64
        with open(data["logo_path"], "rb") as f:
            logo_base64 = base64.b64encode(f.read()).decode()
        
        html_content = template.render(
            **data,
            logo_data_url=f"data:image/png;base64,{logo_base64}",
            brand=CALANCE_BRAND
        )
        
        with open(output_path, "w") as f:
            f.write(html_content)
        
        return output_path
    
    def export_presentation(self, data: dict, output_path: str) -> str:
        template = self.env.get_template("presentation.html")
        
        # Embed all assets
        html_content = template.render(
            **data,
            brand=CALANCE_BRAND,
            slides=data["slides"]
        )
        
        with open(output_path, "w") as f:
            f.write(html_content)
        
        return output_path
```

---

## 5. User Interface Design

### 5.1 Design Direction

**Aesthetic:** Clean, professional, tool-focused — "Premium SaaS meets Industrial Utility"

**Key Principles:**
1. **Clarity over decoration** — Every element serves a purpose
2. **Generous whitespace** — Content breathes, reduces cognitive load
3. **Consistent patterns** — Same interactions everywhere
4. **Instant feedback** — Loading states, success indicators, errors

### 5.2 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CALANCE                                                    [?] Help │   │
│  │  Edge        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────┐  ┌─────────────────────────────────────────────────┐   │
│  │                │  │                                                 │   │
│  │  NAVIGATION    │  │                 MAIN CONTENT                    │   │
│  │                │  │                                                 │   │
│  │  ○ Case        │  │  ┌─────────────────────────────────────────┐   │   │
│  │    Studies     │  │  │                                         │   │   │
│  │                │  │  │         [Active Module Content]         │   │   │
│  │  ● Presenta-   │  │  │                                         │   │   │
│  │    tions       │  │  │                                         │   │   │
│  │                │  │  │                                         │   │   │
│  │  ○ Recruiting  │  │  │                                         │   │   │
│  │    Toolkit     │  │  │                                         │   │   │
│  │                │  │  │                                         │   │   │
│  │  ──────────    │  │  └─────────────────────────────────────────┘   │   │
│  │                │  │                                                 │   │
│  │  ○ Settings    │  │                                                 │   │
│  │                │  │                                                 │   │
│  └────────────────┘  └─────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Powered by AI  •  Internal Use Only  •  v1.0.0                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Component Library

#### Navigation Item
```jsx
<NavItem 
    icon={<FileText />}
    label="Case Studies"
    active={currentModule === 'case-studies'}
    onClick={() => setModule('case-studies')}
/>
```

#### Input Field
```jsx
<FormField
    label="Client Name"
    required
    placeholder="Enter client name"
    value={clientName}
    onChange={setClientName}
    helpText="This will appear in the case study header"
/>
```

#### Action Button
```jsx
<Button 
    variant="primary"
    icon={<Sparkles />}
    loading={isGenerating}
    onClick={handleGenerate}
>
    Generate Draft
</Button>
```

#### Export Panel
```jsx
<ExportPanel>
    <ExportButton format="pdf" onClick={downloadPDF} />
    <ExportButton format="html" onClick={downloadHTML} />
    <CopyButton content={generatedContent} />
</ExportPanel>
```

### 5.4 Color Usage Guidelines

| Element | Color | CSS Variable |
|---------|-------|--------------|
| Primary actions | Navy | `--Edge-primary` |
| Active states | Blue | `--Edge-primary-light` |
| Success indicators | Accent orange | `--Edge-accent` |
| Errors/warnings | Accent red | `--Edge-accent-alt` |
| Body text | Dark gray | `--Edge-dark` |
| Secondary text | Gray | `--Edge-gray` |
| Backgrounds | Light gray | `--Edge-light` |
| Cards/panels | White | `--Edge-white` |

---

## 6. Technical Stack

### 6.1 Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 18.x |
| Vite | Build tool | 5.x |
| TailwindCSS | Styling | 3.x |
| Lucide React | Icons | Latest |
| React Router | Navigation | 6.x |
| Zustand | State management | 4.x |
| React Hook Form | Form handling | 7.x |

### 6.2 Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Python | Runtime | 3.11+ |
| Flask | Web framework | 3.x |
| Gunicorn | WSGI server | 21.x |
| ReportLab | PDF generation | 4.x |
| Jinja2 | HTML templating | 3.x |
| httpx | Async HTTP | 0.27.x |
| Pillow | Image processing | 10.x |

### 6.3 Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse proxy |

### 6.4 External Services

| Service | Purpose | Notes |
|---------|---------|-------|
| OpenRouter | LLM API gateway | Primary AI provider |
| Nano-Banana | Image generation | Phase 2 |

---

## 7. API Specifications

### 7.1 Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/case-study/generate` | Generate case study draft |
| POST | `/api/case-study/refine` | Refine with feedback |
| POST | `/api/case-study/export/pdf` | Export as PDF |
| POST | `/api/case-study/export/html` | Export as HTML |
| POST | `/api/presentation/generate` | Generate presentation |
| POST | `/api/presentation/refine` | Refine slides |
| POST | `/api/presentation/export/html` | Export as HTML |
| POST | `/api/recruiting/{tool}` | Generate recruiting artifact |
| GET | `/api/brand/config` | Get brand configuration |
| GET | `/api/health` | Health check |

### 7.2 Request/Response Examples

#### Generate Case Study Draft

**Request:**
```http
POST /api/case-study/generate
Content-Type: application/json

{
    "client_name": "Beazer Homes",
    "industry": "Real Estate",
    "title": "",
    "challenge": "Manual land acquisition process taking 6+ months per deal",
    "solution": "Implemented Scout AI platform for automated land analysis",
    "tech_stack": "Python, AWS, React",
    "metrics": [
        {
            "label": "Deal Volume",
            "before": "20-30 deals",
            "after": "50-75 deals",
            "improvement": "2-3x increase"
        }
    ],
    "benefits": [
        "Faster time to decision",
        "Reduced due diligence costs"
    ]
}
```

**Response:**
```json
{
    "success": true,
    "draft": {
        "title": "Beazer Homes Transforms Land Acquisition with AI-Powered Analysis",
        "subtitle": "How Scout AI Delivered 2-3x Deal Volume in Real Estate",
        "challenge_enhanced": "Beazer Homes faced a critical bottleneck in their land acquisition pipeline...",
        "solution_enhanced": "Calance partnered with Beazer Homes to implement Scout...",
        "executive_summary": "Through AI-powered land analysis, Beazer Homes achieved...",
        "roi_statement": "2-3x increase in deal throughput"
    },
    "preview_html": "<div class='case-study-preview'>...</div>",
    "generation_id": "cs_abc123"
}
```

#### Refine with Feedback

**Request:**
```http
POST /api/case-study/refine
Content-Type: application/json

{
    "generation_id": "cs_abc123",
    "feedback": "Make the ROI more prominent in the headline and add specific dollar amounts if possible",
    "sections_to_refine": ["title", "executive_summary"]
}
```

**Response:**
```json
{
    "success": true,
    "draft": {
        "title": "Beazer Homes Achieves $2.4M Annual Savings with AI Land Analysis",
        "executive_summary": "By implementing Scout AI, Beazer Homes reduced land analysis time by 75%...",
        "...": "..."
    },
    "generation_id": "cs_abc124"
}
```

#### Export PDF

**Request:**
```http
POST /api/case-study/export/pdf
Content-Type: application/json

{
    "generation_id": "cs_abc124"
}
```

**Response:**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="case-study-beazer-homes.pdf"

[Binary PDF content]
```

### 7.3 Error Responses

```json
{
    "success": false,
    "error": {
        "code": "GENERATION_FAILED",
        "message": "Failed to generate content",
        "details": "OpenRouter API timeout after 60 seconds"
    }
}
```

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `GENERATION_FAILED` | 500 | LLM generation failed |
| `EXPORT_FAILED` | 500 | PDF/HTML export failed |
| `NOT_FOUND` | 404 | Generation ID not found |
| `RATE_LIMITED` | 429 | Too many requests |

---

## 8. Data Models

### 8.1 Case Study

```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Metric:
    label: str
    before: str
    after: str
    improvement: str

@dataclass
class CaseStudy:
    id: str
    client_name: str
    industry: str
    title: str
    subtitle: str
    challenge: str
    challenge_enhanced: str
    solution: str
    solution_enhanced: str
    tech_stack: Optional[str]
    timeline: Optional[str]
    metrics: List[Metric]
    benefits: List[str]
    roi: Optional[str]
    executive_summary: str
    created_at: str
    updated_at: str
```

### 8.2 Presentation

```python
@dataclass
class Slide:
    id: str
    template: str  # "title", "content", "metrics", etc.
    heading: str
    content: List[str]  # Bullet points or paragraphs
    speaker_notes: Optional[str]

@dataclass
class Presentation:
    id: str
    title: str
    purpose: str
    audience: str
    theme: str
    slides: List[Slide]
    knowledge_base: Optional[str]
    created_at: str
    updated_at: str
```

### 8.3 Recruiting Artifact

```python
@dataclass
class RecruitingArtifact:
    id: str
    tool_type: str  # "jd_enhancer", "sourcing_email", etc.
    input_data: dict
    output_content: str
    created_at: str
```

---

## 9. Deployment

### 9.1 Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: Edge-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: Edge-backend
    ports:
      - "5000:5000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    volumes:
      - Edge-data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  Edge-data:
    driver: local
```

### 9.2 Backend Dockerfile

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directories
RUN mkdir -p /app/data/exports/pdf \
             /app/data/exports/html \
             /app/data/templates \
             /app/data/brand

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]
```

### 9.3 Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 9.4 Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/calance/Edge.git
cd Edge

# 2. Configure environment
cp .env.example .env
# Edit .env to add OPENROUTER_API_KEY

# 3. Build and start
docker-compose up -d --build

# 4. Verify deployment
curl http://localhost:3000          # Frontend
curl http://localhost:5000/api/health  # Backend

# 5. View logs
docker-compose logs -f
```

---

## 10. Development Phases

### Phase 1: Foundation (Day 1)
**Goal:** Project scaffolding and core infrastructure

- [ ] Initialize React + Vite project
- [ ] Set up Flask backend structure
- [ ] Configure Docker Compose
- [ ] Implement brand configuration
- [ ] Create shared UI components (buttons, inputs, cards)
- [ ] Set up navigation shell

**Deliverable:** Running app with navigation between empty modules

### Phase 2: Case Study Module (Day 2)
**Goal:** Complete case study creation flow

- [ ] Build input form with all fields
- [ ] Implement LLM generation endpoint
- [ ] Create live preview component
- [ ] Build feedback → regenerate flow
- [ ] Implement PDF export (ReportLab)
- [ ] Implement HTML export (Jinja2)

**Deliverable:** Fully functional case study creation

### Phase 3: Presentation Module (Day 3)
**Goal:** Complete presentation creation flow

- [ ] Build presentation wizard UI
- [ ] Implement slide generation logic
- [ ] Create slide preview carousel
- [ ] Build per-slide feedback system
- [ ] Implement HTML presentation export
- [ ] Add keyboard navigation to exported HTML

**Deliverable:** Fully functional presentation creation

### Phase 4: Recruiting Toolkit (Day 4)
**Goal:** All 8 recruiting tools operational

- [ ] Build tabbed interface
- [ ] Implement JD Enhancer
- [ ] Implement Sourcing Email Generator
- [ ] Implement Boolean Search String Creator
- [ ] Implement Candidate Submittal Generator
- [ ] Implement Interview Prep Email Builder
- [ ] Implement Mock Interview Questions
- [ ] Implement Skills Extractor
- [ ] Implement Executive Summary Writer

**Deliverable:** Complete recruiting toolkit

### Phase 5: Polish & Deploy (Day 5)
**Goal:** Production-ready deployment

- [ ] Error handling and loading states
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Documentation
- [ ] Final testing
- [ ] Docker build and deployment package

**Deliverable:** Deployable Docker package with documentation

---

## 11. File Structure

```
calance-Edge/
├── docker-compose.yml
├── .env.example
├── README.md
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── components/
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Tabs.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── AppShell.jsx
│       │   │   ├── Navigation.jsx
│       │   │   └── Header.jsx
│       │   │
│       │   └── shared/
│       │       ├── PreviewPanel.jsx
│       │       ├── FeedbackPanel.jsx
│       │       └── ExportButtons.jsx
│       │
│       ├── modules/
│       │   ├── case-studies/
│       │   │   ├── CaseStudyModule.jsx
│       │   │   ├── CaseStudyForm.jsx
│       │   │   ├── CaseStudyPreview.jsx
│       │   │   └── CaseStudyExport.jsx
│       │   │
│       │   ├── presentations/
│       │   │   ├── PresentationModule.jsx
│       │   │   ├── PresentationWizard.jsx
│       │   │   ├── SlidePreview.jsx
│       │   │   └── PresentationExport.jsx
│       │   │
│       │   └── recruiting/
│       │       ├── RecruitingModule.jsx
│       │       ├── tools/
│       │       │   ├── JDEnhancer.jsx
│       │       │   ├── SourcingEmail.jsx
│       │       │   ├── BooleanSearch.jsx
│       │       │   ├── CandidateSubmittal.jsx
│       │       │   ├── InterviewPrep.jsx
│       │       │   ├── MockInterview.jsx
│       │       │   ├── SkillsExtractor.jsx
│       │       │   └── ExecutiveSummary.jsx
│       │       └── RecruitingToolLayout.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   └── llm.js
│       │
│       ├── store/
│       │   ├── useAppStore.js
│       │   └── useCaseStudyStore.js
│       │
│       └── utils/
│           ├── brand.js
│           └── formatters.js
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── case_studies.py
│   │   ├── presentations.py
│   │   ├── recruiting.py
│   │   └── brand.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── llm_router.py
│   │   ├── pdf_generator.py
│   │   ├── html_exporter.py
│   │   └── brand_engine.py
│   │
│   ├── templates/
│   │   ├── case_study.html
│   │   ├── presentation.html
│   │   └── slide_templates/
│   │       ├── title.html
│   │       ├── content.html
│   │       ├── metrics.html
│   │       └── closing.html
│   │
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── case_study_prompts.py
│   │   ├── presentation_prompts.py
│   │   └── recruiting_prompts.py
│   │
│   └── assets/
│       ├── calance-logo.png
│       ├── calance-logo-white.png
│       └── fonts/
│
└── data/
    ├── exports/
    │   ├── pdf/
    │   └── html/
    ├── templates/
    └── brand/
```

---

## 12. Testing Strategy

### 12.1 Manual Testing Checklist

#### Case Study Module
- [ ] Form validation (required fields)
- [ ] Draft generation completes
- [ ] Preview renders correctly
- [ ] Feedback regeneration works
- [ ] PDF download works
- [ ] HTML download works
- [ ] HTML is self-contained (works offline)

#### Presentation Module
- [ ] Wizard flow completes
- [ ] Slides generate from key points
- [ ] Slide navigation works
- [ ] Per-slide feedback works
- [ ] HTML export works
- [ ] Keyboard navigation in exported HTML

#### Recruiting Toolkit
- [ ] All 8 tabs accessible
- [ ] Each tool generates output
- [ ] Copy-to-clipboard works
- [ ] Output formatting correct

### 12.2 API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Generate case study
curl -X POST http://localhost:5000/api/case-study/generate \
  -H "Content-Type: application/json" \
  -d '{"client_name": "Test", "industry": "Tech", "challenge": "Test challenge", "solution": "Test solution"}'

# Export PDF
curl -X POST http://localhost:5000/api/case-study/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"generation_id": "cs_abc123"}' \
  --output test.pdf
```

---

## 13. Appendices

### Appendix A: Recruiting Tool Prompts

See `/backend/prompts/recruiting_prompts.py` for complete prompt templates.

### Appendix B: Brand Assets

Required assets to include in `/backend/assets/`:
- `calance-logo.png` (primary logo, transparent background)
- `calance-logo-white.png` (white version for dark backgrounds)

### Appendix C: Environment Variables

```env
# Required
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Optional
FLASK_ENV=production
LOG_LEVEL=INFO
```

### Appendix D: Useful Commands

```bash
# Development
docker-compose up -d --build
docker-compose logs -f backend
docker-compose exec backend bash

# Cleanup
docker-compose down -v
docker system prune -a

# Backup exports
tar -czf Edge-exports-$(date +%Y%m%d).tar.gz data/exports/
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-02 | Claude | Initial specification |

---

**Ready to proceed to implementation. Awaiting confirmation on app name and any final adjustments.**
