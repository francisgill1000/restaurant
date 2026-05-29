<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('ext_id')->unique();      // m1, m2 … (stable handle used by the client)
            $table->string('category');
            $table->string('name');
            $table->string('description')->nullable();
            $table->unsignedInteger('price');         // whole AED
            $table->json('tags')->nullable();         // ['signature'], ['veg'] …
            $table->boolean('available')->default(true);
            $table->unsignedInteger('sold')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
