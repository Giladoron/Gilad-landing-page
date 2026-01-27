# Policy & Compliance Risk Report

**Project**: Gilad Doron - Online Fitness Coaching Landing Page  
**Date**: January 2026  
**Language**: RTL Hebrew (`lang="he" dir="rtl"`)

## Executive Summary

This report analyzes policy and compliance risks based on the actual implementation of the landing page. All findings are evidence-based with specific code references.

**Launch Recommendation**: ⚠️ **CONDITIONAL GO** - Critical security issue must be addressed, policy links should be added before launch.

## Critical Risks (Must Fix Before Launch)

### 1. EmailJS Public Key Exposed in Code

**Severity**: 🔴 **CRITICAL** (Security Risk)

**Location**: `App.tsx` lines 68-73

**Evidence**:
```tsx
// App.tsx:72
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'vT2iqiRsrq5f4D03A';
```

**Issue**: Public key is hardcoded as fallback value, visible in source code

**Risk**:
- Public keys in client-side code can be abused
- Anyone can view the key in browser DevTools
- Risk of unauthorized API usage

**Fix Required**:
1. Remove hardcoded fallback value
2. Use environment variables only (`VITE_EMAILJS_PUBLIC_KEY`)
3. Ensure `.env.local` is in `.gitignore` (verify this is already done)
4. Document required environment variables in README

**Code Location to Update**:
- `App.tsx:72` - Remove fallback `'vT2iqiRsrq5f4D03A'`
- Update to: `const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;`
- Add error handling if env var is missing

**Estimated Risk**: High - Security exposure

**Status**: ❌ **NOT FIXED** - Requires code change

### 2. Privacy Policy Not Linked from Form Collection Point

**Severity**: 🔴 **CRITICAL** (Legal Risk - GDPR/Privacy Laws)

**Location**: `App.tsx` lines 1039-1053 (consent checkbox)

**Evidence**:
```tsx
// App.tsx:1039-1053
<div className="flex items-start gap-2 pt-2">
  <input type="checkbox" id="consent" ... />
  <label htmlFor="consent" className="...">
    אני מאשר/ת יצירת קשר בהתאם למדיניות פרטיות
  </label>
</div>
```

**Issue**: Privacy policy text mentions "מדיניות פרטיות" but there's no link to the actual policy

**Risk**:
- GDPR requires accessible privacy policy at point of data collection
- Israeli Privacy Protection Law may require explicit links
- Users cannot review policy before consenting

**Fix Required**:
1. Add link to privacy policy modal next to consent checkbox
2. Link should open the existing LegalModal with type="privacy"
3. Example: `מדיניות פרטיות` → link to modal

**Code Location to Update**:
- `App.tsx:1051-1052` - Update label to include link:
  ```tsx
  <label htmlFor="consent" className="...">
    אני מאשר/ת יצירת קשר בהתאם ל{' '}
    <button
      type="button"
      onClick={() => setModalType('privacy')}
      className="underline hover:text-accent"
    >
      מדיניות פרטיות
    </button>
  </label>
  ```
- Note: Requires access to `setModalType` in LeadForm component (may need prop drilling or context)

**Estimated Risk**: High - Legal compliance issue

**Status**: ❌ **NOT FIXED** - Requires code change + owner review of policy content

### 3. Cookie Consent Requirements (Potentially Required)

**Severity**: 🟡 **HIGH** (Jurisdiction-Dependent)

**Location**: Multiple third-party services

**Evidence**:
- Vimeo embeds (`index.html:32`, `App.tsx:1379, 1746`) may set cookies
- Google Fonts CDN (`index.html:28-31`) may involve tracking/cookies
- EmailJS CDN (`index.html:35`) - typically no cookies, but verify

**Issue**: No cookie consent banner if non-essential cookies are set

**Risk**:
- **GDPR (EU)**: Requires consent for non-essential cookies
- **ePrivacy Directive**: Requires explicit consent for cookies
- **Israeli Law**: May require cookie consent depending on tracking

**Assessment**:
1. **Vimeo**: Likely sets analytics cookies (verify in browser DevTools → Network tab)
2. **Google Fonts**: May set cookies depending on Google's policy (verify)
3. **EmailJS**: Typically no cookies, but verify

**Fix Required**:
1. Audit actual cookies set by third parties (use browser DevTools)
2. If non-essential cookies exist → Implement cookie consent banner
3. If only essential cookies → No banner needed (but document why)

**Cookie Consent Implementation Checklist** (if needed):
- [ ] Add cookie consent banner component
- [ ] Detect cookies set by Vimeo/Google Fonts
- [ ] Block non-essential cookies until consent
- [ ] Provide clear opt-in/opt-out mechanism
- [ ] Store consent in localStorage
- [ ] Link to cookie policy in footer (`App.tsx:2779-2783`)

**Code Location to Update** (if needed):
- Add cookie banner component to `App.tsx`
- Update footer links to include cookie policy
- Consider using a cookie consent library (e.g., `react-cookie-consent`)

