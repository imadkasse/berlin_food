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