<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Guest
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')->name('logout');

// Authenticated customers
Route::middleware('auth')->group(function () {
    Route::get('/', [OrderController::class, 'index'])->name('order.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
});

// Admin — Online orders board
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/advance', [AdminOrderController::class, 'advance'])->name('orders.advance');
});
