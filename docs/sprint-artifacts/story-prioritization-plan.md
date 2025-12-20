# Calance Edge - Story Prioritization & Dependency Management

**Project:** Calance Edge MVP
**Total Stories:** 26 stories across 4 epics
**Timeline:** 3-5 day sprint
**Last Updated:** December 3, 2025

---

## Executive Summary

This document outlines the prioritization strategy and dependency management for Calance Edge MVP development. Stories are prioritized based on user value, technical dependencies, and risk mitigation to ensure successful delivery within the compressed timeline.

**Prioritization Principles:**
1. **Foundation First** - Technical infrastructure must be complete before user-facing features
2. **Incremental Value** - Each day should deliver functional, testable modules
3. **Risk Mitigation** - High-risk technical components addressed early
4. **Dependency Management** - Clear prerequisites prevent blocking issues

---

## Epic Priority Sequence

### Priority 1: Epic 1 - Foundation & Infrastructure (Day 1)
**Why First:** All subsequent modules depend on technical foundation
**Risk Level:** High (technical complexity, Docker setup, LLM integration)
**Dependencies:** None (foundation epic)

### Priority 2: Epic 2 - Case Study Edge (Day 2)
**Why Second:** Demonstrates core AI value proposition with complete workflow
**Risk Level:** Medium (AI integration, export technologies)
**Dependencies:** Epic 1 Complete

### Priority 3: Epic 3 - Presentation Edge (Day 3)
**Why Third:** Builds on AI patterns established in Epic 2
**Risk Level:** Medium (slide generation, HTML presentation complexity)
**Dependencies:** Epic 1 Complete, Epic 2 patterns reusable

### Priority 4: Epic 4 - Recruiting Toolkit (Day 4)
**Why Fourth:** Most complex module with 8 tools but reuses established patterns
**Risk Level:** Medium-High (10 stories, complex state management)
**Dependencies:** Epic 1 Complete, UI patterns from Epics 2-3

---

## Daily Story Prioritization

### Day 1: Foundation Stories (Critical Path)
**Time Allocation:** 8 hours
**Parallel Development Possible:** Limited (sequential dependencies)

```
9:00-12:00 (3 hours)
├── Story 1.1: Project Scaffolding and Core Setup [BLOCKING]
│   Priority: CRITICAL
│   Risk: Low-Medium (standard setup)
│   Dependencies: None
│   Success Criteria: Working dev environment

1:00-3:00 (2 hours)
├── Story 1.2: Docker Deployment Configuration [HIGH]
│   Priority: HIGH
│   Risk: Medium (container orchestration)
│   Dependencies: Story 1.1 Complete
│   Success Criteria: Containers running locally

3:00-5:00 (2 hours)
├── Story 1.3: Brand System and Shared Components [HIGH]
│   Priority: HIGH
│   Risk: Low (established patterns)
│   Dependencies: Story 1.1 Complete
│   Success Criteria: Reusable UI components

5:00-6:00 (1 hour)
├── Story 1.4: LLM Router Service Integration [CRITICAL]
│   Priority: CRITICAL
│   Risk: High (external API dependency)
│   Dependencies: Story 1.2 Complete
│   Success Criteria: LLM responses working
```

### Day 2: Case Study Stories (Complete Workflow)
**Time Allocation:** 8 hours
**Parallel Development Possible:** Medium (frontend/backend separation)

```
9:00-10:30 (1.5 hours)
├── Story 2.1: Case Study Input Form Implementation [HIGH]
│   Priority: HIGH
│   Risk: Low (standard forms)
│   Dependencies: Epic 1 Complete
│   Success Criteria: Form validation working

10:30-12:00 (1.5 hours)
├── Story 2.2: AI-Powered Case Study Generation [CRITICAL]
│   Priority: CRITICAL
│   Risk: Medium (LLM integration)
│   Dependencies: Story 1.4, Story 2.1
│   Success Criteria: Generated content quality

1:00-2:30 (1.5 hours)
├── Story 2.3: Live Preview System Implementation [HIGH]
│   Priority: HIGH
│   Risk: Low-Medium (CSS styling)
│   Dependencies: Story 2.2
│   Success Criteria: Preview matches output

2:30-4:00 (1.5 hours)
├── Story 2.4: Feedback and Refinement Workflow [HIGH]
│   Priority: HIGH
│   Risk: Medium (state management)
│   Dependencies: Story 2.3
│   Success Criteria: Iterative refinement working

4:00-5:30 (1.5 hours)
├── Story 2.5: PDF Export Implementation [CRITICAL]
│   Priority: CRITICAL
│   Risk: Medium (ReportLab complexity)
│   Dependencies: Story 2.4
│   Success Criteria: Professional PDF export

5:30-6:00 (0.5 hours)
├── Story 2.6: Standalone HTML Export [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (template-based)
│   Dependencies: Story 2.5
│   Success Criteria: Self-contained HTML file
```

