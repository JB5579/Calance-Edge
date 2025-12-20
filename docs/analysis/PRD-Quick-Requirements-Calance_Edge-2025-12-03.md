# PRD: Calance Edge - Quick Requirements Document

**Version:** 1.0
**Date:** December 3, 2025
**Status:** Requirements Extracted - Ready for Implementation
**Timeline:** 3-5 Day MVP

---

## Executive Summary

Calance Edge is a unified AI-powered sales enablement platform that transforms how Calance's sales team creates client-facing artifacts. By consolidating three essential workflows—Case Studies, Presentations, and Recruiting Toolkit—into a single intuitive interface, Calance Edge reduces artifact creation time by 75% while ensuring consistent brand excellence.

**Quick PRD Focus:** This document extracts implementation-ready requirements from comprehensive technical specifications and product brief, structured for immediate 3-5 day MVP development.

---

## 1. Functional Requirements

### 1.1 Case Study Edge Module

#### Core Functional Requirements

**REQ-CS-1: Case Study Input Form**
- The system SHALL provide a form with the following required fields:
  - Client Name (text, required)
  - Industry (dropdown, required)
  - Title (text, auto-generated, editable)
  - Business Challenge (textarea, required)
  - Solution Delivered (textarea, required)
- The system SHALL provide optional fields:
  - Subtitle/Tagline (text)
  - Technology Stack (text)
  - Project Timeline (text)
  - ROI Statement (text)
- The system SHALL support dynamic adding of:
  - Metrics array (Before/After/Improvement)
  - Benefits list (unlimited items)

**REQ-CS-2: AI-Powered Generation**
- The system SHALL generate initial case study drafts using OpenRouter API
- The system SHALL intelligently route to appropriate LLM models:
  - Gemini Flash for initial drafts (fast, creative)
  - Claude Sonnet for quality refinement (polished, professional)
- The system SHALL enhance user input by:
  - Expanding business challenges with specific pain points
  - Improving solution descriptions with outcome-focused language
  - Generating compelling headlines from client data
  - Creating executive summaries highlighting key achievements

**REQ-CS-3: Live Preview System**
- The system SHALL display real-time preview of generated case study
- The system SHALL render preview in PDF-style format within browser
- The system SHALL show all sections: Title, Challenge, Solution, Metrics, Benefits
- The system SHALL support scrolling through complete case study content

**REQ-CS-4: Feedback and Refinement**
- The system SHALL accept natural language feedback from users
- The system SHALL regenerate specific sections based on feedback
- The system SHALL maintain context across multiple refinement iterations
- The system SHALL allow targeted feedback (e.g., "Make ROI more prominent")

**REQ-CS-5: Export Capabilities**
- The system SHALL generate downloadable PDF files:
  - 8.5" x 11" letter size
  - 2-3 pages typical length
  - Calance branding (logo, colors, typography)
  - Professional layout with proper sections
- The system SHALL generate standalone HTML files:
  - Self-contained single file (embedded CSS/images)
  - Print-optimized media queries
  - Responsive for screen viewing
  - Works offline without external dependencies

### 1.2 Presentation Edge Module

#### Core Functional Requirements

**REQ-PRES-1: Presentation Setup Wizard**
- The system SHALL provide setup form with:
  - Presentation Title (text, required)
  - Purpose/Goal (textarea, required)
  - Target Audience (text, required)
  - Theme/Tone selection (dropdown: Professional, Energetic, Technical, Executive)
- The system SHALL validate all required fields before proceeding

**REQ-PRES-2: Key Points Input System**
- The system SHALL provide dynamic key points entry:
  - Minimum 3 key points required
  - Maximum 15 key points supported
  - Each point represents one slide
  - Reorder capability (drag and drop or up/down arrows)
  - Delete capability for individual points
- The system SHALL provide templates for common presentation structures:
  - Problem → Solution → Benefits → CTA
  - Company → Services → Differentiators → Contact
  - Challenge → Approach → Results → Next Steps

