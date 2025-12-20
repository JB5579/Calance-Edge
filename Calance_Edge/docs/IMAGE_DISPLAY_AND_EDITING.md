# How AI-Generated Images Are Combined Into a Cohesive Case Study

## Overview

The 3 AI-generated images (hero, metrics, timeline) are **NOT combined into a single image**. Instead, they are:
1. **Stored separately** with placement metadata
2. **Interwoven with text content** in the frontend preview
3. **Embedded at specific locations** in PDF exports
4. **Editable** through text-based feedback (not direct image editing)

This creates a cohesive, professional case study document without the complexity of image composition.

## The Three Images and Their Roles

### 1. Hero Image (`placement: "hero"`)
**Purpose**: Top banner showcasing the case study title and client
**Dimensions**: 1920x1080px (16:9 aspect ratio)
**Placement**: Top of document, immediately after header
**Content**:
- Case study title overlaid on professional background
- Client name and industry
- Calance branding (logo, colors)
- Industry-themed imagery (abstract, not literal)

### 2. Metrics Dashboard (`placement: "metrics"`)
**Purpose**: Visual representation of key results
**Dimensions**: 1600x900px (landscape)
**Placement**: In "Key Results" section, below narrative text
**Content**:
- Bar charts, gauge charts, or comparison arrows
- Before/after metrics visualization
- Improvement percentages highlighted
- Professional dashboard aesthetic (Bloomberg/Tableau style)

### 3. Timeline Graphic (`placement: "timeline"`)
**Purpose**: Implementation roadmap visualization
**Dimensions**: 1600x600px (wide landscape)
**Placement**: In "Implementation" section, alongside narrative
**Content**:
- Horizontal timeline with project phases
- Milestones and key dates
- Phase progression indicators
- Gantt-chart-like visualization

## How Images Are Stored

### Backend Response Structure

```json
{
  "success": true,
  "data": {
    "client_name": "Confidential National Homebuilder",
    "industry": "Residential Homebuilding",
    "title": "National Homebuilder Achieves 85% Faster Deal Evaluation",
    "subtitle": "Transforming manual land acquisition...",
    "executiveSummary": "A Fortune 1000 homebuilder...",
    "challenge": "Operating across 16+ divisions...",
    "solution": "Calance designed and delivered...",
    "implementation": "The implementation followed...",
    "results": "The transformation delivered...",
    "metrics": [
      { "label": "Deal Evaluation Time", "before": "3-4 weeks", "after": "Same day", "improvement": "85% faster" }
    ],
    "images": [
      {
        "id": "hero_0",
        "url": "data:image/png;base64,iVBORw0KGgoAAAANS...",  ← Base64-encoded image
        "type": "image/png",
        "placement": "hero",                                     ← Placement metadata
        "alt": "Hero visualization"
      },
      {
        "id": "metrics_0",
        "url": "data:image/png;base64,iVBORw0KGgoAAAANS...",
        "type": "image/png",
        "placement": "metrics",                                  ← Placement metadata
        "alt": "Metrics visualization"
      },
      {
        "id": "timeline_0",
        "url": "data:image/png;base64,iVBORw0KGgoAAAANS...",
        "type": "image/png",
        "placement": "timeline",                                 ← Placement metadata
        "alt": "Timeline visualization"
      }
    ]
  }
}
```

**Key Points**:
- Images are **base64-encoded data URLs** (embedded, not external files)
- Each image has a **`placement` field** indicating where it should appear
- Images are **independent assets**, not merged together

## Frontend Display: Draft Preview

### Component: `CaseStudyPreview` (frontend/src/App.jsx:582-781)

The preview creates a **single scrollable document** by interlacing images with text:

