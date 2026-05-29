import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bag, Bell, Calendar, Chart, ChefHat, ChevR, Dashboard, Filter, Menu as MenuIcon,
    MaisonMark, Search, Settings, Table2, Users, Utensils,
} from '@/Components/MaisonIcons';
import {
    AdminData, Floor, Kitchen, MenuAdmin, Overview, Reports, Reservations, SettingsPage, StaffPage,
} from '@/Components/Admin/AdminSections';

type OrderType = 'delivery' | 'pickup' | 'dine-in';
type Status = 'new' | 'preparing' | 'ready' | 'out' | 'completed';

type AdminOrder = {
    id: number; reference: string; customer: string; phone: string | null;
    type: OrderType; status: Status; next: Status | null;
    address: string | null; note: string | null; total: number; eta: string | null;
    placedAt: string | null; minsAgo: number | null; items: { name: string; qty: number }[];
};

type PageProps = AdminData & {
    columns: Record<Status, AdminOrder[]>;
    stats: { live: number; new: number; preparing: number; revenue: number; completed: number };
    auth: { user: { name: string; email: string } | null };
    flash?: { success?: string | null; error?: string | null };
};

const BOARD: { key: Status; title: string; color: string; advance: string }[] = [
    { key: 'new', title: 'New', color: '#f4b860', advance: 'Accept' },
    { key: 'preparing', title: 'Preparing', color: '#60a5fa', advance: 'Mark ready' },
    { key: 'ready', title: 'Ready', color: '#00ffcc', advance: 'Hand off' },
    { key: 'out', title: 'Out / pickup', color: '#a78bfa', advance: 'Complete' },
];

const NAV = [
    { id: 'overview', label: 'Overview', Icon: Dashboard },
    { id: 'orders', label: 'Online orders', Icon: Bag },
    { id: 'floor', label: 'Floor plan', Icon: Table2, live: true },
    { id: 'kitchen', label: 'Kitchen', Icon: ChefHat },
    { id: 'reservations', label: 'Reservations', Icon: Calendar },
    { id: 'menu', label: 'Menu', Icon: Utensils },
    { id: 'staff', label: 'Staff', Icon: Users },
    { id: 'reports', label: 'Reports', Icon: Chart },
] as const;

const fmt = (n: number) => 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

