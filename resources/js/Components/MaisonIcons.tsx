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

/* ── Admin shell icons (rect/circle/line glyphs, ported from icons.jsx) ── */
function Svg({ size = 18, children, fill = 'none', ...rest }: { size?: number; children: React.ReactNode; fill?: string } & Omit<SVGProps<SVGSVGElement>, 'fill' | 'children'>) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...rest}>
            {children}
        </svg>
    );
}

export const Dashboard = (p: { size?: number }) => (
    <Svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Svg>
);
export const Table2 = (p: { size?: number }) => (
    <Svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="10" x2="9" y2="20" /><line x1="15" y1="10" x2="15" y2="20" /></Svg>
);
export const ChefHat = (p: { size?: number }) => (
    <Svg {...p}><path d="M6 18h12v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" /><path d="M6 18c-2 0-3.5-1.6-3.5-3.6 0-1.7 1.2-3.1 2.8-3.5A4.2 4.2 0 0 1 12 5.5a4.2 4.2 0 0 1 6.7 5.4c1.6.4 2.8 1.8 2.8 3.5 0 2-1.5 3.6-3.5 3.6" /></Svg>
);
export const Calendar = (p: { size?: number }) => (
    <Svg {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Svg>
);
export const Utensils = (p: { size?: number }) => (
    <Svg {...p}><path d="M5 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2" /><line x1="7" y1="11" x2="7" y2="22" /><path d="M17 2c-1.7 0-3 2-3 5s1 4 2 4v11" /></Svg>
);
export const Users = (p: { size?: number }) => (
    <Svg {...p}><circle cx="9" cy="8" r="4" /><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 4a4 4 0 0 1 0 8" /><path d="M21 21c0-2.5-1.4-4.7-3.5-5.7" /></Svg>
);
export const Chart = (p: { size?: number }) => (
    <Svg {...p}><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-7" /></Svg>
);
export const Settings = (p: { size?: number }) => (
    <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Svg>
);
export const Search = (p: { size?: number }) => (
    <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>
);
export const Filter = (p: { size?: number }) => (
    <Svg {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z" /></Svg>
);
export const Menu = (p: { size?: number }) => (
    <Svg {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></Svg>
);

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
