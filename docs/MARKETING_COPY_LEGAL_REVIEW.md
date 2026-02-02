# Marketing Copy Legal Risk Review

**Project**: Gilad Doron - Online Fitness Coaching Landing Page  
**Date**: January 2026  
**Review Type**: Legal-Marketing Risk Assessment

## Final Replacements Completed ✅

### Phone Number Replacement
- **Status**: ✅ **COMPLETED**
- **Replaced**: `052-XXX-XXXX` → `052-8765992` (in 3 locations)
  - Accessibility Statement (`App.tsx:275`)
  - Privacy Policy (`App.tsx:374`)
  - Terms of Use (`App.tsx:476`)

### Email Replacement
- **Status**: ✅ **COMPLETED**
- **Replaced**: `support@giladdoron.co.il` → `gilad042@gmail.com` (in 5 locations)
  - Privacy Policy contact section (`App.tsx:365, 373`)
  - Terms of Use contact section (`App.tsx:446, 449, 475`)

**Confirmation**: ✅ **Phone number and email replacement completed.**

---

## Marketing Copy Legal Risk Review

### Methodology

Reviewed all marketing copy including:
- Hero headlines and subheadlines
- Section headlines and body text
- CTAs (Call-to-Action buttons)
- FAQ answers
- Guarantee section
- About section
- Testimonial text

**Evaluation Criteria**:
- Absolute guarantees (risky)
- Medical/health claims (risky)
- Over-promises that contradict Terms (risky)
- Ambiguous language that could be misinterpreted (medium risk)
- Conditional promises (safer if clear)

---

### Risky Copy Identified

#### 🔴 HIGH RISK - Must Fix

##### 1. FAQ: Absolute "100%" Guarantee
**Location**: `App.tsx:232-236` (FAQ_ITEMS)

**Original Copy**:
```tsx
question: 'בוא נדבר תכלס: אתם באמת מבטיחים תוצאות?',
answer: (
  <div className="space-y-2 text-gray-300">
    <p>כן. ב-100%. אם יישמת את התוכנית ולא הגעת למה שסיכמנו – אני ממשיך ללוות אותך בחינם עד שזה קורה, או שאתה מקבל החזר כספי מלא.</p>
    <p>האחריות על התוצאה היא עלי, לא רק עליך.</p>
  </div>
)
```

**Legal Risk**: 
- "כן. ב-100%" is an absolute guarantee that contradicts Terms (Terms say "לא מבטיחים ולא מתחייבים")
- Creates legal exposure - claimant could point to this as absolute promise
- High risk for false advertising claims

**Safer Alternative**:
```tsx
question: 'בוא נדבר תכלס: אתם באמת מבטיחים תוצאות?',
answer: (
  <div className="space-y-2 text-gray-300">
    <p>אני לוקח אחריות על התהליך. אם יישמת את התוכנית במלואה ולא הגעת למטרות שסיכמנו עליהן מראש – אני ממשיך ללוות אותך בחינם עד השגת המטרות, או שאתה מקבל החזר כספי מלא, לפי בחירתך.</p>
    <p>האחריות שלי היא על התהליך והליווי, בתנאי שאתה עומד בתהליך שסיכמנו עליו. התוצאות משתנות מאדם לאדם ותלויות בגורמים רבים (ראה תקנון השימוש).</p>
  </div>
)
```

**Rationale**: 
- Removes absolute "100%" claim
- Clarifies it's a conditional process guarantee, not result guarantee
- Aligns with Terms disclaimer about individual results
- Maintains strong commitment without absolute promise

**Risk Level**: High → Low (after fix)

---

##### 2. Guarantee Section: "אם לא הבאתי לך תוצאות"
**Location**: `App.tsx:2676` (guarantee section headline)

**Original Copy**:
```
אני לא צריך את הכסף שלך – אם לא הבאתי לך תוצאות.
```

**Legal Risk**:
- "אם לא הבאתי לך תוצאות" could be interpreted as absolute promise of results
- Does not clarify "subject to you following the program"
- Could create liability exposure if interpreted as unconditional guarantee

**Safer Alternative**:
```
אני לא צריך את הכסף שלך – אם לא הגענו יחד לתוצאה שסיכמנו עליה מראש.
```

