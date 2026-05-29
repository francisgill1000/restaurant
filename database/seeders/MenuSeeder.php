<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Ported from the MAISON design prototype (maison-data.js).
        $menu = [
            ['m1',  'Starters',        'Steak Tartare',     'Hand-cut beef, capers, quail egg, sourdough', 78,  ['signature'], true,  34, 4.8],
            ['m2',  'Starters',        'Burrata Pugliese',  'Heirloom tomato, basil oil, aged balsamic',   64,  ['veg'],       true,  41, 4.7],
            ['m3',  'Starters',        'Oysters (½ dozen)', 'Fine de claire, mignonette, lemon',           96,  [],            true,  22, 4.6],
            ['m4',  'Starters',        'French Onion Soup', 'Gruyère crouton, caramelised onion, thyme',   52,  [],            false, 18, 4.5],
            ['m5',  'Mains',           'Duck Confit',       'Lyonnaise potato, cherry gastrique',          138, ['signature'], true,  29, 4.9],
            ['m6',  'Mains',           'Risotto Milanese',  'Saffron, bone marrow, parmesan',              112, ['veg'],       true,  26, 4.6],
            ['m7',  'Mains',           'Branzino al Sale',  'Salt-baked sea bass, salsa verde',            156, [],            true,  31, 4.8],
            ['m8',  'From the Grill',  'Lamb Rack',         '8-bone, herb crust, ratatouille',             184, ['signature'], true,  38, 4.9],
            ['m9',  'From the Grill',  'Ribeye 400g',       'Dry-aged, café de Paris butter',              245, [],            true,  44, 4.8],
            ['m10', 'Sides',          'Truffle Fries',     'Parmesan, chive, black truffle',              42,  ['veg'],       true,  88, 4.7],
            ['m11', 'Sides',          'Grilled Asparagus', 'Hollandaise, toasted hazelnut',               46,  ['veg'],       true,  33, 4.4],
            ['m12', 'Desserts',       'Tarte Tatin',       'Caramelised apple, crème fraîche',            56,  ['signature'], true,  47, 4.9],
            ['m13', 'Desserts',       'Affogato',          'Vanilla bean gelato, double espresso',        38,  ['veg'],       true,  52, 4.6],
            ['m14', 'Bar',            'Negroni',           'Gin, Campari, sweet vermouth',                58,  [],            true,  64, 4.7],
            ['m15', 'Bar',            'Champagne (glass)', 'Brut, NV',                                    72,  [],            true,  39, 4.5],
        ];

        foreach ($menu as $sort => $row) {
            [$extId, $cat, $name, $desc, $price, $tags, $avail, $sold, $rating] = $row;

            MenuItem::updateOrCreate(
                ['ext_id' => $extId],
                [
                    'category'    => $cat,
                    'name'        => $name,
                    'description' => $desc,
                    'price'       => $price,
                    'tags'        => $tags,
                    'available'   => $avail,
                    'sold'        => $sold,
                    'rating'      => $rating,
                    'sort'        => $sort,
                ],
            );
        }
    }
}
