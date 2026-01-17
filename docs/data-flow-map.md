# Data Flow Map

**Project**: Gilad Doron - Online Fitness Coaching Landing Page  
**Date**: January 2026

## Overview

This document maps all data collection, storage, and transmission flows in the landing page. All references include exact file locations and line numbers.

## Data Collection Points

### 1. Lead Form Submission

**Location**: `App.tsx` lines 856-924 (`LeadForm` component)

**Data Collected**:
- `fullName` (string) - Full name of user
- `phone` (string) - Phone number
- `email` (string) - Email address
- `contactPref` (string) - Preferred contact method: "phone" or "whatsapp"
- `consent` (boolean) - Privacy policy consent checkbox

**Collection Method**: HTML form inputs (`<input>`, `<label>`, `<fieldset>`)

**Evidence**:
```tsx
// App.tsx:858-863
const [formData, setFormData] = useState<FormData>({
  fullName: '',
  phone: '',
  email: '',
  contactPref: 'phone',
  consent: false
});
```

**Validation**: Client-side validation via HTML5 `required` attributes and `type="email"`, `type="tel"`

**Submission Handler**: `handleSubmit` function (`App.tsx:868-924`)

### 2. EmailJS Integration

**Service**: EmailJS (third-party email service)

**Configuration Location**: `App.tsx` lines 68-73

**Evidence**:
```tsx
// App.tsx:70-73
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fphe5xu';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8p1hgtg';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'vT2iqiRsrq5f4D03A';
const RECIPIENT_EMAIL = import.meta.env.VITE_RECIPIENT_EMAIL || 'gilad042@gmail.com';
```

**Script Loading**: `index.html` line 35
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

**Data Transmission**:
1. Form data collected in `templateParams` object (`App.tsx:880-894`)
2. Sent via `window.emailjs.send()` API (`App.tsx:897-902`)
3. Data transmitted to EmailJS servers
4. EmailJS forwards email to `RECIPIENT_EMAIL` (`gilad042@gmail.com`)

**Transmitted Data Structure**:
```tsx
// App.tsx:880-894
const templateParams = {
  to_email: RECIPIENT_EMAIL,
  fullName: formData.fullName,
  phone: formData.phone,
  email: formData.email,
  contactPref: formData.contactPref === 'phone' ? 'טלפון' : 'וואטסאפ',
  message: `בקשת התאמה חדשה מ-${formData.fullName}`,
  date: new Date().toLocaleDateString('he-IL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
};
```

**Endpoint**: EmailJS API (external third-party service)
**Security Risk**: ⚠️ Public key exposed in code (should be environment variable)

### 3. Browser Storage

#### 3.1 LocalStorage

**Usage**: User interaction tracking (non-PII)

**Location**: `App.tsx` lines 1833-1864

**Data Stored**:
- `hasExpandedStep` (boolean) - Whether user has expanded any step in the accordion

**Evidence**:
```tsx
// App.tsx:1833-1835
const [hasExpandedAnyStep, setHasExpandedAnyStep] = useState(() => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('hasExpandedStep') === 'true';
});

// App.tsx:1846, 1864
localStorage.setItem('hasExpandedStep', 'true');
```

**Purpose**: UI state persistence (hides "invite to expand" animation after first interaction)

**Privacy Impact**: Low - no personally identifiable information

#### 3.2 SessionStorage

**Usage**: Popup suppression flag (non-PII)

**Location**: `App.tsx` lines 690, 736

**Data Stored**:
- `exitIntentShown` (boolean) - Whether exit intent popup has been shown in this session

**Evidence**:
```tsx
// App.tsx:690
if (sessionStorage.getItem('exitIntentShown') === 'true') {
  return;
}

// App.tsx:736
sessionStorage.setItem('exitIntentShown', 'true');
```

**Purpose**: Prevent showing exit intent popup multiple times per session

**Privacy Impact**: Low - no personally identifiable information

## Third-Party Services

### 1. EmailJS

**Purpose**: Form submission → email delivery

**Data Flow**:
```
User submits form → EmailJS API → EmailJS servers → Email to gilad042@gmail.com
```