**Rationale**:
- Changes from "I didn't bring you results" (suggests absolute promise) to "we didn't reach the goal we agreed on together" (conditional, collaborative)
- Emphasizes "agreed goal" and "together" - makes it clear it's a conditional agreement
- Maintains marketing strength while reducing legal risk

**Risk Level**: Medium → Low (after fix)

---

##### 3. Results Section: "התוצאה שלך – האחריות שלי"
**Location**: `App.tsx:2398` (proof section)

**Original Copy**:
```
התוצאה שלך – האחריות שלי.
```

**Legal Risk**:
- "התוצאה שלך – האחריות שלי" is too absolute
- Suggests unconditional responsibility for results
- Contradicts Terms which say "לא מבטיחים תוצאות"

**Safer Alternative**:
```
התהליך שלך – האחריות שלי.
```

**Rationale**:
- Changes from "results" responsibility to "process" responsibility
- Aligns with Terms (guarantee is on process/loyalty, not results)
- Maintains strong commitment while being legally defensible
- Same marketing impact (still shows responsibility)

**Risk Level**: Medium → Low (after fix)

---

#### 🟡 MEDIUM RISK - Should Fix

##### 4. About Section: "אם תעבוד לפי התוכנית ולא תראה תוצאות"
**Location**: `App.tsx:2608` (about section promise)

**Original Copy**:
```
אני לא מוכר הבטחות ריקות. אני מוכר תהליך. אם תעבוד לפי התוכנית ולא תראה תוצאות - אני איתך עד שזה קורה.
```

**Legal Risk**:
- "אני איתך עד שזה קורה" could be interpreted as absolute promise that results will happen
- "לא תראה תוצאות" is ambiguous - what timeframe? what defines "results"?
- Needs clarification about conditional nature

**Safer Alternative**:
```
אני לא מוכר הבטחות ריקות. אני מוכר תהליך. אם תעבוד לפי התוכנית במלואה ולא תגיע למטרות שסיכמנו עליהן מראש – אני איתך עד שנגיע יחד למטרות, או שאתה מקבל החזר כספי מלא, לפי בחירתך.
```

**Rationale**:
- Clarifies "agreed goals" instead of vague "results"
- Adds "full refund option" to match Terms
- Emphasizes "together" and "agreed upon" (conditional)
- Makes timeframe clearer (until we reach agreed goals, not "until it happens" indefinitely)

**Risk Level**: Medium → Low (after fix)

---

##### 5. Diagnosis Section: "תהליך אחד מדוייק שמביא תוצאות"
**Location**: `App.tsx:2382` (diagnosis section CTA)

**Original Copy**:
```
אם אתה רוצה תהליך אחד מדוייק שמביא תוצאות, אני כאן.
```

**Legal Risk**:
- "מביא תוצאות" could be interpreted as guaranteed results
- Does not clarify individual variation

**Safer Alternative**:
```
אם אתה רוצה תהליך אחד מדוייק שמוביל לתוצאות, אני כאן.
```

**Rationale**:
- Changes from "מביא תוצאות" (brings results - absolute) to "מוביל לתוצאות" (leads to results - directional, not guaranteed)
- Maintains marketing strength
- Small change but legally safer

**Risk Level**: Low-Medium → Low (after fix)

---

##### 6. Guarantee Section: "אני לוקח אחריות על תוצאה שסיכמנו עליה מראש"
**Location**: `App.tsx:2682` (guarantee section body)

**Original Copy**:
```
אני לוקח אחריות על תוצאה שסיכמנו עליה מראש — ביחד.
```

**Legal Risk**:
- "אחריות על תוצאה" could be interpreted as absolute guarantee
- Needs clarification that it's conditional on user adherence

**Safer Alternative**:
```
אני לוקח אחריות על התהליך והליווי כדי להגיע למטרות שסיכמנו עליהן מראש — ביחד.
```

**Rationale**:
- Changes from "responsibility for results" to "responsibility for process and loyalty to reach agreed goals"
- Emphasizes conditional nature (agreed goals, together)
- Aligns with Terms language
- Maintains strong commitment

**Risk Level**: Low-Medium → Low (after fix)

---

#### 🟢 LOW RISK - Minor Adjustments

##### 7. About Section: "ונשארות איתך לתמיד"
**Location**: `App.tsx:2604` (about section description)

**Original Copy**:
```
אני בונה מערכות חיים שמייצרות גוף חזק — ונשארות איתך לתמיד.
```

