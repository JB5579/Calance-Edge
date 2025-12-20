# Docker Timeout Fix - Image Generation

## Problem

When generating case studies with AI images, Docker containers were timing out with this error:

```
[CRITICAL] WORKER TIMEOUT (pid:9)
Worker exiting (pid: 9)
```

**Browser Console Error**:
```
Failed to load resource: net::ERR_EMPTY_RESPONSE
```

## Root Cause

The default gunicorn worker timeout was 120 seconds, but AI image generation can take:
- **Claude Sonnet 4.5**: 90-120 seconds for content analysis
- **Gemini 3 Pro Image**: 30-60 seconds per image
- **Total for case study with 2 images**: 3-5 minutes

With the previous 120-second timeout, workers were being killed mid-generation.

## Solution Applied

**File**: `backend/Dockerfile`

Changed timeout from 120 to 600 seconds (10 minutes):

```dockerfile
# Before
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:app"]

# After
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "600", "app:app"]
```

## Why 600 Seconds (10 Minutes)?

Worst-case scenario for a case study with images:
1. Claude analysis: 90 seconds
2. Hero image generation: 60 seconds
3. Metrics image generation: 60 seconds
4. Response processing: 30 seconds
**Total**: ~240 seconds (4 minutes)

600 seconds provides 2.5x safety margin for:
- API rate limiting delays
- Network latency spikes
- Complex image generation requests
- Multiple retries if needed

## How to Apply the Fix

### If Using Docker Compose

```bash
# Rebuild backend only
docker-compose up --build -d backend

# Verify it's running
docker-compose ps
docker-compose logs backend | tail -20
```

### If Running Directly (Development)

The timeout doesn't affect local development:
```bash
cd backend
python app.py  # No timeout for Flask dev server
```

## Testing the Fix

Try generating a case study with freeform input:

```bash
curl -X POST http://localhost:5000/api/generate/case-study \
  -H "Content-Type: application/json" \
  -d '{
    "rawNotes": "Client: Beazer Homes. Industry: Real Estate. Challenge: Manual land analysis taking weeks. Solution: AI platform. Results: 85% faster evaluation.",
    "clientName": "Beazer Homes",
    "industry": "Real Estate"
  }'
```

Watch the logs in real-time:
```bash
docker-compose logs -f backend
```

You should see:
1. ✅ "STEP 1: Starting Claude analysis..."
2. ✅ "Claude analysis response status: 200"
3. ✅ "STEP 2: Calling Gemini to generate complete case study document..."
4. ✅ "Generating hero image..."
5. ✅ "Generating metrics image..."
6. ✅ No timeout errors
7. ✅ Complete response returned

## Alternative Optimizations

If 10 minutes is too long for production, consider these alternatives:

### Option 1: Reduce Image Count

Edit `backend/app.py` to generate only 1 image instead of 2:

```python
# Only generate hero image, skip metrics image
prompts = {
    "hero": f"Create a professional hero image for {client_name}..."
}
```

**Time saved**: ~60 seconds per case study

### Option 2: Use Faster Image Model

Change to a faster model in `.env`:

```bash
# Current (highest quality)
MODEL_CASE_STUDY_IMAGE=google/gemini-3-pro-image-preview

# Faster alternative (good quality)
MODEL_CASE_STUDY_IMAGE=google/gemini-2.5-flash-image-preview
```

**Time saved**: ~30-40 seconds per image

### Option 3: Parallel Image Generation

Modify `backend/app.py` to generate images in parallel instead of sequentially:

```python
import asyncio

# Generate both images concurrently
hero_task = asyncio.create_task(generate_hero_image())
metrics_task = asyncio.create_task(generate_metrics_image())

hero_image = await hero_task
metrics_image = await metrics_task
```

**Time saved**: ~50% (images generate simultaneously)

### Option 4: Increase Worker Count

More workers = more concurrent requests without timeouts:

```dockerfile
# backend/Dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "8", "--timeout", "600", "app:app"]
```

**Trade-off**: Higher memory usage (each worker ~200MB)

### Option 5: Use Async Workers (Advanced)

Switch to async workers for better concurrency:

```dockerfile
# backend/Dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--timeout", "600", "app:app"]
```

Requires adding `uvicorn` to `requirements.txt`.

## Monitoring Timeout Performance

### Check Current Timeout Setting

```bash
docker-compose exec backend ps aux | grep gunicorn
```

### Monitor Request Duration

Add logging to `backend/app.py`:

```python
import time

@app.route('/api/generate/case-study', methods=['POST'])
def generate_case_study():
    start_time = time.time()

    # ... existing code ...

    duration = time.time() - start_time
    logger.info(f"Request completed in {duration:.2f} seconds")
```

### View Slow Requests

```bash
docker-compose logs backend | grep "completed in"
```

## Production Recommendations

For production deployment:

1. **Use CDN for Images**: Store generated images in S3/CloudFront, return URLs instead of base64
2. **Implement Queue System**: Use Celery/Redis for async image generation
3. **Progress Indicators**: Return partial results immediately, generate images in background
4. **Caching**: Cache similar case study generations to reduce API calls

## When Timeout Still Occurs

If you still see timeouts after increasing to 600s:

1. **Check OpenRouter Status**: https://status.openrouter.ai
2. **Verify Model Availability**: Some models may be temporarily slow
3. **Switch Models Temporarily**:
   ```bash
   # Use faster model during high load
   MODEL_CASE_STUDY_IMAGE=google/gemini-2.5-flash-image-preview
   docker-compose restart backend
   ```
4. **Increase Timeout Further**:
   ```dockerfile
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "900", "app:app"]
   ```

## Summary

✅ **Fix Applied**: Timeout increased from 120s → 600s in `backend/Dockerfile`
✅ **Action Required**: Rebuild backend container: `docker-compose up --build -d backend`
✅ **Expected Result**: Case studies with images now complete without timeout errors
✅ **Next Steps**: Test with real case study generation, monitor logs

The fix has been applied to your codebase and is ready to use!
