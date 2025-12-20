# AI Visual Artifact Export Analysis: Converting Gemini Outputs to Professional Formats

**Date:** December 4, 2025
**Project:** Calance Edge
**Purpose:** Research and analysis of options for converting AI-generated visual artifacts into exportable formats

---

## Executive Summary

This document analyzes the current implementation of AI-generated visual artifacts in Calance Edge and provides comprehensive recommendations for enhancing export capabilities. The system currently uses Google Gemini to generate visual case study elements that are embedded as base64 images. We evaluate multiple approaches for improving PDF and HTML export functionality while maintaining visual fidelity and ensuring accessibility.

---

## 1. Current Architecture Analysis

### 1.1 Existing Implementation

**AI Generation Pipeline:**
- **Model:** `google/gemini-3-pro-image-preview` for case studies
- **Output:** Base64-encoded images embedded in API responses
- **Image Types:** Hero, Challenge, Solution, Metrics, Testimonial placements
- **Format:** PNG/JPEG base64 data URLs

**Current Export Methods:**

```python
# PDF Export (ReportLab)
def base64_to_image_buffer(data_url):
    """Convert base64 data URL to image buffer for ReportLab"""
    # Extract base64, decode to bytes
    # Convert to PIL Image (RGB for PDF compatibility)
    # Save to buffer as PNG

# HTML Export
- Basic HTML structure with inline styles
- Images displayed via <img> tags with base64 src
- No print-optimized CSS
```

**Limitations:**
1. **PDF:** Images are embedded as raster graphics, no vector support
2. **HTML:** No print CSS optimization
3. **Accessibility:** No OCR or text extraction from images
4. **Fidelity:** Limited control over image placement and scaling
5. **Performance:** Base64 images increase document size

---

## 2. Technical Options Analysis

### 2.1 PDF Generation Options

#### Option A: Enhanced ReportLab Implementation (Recommended)
**Description:** Extend current ReportLab approach with advanced image handling

**Pros:**
- Minimal code changes required
- Proven reliability in production
- Excellent performance for business documents
- Native Python support

**Technical Implementation:**
```python
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import KeepTogether, FrameBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import img2pdf  # For vector-like quality preservation

def export_enhanced_pdf(case_study_data):
    """Enhanced PDF export with advanced image handling"""

    # 1. Optimize images for print
    def optimize_image_for_print(image_data, max_width=6*inch):
        img_buffer = base64_to_image_buffer(image_data)
        pil_img = PILImage.open(img_buffer)

        # Calculate aspect ratio
        aspect = pil_img.width / pil_img.height
        width = min(max_width, pil_img.width * inch / 72)
        height = width / aspect

        return RLImage(img_buffer, width=width, height=height,
                      lazy=2, hAlign='CENTER')

    # 2. Text overlay on images (for accessibility)
    def add_text_overlay(canvas, image_data, text):
        img_buffer = base64_to_image_buffer(image_data)
        pil_img = PILImage.open(img_buffer)

        # Create a paragraph with background
        p = Paragraph(f'<span backColor="#FFFFFF">{text}</span>',
                     overlay_style)

    # 3. Flowable layouts
    story = []

    # Hero section with full-width image
    if hero_image:
        story.append(KeepTogether([
            optimize_image_for_print(hero_image),
            Spacer(1, 0.25*inch),
            Paragraph(case_study_data['title'], title_style)
        ]))

    # Two-column layout for challenge/solution with images
    if challenge_image and solution_image:
        story.append(FrameBreak())
        # Create two-column section with images
```

#### Option B: WeasyPrint for HTML-to-PDF Conversion
**Description:** Generate print-optimized HTML then convert to PDF

**Pros:**
- Modern CSS support (Flexbox, Grid)
- Print media queries
- Better typography control
- Separation of concerns

**Cons:**
- Additional dependency
- Learning curve for print CSS
- Potential rendering differences

