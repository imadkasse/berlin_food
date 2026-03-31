# Design System Document: Berlin Food

## 1. Overview & Creative North Star: "The Urban Alchemist"
The creative north star for this design system is **The Urban Alchemist**. Berlin is a city defined by the intersection of gritty industrial history and avant-garde refinement. This system must reflect that duality: the precision of high-end gastronomy meeting the raw, spacious energy of a Berlin loft.

To move beyond "standard" UI, we abandon the rigid, boxed-in web. We embrace **intentional asymmetry**, where large editorial type bleeds off-center, and **tonal depth**, where elements float on layers of warm neutrals rather than being trapped by lines. We are not building a database; we are curating a digital gallery of culinary craft.

---

## 2. Colors: Tonal Sophistication
Our palette moves away from stark blacks and whites toward a "human" minimalism. The warmth of the accent color (#F27121) should be used like a garnish—sparingly, but with high impact.

### Color Logic
*   **Primary (#9F4200) & Container (#F27121):** These represent the heat of the kitchen. Use `primary` for high-action states and `primary_container` for hero accents.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Definition must be achieved through background shifts. For example, a `surface_container_low` card sitting on a `surface` background provides all the "edge" a premium interface needs.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    *   Base: `surface` (#FCF9F8)
    *   Mid-ground: `surface_container_low` (#F6F3F2)
    *   Interactive/Floating: `surface_container_highest` (#E5E2E1)
*   **Signature Textures:** For primary CTAs, do not use flat fills. Use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide a "glow" that feels alive.

---

## 3. Typography: Editorial Authority
We use **Plus Jakarta Sans** across all scales to maintain a clean, modern European aesthetic. The secret to this system is the extreme contrast between `display` and `body` scales.

*   **Display (L/M/S):** These are your "hooks." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines. Do not center-align; use left-aligned, asymmetrical placement to create movement.
*   **Headline & Title:** Use these for section headers. They provide the structural rhythm of the page.
*   **Body (LG/MD/SM):** Set `body-lg` with a generous line-height (1.6) to ensure the reading experience feels effortless and premium.
*   **Label:** Use `label-md` in all-caps with increased letter-spacing (+0.05em) for category tags or "Berlin Food" metadata.

---

## 4. Elevation & Depth: The Layering Principle
Shadows in this system are not "darkness"; they are "depth."

*   **Tonal Layering:** Priority 1 for depth. Place a `surface_container_lowest` (#FFFFFF) element on a `surface_container` (#F0EDED) background. This "Soft Lift" is the hallmark of the system.
*   **Ambient Shadows:** When an element must float (e.g., a floating navigation bar), use a shadow with a 40px blur and 4% opacity, using the `on_surface` color as the tint. It should feel like a soft glow, not a drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at 15% opacity. Never use 100% opaque lines.
*   **Glassmorphism:** For overlays or mobile menus, use `surface` at 80% opacity with a `backdrop-filter: blur(20px)`. This allows the vibrant food photography to bleed through the UI, maintaining a sense of place.

---

## 5. Components: Fluidity & Form

### Buttons & Interaction
*   **Primary Button:** Rounded `full` (9999px). No border. Gradient fill (Primary to Primary Container). High-contrast `on_primary` text.
*   **Secondary/Ghost:** `surface_container_high` background. No border. These should feel like they are recessed into the page.
*   **Interactive States:** On hover, buttons should scale slightly (1.02x) rather than just changing color.

### Cards & Lists
*   **The "No Divider" Rule:** Forbid the use of divider lines in lists. Use `spacing-6` (2rem) of vertical white space or a subtle shift to `surface_container_low` to separate items.
*   **Cards:** Use `rounded-lg` (2rem) for all food-related cards. Images should always be top-aligned with no internal padding to the container edges, creating a "window" effect.

### Input Fields
*   **Text Inputs:** Use a `surface_container_low` fill with a `rounded-md` (1.5rem) corner. The label should sit 0.5rem above the field in `label-md`, never inside as placeholder text.

### Signature Component: The "Chef’s Plating" Carousel
Instead of a standard horizontal scroll, use staggered heights for images in the carousel to mimic the asymmetrical plating of a modern Berlin restaurant.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme white space. If you think there is enough room, add 20% more.
*   **Do** use the `primary_container` (#F27121) for micro-interactions, like a custom cursor or a loading progress bar.
*   **Do** lean into the "Round Eight" philosophy. Every corner should feel soft and intentional.

### Don't:
*   **Don't** use pure black (#000000). Use `on_surface` (#1C1B1B) for all dark elements to maintain the "warm minimalist" feel.
*   **Don't** crowd the layout. If a screen feels "busy," remove a container and use typography scale to define the hierarchy instead.
*   **Don't** use standard Material Design "elevated" shadows. They feel too "tech" and not enough "culinary." Stick to tonal shifts.