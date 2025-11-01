-- Create profiles table and RLS policies for Supabase
-- Run this in your Supabase project's SQL editor.

-- 1) Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  email text unique,
  position text,
  mailing_address text,
  telephone text,
  phone_number text,
  fax text,
  verified boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- 2) RLS
alter table public.profiles enable row level security;

-- 2b) Ensure API roles can access the schema/table (RLS still enforced later)
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

-- Allow users to read their own profile
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- (Optional) Allow insert by the authenticated user for their own row
-- Not strictly needed if you use the trigger below to auto-create profile rows.
drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3) updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Recreate updated_at trigger idempotently
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- (Migration-safe) Ensure phone_number exists, and backfill from legacy telephone if present
alter table public.profiles add column if not exists phone_number text;
update public.profiles
set phone_number = telephone
where phone_number is null and telephone is not null;

-- 4) Auto-create a profile row upon new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  -- Pull values from raw_user_meta_data when available
  insert into public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    mailing_address,
    phone_number,
    fax,
    position,
    verified
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'mailing_address', ''),
    nullif(new.raw_user_meta_data->>'phone_number', ''),
    nullif(new.raw_user_meta_data->>'fax', ''),
    nullif(new.raw_user_meta_data->>'position', ''),
    new.email_confirmed_at is not null
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    mailing_address = coalesce(excluded.mailing_address, public.profiles.mailing_address),
    phone_number = coalesce(excluded.phone_number, public.profiles.phone_number),
    fax = coalesce(excluded.fax, public.profiles.fax),
    position = coalesce(excluded.position, public.profiles.position),
    verified = excluded.verified,
    updated_at = now();
  return new;
end;
$$;

-- Ensure trigger exists on auth.users (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- NOTE: After running this script, if your client still reports
-- "Could not find the table 'public.profiles' in the schema cache (PGRST205)",
-- go to Project Settings > API in Supabase and click "Reset API" to refresh the schema cache.
