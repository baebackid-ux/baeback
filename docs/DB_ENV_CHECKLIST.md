# DB & Env Checklist

1. Backup current Supabase database before applying migrations.
2. Environment variables required for local dev:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY` (if using Resend for email)
   - `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET` (if enabling Google OAuth)
3. Migrations to apply (drafts in `supabase/migrations`):
   - `202606130001_baeback_mvp.sql` (base)
   - `202606280001_add_notifications_latlng_tags_tsvector.sql` (notifications, tags, search_vector)
4. RLS checks: ensure policies for new tables (`notifications`, `item_tags`, `tags`) are correct.
5. Edge Functions: plan functions for email sending and background tasks.
6. Post-migration QA:
   - Verify indexes created (GIN for `search_vector`).
   - Run sample queries for admin stats and search.
   - Check storage bucket policies for `item-images` and `avatars`.
