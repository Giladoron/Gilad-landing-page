# Deep Cleanup Analysis - Landing Page Project

## File Categorization

### ✅ KEEP - Production Code (Required for Landing Page)
- `App.tsx` - Main React component
- `index.tsx` - React entry point
- `index.html` - HTML template
- `index.css` - Global styles
- `package.json` - Dependencies
- `package-lock.json` - Dependency lock
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build config (needs GEMINI cleanup)
- `tailwind.config.js` - Tailwind config
- `postcss.config.js` - PostCSS config
- `eslint.config.js` - ESLint config
- `public/` folder - All assets (images, videos, results)
- `.gitignore` - Git ignore rules

### ✅ KEEP - Documentation About THIS Landing Page
**`docs/` folder** - All files are relevant:
- `PROJECT_HANDOVER.md` - Complete handover doc for THIS landing page
- `IMPLEMENTATION_SUMMARY.md` - A11Y & compliance work on THIS landing page
- `FINAL_LEGAL_STATUS.md` - Legal status of THIS landing page
- `data-flow-map.md` - Data flow for THIS landing page
- `LEGAL_COMPLIANCE_SUMMARY.md` - Legal compliance for THIS landing page
- `MARKETING_COPY_LEGAL_REVIEW.md` - Marketing copy review for THIS landing page
- `policy-risk-report.md` - Policy analysis for THIS landing page
- `SECOND_PASS_COMPLIANCE_REVIEW.md` - Compliance review for THIS landing page
- `a11y-report.md` - Accessibility report for THIS landing page

### ✅ DECISION MADE - Development Documentation (Keep Useful, Delete Historical)
**Root-level .md files** - User decision: Keep useful ones, delete historical ones

**KEEP (Useful for Future Reference):**
- `CAROUSEL_DATA_TEMPLATE.md` - Template for future carousel data updates
- `CONVERSION_UX_EXECUTION_ROADMAP.md` - Just implemented conversion optimizations (useful reference)
- `LIBRARY_RECOMMENDATIONS.md` - Technical reference for future library decisions

**DELETE (Historical/Not Needed):**
- `CAROUSEL_FIX_SUMMARY.md` - Historical bug fix (already fixed, not needed)
- `CAROUSEL_ROOT_CAUSE_ANALYSIS.md` - Historical analysis (already fixed, not needed)
- `COMPARISON.md` - Historical dev vs prod comparison (not needed)
- `IMPLEMENTATION_COMPLETE.md` - Historical implementation status (not needed)
- `PHASE3_INTERSECTION_OBSERVER_ANALYSIS.md` - Historical technical analysis (decision made, not needed)
- `PHASE4_REACT_HOOK_FORM_PROPOSAL.md` - Proposal not implemented (not needed)
- `SETUP_COMPLETE.md` - Historical setup status (not needed)

### ❌ DELETE - Other Project (Workflow Methodology)
**`_meta/` folder** - Entire folder:
- This is a **workflow system** for building landing pages in general
- NOT about this specific landing page
- Contains methodology, templates, and process documentation
- Purpose: Reusable workflow for future landing page projects
- **This is the "other project"** - workflow methodology, not the landing page itself

### 🔧 UPDATE - Files with Wrong References
- `README.md` - Has AI Studio references, mentions GEMINI_API_KEY
- `metadata.json` - Has AI Studio references
- `vite.config.ts` - Has GEMINI_API_KEY references (lines 33-34)
- `.env.local` - Has GEMINI_API_KEY (unused)

---

## Summary

### Definitely Delete:
1. `_meta/` folder (entire folder) - Workflow methodology, not this landing page

### Definitely Update:
1. Remove GEMINI_API_KEY from `.env.local`
2. Remove GEMINI_API_KEY from `vite.config.ts`
3. Update `README.md` for landing page (remove AI Studio references)
4. Update `metadata.json` for landing page (remove AI Studio references)

### Decision Made:
**Root-level development .md files** - Keep useful, delete historical
- **Keep**: CAROUSEL_DATA_TEMPLATE.md, CONVERSION_UX_EXECUTION_ROADMAP.md, LIBRARY_RECOMMENDATIONS.md
- **Delete**: CAROUSEL_FIX_SUMMARY.md, CAROUSEL_ROOT_CAUSE_ANALYSIS.md, COMPARISON.md, IMPLEMENTATION_COMPLETE.md, PHASE3_INTERSECTION_OBSERVER_ANALYSIS.md, PHASE4_REACT_HOOK_FORM_PROPOSAL.md, SETUP_COMPLETE.md

---

## Recommended Action Plan

### Phase 1: Remove Other Project
- Delete `_meta/` folder

### Phase 2: Remove Unused Config
- Remove GEMINI_API_KEY from `.env.local`
- Remove GEMINI_API_KEY from `vite.config.ts`

### Phase 3: Update References
- Update `README.md` for landing page
- Update `metadata.json` for landing page

### Phase 4: Development Docs (User Decision: Keep Useful, Delete Historical)
**KEEP (Useful for Future Reference):**
- `CAROUSEL_DATA_TEMPLATE.md` - Template for future carousel data updates
- `CONVERSION_UX_EXECUTION_ROADMAP.md` - Just implemented, useful reference
- `LIBRARY_RECOMMENDATIONS.md` - Technical reference for future decisions

**DELETE (Historical/Not Needed):**
- `CAROUSEL_FIX_SUMMARY.md` - Historical bug fix (already fixed)
- `CAROUSEL_ROOT_CAUSE_ANALYSIS.md` - Historical analysis (already fixed)
- `COMPARISON.md` - Historical dev vs prod comparison
- `IMPLEMENTATION_COMPLETE.md` - Historical implementation status
- `PHASE3_INTERSECTION_OBSERVER_ANALYSIS.md` - Historical technical analysis
- `PHASE4_REACT_HOOK_FORM_PROPOSAL.md` - Proposal not implemented
- `SETUP_COMPLETE.md` - Historical setup status

---

## Final Action Plan

### Phase 1: Remove Other Project
- Delete `_meta/` folder (workflow methodology)

### Phase 2: Remove Unused Config
- Remove GEMINI_API_KEY from `.env.local`
- Remove GEMINI_API_KEY from `vite.config.ts`

### Phase 3: Update References
- Update `README.md` for landing page
- Update `metadata.json` for landing page

### Phase 4: Clean Development Docs
- **Keep**: CAROUSEL_DATA_TEMPLATE.md, CONVERSION_UX_EXECUTION_ROADMAP.md, LIBRARY_RECOMMENDATIONS.md
- **Delete**: CAROUSEL_FIX_SUMMARY.md, CAROUSEL_ROOT_CAUSE_ANALYSIS.md, COMPARISON.md, IMPLEMENTATION_COMPLETE.md, PHASE3_INTERSECTION_OBSERVER_ANALYSIS.md, PHASE4_REACT_HOOK_FORM_PROPOSAL.md, SETUP_COMPLETE.md

