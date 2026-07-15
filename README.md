# SOULS Media Group

Marketing site and booking platform for SOULS Media Group — premium video production and creative media.

## Stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **Video hosting:** Supabase Storage (`category-reels` bucket)

## Local development

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Environment variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon/publishable key>
VITE_SUPABASE_PROJECT_ID=<project id>
```

## Build

```bash
npm run build
```

Output is generated in `dist/`.
