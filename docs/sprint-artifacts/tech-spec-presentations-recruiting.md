# Tech-Spec: Complete Presentation & Recruiting Modules

**Created:** 2025-12-03
**Status:** Ready for Development
**Scope:** Implement remaining MVP modules for Calance Edge

## Overview

### Problem Statement
Calance Edge is 35% complete with Case Studies module functional. Need to implement Presentation Edge and Recruiting Toolkit to achieve full MVP functionality.

### Solution
Build two additional modules following established patterns:
1. **Presentation Edge** - Generate sales presentations from talking points
2. **Recruiting Toolkit** - 8 AI-powered recruiting tools in tabbed interface

### Scope (In/Out)
**IN:**
- Presentation wizard with slide generation
- HTML presentation export with keyboard navigation
- 8 recruiting tools with copy-to-clipboard functionality
- Feedback/refinement loops for both modules
- Consistent UI/UX with existing case studies module

**OUT:**
- PPTX export (Phase 2)
- Image generation (Phase 2)
- Advanced user management
- Database persistence (continue using in-memory)

## Context for Development

### Codebase Patterns
```javascript
// Existing patterns to follow:
- React Hook Form + Yup validation
- Lucide React icons
- TailwindCSS with brand colors
- Async/await API calls to Flask backend
- Error handling with user feedback
- Loading states with spinner
- Export functionality (PDF/HTML download)
```

### Files to Reference
```
/frontend/src/App.jsx - Main application structure and shared components
/frontend/src/components/shared/ - Reusable UI components
/backend/app.py - Flask API structure and AI service integration
/docker-compose.yml - Development environment setup
```

### Technical Decisions
1. **Reuse Components** - Leverage existing Button, Input, Card, Badge components
2. **Follow API Pattern** - Use existing /api/generate/{module} structure
3. **Maintain Brand Consistency** - Use established color scheme and styling
4. **Smart Model Routing** - Use Gemini Flash for drafts, Claude for refinement
5. **Export Strategy** - HTML for presentations (like case studies), text for recruiting

## Implementation Plan

### Tasks

#### Presentation Module (Priority 1)
- [ ] Task 1: Create PresentationWizard component with form validation
- [ ] Task 2: Implement dynamic key points array (add/remove functionality)
- [ ] Task 3: Build SlidePreview component with carousel navigation
- [ ] Task 4: Add per-slide feedback system
- [ ] Task 5: Implement HTML presentation export with embedded CSS/JS
- [ ] Task 6: Add keyboard navigation (arrow keys, spacebar) to exported HTML

#### Recruiting Toolkit (Priority 2)
- [ ] Task 7: Create tabbed interface component
- [ ] Task 8: Implement JD Enhancer tool
- [ ] Task 9: Implement Sourcing Email Generator
- [ ] Task 10: Implement Boolean Search String Creator
- [ ] Task 11: Implement Candidate Submittal Generator
- [ ] Task 12: Implement Interview Prep Email Builder
- [ ] Task 13: Implement Mock Interview Questions
- [ ] Task 14: Implement Skills/Title/Location Extractor
- [ ] Task 15: Implement Executive Summary Writer

#### Backend Integration
- [ ] Task 16: Add /api/presentation/generate endpoint
- [ ] Task 17: Add /api/presentation/refine endpoint
- [ ] Task 18: Add /api/presentation/export/html endpoint
- [ ] Task 19: Add /api/recruiting/{tool} endpoint with routing
- [ ] Task 20: Create presentation HTML template
- [ ] Task 21: Create recruiting prompt templates

#### Integration & Polish
- [ ] Task 22: Update main navigation to include new modules
- [ ] Task 23: Add error handling and loading states
- [ ] Task 24: Test all export functionality
- [ ] Task 25: Verify mobile responsiveness

### Acceptance Criteria

- [ ] AC 1: Given I'm on the Presentations tab, when I fill out the form and click generate, I see a preview of slides
- [ ] AC 2: Given I have generated slides, when I click download HTML, I get a standalone file with keyboard navigation
- [ ] AC 3: Given I'm on Recruiting Toolkit, when I switch tabs, I see different input forms
- [ ] AC 4: Given I input job description text, when I click generate on any tool, I get formatted output
- [ ] AC 5: Given I have generated output, when I click copy, the text is in my clipboard
- [ ] AC 6: Given I provide feedback on generated content, when I click regenerate, I get refined output

## Additional Context

### Dependencies
- OpenRouter API key (already configured in backend)
- Existing brand configuration
- TailwindCSS utilities
- Lucide React icons

### Testing Strategy
```bash
# Manual testing checklist:
1. Presentation Module:
   - Form validates required fields
   - Slides generate from key points
   - Slide navigation works in preview
   - Per-slide feedback regenerates specific slides
   - HTML export downloads with navigation

2. Recruiting Toolkit:
   - All 8 tabs load correctly
   - Each tool generates output
   - Copy-to-clipboard works
   - Output is properly formatted
```

### Notes
- Follow existing code patterns exactly
- Reuse shared components (Button, Input, Card, Badge)
- Maintain consistent styling with brand colors
- All API endpoints should return same response format as case studies
- Error messages should be user-friendly
- Loading states should show immediately on button click