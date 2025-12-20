# Calance Edge - Configuration Guide

This document explains how to configure Calance Edge using environment variables for flexible deployment and AI model management.

## Overview

All hardcoded values have been replaced with environment variables, giving you full control over:
- AI model selection for each module
- API endpoints and URLs
- CORS configuration
- Server settings

## Environment Files

### Backend Configuration

**File**: `.env` (root directory)

Copy from `.env.example`:
```bash
cp backend/.env.example .env
```

**Available Variables**:

```bash
# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# AI Model Configuration
# Case Study Module Models
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5

# Presentation Module Models
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5

# Recruiting Module Models
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5

# Server Configuration
PORT=5000
HOST=0.0.0.0

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176

# Flask Configuration
FLASK_APP=app.py
FLASK_DEBUG=True
SECRET_KEY=calance-edge-secret-key-2024
ENVIRONMENT=development
```

### Frontend Configuration

**File**: `frontend/.env`

Copy from `frontend/.env.example`:
```bash
cp frontend/.env.example frontend/.env
```

**Available Variables**:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000

# Development Environment
VITE_ENV=development
```

## Model Configuration by Module

### Case Study Edge

**Purpose**: Transform client stories into branded case studies

**Models**:
- `MODEL_CASE_STUDY_ANALYSIS` - Content synthesis from freeform notes (default: Claude Sonnet 4.5)
- `MODEL_CASE_STUDY_IMAGE` - AI-generated images (default: Gemini 3 Pro Image)
- `MODEL_CASE_STUDY_REFINEMENT` - Quality refinement (default: Claude Sonnet 4.5)

**Usage Pattern**:
1. Freeform input → Analysis model synthesizes full narrative
2. Image model generates branded visuals
3. Refinement requests → Refinement model polishes content

**Cost Optimization**:
- For faster/cheaper drafts: Use `anthropic/claude-haiku-4.5` for analysis
- For higher quality: Keep Claude Sonnet 4.5 (current default)
- Image generation: Gemini 3 Pro is optimized for quality + cost

### Presentation Edge

**Purpose**: Build sales presentations

**Models**:
- `MODEL_PRESENTATION_GENERATION` - Initial presentation generation (default: Gemini 2.5 Flash Image)
- `MODEL_PRESENTATION_REFINEMENT` - Quality refinement (default: Claude Sonnet 4.5)

**Usage Pattern**:
1. Input data → Generation model creates presentation with images
2. Refinement requests → Refinement model enhances content

**Cost Optimization**:
- Keep Gemini Flash for fast generation with images
- For text-only presentations: Switch to `anthropic/claude-haiku-4.5` for lower cost

### Recruiting Toolkit

**Purpose**: 8 AI-powered recruiting tools

**Models**:
- `MODEL_RECRUITING_GENERATION` - Text generation for recruiting templates (default: Claude Haiku 4.5)

**Usage Pattern**:
1. User input → Generation model creates recruiting content
2. Copy to clipboard → No refinement needed

**Cost Optimization**:
- Claude Haiku 4.5 is already optimized (10x cheaper than Sonnet, 3x faster)
- For even cheaper: Use `google/gemini-2.5-flash` (no images needed)

## Changing AI Models

### Option 1: Update Environment File (Recommended)

Edit `.env`:
```bash
# Switch Case Study to use Haiku for cost savings
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5

# Switch to newer model when available
MODEL_CASE_STUDY_IMAGE=google/gemini-3.5-pro-image-preview
```

Restart the backend:
```bash
cd backend
python app.py
```

### Option 2: Docker Environment Variables

Edit `docker-compose.yml` defaults or override with `.env`:
```yaml
environment:
  - MODEL_CASE_STUDY_ANALYSIS=${MODEL_CASE_STUDY_ANALYSIS:-anthropic/claude-sonnet-4.5}
```

Rebuild and restart:
```bash
docker-compose down
docker-compose up --build
```

### Option 3: Runtime Override (Development)

Set environment variable before running:
```bash
export MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5
python backend/app.py
```

## Supported Models

### OpenRouter Available Models

**Anthropic Claude**:
- `anthropic/claude-sonnet-4.5` - Best quality, higher cost
- `anthropic/claude-haiku-4.5` - Fast, cost-effective, great for text
- `anthropic/claude-opus-4.5` - Maximum quality (very expensive)

**Google Gemini**:
- `google/gemini-3-pro-image-preview` - Latest image generation (Nano Banana Pro)
- `google/gemini-2.5-flash-image-preview` - Fast with images
- `google/gemini-2.5-flash` - Fast text-only

**OpenAI**:
- `openai/gpt-5.2` - High quality, expensive
- `openai/gpt-5-image-mini` - Fast with images
- `openai/o4-mini-deep-research` - Deep Research for Presentation Research and production output

**Others**:
- Check [OpenRouter Models](https://openrouter.ai/models) for full list

## Cost Optimization Guide

### High-Volume / Cost-Sensitive Setup

```bash
# Use Haiku for all text generation
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-haiku-4.5
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-haiku-4.5
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5