**Technical Implementation:**
```python
import weasyprint
from jinja2 import Template

def export_weasyprint_pdf(case_study_data):
    """Export PDF using WeasyPrint for better CSS support"""

    # 1. Create print-optimized HTML template
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="print-styles.css">
    </head>
    <body>
        <div class="case-study">
            {% if hero_image %}
            <div class="hero-section">
                <img src="{{ hero_image }}" alt="Hero" class="hero-image">
                <h1>{{ title }}</h1>
            </div>
            {% endif %}

            <div class="content-sections">
                <div class="two-column">
                    <div class="challenge">
                        <h2>The Challenge</h2>
                        <p>{{ challenge }}</p>
                        {% if challenge_image %}
                        <img src="{{ challenge_image }}" alt="Challenge" class="section-image">
                        {% endif %}
                    </div>
                    <div class="solution">
                        <h2>Our Solution</h2>
                        <p>{{ solution }}</p>
                        {% if solution_image %}
                        <img src="{{ solution_image }}" alt="Solution" class="section-image">
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    # 2. Render with Jinja2
    template = Template(html_template)
    html_content = template.render(**case_study_data)

    # 3. Convert to PDF with WeasyPrint
    css = CSS(string='''
        @page {
            size: A4;
            margin: 2cm;
        }

        .hero-image {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            page-break-inside: avoid;
        }

        .two-column {
            display: flex;
            gap: 20px;
            page-break-inside: avoid;
        }

        .challenge, .solution {
            flex: 1;
        }

        .section-image {
            width: 100%;
            margin-top: 10px;
            page-break-inside: avoid;
        }

        @media print {
            .no-print {
                display: none;
            }
        }
    ''')

    pdf = weasyprint.HTML(string=html_content).write_pdf(stylesheets=[css])
    return pdf
```

#### Option C: Hybrid Vector-Raster Approach
**Description:** Combine vector graphics with raster images for optimal quality

**Pros:**
- Scalable vector elements
- Smaller file sizes
- Professional print quality
- Text remains selectable

**Technical Implementation:**
```python
import svgwrite
import cairosvg  # SVG to PDF conversion

def create_hybrid_pdf(case_study_data):
    """Create PDF with vector backgrounds and raster images"""

    # 1. Create vector background template
    dwg = svgwrite.Drawing('case_study_template.svg',
                          size=('8.5in', '11in'))

    # 2. Add vector elements
    # Header with gradient
    gradient = dwg.defs.add(dwg.linearGradient(
        end=('0%', '100%'), id='headergrad'))
    gradient.add_stop_color(0, '#1e3a5f')
    gradient.add_stop_color(1, '#2563eb')

    # Add shapes and text elements
    dwg.add(dwg.rect(
        insert=(0, 0), size=('100%', '15%'),
        fill='url(#headergrad)'))

    # 3. Convert SVG to PDF as base layer
    svg_bytes = dwg.tostring()
    base_pdf = cairosvg.svg2pdf(bytestring=svg_bytes)

    # 4. Overlay raster images and text
    pdf_reader = PdfReader(base_pdf)
    pdf_writer = PdfWriter()

    for page in pdf_reader.pages:
        # Add text overlay using ReportLab Canvas
        packet = io.BytesIO()
        can = Canvas(packet, pagesize=A4)

        # Draw text
        can.setFont("Helvetica-Bold", 24)
        can.setFillColorRGB(0.121, 0.227, 0.372)  # Calance navy
        can.drawString(72, 700, case_study_data['title'])

        # Add images at specific positions
        if case_study_data.get('hero_image'):
            img_buffer = base64_to_image_buffer(hero_image)
            can.drawImage(img_buffer, 72, 600,
                         width=468, height=200,
                         mask='auto')

        can.save()

        # Merge with base PDF
        new_page = PdfReader(packet).pages[0]
        page.merge_page(new_page)
        pdf_writer.add_page(page)

    return pdf_writer.write()
```

### 2.2 HTML Export Options

#### Option A: Enhanced HTML with Print CSS (Recommended)
**Description:** Create responsive HTML with dedicated print stylesheets

