<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Credentials come from the environment so prod secrets never live in code.
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'info@eloquentservice.com')],
            [
                'name'              => env('ADMIN_NAME', 'MAISON Admin'),
                'password'          => Hash::make(env('ADMIN_PASSWORD', '1@Ab56ab56')),
                'is_admin'          => true,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => env('USER_EMAIL', 'user@eloquentservice.com')],
            [
                'name'              => env('USER_NAME', 'Francis Gill'),
                'password'          => Hash::make(env('USER_PASSWORD', 'password')),
                'is_admin'          => false,
                'phone'             => '+971 50 11 388',
                'email_verified_at' => now(),
            ],
        );
    }
}
