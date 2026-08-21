<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Berlin Food

## Overview
Berlin Food is  web application for browsing restaurant menus and placing orders.

## Tech Stack
- **Frontend**: Next.js
- **Backend**: Supabase (Auth, Database, etc.)

## Authentication
- Email/Password login
- Google OAuth login
- Managed via Supabase Auth

## App Features
- View restaurant menus
- Place orders
- Order history / My Orders
- User profile settings
- Onboarding flow (personal details, delivery address, account setup)
- Admin features (analytics dashboard, menu management, order management)
- Login (user & admin)

## Design Context

### Users
**Primary:** Hungry customers at home ordering food for delivery. Users are relaxed, likely in the evening, browsing on phone or laptop. They want a seamless, premium experience that makes ordering feel special rather than transactional.

### Brand Personality
**Voice:** Premium, refined, sophisticated
**Tone:** Elegant but approachable - like a curated fine dining experience delivered to your door. The "Urban Alchemist" concept: Berlin's grit meets gastronomic precision.

### Aesthetic Direction
- **Theme:** Both light and dark mode (user-selectable)
- **Primary aesthetic:** "Warm minimalism" - editorial, spacious, with intentional asymmetry
- **Key colors:** Primary #9F4200, Accent #F27121 (warm orange), warm neutrals (no stark blacks/whites)
- **Typography:** Plus Jakarta Sans - clean European editorial feel
- **Key principles:** Tonal layering over borders, generous whitespace, "round eight" soft corners, no dividers - use space instead

### Design Principles
1. **Tonal depth over borders** - Define sections through background shifts, not lines
2. **Editorial typography** - Extreme contrast between display and body text
3. **The "No-Line" rule** - 1px solid borders are prohibited for sectioning
4. **Premium feel through restraint** - Every element must earn its place
5. **Warm minimalism** - No stark blacks (#000) or whites (#fff); always tint toward warmth

## Design Files Location
`docs/Design/` contains:
- `admin_analytics_dashboard/`
- `admin_login/`
- `berlin_culinary_minimalist/`
- `berlin_food_admin_menu_management/`
- `berlin_food_admin_order_management/`
- `berlin_food_menu/`
- `berlin_food_my_orders/`
- `berlin_food_profile_settings/`
- `onboarding_account_setup/`
- `onboarding_delivery_address/`
- `onboarding_personal_details/`
- `user_login/`