**Technical Implementation:**
```python
def export_enhanced_html(case_study_data):
    """Export HTML with print optimization and accessibility"""

    # 1. Extract text from images for accessibility
    def extract_text_metadata(image_data):
        """Use OCR to extract text for alt attributes"""
        # Implementation using pytesseract
        import pytesseract
        from PIL import Image

        img_buffer = base64_to_image_buffer(image_data)
        img = Image.open(img_buffer)

        # Extract text
        text = pytesseract.image_to_string(img)

        # Generate description using AI if no text found
        if not text.strip():
            text = generate_image_description(image_data)

        return text

    # 2. Create HTML with accessibility features
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{case_study_data['title']} - Calance Case Study</title>

        <!-- Screen Styles -->
        <style>
            /* Modern CSS with variables for brand consistency */
            :root {{
                --calance-navy: #1e3a5f;
                --calance-blue: #2563eb;
                --calance-orange: #f97316;
                --font-heading: 'Inter', system-ui, sans-serif;
                --font-body: 'Inter', system-ui, sans-serif;
            }}

            .case-study {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: var(--font-body);
            }}

            .hero-section {{
                position: relative;
                margin-bottom: 40px;
                border-radius: 12px;
                overflow: hidden;
            }}

            .hero-image {{
                width: 100%;
                height: 400px;
                object-fit: cover;
                filter: brightness(0.7);
            }}

            .hero-overlay {{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 40px;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                color: white;
            }}

            .content-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 40px;
                margin: 40px 0;
            }}

            .section-image {{
                width: 100%;
                border-radius: 8px;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }}

            @media (max-width: 768px) {{
                .content-grid {{
                    grid-template-columns: 1fr;
                    gap: 20px;
                }}
            }}
        </style>

        <!-- Print Styles -->
        <style media="print">
            @page {{
                size: A4;
                margin: 2cm;
                orphans: 3;
                widows: 3;
            }}

            body {{
                font-size: 12pt;
                line-height: 1.4;
                color: #000;
                background: none;
            }}

            .no-print {{
                display: none !important;
            }}

            .hero-section {{
                page-break-after: always;
                margin-bottom: 2cm;
            }}

            .content-grid {{
                display: block;
                page-break-inside: avoid;
            }}

            .section {{
                page-break-inside: avoid;
                margin-bottom: 2cm;
            }}

            .section-image {{
                max-width: 100% !important;
                page-break-inside: avoid;
                margin: 1cm 0;
            }}

            .metrics-table {{
                page-break-inside: avoid;
            }}

            h1, h2, h3 {{
                page-break-after: avoid;
                color: #1e3a5f !important;
            }}
        </style>

        <!-- Print Styles for Chrome/Safari -->
        <style>
            @media print and (-webkit-min-device-pixel-ratio:0) {{
                .section-image {{
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="case-study">
            <!-- Hero Section with Full-Width Image -->
            <div class="hero-section">
                {generate_image_html(case_study_data.get('hero_image'),
                                   'Case study hero image',
                                   extract_text_metadata(hero_image))}
                <div class="hero-overlay">
                    <h1>{case_study_data['title']}</h1>
                    <p>{case_study_data.get('subtitle', '')}</p>
                </div>
            </div>

            <!-- Executive Summary -->
            {generate_executive_summary_html(case_study_data)}

            <!-- Two-Column Content Grid -->
            <div class="content-grid">
                <!-- Challenge Section -->
                <div class="section" id="challenge">
                    <h2>The Challenge</h2>
                    <div class="section-content">
                        <p>{case_study_data['challenge']}</p>
                        {generate_image_html(
                            case_study_data.get('challenge_image'),
                            'Challenge visualization',
                            extract_text_metadata(challenge_image)
                        )}
                    </div>
                </div>

                <!-- Solution Section -->
                <div class="section" id="solution">
                    <h2>Our Solution</h2>
                    <div class="section-content">
                        <p>{case_study_data['solution']}</p>
                        {generate_image_html(
                            case_study_data.get('solution_image'),
                            'Solution diagram',
                            extract_text_metadata(solution_image)
                        )}
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            {generate_results_html(case_study_data)}

            <!-- Interactive Elements (hidden in print) -->
            <div class="no-print">
                <div class="navigation">
                    <a href="#challenge">Jump to Challenge</a>
                    <a href="#solution">Jump to Solution</a>
                    <a href="#results">Jump to Results</a>
                </div>
            </div>
        </div>

        <!-- JavaScript for Enhanced Experience -->
        <script>
            // Image lazy loading
            if ('IntersectionObserver' in window) {{
                const imageObserver = new IntersectionObserver((entries) => {{
                    entries.forEach(entry => {{
                        if (entry.isIntersecting) {{
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }}
                    }});
                }});

                document.querySelectorAll('img[data-src]').forEach(img => {{
                    imageObserver.observe(img);
                }});
            }}

            // Print functionality
            function printCaseStudy() {{
                window.print();
                return false;
            }}

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {{
                if (e.ctrlKey && e.key === 'p') {{
                    e.preventDefault();
                    printCaseStudy();
                }}
            }});
        </script>
    </body>
    </html>
    """

    return html_content
```

