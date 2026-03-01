-- Drop existing tables to start fresh
drop table if exists public.email_sync_log cascade;
drop table if exists public.notification_settings cascade;
drop table if exists public.transactions cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  currency text default 'MXN',
  created_at timestamptz default now()
);

-- CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  type text check (type in ('income', 'expense', 'saving', 'investment', 'debt')) not null,
  icon text not null,
  color text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- TRANSACTIONS
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null,
  type text check (type in ('income', 'expense', 'saving', 'investment', 'debt')) not null,
  description text,
  date date default current_date not null,
  is_recurring boolean default false,
  recurrence text check (recurrence in ('daily', 'weekly', 'monthly', 'yearly')),
  source text default 'manual',
  external_id text unique,
  created_at timestamptz default now()
);

-- INDEXES FOR TRANSACTIONS
create index idx_transactions_user on public.transactions(user_id);
create index idx_transactions_date on public.transactions(date desc);
create index idx_transactions_type on public.transactions(type);

-- NOTIFICATION SETTINGS
create table public.notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('weekly_reminder', 'expense_alert', 'transaction_confirm')) not null,
  enabled boolean default true,
  threshold numeric(5,2),
  unique(user_id, type)
);

-- EMAIL SYNC LOG (For webhook n8n duplicates)
create table public.email_sync_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  gmail_message_id text unique not null,
  parsed_transaction_id uuid references public.transactions(id) on delete set null,
  status text check (status in ('success', 'failed', 'skipped')) not null,
  raw_subject text,
  created_at timestamptz default now()
);

-----------------------------------------
-- DASHBOARD SUMMARY VIEW
-----------------------------------------
create or replace view public.dashboard_summary as
select 
  user_id,
  date_trunc('month', date) as month,
  coalesce(sum(amount) filter (where type = 'income'), 0) as income,
  coalesce(sum(amount) filter (where type = 'expense'), 0) as expense,
  coalesce(sum(amount) filter (where type = 'saving'), 0) as saving,
  coalesce(sum(amount) filter (where type = 'investment'), 0) as investment,
  coalesce(sum(amount) filter (where type = 'debt'), 0) as debt,
  (coalesce(sum(amount) filter (where type = 'income'), 0) 
   - coalesce(sum(amount) filter (where type = 'expense'), 0)
   - coalesce(sum(amount) filter (where type = 'debt'), 0)
   + coalesce(sum(amount) filter (where type = 'saving'), 0)
   + coalesce(sum(amount) filter (where type = 'investment'), 0)) as net_balance
from public.transactions
group by user_id, date_trunc('month', date);

-----------------------------------------
-- ROW LEVEL SECURITY (RLS)
-----------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.notification_settings enable row level security;
alter table public.email_sync_log enable row level security;

-- Policies "Users manage own data"
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own or default categories" on public.categories for select using (auth.uid() = user_id or is_default = true);
create policy "Users can insert own categories" on public.categories for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on public.categories for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on public.categories for delete using (auth.uid() = user_id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

create policy "Users can view own notification settings" on public.notification_settings for select using (auth.uid() = user_id);
create policy "Users can insert own notification settings" on public.notification_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own notification settings" on public.notification_settings for update using (auth.uid() = user_id);
create policy "Users can delete own notification settings" on public.notification_settings for delete using (auth.uid() = user_id);

create policy "Users can view own email sync logs" on public.email_sync_log for select using (auth.uid() = user_id);
create policy "Users can insert own email sync logs" on public.email_sync_log for insert with check (auth.uid() = user_id);

-----------------------------------------
-- TRIGGER: Create Profile on User Creation
-----------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Create default notification settings
  insert into public.notification_settings (user_id, type, enabled) values
    (new.id, 'weekly_reminder', true),
    (new.id, 'expense_alert', true),
    (new.id, 'transaction_confirm', true);
    
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-----------------------------------------
-- SEED DATA: Predefined Categories
-----------------------------------------
insert into public.categories (name, type, icon, color, is_default) values
  ('Salario', 'income', 'cash-outline', '#10b981', true),
  ('Freelance', 'income', 'briefcase-outline', '#34d399', true),
  ('Inversiones', 'income', 'trending-up-outline', '#6ee7b7', true),
  
  ('Comida', 'expense', 'fast-food-outline', '#f59e0b', true),
  ('Transporte', 'expense', 'car-outline', '#fbbf24', true),
  ('Renta', 'expense', 'home-outline', '#f97316', true),
  ('Entretenimiento', 'expense', 'game-controller-outline', '#fb923c', true),
  ('Salud', 'expense', 'medkit-outline', '#ef4444', true),
  
  ('Fondo Emergencia', 'saving', 'shield-checkmark-outline', '#6366f1', true),
  ('Vacaciones', 'saving', 'airplane-outline', '#8b5cf6', true),
  
  ('Bolsa/ETFs', 'investment', 'bar-chart-outline', '#0ea5e9', true),
  
  ('Tarjeta Crédito', 'debt', 'card-outline', '#ec4899', true)
on conflict do nothing;
