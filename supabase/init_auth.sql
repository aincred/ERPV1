-- Create users table for server-side auth
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text not null,
  role text default 'user',
  full_name text,
  created_at timestamptz default now()
);

-- Example insert (do NOT store plain passwords).
-- Generate a bcrypt hash for desired password locally and replace '<BCRYPT_HASH_HERE>'
-- insert into public.users (email, password_hash, role, full_name) values ('admin@example.com', '<BCRYPT_HASH_HERE>', 'admin', 'Admin User');
