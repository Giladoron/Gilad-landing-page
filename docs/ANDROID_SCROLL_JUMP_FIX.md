# Android scroll jump – root cause and fix

## Root cause (plain English)

The jump was caused by **CSS scroll snapping** and **IntersectionObserver-driven updates during momentum**. On Android Chrome, the scroll container or its section children could still participate in snap behavior (e.g. due to when snap is evaluated at end of momentum, or media-query edge cases), so after finger release the browser would “settle” onto a snap point and the page would appear to teleport. In addition, the stage IntersectionObserver was updating `activeStage` and DOM classes (e.g. `active-section`) on a 75 ms debounce during momentum; those state/DOM changes can trigger layout or scroll anchoring on Android and contribute to a visible jump.

## Why it happens only on Android and only after finger release

- **Only on Android:** Desktop uses `(pointer: fine)` and keeps scroll-snap by design. iOS and desktop do not show the same “magnet”/teleport; the bug is tied to Android Chrome’s handling of scroll-snap and/or scroll anchoring with touch + momentum.
- **Only after release:** While the finger is down, the user is actively dragging and the browser does not apply “settle to snap point” or the same scroll-correction behavior. Once the finger is lifted, momentum continues and the browser may apply snap or scroll anchoring, which shows up as a jump.

## Exact code locations responsible

| What | File | Location |
|------|------|----------|
| Scroll-snap on container | [index.css](index.css) | `html`: default `scroll-snap-type: none`; `@media (hover: hover) and (pointer: fine)` sets `y proximity`; `@media (pointer: coarse)` forces `none` (lines 6–29). |
| Section snap points | [index.css](index.css) | `.stage`: had unconditional `scroll-snap-align: start` and `scroll-snap-stop: normal` (lines 191–201). |
| Stage / active section updates | [App.tsx](App.tsx) | Single `useEffect` that sets up the stage IntersectionObserver, debounced `setActiveStage`, and `active-section` / `guarantee-revealed` class toggles (lines ~2323–2432). |

## Fix plan (step-by-step)

1. **Disable section scroll-snap on touch/coarse**  
   In `index.css`, make `.stage` use `scroll-snap-align: none` by default so touch devices never get snap points. Apply `scroll-snap-align: start` and `scroll-snap-stop: normal` only inside `@media (hover: hover) and (pointer: fine)` so desktop keeps section snapping.

2. **Guard stage observer on touch**  
   In `App.tsx`, for `(pointer: coarse)`: track “last scroll time” via passive `scroll` and `touchmove` listeners. In the debounced IntersectionObserver callback, if the pointer is coarse and last scroll was less than 350 ms ago, skip the update (to avoid changing DOM/state during momentum). When skipped, schedule a one-time apply after 350 ms so the active section still updates once scroll is idle.

3. **Cleanup**  
   In the same effect’s return, remove the scroll/touch listeners and clear any pending timeouts.

## Code changes (summary)

### index.css

- **`.stage`**  
  - Default: `scroll-snap-align: none` (no snap on touch).  
  - New block: `@media (hover: hover) and (pointer: fine) { .stage { scroll-snap-align: start; scroll-snap-stop: normal; } }` so only desktop has section snap.

### App.tsx

- **Stage observer `useEffect`**  
  - Detect coarse pointer: `isCoarsePointer = window.matchMedia('(pointer: coarse)').matches`.  
  - `lastScrollTime`, `scrollTick`, `scrollIdleApplyTimeout`; passive `scroll` + `touchmove` to keep `lastScrollTime` updated (via rAF).  
  - In the 75 ms debounced callback: if `isCoarsePointer` and `(Date.now() - lastScrollTime) < 350`, skip the update and schedule a single 350 ms timeout to apply the same pending section update.  
  - Cleanup: remove listeners, cancel rAF and timeouts.

## How to test on real Android devices

1. Open the site in **Chrome** on an Android phone.
2. Scroll down the page with a finger, then **lift the finger** and let momentum continue (no tap, no click).
3. Repeat in different sections (hero, diagnosis, proof, video, about, guarantee, get, how, waiting, FAQ, action).
4. **Pass:** No jump or teleport; scroll coasts to a stop naturally.
5. **Fail:** Page visibly “snaps” or jumps to a section boundary or fixed offset during or right after momentum.

## Regression checklist (iOS + desktop must remain stable)

- **Desktop (Chrome/Firefox/Safari, pointer: fine)**  
  - [ ] Section scroll-snap still works (sections can snap into view when scrolling with mouse/trackpad).  
  - [ ] Journey rail (right-side dots) and mobile progress bar still reflect the active section.  
  - [ ] Smooth scroll on anchor/dot clicks still works.

- **iOS (Safari, touch)**  
  - [ ] No new jump or snap when scrolling and releasing; inertial scroll feels normal.  
  - [ ] Progress bar and (on desktop) journey rail still update to the correct section after scroll stops.  
  - [ ] No new layout shift or scroll jump when expanding FAQ/steps/accordions.

- **General**  
  - [ ] Carousel (proof section) still scrolls and centers correctly.  
  - [ ] Floating CTA and Exit Intent CTA still scroll to `#action` on click.  
  - [ ] No console errors; no new accessibility regressions (focus, landmarks).
