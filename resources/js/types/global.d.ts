import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare global {
    function route(name: string, params?: Record<string, unknown> | string | number): string;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
        restaurant?: {
            name: string;
            tagline: string;
            location: string;
            currency: string;
            rating: number;
            eta: string;
            hours: string;
        };
        [key: string]: unknown;
    }
}

export {};
