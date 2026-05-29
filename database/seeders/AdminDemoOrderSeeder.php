<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Populates the admin "Online orders" board with realistic live tickets across
 * every status. Ported from the MAISON design bundle's customerOrders. Idempotent
 * (keyed by reference) and safe to run explicitly in any environment.
 */
class AdminDemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $vatRate = (float) config('maison.vat_rate');
        $deliveryFee = (int) config('maison.delivery_fee');
        $menu = MenuItem::all()->keyBy('ext_id');
        $account = User::where('email', env('USER_EMAIL', 'user@eloquentservice.com'))->first();

        $samples = [
            ['ref' => 'MZ-3041', 'type' => 'delivery', 'status' => 'new',       'cust' => 'Francis Gill',     'phone' => '+971 50 11 388', 'mins' => 2,  'eta' => '40 min', 'addr' => 'Index Tower, DIFC · Apt 1204', 'note' => 'Med-rare. Leave at door.', 'items' => ['m8' => 1, 'm10' => 2, 'm14' => 2]],
            ['ref' => 'MZ-3040', 'type' => 'pickup',   'status' => 'new',       'cust' => 'Sara Khan',        'phone' => '+971 55 80 233', 'mins' => 7,  'eta' => '25 min', 'addr' => 'Pickup · counter', 'note' => '', 'items' => ['m5' => 1, 'm12' => 1]],
            ['ref' => 'MZ-3038', 'type' => 'dine-in',  'status' => 'preparing', 'cust' => 'Table 6 · Petrov', 'phone' => '',               'mins' => 14, 'eta' => 'Kitchen', 'addr' => 'Table 6 · Center', 'note' => 'No capers on tartare.', 'items' => ['m1' => 1, 'm2' => 1, 'm7' => 2]],
            ['ref' => 'MZ-3036', 'type' => 'delivery', 'status' => 'preparing', 'cust' => 'Omar Mansour',     'phone' => '+971 52 11 487', 'mins' => 27, 'eta' => '15 min', 'addr' => 'Burj Daman · Apt 808', 'note' => '', 'items' => ['m9' => 1, 'm11' => 1]],
            ['ref' => 'MZ-3034', 'type' => 'pickup',   'status' => 'ready',     'cust' => 'Lena Petrova',     'phone' => '+971 56 33 290', 'mins' => 37, 'eta' => 'Now', 'addr' => 'Pickup · counter', 'note' => '', 'items' => ['m6' => 2, 'm13' => 2]],
            ['ref' => 'MZ-3030', 'type' => 'delivery', 'status' => 'out',       'cust' => 'David Okonkwo',    'phone' => '+971 50 90 771', 'mins' => 63, 'eta' => '5 min', 'addr' => 'Gate Village 4 · Office 12', 'note' => 'Call on arrival.', 'items' => ['m3' => 2, 'm15' => 2]],
            ['ref' => 'MZ-3024', 'type' => 'delivery', 'status' => 'completed', 'cust' => 'Maya Haddad',      'phone' => '+971 50 67 014', 'mins' => 90, 'eta' => 'Delivered', 'addr' => 'Liberty House · Apt 503', 'note' => '', 'items' => ['m5' => 2]],
        ];

        foreach ($samples as $s) {
            $subtotal = 0;
            $lines = [];
            foreach ($s['items'] as $extId => $qty) {
                $item = $menu[$extId] ?? null;
                if (! $item) {
                    continue;
                }
                $subtotal += $item->price * $qty;
                $lines[] = ['menu_item_id' => $item->id, 'name' => $item->name, 'unit_price' => $item->price, 'qty' => $qty];
            }
            $delivery = $s['type'] === 'delivery' ? $deliveryFee : 0;
            $vat = (int) round($subtotal * $vatRate);

            $order = Order::updateOrCreate(
                ['reference' => $s['ref']],
                [
                    'user_id'       => $s['cust'] === 'Francis Gill' ? $account?->id : null,
                    'customer_name' => $s['cust'],
                    'phone'         => $s['phone'] ?: null,
                    'type'          => $s['type'],
                    'status'        => $s['status'],
                    'address'       => $s['addr'],
                    'note'          => $s['note'] ?: null,
                    'subtotal'      => $subtotal,
                    'delivery_fee'  => $delivery,
                    'vat'           => $vat,
                    'total'         => $subtotal + $delivery + $vat,
                    'eta'           => $s['eta'],
                    'placed_at'     => Carbon::now()->subMinutes($s['mins']),
                ],
            );

            $order->items()->delete();
            $order->items()->createMany($lines);
        }
    }
}
