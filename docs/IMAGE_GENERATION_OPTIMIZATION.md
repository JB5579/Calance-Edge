# Image Generation Optimization Analysis

## Current Problem: Sequential Image Generation

### Timeline of What Happens Now

```
Total Time: ~150 seconds (2.5 minutes)

0s    ─┬─ Start Request
      │
87s   ├─ Claude Analysis Complete (87 seconds)
      │
      ├─ Hero Image START
101s  ├─ Hero Image COMPLETE (14 seconds)
      │
      ├─ Metrics Image START
115s  ├─ Metrics Image COMPLETE (14 seconds)
      │
      ├─ Timeline Image START
129s  ├─ Timeline Image COMPLETE (14 seconds)
      │
150s  └─ Response Sent to Frontend
```

**Total**: 150 seconds (2.5 minutes)

### Root Cause: Sequential Loop

**File**: `backend/app.py:352`

```python
# Current implementation (SLOW)
for component_name, component_prompt in prompts.items():
    logger.info(f"Generating {component_name} image...")

    response = await client.post(...)  # ← Blocks until complete

    # Process response
    # Then move to next image
```

**Problem**: Each image waits for the previous one to finish.

## Optimal Solution: Parallel Image Generation

### Proposed Timeline

```
Total Time: ~101 seconds (40% faster!)

0s    ─┬─ Start Request
      │
87s   ├─ Claude Analysis Complete (87 seconds)
      │
      ├─┬─ Hero Image START    ─────────────┐
      │ ├─ Metrics Image START ──────────────┤ All 3 start
      │ └─ Timeline Image START ─────────────┘ simultaneously
      │
101s  ├─ All 3 Images COMPLETE (14 seconds, not 42!)
      │
101s  └─ Response Sent to Frontend
```

**Savings**: 49 seconds (33% faster overall, 67% faster for images)

### Implementation

#### Option 1: asyncio.gather() (Recommended)

```python
async def _generate_complete_case_study(self, structured_data):
    """Step 2: Generate 3 visual components in PARALLEL"""

    # ... existing setup code ...

    try:
        logo_base64 = load_logo_as_base64()
        if not logo_base64:
            logger.warning("Logo not available for image generation")
            return []

        async with httpx.AsyncClient(timeout=60.0) as client:
            # Create list of async tasks
            tasks = []
            component_names = []

            for component_name, component_prompt in prompts.items():
                logger.info(f"Queueing {component_name} image generation...")
                component_names.append(component_name)

                # Create async task (doesn't execute yet)
                task = client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json={
                        "model": app.config['MODEL_CASE_STUDY_IMAGE'],
                        "messages": [{
                            "role": "user",
                            "content": [
                                {"type": "image_url", "image_url": {"url": logo_base64}},
                                {"type": "text", "text": component_prompt}
                            ]
                        }],
                        "temperature": 0.7,
                        "max_tokens": 1000,
                        "modalities": ["image", "text"]
                    }
                )
                tasks.append(task)

            # Execute all image generations in parallel
            logger.info(f"Generating {len(tasks)} images in parallel...")
            responses = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            all_images = []
            for component_name, response in zip(component_names, responses):
                if isinstance(response, Exception):
                    logger.error(f"Error generating {component_name}: {response}")
                    continue

                try:
                    response_json = response.json()

                    if response.status_code != 200:
                        logger.error(f"Gemini {component_name} generation failed: {response_json}")
                        continue

                    message = response_json.get('choices', [{}])[0].get('message', {})
                    ai_images = message.get('images', [])

                    if ai_images:
                        logger.info(f"Gemini returned {len(ai_images)} {component_name} images")
                        for idx, img in enumerate(ai_images):
                            all_images.append({
                                "id": f"{component_name}_{idx}",
                                "url": img["image_url"]["url"],
                                "type": "image/png",
                                "placement": component_name,
                                "alt": f"{component_name.capitalize()} visualization"
                            })
                    else:
                        logger.warning(f"No images returned for {component_name}")

                except Exception as e:
                    logger.error(f"Error processing {component_name} response: {e}")

            return all_images

    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        return []
```