**Privacy Policy**: EmailJS Privacy Policy applies (https://www.emailjs.com/legal/privacy-policy/)

**Data Retention**: Controlled by EmailJS (see their privacy policy)

**Location in Code**: 
- Script: `index.html:35`
- Configuration: `App.tsx:70-73`
- Usage: `App.tsx:897-902`

**Security Note**: Public key (`vT2iqiRsrq5f4D03A`) is hardcoded as fallback. Should use environment variables only.

### 2. Vimeo

**Purpose**: Video embedding (2 video players)

**Script Loading**: `index.html` line 32
```html
<script src="https://player.vimeo.com/api/player.js"></script>
```

**Embed Locations**: 
1. `VideoPlayer` component (`App.tsx:1427-1810`) - Main video
2. `ClientTestimonialVideo` component (`App.tsx:1095-1424`) - Testimonial video

**Video IDs**:
- Main video: `1152174898` (embedded in `VideoPlayer`)
- Testimonial video: `1152174898` (embedded in `ClientTestimonialVideo`)

**Iframe URLs**:
```tsx
// App.tsx:1450-1451 (VideoPlayer)
const baseUrl = "https://player.vimeo.com/video/1152174898?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=6e172adfe8&s=e8675d0eb6c47f57274868162088cbf80f997c1c_1767884558";
const vimeoUrl = `${baseUrl}&autoplay=0&muted=1&loop=1&controls=1&background=0&playsinline=1&responsive=1&byline=0&title=0&portrait=0`;

// App.tsx:1118 (ClientTestimonialVideo)
const vimeoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&muted=1&loop=0&controls=1&background=0&playsinline=1&responsive=1&byline=0&title=0&portrait=0`;
```

**Tracking Implications**: 
- Vimeo may set cookies for analytics/tracking
- Vimeo Privacy Policy applies (https://vimeo.com/privacy)
- Third-party requests to Vimeo servers (player.vimeo.com)

**Privacy Impact**: Medium - Vimeo may track user interactions with videos

### 3. Google Fonts

**Purpose**: Web font delivery (Heebo, Montserrat)

**Loading Location**: `index.html` lines 25-31

**Evidence**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800&family=Montserrat:wght@700;800&display=swap"
  rel="stylesheet"
/>
```

**Tracking Implications**:
- Google Fonts CDN requests (`fonts.googleapis.com`, `fonts.gstatic.com`)
- May involve cookies/tracking (depends on Google Fonts policy)
- IP address collection (standard for CDN requests)

**Privacy Impact**: Low-Medium - Google may collect analytics data

**Mitigation Option**: Self-host fonts to avoid third-party tracking

## Data Flow Diagram

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         │                                                         │
         ▼                                                         ▼
┌─────────────────┐                                      ┌─────────────────┐
│  Form Submit    │                                      │  Video Embeds   │
│  (LeadForm)     │                                      │  (Vimeo)        │
└────────┬────────┘                                      └────────┬────────┘
         │                                                         │
         ▼                                                         ▼
┌─────────────────┐                                      ┌─────────────────┐
│  EmailJS API    │                                      │  Vimeo CDN      │
│  (External)     │                                      │  (External)     │
└────────┬────────┘                                      └─────────────────┘
         │
         ▼
┌─────────────────┐
│  EmailJS        │
│  Servers        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Recipient      │
│  Email          │
│  (gilad042@)    │
└─────────────────┘

Browser Storage (localStorage/sessionStorage):
┌─────────────────┐
│  hasExpandedStep│ → localStorage (non-PII)
│  exitIntentShown│ → sessionStorage (non-PII)
└─────────────────┘

Third-Party Requests:
├─ EmailJS CDN (email.min.js)
├─ Vimeo Player API (player.vimeo.com)
└─ Google Fonts CDN (fonts.googleapis.com)
```

## Network Requests

### On Page Load:
1. HTML document (`index.html`)
2. Vite bundle (`/index.tsx` → React app)
3. Vimeo Player API script (`player.vimeo.com/api/player.js`)
4. EmailJS library (`cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js`)
5. Google Fonts CSS (`fonts.googleapis.com/css2?family=...`)
6. Google Fonts font files (`fonts.gstatic.com/...`)

### On Form Submit:
1. EmailJS API request (`api.emailjs.com`) - Contains form data

### On Video Interaction:
1. Vimeo iframe requests (`player.vimeo.com/video/...`)
2. Vimeo tracking/analytics requests (if enabled by Vimeo)

## Privacy Compliance Notes

1. **EmailJS Public Key**: Currently hardcoded. Should use environment variables only (`VITE_EMAILJS_PUBLIC_KEY`)
2. **Vimeo Tracking**: Vimeo embeds may set cookies. Consider cookie consent banner if required by jurisdiction (GDPR, etc.)
3. **Google Fonts**: Self-hosting fonts eliminates third-party tracking risk
4. **Browser Storage**: Only non-PII stored in localStorage/sessionStorage (safe)
5. **Form Data**: Collected with explicit consent checkbox (`App.tsx:1039-1053`)

## Recommendations

See `/docs/policy-risk-report.md` for detailed compliance recommendations and risk mitigation strategies.

