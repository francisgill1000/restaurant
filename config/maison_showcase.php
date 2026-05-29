<?php

/*
 | MAISON admin showcase data — floor tables, kitchen tickets, reservations,
 | staff rota and service charts. Ported from the design bundle (maison-data.js)
 | to populate the management pages. Display data, not transactional state.
 */

return [
    'statusMeta' => [
        'available' => ['label' => 'Available', 'color' => '#5d6661'],
        'seated'    => ['label' => 'Seated',    'color' => '#00ffcc'],
        'reserved'  => ['label' => 'Reserved',  'color' => '#60a5fa'],
        'bill'      => ['label' => 'Bill out',  'color' => '#f4b860'],
        'cleaning'  => ['label' => 'Cleaning',  'color' => '#a78bfa'],
    ],

    'tables' => [
        ['id' => 'T1',  'seats' => 2, 'status' => 'seated',    'zone' => 'Window',  'x' => 0.08, 'y' => 0.14, 'guest' => 'Renaud',     'party' => 2, 'server' => 'Mara', 'since' => '19:42', 'course' => 'Mains',    'spend' => 340],
        ['id' => 'T2',  'seats' => 2, 'status' => 'available', 'zone' => 'Window',  'x' => 0.27, 'y' => 0.14],
        ['id' => 'T3',  'seats' => 4, 'status' => 'reserved',  'zone' => 'Window',  'x' => 0.47, 'y' => 0.14, 'guest' => 'Okonkwo',    'party' => 4, 'time' => '20:30'],
        ['id' => 'T4',  'seats' => 4, 'status' => 'seated',    'zone' => 'Window',  'x' => 0.67, 'y' => 0.14, 'guest' => 'Bianchi',    'party' => 3, 'server' => 'Tom',  'since' => '19:10', 'course' => 'Dessert',  'spend' => 612],
        ['id' => 'T5',  'seats' => 6, 'status' => 'bill',      'zone' => 'Center',  'x' => 0.10, 'y' => 0.42, 'guest' => 'Haddad',     'party' => 5, 'server' => 'Mara', 'since' => '18:25', 'course' => 'Bill',     'spend' => 1180],
        ['id' => 'T6',  'seats' => 4, 'status' => 'seated',    'zone' => 'Center',  'x' => 0.32, 'y' => 0.42, 'guest' => 'Petrov',     'party' => 4, 'server' => 'Lina', 'since' => '19:55', 'course' => 'Starters', 'spend' => 280],
        ['id' => 'T7',  'seats' => 4, 'status' => 'cleaning',  'zone' => 'Center',  'x' => 0.54, 'y' => 0.42],
        ['id' => 'T8',  'seats' => 2, 'status' => 'available', 'zone' => 'Center',  'x' => 0.74, 'y' => 0.42],
        ['id' => 'T9',  'seats' => 8, 'status' => 'seated',    'zone' => 'Private', 'x' => 0.12, 'y' => 0.72, 'guest' => 'Al Futtaim', 'party' => 7, 'server' => 'Tom',  'since' => '20:05', 'course' => 'Mains',    'spend' => 2240],
        ['id' => 'T10', 'seats' => 4, 'status' => 'reserved',  'zone' => 'Private', 'x' => 0.40, 'y' => 0.72, 'guest' => 'Schmidt',    'party' => 4, 'time' => '21:00'],
        ['id' => 'T11', 'seats' => 2, 'status' => 'seated',    'zone' => 'Bar',     'x' => 0.66, 'y' => 0.72, 'guest' => 'Walk-in',    'party' => 2, 'server' => 'Lina', 'since' => '20:18', 'course' => 'Drinks',   'spend' => 190],
        ['id' => 'T12', 'seats' => 2, 'status' => 'available', 'zone' => 'Bar',     'x' => 0.85, 'y' => 0.72],
    ],

    'kitchen' => [
        ['id' => '#0418', 'table' => 'T6',  'server' => 'Lina', 'placed' => '20:31', 'mins' => 3,  'stage' => 'new',     'items' => [['n' => 'Steak Tartare', 'q' => 1, 'note' => 'No capers'], ['n' => 'Burrata', 'q' => 1], ['n' => 'Focaccia', 'q' => 2]]],
        ['id' => '#0417', 'table' => 'T11', 'server' => 'Lina', 'placed' => '20:28', 'mins' => 6,  'stage' => 'new',     'items' => [['n' => 'Negroni', 'q' => 2], ['n' => 'Olives & Almonds', 'q' => 1]]],
        ['id' => '#0415', 'table' => 'T1',  'server' => 'Mara', 'placed' => '20:22', 'mins' => 12, 'stage' => 'cooking', 'items' => [['n' => 'Duck Confit', 'q' => 1], ['n' => 'Risotto Milanese', 'q' => 1, 'note' => 'Extra saffron']]],
        ['id' => '#0414', 'table' => 'T9',  'server' => 'Tom',  'placed' => '20:18', 'mins' => 16, 'stage' => 'cooking', 'items' => [['n' => 'Branzino', 'q' => 2], ['n' => 'Lamb Rack', 'q' => 3, 'note' => 'Med-rare'], ['n' => 'Truffle Fries', 'q' => 2]]],
        ['id' => '#0412', 'table' => 'T4',  'server' => 'Tom',  'placed' => '20:09', 'mins' => 24, 'stage' => 'ready',   'items' => [['n' => 'Tarte Tatin', 'q' => 2], ['n' => 'Affogato', 'q' => 1]]],
        ['id' => '#0411', 'table' => 'T5',  'server' => 'Mara', 'placed' => '20:02', 'mins' => 31, 'stage' => 'ready',   'items' => [['n' => 'Cheese Board', 'q' => 1], ['n' => 'Espresso', 'q' => 4]]],
        ['id' => '#0408', 'table' => 'T9',  'server' => 'Tom',  'placed' => '19:48', 'mins' => 45, 'stage' => 'served',  'items' => [['n' => 'Oysters', 'q' => 12], ['n' => 'Champagne', 'q' => 1]]],
    ],

    'reservations' => [
        ['id' => 'R-2201', 'name' => 'Okonkwo, D.',  'party' => 4, 'time' => '20:30', 'table' => 'T3',  'status' => 'confirmed', 'phone' => '+971 50 22 118', 'tag' => 'Window',  'note' => 'Anniversary'],
        ['id' => 'R-2202', 'name' => 'Schmidt, H.',  'party' => 4, 'time' => '21:00', 'table' => 'T10', 'status' => 'confirmed', 'phone' => '+971 50 44 902', 'tag' => 'Private', 'note' => ''],
        ['id' => 'R-2203', 'name' => 'Carter, J.',   'party' => 2, 'time' => '21:15', 'table' => '—',   'status' => 'waitlist',  'phone' => '+971 55 80 233', 'tag' => 'Bar',     'note' => 'Flexible'],
        ['id' => 'R-2204', 'name' => 'Nakamura, K.', 'party' => 6, 'time' => '21:30', 'table' => 'T5',  'status' => 'confirmed', 'phone' => '+971 52 11 487', 'tag' => 'Center',  'note' => 'VIP · regular'],
        ['id' => 'R-2205', 'name' => 'Dubois, M.',   'party' => 2, 'time' => '21:45', 'table' => 'T2',  'status' => 'pending',   'phone' => '+971 50 67 014', 'tag' => 'Window',  'note' => ''],
        ['id' => 'R-2206', 'name' => 'Al Marri, S.', 'party' => 8, 'time' => '22:00', 'table' => 'T9',  'status' => 'confirmed', 'phone' => '+971 50 90 771', 'tag' => 'Private', 'note' => 'Set menu B'],
        ['id' => 'R-2207', 'name' => 'Ferreira, L.', 'party' => 3, 'time' => '22:15', 'table' => '—',   'status' => 'waitlist',  'phone' => '+971 56 33 290', 'tag' => 'Center',  'note' => ''],
    ],

    'staff' => [
        ['id' => 's1', 'initials' => 'EM', 'name' => 'Étienne Moreau', 'role' => 'Head Chef',     'status' => 'on',    'shift' => '15:00 – 23:30', 'section' => 'Kitchen'],
        ['id' => 's2', 'initials' => 'MA', 'name' => 'Mara Adeyemi',   'role' => 'Senior Server', 'status' => 'on',    'shift' => '17:00 – 01:00', 'section' => 'Window · Center'],
        ['id' => 's3', 'initials' => 'TC', 'name' => 'Tom Castellano', 'role' => 'Server',        'status' => 'on',    'shift' => '17:00 – 01:00', 'section' => 'Private'],
        ['id' => 's4', 'initials' => 'LK', 'name' => 'Lina Kovač',     'role' => 'Server',        'status' => 'on',    'shift' => '18:00 – 02:00', 'section' => 'Bar · Center'],
        ['id' => 's5', 'initials' => 'RB', 'name' => 'Raphael Bianchi', 'role' => 'Sommelier',    'status' => 'on',    'shift' => '18:00 – 00:00', 'section' => 'Floor'],
        ['id' => 's6', 'initials' => 'YS', 'name' => 'Yuki Sato',      'role' => 'Sous Chef',     'status' => 'on',    'shift' => '15:00 – 23:30', 'section' => 'Kitchen'],
        ['id' => 's7', 'initials' => 'OM', 'name' => 'Omar Mansour',   'role' => 'Host',          'status' => 'break', 'shift' => '17:00 – 23:00', 'section' => 'Entrance'],
        ['id' => 's8', 'initials' => 'CD', 'name' => 'Clara Dupont',   'role' => 'Pastry Chef',   'status' => 'off',   'shift' => '08:00 – 16:00', 'section' => 'Kitchen'],
    ],

    'daypart' => [
        ['h' => '17', 'covers' => 12], ['h' => '18', 'covers' => 34], ['h' => '19', 'covers' => 68],
        ['h' => '20', 'covers' => 92], ['h' => '21', 'covers' => 78], ['h' => '22', 'covers' => 46], ['h' => '23', 'covers' => 20],
    ],

    'salesWeek' => [
        ['d' => 'Mon', 'v' => 28], ['d' => 'Tue', 'v' => 32], ['d' => 'Wed', 'v' => 41], ['d' => 'Thu', 'v' => 48],
        ['d' => 'Fri', 'v' => 72], ['d' => 'Sat', 'v' => 88], ['d' => 'Sun', 'v' => 64],
    ],

    'sectionPerformance' => [
        ['name' => 'From the Grill', 'pct' => 92, 'rev' => 142],
        ['name' => 'Mains',          'pct' => 84, 'rev' => 118],
        ['name' => 'Bar',            'pct' => 71, 'rev' => 76],
        ['name' => 'Starters',       'pct' => 64, 'rev' => 52],
        ['name' => 'Desserts',       'pct' => 48, 'rev' => 24],
    ],
];