**Benefits**:
- ✅ 67% faster image generation (14 sec vs 42 sec for 3 images)
- ✅ 33% faster overall (101 sec vs 150 sec total)
- ✅ Built-in error handling with `return_exceptions=True`
- ✅ Graceful degradation (if one image fails, others still complete)

#### Option 2: asyncio.create_task() (More Control)

```python
async def _generate_complete_case_study(self, structured_data):
    """Step 2: Generate 3 visual components in PARALLEL with individual error handling"""

    # ... existing setup code ...

    async def generate_single_image(component_name, component_prompt, client, logo_base64):
        """Helper to generate a single image"""
        try:
            logger.info(f"Generating {component_name} image...")

            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": app.config['MODEL_CASE_STUDY_IMAGE'],
                    "messages": [{
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": logo_base64}},
                            {"type": "text", "text": component_prompt}
                        ]
                    }],
                    "temperature": 0.7,
                    "max_tokens": 1000,
                    "modalities": ["image", "text"]
                }
            )

            response_json = response.json()

            if response.status_code != 200:
                logger.error(f"Gemini {component_name} generation failed")
                return None

            message = response_json.get('choices', [{}])[0].get('message', {})
            ai_images = message.get('images', [])

            if not ai_images:
                logger.warning(f"No images returned for {component_name}")
                return None

            logger.info(f"Successfully generated {component_name} image")

            return {
                "id": f"{component_name}_0",
                "url": ai_images[0]["image_url"]["url"],
                "type": "image/png",
                "placement": component_name,
                "alt": f"{component_name.capitalize()} visualization"
            }

        except Exception as e:
            logger.error(f"Error generating {component_name}: {e}")
            return None

    try:
        logo_base64 = load_logo_as_base64()
        if not logo_base64:
            logger.warning("Logo not available for image generation")
            return []

        async with httpx.AsyncClient(timeout=60.0) as client:
            # Create tasks for parallel execution
            tasks = [
                asyncio.create_task(generate_single_image(name, prompt, client, logo_base64))
                for name, prompt in prompts.items()
            ]

            # Wait for all to complete
            logger.info(f"Generating {len(tasks)} images in parallel...")
            results = await asyncio.gather(*tasks)

            # Filter out None results (failed generations)
            all_images = [img for img in results if img is not None]

            logger.info(f"Successfully generated {len(all_images)}/{len(tasks)} images")
            return all_images

    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        return []
```

**Benefits**:
- ✅ Same speed improvement as Option 1
- ✅ Cleaner separation of concerns
- ✅ Easier to add retry logic per image
- ✅ Better logging per component

## Performance Comparison

| Approach | Claude | Images | Total | Savings |
|----------|--------|--------|-------|---------|
| **Current (Sequential)** | 87s | 42s (3×14s) | 129s | Baseline |
| **Parallel (Proposed)** | 87s | 14s | 101s | **-28s (22%)** |
| **Parallel + Faster Model** | 87s | 8s | 95s | **-34s (26%)** |

## Why Prompts Are NOT the Problem

### Current Prompt Analysis

**Hero Image Prompt** (~200 words):
```
✅ Clear structure (CONTENT / STYLE / MOOD)
✅ Specific requirements (colors, format, dimensions)
✅ Appropriate detail level
✅ Explicit instruction (DO NOT INCLUDE TEXT)
```

**Metrics Prompt** (~150 words):
```
✅ Data-focused (specific metrics to visualize)
✅ Clear visualization requirements
✅ Professional quality guidance
✅ Reasonable complexity
```

**Timeline Prompt** (~150 words):
```
✅ Content reference (implementation text)
✅ Visual requirements specified
✅ Style guidelines clear
```

### Prompt Length vs. Generation Time

| Prompt Length | Expected Time | Actual Time |
|---------------|---------------|-------------|
| 50-100 words | 8-10s | - |
| 150-250 words | 10-15s | ✅ 14s (matches) |
| 500+ words | 20-30s | - |
| 1000+ words | 30-60s | - |

