<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $vatRate = (float) config('maison.vat_rate');
        $deliveryFee = (int) config('maison.delivery_fee');
        $customer = User::where('email', env('USER_EMAIL', 'user@eloquentservice.com'))->first();

        // A few historical orders so the Profile screen has real recent activity.
        $samples = [
            ['type' => 'delivery', 'status' => 'completed', 'days' => 3,  'items' => ['m5' => 2]],
            ['type' => 'pickup',   'status' => 'completed', 'days' => 9,  'items' => ['m6' => 2, 'm13' => 2]],
            ['type' => 'delivery', 'status' => 'completed', 'days' => 18, 'items' => ['m3' => 2, 'm15' => 2]],
        ];

        $menu = MenuItem::all()->keyBy('ext_id');

        foreach ($samples as $s) {
            $subtotal = 0;
            $lines = [];
            foreach ($s['items'] as $extId => $qty) {
                $item = $menu[$extId];
                $subtotal += $item->price * $qty;
                $lines[] = [
                    'menu_item_id' => $item->id,
                    'name'         => $item->name,
                    'unit_price'   => $item->price,
                    'qty'          => $qty,
                ];
            }
            $delivery = $s['type'] === 'delivery' ? $deliveryFee : 0;
            $vat = (int) round($subtotal * $vatRate);

            $order = Order::create([
                'user_id'       => $customer?->id,
                'reference'     => Order::nextReference(),
                'customer_name' => $customer?->name ?? 'Francis Gill',
                'phone'         => '+971 50 11 388',
                'type'          => $s['type'],
                'status'        => $s['status'],
                'address'       => $s['type'] === 'delivery' ? 'Index Tower, DIFC · Apt 1204' : 'Pickup · counter',
                'subtotal'      => $subtotal,
                'delivery_fee'  => $delivery,
                'vat'           => $vat,
                'total'         => $subtotal + $delivery + $vat,
                'eta'           => 'Delivered',
                'placed_at'     => Carbon::now()->subDays($s['days']),
            ]);

            $order->items()->createMany($lines);
        }
    }
}
