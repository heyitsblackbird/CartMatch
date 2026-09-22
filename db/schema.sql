-------------------------schema.sql-------------------------

create extension if not exists vector;

--------------------------Table: stores---------------------
create table if not exists stores (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    address text,
    lat double precision,
    lng double precision,
    place_id text,
    created_at timestamptz default now()
);

--------------------------Table: products---------------------
create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    brand text,
    description text,
    category text,
    barcode text unique,
    image_url text,
    embedding vector(384),
    created_at timestamptz default now()
);

-------------------------Table: prices-------------------

create table if not exists prices (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    price numeric(10, 2) not null,
    source text not null default 'manual',
    is_representative boolean not null default true,
    recorded_at timestamptz default now()
);

--- Indexes for faster queries
create index if not exists idx_prices_store_id on prices(store_id);
create index if not exists idx_prices_product_id on prices(product_id); 
create index if not exists idx_products_embedding on products using ivfflat (embedding vector_cosine_ops);

--- Row level security policies
alter table stores enable row level security;
alter table products enable row level security;
alter table prices enable row level security;

create policy "Allow read access to all users" on products for select using (true);
create policy "Allow read access to all users" on prices for select using (true);
create policy "Allow read access to all users" on stores for select using (true);