```jsx
<div className="overflow-y-auto px-6 py-4 space-y-6">

  {/* 1. ALL IMAGES AT TOP (Optional multi-page view) */}
  {caseStudyData.images && caseStudyData.images.length > 0 && (
    <div className="space-y-4">
      {caseStudyData.images.map((img, idx) => (
        <div key={img.id}>
          <img src={img.url} alt={`Case study page ${idx + 1}`} />
          <div>Page {idx + 1} of {caseStudyData.images.length}</div>
        </div>
      ))}
    </div>
  )}

  {/* 2. TITLE & SUBTITLE */}
  <div>
    <h1>{caseStudyData.title}</h1>
    <p>{caseStudyData.subtitle}</p>
  </div>

  {/* 3. KEY RESULTS WITH METRICS IMAGE */}
  {caseStudyData.metrics && caseStudyData.metrics.length > 0 && (
    <div className="space-y-3">
      {/* Metrics Image (if available) */}
      {caseStudyData.images.find(img => img.placement === 'metrics') && (
        <img
          src={caseStudyData.images.find(img => img.placement === 'metrics').url}
          alt="Key results metrics dashboard"
        />
      )}

      {/* Metrics Table (text fallback) */}
      <div>
        <h3>Key Results</h3>
        {caseStudyData.metrics.map(metric => (
          <div>
            <span>{metric.label}</span>
            <div>{metric.before} → {metric.after}</div>
            <div>{metric.improvement}</div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* 4. EXECUTIVE SUMMARY */}
  {caseStudyData.executiveSummary && (
    <div>
      <h3>Executive Summary</h3>
      <div>{caseStudyData.executiveSummary}</div>
    </div>
  )}

  {/* 5. THE CHALLENGE */}
  <div>
    <h3>The Challenge</h3>
    <div>{caseStudyData.challenge}</div>
  </div>

  {/* 6. OUR SOLUTION */}
  <div>
    <h3>Our Solution</h3>
    <div>{caseStudyData.solution}</div>
  </div>

  {/* 7. IMPLEMENTATION (text + timeline if available) */}
  {caseStudyData.implementation && (
    <div>
      <h3>Implementation</h3>
      <div>{caseStudyData.implementation}</div>
    </div>
  )}

  {/* 8. RESULTS */}
  {caseStudyData.results && (
    <div>
      <h3>Results</h3>
      <div>{caseStudyData.results}</div>
    </div>
  )}

  {/* 9. TESTIMONIAL */}
  {caseStudyData.testimonial && (
    <div>
      <h3>Client Testimonial</h3>
      <div>"{caseStudyData.testimonial}"</div>
    </div>
  )}

  {/* 10. ROI STATEMENT */}
  {caseStudyData.roi && (
    <div>{caseStudyData.roi}</div>
  )}
</div>
```

**Result**: A cohesive, scrollable document where:
- Images appear at **contextually relevant locations**
- Text flows naturally around images
- User sees a **complete case study**, not separate pieces

### Visual Layout

```
┌─────────────────────────────────────────────┐
│  CALANCE              CASE STUDY            │ ← Header
├─────────────────────────────────────────────┤
│                                             │
│  [HERO IMAGE - Full Width Banner]           │ ← Hero image
│                                             │
├─────────────────────────────────────────────┤
│  Title: National Homebuilder Achieves...    │ ← Title text
│  Subtitle: Transforming manual...           │
├─────────────────────────────────────────────┤
│  Key Results                                │
│  ┌───────────────────────────────────────┐ │
│  │ [METRICS DASHBOARD IMAGE]             │ │ ← Metrics image
│  │ (Charts, gauges, comparisons)         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  • Deal Time: 3-4 weeks → Same day (85%)   │ ← Metrics table
│  • Competitors: 5-10 → 80+ (8x)            │   (text fallback)
├─────────────────────────────────────────────┤
│  Executive Summary                          │
│  A Fortune 1000 homebuilder with 16+...    │ ← Narrative text
├─────────────────────────────────────────────┤
│  The Challenge                              │
│  Operating across 16+ divisions as a...    │ ← Narrative text
├─────────────────────────────────────────────┤
│  Our Solution                               │
│  Calance designed and delivered the...     │ ← Narrative text
├─────────────────────────────────────────────┤
│  Implementation                             │
│  ┌───────────────────────────────────────┐ │
│  │ [TIMELINE IMAGE]                      │ │ ← Timeline image
│  │ Phase 1 ──> Phase 2 ──> Deployment   │ │
│  └───────────────────────────────────────┘ │
│  The implementation followed a phased...   │ ← Narrative text
├─────────────────────────────────────────────┤
│  Results & Impact                           │
│  The transformation delivered...           │ ← Narrative text
├─────────────────────────────────────────────┤
│  Client Testimonial                         │
│  "This platform has fundamentally..."      │ ← Quote
├─────────────────────────────────────────────┤
│  ROI: 1,200+ hours saved annually          │ ← ROI summary
└─────────────────────────────────────────────┘
```