**REQ-PRES-3: AI Slide Generation**
- The system SHALL convert each key point into professional slide content
- The system SHALL select appropriate slide templates automatically:
  - Title slides for key points with headline focus
  - Content slides for detailed explanations
  - Metrics slides for data-heavy points
  - Two-column slides for comparisons
  - Quote slides for testimonials or statements
- The system SHALL generate speaker notes for each slide
- The system SHALL maintain consistent styling throughout presentation

**REQ-PRES-4: Slide Preview and Navigation**
- The system SHALL display slide carousel with navigation:
  - Previous/Next buttons
  - Direct slide selection (click thumbnail)
  - Current slide indicator (e.g., "Slide 3 of 8")
  - Full slide preview in central viewing area
- The system SHALL show slide thumbnails with template type indicators

**REQ-PRES-5: Per-Slide Refinement**
- The system SHALL allow feedback on individual slides
- The system SHALL regenerate specific slides while preserving others
- The system SHALL accept targeted feedback (e.g., "Make this more visual," "Add bullet points")
- The system SHALL provide global feedback option for entire presentation changes

**REQ-PRES-6: HTML Presentation Export**
- The system SHALL generate standalone HTML presentation files:
  - Single self-contained file (embedded CSS/JS/images)
  - Keyboard navigation support (arrow keys, spacebar)
  - Responsive scaling for different screen sizes
  - Full-screen presentation mode
  - Print to PDF capability
  - Embedded Calance branding

### 1.3 Recruiting Toolkit Module

#### Core Functional Requirements

**REQ-REC-1: Tabbed Interface**
- The system SHALL provide 8 distinct recruiting tools in tabbed interface:
  1. JD Enhancer
  2. Sourcing Email Generator
  3. Boolean Search String Creator
  4. Candidate Submittal Generator
  5. Interview Prep Email Builder
  6. Mock Interview Questions
  7. Skills/Title/Location Extractor
  8. Executive Summary Writer
- The system SHALL maintain separate state for each tool
- The system SHALL allow easy switching between tools without losing work

**REQ-REC-2: JD Enhancer**
- The system SHALL accept raw job descriptions (paste functionality)
- The system SHALL enhance job descriptions with:
  - Calance branding and language
  - Improved formatting and structure
  - More compelling benefit statements
- The system SHALL output enhanced descriptions in markdown format
- The system SHALL provide copy-to-clipboard functionality

**REQ-REC-3: Sourcing Email Generator**
- The system SHALL accept inputs:
  - Role title
  - Candidate first name
  - Key skill to highlight
  - Recruiter name
- The system SHALL generate:
  - 3 subject line options
  - Personalized email body
  - Professional call-to-action
  - Calance signature block
- The system SHALL output in email-ready format

**REQ-REC-4: Boolean Search String Creator**
- The system SHALL accept job description text (paste)
- The system SHALL generate Boolean strings for:
  - LinkedIn Recruiter
  - Dice/Monster
  - Indeed
  - GitHub (for technical roles)
- The system SHALL optimize strings for each platform's syntax

**REQ-REC-5: Candidate Submittal Generator**
- The system SHALL provide guided form with 11 fields:
  - Candidate name
  - Contact information
  - Position applied for
  - Years of experience
  - Key skills
  - Previous companies
  - Education details
  - Salary expectations
  - Availability
  - Work authorization
  - Additional notes
- The system SHALL generate formatted submittal document
- The system SHALL include 5-sentence experience summary
- The system SHALL output in professional format

**REQ-REC-6: Interview Prep Email Builder**
- The system SHALL provide 15-step wizard:
  - Interview date/time
  - Interview format (phone, video, in-person)
  - Interviewer names and roles
  - Job description
  - Company background
  - Role responsibilities
  - Technical requirements
  - Cultural fit aspects
  - Expected duration
  - Materials needed
  - Location/link details
  - Dress code
  - Parking information
  - Contact person
  - Additional instructions
- The system SHALL generate complete prep email with calendar-ready details

**REQ-REC-7: Mock Interview Questions**
- The system SHALL accept job description text
- The system SHALL generate:
  - Position summary
  - 3 vetting questions with model answers
  - Red flags and green flags to watch for