#### Option B: Canvas-Based HTML Rendering
**Description:** Use HTML5 Canvas to recreate visual artifacts with vector graphics

**Pros:**
- Scalable graphics
- Animation capabilities
- Interactive elements
- Smaller file sizes

**Cons:**
- More complex implementation
- Accessibility challenges
- SEO limitations

**Technical Implementation:**
```javascript
// Frontend Canvas Rendering
class CaseStudyCanvas {
    constructor(container, caseStudyData) {
        this.container = container;
        this.data = caseStudyData;
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Set high DPI for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.container.appendChild(this.canvas);
        this.render();
    }

    render() {
        // Draw vector elements
        this.drawHeader();
        this.drawChallenge();
        this.drawSolution();
        this.drawMetrics();

        // Overlay images
        if (this.data.images) {
            this.drawImages();
        }
    }

    drawHeader() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, '#1e3a5f');
        gradient.addColorStop(1, '#2563eb');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, 150);

        // Add text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Inter';
        this.ctx.fillText(this.data.title, 40, 90);
    }

    async drawImages() {
        for (const image of this.data.images) {
            const img = new Image();
            img.src = image.url;

            await new Promise(resolve => {
                img.onload = resolve;
            });

            // Position based on placement
            const position = this.getImagePosition(image.placement);

            // Apply shadow for depth
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 5;

            this.ctx.drawImage(img, position.x, position.y,
                              position.width, position.height);
        }
    }
}
```

### 2.3 OCR and Text Extraction Options

#### Option A: Tesseract OCR Integration
**Description:** Extract text from AI-generated images for accessibility and search

**Technical Implementation:**
```python
import pytesseract
from PIL import Image
import io

def extract_text_from_image(image_data, language='eng'):
    """Extract text from base64 image using Tesseract OCR"""
    try:
        # Convert base64 to PIL Image
        img_buffer = base64_to_image_buffer(image_data)
        img = Image.open(img_buffer)

        # Preprocess image for better OCR
        img = img.convert('L')  # Grayscale
        img = img.resize((img.width * 2, img.height * 2),
                         Image.Resampling.LANCZOS)  # Upscale

        # Extract text
        text = pytesseract.image_to_string(
            img,
            lang=language,
            config='--psm 6 --oem 3'
        )

        # Extract structured data
        data = pytesseract.image_to_data(
            img,
            lang=language,
            output_type=pytesseract.Output.DICT
        )

        return {
            'text': text,
            'structured': data,
            'confidence': calculate_confidence(data)
        }

    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        return {'text': '', 'structured': {}, 'confidence': 0}
```

#### Option B: AI-Powered Image Analysis
**Description:** Use vision models to describe visual content

**Technical Implementation:**
```python
async def analyze_image_with_ai(image_data):
    """Use AI model to describe image content"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": "gpt-4-vision-preview",
                    "messages": [{
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Describe this business diagram in detail. Focus on the key message, data points, and visual elements. Provide a comprehensive description for accessibility."
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": image_data}
                            }
                        ]
                    }],
                    "max_tokens": 500
                }
            )

            result = response.json()
            return result['choices'][0]['message']['content']

    except Exception as e:
        logger.error(f"AI image analysis failed: {e}")
        return "Business visualization diagram"
```

---

## 3. Recommended Implementation Strategy

### Phase 1: Quick Wins (Week 1)
1. **Enhanced PDF Export**
   - Improve image placement and sizing
   - Add print optimization
   - Implement text overlays for key metrics

