# Docker Setup Guide - Calance Edge

## Understanding Environment Variables in Docker

### Backend (Runtime Configuration) ✅
The backend uses environment variables at **runtime**, so changes take effect immediately when you restart containers.

### Frontend (Build-Time Configuration) ⚠️
The frontend uses Vite, which bakes environment variables into the JavaScript bundle at **build time**. When you change `VITE_API_URL`, you must **rebuild** the frontend container.

## Quick Start

### 1. Ensure Your `.env` File is Configured

The root `.env` file contains all configuration. Docker Compose will read from it:

```bash
# Check your .env file
cat .env
```

Should contain:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
# ... all other model configs
```

### 2. Build and Start Containers

```bash
# Build and start (first time)
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

This will:
- ✅ Build backend with your code changes
- ✅ Pass runtime environment variables to backend (API keys, models)
- ✅ Build frontend with `VITE_API_URL` baked into the bundle
- ✅ Start both services

### 3. Verify Services are Running

```bash
# Check status
docker-compose ps

# Should show:
# NAME                     STATUS
# calance-edge-backend-1   Up
# calance-edge-frontend-1  Up
```

### 4. Test the Application

```bash
# Test backend health
curl http://localhost:5000/api/health

# Open frontend
# http://localhost:5173
```

## When to Rebuild Containers

### ❌ NO Rebuild Needed (Backend Model Changes)

When you change **backend** environment variables (AI models, API keys):

```bash
# Edit .env
nano .env

# Change model
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5

# Just restart (no rebuild)
docker-compose restart backend
```

**Why**: Backend reads environment variables at startup (runtime).

### ✅ Rebuild Required (Frontend API URL Changes)

When you change **frontend** environment variables (API URL):

```bash
# Edit .env
nano .env

# Change API URL
VITE_API_URL=https://api.calance-edge.com

# Must rebuild frontend
docker-compose up --build frontend
```

**Why**: Vite bakes `VITE_*` variables into JavaScript at build time.

### ✅ Rebuild Required (Code Changes)

When you modify application code:

```bash
# Edit backend/app.py or frontend/src/App.jsx

# Rebuild affected service
docker-compose up --build backend  # Backend changes
docker-compose up --build frontend # Frontend changes
docker-compose up --build          # Both changed
```

## Environment Variable Configuration

### How Docker Gets Environment Variables

1. **From `.env` file** (root directory) - Recommended
   ```bash
   # .env
   OPENROUTER_API_KEY=sk-or-v1-xxx
   MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
   ```

2. **From shell environment**
   ```bash
   export OPENROUTER_API_KEY=sk-or-v1-xxx
   docker-compose up
   ```

3. **From docker-compose.yml defaults**
   ```yaml
   environment:
     - MODEL_CASE_STUDY_ANALYSIS=${MODEL_CASE_STUDY_ANALYSIS:-anthropic/claude-sonnet-4.5}
   #                                                          ↑ default if not set
   ```

### Priority (Highest to Lowest)

1. Shell environment variables
2. `.env` file in root directory
3. `docker-compose.yml` defaults

## Complete Workflow Examples

### Example 1: Change AI Model for Cost Savings

```bash
# 1. Edit .env
nano .env

# Change:
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-haiku-4.5
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-haiku-4.5

# 2. Restart backend only (no rebuild needed)
docker-compose restart backend

# 3. Verify changes took effect
docker-compose logs backend | grep "MODEL_CASE_STUDY"

# 4. Test
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Test","industry":"Tech","rawNotes":"Great client"}'
```

**Time**: ~5 seconds (restart only)

### Example 2: Change Frontend API URL (Production Deploy)

```bash
# 1. Edit .env
nano .env

# Change:
VITE_API_URL=https://api.calance-edge.com

# 2. Rebuild frontend (required!)
docker-compose up --build frontend -d

# 3. Verify
docker-compose logs frontend

# 4. Check environment was baked in
docker-compose exec frontend cat /usr/share/nginx/html/assets/index-*.js | grep "api.calance-edge.com"
```

**Time**: ~2-3 minutes (full rebuild)

### Example 3: Update Both Backend and Frontend

```bash
# 1. Edit code
# backend/app.py - add new feature
# frontend/src/App.jsx - add new UI

# 2. Rebuild everything
docker-compose down
docker-compose up --build

# 3. Verify both services are healthy
docker-compose ps
curl http://localhost:5000/api/health
curl http://localhost:5173
```

**Time**: ~3-5 minutes (full stack rebuild)

### Example 4: Rotate API Key

```bash
# 1. Edit .env
nano .env

# Change:
OPENROUTER_API_KEY=sk-or-v1-new-key-here

# 2. Restart backend only
docker-compose restart backend

# 3. Verify new key is being used
docker-compose logs backend | tail -20
```

**Time**: ~5 seconds (restart only)

## Docker Compose Commands Cheat Sheet

```bash
# Start services
docker-compose up                    # Foreground (see logs)
docker-compose up -d                 # Background (daemon mode)
docker-compose up --build            # Build + start
docker-compose up --build -d         # Build + start in background

# Stop services
docker-compose stop                  # Stop (can restart)
docker-compose down                  # Stop + remove containers
docker-compose down -v               # Stop + remove volumes (clean slate)

# Restart services
docker-compose restart               # Restart all
docker-compose restart backend       # Restart backend only
docker-compose restart frontend      # Restart frontend only

# View logs
docker-compose logs                  # All services
docker-compose logs -f               # Follow (live tail)
docker-compose logs backend          # Backend only
docker-compose logs -f backend       # Follow backend
docker-compose logs --tail=50 backend # Last 50 lines

# Check status
docker-compose ps                    # List services
docker-compose top                   # Show running processes

# Execute commands in containers
docker-compose exec backend bash     # Shell into backend
docker-compose exec backend python -c "import app; print(app.app.config['MODEL_CASE_STUDY_ANALYSIS'])"
docker-compose exec frontend sh      # Shell into frontend (Alpine Linux)

# Build without starting
docker-compose build                 # Build all
docker-compose build backend         # Build backend only
docker-compose build frontend        # Build frontend only

# Clean up
docker-compose down --rmi all        # Remove containers + images
docker-compose down -v --rmi all     # Remove everything (nuclear option)
```

