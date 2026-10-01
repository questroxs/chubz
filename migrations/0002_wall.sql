create table if not exists wall_posts (
  id text primary key,
  handle text not null,
  city text not null,
  body text not null,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists print_jobs (
  id text primary key,
  created_at timestamptz not null default now(),
  slug text not null,
  size text not null,
  color_name text not null,
  back_print boolean not null default false,
  quantity integer not null,
  unit_price integer not null,
  art text
);