### Day 3: Presentation Stories (Build on Patterns)
**Time Allocation:** 8 hours
**Parallel Development Possible:** High (slide generation independent of UI)

```
9:00-10:00 (1 hour)
├── Story 3.1: Presentation Setup Wizard [HIGH]
│   Priority: HIGH
│   Risk: Low (form patterns established)
│   Dependencies: Epic 1 Complete
│   Success Criteria: Wizard captures all parameters

10:00-11:00 (1 hour)
├── Story 3.2: Key Points Input System [HIGH]
│   Priority: HIGH
│   Risk: Low-Medium (drag-and-drop complexity)
│   Dependencies: Story 3.1
│   Success Criteria: Dynamic key points management

11:00-1:00 (2 hours)
├── Story 3.3: AI Slide Generation Engine [CRITICAL]
│   Priority: CRITICAL
│   Risk: Medium (template system complexity)
│   Dependencies: Story 1.4, Story 3.2
│   Success Criteria: Professional slide generation

1:00-2:00 (1 hour)
├── Story 3.4: Slide Preview and Navigation [HIGH]
│   Priority: HIGH
│   Risk: Low (carousel patterns)
│   Dependencies: Story 3.3
│   Success Criteria: Smooth slide navigation

2:00-3:30 (1.5 hours)
├── Story 3.5: Per-Slide Refinement System [HIGH]
│   Priority: HIGH
│   Risk: Medium (selective regeneration)
│   Dependencies: Story 3.4
│   Success Criteria: Individual slide refinement

3:30-5:00 (1.5 hours)
├── Story 3.6: HTML Presentation Export [CRITICAL]
│   Priority: CRITICAL
│   Risk: Medium (JavaScript complexity)
│   Dependencies: Story 3.5
│   Success Criteria: Standalone presentation
```

### Day 4: Recruiting Stories (Maximum Parallelization)
**Time Allocation:** 8 hours
**Parallel Development Possible:** High (independent tools)

```
9:00-10:00 (1 hour)
├── Story 4.1: Tabbed Interface Framework [CRITICAL]
│   Priority: CRITICAL
│   Risk: Low-Medium (state management)
│   Dependencies: Epic 1 Complete
│   Success Criteria: Smooth tab navigation

10:00-12:00 (2 hours) - PARALLEL TEAMS
├── Story 4.2: JD Enhancer Tool [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (established patterns)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.3: Sourcing Email Generator [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (template-based)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.4: Boolean Search String Creator [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (string manipulation)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.5: Candidate Submittal Generator [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (form patterns)
│   Dependencies: Story 4.1, Story 1.4

1:00-3:00 (2 hours) - PARALLEL TEAMS
├── Story 4.6: Interview Prep Email Builder [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low-Medium (wizard complexity)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.7: Mock Interview Questions Generator [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (established patterns)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.8: Skills/Title/Location Extractor [MEDIUM]
│   Priority: MEDIUM
│   Risk: Medium (parsing complexity)
│   Dependencies: Story 4.1, Story 1.4
├── Story 4.9: Executive Summary Writer [MEDIUM]
│   Priority: MEDIUM
│   Risk: Low (established patterns)
│   Dependencies: Story 4.1, Story 1.4

3:00-5:00 (2 hours)
├── Story 4.10: Universal Copy-to-Clipboard System [HIGH]
│   Priority: HIGH
│   Risk: Low-Medium (browser compatibility)
│   Dependencies: Stories 4.2-4.9
│   Success Criteria: Consistent copy functionality
```

### Day 5: Polish & Deployment (Risk Reduction)
**Time Allocation:** 8 hours
**Focus:** Quality assurance and deployment readiness

---

## Dependency Management Matrix

### Critical Path Dependencies
```
Epic 1 (Foundation) → All Other Epics
├── Story 1.1 → All development
├── Story 1.2 → Story 1.4
├── Story 1.3 → All UI development
└── Story 1.4 → All AI features

Epic 2 (Case Studies) → Epic 3 Patterns
├── Story 2.2 → Story 3.3 (LLM patterns)
├── Story 2.4 → Story 3.5 (refinement patterns)
└── Story 2.6 → Story 3.6 (export patterns)

Epic 2 & 3 → Epic 4 (UI Patterns)
├── Form patterns → Stories 4.2, 4.5, 4.6
├── LLM patterns → Stories 4.2-4.9
└── Copy patterns → Story 4.10
```

