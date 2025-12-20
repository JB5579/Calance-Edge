# Visual Export Strategy - Executive Summary

## Current State
- **System**: Google Gemini generates base64 PNG/JPEG images
- **Placement**: Hero, Challenge, Solution, Metrics, Testimonial sections
- **Export**: ReportLab (PDF) + Basic HTML
- **Limitation**: Raster-only, no OCR, limited print optimization

## Recommended Approach: Hybrid Vector-Raster with OCR

### 1. Enhanced PDF Export (Immediate - Week 1)
```python
# Core improvements needed:
1. Better image placement and sizing
2. Text overlays for key data points
3. Print optimization controls
4. Brand-consistent styling
```

**Benefits:**
- Minimal code changes
- Professional print quality
- Maintains existing ReportLab setup

### 2. HTML with Print CSS (Immediate - Week 1)
```css
@media print {
  .hero-image { page-break-after: always; }
  .content-grid { page-break-inside: avoid; }
  .section-image { max-width: 100%; }
}
```

**Benefits:**
- Responsive design
- Print-optimized output
- Easy to implement

### 3. OCR Integration (Week 2)
```python
# Add to requirements.txt:
pytesseract==0.3.11
opencv-python==4.8.1.78

# Implementation:
def extract_text_from_image(image_data):
    # Extract text for accessibility
    # Generate alt attributes
    # Enable searchable PDFs
```

**Benefits:**
- Accessibility compliance
- Searchable exports
- Text selection capability

### 4. WeasyPrint Option (Week 2-3)
```python
# Alternative to ReportLab:
import weasyprint
from jinja2 import Template

# Benefits:
- Modern CSS support (Flexbox, Grid)
- Better typography
- Print media queries
```

## Implementation Priority

### Phase 1 (Quick Wins)
1. ✅ Enhanced PDF image handling
2. ✅ HTML print CSS optimization
3. ✅ Image compression for smaller files

### Phase 2 (Advanced Features)
1. OCR text extraction
2. WeasyPrint integration
3. Accessibility improvements

### Phase 3 (Innovation)
1. Vector graphics generation
2. Interactive canvas exports
3. Animated visualizations

## Technical Requirements

```txt
# New dependencies
weasyprint==61.2          # HTML to PDF
pypdf==3.17.4             # PDF manipulation
pytesseract==0.3.11       # OCR
img2pdf==0.4.4            # Image to PDF
```

## Sample Output Structure

### PDF Enhancement
```python
def create_two_column_section(case_study_data, images):
    """Create professional two-column layout with images"""
    # Left: Challenge section with image
    # Right: Solution section with image
    # Proper spacing and alignment
    # Brand colors and fonts
```

### HTML Enhancement
```html
<div class="content-grid">
  <div class="section">
    <img src="data:image/png;base64,..." alt="Extracted text from OCR">
    <h2>The Challenge</h2>
  </div>
</div>
```

## Success Metrics

1. **Quality**: Professional print-ready exports
2. **Performance**: < 3 seconds export time
3. **Accessibility**: WCAG 2.1 AA compliance
4. **File Size**: < 5MB for typical case study

## Next Steps

1. **This Week**:
   - Implement enhanced PDF export
   - Add print CSS to HTML templates
   - Test with various Gemini outputs

2. **Next Week**:
   - Add OCR integration
   - Create accessibility tests
   - Evaluate WeasyPrint adoption

## Risk Mitigation

- **Fallbacks**: Keep ReportLab as backup
- **Testing**: Comprehensive test suite
- **Rollback**: Feature flags for gradual rollout