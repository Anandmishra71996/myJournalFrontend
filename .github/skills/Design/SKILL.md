# Design System Strategy: Editorial Depth & Tonal Layering

## 1. Overview & Creative North Star
**Creative North Star: The Midnight Archive**

This design system is built to transform a standard productivity tool into a premium, reflective sanctuary. Unlike typical "flat" dashboards that rely on harsh borders and rigid grids, this system utilizes **Tonal Layering** and **Luminous Accents** to create a sense of focused calm.

The aesthetic mimics high-end editorial digital design—think luxury watch catalogs or boutique portfolio sites—where depth is felt rather than seen through lines. By leveraging the deep charcoal base against vibrant violet frequencies, we move away from a "utility" feel toward an "experience." We embrace intentional asymmetry in card layouts and prioritize "negative space as a component" to allow the user’s thoughts (the journal content) to breathe.

---

## 2. Colors: The Obsidian Palette
The palette is rooted in a deep-sea charcoal (`#0c0e10`), providing a high-contrast foundation for the high-energy primary purple.

### Core Tones
* **Primary (`#b6a0ff` / `#7e51ff`):** Used strictly for focus. These are the "energy" points of the UI.
* **Surface Hierarchy:**
* `surface`: The foundation (`#0c0e10`).
* `surface-container-low`: Primary content sections (`#111416`).
* `surface-container-high`: Interactive cards or modals (`#1d2022`).
* `surface-bright`: Tooltips or momentary highlights (`#292c2f`).

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural separation must be achieved through:
1. **Tonal Shifts:** Placing a `surface-container-low` card atop a `surface` background.
2. **Vertical Rhythm:** Using the Spacing Scale (e.g., `spacing-12` or `spacing-16`) to define boundaries.

### The "Glass & Gradient" Rule
To add a "signature" polish, floating elements (like the 'Add to Desktop' toast or Navigation hovers) should utilize **Glassmorphism**.
* **Backdrop Blur:** `12px - 20px`.
* **Fill:** `surface-container` tokens at 70% opacity.
* **CTA Gradients:** Main buttons should use a subtle linear gradient from `primary_dim` (`#7e51ff`) to `primary` (`#b6a0ff`) at a 135° angle to provide tactile volume.

---

## 3. Typography: Modern Editorial
We use a dual-font system to balance authority with readability.

* **Display & Headline (Manrope):** Chosen for its geometric precision. Use `display-lg` for dashboard welcomes and `headline-sm` for card titles. These should feel bold and intentional.
* **Body & Label (Inter):** The workhorse font. Inter provides maximum legibility for long-form journal entries. Use `body-lg` for the main editor and `label-sm` for secondary metadata.

**Hierarchy Note:** Always lead with high contrast. Use `on_surface` for titles and `on_surface_variant` (60% opacity) for sub-text to create a visual "fade" that guides the eye to the most important information first.

---

## 4. Elevation & Depth
In this design system, elevation is a function of light, not lines.

* **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card nested inside a `surface-container-low` section creates a natural "sunken" effect for data entry, while a `surface-container-highest` card creates a "lifted" feel for templates.
* **Ambient Shadows:** For floating elements (Modals/Popovers), use an ultra-diffused shadow:
* `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`
* The shadow should never be pure black; it should feel like an extension of the background.
* **The "Ghost Border" Fallback:** If a container sits on a background of the same tone, use a `Ghost Border`: `outline-variant` (`#46484a`) at **15% opacity**. This provides just enough edge definition for accessibility without breaking the "Midnight Archive" aesthetic.

---

## 5. Components

### Sidebar Navigation
* **Style:** Minimalist icons with `label-md` text.
* **Active State:** Avoid heavy blocks. Use a vertical "pill" indicator in `primary` on the far left, or a `surface-variant` background with a soft `0.5rem` radius.

### Cards (Templates & Entries)
* **Structure:** No dividers. Use `spacing-4` to separate headers from descriptions.
* **Radius:** Always use `rounded-md` (0.75rem) for a modern, friendly feel.
* **Hover:** Shift background from `surface-container-high` to `surface-bright`.

### Progress & Heatmaps
* **Heatmap Cells:** Use a scale from `surface-container-highest` (empty) to `primary` (full).
* **Mood Widgets:** Use tonal backgrounds (e.g., `tertiary_container`) with a high-saturation icon to denote emotional states.

### Form Elements
* **Inputs:** `surface-container-lowest` background. No bottom line; instead, a full-surround `Ghost Border`.
* **Focus State:** A 2px `primary` glow with a 4px blur.
* **Buttons:**
* **Primary:** Gradient fill (`primary_dim` to `primary`).
* **Secondary:** Ghost Border with `on_surface` text.

### Floating AI/Action Chips
* **Visuals:** Utilize the `secondary` purple scale (`#bc8df9`) to distinguish "AI" or "Special" actions from standard "Create" actions. Use `secondary_container` with a `backdrop-blur` for a premium, magical feel.

---

## 6. Do's and Don'ts

### Do:
* **Use Asymmetry:** Place metadata (dates/tags) in the top-right of cards to break the standard left-aligned "template" look.
* **Embrace Deep Space:** Allow large areas of the background (`surface`) to remain empty. It increases the user's focus.
* **Soft Transitions:** Use 200ms easing on all hover states to maintain the "sanctuary" feel.

### Don't:
* **No Pure White:** Never use `#FFFFFF`. The brightest text should be `on_surface` (`#eeeef0`).
* **No Hard Dividers:** Never use a solid line to separate two items in a list. Use a 4px background color shift or `spacing-6`.
* **No Default Shadows:** Avoid the "drop shadow" look that feels like a 2010s web app. If it doesn't look like glowing ambient light, remove it.
* **No Crowding:** If three cards look "busy," increase the spacing to `spacing-8` or `spacing-10`. Priority is peace, not density.