# Android Chrome Scroll Jump – Investigation Plan

**Goal:** Find why the page jumps/teleports after finger release (momentum) in Android Chrome but not in Instagram in-app browser on Android, then propose one minimal, production-safe fix.

**Constraints:** No code changes or logs until evidence is collected. You are the "hands"; this doc is the script.

---

## A) Minimal setup questions (answer once, then proceed)

1. **Machine for remote debug:** Mac or Windows?
2. **Android device:** Model + Android version (e.g. Pixel 7, Android 14).
3. **Chrome version:** On the phone: Chrome → Menu (⋮) → Settings → About Chrome. Note the version (e.g. 120.0.6099.144).

---

## B) USB debug setup steps

### On the Android device

1. **Developer options:** Settings → About phone → tap "Build number" 7 times until "You are now a developer!" appears.
2. **USB debugging:** Settings → System → Developer options → enable "USB debugging".
3. **Connect:** Plug the phone into the computer with a USB cable.
4. **Allow:** On the phone, when prompted "Allow USB debugging?" for the computer’s RSA key, tap "Allow" (optionally "Always allow").
5. **Chrome on phone:** Open Chrome and go to `https://giladoron.github.io/Gilad-landing-page/`. Leave the tab open.

### On the computer (Chrome)

6. **Inspect:** On the computer, open Chrome and go to `chrome://inspect`.
7. **Find the tab:** Under "Remote Target", find the phone and the tab showing the landing page. Click **inspect**.
8. **DevTools:** A DevTools window opens. Open (or pin) these panels:
   - **Console** (errors/warnings).
   - **Network** (enable "Preserve log" if available).
   - **Performance** (or Performance monitor). Enable "Screenshots" in the Performance recording options if the UI offers it.

### Windows note

