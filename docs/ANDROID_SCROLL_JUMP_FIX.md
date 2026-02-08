# Android scroll jump – isolation experiments and fix

## Debug Mode and experiments (current implementation)

- **Flag:** `ANDROID_SCROLL_DEBUG` in [androidScrollDebug.ts](../androidScrollDebug.ts). Set `true` to enable instrumentation; set `false` and remove the module when done.
- **Experiment:** `ANDROID_SCROLL_EXPERIMENT` in the same file: `'A' | 'B' | 'C' | null`. Switch to run each test.

### Instrumentation (when DEBUG is true)

- **Programmatic scroll:** Monkey-patched `Element.prototype.scrollIntoView`, `window.scrollTo`, `window.scrollBy`; each call logs timestamp + stack.
- **Jump detection:** rAF loop logs when `|scrollY - prevScrollY| > 180` in one frame or within 50 ms, with timestamp, scrollY, active section id, and `inMomentum`.
- **Layout shifts:** ResizeObserver on `#root`, `#main-content`, and each `[data-snap="true"]`; logs height changes. `visualViewport.resize` logs viewport height.
- **IO updates:** Every stage observer update logs `stageId`, timestamp, and `inMomentum`.
- **Momentum:** `touchstart` → touching; `touchend` → `inMomentum = true`; scroll idle 250 ms → `inMomentum = false`.

### Running the experiments (in order)

1. **Experiment A:** Set `ANDROID_SCROLL_EXPERIMENT = 'A'`. Deploy or run locally, open on **Android Chrome**, scroll and release (momentum). Check console for `[AndroidScroll] JUMP` and `[AndroidScroll] IO update`.  
   - **If the jump disappears:** Root cause = scroll-snap. Keep the Experiment A CSS as the permanent fix, set `ANDROID_SCROLL_DEBUG = false`, remove instrumentation, remove experiment flags, and fill the “Final answer” below.
2. **Experiment B:** If A did not fix, set `ANDROID_SCROLL_EXPERIMENT = 'B'` (A is off when not `'A'`). Test again on Android.  
   - **If the jump disappears:** Root cause = scroll anchoring. Keep the Experiment B CSS (Android-scoped), remove debug, finalize.
3. **Experiment C:** If B did not fix, set `ANDROID_SCROLL_EXPERIMENT = 'C'`. Test again.  
   - **If the jump disappears:** Root cause = IO/state-driven updates during momentum. Keep the “freeze active-section during momentum” logic, remove debug, finalize.

### Gated CSS (index.css)

- **A:** `html[data-scroll-exp="A"]` (and body, .stage, main, #root) get `scroll-snap-type: none !important` / `scroll-snap-align: none !important`. Attribute set in [androidScrollDebug.ts](../androidScrollDebug.ts) when `ANDROID_SCROLL_EXPERIMENT === 'A'`.
- **B:** `html[data-scroll-exp="B"]` and `.stage`, `[data-snap="true"]` get `overflow-anchor: none` inside `@media (pointer: coarse)`.

---

## Final answer (fill after winning experiment)

### 1. Root cause (plain English)

*(One short paragraph: what caused the jump. Example: “Scroll-snap was still affecting the document on Android despite media queries, so the browser snapped to a section at the end of momentum.”)*

### 2. Proof

*(Which experiment fixed it: A, B, or C. What the logs showed: e.g. no programmatic scroll during jump; jump coincided with ResizeObserver height change; jump occurred while inMomentum true and activeStage updated; etc.)*

### 3. Why Android-only and why after touch release

*(One short paragraph.)*

### 4. Final code changes (exact file paths and diffs/snippets)

*(List the minimal production changes: CSS and/or App.tsx. No debug or experiment flags.)*

### 5. How to test (real Android Chrome)

1. Open the site in Chrome on an Android phone.
2. Scroll with a finger, then **release** and let momentum continue.
3. Repeat in different sections (hero, diagnosis, proof, video, about, guarantee, get, how, waiting, FAQ, action).
4. **Pass:** No jump; scroll coasts to a stop naturally. **Fail:** Page snaps/jumps during or after momentum.

### 6. Regression checklist (iOS + desktop must remain stable)

- **Desktop (Chrome/Firefox/Safari, pointer: fine)**  
  - [ ] Section scroll-snap still works (if kept).  
  - [ ] Journey rail and mobile progress bar reflect active section.  
  - [ ] Smooth scroll on anchor/dot clicks works.

- **iOS (Safari, touch)**  
  - [ ] No new jump when scrolling and releasing.  
  - [ ] Progress bar and journey rail update correctly after scroll stops.  
  - [ ] No new layout shift when expanding FAQ/steps/accordions.

- **General**  
  - [ ] Carousel (proof section) scrolls and centers correctly.  
  - [ ] Floating CTA and Exit Intent CTA scroll to `#action` on click.  
  - [ ] No console errors; no new a11y regressions.