export default function AdminOrders() {
    const props = usePage<PageProps>().props;
    const { columns, stats, auth, flash } = props;
    const data: AdminData = {
        menu: props.menu, categories: props.categories, statusMeta: props.statusMeta,
        tables: props.tables, kitchen: props.kitchen, reservations: props.reservations,
        staff: props.staff, daypart: props.daypart, salesWeek: props.salesWeek,
        sectionPerformance: props.sectionPerformance,
    };
    const [section, setSection] = useState<string>('orders');
    const [drawer, setDrawer] = useState(false);

    const advance = (o: AdminOrder) => router.post(`/admin/orders/${o.id}/advance`, {}, { preserveScroll: true });
    const logout = () => router.post('/logout');
    const nav = (id: string) => { setSection(id); setDrawer(false); };

    const activeOrders = BOARD.flatMap((c) => columns[c.key] ?? []);
    const deliveryCount = activeOrders.filter((o) => o.type === 'delivery').length;

    const sectionLabel = NAV.find((n) => n.id === section)?.label ?? 'Settings';

    return (
        <>
            <Head title={section === 'orders' ? 'Online orders' : sectionLabel} />
            <div className={`mz-shell ${drawer ? 'drawer-open' : ''}`}>
                <div className="mz-scrim" onClick={() => setDrawer(false)} />

                <aside className="mz-sidebar">
                    <div className="brand">
                        <div className="brand-mark"><MaisonMark size={20} /></div>
                        <div className="brand-name">MAISON</div>
                    </div>
                    <div className="nav-section-title">Service</div>
                    <div className="nav-items">
                        {NAV.map((it) => (
                            <button key={it.id} className={`nav-item ${section === it.id ? 'active' : ''}`} onClick={() => nav(it.id)}>
                                <span className="nav-icon"><it.Icon size={18} /></span>
                                <span className="nav-label">{it.label}</span>
                                {it.id === 'orders' && stats.new > 0 && <span className="nav-badge">{stats.new}</span>}
                                {'live' in it && it.live && <span className="nav-live" />}
                            </button>
                        ))}
                    </div>
                    <div className="nav-section-title">Account</div>
                    <div className="nav-items">
                        <button className={`nav-item ${section === 'settings' ? 'active' : ''}`} onClick={() => nav('settings')}>
                            <span className="nav-icon"><Settings size={18} /></span>
                            <span className="nav-label">Settings</span>
                        </button>
                    </div>
                    <div className="sidebar-footer">
                        <div className="avatar">{(auth.user?.name ?? 'A').slice(0, 2).toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auth.user?.name}</div>
                            <button className="nav-item" style={{ padding: 0, fontSize: 11, color: 'var(--text-4)', width: 'auto' }} onClick={logout}>Sign out</button>
                        </div>
                    </div>
                </aside>

                <div className="mz-main">
                    <header className="mz-topbar">
                        <button className="mz-hamburger" onClick={() => setDrawer(true)} aria-label="Menu"><MenuIcon size={18} /></button>
                        <h1>{section === 'orders' ? 'Online orders' : sectionLabel}</h1>
                        {section === 'orders' && <span className="mz-live-pill"><span className="pulse-dot" /> Service live</span>}
                        <div className="mz-topbar-actions">
                            <div className="mz-search"><Search size={14} /><input placeholder="Search orders, guests…" /><kbd>⌘K</kbd></div>
                            <button className="btn btn-ghost btn-icon" aria-label="Notifications"><Bell size={18} /></button>
                        </div>
                    </header>

                    <main className="mz-page">
                        {flash?.success && <div className="mz-flash ok">{flash.success}</div>}
                        {flash?.error && <div className="mz-flash err">{flash.error}</div>}

                        {section === 'orders' ? (
                            <>
                                <div className="page-header">
                                    <div>
                                        <h1 style={{ fontSize: 24 }}>Online orders</h1>
                                        <p>Live customer orders from the app · delivery · pickup · dine-in</p>
                                    </div>
                                    <div className="page-header-actions">
                                        <button className="btn btn-secondary"><Filter size={15} /> All types</button>
                                        <button className="btn btn-primary"><Bag size={15} /> {stats.live} active</button>
                                    </div>
                                </div>

                                <div className="res-stat-row">
                                    <Stat label="Active orders" value={String(stats.live)} delta="live" />
                                    <Stat label="Order revenue" currency="AED" value={fmt(stats.revenue).replace('AED ', '')} delta="tonight" flat />
                                    <Stat label="Delivery" value={String(deliveryCount)} delta="en route" flat />
                                    <Stat label="Completed" value={String(stats.completed)} delta="today" flat />
                                </div>

                                <div className="kds-board">
                                    {BOARD.map((col) => {
                                        const list = columns[col.key] ?? [];
                                        return (
                                            <div key={col.key} className="kds-col">
                                                <div className="kds-col-head">
                                                    <h4><span className="sw" style={{ background: col.color }} />{col.title}</h4>
                                                    <span className="ct">{list.length}</span>
                                                </div>
                                                <div className="kds-cards">
                                                    {list.map((o) => {
                                                        const urgent = (o.minsAgo ?? 0) >= 25 && (o.status === 'new' || o.status === 'preparing');
                                                        return (
                                                            <div key={o.id} className={`kds-ticket ${urgent ? 'urgent' : ''}`}>
                                                                <div className="kds-ticket-head">
                                                                    <span className="oid">{o.reference}</span>
                                                                    <span className={`ord-type t-${o.type}`}>{o.type}</span>
                                                                </div>
                                                                <div style={{ marginBottom: 8 }}>
                                                                    <div className="ord-cust">{o.customer}</div>
                                                                    {o.address && <div className="ord-addr">{o.address}</div>}
                                                                </div>
                                                                {o.items.map((it, i) => (
                                                                    <div key={i} className="kds-item">
                                                                        <span className="q">{it.qty}×</span>
                                                                        <span style={{ flex: 1 }}>{it.name}</span>
                                                                    </div>
                                                                ))}
                                                                {o.note && <div className="ord-note">“{o.note}”</div>}
                                                                <div className="kds-ticket-foot">
                                                                    <span><span className="ord-total">{fmt(o.total)}</span> <span className="ord-eta">· {o.eta}</span></span>
                                                                    <button className="kds-advance" onClick={() => advance(o)}>{col.advance} <ChevR size={12} /></button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {list.length === 0 && <div className="kds-empty">No orders</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : section === 'overview' ? <Overview d={data} onNav={nav} />
                            : section === 'floor' ? <Floor d={data} />
                            : section === 'kitchen' ? <Kitchen d={data} />
                            : section === 'reservations' ? <Reservations d={data} />
                            : section === 'menu' ? <MenuAdmin d={data} />
                            : section === 'staff' ? <StaffPage d={data} />
                            : section === 'reports' ? <Reports d={data} />
                            : <SettingsPage />}
                    </main>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value, currency, delta, flat }: { label: string; value: string; currency?: string; delta?: string; flat?: boolean }) {
    return (
        <div className="stat">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{currency && <span className="currency">{currency}</span>}{value}</div>
            {delta && <div className={`stat-delta ${flat ? 'flat' : 'up'}`}><span>{delta}</span></div>}
        </div>
    );
}
