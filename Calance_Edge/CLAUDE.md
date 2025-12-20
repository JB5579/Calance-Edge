# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Calance Edge** is a unified web application that consolidates AI-powered sales enablement tools for Calance leadership. It transforms manual sales artifact creation (case studies, presentations, recruiting materials) into an efficient, automated workflow.

**Core Architecture**: React + Vite frontend (port 5173) + Flask backend (port 5000) with OpenRouter AI integration.

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
npm run lint                   # Lint code
npm run preview                # Preview production build
```

### Backend (Flask + Python)
```bash
cd backend
pip install -r requirements.txt    # Install dependencies
python app.py                      # Start dev server (http://localhost:5000)
```

### Docker (Full Stack)
```bash
docker-compose up --build          # Build and start all services
docker-compose down                # Stop all services
docker-compose logs -f backend     # View backend logs
docker-compose logs -f frontend    # View frontend logs
```

**Port Mapping (Docker):**
- Frontend: http://localhost:5173 (Docker maps to port 80 in container)
- Backend: http://localhost:5000
- Backend API: http://localhost:5000/api

### Health Check
```bash
curl http://localhost:5000/api/health   # Verify backend is running
```

### Testing API Endpoints
```bash
# Test case study generation
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{"clientName": "Test Client", "industry": "Technology", "challenge": "Test challenge"}'

# Test presentation generation
curl -X POST http://localhost:5000/api/presentation/generate \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Presentation", "objective": "Test objective"}'

# Test recruiting tool generation
curl -X POST http://localhost:5000/api/recruiting/generate \
  -H "Content-Type: application/json" \
  -d '{"tool": "jobDescription", "role": "Software Engineer"}'
```

## Architecture

### Frontend Structure
- **Framework**: React 18 with Vite 7, Tailwind CSS 3
- **State Management**: React Hook Form for forms, local state for app navigation
- **Key Dependencies**: lucide-react (icons), yup (validation), react-hook-form
- **Single File Architecture**: Currently all code is in `frontend/src/App.jsx` (monolithic by design for MVP speed)
- **Brand System**: Inline brand configuration with Calance colors (navy, blue, orange) defined at top of App.jsx

### Backend Structure
- **Framework**: Flask 2.3 with CORS enabled
- **Single File Architecture**: All API routes and logic in `backend/app.py` (monolithic by design for MVP speed)
- **AI Integration**: OpenRouter API via httpx for async calls
  - Case Study Analysis: `anthropic/claude-sonnet-4.5`
  - Case Study Images: `google/gemini-3-pro-image-preview`
  - Case Study Refinement: `anthropic/claude-sonnet-4.5`
  - Presentation Generation: `google/gemini-2.5-flash-image-preview`
  - Presentation Refinement: `anthropic/claude-sonnet-4.5`
  - Recruiting Tools: `anthropic/claude-haiku-4.5` (fast, cost-effective)
- **PDF Generation**: ReportLab for case study exports
- **Image Processing**: Pillow (PIL) for AI-generated image embedding
- **Async Support**: nest_asyncio allows async functions in Flask context

### API Endpoints Pattern
All endpoints follow the pattern: `/api/<module>/<action>`
- `/api/health` - Health check
- `/api/generate/case-study` - Generate case study (supports both freeform and structured input)
- `/api/presentation/generate` - Generate sales presentation
- `/api/recruiting/generate` - Generate recruiting content (8 different tools)
- `/api/export/pdf` - Export any content as PDF
- `/api/export/html` - Export any content as standalone HTML

### Three Module Architecture
1. **Case Study Edge**: Transform client stories into branded case studies (PDF/HTML export)
2. **Presentation Edge**: Build sales presentations (HTML export with keyboard navigation)
3. **Recruiting Toolkit**: 8 AI-powered recruiting tools (copy-to-clipboard text output)

## Key Design Patterns

### Workflow Philosophy
All modules follow the same pattern:
1. **Input** → User fills form with minimal required data
2. **Generate** → AI creates first draft using fast model
3. **Preview** → Live preview shows generated content
4. **Refine** → User provides natural language feedback
5. **Regenerate** → AI refines using quality model
6. **Export** → One-click download (PDF/HTML/clipboard)

### AI Model Strategy
- **Case Studies**: Two-step approach - Claude Sonnet 4.5 for analysis/refinement + Gemini 3 Pro for images
- **Presentations**: Gemini 2.5 Flash for initial generation + Claude Sonnet 4.5 for refinement
- **Recruiting**: Claude Haiku 4.5 (fast, cost-effective for template-based tasks)
- **Image Generation**: Gemini 3 Pro Image Preview (superior text rendering and multi-image support)
- **Cost Optimization**: Different models per use case to balance speed, quality, and cost

### State Management
- **No global state library**: Uses React hooks and local component state
- **Form state**: Managed by react-hook-form with yup validation
- **API responses**: Stored in component state, not persisted

## Environment Configuration

### Required Environment Variables
```bash
# Backend (.env in root directory)
OPENROUTER_API_KEY=sk-or-v1-xxxxx    # Required for AI features

