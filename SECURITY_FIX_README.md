# Security Fix - What Happened & How to Fix

## What Went Wrong

The original `002_rls_policies.sql` had policies that tried to DROP and recreate policies on `client_services`. This broke your existing admin access.

## Current State

- ✅ Admin portal works (RLS disabled on client_services)
- ❌ Client_services has no security (anyone can see everything)
- ✅ All other tables are secure

## How to Fix When You're Back

### Step 1: Re-enable RLS with Fixed Policies

Run `migrations/002_rls_policies_fixed.sql` in Supabase SQL Editor.

This version:
- Only adds CLIENT policies to client_services (doesn't touch admin)
- Uses simple `auth.role() = 'authenticated'` for admin access
- Secures new tables (invoices, payments, etc.)

### Step 2: Re-enable RLS on client_services

```sql
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
```

### Step 3: Verify Admin Still Works

1. Go to `/admin/clients/[any-client-id]`
2. Check if you can see services
3. If yes ✅ - you're good!
4. If no ❌ - run this to check existing policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'client_services';
```

## Testing Client Portal Access

Once RLS is re-enabled:

1. Create test client user (see PORTAL_README.md)
2. Link to existing client
3. Login at `/portal/login`
4. Verify client can:
   - See ONLY their own services
   - See ONLY their own invoices
   - NOT see other clients' data

## If Something Breaks

**Quick rollback:**
```sql
ALTER TABLE client_services DISABLE ROW LEVEL SECURITY;
```

Admin access restored immediately.

## The Fix Explained

**Old migration (broken):**
- Tried to DROP existing policies
- Tried to enforce admin email whitelist
- Broke your existing admin setup

**New migration (fixed):**
- Only ADDS client policies
- Preserves existing admin policies
- Simple role-based checks instead of email lookups

---

**Status:** Ready to apply when you're back. Admin portal currently working with RLS disabled.
