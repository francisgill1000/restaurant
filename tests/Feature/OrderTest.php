<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Database\Seeders\MenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $customer;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuSeeder::class);

        $this->customer = User::create([
            'name' => 'Francis Gill', 'email' => 'user@example.com',
            'password' => Hash::make('password'), 'is_admin' => false,
        ]);
        $this->admin = User::create([
            'name' => 'Admin', 'email' => 'admin@example.com',
            'password' => Hash::make('secret'), 'is_admin' => true,
        ]);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/')->assertRedirect('/login');
        $this->post('/orders', [])->assertRedirect('/login');
    }

    public function test_customer_sees_ordering_page_with_menu(): void
    {
        $this->actingAs($this->customer)->get('/')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Order/Index')
                ->has('menu', 15)
                ->where('menu.0.name', 'Steak Tartare')
                ->has('categories', 6)
                ->where('config.deliveryFee', 15)
                ->where('auth.user.name', 'Francis Gill')
            );
    }

    public function test_admin_is_redirected_from_shop_to_board(): void
    {
        $this->actingAs($this->admin)->get('/')->assertRedirect(route('admin.orders.index'));
    }

    public function test_customer_places_a_delivery_order_priced_server_side(): void
    {
        $this->actingAs($this->customer)->post('/orders', [
            'type'  => 'delivery',
            'items' => [['id' => 'm8', 'qty' => 1], ['id' => 'm10', 'qty' => 2]],
        ])->assertRedirect();

        $order = Order::with('items')->latest('id')->first();

        $this->assertSame($this->customer->id, $order->user_id);
        $this->assertSame('MZ-3042', $order->reference);
        $this->assertSame(268, $order->subtotal);
        $this->assertSame(15, $order->delivery_fee);
        $this->assertSame(13, $order->vat);
        $this->assertSame(296, $order->total);
        $this->assertCount(2, $order->items);
    }

    public function test_pickup_orders_have_no_delivery_fee(): void
    {
        $this->actingAs($this->customer)->post('/orders', [
            'type'  => 'pickup',
            'items' => [['id' => 'm5', 'qty' => 1]],
        ])->assertRedirect();

        $order = Order::latest('id')->first();
        $this->assertSame(0, $order->delivery_fee);
        $this->assertSame(145, $order->total);
    }

    public function test_order_validation_rejects_empty_or_invalid_items(): void
    {
        $this->actingAs($this->customer)->post('/orders', ['type' => 'delivery', 'items' => []])
            ->assertSessionHasErrors('items');

        $this->actingAs($this->customer)->post('/orders', [
            'type' => 'delivery', 'items' => [['id' => 'nope', 'qty' => 1]],
        ])->assertSessionHasErrors('items.0.id');
    }

    public function test_only_admins_can_open_the_board(): void
    {
        $this->actingAs($this->customer)->get('/admin/orders')->assertForbidden();

        $this->actingAs($this->admin)->get('/admin/orders')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Admin/Orders')->has('columns')->has('stats'));
    }

    public function test_admin_can_advance_an_order_through_its_lifecycle(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id, 'reference' => 'MZ-3042',
            'customer_name' => 'Francis Gill', 'type' => 'delivery', 'status' => 'new',
            'subtotal' => 100, 'delivery_fee' => 15, 'vat' => 5, 'total' => 120,
        ]);

        $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/advance")->assertRedirect();
        $this->assertSame('preparing', $order->fresh()->status);

        $this->actingAs($this->admin)->post("/admin/orders/{$order->id}/advance");
        $this->assertSame('ready', $order->fresh()->status);
    }

    public function test_customers_cannot_advance_orders(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id, 'reference' => 'MZ-3042',
            'customer_name' => 'Francis Gill', 'type' => 'delivery', 'status' => 'new',
            'subtotal' => 100, 'delivery_fee' => 15, 'vat' => 5, 'total' => 120,
        ]);

        $this->actingAs($this->customer)->post("/admin/orders/{$order->id}/advance")->assertForbidden();
        $this->assertSame('new', $order->fresh()->status);
    }
}