2. **HTML Print Optimization**
   - Add print CSS media queries
   - Implement page break controls
   - Add print preview functionality

### Phase 2: Advanced Features (Week 2-3)
1. **OCR Integration**
   - Add Tesseract for text extraction
   - Generate alt attributes for accessibility
   - Create searchable PDF exports

2. **WeasyPrint Implementation**
   - Create HTML-to-PDF pipeline
   - Develop print-optimized templates
   - Implement advanced typography

### Phase 3: Innovation (Week 4+)
1. **Vector Generation**
   - Experiment with SVG output from Gemini
   - Implement hybrid vector-raster PDFs
   - Create animated web exports

2. **Interactive Exports**
   - Add canvas-based rendering
   - Implement zoomable charts
   - Create responsive data visualizations

---

## 4. Technical Requirements

### Additional Dependencies
```txt
# For enhanced PDF generation
weasyprint==61.2          # HTML to PDF with CSS support
pypdf==3.17.4             # PDF manipulation
img2pdf==0.4.4            # Direct image to PDF conversion

# For OCR and image processing
pytesseract==0.3.11       # OCR engine
opencv-python==4.8.1.78   # Advanced image processing

# For vector graphics
svgwrite==1.4.3           # SVG generation
cairosvg==2.7.1           # SVG to PDF conversion

# For AI vision analysis
openai==1.6.1             # GPT-4 Vision API
```

### Performance Considerations
1. **Image Optimization**
   - Compress images before embedding
   - Use WebP format for better compression
   - Implement lazy loading for HTML exports

2. **Caching Strategy**
   - Cache processed images
   - Store OCR results
   - Pre-generate PDF templates

3. **Export Performance**
   - Use background tasks for exports
   - Implement progress indicators
   - Support batch exports

---

## 5. Implementation Examples

### Complete Enhanced PDF Export Function
```python
@app.route('/api/export/enhanced-pdf', methods=['POST'])
def export_enhanced_pdf():
    """Export enhanced PDF with advanced features"""
    try:
        data = request.get_json()
        case_study_data = data.get('caseStudy', {})

        # Create PDF with enhanced features
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )

        # Enhanced styles
        styles = getSampleStyleSheet()

        # Custom styles with Calance branding
        title_style = ParagraphStyle(
            'CalanceTitle',
            parent=styles['Heading1'],
            fontSize=28,
            spaceAfter=20,
            textColor=colors.HexColor('#1e3a5f'),
            fontName='Helvetica-Bold',
            alignment=TA_CENTER
        )

        # Story elements
        story = []

        # 1. Hero section with full-width image and overlay
        images = case_study_data.get('images', [])
        hero_img = next((img for img in images if img.get('placement') == 'hero'), None)

        if hero_img:
            # Create hero section with image
            hero_section = create_hero_section(
                hero_img['url'],
                case_study_data.get('title', ''),
                title_style
            )
            story.append(hero_section)
            story.append(FrameBreak())

        # 2. Two-column layout for challenge and solution
        if case_study_data.get('challenge') and case_study_data.get('solution'):
            two_column = create_two_column_section(case_study_data, images)
            story.append(two_column)

        # 3. Results and metrics
        if case_study_data.get('results'):
            story.append(create_results_section(case_study_data))

        # 4. Call to action
        story.append(create_cta_section())

        # Build PDF
        doc.build(story)

        # Return PDF
        pdf_bytes = buffer.getvalue()
        buffer.close()

        return jsonify({
            "success": True,
            "pdf_data": base64.b64encode(pdf_bytes).decode('utf-8'),
            "filename": f"enhanced-case-study-{case_study_data.get('clientName', 'export').lower().replace(' ', '-')}.pdf"
        })

    except Exception as e:
        logger.error(f"Error exporting enhanced PDF: {str(e)}")
        return jsonify({"error": "Failed to export PDF"}), 500

def create_hero_section(image_url, title, style):
    """Create hero section with full-width image"""
    elements = []

    # Add image
    img_buffer = base64_to_image_buffer(image_url)
    if img_buffer:
        img = RLImage(
            img_buffer,
            width=7.5*inch,
            height=4*inch,
            hAlign='CENTER'
        )
        elements.append(img)
        elements.append(Spacer(1, 0.25*inch))

    # Add title overlay
    if title:
        elements.append(Paragraph(title, style))

    return KeepTogether(elements)
```

