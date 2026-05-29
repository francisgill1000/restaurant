<?php

return [
    'name'     => env('MAISON_NAME', 'MAISON'),
    'tagline'  => 'Continental kitchen & bar',
    'location' => 'DIFC · DUBAI',
    'currency' => 'AED',
    'rating'   => 4.8,
    'eta'      => '30–40 min',
    'hours'    => 'Open till 1 AM',

    // VAT applied at checkout (UAE standard rate).
    'vat_rate' => 0.05,
    // Flat delivery fee (AED) for delivery orders.
    'delivery_fee' => 15,
];