**Legal Risk**:
- "לתמיד" is hyperbolic but not legally risky (marketing puffery)
- Low risk, but could be slightly more realistic

**Safer Alternative** (Optional):
```
אני בונה מערכות חיים שמייצרות גוף חזק — ונשארות איתך לטווח הארוך.
```

**Rationale**:
- "לטווח הארוך" is more realistic than "לתמיד"
- Still strong marketing language
- Minor adjustment, low priority

**Risk Level**: Low → Low (optional fix)

---

##### 8. FAQ: "דיאטות כאסח נכשלות ב-100% מהמקרים"
**Location**: `App.tsx:226` (FAQ answer)

**Original Copy**:
```
ממש לא. דיאטות כאסח נכשלות ב-100% מהמקרים בטווח הארוך.
```

**Legal Risk**: 
- "100%" claim could be challenged (is there evidence for this?)
- However, this is about diets in general, not about this service, so lower risk
- Could be slightly softened

**Safer Alternative** (Optional):
```
ממש לא. דיאטות כאסח נוטות להיכשל ברוב המקרים בטווח הארוך.
```

**Rationale**:
- Changes absolute "100%" to "tend to fail in most cases"
- More defensible (general statement about crash diets)
- Still makes the point without absolute claim

**Risk Level**: Low → Low (optional fix)

---

### ✅ SAFE COPY (No Changes Needed)

The following copy is safe and does not need changes:

1. **Hero Section**:
   - "מתאמן כבר חודשים והגוף מסרב להשתנות?" ✅ (Question, not claim)
   - "השאר פרטים לבדיקת התאמה קצרה וללא התחייבות" ✅ (Safe)

2. **Diagnosis Section**:
   - "אתה עובד 'קשה' במקום לעבוד 'נכון'" ✅ (Safe comparison)
   - "בלי התהליך הנכון גם עבודה קשה לא מביאה תוצאות" ✅ (General statement, not absolute)

3. **Results Section**:
   - "אנשים רגילים שהחליטו להפסיק לנחש ולהתחיל לראות תוצאות" ✅ (Safe, past tense)

4. **Testimonials**:
   - Client quotes are testimonials (past experience) ✅ (Safe)
   - "תוצאות לפני ואחרי" labels ✅ (Safe, factual)

5. **Steps Section**:
   - "4 צעדים לתוצאה" ✅ (Directional, not absolute)
   - Step descriptions ✅ (Process-focused, not result-focused)

6. **FAQ Answers** (Other than #1):
   - All other FAQ answers are safe ✅
   - No absolute guarantees
   - Conditional language used

---

## Recommended Fixes Summary

### Must Fix (High Priority)

| # | Location | Risk | Fix Type | Status |
|---|----------|------|----------|--------|
| 1 | FAQ "100%" answer | High | Wording change | ❌ Not fixed |
| 2 | Guarantee headline | High | Wording change | ❌ Not fixed |
| 3 | Results "אחריות שלי" | Medium | Wording change | ❌ Not fixed |

### Should Fix (Medium Priority)

| # | Location | Risk | Fix Type | Status |
|---|----------|------|----------|--------|
| 4 | About section promise | Medium | Clarification | ❌ Not fixed |
| 5 | Diagnosis CTA | Medium | Minor wording | ❌ Not fixed |
| 6 | Guarantee body text | Medium | Clarification | ❌ Not fixed |

### Optional (Low Priority)

| # | Location | Risk | Fix Type | Status |
|---|----------|------|----------|--------|
| 7 | "לתמיד" claim | Low | Minor wording | ⚠️ Optional |
| 8 | FAQ "100% diets" | Low | Minor wording | ⚠️ Optional |

---

## Implementation Plan

**Status**: Ready for implementation. All risky copy identified with safer alternatives provided.

**Action Required**: Apply wording changes to reduce legal exposure while maintaining marketing strength.

**Estimated Impact**: 
- Legal Risk: High → Low (after fixes)
- Marketing Impact: Minimal (maintains strong commitment language)
- User Experience: No negative impact

---

## Final Verdict

**Current Status**: ⚠️ **LEGALLY RISKY** - Several absolute guarantees contradict Terms

**After Recommended Fixes**: ✅ **LEGALLY SAFE** - All guarantees properly conditional, aligned with Terms

**Recommendation**: Apply all 6 "Must Fix" and "Should Fix" items before launch.