# Optional
FLASK_DEBUG=True                      # Enable debug mode
FLASK_ENV=development                 # Environment setting
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1    # OpenRouter API URL

# AI Model Configuration (optional - overrides defaults)
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5
```

### CORS Configuration
Backend allows these frontend origins:
- `http://localhost:5173-5176` (Vite dev servers)
- `http://127.0.0.1:5173-5176`

## Project Status & Workflow

This project follows the **BMad Method** (see `.bmad/` directory):
- ✅ Phase 1-3: Discovery, Planning, Solutioning complete
- ✅ Phase 4: Implementation complete (All MVP features delivered)
  - Day 1: ✅ React + Flask full-stack setup
  - Day 2: ✅ Case Study Edge with image generation
  - Day 3: ✅ Presentation Edge implementation
  - Day 4: ✅ Recruiting Toolkit implementation
  - Day 5: ✅ Integration, testing, and deployment
- See `docs/bmm-workflow-status.yaml` for current sprint status
- See `docs/epics.md` for feature breakdown
- See `calance-Edge-technical-spec.md` for complete technical specification

## Important Technical Details

### Monolithic Architecture (By Design)
- **Frontend**: Single `App.jsx` file (~2000+ lines) contains all components and modules
- **Backend**: Single `app.py` file contains all routes, services, and logic
- **Rationale**: Optimized for MVP development speed (5-day timeline). Refactor to modules in Phase 2.

