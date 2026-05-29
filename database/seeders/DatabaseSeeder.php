<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Production-safe: accounts (from env) + the menu catalogue only.
        $this->call([
            UserSeeder::class,
            MenuSeeder::class,
        ]);

        // Demo orders are dev-only — never pollute production.
        if (! app()->isProduction()) {
            $this->call(OrderSeeder::class);
        }
    }
}
