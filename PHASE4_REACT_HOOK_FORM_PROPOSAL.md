# Phase 4: react-hook-form + zod Proposal

## ⚠️ PROPOSAL ONLY - DO NOT IMPLEMENT YET

This document proposes the implementation of `react-hook-form` + `zod` for form validation. Implementation should only proceed if **zero UX changes** can be guaranteed.

---

## Current Form Implementation

### Current State Management
- Manual `useState` for each field (`fullName`, `phone`, `email`, `contactPref`, `consent`)
- Manual `useState` for form state (`submitted`, `isSubmitting`, `error`)
- HTML5 `required` validation only
- No client-side validation (phone format, email format, name length)

### Current Error Display
**Location:** Single error block at top of form (lines 950-957)

```tsx
{error && (
  <div id="form-error" className={`mb-4 p-4 rounded-lg border ${isFooter ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`} role="alert" aria-live="assertive">
    <div className={`flex items-center gap-2 ${isFooter ? 'text-red-300' : 'text-red-800'}`}>
      <XCircle size={20} aria-hidden="true" />
      <p className="text-sm font-medium">{error}</p>
    </div>
  </div>
)}
```

**Characteristics:**
- Single error message block
- Appears at top of form
- Shows EmailJS submission errors OR generic errors
- Styled differently for footer vs hero form (`isFooter` prop)

### Current Form Fields
1. **fullName** - Text input, HTML5 `required` only
2. **phone** - Tel input, HTML5 `required` only, placeholder: "050-0000000"
3. **email** - Email input, HTML5 `required` only
4. **contactPref** - Radio buttons (phone/whatsapp), default: 'phone'
5. **consent** - Checkbox, HTML5 `required`

### Current Validation
- **None** - Only HTML5 `required` attributes
- No phone format validation
- No email format validation (browser does basic check)
- No name length validation

---

## Proposed Implementation

### Dependencies to Add
```json
{
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "@hookform/resolvers": "^3.9.1"
}
```

### Zod Schema

```typescript
import { z } from 'zod';

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(50, 'שם לא יכול להכיל יותר מ-50 תווים')
    .regex(/^[\u0590-\u05FF\s]+$/, 'שם חייב להכיל רק אותיות עבריות'),
  phone: z
    .string()
    .regex(/^0[5-9]\d-\d{7}$/, 'מספר טלפון לא תקין. נא להזין בפורמט: 050-1234567'),
  email: z
    .string()
    .email('אימייל לא תקין'),
  contactPref: z.enum(['phone', 'whatsapp']),
  consent: z
    .boolean()
    .refine(val => val === true, 'חובה לאשר את מדיניות הפרטיות')
});

type FormData = z.infer<typeof formSchema>;
```

**Validation Rules:**
- **fullName**: 2-50 chars, Hebrew letters only
- **phone**: Israeli format (050-1234567, 052-1234567, etc.)
- **email**: Valid email format
- **contactPref**: Must be 'phone' or 'whatsapp'
- **consent**: Must be true

### Proposed Form Hook Usage

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const LeadForm: React.FC<{ isFooter?: boolean }> = ({ isFooter = false }) => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError: setFormError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      contactPref: 'phone',
      consent: false
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!window.emailjs) {
        throw new Error('EmailJS לא נטען. אנא רענן את הדף.');
      }

      const templateParams = {
        to_email: RECIPIENT_EMAIL,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        contactPref: data.contactPref === 'phone' ? 'טלפון' : 'וואטסאפ',
        message: `בקשת התאמה חדשה מ-${data.fullName}`,
        date: new Date().toLocaleDateString('he-IL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Form submission error:', err);
      setFormError('root', {
        type: 'manual',
        message: err instanceof Error 
          ? err.message 
          : 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.'
      });
    }
  };

  // ... rest of component
};
```

### Proposed Error Display (CRITICAL: Must Preserve Current UX)

**Option A: Aggregate All Errors into Single Block (RECOMMENDED)**
```tsx
// Aggregate all field errors + root error into single message
const displayError = errors.root?.message || 
  Object.values(errors).find(err => err?.message)?.message || 
  null;