- The system SHALL categorize questions by type (technical, behavioral, situational)

**REQ-REC-8: Skills/Title/Location Extractor**
- The system SHALL parse job descriptions to extract:
  - Technical skills list (prioritized)
  - Optimized job title suggestions
  - Location codes (ZIP, area codes)
- The system SHALL format output for recruiting system input

**REQ-REC-9: Executive Summary Writer**
- The system SHALL accept:
  - Job description
  - Candidate profile/resume
- The system SHALL generate 3-5 sentence candidate summary
- The system SHALL highlight:
  - Quantified achievements
  - Skills alignment with role
  - Key differentiators
- The system SHALL output in executive-ready format

**REQ-REC-10: Copy-to-Clipboard Functionality**
- The system SHALL provide copy button for all recruiting tool outputs
- The system SHALL confirm successful copy with visual feedback
- The system SHALL format clipboard content appropriately for each tool type

---

## 2. User Stories with Acceptance Criteria

### 2.1 Case Study Edge User Stories

**User Story 1: Rapid Case Study Creation**
*As Alex Chen (Account Executive), I want to create professional case studies quickly so that I can showcase Calance's successful client implementations to prospects.*

**Acceptance Criteria:**
- GIVEN I am on the Case Study Edge module
- WHEN I fill in client name, industry, challenge, and solution
- AND I click "Generate Draft"
- THEN I receive a complete case study draft within 30 seconds
- AND the draft includes enhanced challenge description and solution details
- AND I can preview the complete case study in PDF-style format
- AND I can export as PDF or HTML

**User Story 2: Iterative Refinement**
*As Maria Rodriguez (Sales Director), I want to refine case study content with natural language feedback so that I can ensure the content perfectly matches my prospect's needs.*

**Acceptance Criteria:**
- GIVEN I have generated a case study draft
- WHEN I provide feedback like "Make the ROI more prominent for executives"
- AND I click "Regenerate"
- THEN the system updates the case study within 20 seconds
- AND the ROI statement is more prominent in the updated version
- AND I can continue iterating until satisfied

### 2.2 Presentation Edge User Stories

**User Story 3: Key Points to Professional Slides**
*As David Park (VP Business Development), I want to convert my talking points into professional slides so that I can deliver compelling presentations to executive audiences.*

**Acceptance Criteria:**
- GIVEN I am in the Presentation Edge module
- WHEN I enter 5-8 key talking points
- AND I specify the audience as "Executive"
- AND I click "Generate Presentation"
- THEN I receive a complete slide deck within 45 seconds
- AND each key point becomes a professional slide
- AND the deck includes title, content, and closing slides
- AND I can navigate through all slides in preview mode

**User Story 4: On-the-Fly Slide Adjustments**
*As Alex Chen (Account Executive), I want to refine individual slides so that I can tailor my presentation for specific prospect industries.*

**Acceptance Criteria:**
- GIVEN I have generated a presentation
- WHEN I select slide 3 and provide feedback "Add specific metrics for healthcare industry"
- AND I click "Regenerate This Slide"
- THEN only slide 3 is updated within 15 seconds
- AND the slide includes healthcare-specific metrics
- AND all other slides remain unchanged

### 2.3 Recruiting Toolkit User Stories

**User Story 5: Quick Sourcing Emails**
*As Maria Rodriguez (Technical Staffing Sales Director), I want to generate personalized sourcing emails so that I can efficiently reach out to qualified candidates.*

**Acceptance Criteria:**
- GIVEN I am in the Recruiting Toolkit, Sourcing Email tab
- WHEN I enter role: "Senior DevOps Engineer", candidate: "John", key skill: "Kubernetes"
- AND I click "Generate Email"
- THEN I receive 3 subject line options and complete email body within 10 seconds
- AND the email is personalized for John
- AND it highlights Kubernetes experience
- AND I can copy the entire email with one click

**User Story 6: Complete Interview Coordination**
*As any recruiter using Calance Edge, I want to generate comprehensive interview preparation emails so that candidates have all necessary information for successful interviews.*

