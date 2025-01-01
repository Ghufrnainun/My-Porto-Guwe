-- Remove email from profiles table since it's already in auth.users
-- This prevents any possibility of email exposure
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Add author_name column to blog_posts so we don't expose author_id directly
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author_name TEXT;