**Conclusion**: Prompts are optimal length. Generation time is normal for image models.

## Additional Optimizations

### 1. Reduce Image Count (Fastest Fix)

Only generate hero image (most important):

```python
prompts = {
    "hero": f"""Create a professional hero image..."""
    # Remove metrics and timeline
}
```

**Savings**: 28 seconds (only 1 image)

### 2. Use Faster Image Model

Current: `google/gemini-3-pro-image-preview` (highest quality, ~14s per image)
Alternative: `google/gemini-2.5-flash-image-preview` (~8s per image)

```bash
# In .env
MODEL_CASE_STUDY_IMAGE=google/gemini-2.5-flash-image-preview
```

**Savings**: 6 seconds per image × 3 = 18 seconds

### 3. Implement Image Caching

Cache generated images by content hash:

```python
import hashlib

def get_image_cache_key(component_name, client_name, industry, metrics):
    """Generate cache key from inputs"""
    content = f"{component_name}|{client_name}|{industry}|{str(metrics)}"
    return hashlib.sha256(content.encode()).hexdigest()

# Check cache before generating
cache_key = get_image_cache_key(...)
if cache_key in image_cache:
    return image_cache[cache_key]
```

**Savings**: 100% for cached images (instant response)

### 4. Background Image Generation (Advanced)

Return case study immediately, generate images in background:

```python
# Return partial result immediately
return {
    "data": case_study_content,
    "images": [],
    "generation_id": "cs_123"
}

# Client polls for images
GET /api/case-study/cs_123/images
```

**User experience**: Instant response, images appear progressively

## Implementation Priority

### Priority 1: Parallel Generation (Recommended Now)
- **Time**: 20 minutes to implement
- **Savings**: 28 seconds (22% faster)
- **Risk**: Low (asyncio.gather is stable)
- **Benefit**: Immediate improvement

### Priority 2: Reduce to 1-2 Images
- **Time**: 5 minutes (comment out timeline)
- **Savings**: 28 seconds (only 1 image) or 14 seconds (2 images)
- **Risk**: None (UX decision)
- **Benefit**: Simplest optimization

### Priority 3: Faster Model
- **Time**: 1 minute (change .env)
- **Savings**: 18 seconds
- **Risk**: Lower image quality (test first)
- **Benefit**: No code changes

### Priority 4: Image Caching
- **Time**: 2-3 hours (Redis setup, cache logic)
- **Savings**: 100% for repeated cases
- **Risk**: Medium (cache invalidation complexity)
- **Benefit**: Best for high-volume use

### Priority 5: Background Generation
- **Time**: 4-6 hours (queue system, polling endpoints)
- **Savings**: User sees instant response
- **Risk**: High (architectural change)
- **Benefit**: Best UX, but complex

## Recommended Action Plan

**Immediate (Today)**:
1. ✅ Timeout increased to 600s (DONE - prevents crashes)
2. ⚠️ Implement parallel image generation (NEXT - 22% faster)
3. 🔧 Test with real case studies

**Short-term (This Week)**:
1. Evaluate image quality with faster model
2. Consider reducing to 2 images (hero + metrics only)
3. Add performance logging to track actual times

**Long-term (Next Sprint)**:
1. Implement image caching for repeated cases
2. Consider background generation for better UX
3. Monitor OpenRouter API performance

## Summary

**The timeout was NOT caused by**:
- ❌ Prompt complexity (prompts are optimal)
- ❌ Prompt length (150-200 words is normal)
- ❌ Model capability (Gemini handles this easily)

**The timeout WAS caused by**:
- ✅ Sequential processing (3 images one-by-one)
- ✅ Cumulative network latency (60+ seconds for API calls)
- ✅ Insufficient worker timeout (120s < 150s needed)

**Best fixes**:
1. ✅ **Increased timeout** (immediate fix applied)
2. ⏭️ **Parallel generation** (next optimization - 22% faster)
3. 🎯 **Reduce image count** (alternative if speed critical)
