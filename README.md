# CartMatch

**CartMatch is a grocery price comparison app: enter what you need to buy, and find where it's cheapest.**

Grocery prices vary a lot between stores, but comparing them means flipping through flyers and websites. CartMatch aims to put prices from nearby stores (starting with Hamilton, ON) in one place so a shopper can compare a basket of items across stores.

> **Status: work in progress.** The data layer is built; the user-facing app is not yet. See [Progress](#progress).

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) with Row Level Security |
| Semantic search | `pgvector` (384-dimension product embeddings, IVFFlat cosine index) |

## Data Model

Defined in [db/schema.sql](db/schema.sql):

- **stores**: name, address, lat/lng, place ID
- **products**: name, brand, category, barcode, image, and an `embedding vector(384)` column for matching similar product names
- **prices**: links a store and a product to a price, with `source` (e.g. flyer, manual), and a timestamp

Indexes cover the common lookups (prices by store / product, vector similarity). RLS is enabled on every table with public read-only policies.

## Progress

- [x] Next.js + TypeScript + Tailwind + ESLint project setup
- [x] Supabase client and connection test script
- [x] Database schema with pgvector, indexes and RLS policies
- [x] Seed data in [data/](data/): 4 stores, ~43 products, ~93 flyer prices
- [x] CSV parser for seed imports ([scripts/imports/parseCsv.ts](scripts/imports/parseCsv.ts))
- [x] Row validation for prices, products and stores ([scripts/imports/validateRow.ts](scripts/imports/validateRow.ts)) with typed results ([src/types/](src/types))

## Getting Started

```bash
npm install
```

Create a `.env` file with your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Run [db/schema.sql](db/schema.sql) in the Supabase SQL editor, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
cartmatch/
├── data/            # Seed CSVs (stores, products, prices)
├── db/schema.sql    # Postgres schema, indexes, RLS
├── scripts/         # CSV parsing, validation, connection test
└── src/
    ├── app/         # Next.js routes
    ├── lib/supabase # Supabase client
    └── types/       # Product, Store, Price types
```
