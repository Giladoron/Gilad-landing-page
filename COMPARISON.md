# Dev vs Prod Comparison

## Summary
- **Dev Version (723cbca):** Mobile fixes + New copy + Some UX changes
- **Prod Version (5a50a6c):** Stable version with original UX/UI

## What to KEEP from Dev

### 1. Mobile Fixes (CSS/Styling) ✅
- New `index.css` file with Tailwind setup
- Mobile responsive classes:
  - Form inputs: `px-3 py-2 md:px-4 md:py-3` (smaller on mobile)
  - Form labels: `text-[10px] md:text-xs` (smaller on mobile)
  - Navbar: `text-lg md:text-2xl`, `px-3 py-1.5 md:px-4 md:py-2`
  - StoryHeader: `mb-2 sm:mb-4 md:mb-6` (better mobile spacing)
- Safe area utilities: `pb-safe`, `pt-safe`, `h-dvh-safe`
- Carousel improvements in CSS
- Better touch targets for mobile

### 2. New Copy (Text Content) ✅
**FAQ Section - All questions and answers rewritten:**
- Q1: "למה זה עובד טוב יותר ממאמן בחדר כושר?" (was: "איך עובד הליווי האונליין?")
- Q2: More direct pricing copy
- Q3: "אין לי הרבה זמן פנוי. זה יתאים לי?" (was: "כמה זמן צריך להשקיע בשבוע?")
- Q4: "חייב חדר כושר או אפשר מהבית?" (was: "איזה ציוד נדרש?")
- Q5: More direct results timeline
- Q6: "מה לגבי התזונה? אצטרך להרעיב את עצמי?" (was: "מה כוללת התזונה בתוכנית?")
- Q7: "איך מתקיים הקשר בינינו?" (was: "איך מתקיים הקשר והמעקב?")

**Hero Section:**
- Heading: "והגוף מסרב להשתנות?" (was: "ולא רואה תוצאות?")
- Subtext: "הבעיה היא לא בכוח הרצון שלך" (was: "זה לא כי אתה צריך להשקיע יותר")

## What to REVERT to Prod (UX/UI Changes)

### 1. Navbar Position ❌
**Dev:** Navbar moved inside hero section
```tsx
// Dev (WRONG)
<section id="hero">
  <Navbar />  // Inside section
</section>

// Prod (CORRECT)
<Navbar />  // Outside, before main
<main>
  <section id="hero">
```

### 2. Hero Section Layout ❌
**Dev changes to revert:**
- `pt-24` → should be `pt-20` (prod)
- `gap-2 md:gap-8` → should be `gap-8` (prod)
- `items-start md:items-center` → should be `items-center` (prod)
- `justify-start md:justify-center` → should be `justify-center` (prod)
- `pb-safe` → remove (prod doesn't have this)
- `w-full` on hero content div → remove (prod)
- `space-y-2 md:space-y-6` → should be `space-y-3 md:space-y-6` (prod)
- `text-2xl md:text-6xl` → should be `text-3xl md:text-6xl` (prod)
- `leading-[1.1] md:leading-[1.2]` → should be `leading-[1.2]` (prod)
- `mt-0` → should be `mt-4 md:mt-0` (prod)
- `compact-heading`, `compact-text` classes → remove (prod doesn't have these)
- `text-base md:text-2xl` → should be `text-lg md:text-2xl` (prod)
- `space-y-1.5 md:space-y-4` → should be `space-y-2 md:space-y-4` (prod)
- `text-sm md:text-xl` → should be `text-base md:text-xl` (prod)
- `hidden md:block` on paragraph → remove (prod shows on all screens)
- `space-y-1 md:space-y-3` → should be `space-y-1.5 md:space-y-3` (prod)
- CheckCircle2 `size={16}` → should be `size={18}` (prod)
- Form container: `w-full flex-1 flex flex-col justify-end pb-2` → should be `delay-100` only (prod)

### 3. StoryHeader Spacing ❌
**Dev:** `mb-2 sm:mb-4 md:mb-6 mt-4 sm:mt-8 md:mt-0 pt-2 sm:pt-4 md:pt-0`
**Prod:** `mb-4 md:mb-6 mt-16 md:mt-0 pt-4 md:pt-0`

### 4. Diagnosis Section ❌
**Dev:** `py-2 md:py-10` and `justify-center pb-safe`
**Prod:** `py-6 md:py-10` and no `justify-center pb-safe`

### 5. Global Parallax Background ❌
**Dev:** Added `<div className="global-parallax-bg" aria-hidden="true" />`
**Prod:** No such div (background handled differently)

### 6. Background Image ❌
**Dev:** Renamed to `bg-global-parallax.jpeg`
**Prod:** `WhatsApp Image 2026-01-13 at 01.29.03.jpeg`

## Files Changed

### Keep from Dev:
- `index.css` (new file - mobile fixes)
- `tailwind.config.js` (new file - Tailwind setup)
- `postcss.config.js` (new file - PostCSS config)
- `package.json` & `package-lock.json` (Tailwind dependencies)
- `App.tsx` (copy changes + mobile responsive classes)

### Revert to Prod:
- `index.html` structure (keep prod's inline CSS approach OR migrate properly)
- `App.tsx` layout/spacing (keep copy, revert UX)

## Recommended Action Plan

1. **Keep mobile fixes** from `index.css` and responsive classes
2. **Keep new copy** from FAQ and Hero sections
3. **Revert UX/UI** changes:
   - Move Navbar back outside hero section
   - Restore prod spacing/padding values
   - Remove `compact-heading`, `compact-text` classes
   - Restore prod text sizes
   - Remove `global-parallax-bg` div
   - Restore prod background image name