**Acceptance Criteria:**
- GIVEN I am using the Interview Prep Email Builder
- WHEN I complete the 15-step wizard with interview details
- AND I click "Generate Prep Email"
- THEN I receive complete email with all logistics within 15 seconds
- AND the email includes calendar-ready details
- AND it contains interview format, duration, and preparation instructions
- AND I can copy the formatted email immediately

### 2.4 Cross-Module User Stories

**User Story 7: Zero-Training Onboarding**
*As any new Calance sales team member, I want to start creating professional artifacts immediately so that I can be productive from day one without training.*

**Acceptance Criteria:**
- GIVEN I am a first-time user of Calance Edge
- WHEN I navigate to any module
- THEN the interface is intuitive and self-explanatory
- AND I can complete a full workflow (input → generate → export) within 2 minutes
- AND I understand each step without documentation
- AND the output quality meets professional standards

**User Story 8: Brand Consistency**
*As any Calance sales team member, I want all my generated artifacts to have consistent Calance branding so that I maintain professional image across all client interactions.*

**Acceptance Criteria:**
- GIVEN I generate any artifact (case study, presentation, or recruiting content)
- WHEN I review the output
- THEN it includes Calance logo and colors
- AND it uses consistent typography
- AND it follows Calance brand voice and messaging
- AND the formatting is professional across all modules

---

## 3. Performance Requirements

### 3.1 Response Time Requirements

**REQ-PERF-1: Generation Response Times**
- Case study initial generation: < 30 seconds
- Case study refinement: < 20 seconds
- Presentation generation: < 45 seconds
- Individual slide regeneration: < 15 seconds
- Recruiting tool generation: < 15 seconds
- PDF export generation: < 10 seconds
- HTML export generation: < 5 seconds

**REQ-PERF-2: System Responsiveness**
- Page load times: < 2 seconds
- Form submission response: < 1 second
- Navigation between modules: < 1 second
- Preview rendering: < 3 seconds
- Export download initiation: < 2 seconds

### 3.2 Availability Requirements

**REQ-PERF-3: System Uptime**
- Production availability: 99%+ during business hours (6 AM - 8 PM PST)
- API availability: 99%+ for OpenRouter integration
- File export availability: 98%+ success rate

### 3.3 Capacity Requirements

**REQ-PERF-4: Concurrent Users**
- Support 10+ concurrent users
- Handle 50+ simultaneous generation requests
- Support files up to 10MB for exports

### 3.4 Quality Requirements

**REQ-PERF-5: Output Quality**
- Generated content requires minimal editing
- Professional formatting indistinguishable from manual creation
- Brand consistency across all outputs
- Error-free exports (valid PDF, functional HTML)

---

## 4. Technical Requirements

### 4.1 Architecture Requirements

**REQ-TECH-1: Container-Based Deployment**
- System SHALL run in Docker containers
- Frontend and backend SHALL be separate containers
- Data volumes SHALL persist exports
- nginx SHALL serve as reverse proxy

**REQ-TECH-2: API Integration**
- OpenRouter API integration with intelligent model routing
- Automatic fallback between LLM models
- Rate limiting and error handling
- Response timeout handling (60 seconds)

**REQ-TECH-3: Export Technologies**
- PDF generation using ReportLab
- HTML generation using Jinja2 templates
- Base64 image embedding for standalone files
- Print-optimized CSS for HTML exports

### 4.2 User Interface Requirements

**REQ-UI-1: Responsive Design**
- Desktop-first approach (1920x1080 optimized)
- Tablet compatibility (1024x768 minimum)
- Mobile accessibility for emergency use
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**REQ-UI-2: Brand Compliance**
- Calance color scheme implementation
- Typography using Inter font family
- Consistent spacing and layout
- Professional aesthetic throughout

### 4.3 Integration Requirements

**REQ-INT-1: OpenRouter LLM Router**
- Gemini Flash for fast drafts
- Claude Sonnet for quality refinement
- GPT-4o Mini for structured extraction
- Automatic model selection based on task type

**REQ-INT-2: Asset Management**
- Logo assets in multiple formats
- Font loading optimization
- Image base64 encoding
- Template management system

