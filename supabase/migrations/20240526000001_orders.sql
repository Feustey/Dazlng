-- Table des commandes
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  product text not null,
  amount bigint not null,
  customer_name text not null,
  customer_email text not null,
  customer_address text,
  plan text,
  status text not null check (status in ('pending', 'paid', 'failed')),
  payment_hash text unique,
  payment_request text,
  order_ref text unique,
  paid_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour les recherches fréquentes
create index if not exists orders_customer_email_idx on orders(customer_email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_payment_hash_idx on orders(payment_hash);
create index if not exists orders_order_ref_idx on orders(order_ref);
create index if not exists orders_created_at_idx on orders(created_at);

-- Trigger pour la mise à jour automatique de updated_at
create or replace function update_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_orders_updated_at(); 