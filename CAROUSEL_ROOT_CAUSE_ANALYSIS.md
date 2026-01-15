# Carousel Bug - Root Cause Analysis

## STEP 1: SYMPTOM MAPPING

### Exact Observable Symptoms

**Desktop:**
- Carousel slides change unexpectedly without user interaction
- Cards "jump" or switch positions during or after user swipe
- Carousel appears unstable, with cards flickering between positions
- Active card indicator (dots) updates incorrectly

**Mobile:**
- Same symptoms as desktop
- Additional instability during touch swipe gestures
- Cards may change while user is actively swiping

### When the Bug Occurs

1. **During user swipe** - Cards change mid-swipe
2. **After user swipe completes** - Cards continue changing after user releases
3. **When proof section becomes active** - Carousel auto-centers, then continues changing
4. **During page scroll** - When scrolling to/from proof section
5. **On resize** - Window resize triggers unexpected card changes

### When It Does NOT Occur

- When carousel is not in viewport (proof section not active)
- When user is not interacting with carousel
- Initial page load (before proof section is scrolled into view)

---

## STEP 2: SYSTEMATIC ELIMINATION

### CSS Layout Issues
**Status: UNLIKELY** ❌

**Reasoning:**
- Fixed card widths (`w-[90vw] sm:w-[80vw] md:w-[35%]`)
- Reserved space for images (`aspect-[2/1] md:aspect-[3/2]`)
- CSS scroll-snap is properly configured
- No dynamic height calculations that would cause layout shifts

**Evidence:**
- Cards maintain consistent dimensions
- Layout is stable between renders
- No overflow issues visible

### JavaScript State Issues
**Status: LIKELY** ✅

**Reasoning:**
- Multiple state updates happening in sequence
- `currentClientIndex` state triggers effects that cause scrolls
- IntersectionObserver updates state, which triggers another effect
- Potential for stale state or race conditions

**Evidence:**
- Line 1516: `setCurrentClientIndex(actualIndex)` updates state
- Line 1610-1619: Effect depends on `currentClientIndex` and calls `scrollToCard`
- This creates a feedback loop

### Carousel Library Configuration Issues
**Status: N/A** ❌

**Reasoning:**
- No external carousel library is used
- Pure CSS scroll-snap implementation
- Custom JavaScript logic handles all carousel behavior

### Media-Related Issues
**Status: UNLIKELY** ❌

**Reasoning:**
- Images have reserved space (`aspect-[2/1]`)
- `loading="lazy"` prevents layout shift
- Images don't affect scroll position when loaded

**Evidence:**
- Fixed aspect ratio containers prevent layout shift
- Images load asynchronously without affecting carousel position

### Responsive Breakpoints
**Status: UNLIKELY** ❌

**Reasoning:**
- Card widths are responsive but stable
- No breakpoint-specific logic that would cause state issues
- CSS handles responsive behavior, not JavaScript

### Touch vs Mouse Events
**Status: UNLIKELY** ❌

**Reasoning:**
- No custom touch handlers (removed per comments)
- Native scroll-snap handles both touch and mouse
- Issue occurs on both desktop and mobile equally

---

## STEP 3: ROOT CAUSE IDENTIFICATION

### PRIMARY ROOT CAUSE: Feedback Loop Between IntersectionObserver and useEffect

**Location in Code:**
1. **Lines 1478-1545**: IntersectionObserver detects active card and updates `currentClientIndex`
2. **Lines 1610-1619**: useEffect watches `currentClientIndex` and calls `scrollToCard` when proof section is active

**The Feedback Loop:**

```
User swipes carousel
    ↓
IntersectionObserver detects new active card (line 1516)
    ↓
setCurrentClientIndex(actualIndex) updates state
    ↓
useEffect at line 1610 triggers (depends on currentClientIndex)
    ↓
scrollToCard() is called (line 1615)
    ↓
Programmatic scroll happens
    ↓
IntersectionObserver fires again (may detect different card during scroll)
    ↓
State updates again → Loop continues
```

### SECONDARY ROOT CAUSE: Race Condition with isProgrammaticScrollRef

**Location in Code:**
- **Line 1447-1449**: Flag reset timeout (50ms for non-smooth, 500ms for smooth)
- **Line 1490**: IntersectionObserver callback debounced by 150ms

**The Race Condition:**

```
scrollToCard() called
    ↓
isProgrammaticScrollRef.current = true (line 1437)
    ↓
scrollIntoView() executes
    ↓
After 50ms: Flag reset to false (line 1448)
    ↓
After 150ms: IntersectionObserver callback fires (line 1490)
    ↓
Flag is now false, so observer updates state
    ↓
This triggers the effect again → Loop continues
```

**Why Previous Fixes Failed:**

1. **CSS tweaks** - Didn't address the JavaScript feedback loop
2. **Config changes** - IntersectionObserver threshold/config changes didn't prevent the loop
3. **Debouncing** - 150ms debounce doesn't prevent the race condition (flag resets at 50ms)
4. **isProgrammaticScrollRef flag** - Timing mismatch: flag resets before observer callback fires

### Why Superficial Fixes Had No Effect

- **CSS changes**: The issue is in JavaScript state management, not CSS
- **Library changes**: No library is used, so library config changes don't apply
- **Touch handler removal**: Already done, but didn't fix the core loop
- **Debouncing**: Helps but doesn't solve the timing race condition

---

## STEP 4: PROOF-BASED SOLUTION

### Solution 1: Remove the Feedback Loop (PRIMARY FIX)

**What Should Change:**

Remove `currentClientIndex` from the dependency array of the effect at line 1610-1619. This effect should only run when `activeStage` changes to 'proof', not every time the carousel index changes.

