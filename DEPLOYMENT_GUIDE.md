# 🚀 CyberVenom — Deployment & Script Selling Guide

## 📋 Overview

This is a complete, production-ready **Web Tools Platform** built with React + Vite + Supabase.  
Each buyer gets the **same codebase** but connects their **own Supabase project** — so every instance has independent data.

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│     Frontend (React + Vite)     │  ← Same code for everyone
│   Deployed on Vercel/Netlify    │
└──────────────┬──────────────────┘
               │  .env (unique per buyer)
               ▼
┌─────────────────────────────────┐
│     Supabase Project (BaaS)     │  ← Each buyer creates their own
│   Database + Auth + Storage     │
└─────────────────────────────────┘
```

---

## 📦 Step 1: Buyer Creates a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a **free account**
2. Click **"New Project"** → give it a name → set a database password → select a region
3. Wait for the project to finish setting up
4. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xyzabc123.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## 📦 Step 2: Set Up the Database

Go to **Supabase Dashboard → SQL Editor** and run the SQL from the file `database-setup.sql` included with this script.

This creates all 18 tables, RLS policies, functions, and triggers needed.

---

## 📦 Step 3: Configure the `.env` File

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...YOUR_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

Replace the values with your own Supabase project credentials from Step 1.

---

## 📦 Step 4: Create Storage Bucket

In **Supabase Dashboard → Storage**:
1. Click **"New Bucket"**
2. Name it: `admin-uploads`
3. Set it as **Public**

---

## 📦 Step 5: Set the First Admin

After deploying, sign up with your admin email.  
Then go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Replace with your actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-admin-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

Or, to auto-assign admin for a specific email, update the trigger function:

```sql
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  IF NEW.email = 'your-admin-email@example.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
```

---

## 📦 Step 6: Deploy the Frontend

### Option A: Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
4. Deploy!

### Option B: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → Import project
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add the same environment variables
6. Deploy!

### Option C: Any Static Hosting

```bash
npm install
npm run build
# Upload the `dist` folder to your hosting
```

---

## 📦 Step 7: Configure Site Settings

1. Go to `https://your-domain.com/makuadmingowebs99`
2. Login with your admin account
3. Go to **Settings** and customize:
   - Site name, logo, favicon
   - Contact info
   - Social links
   - Admin URL slug (change from default for security)
   - Site domain

---

## 🔒 Security Checklist

- [ ] Change the admin URL slug from default
- [ ] Enable 2FA in Admin → Security
- [ ] Set proper site domain in Settings
- [ ] Don't share your Supabase service_role key
- [ ] Each buyer's data is 100% isolated in their own Supabase project

---

## 🔑 Key Points for Script Sellers

| Item | Shared? | Independent? |
|------|---------|-------------|
| Frontend Code | ✅ Same for all | |
| UI Design | ✅ Same for all | |
| Database | | ✅ Each buyer owns their own |
| Users & Auth | | ✅ Separate per instance |
| Admin Panel | | ✅ Each buyer controls their own |
| Site Settings | | ✅ Stored in buyer's database |
| Tools Content | | ✅ Customizable per instance |
| Subscriptions | | ✅ Independent payment system |

---

## 📁 Files to Deliver to Buyer

```
├── src/                    # All source code
├── public/                 # Static assets
├── supabase/              # Edge functions
├── database-setup.sql     # Database setup script
├── DEPLOYMENT_GUIDE.md    # This guide
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── .env.example           # Template env file
└── ... (all config files)
```

**DO NOT include:**
- `.env` (contains your credentials)
- `node_modules/`
- `dist/`

---

## ❓ FAQ

**Q: Will changing settings on one site affect another?**  
A: No! Each site has its own Supabase database. Changes are 100% isolated.

**Q: Can buyers use Lovable Cloud instead of Supabase?**  
A: The code works with any Supabase-compatible backend. Buyers just need URL + anon key.

**Q: How many tools does the platform include?**  
A: 210+ built-in tools across 12+ categories, plus custom tool upload support.

**Q: Can buyers add their own tools?**  
A: Yes! Through Admin Panel → Custom Tools, they can upload HTML tools.
