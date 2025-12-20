# Calance_Edge - Epic Breakdown

**Author:** JB
**Date:** 2025-12-03
**Project Level:** Intermediate
**Target Scale:** MVP (3-5 day timeline)

---

## Overview

This document provides the complete epic and story breakdown for Calance_Edge, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

Calance Edge will be delivered through **4 focused epics** that deliver incremental user value while establishing the technical foundation for rapid sales artifact creation. Each epic builds upon previous capabilities to deliver a complete AI-powered sales enablement platform.

**Epic Structure:**
- **Epic 1: Foundation & Infrastructure** - Technical foundation and deployment setup
- **Epic 2: Case Study Edge** - Complete client success story creation workflow
- **Epic 3: Presentation Edge** - Professional presentation generation and refinement
- **Epic 4: Recruiting Toolkit** - Comprehensive technical staffing artifact generation

This structure follows the user-value-first principle, with each epic delivering something sales users can immediately utilize while building toward the complete unified platform.

---

## Functional Requirements Inventory

### **Case Study Edge Module (5 FRs)**
- **REQ-CS-1:** Case Study Input Form (Client data, industry, challenge, solution, metrics, benefits)
- **REQ-CS-2:** AI-Powered Generation (OpenRouter API, Gemini Flash/Claude Sonnet routing)
- **REQ-CS-3:** Live Preview System (PDF-style rendering in browser)
- **REQ-CS-4:** Feedback and Refinement (Natural language iteration, targeted regeneration)
- **REQ-CS-5:** Export Capabilities (PDF + standalone HTML with branding)

### **Presentation Edge Module (6 FRs)**
- **REQ-PRES-1:** Presentation Setup Wizard (Title, purpose, audience, theme selection)
- **REQ-PRES-2:** Key Points Input System (Dynamic entry, reorder, templates)
- **REQ-PRES-3:** AI Slide Generation (Template selection, content creation, speaker notes)
- **REQ-PRES-4:** Slide Preview and Navigation (Carousel, slide selection, indicators)
- **REQ-PRES-5:** Per-Slide Refinement (Targeted feedback, individual slide regeneration)
- **REQ-PRES-6:** HTML Presentation Export (Self-contained, keyboard navigation, fullscreen)

### **Recruiting Toolkit Module (10 FRs)**
- **REQ-REC-1:** Tabbed Interface (8 distinct recruiting tools with state management)
- **REQ-REC-2:** JD Enhancer (Branding, formatting, copy-to-clipboard)
- **REQ-REC-3:** Sourcing Email Generator (Personalized emails, 3 subject lines)
- **REQ-REC-4:** Boolean Search String Creator (Platform-specific optimization)
- **REQ-REC-5:** Candidate Submittal Generator (11-field form, experience summary)
- **REQ-REC-6:** Interview Prep Email Builder (15-step wizard, logistics)
- **REQ-REC-7:** Mock Interview Questions (Position analysis, vetting questions)
- **REQ-REC-8:** Skills/Title/Location Extractor (Job description parsing)
- **REQ-REC-9:** Executive Summary Writer (Candidate profile summarization)
- **REQ-REC-10:** Copy-to-Clipboard Functionality (All tool outputs)

### **Technical Infrastructure Requirements (7 NFRs)**
- **REQ-TECH-1:** Container-Based Deployment (Docker, nginx reverse proxy)
- **REQ-TECH-2:** OpenRouter API Integration (Intelligent LLM routing, fallback)
- **REQ-TECH-3:** Export Technologies (ReportLab PDF, Jinja2 HTML)
- **REQ-UI-1:** Responsive Design (Desktop-first, cross-browser)
- **REQ-UI-2:** Brand Compliance (Calance colors, typography, styling)
- **REQ-INT-1:** OpenRouter LLM Router (Model selection by task type)
- **REQ-INT-2:** Asset Management (Logo, fonts, base64 encoding)

**Total Requirements: 28 functional and non-functional requirements**

---

## FR Coverage Map

{{fr_coverage_map}}

---

## Epic 1: Foundation & Infrastructure

Establish the technical foundation and core infrastructure that enables all subsequent modules. This epic creates the deployment pipeline, brand system, and shared services that power the entire Calance Edge platform.

### Story 1.1: Project Scaffolding and Core Setup

As a developer, I want to create the project foundation with React + Vite frontend and Flask backend, So that I have a solid technical base for building all modules.

**Acceptance Criteria:**

**Given** I am setting up the Calance Edge project
**When** I initialize the project structure
**Then** I have a working React + Vite frontend application with routing
**And** I have a Flask backend with proper API structure
**And** I have Docker Compose configuration for local development
**And** I have shared UI components library created
**And** I have TailwindCSS configured with Calance brand colors