### Parallel Development Opportunities
```
Day 2 (Afternoon):
├── Frontend: Story 2.3 (Preview UI)
└── Backend: Story 2.4 (Refinement API)

Day 3 (Morning):
├── Frontend: Stories 3.1, 3.2 (UI)
└── Backend: Story 3.3 (Slide Generation API)

Day 4 (All Day):
├── Team A: Stories 4.2, 4.3, 4.4 (UI-focused)
├── Team B: Stories 4.5, 4.6, 4.7 (Form-heavy)
└── Team C: Stories 4.8, 4.9 (AI-heavy)
```

---

## Risk-Based Prioritization Adjustments

### High-Risk Stories (Address Early)
1. **Story 1.4: LLM Router Service Integration**
   - **Risk:** External API dependency, model selection complexity
   - **Mitigation:** Implement Day 1, have backup models ready
   - **Fallback:** Manual template-based generation

2. **Story 2.5: PDF Export Implementation**
   - **Risk:** ReportLab complexity, layout issues
   - **Mitigation:** Test with various content types early
   - **Fallback:** HTML-only export with print-to-PDF

3. **Story 3.3: AI Slide Generation Engine**
   - **Risk:** Template system complexity, content quality
   - **Mitigation:** Reuse patterns from Story 2.2
   - **Fallback:** Basic text-based slides

### Medium-Risk Stories (Monitor Closely)
1. **Story 4.1: Tabbed Interface Framework**
   - **Risk:** State management complexity
   - **Mitigation:** Use established state management patterns

2. **Story 3.6: HTML Presentation Export**
   - **Risk:** JavaScript complexity, cross-browser issues
   - **Mitigation:** Test on multiple browsers early

### Low-Risk Stories (Can be Deferred if Needed)
1. **Story 4.10: Universal Copy-to-Clipboard System**
   - **Risk:** Browser compatibility, can be implemented with basic functionality
   - **Deferral:** Can ship with manual copy if needed

2. **Story 2.6: Standalone HTML Export**
   - **Risk:** Low, template-based
   - **Deferral:** PDF export is primary requirement

---

## Story Completion Criteria

### Definition of Done for Each Story
- [ ] All acceptance criteria met and tested
- [ ] Code reviewed for quality and consistency
- [ ] Cross-browser compatibility validated
- [ ] Error handling implemented
- [ ] Performance requirements met
- [ ] Documentation updated
- [ ] Integration tests passing

### Epic Completion Criteria
- [ ] All stories in epic marked as "done"
- [ ] End-to-end workflow tested
- [ ] User acceptance validated
- [ ] No critical bugs or blockers
- [ ] Documentation complete

### MVP Completion Criteria
- [ ] All 4 epics complete
- [ ] All 28 functional requirements implemented
- [ ] All acceptance criteria validated
- [ ] Production deployment ready
- [ ] User training materials prepared

---

## Timeline Compression Strategies

### If Running Behind Schedule
1. **Scope Reduction:**
   - Defer Story 4.10 (Universal Copy) to post-MVP
   - Simplify Story 3.6 (Basic HTML export without advanced features)
   - Reduce Story 4.6 complexity (fewer wizard steps)

2. **Parallel Development:**
   - Split Day 4 recruiting tools between multiple developers
   - Frontend/backend parallel work on independent stories
   - Test while developing (parallel QA)

3. **Feature Simplification:**
   - Use simpler slide templates (Story 3.3)
   - Basic PDF layout without advanced formatting (Story 2.5)
   - Reduced validation complexity in forms

### If Ahead of Schedule
1. **Quality Enhancement:**
   - Additional testing and bug fixes
   - Performance optimization
   - Enhanced error handling
   - Improved user experience

2. **Feature Expansion:**
   - Advanced slide templates (Story 3.3)
   - Enhanced export options
   - Additional recruiting tool features
   - Analytics and usage tracking

---

## Daily Progress Tracking

### Story Status Updates
- **Backlog:** Not started
- **In-Progress:** Active development
- **Review:** Ready for code review
- **Done:** Completed and tested

### Epic Progress Metrics
- **Completion Percentage:** Stories done / total stories
- **Blocker Count:** Stories blocked by dependencies
- **Risk Level:** Based on completed high-risk stories

### Sprint Health Indicators
- **Velocity:** Stories completed per day
- **Quality:** Bugs found per story
- **Timeline:** Days remaining vs. stories remaining
- **Risk:** Unresolved high-risk items

---

**This prioritization plan ensures successful Calance Edge MVP delivery by focusing on critical dependencies, managing risks proactively, and maximizing parallel development opportunities while maintaining quality standards throughout the compressed timeline.**