## Troubleshooting

### Issue: Backend can't read environment variables

**Symptoms**:
```
KeyError: 'OPENROUTER_API_KEY'
```

**Solution**:
```bash
# 1. Check .env exists
ls -la .env

# 2. Check docker-compose can read it
docker-compose config | grep OPENROUTER_API_KEY

# 3. Restart with explicit env file
docker-compose --env-file .env up
```

### Issue: Frontend still using old API URL

**Symptoms**:
- Browser console shows requests to old URL
- Changed `VITE_API_URL` but frontend unchanged

**Solution**:
```bash
# Frontend needs rebuild when VITE_* vars change
docker-compose down
docker-compose build frontend --no-cache
docker-compose up -d

# Verify build args were used
docker-compose build frontend --progress=plain 2>&1 | grep VITE_API_URL
```

### Issue: Changes to `.env` not taking effect

**Symptoms**:
- Updated `.env` but containers use old values

**Solution**:
```bash
# Docker Compose caches env vars in .env files
# Force re-read by recreating containers

docker-compose down
docker-compose up --build -d

# Verify environment
docker-compose exec backend printenv | grep MODEL_
```

### Issue: Models returning errors

**Symptoms**:
```json
{"error": "Invalid model name"}
```

**Solution**:
```bash
# 1. Check model name is valid (https://openrouter.ai/models)
# 2. Check environment variable is set correctly
docker-compose exec backend printenv MODEL_CASE_STUDY_ANALYSIS

# 3. Check logs for exact error
docker-compose logs backend | grep -i error

# 4. Test with curl
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Test","industry":"Tech","rawNotes":"Test"}'
```

### Issue: CORS errors in browser

**Symptoms**:
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Solution**:
```bash
# 1. Check CORS_ORIGINS in .env
cat .env | grep CORS_ORIGINS

# 2. Add frontend origin if missing
# Edit .env:
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# 3. Restart backend
docker-compose restart backend

# 4. Clear browser cache and refresh
```

## Production Deployment

### Using Docker Compose in Production

**1. Create production `.env` file:**

```bash
# .env.production
OPENROUTER_API_KEY=sk-or-v1-production-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Production API URL (baked into frontend build)
VITE_API_URL=https://api.calance-edge.com

# Use optimized models for production
MODEL_CASE_STUDY_ANALYSIS=anthropic/claude-sonnet-4.5
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview
MODEL_CASE_STUDY_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_PRESENTATION_GENERATION=google/gemini-2.5-flash-image-preview
MODEL_PRESENTATION_REFINEMENT=anthropic/claude-sonnet-4.5
MODEL_RECRUITING_GENERATION=anthropic/claude-haiku-4.5

# Production CORS (strict!)
CORS_ORIGINS=https://calance-edge.com,https://app.calance-edge.com

# Flask production settings
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=super-secret-production-key-change-me
```

**2. Build for production:**

```bash
# Use production env file
docker-compose --env-file .env.production build

# Tag images for registry
docker tag calance-edge-backend:latest your-registry.com/calance-edge-backend:v1.0
docker tag calance-edge-frontend:latest your-registry.com/calance-edge-frontend:v1.0

# Push to registry
docker push your-registry.com/calance-edge-backend:v1.0
docker push your-registry.com/calance-edge-frontend:v1.0
```

**3. Deploy:**

```bash
# On production server
docker-compose --env-file .env.production up -d

# Monitor logs
docker-compose logs -f
```

### Using Separate docker-compose.production.yml

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: your-registry.com/calance-edge-frontend:v1.0
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    environment:
      - NGINX_HOST=calance-edge.com

  backend:
    image: your-registry.com/calance-edge-backend:v1.0
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=False
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - MODEL_CASE_STUDY_ANALYSIS=${MODEL_CASE_STUDY_ANALYSIS}
      # ... all other env vars
    restart: always
```

Deploy:
```bash
docker-compose -f docker-compose.production.yml up -d
```

## Summary

### ✅ You DO NOT need to update Docker containers for:
- ❌ Backend environment variable changes (API keys, models) - Just restart
- ❌ CORS configuration changes - Just restart backend

### ✅ You DO need to rebuild Docker containers for:
- ✅ Frontend environment variable changes (`VITE_API_URL`) - Rebuild frontend
- ✅ Code changes (backend or frontend) - Rebuild affected service

### Configuration Files:
- ✅ `.env` (root directory) - All backend config + frontend build args
- ✅ `frontend/.env` - Local development only (not used by Docker)
- ✅ `docker-compose.yml` - Already updated with all environment variables
- ✅ `backend/Dockerfile` - No changes needed (runtime env vars)
- ✅ `frontend/Dockerfile` - Updated to accept build args for `VITE_*`

### The `.env` file IS used by Docker Compose:
✅ **YES** - Docker Compose automatically reads `.env` from the root directory
✅ Your API key and all model configurations are passed to containers
✅ Changes to `.env` require container restart (backend) or rebuild (frontend)

You're all set! 🚀