**Technical Notes:**
- Use React 18.x with Vite 5.x for optimal development experience
- Configure TailwindCSS with CSS variables for Calance brand colors (navy #1e3a5f, blue #2563eb, orange #f97316)
- Set up React Router 6.x for navigation between modules
- Create component structure in /src/components/ui/ for reusable elements
- Initialize Zustand for state management
- Configure development environment with hot reload

**Prerequisites:** None (foundation story)

---

### Story 1.2: Docker Deployment Configuration

As a DevOps engineer, I want to configure Docker containers for production deployment, So that the application can be reliably deployed and scaled.

**Acceptance Criteria:**

**Given** I have the project structure initialized
**When** I create Docker configuration
**Then** I have a multi-stage Dockerfile for frontend (build + nginx)
**And** I have a Python 3.11 slim Dockerfile for backend
**And** I have docker-compose.yml with proper service orchestration
**And** I have health checks configured for backend service
**And** I have persistent data volumes configured for exports
**And** nginx reverse proxy properly routes between frontend and backend

**Technical Notes:**
- Frontend container should serve static files via nginx on port 80
- Backend container should run Flask with Gunicorn on port 5000
- Configure health checks for backend: curl -f http://localhost:5000/api/health
- Set up data volumes: /app/data/exports, /app/data/templates, /app/data/brand
- Configure nginx to proxy /api/* to backend container
- Add proper restart policies and environment variable handling

**Prerequisites:** Story 1.1 - Project Scaffolding Complete

---

### Story 1.3: Brand System and Shared Components

As a UI developer, I want to implement the Calance brand system and create reusable components, So that all modules have consistent styling and user experience.

**Acceptance Criteria:**

**Given** I have the project foundation
**When** I implement the brand system
**Then** I have CSS variables defined for all brand colors and typography
**And** I have reusable Button component with variants (primary, secondary, ghost)
**And** I have reusable Input component with validation states
**And** I have reusable Card component for consistent layouts
**And** I have LoadingSpinner component for async operations
**And** I have Navigation component with active state indicators
**And** I have responsive design patterns implemented (desktop-first)

**Technical Notes:**
- Use CSS custom properties for theme consistency (:root variables)
- Button component should support loading state with spinner
- Input component should have focus states matching brand colors
- Card component should support different variants (default, elevated)
- Navigation should use Lucide React icons and support collapsed state
- Implement responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

**Prerequisites:** Story 1.1 - Project Scaffolding Complete

---

### Story 1.4: LLM Router Service Integration

As a backend developer, I want to integrate the OpenRouter API with intelligent model routing, So that all AI-powered features can generate high-quality content.

**Acceptance Criteria:**

**Given** I have the backend infrastructure
**When** I implement the LLM router service
**Then** I have OpenRouter API client configured with proper authentication
**And** I have model selection logic based on task type (Gemini Flash for drafts, Claude Sonnet for quality)
**And** I have rate limiting and timeout handling (60 seconds)
**And** I have fallback mechanisms between models
**And** I have structured JSON extraction capability using GPT-4o Mini
**And** I have error handling and retry logic for API failures

**Technical Notes:**
- Use httpx for async HTTP requests to OpenRouter API
- Implement model presets: fast_draft (Gemini Flash), quality_final (Claude Sonnet), structured_extraction (GPT-4o Mini)
- Configure proper headers: Authorization, HTTP-Referer, X-Title
- Handle different response formats and error codes from OpenRouter
- Implement exponential backoff for retry logic
- Add logging for API usage and performance monitoring

**Prerequisites:** Story 1.2 - Docker Configuration Complete

---

## Epic 1 Complete: Foundation & Infrastructure

**Stories Created:** 4
**FR Coverage:** Technical Infrastructure Requirements (REQ-TECH-1, REQ-TECH-2, REQ-INT-1, REQ-INT-2)
**Technical Context Used:** Complete technical specification architecture, Docker deployment, LLM integration patterns

Ready for Case Study Edge module development.

---

## Epic 2: Case Study Edge

Deliver complete client success story creation workflow with AI-powered generation, live preview, and professional export capabilities. This epic provides immediate value to sales teams by transforming client data into compelling case studies.

### Story 2.1: Case Study Input Form Implementation

As a sales professional, I want to input client data through an intuitive form interface, So that I can provide all necessary information for AI-powered case study generation.

**Acceptance Criteria:**

**Given** I am on the Case Study Edge module
**When** I access the input form
**Then** I see all required fields: Client Name (text), Industry (dropdown), Business Challenge (textarea), Solution Delivered (textarea)
**And** I see optional fields: Subtitle/Tagline, Technology Stack, Project Timeline, ROI Statement
**And** I can dynamically add multiple Metrics entries (Before/After/Improvement)
**And** I can dynamically add multiple Benefits list items
**And** all required fields have proper validation with visual indicators
**And** the form has a "Generate Draft" button that is disabled until all required fields are complete

**Technical Notes:**
- Use React Hook Form for form state management and validation
- Implement dynamic field arrays for metrics and benefits using @hookform/resolvers
- Create reusable FormField component with label, input, validation states
- Industry dropdown should include: Technology, Healthcare, Finance, Manufacturing, Retail, Real Estate, Other
- Metrics fields should have group validation (at least one metric required for complete case study)
- Add auto-save functionality for form data in browser localStorage

**Prerequisites:** Epic 1 - Foundation Complete

---

### Story 2.2: AI-Powered Case Study Generation

As a sales professional, I want to generate professional case study drafts from my input data, So that I can quickly create compelling client success stories.

**Acceptance Criteria:**

**Given** I have completed the case study input form
**When** I click "Generate Draft"
**Then** the system calls POST /api/case-study/generate with my form data
**And** the LLM enhances my business challenge with specific pain points
**And** the LLM improves my solution description with outcome-focused language
**And** the system generates a compelling headline from client data
**And** the system creates an executive summary highlighting key achievements
**And** I receive the complete draft within 30 seconds with visual loading indicators
**And** the system returns a generation_id for tracking and refinement

**Technical Notes:**
- Implement POST /api/case-study/generate endpoint with proper request/response format
- Use Gemini Flash for initial fast drafts, then Claude Sonnet for quality enhancement
- Create prompt templates for enhancing challenge, solution, and generating headlines
- Store generation data temporarily for refinement workflow
- Implement timeout handling (60 seconds) with user feedback
- Add progress indicators showing different generation phases (enhancing, generating, finalizing)

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 2.1 - Input Form Complete

---

### Story 2.3: Live Preview System Implementation

As a sales professional, I want to see a real-time preview of my generated case study, So that I can review the content before finalizing and exporting.

**Acceptance Criteria:**

**Given** I have generated a case study draft
**When** I view the preview
**Then** I see the complete case study rendered in PDF-style format within the browser
**And** I can see all sections: Title header, Challenge, Solution, Metrics table, Benefits list
**And** the preview includes Calance branding (logo, colors, typography)
**And** I can scroll through the complete case study content
**And** the preview updates dynamically when I make refinements
**And** I can expand/collapse sections for easier review
**And** the preview has proper responsive behavior for different screen sizes

**Technical Notes:**
- Create PreviewPanel component using the same styling as PDF export
- Implement CSS that matches ReportLab PDF styling (fonts, spacing, colors)
- Use the brand configuration for consistent colors and typography
- Create separate preview sections that mirror PDF layout structure
- Implement smooth scrolling and section navigation
- Add expandable/collapsible sections with animation for better UX
- Use the same data structure as PDF generation for consistency

**Prerequisites:** Story 2.2 - AI Generation Complete

---

### Story 2.4: Feedback and Refinement Workflow

As a sales professional, I want to refine my case study using natural language feedback, So that I can perfect the content for specific prospects and use cases.

**Acceptance Criteria:**

**Given** I have generated a case study draft
**When** I provide feedback in the feedback input
**Then** I can submit specific feedback like "Make the ROI more prominent in the headline"
**And** I can choose to refine specific sections (title, challenge, solution, executive summary)
**And** the system regenerates only the requested sections while preserving others
**And** I see updated content within 20 seconds of submitting feedback
**And** I can continue iterating with multiple rounds of feedback
**And** the system maintains context across multiple refinement iterations
**And** I have an "Undo" option to revert to previous versions

**Technical Notes:**
- Implement POST /api/case-study/refine endpoint with feedback and section targeting
- Create prompt templates for handling different types of refinement feedback
- Store version history for undo functionality (keep last 3 versions)
- Implement smart feedback parsing to identify sections and intent
- Add loading states and progress indicators for refinement process
- Create feedback suggestions based on common refinement patterns
- Maintain the same generation_id across refinement sessions

**Prerequisites:** Story 2.3 - Preview System Complete

---

### Story 2.5: PDF Export Implementation

As a sales professional, I want to export my case study as a professional PDF, So that I can share it with prospects and use it in sales materials.

**Acceptance Criteria:**

**Given** I have finalized my case study content
**When** I click "Download PDF"
**Then** the system generates a PDF in 8.5" x 11" letter size
**And** the PDF includes Calance logo and branding colors
**And** the PDF has professional typography and layout (2-3 pages typical)
**And** the PDF includes all sections: title, challenge, solution, metrics, benefits
**And** the PDF has proper headers, footers, and page numbers
**And** the PDF download starts automatically and is properly named
**And** the PDF quality is suitable for printing and email sharing

**Technical Notes:**
- Use ReportLab for PDF generation with custom styles matching Calance brand
- Implement PDF generator class with reusable styles (title, heading, body)
- Create proper page layout with margins (0.75" on all sides)
- Add Calance logo as embedded image in PDF header
- Implement tables for metrics data with proper formatting
- Add footer with page numbers and contact information
- Generate unique filenames with client name and date
- Handle edge cases for long content (page breaks, overflow)

**Prerequisites:** Story 2.4 - Refinement Workflow Complete

---

### Story 2.6: Standalone HTML Export

As a sales professional, I want to export my case study as a standalone HTML file, So that I can share it digitally and use it in online presentations.

**Acceptance Criteria:**

**Given** I have finalized my case study content
**When** I click "Download HTML"
**Then** the system generates a single self-contained HTML file
**And** the HTML includes all CSS and JavaScript embedded (no external dependencies)
**And** the HTML has Calance logo embedded as base64 image
**And** the HTML is responsive for different screen sizes
**And** the HTML has print-optimized CSS for high-quality printing
**And** the HTML works offline without any external resources
**And** the HTML has proper metadata for SEO and sharing

**Technical Notes:**
- Use Jinja2 templates for HTML generation with consistent styling
- Embed all CSS in <style> tags in HTML head
- Convert Calance logo to base64 and embed in HTML
- Implement responsive CSS with media queries for different screen sizes
- Add print-specific CSS for high-quality printed output
- Include proper HTML5 meta tags for character encoding and viewport
- Add OpenGraph meta tags for social media sharing
- Test HTML file works when opened directly in browser (no server required)

**Prerequisites:** Story 2.5 - PDF Export Complete

---

## Epic 2 Complete: Case Study Edge

**Stories Created:** 6
**FR Coverage:** Complete Case Study Edge Module (REQ-CS-1 through REQ-CS-5)
**Technical Context Used:** LLM integration, export technologies, brand system, API specifications

Ready for Presentation Edge module development.

---

## Epic 3: Presentation Edge

Deliver professional sales presentation creation from key talking points with AI-powered slide generation, individual slide refinement, and HTML export capabilities. This epic enables sales teams to quickly create compelling presentations for different audiences.

### Story 3.1: Presentation Setup Wizard

As a sales professional, I want to set up my presentation parameters through an intuitive wizard, So that the AI can generate targeted content for my specific audience and purpose.

**Acceptance Criteria:**

**Given** I am in the Presentation Edge module
**When** I access the setup wizard
**Then** I see input fields for Presentation Title (text, required)
**And** I see Purpose/Goal (textarea, required) with examples
**And** I see Target Audience (text, required) with suggestions (Executive, Technical, C-level)
**And** I see Theme/Tone selection dropdown (Professional, Energetic, Technical, Executive)
**And** I see descriptive help text for each field to guide my input
**And** I see real-time validation with visual feedback
**And** I can proceed to key points only when all required fields are complete

**Technical Notes:**
- Create PresentationWizard component with multi-step form
- Implement form validation using React Hook Form
- Add helpful examples and tooltips for each input field
- Create theme selection with visual previews (color schemes, typography)
- Store wizard data in component state for persistence
- Add auto-save to localStorage to prevent data loss
- Implement smooth transitions between wizard steps

**Prerequisites:** Epic 1 - Foundation Complete

---

### Story 3.2: Key Points Input System

As a sales professional, I want to input my key talking points with dynamic management, So that the AI can create one slide per talking point.

**Acceptance Criteria:**

**Given** I have completed the presentation setup
**When** I access the key points input
**Then** I can add individual key points with "Add Key Point" button
**And** I must enter minimum 3 key points and maximum 15 key points
**And** I can edit any key point inline
**And** I can reorder key points using drag-and-drop or up/down arrows
**And** I can delete individual key points with confirmation
**And** I see visual indicators showing which key point becomes which slide
**And** the system suggests common presentation structures as templates
**And** I can apply templates like "Problem → Solution → Benefits → CTA"

**Technical Notes:**
- Implement dynamic array of key points using React state
- Add drag-and-drop functionality using @dnd-kit or similar library
- Create reusable KeyPoint component with edit/delete capabilities
- Implement validation for minimum/maximum key points
- Add template system with pre-defined key point structures
- Store key points order for slide generation
- Add visual numbering and preview indicators

**Prerequisites:** Story 3.1 - Setup Wizard Complete

---

### Story 3.3: AI Slide Generation Engine

As a sales professional, I want the AI to convert my key points into professional slides, So that I have a complete presentation without manual slide creation.

**Acceptance Criteria:**

**Given** I have entered my key points and presentation parameters
**When** I click "Generate Presentation"
**Then** the system processes each key point into a complete slide within 45 seconds
**And** the system automatically selects appropriate slide templates for each point
**And** the system generates title slides for key points with headline focus
**And** the system creates content slides with bullet points for detailed explanations
**And** the system adds speaker notes for each slide with talking points
**And** the system maintains consistent styling throughout the presentation
**And** the system creates opening and closing slides automatically
**And** I receive notification when generation is complete

**Technical Notes:**
- Implement POST /api/presentation/generate endpoint
- Create slide template system (title, content, metrics, two-column, quote, closing)
- Develop AI prompt templates for converting key points to slide content
- Use Gemini Flash for initial slide content generation
- Use Claude Sonnet for final polish and speaker notes
- Implement parallel processing for multiple slide generation
- Create slide data structure with content, template, and metadata
- Add progress tracking showing which slides are being generated

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 3.2 - Key Points Complete

---

### Story 3.4: Slide Preview and Navigation

As a sales professional, I want to preview and navigate through my generated slides, So that I can review the complete presentation before exporting.

**Acceptance Criteria:**

**Given** I have generated a presentation
**When** I access the preview interface
**Then** I see a carousel view with Previous/Next navigation buttons
**And** I can click on slide thumbnails to jump directly to any slide
**And** I see current slide indicator (e.g., "Slide 3 of 8")
**And** I can view the complete slide content in a central preview area
**And** I see slide thumbnails with template type indicators
**And** I can navigate using keyboard arrow keys
**And** the preview has smooth transitions between slides
**And** I can zoom in/out for detailed review

**Technical Notes:**
- Create SlidePreview component with carousel functionality
- Implement slide navigation state management
- Create thumbnail generation for all slides
- Add keyboard event handlers for arrow key navigation
- Implement smooth CSS transitions for slide changes
- Add zoom functionality with mouse wheel controls
- Store slide navigation history for undo/redo
- Ensure responsive design for different screen sizes

**Prerequisites:** Story 3.3 - Slide Generation Complete

---

### Story 3.5: Per-Slide Refinement System

As a sales professional, I want to refine individual slides with targeted feedback, So that I can perfect specific slides without regenerating the entire presentation.

**Acceptance Criteria:**

**Given** I am viewing a specific slide in the preview
**When** I provide feedback in the refinement panel
**Then** I can submit targeted feedback like "Add specific metrics for healthcare industry"
**And** I can choose to regenerate only the current slide while preserving others
**And** I see the updated slide within 15 seconds of submitting feedback
**And** I can provide global feedback for presentation-wide changes
**And** I can switch between individual slide feedback and global feedback
**And** I see visual confirmation when slide regeneration is complete
**And** I maintain the ability to undo slide changes

**Technical Notes:**
- Implement POST /api/presentation/refine endpoint
- Create targeted refinement prompt templates for different slide types
- Add feedback input component with history and suggestions
- Implement slide-specific regeneration without affecting other slides
- Store slide version history for undo functionality
- Add global feedback processing that affects all slides
- Create feedback history panel for tracking changes
- Implement smart feedback parsing for different slide contexts

**Prerequisites:** Story 3.4 - Preview Navigation Complete

---

### Story 3.6: HTML Presentation Export

As a sales professional, I want to export my presentation as a standalone HTML file, So that I can present it digitally and share it with prospects.

**Acceptance Criteria:**

**Given** I have finalized my presentation slides
**When** I click "Download HTML Presentation"
**Then** the system generates a single self-contained HTML file
**And** the HTML includes keyboard navigation (arrow keys, spacebar)
**And** the HTML has responsive scaling for different screen sizes
**And** the HTML includes full-screen presentation mode with F11 key
**And** the HTML has print to PDF capability
**And** the HTML includes embedded Calance branding and styling
**And** the HTML works offline without any external dependencies
**And** the presentation supports speaker notes view

**Technical Notes:**
- Use Jinja2 templates for HTML presentation generation
- Implement JavaScript for keyboard navigation and slide controls
- Add CSS for responsive scaling and full-screen modes
- Include speaker notes as hidden elements toggled with 'S' key
- Add print CSS optimized for PDF generation from browser
- Embed all assets (logo, fonts, images) as base64
- Implement smooth CSS transitions between slides
- Add progress indicators and slide numbers in presentation mode

**Prerequisites:** Story 3.5 - Per-Slide Refinement Complete

---

## Epic 3 Complete: Presentation Edge

**Stories Created:** 6
**FR Coverage:** Complete Presentation Edge Module (REQ-PRES-1 through REQ-PRES-6)
**Technical Context Used:** LLM integration, HTML templating, slide generation patterns, export technologies

Ready for Recruiting Toolkit module development.

---

## Epic 4: Recruiting Toolkit

Deliver comprehensive recruiting workflow tools with AI-powered artifact generation for all stages of the recruiting process. This epic provides immediate value to recruiting teams with 8 specialized tools in a unified interface.

### Story 4.1: Tabbed Interface Framework

As a recruiter, I want to navigate between 8 different recruiting tools in a single interface, So that I can efficiently switch between different recruiting workflows.

**Acceptance Criteria:**

**Given** I am in the Recruiting Toolkit module
**When** I access the interface
**Then** I see 8 distinct tabs: JD Enhancer, Sourcing Email, Boolean Search, Candidate Submittal, Interview Prep, Mock Interview, Skills Extractor, Executive Summary
**And** I can click any tab to switch to that tool
**And** the system maintains separate state for each tool (data is preserved when switching)
**And** I see visual indicators for the active tab
**And** the tabs are organized in a single row with horizontal scrolling if needed
**And** I can navigate tabs using keyboard (Ctrl+Tab, Ctrl+Shift+Tab)
**And** the system saves my last active tab for future sessions

**Technical Notes:**
- Create RecruitingModule component with tab navigation state
- Implement React state management for preserving individual tool data
- Create reusable Tab component with active/inactive states
- Add keyboard navigation support for tab switching
- Implement localStorage to persist last active tab
- Use CSS Grid or Flexbox for responsive tab layout
- Add tooltips for tab names when screen space is limited

**Prerequisites:** Epic 1 - Foundation Complete

---

### Story 4.2: JD Enhancer Tool

As a recruiter, I want to enhance job descriptions with Calance branding and improved formatting, So that I can create more compelling job postings.

**Acceptance Criteria:**

**Given** I am on the JD Enhancer tab
**When** I paste a raw job description
**Then** the system enhances the description with Calance branding and language
**And** the system improves formatting with better structure and readability
**And** the system creates more compelling benefit statements
**And** the output is formatted in markdown for easy copying
**And** I have a copy-to-clipboard button with visual confirmation
**And** I can edit the enhanced description before copying
**And** the system maintains original job requirements while improving presentation

**Technical Notes:**
- Implement POST /api/recruiting/jd-enhancer endpoint
- Create prompt templates for enhancing job descriptions
- Add textarea input with paste functionality and formatting
- Implement markdown editor with preview capability
- Add copy-to-clipboard functionality with success feedback
- Create brand enhancement rules for Calance language patterns
- Add edit capability for final adjustments before copying

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.3: Sourcing Email Generator

As a recruiter, I want to generate personalized sourcing emails with multiple subject line options, So that I can efficiently reach out to qualified candidates.

**Acceptance Criteria:**

**Given** I am on the Sourcing Email Generator tab
**When** I input role title, candidate first name, key skill, and recruiter name
**Then** the system generates 3 different subject line options
**And** the system creates a personalized email body that mentions the candidate's name
**And** the system highlights the key skill experience in the email
**And** the system includes a professional call-to-action
**And** the system adds Calance signature block with contact information
**And** I can copy the complete email with one click
**And** I can customize the email before copying if needed

**Technical Notes:**
- Implement POST /api/recruiting/sourcing-email endpoint
- Create input form with fields: role, candidate_name, key_skill, recruiter_name
- Generate multiple subject line variations (formal, casual, intriguing)
- Create email templates with personalization placeholders
- Add copy-to-clipboard functionality for complete email
- Include Calance branding in email signature
- Add email preview functionality before copying

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.4: Boolean Search String Creator

As a recruiter, I want to generate platform-specific Boolean search strings, So that I can efficiently find qualified candidates across different job boards.

**Acceptance Criteria:**

**Given** I am on the Boolean Search String Creator tab
**When** I paste a job description
**Then** the system generates Boolean strings optimized for different platforms
**And** I get LinkedIn Recruiter string with proper syntax
**And** I get Dice/Monster string with platform-specific operators
**And** I get Indeed string with indeed-specific formatting
**And** I get GitHub string (if technical role) with code-specific terms
**And** I can copy each string individually with platform-labeled buttons
**And** the system explains the Boolean logic used in each string

**Technical Notes:**
- Implement POST /api/recruiting/boolean-search endpoint
- Create platform-specific Boolean string templates
- Add job description parsing with skills extraction
- Implement syntax optimization for each platform (LinkedIn, Dice, Indeed, GitHub)
- Add platform-specific operator knowledge (AND, OR, NOT, parentheses)
- Create copy buttons for each platform with visual feedback
- Add help text explaining Boolean string logic

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.5: Candidate Submittal Generator

As a recruiter, I want to create formatted candidate submittal documents with experience summaries, So that I can efficiently present candidates to hiring managers.

**Acceptance Criteria:**

**Given** I am on the Candidate Submittal Generator tab
**When** I complete the 11-field guided form
**Then** I input candidate name, contact information, position applied for
**And** I input years of experience, key skills, previous companies
**And** I input education details, salary expectations, availability
**And** I input work authorization and additional notes
**Then** the system generates a formatted submittal document
**And** the system includes a 5-sentence experience summary highlighting achievements
**And** the output is in professional format suitable for hiring managers
**And** I can copy the complete submittal with one click

**Technical Notes:**
- Create comprehensive form with 11 fields as specified
- Implement form validation for required and optional fields
- Generate professional submittal document template
- Create AI prompt for generating experience summaries
- Add formatted output with proper structure and spacing
- Include copy-to-clipboard functionality
- Add preview mode before copying

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.6: Interview Prep Email Builder

As a recruiter, I want to generate comprehensive interview preparation emails, So that candidates have all necessary information for successful interviews.

**Acceptance Criteria:**

**Given** I am using the Interview Prep Email Builder
**When** I complete the 15-step wizard
**Then** I input interview date/time, format (phone/video/in-person)
**Then** I input interviewer names and roles
**Then** I input job description and company background
**Then** I input role responsibilities and technical requirements
**Then** I input cultural fit aspects and expected duration
**Then** I input materials needed and location/link details
**Then** I input dress code, parking information, contact person
**Then** I input additional instructions
**Then** the system generates a complete prep email with all logistics
**And** the email includes calendar-ready details for easy scheduling
**And** the email contains clear interview format and duration information
**And** the email includes preparation instructions and materials needed

**Technical Notes:**
- Create 15-step wizard form with progress indicator
- Implement form validation for critical logistics information
- Generate comprehensive email template with all interview details
- Include calendar-friendly formatting (date/time blocks)
- Add logistics section with all practical information
- Create copy-to-clipboard functionality for complete email
- Add preview mode before copying

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.7: Mock Interview Questions Generator

As a recruiter, I want to generate vetting questions with model answers, So that I can effectively evaluate candidate qualifications and fit.

**Acceptance Criteria:**

**Given** I am on the Mock Interview Questions tab
**When** I paste a job description
**Then** the system generates a position summary
**And** the system creates 3 vetting questions with detailed model answers
**And** the system identifies red flags to watch for in responses
**And** the system identifies green flags that indicate strong candidates
**And** the questions are categorized by type (technical, behavioral, situational)
**And** I can copy individual questions or the complete set
**And** the system includes evaluation criteria for each question

**Technical Notes:**
- Implement job description parsing for role requirements
- Generate position summary highlighting key responsibilities
- Create question templates for different categories (technical, behavioral, situational)
- Generate model answers with specific evaluation criteria
- Create red/green flag identification system
- Add categorization system for question types
- Include copy functionality for individual questions and complete sets

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.8: Skills/Title/Location Extractor

As a recruiter, I want to extract key information from job descriptions, So that I can optimize job postings and search criteria.

**Acceptance Criteria:**

**Given** I am on the Skills/Title/Location Extractor tab
**When** I paste a job description
**Then** the system parses and extracts a prioritized technical skills list
**And** the system suggests optimized job title alternatives
**And** the system extracts location codes (ZIP codes, area codes) if present
**And** the system formats output for easy input into recruiting systems
**And** I can copy each extracted section individually
**And** the system identifies mandatory vs. preferred skills
**And** the system suggests salary ranges based on extracted skills and location

**Technical Notes:**
- Implement job description parsing with structured data extraction
- Create skills extraction algorithm with priority ranking
- Generate optimized job title suggestions based on content
- Extract location information and standardize formats
- Format output for ATS/recruiting system compatibility
- Add mandatory/preferred skills classification
- Include salary range estimation based on market data

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.9: Executive Summary Writer

As a recruiter, I want to generate candidate summaries for executive review, So that hiring managers can quickly assess candidate qualifications.

**Acceptance Criteria:**

**Given** I am on the Executive Summary Writer tab
**When** I input job description and candidate profile/resume
**Then** the system generates a 3-5 sentence executive summary
**And** the summary highlights quantified achievements from the resume
**And** the summary shows skills alignment with the job requirements
**And** the summary includes key differentiators that make the candidate stand out
**And** the output is formatted in executive-ready language
**And** I can edit the summary before copying
**And** I can copy the complete summary with one click

**Technical Notes:**
- Create dual-input form for job description and candidate profile
- Implement resume parsing for achievements and experience
- Generate executive summary template with quantified results
- Create skills matching algorithm with job requirements
- Include differentiator identification system
- Format output in professional executive language
- Add copy-to-clipboard functionality with visual feedback

**Prerequisites:** Story 1.4 - LLM Router Complete, Story 4.1 - Tab Interface Complete

---

### Story 4.10: Universal Copy-to-Clipboard System

As a recruiter using any tool in the Recruiting Toolkit, I want reliable copy-to-clipboard functionality, So that I can easily use generated content in my recruiting workflows.

**Acceptance Criteria:**

**Given** I am using any recruiting tool (JD Enhancer, Sourcing Email, etc.)
**When** I click any copy button
**Then** the content is copied to my clipboard immediately
**And** I see visual confirmation that the copy was successful
**And** the copied content is properly formatted for its intended use
**And** the system handles clipboard permissions gracefully
**And** I can retry copying if it fails the first time
**And** the copy functionality works across different browsers
**And** the system provides fallback options if clipboard API is not available

**Technical Notes:**
- Implement universal copy-to-clipboard component used across all tools
- Use modern Clipboard API with fallback to execCommand
- Add visual feedback with success/error states
- Handle browser permission requirements gracefully
- Implement retry logic for failed copy attempts
- Add proper content formatting for different tool outputs
- Include accessibility features for keyboard users

**Prerequisites:** Stories 4.2-4.9 - All recruiting tools implemented

---

## Epic 4 Complete: Recruiting Toolkit

**Stories Created:** 10
**FR Coverage:** Complete Recruiting Toolkit Module (REQ-REC-1 through REQ-REC-10)
**Technical Context Used:** LLM integration, form handling, copy functionality, tab interface patterns

All MVP functionality complete and ready for deployment.

---

## FR Coverage Matrix

| FR | Epic | Story | Description |
|----|------|-------|-------------|
| REQ-CS-1 | Epic 2 | Story 2.1 | Case Study Input Form with all required and optional fields |
| REQ-CS-2 | Epic 2 | Story 2.2 | AI-Powered Generation with OpenRouter integration |
| REQ-CS-3 | Epic 2 | Story 2.3 | Live Preview System with PDF-style rendering |
| REQ-CS-4 | Epic 2 | Story 2.4 | Feedback and Refinement workflow |
| REQ-CS-5 | Epic 2 | Story 2.5, 2.6 | PDF and HTML Export capabilities |
| REQ-PRES-1 | Epic 3 | Story 3.1 | Presentation Setup Wizard |
| REQ-PRES-2 | Epic 3 | Story 3.2 | Key Points Input System with dynamic management |
| REQ-PRES-3 | Epic 3 | Story 3.3 | AI Slide Generation with template selection |
| REQ-PRES-4 | Epic 3 | Story 3.4 | Slide Preview and Navigation |
| REQ-PRES-5 | Epic 3 | Story 3.5 | Per-Slide Refinement |
| REQ-PRES-6 | Epic 3 | Story 3.6 | HTML Presentation Export |
| REQ-REC-1 | Epic 4 | Story 4.1 | Tabbed Interface for 8 recruiting tools |
| REQ-REC-2 | Epic 4 | Story 4.2 | JD Enhancer with branding and formatting |
| REQ-REC-3 | Epic 4 | Story 4.3 | Sourcing Email Generator with personalization |
| REQ-REC-4 | Epic 4 | Story 4.4 | Boolean Search String Creator |
| REQ-REC-5 | Epic 4 | Story 4.5 | Candidate Submittal Generator |
| REQ-REC-6 | Epic 4 | Story 4.6 | Interview Prep Email Builder |
| REQ-REC-7 | Epic 4 | Story 4.7 | Mock Interview Questions Generator |
| REQ-REC-8 | Epic 4 | Story 4.8 | Skills/Title/Location Extractor |
| REQ-REC-9 | Epic 4 | Story 4.9 | Executive Summary Writer |
| REQ-REC-10 | Epic 4 | Story 4.10 | Universal Copy-to-Clipboard System |
| REQ-TECH-1 | Epic 1 | Story 1.2 | Container-Based Deployment with Docker |
| REQ-TECH-2 | Epic 1 | Story 1.4 | OpenRouter API Integration with intelligent routing |
| REQ-TECH-3 | Epic 2, 3 | Stories 2.5, 2.6, 3.6 | Export Technologies (ReportLab PDF, Jinja2 HTML) |
| REQ-UI-1 | Epic 1 | Story 1.3 | Responsive Design implementation |
| REQ-UI-2 | Epic 1 | Story 1.3 | Brand Compliance with Calance colors and typography |
| REQ-INT-1 | Epic 1 | Story 1.4 | OpenRouter LLM Router with model selection |
| REQ-INT-2 | Epic 1 | Story 1.3 | Asset Management with logo, fonts, base64 encoding |

**Total Functional Requirements Covered:** 28/28 (100%)
**Total Stories Created:** 26 across 4 epics

---

## Summary

**Epic Breakdown Summary:**
- **Epic 1: Foundation & Infrastructure** - 4 stories establishing technical base
- **Epic 2: Case Study Edge** - 6 stories delivering complete case study workflow
- **Epic 3: Presentation Edge** - 6 stories delivering presentation creation capabilities
- **Epic 4: Recruiting Toolkit** - 10 stories delivering comprehensive recruiting tools

**Implementation Timeline:**
- **Day 1:** Epic 1 (Foundation) - Project setup, Docker, brand system, LLM integration
- **Day 2:** Epic 2 (Case Studies) - Complete case study creation workflow
- **Day 3:** Epic 3 (Presentations) - Complete presentation creation workflow
- **Day 4:** Epic 4 (Recruiting) - Complete recruiting toolkit implementation
- **Day 5:** Polish & Deployment - Testing, optimization, documentation

**Story Sizing:**
- All stories are designed for single developer completion in focused sessions
- Stories incorporate complete technical context from architecture specifications
- Each story delivers incremental user value while maintaining dependencies

**Ready for Implementation:**
This epic breakdown provides implementation-ready stories with complete acceptance criteria, technical guidance, and dependency management for the 3-5 day MVP delivery of Calance Edge.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document incorporates complete technical context from the architecture specification and is ready for Phase 4 implementation._