### Brand Consistency
All outputs must use Calance brand guidelines:
- **Colors**: Navy (#1e3a5f), Blue (#2563eb), Orange (#f97316)
- **Typography**: Inter font family
- **Logo**: Embedded in all exports
- Brand config is defined at top of `frontend/src/App.jsx`

### API Request/Response Pattern
```javascript
// Request structure
{
  "client_name": "string",
  "industry": "string",
  "challenge": "string",
  "solution": "string",
  "metrics": [{ "label": "", "before": "", "after": "", "improvement": "" }],
  "benefits": ["string"],
  "feedback": "string"  // For refinement requests
}

// Response structure
{
  "success": true,
  "draft": { /* generated content */ },
  "preview_html": "<div>...</div>",
  "generation_id": "cs_abc123"
}
```

### Export Generation
- **PDF**: Generated server-side using ReportLab with Calance branding
- **HTML**: Standalone files with embedded CSS/images (base64) for offline use
- **Presentations**: Self-contained HTML with keyboard navigation (arrow keys)

## Development Practices

### When Adding Features
1. Frontend changes go in `frontend/src/App.jsx`
2. Backend changes go in `backend/app.py`
3. New API endpoints should follow `/api/<module>/<action>` pattern
4. Always include error handling with try/catch
5. Use async/await for OpenRouter API calls
6. Test with `curl` before frontend integration

### When Modifying AI Prompts
- Prompts are inline in `backend/app.py` within the `AIService` class
- Use `_build_generation_prompt()` for initial generation
- Use `_build_refinement_prompt()` for feedback-based refinement
- Always specify system role for context
- Keep prompts focused on business outcomes, not implementation details

### Testing Strategy
- **Manual testing**: Use browser for frontend, `curl` for API
- **No automated tests**: Not required for MVP (5-day timeline)
- Health endpoint (`/api/health`) verifies backend is running
- Check browser console for frontend errors
- Check `docker-compose logs -f backend` for backend errors

## Common Issues & Solutions

### Frontend not connecting to backend
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check CORS configuration in `backend/app.py` (lines 41-49)
- Verify `VITE_API_URL` environment variable if using Docker
- Check browser console for CORS errors

### OpenRouter API errors
- Verify `OPENROUTER_API_KEY` is set in `.env` file
- Check backend logs for API response errors
- Fallback mock data is used if API key is missing
- Ensure API key has sufficient credits

### Docker build failures
- Clear volumes: `docker-compose down -v`
- Rebuild: `docker-compose up --build`
- Check logs: `docker-compose logs -f`
- Ensure Node.js and Python versions are compatible

### Image generation not working
- Verify model configuration: `MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview`
- Check if images are returned in API response `images[]` array
- For PDF export issues, verify Pillow is installed: `pip install Pillow`

### Debugging Tips
- Frontend: Check browser console (F12) for React errors
- Backend: Check Flask logs at `http://localhost:5000/api/health`
- API testing: Use curl commands to test endpoints directly
- Docker: Use `docker-compose logs -f service-name` for real-time logs

## File Locations

```
Calance_Edge/
├── frontend/
│   ├── src/
│   │   └── App.jsx              # All frontend code (components, state, UI)
│   ├── package.json             # Frontend dependencies
│   └── Dockerfile               # Frontend container config
├── backend/
│   ├── app.py                   # All backend code (routes, AI service, exports)
│   ├── requirements.txt         # Backend dependencies
│   └── Dockerfile               # Backend container config
├── docs/
│   ├── epics.md                 # Feature breakdown
│   └── bmm-workflow-status.yaml # Sprint status
├── calance-Edge-technical-spec.md  # Complete technical specification
├── docker-compose.yml           # Multi-container orchestration
└── .env                         # Environment variables (not committed)
```

## Recent Changes (Phase 1 & 2 Implementation)

### Phase 1: Image Generation Integration ✅ COMPLETE

**What Changed:**
- ✅ **Backend**: Images now returned in API responses from OpenRouter
- ✅ **Frontend**: Images displayed in case study preview (hero, challenge, solution)
- ✅ **PDF Export**: AI-generated images embedded in PDF exports using ReportLab + PIL
- ✅ **Image Processing**: Added `base64_to_image_buffer()` helper for PDF embedding

**Key Files Modified:**
- `backend/app.py`:
  - `_parse_ai_response()` now includes `images[]` array in response
  - `base64_to_image_buffer()` converts base64 data URLs to PIL images for PDF
  - `export_pdf()` embeds hero, challenge, and solution images in PDFs
  - `_parse_presentation_response()` distributes images to slides
- `backend/requirements.txt`: Added `Pillow==10.0.0` for image processing
- `frontend/src/App.jsx`: `CaseStudyPreview` component displays AI-generated images

**How It Works:**
1. OpenRouter API returns images as base64 data URLs in `message.images[]`
2. Backend parses images and assigns placement: `hero`, `challenge`, `solution`, `metrics`, `testimonial`
3. Frontend receives images in response and displays them in preview
4. PDF export converts base64 to PIL images and embeds in document

### Phase 2: AI-First Content Synthesis ✅ COMPLETE

**What Changed:**
- ✅ **Freeform Input**: Users can now paste raw notes instead of filling structured forms
- ✅ **Enhanced Prompts**: Prompts redesigned for synthesis vs template-filling
- ✅ **Model Optimization**: Recruiting tools now use Claude Haiku 4.5 (10x cheaper, 3x faster)

**Key Files Modified:**
- `backend/app.py`:
  - `_build_generation_prompt()` now handles both freeform and structured input
  - Detects `rawNotes` or `freeformInput` and uses synthesis-focused prompts
  - Recruiting tools switched from Gemini Flash to `anthropic/claude-haiku-4.5`
- `frontend/src/App.jsx`:
  - Added input mode toggle: "Quick Notes (AI Synthesis)" vs "Structured Form"
  - Added `freeformNotes` state and large textarea for raw input
  - Updated `handleGenerate()` to send `rawNotes` for freeform mode

**User Experience:**
- **Freeform Mode**: User pastes meeting notes, emails, or informal text → AI synthesizes complete case study
- **Structured Mode**: Traditional form with specific fields (still enhanced with better prompts)

**Prompt Strategy:**
- **Freeform**: AI synthesizes narrative from raw notes, extracts facts, adds context
- **Structured**: AI enhances input with industry context, compelling headlines, deeper insights

### Phase 3: Two-Step AI Architecture ✅ COMPLETE & ENHANCED

**What Changed:**
- ✅ **Two-Step Process**: Freeform input now uses Claude for full narrative + Gemini for visuals ONLY
- ✅ **Full Content Synthesis**: Claude Sonnet 4.5 generates COMPLETE case study narrative (not just extraction)
- ✅ **Image-Only Generation**: Gemini 3 Pro generates branded images only (no JSON parsing)
- ✅ **Model Upgrades**: Claude 3.5 → 4.5, Gemini 2.5 → Gemini 3 Pro Image

**Architecture:**
```
Freeform Input → Claude Sonnet 4.5 (FULL narrative synthesis) + Gemini 3 Pro (images only) → Export
Structured Input → Gemini 3 Pro (direct) → Export
```

**Key Files Modified:**
- `backend/app.py`:
  - Lines 118-242: Enhanced `_analyze_freeform_content()` - now synthesizes FULL narrative content
  - Lines 244-345: Added `_generate_images_only()` - Gemini generates images only (no JSON)
  - Lines 1247-1279: Updated `/api/generate/case-study` endpoint - uses Claude narrative + Gemini images
  - System prompt improved for narrative storytelling vs extraction
  - Temperature: 0.5 (balanced), max_tokens: 6000 (full narrative)

**How It Works:**

**Step 1: Claude Narrative Synthesis** (freeform only)
- Model: `anthropic/claude-sonnet-4.5`
- Temperature: 0.5 (balanced for accuracy + creativity)
- Max Tokens: 6000 (full narrative content)
- Generates: title, subtitle, executiveSummary, challenge (3-4 paragraphs), solution (3-4 paragraphs), implementation (2-3 paragraphs), results (2-3 paragraphs), testimonial, roi, futureOutlook, metrics, pain points, technologies, integrations, timeline
- Returns: COMPLETE case study narrative ready for export

**Step 2: Gemini Image Generation ONLY**
- Model: `google/gemini-3-pro-image-preview` (Nano Banana Pro)
- Temperature: 0.7 (creative)
- Max Tokens: 1000 (minimal, images only)
- Input: Client name, industry, metrics summary
- Output: 2 branded images (hero + metrics dashboard)
- NO JSON parsing (avoids empty content issue)

**Model Details:**

**Content Analysis (Step 1 - Freeform only):**
- Model: `anthropic/claude-sonnet-4.5`
- Purpose: Extract and structure information from raw notes
- Context: 200K tokens
- Cost: ~$0.05 per analysis

**Visual Generation (Step 2 - All modes):**
- Model: `google/gemini-3-pro-image-preview` (Nano Banana Pro)
- Latest image generation model (Nov 2025)
- Superior text rendering, 2K/4K support, multi-image blending
- Cost: ~$0.02 per generation

**Refinement:**
- Model: `anthropic/claude-sonnet-4.5`
- Purpose: High-quality content refinement
- Upgraded from Claude 3.5 Sonnet

**Recruiting Tools:**
- Model: `anthropic/claude-haiku-4.5`
- Fast (1-2 sec response time)
- Cost-effective (~10x cheaper than Sonnet)
- Perfect for text-only template tasks

### Phase 4: Unified Output Approach ✅ COMPLETE

**Problem Solved:**
- FreeForm produced beautiful images but 5+ pages of dense text (not scannable)
- Structured produced clean single-page infographic (easy to scan)
- Users wanted FreeForm's content synthesis + Structured's visual format

**What Changed:**
- ✅ **Unified Output**: Both input methods now produce the SAME single-page infographic format
- ✅ **Infographic Generation**: FreeForm now generates ONE infographic document (not 3 separate images)
- ✅ **Smart PDF Export**: Detects infographic and outputs just the image (no text walls)
- ✅ **Performance**: 67% faster image generation (1 image vs 3)

**Architecture (Unified):**
```
FreeForm Input:
  Step 1: Claude → Extracts painPoints, technologies, metrics as BULLETS
  Step 2: Gemini → Creates SINGLE 8.5x11 infographic with 3-column layout
  PDF Export → Full-page infographic (no text)

Structured Input:
  Step 1: Gemini → Creates SINGLE 8.5x11 infographic directly
  PDF Export → Full-page infographic (no text)
```

**Key Files Modified:**
- `backend/app.py`:
  - `_generate_complete_case_study()` (lines 253-454): Now generates ONE infographic image
  - `export_pdf()` (lines 1599-1860): Added INFOGRAPHIC MODE vs LEGACY MODE
  - Infographic prompt uses Claude's extracted bullet points

**Output Format (Both Methods):**
- Single 8.5x11 portrait document
- 3-column layout: Challenge | Solution | Results
- Bullet points (not paragraphs)
- Large visual metrics with percentages
- Professional consulting firm quality

**PDF Export Modes:**
1. **INFOGRAPHIC MODE**: Single image with `infographic_` ID prefix → Full-page output
2. **LEGACY MODE**: Multiple images or no infographic → Text-based layout

**Documentation**: See `docs/UNIFIED_OUTPUT_APPROACH.md` for full details.

### Key Implementation Notes

#### Freeform vs Structured Input
- **Freeform Mode**: Users paste raw notes → AI synthesizes into complete case study
  - Uses Claude Sonnet 4.5 to extract and structure content
  - Uses Gemini 3 Pro to generate single infographic image
  - Output: Professional 3-column infographic (Challenge | Solution | Results)
- **Structured Mode**: Users fill form fields → AI enhances with context
  - Uses Gemini 3 Pro directly for both content and image generation
  - Output: Same professional infographic format
- **Both methods now produce identical single-page infographic outputs**

#### Image Generation
- All case studies now generate ONE 8.5x11 infographic (not 3 separate images)
- Images are returned as base64 data URLs in API response
- PDF export automatically detects infographic and outputs full-page image
- Supported image placements: `hero`, `challenge`, `solution`, `metrics`, `testimonial`

#### Model Configuration
Models are configurable via environment variables:
- `MODEL_CASE_STUDY_ANALYSIS`: Claude for content analysis
- `MODEL_CASE_STUDY_IMAGE`: Gemini for image generation
- `MODEL_CASE_STUDY_REFINEMENT`: Claude for refinement
- Recruiting tools use Claude Haiku 4.5 for speed/cost efficiency

### Testing the Changes

**Test Case Study with Images:**
```bash
# Backend must be running
cd backend
python app.py

# Test freeform input with image generation
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{
    "rawNotes": "Met with Beazer Homes yesterday. They love Scout AI. Cut land analysis from weeks to days. Doing 2-3x more deals now. Real estate market is super competitive.",
    "clientName": "Beazer Homes",
    "industry": "Real Estate"
  }'

# Response will include images[] array with base64 data URLs
```

**Verify Images in Frontend:**
1. Start frontend: `cd frontend && npm run dev`
2. Open http://localhost:5173
3. Select "Quick Notes (AI Synthesis)" mode
4. Paste informal notes
5. Click "Generate Case Study Draft"
6. Check preview for hero image, challenge image, solution image
7. Export PDF and verify images are embedded

**Export PDF with Images:**
```bash
# PDF export now includes all AI-generated images
curl -X POST http://localhost:5000/api/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"caseStudy": {...with images array...}}'

# Response contains base64-encoded PDF with embedded images
```

## Additional Resources

- **Technical Spec**: `calance-Edge-technical-spec.md` - Complete implementation guide with all modules, APIs, and design specs
- **README**: `README.md` - Project overview and quick start guide
- **Epics**: `docs/epics.md` - User stories and feature breakdown
- **BMad Workflow**: `.bmad/bmm/` - Agentic development methodology documentation
- **AI Analysis**: `docs/ai-content-synthesis-review.md` - Detailed analysis of AI-first approach (if created)