## PDF Export: Professional Document

### Component: `/api/export/pdf` (backend/app.py:1568-1750)

The PDF generator creates a **single PDF document** by:
1. Finding images by their `placement` metadata
2. Embedding them at specific locations in the document flow
3. Mixing them with text content using ReportLab

### PDF Document Structure

```python
# backend/app.py:1627-1750

story = []  # ReportLab's "story" = document flow

# 1. HEADER
header_table = Table([['CALANCE', 'CASE STUDY']])
story.append(header_table)
story.append(Spacer(1, 0.3*inch))

# 2. HERO IMAGE (if available)
hero_img = next((img for img in images if img.get('placement') == 'hero'), None)
if hero_img:
    img_buffer = base64_to_image_buffer(hero_img['url'])
    rl_img = RLImage(img_buffer, width=6.5*inch, height=3.66*inch)
    story.append(rl_img)                    # ← Hero embedded here
    story.append(Spacer(1, 0.25*inch))

# 3. TITLE & SUBTITLE
story.append(Paragraph(case_study_data['title'], title_style))
story.append(Paragraph(case_study_data['subtitle'], subtitle_style))

# 4. EXECUTIVE SUMMARY (text)
story.append(Paragraph("Executive Summary", heading_style))
story.append(Paragraph(case_study_data['executiveSummary'], body_style))

# 5. CHALLENGE (text)
story.append(Paragraph("The Challenge", heading_style))
story.append(Paragraph(case_study_data['challenge'], body_style))

# 6. SOLUTION (text)
story.append(Paragraph("Our Solution", heading_style))
story.append(Paragraph(case_study_data['solution'], body_style))

# 7. IMPLEMENTATION (text + timeline image)
story.append(Paragraph("Implementation", heading_style))

# Timeline Image (if available)
timeline_img = next((img for img in images if img.get('placement') == 'timeline'), None)
if timeline_img:
    img_buffer = base64_to_image_buffer(timeline_img['url'])
    rl_img = RLImage(img_buffer, width=6.5*inch, height=2.44*inch)
    story.append(rl_img)                    # ← Timeline embedded here
    story.append(Spacer(1, 0.15*inch))

story.append(Paragraph(case_study_data['implementation'], body_style))

# 8. RESULTS (text)
story.append(Paragraph("Results & Impact", heading_style))
story.append(Paragraph(case_study_data['results'], body_style))

# 9. METRICS DASHBOARD IMAGE
metrics_img = next((img for img in images if img.get('placement') == 'metrics'), None)
if metrics_img:
    story.append(Paragraph("Key Metrics", heading_style))
    img_buffer = base64_to_image_buffer(metrics_img['url'])
    rl_img = RLImage(img_buffer, width=6.5*inch, height=3.66*inch)
    story.append(rl_img)                    # ← Metrics embedded here
    story.append(Spacer(1, 0.15*inch))

# 10. ROI (text)
story.append(Paragraph(case_study_data['roi'], roi_style))

# Build PDF
doc.build(story)
```

**Result**: A professional PDF where:
- Images are **embedded at natural breakpoints** in the narrative
- Content flows like a traditional consulting case study
- Each image **enhances nearby text**, not replaces it

## How Editing Works (No Direct Image Editing)

### The Feedback Loop

Users **cannot edit images directly**. Instead, they provide **text-based feedback** that triggers **regeneration**:

```
User sees draft case study
       ↓
User provides feedback:
  "Make the metrics more prominent in the hero image"
  "Show the implementation timeline as 3 phases instead of 4"
  "Use more modern colors in the dashboard"
       ↓
Backend sends feedback to AI:
  - Original structured data
  - User's feedback text
       ↓
AI regenerates:
  - Claude/Gemini refines content based on feedback
  - New images generated with updated prompts
       ↓
User sees updated draft
```

### Feedback Panel Component

