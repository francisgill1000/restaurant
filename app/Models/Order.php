<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** Order lifecycle, in advancing order. */
    public const FLOW = ['new', 'preparing', 'ready', 'out', 'completed'];

    protected $fillable = [
        'user_id', 'reference', 'customer_name', 'phone', 'type', 'status',
        'address', 'note', 'subtotal', 'delivery_fee', 'vat', 'total',
        'eta', 'placed_at',
    ];

    protected $casts = [
        'placed_at'    => 'datetime',
        'subtotal'     => 'integer',
        'delivery_fee' => 'integer',
        'vat'          => 'integer',
        'total'        => 'integer',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The next status in the lifecycle, or null if already completed. */
    public function nextStatus(): ?string
    {
        $i = array_search($this->status, self::FLOW, true);

        return ($i === false || $i >= count(self::FLOW) - 1) ? null : self::FLOW[$i + 1];
    }

    /** Generate the next sequential MAISON order reference (MZ-3042 …). */
    public static function nextReference(): string
    {
        $max = static::query()->pluck('reference')
            ->map(fn ($r) => (int) str_replace('MZ-', '', (string) $r))
            ->max() ?? 3041;

        return 'MZ-'.($max + 1);
    }
}
