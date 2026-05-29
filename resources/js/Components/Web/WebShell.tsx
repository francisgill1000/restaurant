import { ReactNode, useState } from 'react';
import { Bell, MaisonMark, Menu as MenuIcon, Search } from '@/Components/MaisonIcons';

export type NavItem = {
    id: string;
    label: string;
    Icon: (p: { size?: number }) => ReactNode;
    badge?: number;
    live?: boolean;
};

type Props = {
    navTitle: string;
    nav: NavItem[];
    active: string;
    onNav: (id: string) => void;
    title: string;
    livePill?: boolean;
    searchPlaceholder?: string;
    actions?: ReactNode;
    user?: { name?: string } | null;
    onLogout?: () => void;
    children: ReactNode;
};

/** Full-screen web shell shared by the admin board and the customer app:
 *  sticky left sidebar + topbar + scrollable content; collapses to a drawer on mobile. */
export default function WebShell({ navTitle, nav, active, onNav, title, livePill, searchPlaceholder, actions, user, onLogout, children }: Props) {
    const [drawer, setDrawer] = useState(false);
    const go = (id: string) => { onNav(id); setDrawer(false); };

    return (
        <div className={`mz-shell ${drawer ? 'drawer-open' : ''}`}>
            <div className="mz-scrim" onClick={() => setDrawer(false)} />

            <aside className="mz-sidebar">
                <div className="brand">
                    <div className="brand-mark"><MaisonMark size={20} /></div>
                    <div className="brand-name">MAISON</div>
                </div>
                <div className="nav-section-title">{navTitle}</div>
                <div className="nav-items">
                    {nav.map((it) => (
                        <button key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`} onClick={() => go(it.id)}>
                            <span className="nav-icon"><it.Icon size={18} /></span>
                            <span className="nav-label">{it.label}</span>
                            {it.badge ? <span className="nav-badge">{it.badge}</span> : null}
                            {it.live ? <span className="nav-live" /> : null}
                        </button>
                    ))}
                </div>
                {user && (
                    <div className="sidebar-footer">
                        <div className="avatar">{(user.name ?? 'A').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            {onLogout && <button className="nav-item" style={{ padding: 0, fontSize: 11, color: 'var(--text-4)', width: 'auto' }} onClick={onLogout}>Sign out</button>}
                        </div>
                    </div>
                )}
            </aside>

            <div className="mz-main">
                <header className="mz-topbar">
                    <button className="mz-hamburger" onClick={() => setDrawer(true)} aria-label="Menu"><MenuIcon size={18} /></button>
                    <h1>{title}</h1>
                    {livePill && <span className="mz-live-pill"><span className="pulse-dot" /> Service live</span>}
                    <div className="mz-topbar-actions">
                        {searchPlaceholder && <div className="mz-search"><Search size={14} /><input placeholder={searchPlaceholder} /><kbd>⌘K</kbd></div>}
                        {actions ?? <button className="btn btn-ghost btn-icon" aria-label="Notifications"><Bell size={18} /></button>}
                    </div>
                </header>
                <main className="mz-page">{children}</main>
            </div>
        </div>
    );
}