{displayError && (
  <div id="form-error" className={`mb-4 p-4 rounded-lg border ${isFooter ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`} role="alert" aria-live="assertive">
    <div className={`flex items-center gap-2 ${isFooter ? 'text-red-300' : 'text-red-800'}`}>
      <XCircle size={20} aria-hidden="true" />
      <p className="text-sm font-medium">{displayError}</p>
    </div>
  </div>
)}
```

**✅ This preserves current UX:**
- Single error block at top
- Same styling
- Same location
- Same behavior

**Option B: Per-Field Errors (NOT RECOMMENDED - Changes UX)**
```tsx
{errors.fullName && (
  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
)}
```

**❌ This changes UX:**
- Errors appear below each field
- Different visual pattern
- **DO NOT USE THIS APPROACH**

### Proposed Form Fields (Using register)

```tsx
<input 
  {...register('fullName')}
  id="fullName"
  name="name"
  type="text" 
  autoComplete="name"
  disabled={isSubmitting}
  aria-invalid={errors.fullName ? "true" : "false"}
  aria-describedby={errors.fullName ? "form-error" : undefined}
  className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
  placeholder="ישראל ישראלי"
/>
```

**Key Changes:**
- Replace `value={formData.fullName}` and `onChange` with `{...register('fullName')}`
- Replace `disabled={isSubmitting}` with `disabled={isSubmitting}` (same)
- Keep all other props identical

---

## Exact UX Changes Analysis

### ✅ What Stays the Same
1. **Error Display Location** - Single block at top (if using Option A)
2. **Error Display Styling** - Identical classes and structure
3. **Form Layout** - No changes to field order or spacing
4. **Form Styling** - All classes preserved
5. **Success State** - Unchanged
6. **Loading State** - Unchanged (`isSubmitting` from hook)
7. **Form Submission** - Same EmailJS integration
8. **Accessibility** - ARIA attributes preserved

### ⚠️ What Changes (Must Be Zero)
1. **Error Timing** - Currently errors show on submit. With react-hook-form, can show on blur/change (configurable)
2. **Error Messages** - New validation messages (but displayed in same location/style)

**Solution:** Configure `mode: 'onSubmit'` to match current behavior:
```typescript
const { ... } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  mode: 'onSubmit', // Only validate on submit (matches current behavior)
  defaultValues: { ... }
});
```

### ✅ Validation Improvements (No UX Change)
- Phone format validation (Israeli numbers)
- Email format validation (more strict)
- Name length validation
- Hebrew-only name validation (optional)

**These improve UX without changing visual design.**

---

## Implementation Plan

### Files to Touch
1. `package.json` - Add dependencies
2. `App.tsx` - Refactor `LeadForm` component (lines 856-1074)

### Step-by-Step Implementation

1. **Add Dependencies**
   ```bash
   npm install react-hook-form zod @hookform/resolvers
   ```

2. **Create Zod Schema** (at top of App.tsx, after types)
   ```typescript
   import { z } from 'zod';
   import { zodResolver } from '@hookform/resolvers/zod';
   
   const formSchema = z.object({ ... });
   ```

3. **Replace Form State**
   - Remove `useState<FormData>`
   - Add `useForm` hook
   - Configure `mode: 'onSubmit'`

4. **Update Form Fields**
   - Replace `value`/`onChange` with `{...register('fieldName')}`
   - Keep all other props identical

5. **Update Error Display**
   - Use Option A (aggregate errors)
   - Keep exact same JSX structure

6. **Update Submit Handler**
   - Use `handleSubmit(onSubmit)`
   - Keep EmailJS integration identical

7. **Test Thoroughly**
   - All devices
   - All error scenarios
   - Visual regression check

---

## Rollback Plan

### If Implementation Fails or Changes UX

1. **Remove Dependencies**
   ```bash
   npm uninstall react-hook-form zod @hookform/resolvers
   ```

2. **Revert App.tsx**
   - Restore original `LeadForm` component
   - Restore manual `useState` form state
   - Restore original error handling

3. **Git Rollback** (if using version control)
   ```bash
   git checkout HEAD -- App.tsx package.json package-lock.json
   ```

### Rollback Safety
- ✅ No database changes
- ✅ No API changes
- ✅ No build config changes
- ✅ Pure component refactor
- ✅ Can revert in < 5 minutes

---

## Decision Criteria

### ✅ IMPLEMENT IF:
1. Can preserve exact current error display (single block at top)
2. Can preserve exact form layout and styling
3. Can configure validation to only trigger on submit (not on blur/change)
4. No visual regression risk
5. Validation improvements provide clear value

### ❌ DO NOT IMPLEMENT IF:
1. Error display must change (per-field vs single block)
2. Form layout must change
3. Validation timing changes UX (shows errors before submit)
4. Any visual regression risk
5. Current form works well and validation isn't a priority

---

## Verification Checklist (IF Implemented)

### Desktop (Chrome/Firefox/Safari)
- [ ] Form validation works (phone, email, name)
- [ ] Error messages display in same location/style (single block at top)
- [ ] Errors only show on submit (not on blur/change)
- [ ] Form submission works with EmailJS
- [ ] Success state unchanged
- [ ] Loading state unchanged
- [ ] No visual changes to form layout
- [ ] All fields styled identically

### iPhone 13 Pro (Safari)
- [ ] Form displays correctly
- [ ] Touch interactions work
- [ ] Validation works on mobile
- [ ] Error messages readable
- [ ] No layout issues

### iPhone SE (Safari)
- [ ] Form fits on small screen
- [ ] All interactions work
- [ ] No layout issues

### Large iPhone (iPhone 15 Pro Max / Safari)
- [ ] Form displays correctly
- [ ] All interactions work

### Android (Chrome)
- [ ] Form displays correctly
- [ ] Touch interactions work
- [ ] Validation works

### RTL (Hebrew)
- [ ] Form text direction correct (RTL)
- [ ] Error messages in Hebrew
- [ ] No layout issues

### Accessibility
- [ ] ARIA attributes preserved
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors correctly
- [ ] Focus management unchanged

---

## Risk Assessment

### Risk Level: **MEDIUM**

**Why Medium:**
- Requires refactoring entire form component
- Error display must be carefully preserved
- Validation timing must match current behavior
- Multiple form instances (hero + footer) must work identically

**Mitigation:**
- Use Option A for error display (aggregate into single block)
- Configure `mode: 'onSubmit'` to match current behavior
- Preserve all existing props and classes
- Thorough testing on all devices
- Clear rollback plan

---

## Recommendation

### ⚠️ CONDITIONAL RECOMMENDATION

**Implement ONLY if:**
1. You want better form validation (phone format, email format)
2. You can guarantee zero UX changes (using Option A for errors)
3. You're willing to test thoroughly on all devices
4. You have rollback plan ready

**Skip if:**
1. Current form works well
2. Validation isn't a priority
3. Risk of UX changes is unacceptable
4. Time constraints don't allow thorough testing

**Current form is functional.** The main benefit is better validation, not UX improvement. If validation isn't causing issues, this refactor may not be worth the risk.

---

## Next Steps

1. **Review this proposal**
2. **Decide if validation improvements are needed**
3. **If proceeding:**
   - Test error display approach (Option A) in isolation first
   - Implement incrementally (one field at a time)
   - Test on all devices after each change
4. **If not proceeding:**
   - Keep current implementation
   - Consider adding simple validation without refactoring (e.g., phone regex check in current handler)