### Complete HTML Export with Print Optimization
```python
@app.route('/api/export/enhanced-html', methods=['POST'])
def export_enhanced_html():
    """Export HTML with print optimization and accessibility"""
    try:
        data = request.get_json()
        case_study_data = data.get('caseStudy', {})

        # Extract text from images for accessibility
        enhanced_data = enhance_with_image_text(case_study_data)

        # Generate HTML with Jinja2 template
        template = app.jinja_env.get_template('case_study_enhanced.html')
        html_content = template.render(
            case_study=enhanced_data,
            brand=CALANCE_BRAND,
            generated_at=datetime.now().isoformat()
        )

        # Minify HTML if needed
        if app.config.get('MINIFY_HTML', False):
            html_content = minify_html(html_content)

        return jsonify({
            "success": True,
            "content": html_content,
            "filename": f"case-study-{case_study_data.get('clientName', 'export').lower().replace(' ', '-')}.html"
        })

    except Exception as e:
        logger.error(f"Error exporting enhanced HTML: {str(e)}")
        return jsonify({"error": "Failed to export HTML"}), 500

def enhance_with_image_text(data):
    """Add extracted text from images to data"""
    if 'images' not in data:
        return data

    enhanced = data.copy()
    enhanced['image_texts'] = {}

    for image in data['images']:
        placement = image.get('placement', 'unknown')

        # Try OCR first
        ocr_result = extract_text_from_image(image['url'])
        if ocr_result['text'].strip():
            enhanced['image_texts'][placement] = {
                'text': ocr_result['text'],
                'confidence': ocr_result['confidence']
            }
        else:
            # Fall back to AI analysis
            description = asyncio.run(
                analyze_image_with_ai(image['url'])
            )
            enhanced['image_texts'][placement] = {
                'text': description,
                'confidence': 'ai-generated'
            }

    return enhanced
```

---

## 6. Best Practices and Guidelines

### Image Handling Best Practices
1. **Resolution Optimization**
   - Screen: 72-96 PPI
   - Print: 300 PPI minimum
   - Use appropriate formats (PNG for graphics, JPEG for photos)

2. **File Size Management**
   - Compress images before embedding
   - Use progressive JPEGs
   - Consider WebP for web exports

3. **Color Management**
   - Use sRGB for web exports
   - Convert to CMYK for print PDFs
   - Maintain brand color consistency

### Accessibility Guidelines
1. **Alt Text Requirements**
   - Describe content and function
   - Include data from charts/graphs
   - Keep descriptions concise but complete

2. **Text Extraction**
   - OCR for text-based images
   - AI descriptions for complex visuals
   - Manual review for accuracy

3. **Structure and Navigation**
   - Use semantic HTML
   - Provide table of contents
   - Ensure keyboard navigation

### Print Optimization
1. **CSS Print Styles**
   - Remove unnecessary elements
   - Optimize font sizes
   - Control page breaks

2. **PDF Settings**
   - Embed fonts
   - Include metadata
   - Optimize for distribution

---

## 7. Conclusion and Next Steps

The current implementation provides a solid foundation for AI-generated visual artifacts. The recommended approach involves incremental improvements that balance development effort with user value.

**Immediate Actions:**
1. Implement enhanced PDF export with better image handling
2. Add print CSS optimization to HTML exports
3. Begin OCR integration for accessibility

**Future Enhancements:**
1. Explore WeasyPrint for advanced typography
2. Investigate vector graphics generation
3. Develop interactive export features

By following this roadmap, Calance Edge will provide industry-leading export capabilities that showcase AI-generated content in the most professional and accessible format possible.

---

**Appendix: Additional Resources**

- [ReportLab User Guide](https://www.reportlab.com/documentation/)
- [WeasyPrint Documentation](https://weasyprint.readthedocs.io/)
- [CSS Print Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/print)
- [Tesseract OCR Installation](https://tesseract-ocr.github.io/tessdoc/Installation.html)
- [WebP Compression Guide](https://developers.google.com/speed/webp/docs/c_api)