---

## 5. Success Metrics and Validation Criteria

### 5.1 User Adoption Metrics

**Business Success Criteria:**
- 50% of target sales leadership population actively using within first quarter
- Users averaging 2-3 artifact creations per week
- < 2 minute onboarding time for new users
- 75% reduction in artifact creation time vs manual methods

### 5.2 Performance Validation

**Technical Success Criteria:**
- All response time requirements met (see Section 3.1)
- 99%+ uptime during business hours
- 98%+ successful export rate
- Zero training required for new users

### 5.3 Quality Validation

**Output Quality Criteria:**
- Generated content requires < 2 minutes of editing
- Brand consistency across 100% of outputs
- Professional formatting quality
- Error-free export generation

---

## 6. MVP Scope and Exclusions

### 6.1 In Scope for MVP

**Core Features:**
- Complete Case Study Edge module with PDF/HTML export
- Complete Presentation Edge module with HTML export
- Complete Recruiting Toolkit with all 8 tools
- Full branding and styling system
- Docker deployment package
- Basic error handling and validation

### 6.2 Out of Scope for MVP

**Future Enhancements:**
- PPTX export functionality (Phase 2)
- Nano-Banana image generation integration (Phase 2)
- Advanced analytics dashboard (Phase 2)
- Mobile application version (Future)
- CRM integration capabilities (Future)
- User management and role-based access (Future)
- Content versioning and collaboration (Future)

---

## 7. Implementation Timeline

### 7.1 5-Day Development Plan

**Day 1: Foundation**
- Project scaffolding (React + Vite, Flask)
- Docker setup and configuration
- Brand system implementation
- Navigation shell and shared components

**Day 2: Case Study Module**
- Input form implementation
- LLM integration and generation
- Preview system
- PDF/HTML export functionality

**Day 3: Presentation Module**
- Wizard interface implementation
- Slide generation logic
- Preview carousel
- HTML presentation export

**Day 4: Recruiting Toolkit**
- Tabbed interface
- All 8 recruiting tools implementation
- Copy-to-clipboard functionality

**Day 5: Polish and Deployment**
- Error handling and validation
- Mobile responsiveness
- Performance optimization
- Documentation and deployment package

---

## 8. Risk Mitigation

### 8.1 Technical Risks

**OpenRouter API Dependency**
- Mitigation: Implement retry logic and fallback models
- Monitor: API response times and error rates

**Export Generation Failures**
- Mitigation: Robust error handling and user feedback
- Monitor: Export success rates and file quality

### 8.2 User Adoption Risks

**Learning Curve Resistance**
- Mitigation: Zero-training interface design
- Monitor: Time-to-first-artifact metrics

**Output Quality Concerns**
- Mitigation: Multiple LLM models with intelligent routing
- Monitor: User satisfaction and feedback scores

---

## 9. Acceptance Testing Checklist

### 9.1 Module Testing

**Case Study Edge:**
- [ ] Form validation and submission
- [ ] AI generation with all required fields
- [ ] Feedback refinement workflow
- [ ] PDF export functionality
- [ ] HTML export functionality
- [ ] Brand consistency validation

**Presentation Edge:**
- [ ] Wizard form completion
- [ ] Slide generation from key points
- [ ] Slide navigation and preview
- [ ] Per-slide refinement
- [ ] HTML presentation export
- [ ] Keyboard navigation in exports

**Recruiting Toolkit:**
- [ ] All 8 tools functional
- [ ] Tab switching and state management
- [ ] Copy-to-clipboard functionality
- [ ] Output formatting validation
- [ ] Input validation for all forms

### 9.2 Integration Testing

- [ ] OpenRouter API connectivity
- [ ] Docker container deployment
- [ ] nginx reverse proxy configuration
- [ ] File export and download
- [ ] Cross-browser compatibility

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-03 | Claude | Initial requirements extraction from technical spec and product brief |
| | | | Ready for 3-5 day MVP implementation |

---

**Status:** Requirements Complete - Ready for Implementation
**Next Step:** Proceed with Day 1 Foundation Development