# Project Handover Document

**Project**: Gilad Doron - Online Fitness Coaching Landing Page  
**Date**: January 2026  
**Purpose**: Complete context for continuing this project on a new Cursor account

---

## 1. Project Overview

### What This Project Is

This is a premium, single-page landing page for Gilad Doron, an online fitness and nutrition coach. The page is designed to convert visitors into leads through a "compatibility check" form submission. The site is built with React, TypeScript, Vite, and Tailwind CSS, optimized for mobile-first RTL (Hebrew) experience.

**Key Characteristics**:
- **Language**: Hebrew (RTL - right-to-left)
- **Primary Platform**: Mobile-first (trainees primarily use phones)
- **Design Philosophy**: Premium, cinematic, dark theme with orange accent (#FF6B35)
- **Core Conversion**: Lead form submission (name, phone, email, contact preference)
- **Deployment**: GitHub Pages (base path: `/Gilad-landing-page/`)

### Business Goal

Convert visitors into qualified leads by:
1. Building trust through testimonials, results, and personal story
2. Addressing objections through FAQ and guarantee sections
3. Capturing contact information via lead form
4. Delivering leads to Gilad via EmailJS email notifications

### Target Audience

- **Primary**: Hebrew-speaking Israelis (ages 25-45)
- **Demographics**: Professionals, entrepreneurs, individuals seeking fitness transformation
- **Pain Points**: Failed previous attempts, lack of personalized guidance, need for accountability
- **Goals**: Weight loss, muscle gain, improved fitness, sustainable lifestyle change

### Core Conversion Actions

1. **Primary**: Submit lead form ("בדיקת התאמה" - Compatibility Check)
   - Location: Multiple CTAs throughout page + floating CTA + exit intent popup
   - Form fields: Full name, phone, email, contact preference (phone/WhatsApp), consent checkbox
   - Submission: EmailJS sends email to `gilad042@gmail.com`

2. **Secondary**: Click Instagram link (social proof, relationship building)

---

## 2. Tech Stack & Architecture

### Core Frameworks

- **React 19.2.3**: UI framework
- **TypeScript 5.8.2**: Type safety
- **Vite 6.2.0**: Build tool and dev server
- **Tailwind CSS 3.4.17**: Utility-first styling
- **PostCSS 8.5.6**: CSS processing

### Key Libraries & Why They're Used

#### Production Dependencies

1. **`embla-carousel-react` (v8.6.0)** + **`embla-carousel-autoplay` (v8.6.0)**
   - **Purpose**: Client results carousel in "proof" section
   - **Why**: Replaced custom carousel implementation that had race condition bugs
   - **Location**: `App.tsx:2123-2170` (carousel setup), `App.tsx:2438-2470` (carousel render)
   - **Critical**: RTL support enabled (`direction: 'rtl'`), infinite loop enabled

2. **`focus-trap-react` (v10.2.3)**
   - **Purpose**: Accessibility - trap focus within modals
   - **Why**: Required for WCAG compliance (keyboard navigation)
   - **Location**: `App.tsx:1010` (ExitIntentPopup), `App.tsx:485` (LegalModal), `App.tsx:543` (ClientStoryModal)
   - **Critical**: All modals must trap focus for accessibility

3. **`lucide-react` (v0.562.0)**
   - **Purpose**: Icon library
   - **Why**: Consistent, accessible icons
   - **Location**: Used throughout for buttons, CTAs, form elements

#### External Scripts (CDN)

1. **EmailJS Browser SDK** (`@emailjs/browser@4`)
   - **Location**: `index.html:35`
   - **Purpose**: Form submission service
   - **Critical**: Must load before form submission attempts

2. **Vimeo Player API**
   - **Location**: `index.html:32`
   - **Purpose**: Video player controls (mute/unmute, play/pause)
   - **Critical**: Required for video functionality

3. **Google Fonts** (Heebo, Montserrat)
   - **Location**: `index.html:28-31`
   - **Purpose**: Hebrew typography
   - **Critical**: RTL support, display: swap for performance

### File Structure Overview

```
/
├── App.tsx                    # Main application (3000+ lines, single file)
├── index.tsx                  # React entry point
├── index.html                 # HTML template, CDN scripts, meta tags
├── index.css                  # Global styles, Tailwind, custom utilities
├── vite.config.ts             # Vite configuration, env vars, base path
├── tailwind.config.js         # Tailwind theme (colors, fonts, breakpoints)
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # ESLint + jsx-a11y rules
├── package.json               # Dependencies and scripts
├── public/                    # Static assets (images, videos)
│   └── assets/
│       ├── backgrounds/       # Section background images
│       ├── about/            # About section images
│       └── results/          # Client result images
├── dist/                     # Build output (deployed to GitHub Pages)
└── docs/                     # Documentation (this file, legal summaries, etc.)
```

### Where "Critical Logic" Lives

#### Form Submission (`App.tsx:1077-1320`)
- **Component**: `LeadForm`
- **Key Logic**: 
  - Lines 1089-1149: Form submission handler
  - Lines 1095-1103: EmailJS validation
  - Lines 1122-1128: EmailJS API call
  - **Critical**: Requires `VITE_EMAILJS_PUBLIC_KEY` env var

#### Video Players (`App.tsx:1322-1991`)
- **Components**: `ClientTestimonialVideo`, `VideoPlayer`
- **Key Logic**:
  - Lines 1364-1443: Vimeo Player initialization (retry logic, iOS detection)
  - Lines 1445-1500: Mute/unmute toggle handlers
  - Lines 1502-1610: IntersectionObserver for play/pause on scroll
  - **Critical**: Complex initialization with retry logic, iOS-specific handling

#### Carousel (`App.tsx:2123-2470`)
- **Component**: Results carousel in proof section
- **Key Logic**:
  - Lines 2132-2141: Embla carousel setup (RTL, loop, center align)
  - Lines 2165-2170: Auto-center when proof section becomes active
  - Lines 2172-2190: Keyboard navigation (Arrow keys)
  - **Critical**: Replaced custom implementation due to bugs, now stable

#### Stage/Focus Management (`App.tsx:2192-2300`)
- **Key Logic**:
  - Lines 2194-2247: IntersectionObserver for section detection
  - Lines 2248-2260: Guarantee section reveal animation
  - **Critical**: Determines active section for navigation highlighting

#### Floating CTA (`App.tsx:766-882`)
- **Component**: `FloatingCTA`
- **Key Logic**:
  - Lines 783-860: Scroll position detection, show/hide logic
  - **Critical**: Must hide when action section is visible

#### Exit Intent Popup (`App.tsx:884-1045`)
- **Component**: `ExitIntentPopup`
- **Key Logic**:
  - Lines 900-960: Mouse leave detection, scroll depth tracking
  - Lines 930-938: Desktop trigger (50% scroll depth required)
  - **Critical**: Mobile disabled, sessionStorage prevents repeat shows

---

## 3. Key Design & UX Principles

### Premium / Cinematic Design Constraints

1. **Dark Theme**: `bg-brandDark` (#0A0A0A) with `bg-brandGray` (#1A1A1A) accents
2. **Accent Color**: `#FF6B35` (orange) - used for CTAs, highlights, focus indicators
3. **Typography**: 
   - Headings: Montserrat (bold, 700-800 weight)
   - Body: Heebo (300-800 weight)
   - Text shadows on headings for depth
4. **Spacing**: Generous padding, large touch targets on mobile
5. **Animations**: Smooth transitions, reduced motion support (`prefers-reduced-motion`)

### RTL + Hebrew Considerations

1. **HTML Attributes**: `lang="he" dir="rtl"` on `<html>` tag (`index.html:2`)
2. **Tailwind RTL**: All spacing uses logical properties (pr/pl for padding-right/left in RTL)
3. **Carousel Direction**: Embla carousel uses `direction: 'rtl'` (`App.tsx:2136`)
4. **Text Alignment**: Right-aligned by default, left-aligned for numbers/dates
5. **Font Loading**: Google Fonts with `display=swap` for performance

### Mobile-First Decisions

1. **Breakpoints**: 
   - Mobile: 0px+ (default)
   - Tablet: `md:` 768px+
   - Desktop: `lg:` 1024px+
2. **Touch Targets**: Minimum 44px height for buttons/links
3. **Spacing**: Mobile uses `px-3 md:px-12` pattern (compact on mobile, spacious on desktop)
4. **Typography**: Responsive font sizes (`text-lg md:text-2xl`)
5. **Images**: WebP format, lazy loading, aspect ratio containers to prevent layout shift
6. **Videos**: `playsinline=1` for iOS, responsive iframes

### What Must NOT Be Changed Lightly

#### Hero Section Layout (`App.tsx:2310-2400`)
- **Why**: Critical first impression, conversion-focused
- **Don't Change**: Headline copy, CTA placement, video positioning
- **Risk**: Breaking conversion flow

#### FAQ Copy (`App.tsx:185-249`)
- **Why**: Addresses common objections, legally reviewed
- **Don't Change**: Question/answer text without legal review
- **Risk**: Legal compliance issues, conversion impact

#### Guarantee Section (`App.tsx:2650-2700`)
- **Why**: Legally reviewed, conditional language (not absolute promises)
- **Don't Change**: Promise wording without legal review
- **Risk**: Legal liability, marketing compliance

#### Form Fields (`App.tsx:1150-1300`)
- **Why**: EmailJS template expects specific field names
- **Don't Change**: Field names (`fullName`, `phone`, `email`, `contactPref`) without updating EmailJS template
- **Risk**: Form submission failures

#### Legal Content (`App.tsx:253-483`)
- **Why**: GDPR-compliant, legally reviewed
- **Don't Change**: Privacy Policy, Terms of Use, Accessibility Statement without legal review
- **Risk**: Legal non-compliance

---

## 4. Integrations & External Services

### EmailJS

**Purpose**: Form submission service - sends lead form data to Gilad's email

**Where Used**:
- **Script Load**: `index.html:35` (CDN)
- **Configuration**: `App.tsx:68-76` (env vars, constants)
- **Form Submission**: `App.tsx:1122-1128` (API call)
- **Error Handling**: `App.tsx:1095-1103` (validation)

**Environment Variables Required**:
- `VITE_EMAILJS_SERVICE_ID` (default: `'service_fphe5xu'`)
- `VITE_EMAILJS_TEMPLATE_ID` (default: `'template_8p1hgtg'`)
- `VITE_EMAILJS_PUBLIC_KEY` (required, no default)

**Recipient Email**: `gilad042@gmail.com` (hardcoded in `App.tsx:76`, can be overridden with `VITE_RECIPIENT_EMAIL`)

**Template Parameters Sent**:
```typescript
{
  to_email: RECIPIENT_EMAIL,
  fullName: string,
  phone: string,
  email: string,
  contactPref: 'טלפון' | 'וואטסאפ',
  message: string,
  date: string (Hebrew locale format)
}
```

**Ownership**: Must be owned by private account (EmailJS account credentials required)

**What Breaks If Missing**: Form submissions fail, no lead capture

---

### Vimeo

**Purpose**: Video hosting and playback (testimonial video, main video)

**Where Used**:
- **Script Load**: `index.html:32` (Vimeo Player API)
- **Testimonial Video**: `App.tsx:1338-1610` (`ClientTestimonialVideo` component)
- **Main Video**: `App.tsx:1688-1991` (`VideoPlayer` component)

**Video IDs**:
- Testimonial: Dynamic (passed as prop, e.g., `'1152174898'`)
- Main Video: `'1152174898'` (hardcoded in `App.tsx:1693`)

**Features Used**:
- Custom mute/unmute buttons (floating overlay)
- IntersectionObserver for play/pause on scroll
- iOS detection and special handling
- Retry logic for player initialization

**Ownership**: Vimeo account required for video access (videos may be private/unlisted)

**What Breaks If Missing**: Videos don't load, player initialization fails (non-critical, videos still play via iframe)

---

### Google Fonts

**Purpose**: Hebrew typography (Heebo, Montserrat)

**Where Used**:
- **Font Load**: `index.html:28-31` (CDN link)
- **CSS Reference**: `tailwind.config.js:14-15` (font family definitions)

**Fonts**:
- Heebo: 300, 400, 500, 700, 800 weights
- Montserrat: 700, 800 weights

**Privacy**: Google Fonts CDN may set cookies (disclosed in Privacy Policy)

**What Breaks If Missing**: Fallback fonts used (system fonts), visual degradation

---

## 5. Environment Variables & Secrets

### Required Environment Variables

All environment variables must be in `.env.local` (gitignored) or set in deployment environment.

#### `VITE_EMAILJS_PUBLIC_KEY` (REQUIRED)

- **Purpose**: EmailJS API authentication
- **Example**: `vT2iqiRsrq5f4D03A` (example, use actual key)
- **Where Consumed**: `App.tsx:72`, `App.tsx:1127`
- **What Breaks If Missing**: 
  - Form submissions fail with error: "תצורת EmailJS חסרה. אנא פנה לתמיכה."
  - Console error: "VITE_EMAILJS_PUBLIC_KEY environment variable is required"
- **Fallback Logic**: None (required, no hardcoded fallback for security)

#### `VITE_EMAILJS_SERVICE_ID` (OPTIONAL)

- **Purpose**: EmailJS service identifier
- **Example**: `service_fphe5xu`
- **Where Consumed**: `App.tsx:70`, `App.tsx:1124`
- **What Breaks If Missing**: Uses default `'service_fphe5xu'`
- **Fallback Logic**: Yes (`|| 'service_fphe5xu'`)

#### `VITE_EMAILJS_TEMPLATE_ID` (OPTIONAL)

- **Purpose**: EmailJS email template identifier
- **Example**: `template_8p1hgtg`
- **Where Consumed**: `App.tsx:71`, `App.tsx:1125`
- **What Breaks If Missing**: Uses default `'template_8p1hgtg'`
- **Fallback Logic**: Yes (`|| 'template_8p1hgtg'`)

#### `VITE_RECIPIENT_EMAIL` (OPTIONAL)

- **Purpose**: Override recipient email address
- **Example**: `gilad042@gmail.com`
- **Where Consumed**: `App.tsx:76`, `App.tsx:1107`
- **What Breaks If Missing**: Uses default `'gilad042@gmail.com'`
- **Fallback Logic**: Yes (`|| 'gilad042@gmail.com'`)

#### `GEMINI_API_KEY` (NOT USED IN PRODUCTION)

- **Purpose**: Mentioned in `vite.config.ts:33-34` but not used in code
- **Status**: Legacy/unused, can be ignored
- **Where Consumed**: None (no references in `App.tsx`)

### Environment Variable Loading

- **Vite**: Uses `loadEnv(mode, '.', '')` in `vite.config.ts:7`
- **Access Pattern**: `import.meta.env.VITE_*` (Vite convention)
- **Build Time**: Environment variables are embedded at build time (not runtime)

### Security Notes

1. **EmailJS Public Key**: Must be in `.env.local` (gitignored), never commit to git
2. **No Hardcoded Secrets**: All secrets removed from code (previously had hardcoded fallback, fixed)
3. **Git Ignore**: `.env.local` is in `.gitignore:13` (pattern `*.local`)

---

## 6. Legal & Compliance State

### Privacy Policy

**Status**: ✅ **COMPLETE** (GDPR-compliant)

**Location**: `App.tsx:276-375` (`LEGAL_CONTENT.privacy`)

**Key Content**:
- Data collection disclosure (name, phone, email, contact preference)
- Third-party processors (EmailJS, Vimeo, Google Fonts) with links
- Data retention (2 years inactivity or until consent withdrawal)
- User rights (GDPR-compliant: access, correction, deletion, objection, restriction, portability, consent withdrawal)
- Cookies/storage disclosure (localStorage, sessionStorage, third-party cookies)
- Security measures (HTTPS, EmailJS security, access controls)
- Contact information: `gilad042@gmail.com`, `052-8765992`

**Implementation**: Modal accessible via footer link (`App.tsx:2980`)

**Owner-Provided vs Code-Provided**: Code-provided (embedded in `App.tsx`)

**Assumptions**: 
- Service is paid (personalized pricing)
- Data retention: 2 years of inactivity
- Contact email/phone: Owner-provided values

---

### Terms of Use

**Status**: ✅ **COMPLETE**

**Location**: `App.tsx:376-470` (`LEGAL_CONTENT.terms`)

**Key Content**:
- Service description (online fitness & nutrition coaching)
- Age restriction (18+)
- Medical disclaimer (no medical advice, requires doctor consultation, liability limitation)
- User responsibility
- No results guarantee (individual results vary)
- Limitation of liability (comprehensive, conservative)
- Payment terms (personalized pricing, refund policy: full refund if goals not met after full implementation)
- Cancellation/termination clauses
- Intellectual property (detailed)
- External links disclaimer
- Governing law (Israel)
- Contact information: `gilad042@gmail.com`, `052-8765992`

**Implementation**: Modal accessible via footer link (`App.tsx:2982`)

**Owner-Provided vs Code-Provided**: Code-provided (embedded in `App.tsx`)

**Assumptions**:
- Service is paid with personalized pricing
- Refund policy: Full refund if goals not met (matches FAQ)
- Age restriction: 18+
- Governing law: Israel

---

### Accessibility Statement

**Status**: ✅ **COMPLETE** (WCAG 2.1 Level AA)

**Location**: `App.tsx:254-274` (`LEGAL_CONTENT.accessibility`)

**Key Content**:
- WCAG 2.1 Level AA compliance statement (good-faith effort: "ככל הניתן")
- Specific accessibility features:
  - Keyboard navigation
  - Heading hierarchy
  - Alt text
  - Color contrast (WCAG AA)
  - Reduced Motion support
  - RTL support (Hebrew)
  - Visible focus indicators
- Audit date: January 2026
- Continuous improvement statement
- Contact information: גילעד דורון, `052-8765992`, `gilad042@gmail.com`

**Implementation**: Modal accessible via footer link (`App.tsx:2978`)

**Owner-Provided vs Code-Provided**: Code-provided (embedded in `App.tsx`)

**Assumptions**:
- Accessibility coordinator: גילעד דורון (site owner)
- Contact phone: Owner-provided value

---

### What Was Already Implemented

1. ✅ Privacy Policy (GDPR-compliant, third-party disclosures)
2. ✅ Terms of Use (strong liability protection, medical disclaimers)
3. ✅ Accessibility Statement (WCAG 2.1 AA, accurate feature list)
4. ✅ Contact information updated (phone: `052-8765992`, email: `gilad042@gmail.com`)
5. ✅ Marketing copy aligned with Terms (no absolute guarantees, conditional language)
6. ✅ Accessibility fixes (focus trap, skip links, focus-visible styles, radio button labels)

### What Is Owner-Provided vs Code-Provided

**Owner-Provided**:
- Contact information (phone, email) - embedded in legal content
- Client testimonials/media - owner must verify consent records (not code change)

**Code-Provided**:
- All legal document text (Privacy Policy, Terms, Accessibility Statement)
- Legal structure and compliance framework
- Third-party disclosure text

### Assumptions Made

1. **Service Model**: Paid service with personalized pricing (Terms mention payment)
2. **Refund Policy**: Full refund if goals not met after full implementation (matches FAQ)
3. **Data Retention**: 2 years of inactivity or until consent withdrawal
4. **Age Restriction**: 18+ (standard for fitness services)
5. **Governing Law**: Israel (based on Hebrew language, Israeli phone format)
6. **Client Consent**: Assumed all testimonials/media used with consent (owner must verify)

---

## 7. Known Risks & Fragile Areas

### Areas Prone to Regression

#### 1. Carousel Implementation (`App.tsx:2123-2470`)

**Risk**: Race conditions, infinite loops, unexpected scrolling

**Why Fragile**:
- Previously had custom implementation with bugs (feedback loop between IntersectionObserver and useEffect)
- Replaced with Embla Carousel, but still has complex state management
- Auto-centering on section activation (`App.tsx:2165-2170`) can conflict with user interaction

**What to Watch**:
- Cards changing unexpectedly after user swipe
- Carousel continuing to scroll after user interaction
- Keyboard navigation (Arrow keys) not working correctly

**Don't Touch Unless You Know Why**:
- `emblaApi.scrollTo(0, true)` in `useEffect` at line 2168 (auto-center logic)
- `direction: 'rtl'` in carousel config (line 2136) - required for RTL
- `loop: true` in carousel config (line 2134) - required for infinite scroll

---

#### 2. Video Player Initialization (`App.tsx:1364-1443`, `App.tsx:1696-1782`)

**Risk**: Videos not playing, mute/unmute buttons not working, iOS-specific issues

**Why Fragile**:
- Complex retry logic for Vimeo Player API initialization (50 retries, 100ms intervals)
- iOS detection and special handling
- IntersectionObserver for play/pause can conflict with user interaction
- Multiple refs and state variables that must stay in sync

**What to Watch**:
- Videos not playing on iOS
- Mute/unmute buttons not responding
- Videos playing when not in viewport
- Player initialization failing silently

**Don't Touch Unless You Know Why**:
- Retry logic (lines 1367-1416) - handles slow Vimeo SDK loading
- iOS detection (lines 1331-1335) - required for iOS-specific behavior
- `isVisibleRef.current` pattern (line 1347) - prevents stale closures in callbacks

---

#### 3. Form Submission (`App.tsx:1089-1149`)

**Risk**: Form submissions failing, EmailJS errors not caught

**Why Fragile**:
- Depends on EmailJS CDN loading (`window.emailjs`)
- Requires environment variable (`VITE_EMAILJS_PUBLIC_KEY`)
- Error handling must be user-friendly (Hebrew error messages)

**What to Watch**:
- Form submissions failing silently
- EmailJS not loaded error
- Missing public key error
- Network errors not caught

**Don't Touch Unless You Know Why**:
- EmailJS validation checks (lines 1095-1103) - must happen before API call
- Template parameter structure (lines 1106-1120) - must match EmailJS template
- Error message format (Hebrew, user-friendly)

---

#### 4. Stage/Focus Management (`App.tsx:2192-2300`)

**Risk**: Wrong section highlighted, navigation not updating, performance issues

**Why Fragile**:
- Complex IntersectionObserver with debouncing (75ms delay)
- Multiple sections tracked simultaneously
- State updates can cause re-renders and performance issues
- Guarantee section has special reveal animation

**What to Watch**:
- Active section not updating on scroll
- Navigation highlighting wrong section
- Performance degradation on scroll (too many re-renders)
- Guarantee animation not triggering

**Don't Touch Unless You Know Why**:
- Debounce delay (line 2209) - prevents excessive re-renders
- IntersectionObserver thresholds (line 2198) - balances accuracy vs performance
- `guarantee-revealed` class logic (line 2248) - one-time animation trigger

---

#### 5. Floating CTA (`App.tsx:766-882`)

**Risk**: CTA showing when action section is visible, scroll position detection failing

**Why Fragile**:
- Complex scroll position detection with refs and state
- Must hide when action section is visible (prevents overlap)
- Uses `requestAnimationFrame` for performance
- Multiple refs that must stay in sync

**What to Watch**:
- CTA not hiding when action section is visible
- CTA not showing when user scrolls up
- Performance issues (too many RAF calls)

**Don't Touch Unless You Know Why**:
- `actionTopRef.current` caching (lines 785-792) - prevents layout thrashing
- `requestAnimationFrame` usage (lines 808-825) - required for smooth animation
- Hide/show logic (lines 827-860) - must account for action section visibility

---

### Things That Look Simple But Aren't

#### 1. Exit Intent Popup (`App.tsx:884-1045`)

**Looks Simple**: Just show popup on mouse leave

**Actually Complex**:
- Mouse leave detection only on desktop (mobile disabled)
- Requires 50% scroll depth to trigger (prevents false positives)
- SessionStorage prevents repeat shows
- Focus trap required for accessibility
- Body scroll lock when open

**Don't Change**: Scroll depth threshold (50%), mobile disable logic, sessionStorage key name

---

#### 2. RTL Carousel Navigation

**Looks Simple**: Just use RTL direction

**Actually Complex**:
- Arrow key mapping reversed (ArrowRight = previous in RTL)
- Embla carousel RTL support must be enabled
- Keyboard navigation must account for RTL direction

**Don't Change**: Arrow key mapping (lines 2180-2184), `direction: 'rtl'` config

---

#### 3. Video Mute/Unmute Buttons

**Looks Simple**: Just toggle mute state

**Actually Complex**:
- Vimeo Player API async operations
- Must handle initialization failures gracefully
- iOS-specific behavior (autoplay restrictions)
- IntersectionObserver can conflict with user interaction
- Multiple refs to prevent stale closures

**Don't Change**: Retry logic, iOS detection, ref patterns

---

### CSS or Layout Sections That Are Tightly Coupled

#### 1. Global Parallax Background (`index.html:38-50`)

**Location**: Inline script in `<head>`

**What It Does**: Sets CSS custom property `--unified-bg` for parallax effect

**Tightly Coupled With**:
- `index.css:550-555` (parallax background styles)
- `vite.config.ts:14` (base path `/Gilad-landing-page/`)
- Background image path in `public/assets/backgrounds/`

**Don't Change**: Base path detection logic, CSS custom property name

---

#### 2. Scroll Snap Configuration (`index.css:10-11`)

**Location**: `index.css:10-11`

**What It Does**: Enables scroll snap for section navigation

**Tightly Coupled With**:
- `App.tsx:2192-2300` (IntersectionObserver for section detection)
- `data-snap="true"` attributes on sections
- `data-stage` attributes for section identification

**Don't Change**: `scroll-snap-type: y proximity` (relaxed for better UX), section data attributes

---

#### 3. Focus-Visible Styles (`index.css:38-54`)

**Location**: `index.css:38-54`

**What It Does**: Global focus indicators for accessibility

**Tightly Coupled With**:
- `tailwind.config.js:9` (accent color `#FF6B35`)
- All interactive elements (buttons, links, inputs)
- Skip link focus styles (`App.tsx:2051`)

**Don't Change**: Outline color (must match accent), outline-offset (accessibility requirement)

---

### "Don't Touch Unless You Know Why" Parts

1. **EmailJS Public Key Validation** (`App.tsx:73-75`): No hardcoded fallback (security)
2. **Carousel RTL Direction** (`App.tsx:2136`): Required for Hebrew layout
3. **Video Retry Logic** (`App.tsx:1367-1416`): Handles slow Vimeo SDK loading
4. **IntersectionObserver Debounce** (`App.tsx:2209`): Prevents performance issues
5. **Floating CTA Action Section Detection** (`App.tsx:786-791`): Prevents overlap
6. **Exit Intent Scroll Depth** (`App.tsx:933`): Prevents false triggers
7. **Legal Content** (`App.tsx:253-483`): Legally reviewed, don't change without review
8. **Form Field Names** (`App.tsx:1106-1120`): Must match EmailJS template
9. **Base Path Detection** (`vite.config.ts:14`, `index.html:42-44`): Required for GitHub Pages
10. **Focus Trap on Modals** (`App.tsx:485, 543, 1010`): WCAG compliance requirement

---

## 8. Cursor-Specific Working Style

### Preferred Prompting Style

**Effective Patterns**:
1. **Be Specific About Location**: "In `App.tsx` around line 1100, the form submission handler..."
2. **Reference Existing Patterns**: "Similar to how the carousel handles RTL in `App.tsx:2136`..."
3. **Mention Constraints**: "Must maintain RTL support, accessibility, and mobile-first design..."
4. **Reference Documentation**: "As documented in `docs/a11y-report.md`, focus trap is required..."

**Ineffective Patterns**:
1. ❌ "Fix the form" (too vague)
2. ❌ "Make it better" (no clear goal)
3. ❌ "Refactor everything" (too broad, risky)

---

### What Types of Changes Should Be Incremental

1. **Form Changes**: Test submission after each field modification
2. **Video Changes**: Test on iOS and desktop after each modification
3. **Carousel Changes**: Test swipe, keyboard, and auto-center after each modification
4. **Legal Content**: Review with legal counsel before changes
5. **Accessibility**: Test with keyboard and screen reader after each modification

**Why Incremental**:
- Complex interdependencies (carousel, videos, forms, modals)
- RTL layout can break easily
- Accessibility requirements must be maintained
- Legal compliance must be preserved

---

### What Should Never Be "Refactored Wholesale"

1. **App.tsx Structure**: Single-file architecture is intentional (3000+ lines, but manageable)
2. **Form Submission Logic**: EmailJS integration is stable, don't replace without justification
3. **Video Player Logic**: Complex initialization is necessary, don't simplify without understanding
4. **Carousel Implementation**: Embla Carousel replaced custom implementation for stability, don't revert
5. **Legal Content**: Legally reviewed, don't restructure without legal review
6. **RTL Layout**: Tightly coupled with Tailwind, don't change without testing Hebrew rendering

**Why Not Refactor**:
- Working code is better than "clean" broken code
- Complex logic has been debugged and stabilized
- Legal content is compliant and reviewed
- RTL layout is fragile and easy to break

---

### How to Verify Changes Safely

#### Pre-Change Checklist

1. **Read Related Documentation**: Check `docs/` folder for context
2. **Understand Dependencies**: What else depends on this code?
3. **Test Current Behavior**: Verify current behavior works before changing
4. **Check Legal Impact**: If changing legal content, review with legal counsel
5. **Check Accessibility Impact**: If changing UI, verify accessibility is maintained

#### Post-Change Verification

1. **Build Test**: `npm run build` (must succeed without errors)
2. **Lint Test**: `npm run lint` (must pass)
3. **Manual Testing**:
   - Form submission (test EmailJS integration)
   - Video playback (test on iOS and desktop)
   - Carousel navigation (test swipe, keyboard, auto-center)
   - Modal accessibility (test keyboard navigation, focus trap)
   - RTL layout (test Hebrew text rendering)
   - Mobile responsiveness (test on real devices, not just dev tools)
4. **Accessibility Test**: `npm run lint:a11y` (must pass)
5. **Legal Review**: If changing legal content, review with legal counsel

#### Testing Commands

```bash
# Build
npm run build

# Lint (TypeScript + ESLint)
npm run lint

# Lint (Accessibility)
npm run lint:a11y

# Format check
npm run format:check

# Dev server (for manual testing)
npm run dev
```

---

## 9. Transition Checklist (Critical)

### Before Switching Cursor Accounts, Verify the Following:

#### Git Ownership

- [ ] **Repository URL**: `https://github.com/<<<USERNAME>>>/<<<REPO_NAME>>>.git` (fill in actual values)
- [ ] **Default Branch**: `<<<MAIN_BRANCH>>>` (fill in: `main` or `master`)
- [ ] **Repository Access**: Verify you have access to the repository on the new account
- [ ] **Git Config**: Set correct user name and email for new account
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  ```
- [ ] **Git Remote**: Verify remote is configured correctly
  ```bash
  git remote -v
  # Should show: origin  https://github.com/username/repo-name.git
  ```
- [ ] **SSH Keys**: If using SSH, add new SSH key to GitHub account
- [ ] **HTTPS Credentials**: If using HTTPS, update Git credentials (PAT token)

#### SSH / Tokens

- [ ] **GitHub Personal Access Token**: If needed for deployment, create new token on new account
- [ ] **EmailJS API Key**: Verify access to EmailJS account (for `VITE_EMAILJS_PUBLIC_KEY`)
- [ ] **Vimeo Account**: Verify access to Vimeo account (for video access)

#### Environment Variables

- [ ] **Create `.env.local`**: Copy from `.env.example` template
  ```bash
  cp .env.example .env.local
  # Edit .env.local and add your actual VITE_EMAILJS_PUBLIC_KEY
  ```
- [ ] **Required Variable**: `VITE_EMAILJS_PUBLIC_KEY=your_actual_key_here` (get from EmailJS dashboard)
- [ ] **Optional Variables** (have defaults, only override if needed):
  ```bash
  VITE_EMAILJS_SERVICE_ID=service_fphe5xu
  VITE_EMAILJS_TEMPLATE_ID=template_8p1hgtg
  VITE_RECIPIENT_EMAIL=gilad042@gmail.com
  ```
- [ ] **Verify `.env.local` is Gitignored**: Check `.gitignore:13` (pattern `*.local`)
- [ ] **Note**: Environment variables are embedded at build time (Vite convention), so `.env.local` must exist before `npm run build`

#### External Service Ownership

- [ ] **EmailJS Account**: 
  - Verify account ownership
  - Verify service ID and template ID are correct
  - Verify public key is valid
  - Test form submission manually
- [ ] **Vimeo Account**:
  - Verify account ownership
  - Verify video IDs are accessible
  - Test video playback manually
- [ ] **GitHub Pages**:
  - Verify repository access
  - Verify Pages source is set to `gh-pages` branch (Settings → Pages → Source: `gh-pages` branch)
  - Verify base path in `vite.config.ts:11` is `/Gilad-landing-page/`
  - Verify custom domain (if used) - check for `CNAME` file in `gh-pages` branch

#### Build & Deploy Verification Steps

- [ ] **Install Dependencies**: `npm install` (verify no errors)
- [ ] **Build Test**: `npm run build` (verify build succeeds)
- [ ] **Lint Test**: `npm run lint` (verify no errors)
- [ ] **Dev Server**: `npm run dev` (verify site loads locally)
- [ ] **Deploy Test**: `npm run deploy` (verify deployment succeeds, `gh-pages` branch updated)
  - **Note**: First deployment creates `gh-pages` branch automatically
  - **Verify**: Check GitHub repository → `gh-pages` branch exists and contains `dist/` contents
- [ ] **Production Test**: Visit deployed site, verify:
  - Form submission works
  - Videos play
  - Carousel works
  - Modals open/close
  - RTL layout renders correctly
  - Mobile responsiveness works

---

## 10. Post-Transition Sanity Checks

### Commands to Run

```bash
# 1. Install dependencies
npm install

# 2. Verify build
npm run build

# 3. Verify linting
npm run lint

# 4. Verify accessibility linting
npm run lint:a11y

# 5. Start dev server
npm run dev
# Site will be available at: http://localhost:3000/Gilad-landing-page/
```

**Expected Results**:
- ✅ `npm install`: No errors, all dependencies installed
- ✅ `npm run build`: Build succeeds, `dist/` folder created
- ✅ `npm run lint`: No linting errors
- ✅ `npm run lint:a11y`: No accessibility errors
- ✅ `npm run dev`: Server starts on `http://localhost:3000`

---

### Behaviors to Manually Test

#### 1. Form Submission

**Steps**:
1. Scroll to action section (or use floating CTA)
2. Fill out form (name, phone, email, select contact preference, check consent)
3. Click "בודקים התאמה" (Submit button)
4. Verify success message appears
5. Check email inbox (`gilad042@gmail.com`) for EmailJS notification

**Success Criteria**:
- ✅ Form submits without errors
- ✅ Success message appears in Hebrew
- ✅ Email received in inbox
- ✅ Form fields reset after submission

**Failure Indicators**:
- ❌ Error message appears (check console for EmailJS errors)
- ❌ Form doesn't reset
- ❌ No email received (check EmailJS account, verify public key)

---

#### 2. Video Playback

**Steps**:
1. Scroll to testimonial video section
2. Verify video loads and plays automatically when in viewport
3. Click mute/unmute button (floating overlay)
4. Verify video mutes/unmutes
5. Scroll away from video, verify video pauses
6. Scroll back to video, verify video resumes
7. Test main video (same steps)

**Success Criteria**:
- ✅ Videos load and play
- ✅ Mute/unmute buttons work
- ✅ Videos pause when out of viewport
- ✅ Videos resume when back in viewport
- ✅ Works on iOS (if testing on iOS device)

**Failure Indicators**:
- ❌ Videos don't load (check Vimeo account, video IDs)
- ❌ Mute/unmute buttons don't work (check Vimeo Player API loading)
- ❌ Videos don't pause/resume (check IntersectionObserver)
- ❌ iOS-specific issues (check iOS detection, autoplay restrictions)

---

#### 3. Carousel Navigation

**Steps**:
1. Scroll to proof section (results carousel)
2. Verify carousel auto-centers on first card
3. Swipe left/right (or click arrow buttons)
4. Verify carousel moves smoothly
5. Verify carousel stops after swipe (no continued movement)
6. Click dot indicators, verify carousel moves to selected card
7. Press Arrow keys (left/right), verify keyboard navigation works

**Success Criteria**:
- ✅ Carousel auto-centers when proof section becomes active
- ✅ Swipe/click navigation works smoothly
- ✅ Carousel stops after user interaction (no infinite loops)
- ✅ Dot indicators update correctly
- ✅ Keyboard navigation works (Arrow keys)

**Failure Indicators**:
- ❌ Carousel continues moving after user interaction (race condition)
- ❌ Cards jump unexpectedly (layout issue)
- ❌ Keyboard navigation doesn't work (event handler issue)
- ❌ RTL direction reversed (check `direction: 'rtl'` config)

---

#### 4. Modal Accessibility

**Steps**:
1. Click footer link to open Privacy Policy modal
2. Verify modal opens and focus is trapped inside
3. Press Tab key, verify focus cycles within modal
4. Press Escape key, verify modal closes
5. Click outside modal (overlay), verify modal closes
6. Test Terms of Use modal (same steps)
7. Test Accessibility Statement modal (same steps)
8. Test Client Story modal (same steps)
9. Test Exit Intent popup (same steps, but trigger via mouse leave on desktop)

**Success Criteria**:
- ✅ Modals open/close correctly
- ✅ Focus is trapped inside modals (Tab key cycles within)
- ✅ Escape key closes modals
- ✅ Click outside closes modals
- ✅ Focus returns to trigger element after close

**Failure Indicators**:
- ❌ Focus escapes modal (focus trap not working)
- ❌ Escape key doesn't close modal (event handler issue)
- ❌ Click outside doesn't close modal (overlay click handler issue)

---

#### 5. RTL Layout

**Steps**:
1. Verify page loads with RTL layout (text right-aligned)
2. Verify Hebrew text renders correctly
3. Verify carousel direction is RTL (swipe right = previous, swipe left = next)
4. Verify Arrow key navigation is reversed (ArrowRight = previous, ArrowLeft = next)
5. Verify spacing is correct (padding-right on mobile, padding-left on desktop in RTL)

**Success Criteria**:
- ✅ Text is right-aligned
- ✅ Hebrew fonts load correctly (Heebo, Montserrat)
- ✅ Carousel direction is RTL
- ✅ Keyboard navigation is reversed for RTL
- ✅ Spacing is correct for RTL layout

**Failure Indicators**:
- ❌ Text is left-aligned (RTL not enabled)
- ❌ Fonts don't load (Google Fonts CDN issue)
- ❌ Carousel direction is LTR (check `direction: 'rtl'` config)
- ❌ Keyboard navigation is not reversed (check Arrow key mapping)

---

#### 6. Mobile Responsiveness

**Steps**:
1. Open site on mobile device (or use browser dev tools mobile emulation)
2. Verify layout is mobile-friendly (no horizontal scroll)
3. Verify touch targets are large enough (buttons, links)
4. Verify form is usable on mobile (inputs are large enough)
5. Verify carousel works with touch swipe
6. Verify videos play on mobile (iOS-specific: autoplay restrictions)
7. Verify modals are full-screen or properly sized on mobile

**Success Criteria**:
- ✅ No horizontal scroll
- ✅ Touch targets are 44px+ height
- ✅ Form is usable on mobile
- ✅ Carousel swipe works
- ✅ Videos play on mobile (with user interaction if required)
- ✅ Modals are mobile-friendly

**Failure Indicators**:
- ❌ Horizontal scroll (layout issue)
- ❌ Touch targets too small (accessibility issue)
- ❌ Form not usable (input sizing issue)
- ❌ Carousel swipe doesn't work (touch event issue)
- ❌ Videos don't play on mobile (autoplay restriction, iOS issue)

---

### What "Success" Looks Like

**Overall Health Indicators**:

1. ✅ **Build**: `npm run build` succeeds without errors
2. ✅ **Lint**: `npm run lint` passes with no errors
3. ✅ **Accessibility**: `npm run lint:a11y` passes with no errors
4. ✅ **Form Submission**: Form submits successfully, email received
5. ✅ **Video Playback**: Videos load and play correctly
6. ✅ **Carousel**: Carousel navigates smoothly, no infinite loops
7. ✅ **Modals**: Modals open/close, focus trap works
8. ✅ **RTL Layout**: Hebrew text renders correctly, RTL direction works
9. ✅ **Mobile**: Site is responsive and usable on mobile devices
10. ✅ **Deployment**: Site deploys successfully to GitHub Pages

**If All Checks Pass**: ✅ Project is healthy and ready for continued development

**If Any Check Fails**: ❌ Review error messages, check environment variables, verify external service access, consult this handover document for troubleshooting

---

## 11. Deployment (GitHub Pages)

### Deployment Method

**Important**: This project uses **manual deployment via `gh-pages` npm package**, NOT GitHub Actions.

- **Deployment Script**: `npm run deploy` (defined in `package.json:10`)
- **Command**: `npm run build && gh-pages -d dist`
- **What It Does**: Builds the project and pushes `dist/` folder to `gh-pages` branch
- **Package**: `gh-pages` v6.3.0 (devDependency in `package.json:35`)

### Prerequisites

Before deploying, ensure:

1. **Git Remote Configured**:
   ```bash
   git remote -v
   # Should show 'origin' pointing to your GitHub repository
   ```

2. **Git Credentials**:
   - SSH key added to GitHub account, OR
   - HTTPS with Personal Access Token (PAT) configured
   - Write access to repository (required to push to `gh-pages` branch)

3. **Environment Variables**:
   - `.env.local` file exists with `VITE_EMAILJS_PUBLIC_KEY` (for local testing)
   - Note: Environment variables are **embedded at build time** (Vite convention)
   - For production, ensure `.env.local` has correct values before building

### GitHub Pages Configuration

**Critical**: GitHub Pages must be configured to serve from `gh-pages` branch (NOT `main` branch or `/docs` folder).

#### How to Configure GitHub Pages

1. Go to repository on GitHub: `Settings` → `Pages`
2. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click "Save"
4. Wait 1-2 minutes for GitHub Pages to build
5. Site will be available at: `https://yourusername.github.io/Gilad-landing-page/`

**Why `/gh-pages` branch?**
- `vite.config.ts:11` sets `base: '/Gilad-landing-page/'` (subdirectory path)
- `gh-pages` package automatically creates/updates this branch
- GitHub Pages serves from `gh-pages` branch root

### First-Time Deployment Setup

If this is the first deployment (or `gh-pages` branch doesn't exist):

1. **Verify Git Remote**:
   ```bash
   git remote -v
   # Should show: origin  https://github.com/username/repo-name.git (or SSH URL)
   ```

2. **Create `.env.local`** (if not exists):
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your VITE_EMAILJS_PUBLIC_KEY
   ```

3. **Build Locally** (test before deploying):
   ```bash
   npm run build
   # Verify dist/ folder is created and contains index.html
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **What Happens**:
   - `gh-pages` package creates `gh-pages` branch automatically (if doesn't exist)
   - Pushes `dist/` folder contents to `gh-pages` branch
   - GitHub Pages automatically rebuilds site from `gh-pages` branch

6. **Verify Deployment**:
   - Check GitHub repository: `gh-pages` branch should exist
   - Visit: `https://yourusername.github.io/Gilad-landing-page/`
   - Wait 1-2 minutes if site doesn't load immediately

### Regular Deployment Process

After first deployment, routine deployments:

1. **Make Changes**: Edit code, commit to `main` branch
2. **Test Locally**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/Gilad-landing-page/
   # Test all functionality
   ```
3. **Build Test**:
   ```bash
   npm run build
   npm run preview
   # Verify production build works
   ```
4. **Deploy**:
   ```bash
   npm run deploy
   ```
5. **Verify Production**:
   - Visit production URL
   - Test form submission, videos, carousel
   - Check browser console for errors

### Deployment Verification Checklist

After each deployment, verify:

- [ ] `gh-pages` branch updated (check GitHub repository)
- [ ] Production site loads: `https://yourusername.github.io/Gilad-landing-page/`
- [ ] Form submission works (test with real form)
- [ ] Videos play correctly
- [ ] Carousel navigation works
- [ ] Modals open/close
- [ ] RTL layout renders correctly
- [ ] Mobile responsiveness works
- [ ] No console errors (check browser DevTools)

### Custom Domain (If Applicable)

If using a custom domain:

1. **CNAME File**: Must exist in `gh-pages` branch root
   ```bash
   # After deployment, manually add CNAME file to gh-pages branch:
   echo "yourdomain.com" > dist/CNAME
   npm run deploy
   ```

2. **DNS Configuration**: Point domain to GitHub Pages:
   - Add CNAME record: `yourdomain.com` → `yourusername.github.io`
   - Or A records: Point to GitHub Pages IPs (check GitHub docs)

3. **GitHub Pages Settings**: Enable custom domain in repository Settings → Pages

**Note**: Custom domain setup is manual and must be repeated if `gh-pages` branch is recreated.

---

## 12. Disaster Recovery

### Rollback a Bad Deployment

If a deployment breaks production:

1. **Identify Last Good Commit**:
   ```bash
   git log --oneline
   # Find commit hash of last working version
   ```

2. **Checkout Last Good Version**:
   ```bash
   git checkout <commit-hash>
   ```

3. **Rebuild and Redeploy**:
   ```bash
   npm run build
   npm run deploy
   ```

4. **Alternative: Revert via GitHub**:
   - Go to repository → `gh-pages` branch
   - Find last good commit
   - Create new commit reverting bad changes
   - GitHub Pages will automatically rebuild

### Redeploy After Failure

If deployment fails:

1. **Check Error Message**:
   ```bash
   npm run deploy
   # Read error output carefully
   ```

2. **Common Issues**:
   - **Git remote not configured**: `git remote add origin <repo-url>`
   - **No write access**: Check GitHub permissions, SSH keys, or PAT
   - **Build fails**: Fix build errors first (`npm run build`)
   - **Network error**: Retry deployment

3. **Force Redeploy**:
   ```bash
   # Clean build
   rm -rf dist node_modules/.vite
   npm run build
   npm run deploy
   ```

### Common Deployment Failures

#### Issue: "gh-pages: command not found"

**Solution**:
```bash
npm install
# Ensures gh-pages package is installed
```

#### Issue: "Permission denied (publickey)"

**Solution**:
- Check SSH key is added to GitHub account
- Or switch to HTTPS: `git remote set-url origin https://github.com/username/repo.git`
- Configure Git credentials for HTTPS

#### Issue: "Site loads but assets are broken (404 errors)"

**Solution**:
- Verify `vite.config.ts:11` has correct base path: `base: '/Gilad-landing-page/'`
- Check GitHub Pages is serving from `gh-pages` branch (not `main` or `/docs`)
- Verify asset paths in `dist/index.html` are relative (not absolute)

#### Issue: "Form submission fails in production"

**Solution**:
- Verify `VITE_EMAILJS_PUBLIC_KEY` is set in `.env.local` before building
- Check EmailJS dashboard for API errors
- Verify EmailJS service ID and template ID are correct
- Test form submission manually on production site

#### Issue: "Videos don't play in production"

**Solution**:
- Check Vimeo video IDs are correct and videos are accessible
- Verify Vimeo Player API script loads (check browser console)
- Check CORS settings if videos are private

### Verification After Recovery

After fixing deployment:

1. **Build Test**: `npm run build` (must succeed)
2. **Local Preview**: `npm run preview` (test locally)
3. **Deploy**: `npm run deploy` (must succeed)
4. **Production Test**: Visit production URL, test all functionality
5. **Monitor**: Check browser console for errors, test on mobile

---

## 13. Transfer Readiness Checklist

### Pre-Transfer (Before Switching Accounts)

Use this checklist to ensure smooth transfer:

#### Repository Information

- [ ] **Repository URL**: `https://github.com/username/repo-name.git` (fill in actual URL)
- [ ] **Default Branch**: `main` or `master` (fill in actual branch)
- [ ] **Production URL**: `https://username.github.io/Gilad-landing-page/` (fill in actual URL)
- [ ] **Git Remote**: Verify `git remote -v` shows correct repository

#### Local Setup

- [ ] **Node.js Installed**: Version 18+ (`node --version`)
- [ ] **Git Configured**: Name and email set (`git config user.name`, `git config user.email`)
- [ ] **Repository Cloned**: `git clone <repo-url>`
- [ ] **Dependencies Installed**: `npm install` (no errors)
- [ ] **Environment Variables**: `.env.local` created from `.env.example`
- [ ] **Local Dev Works**: `npm run dev` (site loads at `http://localhost:3000/Gilad-landing-page/`)

#### Build & Test

- [ ] **Build Succeeds**: `npm run build` (no errors, `dist/` folder created)
- [ ] **Lint Passes**: `npm run lint` (no errors)
- [ ] **Preview Works**: `npm run preview` (production build works locally)

#### External Services

- [ ] **EmailJS Account**: Access verified, public key obtained
- [ ] **Vimeo Account**: Access verified, video IDs confirmed
- [ ] **GitHub Account**: Repository access, write permissions

#### GitHub Pages Configuration

- [ ] **Pages Source**: Configured to serve from `gh-pages` branch (Settings → Pages)
- [ ] **Base Path**: Verified `/Gilad-landing-page/` in `vite.config.ts:11`
- [ ] **Custom Domain**: If used, DNS and CNAME configured

### Post-Transfer (After Switching Accounts)

#### Git Configuration

- [ ] **Git Config Updated**: Name and email set for new account
  ```bash
  git config user.name "Your New Name"
  git config user.email "your.new.email@example.com"
  ```

- [ ] **Git Remote Verified**: `git remote -v` shows correct repository
- [ ] **SSH/HTTPS Configured**: Can push to repository (test with `git push`)

#### Credentials & Access

- [ ] **GitHub Access**: Can clone, push, and deploy
- [ ] **EmailJS Key**: `VITE_EMAILJS_PUBLIC_KEY` in `.env.local`
- [ ] **Vimeo Access**: Videos accessible and playable

#### First Deployment Test

- [ ] **Build Test**: `npm run build` (succeeds)
- [ ] **Deploy Test**: `npm run deploy` (succeeds, no errors)
- [ ] **Production Verification**: Site loads, all features work

### Success Criteria

All items checked = ✅ **Ready for seamless transfer**

If any item unchecked = ⚠️ **Fix before transferring**

---

## Additional Resources

### Documentation Files

- `docs/a11y-report.md`: Accessibility audit and fixes
- `docs/FINAL_LEGAL_STATUS.md`: Legal document status and compliance
- `docs/LEGAL_COMPLIANCE_SUMMARY.md`: Legal compliance summary
- `docs/IMPLEMENTATION_SUMMARY.md`: Implementation history and decisions
- `docs/data-flow-map.md`: Data flow and third-party service documentation
- `CAROUSEL_ROOT_CAUSE_ANALYSIS.md`: Carousel bug analysis and fix
- `CAROUSEL_FIX_SUMMARY.md`: Carousel fix implementation

### Key Configuration Files

- `vite.config.ts`: Build configuration, base path, env vars
- `tailwind.config.js`: Theme configuration (colors, fonts, breakpoints)
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: Linting rules (including accessibility)
- `package.json`: Dependencies and scripts

### Critical Code Sections (Line References)

- Form submission: `App.tsx:1077-1320`
- Video players: `App.tsx:1322-1991`
- Carousel: `App.tsx:2123-2470`
- Stage management: `App.tsx:2192-2300`
- Floating CTA: `App.tsx:766-882`
- Exit intent popup: `App.tsx:884-1045`
- Legal content: `App.tsx:253-483`

---

## Final Notes

This handover document is designed to be **self-contained**. A new Cursor instance should be able to continue this project without relying on prior chat history.

**Key Principles**:
1. **Don't Break What Works**: Complex logic has been debugged and stabilized
2. **Maintain Compliance**: Legal content is reviewed and compliant
3. **Preserve Accessibility**: WCAG 2.1 AA compliance must be maintained
4. **Test Incrementally**: Changes should be tested after each modification
5. **Document Decisions**: If making significant changes, document why

**When in Doubt**:
- Read the related documentation files
- Test on real devices (not just dev tools)
- Verify accessibility with keyboard and screen reader
- Consult legal counsel before changing legal content
- Test form submission, video playback, and carousel after changes

---

**Document Version**: 2.0  
**Last Updated**: January 2026  
**Maintained By**: Project owner / development team

---

## Appendix: Environment Variables Reference Table

### Complete Environment Variables Audit

| Variable Name | Required | Default Value | Where Used | How to Obtain |
|--------------|----------|---------------|------------|---------------|
| `VITE_EMAILJS_PUBLIC_KEY` | ✅ **YES** | None (required) | `App.tsx:72`, `App.tsx:1127` | EmailJS Dashboard → Account → API Keys → Public Key |
| `VITE_EMAILJS_SERVICE_ID` | ❌ No | `'service_fphe5xu'` | `App.tsx:70`, `App.tsx:1124` | EmailJS Dashboard → Email Services → Service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | ❌ No | `'template_8p1hgtg'` | `App.tsx:71`, `App.tsx:1125` | EmailJS Dashboard → Email Templates → Template ID |
| `VITE_RECIPIENT_EMAIL` | ❌ No | `'gilad042@gmail.com'` | `App.tsx:76`, `App.tsx:1107` | Owner-provided email address |

### Environment Variable Details

#### `VITE_EMAILJS_PUBLIC_KEY` (REQUIRED)

- **Purpose**: EmailJS API authentication for form submissions
- **Where Consumed**: 
  - `App.tsx:72` (validation check)
  - `App.tsx:1127` (EmailJS API call)
- **What Breaks If Missing**: 
  - Form submissions fail with error: "תצורת EmailJS חסרה. אנא פנה לתמיכה."
  - Console error: "VITE_EMAILJS_PUBLIC_KEY environment variable is required"
- **How to Obtain**:
  1. Log in to EmailJS Dashboard: https://dashboard.emailjs.com
  2. Go to: Account → API Keys
  3. Copy "Public Key" value
  4. Add to `.env.local`: `VITE_EMAILJS_PUBLIC_KEY=your_public_key_here`
- **Security**: 
  - Public key is safe to expose (designed for client-side use)
  - Must be in `.env.local` (gitignored, never commit)
  - No hardcoded fallback (security best practice)

#### `VITE_EMAILJS_SERVICE_ID` (OPTIONAL)

- **Purpose**: EmailJS service identifier
- **Default**: `'service_fphe5xu'`
- **Where Consumed**: `App.tsx:70`, `App.tsx:1124`
- **When to Override**: Only if using a different EmailJS service
- **How to Obtain**: EmailJS Dashboard → Email Services → Service ID

#### `VITE_EMAILJS_TEMPLATE_ID` (OPTIONAL)

- **Purpose**: EmailJS email template identifier
- **Default**: `'template_8p1hgtg'`
- **Where Consumed**: `App.tsx:71`, `App.tsx:1125`
- **When to Override**: Only if using a different EmailJS template
- **How to Obtain**: EmailJS Dashboard → Email Templates → Template ID

#### `VITE_RECIPIENT_EMAIL` (OPTIONAL)

- **Purpose**: Override recipient email address for form submissions
- **Default**: `'gilad042@gmail.com'`
- **Where Consumed**: `App.tsx:76`, `App.tsx:1107`
- **When to Override**: Only if sending to a different email address

### Environment Variable Setup

1. **Copy Template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`**:
   ```bash
   # Required - get from EmailJS Dashboard
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
   
   # Optional - only override if needed
   # VITE_EMAILJS_SERVICE_ID=service_fphe5xu
   # VITE_EMAILJS_TEMPLATE_ID=template_8p1hgtg
   # VITE_RECIPIENT_EMAIL=gilad042@gmail.com
   ```

3. **Verify Setup**:
   ```bash
   # Check .env.local exists and is gitignored
   cat .env.local
   git status
   # .env.local should NOT appear in git status
   ```

### Environment Variable Loading

- **Vite Convention**: All env vars must be prefixed with `VITE_`
- **Build Time**: Environment variables are embedded at build time (not runtime)
- **Access Pattern**: `import.meta.env.VITE_*` (Vite convention)
- **File Location**: `.env.local` in project root (gitignored)
- **Loading**: Vite automatically loads `.env.local` via `loadEnv()` in `vite.config.ts:7`

### Security Notes

1. **Never Commit Secrets**: `.env.local` is gitignored (`.gitignore:13` pattern `*.local`)
2. **No Hardcoded Fallbacks**: `VITE_EMAILJS_PUBLIC_KEY` has no fallback (security best practice)
3. **Public Key is Safe**: EmailJS public key is designed for client-side exposure
4. **Rotation**: If key is compromised, rotate in EmailJS Dashboard and update `.env.local`

