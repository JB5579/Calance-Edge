# Configuration Update Summary

## What Was Changed

✅ **Security Issue Resolved**: Your OpenRouter API key was found in `.env` but is properly protected by `.gitignore`

✅ **All hardcoded values removed** - No more hardcoded models or URLs in the codebase

✅ **Full configuration control** - You can now change AI models for each module via environment variables

## Quick Start

### 1. Configure Backend Models

Edit `.env` in the root directory:

```bash
# Case Study Module
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5

# Presentation Module
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5

# Recruiting Module
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5
```

### 2. Configure Frontend API URL

Edit `frontend/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Restart Services

```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm run dev

# Or use Docker
docker-compose down
docker-compose up --build
```

## Model Control by Module

### Case Study Edge
- **Analysis Model**: `MODEL_CASE_STUDY_ANALYSIS` (synthesizes narrative from freeform notes)
- **Image Model**: `MODEL_CASE_STUDY_IMAGE` (generates branded images)
- **Refinement Model**: `MODEL_CASE_STUDY_REFINEMENT` (polishes content based on feedback)

### Presentation Edge
- **Generation Model**: `MODEL_PRESENTATION_GENERATION` (creates presentations with images)
- **Refinement Model**: `MODEL_PRESENTATION_REFINEMENT` (enhances based on feedback)

### Recruiting Toolkit
- **Generation Model**: `MODEL_RECRUITING_GENERATION` (creates recruiting content)

## Cost Optimization Examples

### Save 80% on costs (minimal quality impact)
```bash
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-haiku-4.5
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-haiku-4.5
# Keep image models as-is (already optimized)
```

### Maximum Quality (5x cost)
```bash
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_RECRUITING_GENERATION=anthropic/claude-sonnet-4.5
```

## Files Modified

### Backend
- ✅ `backend/.env.example` - Added all model configuration variables
- ✅ `.env` - Updated with model configuration (your actual config)
- ✅ `backend/app.py` - Replaced all hardcoded models with `app.config[]` references

### Frontend
- ✅ `frontend/.env.example` - Created with API URL configuration
- ✅ `frontend/.env` - Created with default values
- ✅ `frontend/src/App.jsx` - Replaced all hardcoded `localhost:5000` with `API_URL` constant

### Docker
- ✅ `docker-compose.yml` - Added all environment variables with defaults

### Documentation
- ✅ `docs/CONFIGURATION.md` - Comprehensive configuration guide (see this file for details!)
- ✅ `docs/CONFIGURATION_SUMMARY.md` - This quick reference guide

## Supported Models

**Anthropic Claude**:
- `anthropic/claude-sonnet-4.5` - Best quality (current default for complex tasks)
- `anthropic/claude-haiku-4.5` - Fast & cheap (current default for recruiting)
- `anthropic/claude-opus-4.5` - Maximum quality (very expensive)

**Google Gemini**:
- `google/gemini-3-pro-image-preview` - Latest image generation (Nano Banana Pro)
- `google/gemini-2.5-flash-image-preview` - Fast with images
- `google/gemini-2.5-flash` - Fast text-only

**OpenAI**:
- `openai/gpt-4o` - High quality alternative
- `openai/gpt-4o-mini` - Fast & affordable
- `openai/gpt-3.5-turbo` - Budget option

Full list: https://openrouter.ai/models

## Current Default Configuration

Your current setup (already optimized for quality/cost balance):

```bash
# Case Study (premium quality for synthesis)
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5

# Presentation (fast generation, premium refinement)
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5

# Recruiting (optimized for speed & cost)
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5
```

## Testing Your Configuration

### 1. Verify backend is using new config

Start backend and check logs:
```bash
cd backend
python app.py
```

You should see no errors about missing environment variables.

### 2. Test Case Study generation

```bash
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{"clientName": "Test Corp", "industry": "Technology", "rawNotes": "Great client, very happy"}'
```

### 3. Check frontend connection

Open http://localhost:5173 and verify:
- No CORS errors in browser console
- API calls succeed
- Case study generation works

## Troubleshooting

### Models not responding
1. Check `OPENROUTER_API_KEY` is set in `.env`
2. Verify model name is correct (check https://openrouter.ai/models)
3. Check OpenRouter account has credits

### Frontend can't connect
1. Verify `VITE_API_URL` in `frontend/.env` matches backend
2. Check backend CORS includes frontend origin
3. Restart Vite dev server: `cd frontend && npm run dev`

### Docker issues
1. Ensure `.env` exists in root directory
2. Run `docker-compose config` to validate
3. Rebuild: `docker-compose down && docker-compose up --build`

## Docker Usage

### ✅ Your `.env` File IS Used by Docker

Docker Compose automatically reads the `.env` file in the root directory and passes variables to containers.

### When to Rebuild vs Restart

**Backend Changes (Just Restart - Fast)**:
```bash
# Edit .env to change models or API key
nano .env

# Restart backend (no rebuild needed)
docker-compose restart backend
```

**Frontend Changes (Must Rebuild - Slower)**:
```bash
# Edit .env to change VITE_API_URL
nano .env

# Rebuild frontend (Vite bakes env vars at build time)
docker-compose up --build frontend
```

### Quick Docker Commands

```bash
# Start everything (first time or after code changes)
docker-compose up --build -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart backend after model change
docker-compose restart backend

# Rebuild frontend after API URL change
docker-compose up --build frontend -d
```

**Full Docker Guide**: See `docs/DOCKER_SETUP.md` for complete details

## Next Steps

1. **Test the current configuration** - Everything should work with current defaults
2. **Experiment with models** - Try different models to optimize cost/quality
3. **Monitor costs** - Check OpenRouter dashboard for usage
4. **Update as needed** - New models are added to OpenRouter regularly
5. **Review Docker setup** - Read `docs/DOCKER_SETUP.md` for production deployment

## Security Reminder

✅ Your `.env` file is in `.gitignore` - API key is protected
❌ Never commit `.env` to git
✅ Only commit `.env.example` with placeholder values
✅ Rotate API keys regularly

## Support

- Full documentation: `docs/CONFIGURATION.md`
- OpenRouter Docs: https://openrouter.ai/docs
- Model Pricing: https://openrouter.ai/models