```jsx
// frontend/src/App.jsx:783-820

<FeedbackPanel onRegenerate={handleRegenerate} caseStudyData={currentDraft} />

// User types feedback
<textarea
  placeholder="e.g., Make the ROI more prominent in the headline..."
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
/>

<Button onClick={handleRegenerate}>
  Regenerate Draft
</Button>

// On regenerate, sends to backend:
POST /api/generate/case-study
{
  ...caseStudyData,    // Current content
  feedback: "User's feedback text"
}

// Backend processes with refinement model
if (data.get('feedback')):
    model = app.config['MODEL_CASE_STUDY_REFINEMENT']  # Claude Sonnet 4.5
    prompt = _build_refinement_prompt(data, feedback)
```

### What Happens During Refinement

1. **User provides feedback**: "Make metrics dashboard show ROI more prominently"

2. **Backend calls refinement model** (Claude Sonnet 4.5):
   ```
   Original: [current case study data]
   Feedback: "Make metrics dashboard show ROI more prominently"

   Task: Refine the case study based on this feedback
   ```

3. **AI refines content**:
   - Updates narrative text
   - Adjusts metrics array (if needed)
   - **Regenerates images** with updated prompts

4. **New draft returned**:
   - Updated text content
   - New images (regenerated from scratch, not edited)
   - Same structure, refined content

### Why No Direct Image Editing?

**Advantages of Feedback-Based Regeneration**:
- ✅ **Maintains consistency**: Images always match text content
- ✅ **Simpler UX**: No need for image editor UI
- ✅ **AI-powered**: Leverages AI understanding of feedback
- ✅ **Quality control**: Each regeneration uses full AI capability

**Trade-offs**:
- ❌ Cannot make pixel-level tweaks (must regenerate)
- ❌ Each regeneration costs API calls
- ❌ Slower than direct editing (requires AI processing)

## HTML Export: Standalone Document

Similar to PDF, but as HTML:

```html
<!-- Generated by /api/export/html -->

<!DOCTYPE html>
<html>
<head>
  <style>
    /* Calance branding CSS */
    .hero-image { width: 100%; max-width: 1200px; }
    .metrics-dashboard { width: 100%; max-height: 600px; }
    .timeline { width: 100%; max-height: 400px; }
  </style>
</head>
<body>
  <header>
    <div>CALANCE</div>
    <div>CASE STUDY</div>
  </header>

  <img src="data:image/png;base64,..." class="hero-image" />  <!-- Hero embedded -->

  <h1>National Homebuilder Achieves 85% Faster Deal Evaluation</h1>
  <p class="subtitle">Transforming manual land acquisition...</p>

  <section>
    <h2>Executive Summary</h2>
    <p>A Fortune 1000 homebuilder...</p>
  </section>

  <section>
    <h2>Key Results</h2>
    <img src="data:image/png;base64,..." class="metrics-dashboard" />  <!-- Metrics embedded -->
    <table><!-- Metrics data --></table>
  </section>

  <section>
    <h2>Implementation</h2>
    <img src="data:image/png;base64,..." class="timeline" />  <!-- Timeline embedded -->
    <p>The implementation followed a phased approach...</p>
  </section>

  <!-- More sections... -->
</body>
</html>
```

**Result**: Self-contained HTML file with:
- Images embedded as base64 data URLs
- No external dependencies
- Works offline
- Can be opened in any browser

## Summary: How It All Works Together

### The Flow

```
1. User inputs freeform notes
         ↓
2. Claude analyzes → structured data
         ↓
3. Gemini generates 3 separate images
   (hero, metrics, timeline)
         ↓
4. Images stored with placement metadata
         ↓
5. Frontend preview interlaces images with text
   (single scrollable document)
         ↓
6. PDF export embeds images at specific locations
   (single PDF file)
         ↓
7. User provides feedback
         ↓
8. AI regenerates content + new images
         ↓
9. Updated draft displayed
```

### Key Principles

1. **Images are separate assets**, not merged
2. **Placement metadata** controls where each appears
3. **Text and images interleaved** for cohesive document
4. **No direct image editing** - feedback-based regeneration
5. **Exports embed images** at contextual locations
6. **Single cohesive artifact** from multiple pieces

### Benefits of This Approach

✅ **Flexible**: Easy to add/remove images
✅ **Maintainable**: Images and text stored separately
✅ **Professional**: Natural document flow
✅ **Editable**: Feedback loop for refinement
✅ **Portable**: Exports work everywhere (PDF/HTML)
✅ **AI-powered**: Regeneration maintains quality

This architecture creates professional case studies that **feel unified** while maintaining **technical flexibility**.
