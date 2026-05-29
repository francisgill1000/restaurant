import { SVGProps } from 'react';

type IconProps = { size?: number; fill?: string } & Omit<SVGProps<SVGSVGElement>, 'fill'>;

/** Stroke-based line icon factory, ported from the prototype's `MI` set. */
function lineIcon(paths: string[], fillable = false) {
    return function Icon({ size = 18, fill = 'none', ...rest }: IconProps) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={fillable ? fill : 'none'}
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                {...rest}
            >
                {paths.map((d, i) => (
                    <path key={i} d={d} />
                ))}
            </svg>
        );
    };
}

export const Home = lineIcon(['M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z']);
export const Eye = lineIcon(['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z']);
export const Bag = lineIcon(['M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z', 'M9 8V6a3 3 0 0 1 6 0v2']);
export const User = lineIcon(['M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M4 21a8 8 0 0 1 16 0']);
export const Plus = lineIcon(['M12 5v14', 'M5 12h14']);
export const Minus = lineIcon(['M5 12h14']);
export const ChevR = lineIcon(['M9 5l7 7-7 7']);
export const ChevL = lineIcon(['M15 5l-7 7 7 7']);
export const Check = lineIcon(['M4 12l5 5L20 7']);
export const X = lineIcon(['M6 6l12 12', 'M18 6L6 18']);
export const Star = lineIcon(['M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z'], true);
export const Clock = lineIcon(['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2']);
export const Pin = lineIcon(['M12 22s-7-7.6-7-13a7 7 0 0 1 14 0c0 5.4-7 13-7 13z', 'M12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z']);
export const Bike = lineIcon(['M5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M9 15l3-7h4', 'M12 8l2 7']);
export const Wallet = lineIcon(['M21 12V8a2 2 0 0 0-2-2H5a2 2 0 0 1 0-4h14v4', 'M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6']);
export const Heart = lineIcon(['M12 21C5 16 3 12 3 8.5 3 5.4 5.4 3 8.5 3c1.7 0 3.1.8 3.5 2 .4-1.2 1.8-2 3.5-2C18.6 3 21 5.4 21 8.5 21 12 19 16 12 21z'], true);
export const Bell = lineIcon(['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z', 'M10 21a2 2 0 0 0 4 0']);
export const Receipt = lineIcon([
    'M5 3v18l2-1.5L9 21l1.5-1.5L12 21l1.5-1.5L15 21l2-1.5V3l-2 1.5L13.5 3 12 4.5 10.5 3 9 4.5 7 3z',
    'M8 9h8',
    'M8 13h8',
]);

/** The MAISON glyph mark. */
export function MaisonMark({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <path d="M16 3l11 6v14l-11 6L5 23V9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M12 11v5a4 4 0 0 0 8 0v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="16" y1="16" x2="16" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}
