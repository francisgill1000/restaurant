<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'       => $request->user()->id,
                    'name'     => $request->user()->name,
                    'email'    => $request->user()->email,
                    'is_admin' => $request->user()->is_admin,
                ] : null,
            ],
            'restaurant' => [
                'name'     => config('maison.name', 'MAISON'),
                'tagline'  => config('maison.tagline', 'Continental kitchen & bar'),
                'location' => config('maison.location', 'DIFC · DUBAI'),
                'currency' => config('maison.currency', 'AED'),
                'rating'   => config('maison.rating', 4.8),
                'eta'      => config('maison.eta', '30–40 min'),
                'hours'    => config('maison.hours', 'Open till 1 AM'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'order'   => fn () => $request->session()->get('placedOrder'),
            ],
        ];
    }
}
