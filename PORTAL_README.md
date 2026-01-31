# Client Portal Implementation

## What Was Built

### Database Tables (Run migration first!)
- `client_portal_users` - Links clients to Supabase auth
- `invoices` - Client invoices
- `payments` - Payment records
- `recurring_billing` - Stripe subscription tracking
- `notifications` - System notifications

### Portal Routes (`/portal/*`)
- `/portal/login` - Client login
- `/portal/dashboard` - Overview of services and invoices
- `/portal/services` - View and cancel/pause services
- `/portal/invoices` - View and pay invoices
- `/portal/billing` - Recurring billing management
- `/portal/settings` - Account settings

### API Routes
- `/api/stripe/create-payment-intent` - Generate Stripe payment
- `/api/portal/notify-cancel` - Send notifications on cancel/pause

### Features
✅ Client authentication (email/password)
✅ Service management (view, pause, cancel)
✅ Invoice viewing and payment
✅ Automatic notifications when clients cancel/pause
✅ Updates `is_active` flag on `client_services`
✅ Matches admin portal design (dark theme)

## Setup Steps

### 1. Run Database Migration
Execute `migrations/001_client_portal.sql` in Supabase SQL Editor

### 2. Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

### 3. Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (already added)
```

### 4. Create Portal User
For each client who needs access:
1. Create Supabase auth user (email/password)
2. Link to client:
```sql
INSERT INTO client_portal_users (client_id, user_id)
VALUES ('client-uuid', 'auth-user-uuid');
```

### 5. Test
- Login at `/portal/login`
- Should see client's services and invoices
- Test cancel/pause (sends notification)

## TODO
- [ ] Email delivery system (currently just stores in DB)
- [ ] Stripe webhook handling for payment confirmations
- [ ] Invoice PDF generation
- [ ] Password reset flow
- [ ] Stripe Customer Portal integration (manage cards)

## Notes
- Notifications go to first email in `ADMIN_EMAILS` env var
- `is_active` on `client_services` automatically flips when paused/cancelled
- Design matches admin portal exactly (colors, layout, fonts)