**Current Code (Line 1610-1619):**
```typescript
useEffect(() => {
  if (activeStage !== 'proof' || !carouselRef.current) return;

  const timer = setTimeout(() => {
    const currentCloneIndex = getCloneIndex(currentClientIndex);
    scrollToCard(currentCloneIndex, false);
  }, 200);

  return () => clearTimeout(timer);
}, [activeStage, currentClientIndex]); // ❌ PROBLEM: currentClientIndex dependency
```

**Fixed Code:**
```typescript
useEffect(() => {
  if (activeStage !== 'proof' || !carouselRef.current || !carouselInitialized) return;

  // Only center on first activation, not on every index change
  const timer = setTimeout(() => {
    const currentCloneIndex = getCloneIndex(currentClientIndex);
    scrollToCard(currentCloneIndex, false);
  }, 200);

  return () => clearTimeout(timer);
}, [activeStage]); // ✅ FIXED: Only depends on activeStage
```

**Why This Works:**
- Effect only runs when proof section becomes active, not on every carousel change
- Breaks the feedback loop: IntersectionObserver updates don't trigger re-centering
- User swipes are no longer interrupted by programmatic scrolls

### Solution 2: Fix the Race Condition (SECONDARY FIX)

**What Should Change:**

Increase the `isProgrammaticScrollRef` reset timeout to be longer than the IntersectionObserver debounce delay, OR use a more reliable mechanism to prevent observer updates during programmatic scrolls.

**Current Code (Line 1447-1449):**
```typescript
setTimeout(() => {
  isProgrammaticScrollRef.current = false;
}, smooth ? 500 : 50); // ❌ PROBLEM: 50ms < 150ms debounce
```

**Fixed Code:**
```typescript
// Reset flag after scroll completes AND debounce delay
setTimeout(() => {
  isProgrammaticScrollRef.current = false;
}, smooth ? 500 : 200); // ✅ FIXED: 200ms > 150ms debounce
```

**Why This Works:**
- Flag remains true until after IntersectionObserver callback would fire
- Prevents observer from updating state during programmatic scrolls
- Eliminates race condition

### Solution 3: Add Scroll Completion Detection (ENHANCEMENT)

**What Should Change:**

Instead of using a fixed timeout, detect when scroll actually completes using a scroll event listener or requestAnimationFrame.

**Why This Works:**
- More reliable than fixed timeouts
- Works regardless of scroll duration
- Handles slow devices and fast scrolls equally

---

## STEP 5: VERIFICATION PLAN

### Test Checklist

#### 1. Manual Swipe Test
- [ ] Swipe carousel left/right on mobile
- [ ] Swipe carousel left/right on desktop (mouse drag)
- **Expected**: Cards change smoothly, no unexpected jumps
- **Bug**: Cards continue changing after swipe completes

#### 2. Navigation Button Test
- [ ] Click next/previous arrows
- **Expected**: Carousel moves one card, then stops
- **Bug**: Carousel continues moving after button click

#### 3. Dot Indicator Test
- [ ] Click dot indicators
- **Expected**: Carousel moves to selected card, then stops
- **Bug**: Carousel continues moving after dot click

#### 4. Section Activation Test
- [ ] Scroll page to proof section
- **Expected**: Carousel centers on first card, then remains stable
- **Bug**: Carousel continues changing after centering

#### 5. Resize Test
- [ ] Resize browser window while carousel is visible
- **Expected**: Carousel maintains position, no unexpected changes
- **Bug**: Cards change during/after resize

#### 6. Rapid Interaction Test
- [ ] Rapidly click next/previous buttons
- [ ] Rapidly swipe carousel
- **Expected**: Carousel responds to each interaction, no lag or jumps
- **Bug**: Carousel becomes unresponsive or jumps erratically

### Debug Verification

**Enable Debug Mode:**
```typescript
const CAROUSEL_DEBUG = true; // Line 1416
```

**What to Look For:**
1. Console logs should show active card changes only during user interaction
2. No logs should appear when carousel is idle
3. Logs should match user's intended navigation

**Visual Marker:**
Add a temporary visual indicator to show when programmatic scroll is active:
```typescript
// In scrollToCard function, add:
container.setAttribute('data-programmatic-scroll', 'true');
setTimeout(() => {
  container.removeAttribute('data-programmatic-scroll');
}, smooth ? 500 : 200);
```

Then in CSS:
```css
.carousel-container[data-programmatic-scroll] {
  border: 2px solid red; /* Temporary debug marker */
}
```

**Expected Behavior:**
- Red border should only appear during button/dot clicks
- Red border should NOT appear during user swipes
- Red border should NOT appear when carousel is idle

### Deterministic Reproduction

**Steps to Reproduce Bug (Before Fix):**
1. Load page
2. Scroll to proof section
3. Wait 1 second
4. Observe: Carousel cards change automatically

**Steps to Verify Fix:**
1. Load page
2. Scroll to proof section
3. Wait 5 seconds
4. Observe: Carousel remains stable, no automatic changes
5. Swipe carousel manually
6. Observe: Carousel moves, then stops (no continued movement)

---

## IMPLEMENTATION PRIORITY

1. **HIGH**: Remove `currentClientIndex` from useEffect dependency (Solution 1)
2. **HIGH**: Increase `isProgrammaticScrollRef` timeout (Solution 2)
3. **MEDIUM**: Add scroll completion detection (Solution 3)

---

## SUMMARY

**Root Cause**: Feedback loop between IntersectionObserver state updates and a useEffect that re-centers the carousel, combined with a race condition in the programmatic scroll flag.

**Why Previous Fixes Failed**: They addressed symptoms (CSS, debouncing) but not the core issue (JavaScript state feedback loop).

**The Fix**: Break the feedback loop by removing unnecessary dependencies and fixing the timing race condition.


