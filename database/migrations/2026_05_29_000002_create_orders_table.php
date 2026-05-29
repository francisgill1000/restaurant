<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();    // MZ-3042
            $table->string('customer_name');
            $table->string('phone')->nullable();
            $table->string('type');                   // delivery | pickup | dine-in
            $table->string('status')->default('new'); // new | preparing | ready | out | completed
            $table->string('address')->nullable();
            $table->text('note')->nullable();
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('delivery_fee')->default(0);
            $table->unsignedInteger('vat')->default(0);
            $table->unsignedInteger('total');
            $table->string('eta')->nullable();
            $table->timestamp('placed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