**Estimated Risk**: Medium-High (depends on jurisdiction and actual cookie usage)

**Status**: ⚠️ **REQUIRES AUDIT** - Verify which cookies are actually set

## High Priority Improvements (Strongly Recommended)

### 4. Environment Variables Documentation

**Severity**: 🟡 **HIGH** (Operational Risk)

**Issue**: No documentation of required environment variables

**Fix Required**:
1. Create `.env.example` file with required variables:
   ```
   VITE_EMAILJS_SERVICE_ID=service_fphe5xu
   VITE_EMAILJS_TEMPLATE_ID=template_8p1hgtg
   VITE_EMAILJS_PUBLIC_KEY=
   VITE_RECIPIENT_EMAIL=gilad042@gmail.com
   ```
2. Document in README.md how to set up environment variables
3. Verify `.env.local` is in `.gitignore`

**Estimated Risk**: Medium - Deployment/operational issue

**Status**: ❌ **NOT FIXED** - Create `.env.example` file

### 5. Privacy Policy Content Review

**Severity**: 🟡 **HIGH** (Legal Risk)

**Location**: `App.tsx` lines 273-286 (LEGAL_CONTENT.privacy)

**Evidence**:
```tsx
// App.tsx:273-286
privacy: {
  title: 'מדיניות פרטיות',
  content: (
    <div className="space-y-4 text-gray-300">
      <p>הפרטיות שלך חשובה לנו. המידע שאנו אוספים (שם, טלפון, אימייל) משמש אך ורק למטרות הבאות:</p>
      ...
    </div>
  )
}
```

**Issue**: Policy content exists but should be reviewed by legal counsel

**Risk**:
- Policy may not cover all data collection points (EmailJS, Vimeo, Google Fonts)
- May not comply with GDPR/Israeli Privacy Protection Law requirements
- May not accurately describe data retention policies

**Fix Required**:
1. **Owner Action**: Review privacy policy content with legal counsel
2. Ensure policy covers:
   - EmailJS data transmission
   - Vimeo embed tracking implications
   - Google Fonts CDN requests
   - Browser storage (localStorage/sessionStorage) - non-PII, low risk
   - Data retention periods
   - User rights (access, deletion, etc.)
   - Contact information for privacy requests

**Code Location**: `App.tsx:273-286` - Update content after legal review

**Estimated Risk**: Medium - Legal compliance

**Status**: ⚠️ **REQUIRES OWNER/LEGAL REVIEW**

### 6. Terms of Service Content Review

**Severity**: 🟡 **MEDIUM** (Legal Risk)

**Location**: `App.tsx` lines 288-302 (LEGAL_CONTENT.terms)

**Evidence**:
```tsx
// App.tsx:288-302
terms: {
  title: 'תקנון שימוש',
  content: (
    <div className="space-y-4 text-gray-300">
      <p>השימוש באתר ובשירותי הליווי של גילעד דורון כפוף לתנאים הבאים:</p>
      ...
    </div>
  )
}
```

**Issue**: Terms content exists but should be reviewed by legal counsel

**Risk**:
- May not cover all service terms
- Medical disclaimer exists (good) but should be verified
- Results disclaimer exists (good) but should be verified

**Fix Required**:
1. **Owner Action**: Review terms content with legal counsel
2. Ensure terms cover:
   - Service description
   - Payment terms (if applicable)
   - Cancellation policy
   - Medical disclaimer (already included - verify)
   - Results disclaimer (already included - verify)
   - Intellectual property rights

**Code Location**: `App.tsx:288-302` - Update content after legal review

**Estimated Risk**: Medium - Legal compliance

**Status**: ⚠️ **REQUIRES OWNER/LEGAL REVIEW**

## Medium Priority Improvements (Nice to Have)

### 7. Self-Host Google Fonts (Reduce Third-Party Tracking)

**Severity**: 🟢 **MEDIUM** (Privacy Enhancement)

**Location**: `index.html` lines 28-31

**Issue**: Google Fonts loaded from Google CDN may involve tracking

**Fix Required**:
1. Download Heebo and Montserrat fonts
2. Self-host fonts in `/public/assets/fonts/`
3. Update CSS to reference local fonts
4. Remove Google Fonts CDN links

**Benefit**: Eliminates third-party tracking from Google Fonts

**Estimated Risk**: Low - Privacy enhancement

**Status**: ✅ **OPTIONAL** - Not required for launch

### 8. Testimonials/Media Consent Verification

**Severity**: 🟢 **MEDIUM** (Legal Risk)

**Location**: `App.tsx` lines 109-174 (CLIENT_RESULTS data)

**Evidence**:
- Client images used: `result-01.webp`, `result-02.webp`
- Client videos embedded: Vimeo video ID `1152174898`
- Client names, ages, professions displayed

**Issue**: Client testimonials/media used without visible consent documentation

**Risk**:
- May require explicit client consent for image/video use
- Privacy concerns if clients did not consent to public display
- GDPR/Privacy laws may require explicit consent

