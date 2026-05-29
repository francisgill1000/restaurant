# MAISON — Order

Customer-facing food-ordering app for **MAISON** (continental kitchen & bar, DIFC Dubai),
implemented from the Claude Design handoff bundle (`Maison Order.html`).

Stack: **Laravel 13 + Inertia 2 + React 18 + TypeScript + Vite 8**, SQLite, dark + mint
("Eloquent") theme with Geist type — pixel-faithful to the prototype.

Two surfaces behind login:
- **Customer** (mobile SPA) — browse, order, track, profile.
- **Admin** (`/admin/orders`) — the live "Online orders" board: advance orders
  New → Preparing → Ready → Out → Completed.

## Accounts

Seeded from env (`ADMIN_*` / `USER_*`). Locally the defaults are:
- **Admin** — `info@eloquentservice.com` / `1@Ab56ab56` → orders board
- **Customer** — `user@eloquentservice.com` / `password` → ordering app

## Customer screens (single mobile SPA)

- **Home** — hero, order-type selector (delivery/pickup/dine-in), signature dishes carousel, popular list
- **Menu** — category tabs, dish rows with quantity steppers, 86'd (unavailable) state
- **Cart** — line items, live order summary (subtotal / delivery / VAT / total)
- **Checkout** — order type, delivery address, payment, note, totals
- **Track** — ETA hero, animated rider map (delivery), step timeline, confirmed order summary
- **Profile** — loyalty card, recent orders, settings

Floating cart bar + bottom tab bar throughout.

## How it fits together

- `GET /` → `OrderController@index` renders `Pages/Order/Index.tsx` with the menu, categories,
  recent orders and pricing config (VAT 5%, AED 15 delivery).
- `POST /orders` → `OrderController@store` re-prices the cart **server-side** (never trusts the
  client), persists `Order` + `OrderItem`, and flashes the confirmed order so the SPA shows the
  live Track screen. Order references run `MZ-3042`, `MZ-3043`, …

## Run locally

```bash
composer install
npm install
php artisan migrate:fresh --seed   # SQLite menu + sample recent orders
npm run build                      # or: npm run dev  (Vite HMR)
php artisan serve
```

Then open http://127.0.0.1:8000. On desktop the app renders inside a centred phone frame;
on a phone it fills the viewport.

## Tests

```bash
php artisan test --filter=OrderTest
```

Covers page rendering, server-side pricing (delivery + VAT), pickup fee waiver, and validation.

## Design source

Bundle: Claude Design `sale-agent-template` → `project/Maison Order.html` (+ `maison-order.jsx`,
`maison-data.js`, `mobile.css`, `maison-mobile.css`, `styles.css`). The connected web admin
(`Maison.html` "Online orders" board) and the reservation app (`Maison Booking.html`) from the
same bundle are **not** built here — this project is the customer ordering surface only.
