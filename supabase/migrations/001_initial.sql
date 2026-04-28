-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  thi_score integer,
  thi_answers jsonb,
  frequency_hz integer,
  tinnitus_duration text,
  tinnitus_sounds text[],
  tinnitus_impacts text[],
  hearing_loss text,
  stress_level integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily check-in logs
create table if not exists public.daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  loudness integer,
  distress integer,
  sleep_quality integer,
  stress integer,
  triggers text[],
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- THI assessments (track over time)
create table if not exists public.thi_assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer not null,
  answers jsonb not null,
  taken_at timestamptz default now()
);

-- Therapy sessions
create table if not exists public.therapy_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_date date not null,
  duration_minutes integer,
  sounds_used text[],
  notes text,
  created_at timestamptz default now()
);

-- Chat messages
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.thi_assessments enable row level security;
alter table public.therapy_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Policies: users can only access their own data
create policy "profiles: own" on public.profiles for all using (auth.uid() = id);
create policy "daily_logs: own" on public.daily_logs for all using (auth.uid() = user_id);
create policy "thi_assessments: own" on public.thi_assessments for all using (auth.uid() = user_id);
create policy "therapy_sessions: own" on public.therapy_sessions for all using (auth.uid() = user_id);
create policy "chat_messages: own" on public.chat_messages for all using (auth.uid() = user_id);
