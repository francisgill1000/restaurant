<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_renders(): void
    {
        $this->get('/login')->assertStatus(200)
            ->assertInertia(fn ($p) => $p->component('Auth/Login'));
    }

    public function test_admin_logs_in_and_lands_on_the_board(): void
    {
        User::create([
            'name' => 'Admin', 'email' => 'info@example.com',
            'password' => Hash::make('1@Ab56ab56'), 'is_admin' => true,
        ]);

        $this->post('/login', ['email' => 'info@example.com', 'password' => '1@Ab56ab56'])
            ->assertRedirect(route('admin.orders.index'));

        $this->assertAuthenticated();
    }

    public function test_customer_logs_in_and_lands_on_the_shop(): void
    {
        User::create([
            'name' => 'Francis', 'email' => 'user@example.com',
            'password' => Hash::make('password'), 'is_admin' => false,
        ]);

        $this->post('/login', ['email' => 'user@example.com', 'password' => 'password'])
            ->assertRedirect(route('order.index'));

        $this->assertAuthenticated();
    }

    public function test_bad_credentials_are_rejected(): void
    {
        User::create([
            'name' => 'Francis', 'email' => 'user@example.com',
            'password' => Hash::make('password'), 'is_admin' => false,
        ]);

        $this->post('/login', ['email' => 'user@example.com', 'password' => 'nope'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_users_can_log_out(): void
    {
        $user = User::create([
            'name' => 'Francis', 'email' => 'user@example.com',
            'password' => Hash::make('password'), 'is_admin' => false,
        ]);

        $this->actingAs($user)->post('/logout')->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
