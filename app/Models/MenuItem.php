<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'ext_id', 'category', 'name', 'description', 'price',
        'tags', 'available', 'sold', 'rating', 'sort',
    ];

    protected $casts = [
        'tags'      => 'array',
        'available' => 'boolean',
        'price'     => 'integer',
        'sold'      => 'integer',
        'rating'    => 'float',
    ];
}
