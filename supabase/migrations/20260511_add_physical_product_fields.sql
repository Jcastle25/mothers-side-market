-- Migration: add physical product and shipping fields to products and orders
create type if not exists product_type_enum as enum ('digital', 'physical', 'both');

alter table if exists products
  add column if not exists product_type product_type_enum not null default 'digital',
  add column if not exists shipping_price integer,
  add column if not exists shipping_description text,
  add column if not exists stock_quantity integer,
  add column if not exists weight_oz integer;

create type if not exists order_shipping_status_enum as enum ('not_applicable', 'pending', 'shipped', 'delivered');

alter table if exists orders
  add column if not exists shipping_address jsonb,
  add column if not exists shipping_status order_shipping_status_enum not null default 'not_applicable',
  add column if not exists tracking_number text;