If the device does not appear under `chrome://inspect`, install the latest [USB driver](https://developer.android.com/studio/run/oem-usb) for your device and ensure Windows has authorized the device. Use the same "inspect" flow once the target appears.

---

## C) A/B reproduction script

Use the **same** phone and **same** network for both tests.

### Test A – Reproduce in Android Chrome

1. On the phone, open **Chrome** (not Instagram).
2. Go to `https://giladoron.github.io/Gilad-landing-page/`.
3. Scroll down with your finger through 2–3 sections (e.g. hero → diagnosis → proof).
4. **Release** your finger and let the page coast (momentum).
5. Note whether the page **jumps/teleports** to a different position after release. If yes, note roughly which section or part of the page it "lands" on.
6. Repeat 2–3 times (different scroll speeds, different starting sections) to confirm when it happens.

### Test B – Control in Instagram in-app browser

1. On the phone, open **Instagram**.
2. Open a link that goes to `https://giladoron.github.io/Gilad-landing-page/` (e.g. from your profile link or a story).
3. When the in-app browser loads the page, scroll down with your finger through 2–3 sections.
4. **Release** and let momentum continue.
5. Confirm that the page does **not** jump (smooth coast to stop).

Keep DevTools attached for Test A when you capture evidence below. For Test B, if you can’t attach DevTools to the in-app browser, that’s fine; the control is "no jump" behavior.

---

## D) Exact “what to capture” instructions (Test A, with DevTools attached)

Do these **after** you’ve reproduced the jump in Android Chrome (Test A). Have the phone connected and DevTools inspecting the page tab.

### 1) Performance recording (critical)

1. In DevTools, go to the **Performance** tab.
2. Click **Record** (or the record button).
3. On the phone: scroll down through 2–3 sections, then **release** your finger so momentum runs and the jump happens.
4. After the jump has happened, stop the recording in DevTools.
5. Save the recording (e.g. right‑click → Save profile) or take full‑page screenshots of the timeline so we can see:
   - When the finger is released (end of touch).
   - When the jump occurs (large scroll position change in a short time).
   - What runs in between (long tasks, layout/reflow, script, etc.).
6. Note the approximate time from **touch end** to **visible jump** (e.g. "~200 ms later").

### 2) Console

1. Clear the Console.
2. Reproduce again: scroll and release so the jump happens.
3. Copy all Console output (errors and warnings) and save it. Look for:
   - Any errors about layout, scroll, or resize.
   - Warnings from React or the app.

### 3) Network (optional but useful)

1. In **Network**, enable recording and "Preserve log".
2. Reproduce: scroll and release so the jump happens.
3. Around the time of the jump, note whether any new requests finish (e.g. images, fonts, scripts, XHR). If possible, note their timings relative to the jump. This helps test "resource loading causing reflow during momentum".

### 4) Layout / viewport (if possible)

- In DevTools **Elements**, after a jump, check whether `#root`, `#main-content`, or any `[data-snap="true"]` section has changed height or styles compared to before the jump (you can note "no obvious change" if nothing stands out).
- If you have a way to observe **visual viewport** height (e.g. a script or a tool that logs it), note whether the viewport height changes at the moment of the jump (address bar collapse/expand can cause this).

### 5) What to share

- Performance recording (file or screenshots of timeline).
- Console output (full copy).
- Short description: "Jump happens about X ms after release; page lands near section Y."
- Device model, Android version, Chrome version.

---

## E) Hypotheses to evaluate from the evidence

Use the recording, Console, and Network data to decide:

| Hypothesis | What would support it | Why Instagram might not show it |
|------------|------------------------|----------------------------------|
| **Scroll anchoring** | Jump coincides with layout change (ResizeObserver, height change, or reflow). Chrome applies scroll anchoring and "corrects" scroll position after content shifts. | WebView may disable or implement scroll anchoring differently. |
| **Scroll-snap still active** | Despite `(pointer: coarse)` and `scroll-snap-type: none !important`, snap might still run (e.g. different media-query evaluation, or snap on an inner container). Jump looks like a snap to a section. | WebView may ignore or not apply snap on touch. |
| **Address bar resize** | Viewport height changes (e.g. address bar collapse/expand) right when the jump happens. Scroll position is reinterpreted. | In-app browser often has no collapsing address bar. |
| **IO / React updates during momentum** | In the Performance timeline, right before or during the jump: IntersectionObserver callback, React setState (e.g. setActiveStage), or DOM changes (e.g. classList.add('active-section')). | WebView’s compositor or main thread may not run the same callbacks at the same time. |
| **Resource load during momentum** | Network shows images/fonts/XHR completing, or Performance shows layout/paint right when the jump occurs. | Different loading or prioritization in WebView. |
| **Fixed/sticky layer** | A fixed or sticky element (e.g. navbar, progress bar) triggers compositor or layout behavior that Chrome interprets differently after touch end. | Different compositing in WebView. |

**Code context (for whoever interprets the evidence):**

- [index.css](index.css): Scroll-snap is off for `(pointer: coarse)` with `!important` on `html`, `body`, `.stage`, `[data-snap="true"]`, `main`, `#root`. `overflow-anchor: none` is set for coarse pointer.
- [App.tsx](App.tsx): IntersectionObserver for "stage" defers updates on coarse pointer: it waits `SCROLL_IDLE_MS` (350 ms) after last scroll/touchmove before calling `setActiveStage` and adding `active-section` / `guarantee-revealed` classes. So DOM/state updates are delayed but still run ~350 ms after last scroll; if momentum is still ongoing or just ended, that could coincide with the jump.

---

## F) Diagnosis (to be filled after evidence)

**Root cause (plain English):**  
*(One short paragraph: what actually causes the jump, based on the captured data.)*

**Why it happens after release and only in Chrome:**  
*(Chrome vs Instagram WebView: e.g. scroll anchoring, snap, viewport resize, or timing of IO/React updates.)*

---

## G) One fix plan (to be proposed after diagnosis)

**Step-by-step fix (minimal, production-safe):**  
*(Exact file paths and changes; no experiments or debug code.)*

**Why it will not regress:**  
*(Why iOS, Instagram, and desktop remain correct.)*

---

## H) Verification checklist (after fix is applied)

1. **Android Chrome:** Scroll and release in several places; no jump; smooth coast to stop.
2. **Instagram in-app (Android):** Same; no regression.
3. **iOS (Safari/Chrome):** No new jump or scroll glitch.
4. **Desktop (Chrome/Firefox/Safari):** Section scroll-snap (if kept) and smooth scroll still work; journey rail and progress bar update correctly.
5. **General:** Carousel, floating CTA, exit intent, and anchor links still work; no new console errors or a11y regressions.
