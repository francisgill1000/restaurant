<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /** ETA copy per order type, mirroring the prototype's tracking screen. */
    private const ETA = [
        'delivery' => '28 min',
        'pickup'   => '20 min',
        'dine-in'  => 'Kitchen',
    ];

    public function index(Request $request): Response|RedirectResponse
    {
        // Admins manage in the web board; they don't shop.
        if ($request->user()->is_admin) {
            return redirect()->route('admin.orders.index');
        }

        $items = MenuItem::orderBy('sort')->get();

        // Preserve the prototype's category order.
        $order = ['Starters', 'Mains', 'From the Grill', 'Sides', 'Desserts', 'Bar'];
        $categories = $items->pluck('category')->unique()
            ->sortBy(fn ($c) => array_search($c, $order))
            ->values();

        $recent = $request->user()->orders()->with('items')->latest('placed_at')->take(3)->get()
            ->map(fn (Order $o) => $this->presentOrder($o));

        return Inertia::render('Order/Index', [
            'menu' => $items->map(fn (MenuItem $m) => [
                'id'     => $m->ext_id,
                'cat'    => $m->category,
                'name'   => $m->name,
                'desc'   => $m->description,
                'price'  => $m->price,
                'tags'   => $m->tags ?? [],
                'avail'  => $m->available,
                'sold'   => $m->sold,
                'rating' => $m->rating,
            ]),
            'categories'   => $categories,
            'recentOrders' => $recent,
            'config'       => [
                'currency'    => config('maison.currency'),
                'vatRate'     => config('maison.vat_rate'),
                'deliveryFee' => config('maison.delivery_fee'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'          => 'required|in:delivery,pickup,dine-in',
            'items'         => 'required|array|min:1',
            'items.*.id'    => 'required|string|exists:menu_items,ext_id',
            'items.*.qty'   => 'required|integer|min:1|max:50',
            'note'          => 'nullable|string|max:500',
            'address'       => 'nullable|string|max:255',
            'customer_name' => 'nullable|string|max:120',
            'phone'         => 'nullable|string|max:40',
        ]);

        // Re-price everything from the database — never trust client totals.
        $menu = MenuItem::whereIn('ext_id', collect($data['items'])->pluck('id'))
            ->get()->keyBy('ext_id');

        $lines = [];
        $subtotal = 0;
        foreach ($data['items'] as $line) {
            $item = $menu[$line['id']] ?? null;
            if (! $item || ! $item->available) {
                continue;
            }
            $qty = (int) $line['qty'];
            $subtotal += $item->price * $qty;
            $lines[] = [
                'menu_item_id' => $item->id,
                'name'         => $item->name,
                'unit_price'   => $item->price,
                'qty'          => $qty,
            ];
        }

        if (empty($lines)) {
            return back()->with('error', 'None of those items are available right now.');
        }

        $deliveryFee = $data['type'] === 'delivery' ? (int) config('maison.delivery_fee') : 0;
        $vat = (int) round($subtotal * (float) config('maison.vat_rate'));
        $total = $subtotal + $deliveryFee + $vat;

        $user = $request->user();

        $order = Order::create([
            'user_id'       => $user->id,
            'reference'     => Order::nextReference(),
            'customer_name' => $data['customer_name'] ?? $user->name,
            'phone'         => $data['phone'] ?? $user->phone,
            'type'          => $data['type'],
            'status'        => 'new',
            'address'       => $data['address'] ?? null,
            'note'          => $data['note'] ?? null,
            'subtotal'      => $subtotal,
            'delivery_fee'  => $deliveryFee,
            'vat'           => $vat,
            'total'         => $total,
            'eta'           => self::ETA[$data['type']],
            'placed_at'     => Carbon::now(),
        ]);

        $order->items()->createMany($lines);

        return back()->with('placedOrder', $this->presentOrder($order->load('items')));
    }

    private function presentOrder(Order $o): array
    {
        return [
            'reference' => $o->reference,
            'type'      => $o->type,
            'status'    => $o->status,
            'eta'       => $o->eta,
            'address'   => $o->address,
            'note'      => $o->note,
            'subtotal'  => $o->subtotal,
            'delivery'  => $o->delivery_fee,
            'vat'       => $o->vat,
            'total'     => $o->total,
            'placedAt'  => optional($o->placed_at)->format('H:i'),
            'items'     => $o->items->map(fn ($i) => [
                'name'  => $i->name,
                'qty'   => $i->qty,
                'price' => $i->unit_price,
            ]),
        ];
    }
}