**Fix Required**:
1. **Owner Action**: Verify client consent for:
   - Image use (`result-01.webp`, `result-02.webp`)
   - Video use (Vimeo videos)
   - Name/profession/age display
2. Document consent records (not in code - owner's records)
3. Consider adding disclaimer if needed (e.g., "Results may vary")

**Code Location**: N/A - Not a code issue, owner must verify

**Estimated Risk**: Medium - Legal compliance

**Status**: ⚠️ **REQUIRES OWNER VERIFICATION** - Not a code change

## Policy Link Hook Points

### Where Policy Links Should Be Added

1. **Form Consent Checkbox** (`App.tsx:1051-1052`)
   - Add link to privacy policy modal
   - Current: `אני מאשר/ת יצירת קשר בהתאם למדיניות פרטיות`
   - Should be: `אני מאשר/ת יצירת קשר בהתאם ל[מדיניות פרטיות]` (link)

2. **Footer Links** (`App.tsx:2779-2783`)
   - Already includes accessibility, privacy, and terms links ✅
   - Consider adding cookie policy link (if cookie consent is needed)

3. **Privacy Policy Modal Content** (`App.tsx:273-286`)
   - Consider adding link to terms of service (cross-reference)
   - Consider adding link to contact email for privacy requests

4. **Terms of Service Modal Content** (`App.tsx:288-302`)
   - Consider adding link to privacy policy (cross-reference)

## Compliance Checklist

### Before Launch

- [ ] **CRITICAL**: Fix EmailJS public key exposure (remove hardcoded fallback)
- [ ] **CRITICAL**: Add privacy policy link to form consent checkbox
- [ ] **CRITICAL**: Audit cookies set by Vimeo/Google Fonts (use DevTools)
- [ ] **HIGH**: Create `.env.example` file with required variables
- [ ] **HIGH**: Review privacy policy content with legal counsel
- [ ] **HIGH**: Review terms of service content with legal counsel
- [ ] **MEDIUM**: Verify client consent for testimonials/media use
- [ ] **OPTIONAL**: Consider self-hosting Google Fonts

### Legal Content Review Needed

- [ ] Privacy policy covers all data collection points (EmailJS, Vimeo, Google Fonts)
- [ ] Privacy policy includes data retention periods
- [ ] Privacy policy includes user rights (access, deletion, etc.)
- [ ] Privacy policy includes contact information for privacy requests
- [ ] Terms of service covers all service terms
- [ ] Medical disclaimer is accurate and sufficient
- [ ] Results disclaimer is accurate and sufficient

### Technical Implementation

- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables are documented in README
- [ ] Cookie consent banner implemented (if needed)
- [ ] Privacy policy link added to form consent checkbox
- [ ] All policy links tested and functional

## Risk Assessment Summary

| Risk | Severity | Impact | Status | Fix Priority |
|------|----------|--------|--------|--------------|
| EmailJS Public Key Exposure | 🔴 Critical | Security | ❌ Not Fixed | **P0 - Must Fix** |
| Privacy Policy Link Missing | 🔴 Critical | Legal/GDPR | ❌ Not Fixed | **P0 - Must Fix** |
| Cookie Consent Requirements | 🟡 High | Legal (Jurisdiction-Dependent) | ⚠️ Requires Audit | **P1 - Audit First** |
| Environment Variables Docs | 🟡 High | Operational | ❌ Not Fixed | **P1 - Should Fix** |
| Privacy Policy Review | 🟡 High | Legal | ⚠️ Owner Action | **P1 - Owner Review** |
| Terms Review | 🟡 Medium | Legal | ⚠️ Owner Action | **P2 - Owner Review** |
| Testimonials Consent | 🟢 Medium | Legal | ⚠️ Owner Verification | **P2 - Owner Action** |
| Self-Host Fonts | 🟢 Low | Privacy Enhancement | ✅ Optional | **P3 - Nice to Have** |

## Launch Recommendation

**Status**: ⚠️ **CONDITIONAL GO**

**Blockers** (Must fix before launch):
1. EmailJS public key exposure (remove hardcoded fallback)
2. Privacy policy link in form consent checkbox

**Strongly Recommended** (Should fix before launch):
1. Cookie consent audit (verify if needed)
2. Environment variables documentation
3. Privacy/Terms legal review

**Can Deploy But Address Soon**:
- Testimonials consent verification
- Self-host Google Fonts (optional)

## Next Steps

1. **Immediate** (Before launch):
   - Remove EmailJS public key hardcoded fallback
   - Add privacy policy link to form consent checkbox
   - Audit cookies set by third parties

2. **Owner Action** (Legal review):
   - Review privacy policy content
   - Review terms of service content
   - Verify client consent for testimonials/media

3. **Documentation**:
   - Create `.env.example` file
   - Document environment variables in README
   - Update deployment documentation

4. **Optional Enhancements**:
   - Self-host Google Fonts
   - Implement cookie consent banner (if needed)