# Keep image generation as-is (already optimized)
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
```

**Savings**: ~80% cost reduction, minimal quality impact

### Maximum Quality Setup

```bash
# Use Sonnet for all content
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5

# Upgrade recruiting to Sonnet
MODEL_RECRUITING_GENERATION=anthropic/claude-sonnet-4.5

# Use best image model
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_PRESENTATION_GENERATION=google/gemini-3-pro-image-preview
```

**Cost**: ~5x current cost, maximum quality

### Balanced (Current Default)

Already optimized for quality/cost balance:
- Sonnet for complex synthesis (case studies, refinement)
- Haiku for simple text (recruiting)
- Gemini 3 Pro for images (best quality/cost)

## CORS Configuration

### Adding New Origins

Edit `.env`:
```bash
CORS_ORIGINS=http://localhost:5173,https://calance-edge.example.com,https://app.calance.com
```

**Format**: Comma-separated list of allowed origins (no spaces)

### Production Setup

```bash
CORS_ORIGINS=https://calance-edge.com,https://app.calance.com
```

## API URL Configuration

### Development (Default)

```bash
# Backend .env
PORT=5000

# Frontend .env
VITE_API_URL=http://localhost:5000
```

### Production

```bash
# Backend .env
PORT=8080
HOST=0.0.0.0

# Frontend .env
VITE_API_URL=https://api.calance-edge.com
```

### Docker Production

Edit `docker-compose.yml`:
```yaml
frontend:
  environment:
    - VITE_API_URL=https://api.calance-edge.com

backend:
  ports:
    - "8080:8080"
  environment:
    - PORT=8080
```

## Security Best Practices

### 1. Never Commit API Keys

✅ `.env` is in `.gitignore`
✅ Only commit `.env.example` with placeholder values
❌ Never hardcode API keys in code

### 2. Rotate API Keys Regularly

Update `OPENROUTER_API_KEY` in `.env` monthly or after exposure

### 3. Use Different Keys Per Environment

```bash
# Development
OPENROUTER_API_KEY=sk-or-v1-dev-key

# Production
OPENROUTER_API_KEY=sk-or-v1-prod-key
```

### 4. Restrict CORS in Production

```bash
# Development - permissive
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Production - strict
CORS_ORIGINS=https://calance-edge.com
```

## Troubleshooting

### Issue: Models not responding

**Check**:
1. `OPENROUTER_API_KEY` is set correctly
2. Model name is valid (check [OpenRouter](https://openrouter.ai/models))
3. Account has sufficient credits

### Issue: Frontend can't connect to backend

**Check**:
1. `VITE_API_URL` matches backend URL
2. Backend CORS includes frontend origin
3. Backend is running on expected port

### Issue: Docker containers fail to start

**Check**:
1. `.env` file exists in root directory
2. All required environment variables are set
3. Run `docker-compose config` to validate

### Issue: Changes not taking effect

**Solution**:
1. Restart backend: `python backend/app.py`
2. Rebuild frontend: `cd frontend && npm run dev`
3. Docker: `docker-compose down && docker-compose up --build`

## Testing Configuration

### Verify Backend Configuration

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Verify Environment Variables

```python
# backend/app.py - add temporary debug
print(f"Using models:")
print(f"  Case Study Analysis: {app.config['MODEL_CASE_STUDY_ANALYSIS']}")
print(f"  Case Study Image: {app.config['MODEL_CASE_STUDY_IMAGE']}")
print(f"  Recruiting: {app.config['MODEL_RECRUITING_GENERATION']}")
```

### Verify Frontend Configuration

```javascript
// frontend/src/App.jsx - check console
console.log('API URL:', API_URL);
```

## Migration from Hardcoded Values

All hardcoded values have been replaced:

**Before**:
```python
model = "anthropic/claude-sonnet-4.5"  # Hardcoded
base_url = "https://openrouter.ai/api/v1"  # Hardcoded
```

**After**:
```python
model = app.config['MODEL_CASE_STUDY_ANALYSIS']  # From environment
base_url = app.config['OPENROUTER_BASE_URL']  # From environment
```

**No code changes needed** - just configure `.env` files!

## Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [Claude Models Guide](https://docs.anthropic.com/claude/docs/models-overview)
- [Gemini Models Guide](https://ai.google.dev/models/gemini)
