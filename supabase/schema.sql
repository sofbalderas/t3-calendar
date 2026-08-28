-- Transforma 3 · Calendario de contenido
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  cta text default '',
  pillar text not null check (pillar in ('pilar_a', 'pilar_b', 'newsletter')),
  format text not null check (format in ('reel_broll', 'carrusel', 'posteo', 'story', 'email')),
  platform text not null default 'instagram' check (platform in ('instagram', 'tiktok', 'facebook', 'newsletter')),
  status text not null default 'idea' check (status in ('idea', 'para_grabar', 'grabado', 'editado', 'programado', 'publicado')),
  scheduled_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_scheduled_date_idx on public.posts (scheduled_date);
create index if not exists posts_pillar_idx on public.posts (pillar);
create index if not exists posts_platform_idx on public.posts (platform);

-- Mantiene updated_at al día en cada edición
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Habilita Realtime para sincronizar cambios entre dispositivos
alter publication supabase_realtime add table public.posts;

-- Row Level Security
-- Esta app está pensada para uso interno (tú y tu socia), sin login propio,
-- usando la llave anónima. Las políticas abajo permiten lectura/escritura
-- pública con esa llave. Si en algún momento agregas autenticación de
-- Supabase Auth, cambia estas políticas para exigir auth.uid().
alter table public.posts enable row level security;

drop policy if exists "Public read access" on public.posts;
create policy "Public read access"
  on public.posts for select
  using (true);

drop policy if exists "Public insert access" on public.posts;
create policy "Public insert access"
  on public.posts for insert
  with check (true);

drop policy if exists "Public update access" on public.posts;
create policy "Public update access"
  on public.posts for update
  using (true);

drop policy if exists "Public delete access" on public.posts;
create policy "Public delete access"
  on public.posts for delete
  using (true);
