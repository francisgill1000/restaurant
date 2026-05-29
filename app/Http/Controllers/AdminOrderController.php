<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with('items')->latest('placed_at')->latest('id')->get();

        $columns = [];
        foreach (Order::FLOW as $status) {
            $columns[$status] = $orders->where('status', $status)->values()
                ->map(fn (Order $o) => $this->present($o));
        }

        $active = $orders->whereNotIn('status', ['completed']);

        return Inertia::render('Admin/Orders', [
            'columns' => $columns,
            'stats'   => [
                'live'      => $active->count(),
                'new'       => $orders->where('status', 'new')->count(),
                'preparing' => $orders->where('status', 'preparing')->count(),
                'revenue'   => (int) $orders->sum('total'),
                'completed' => $orders->where('status', 'completed')->count(),
            ],
        ]);
    }

    public function advance(Order $order): RedirectResponse
    {
        $next = $order->nextStatus();

        if ($next === null) {
            return back()->with('error', 'Order is already completed.');
        }

        $order->update(['status' => $next]);

        return back()->with('success', "{$order->reference} → ".ucfirst($next));
    }

    private function present(Order $o): array
    {
        return [
            'id'        => $o->id,
            'reference' => $o->reference,
            'customer'  => $o->customer_name,
            'phone'     => $o->phone,
            'type'      => $o->type,
            'status'    => $o->status,
            'next'      => $o->nextStatus(),
            'address'   => $o->address,
            'note'      => $o->note,
            'total'     => $o->total,
            'eta'       => $o->eta,
            'placedAt'  => optional($o->placed_at)->format('H:i'),
            'minsAgo'   => $o->placed_at ? (int) $o->placed_at->diffInMinutes(Carbon::now()) : null,
            'items'     => $o->items->map(fn ($i) => ['name' => $i->name, 'qty' => $i->qty]),
        ];
    }
}
