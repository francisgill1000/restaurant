import { Head, router, usePage } from '@inertiajs/react';
import { Bag, Bike, ChevR, MaisonMark, Receipt } from '@/Components/MaisonIcons';

type OrderType = 'delivery' | 'pickup' | 'dine-in';
type Status = 'new' | 'preparing' | 'ready' | 'out' | 'completed';

type AdminOrder = {
    id: number;
    reference: string;
    customer: string;
    phone: string | null;
    type: OrderType;
    status: Status;
    next: Status | null;
    address: string | null;
    note: string | null;
    total: number;
    eta: string | null;
    placedAt: string | null;
    minsAgo: number | null;
    items: { name: string; qty: number }[];
};

type PageProps = {
    columns: Record<Status, AdminOrder[]>;
    stats: { live: number; new: number; preparing: number; revenue: number; completed: number };
    auth: { user: { name: string; email: string } | null };
    flash?: { success?: string | null; error?: string | null };
};

const COLUMNS: { key: Status; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out', label: 'Out for delivery' },
    { key: 'completed', label: 'Completed' },
];

const STATUS_LABEL: Record<Status, string> = {
    new: 'New', preparing: 'Preparing', ready: 'Ready', out: 'Out', completed: 'Completed',
};

const TYPE_ICON = { delivery: Bike, pickup: Bag, 'dine-in': Receipt } as const;

const fmt = (n: number) => 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

export default function AdminOrders() {
    const { columns, stats, auth, flash } = usePage<PageProps>().props;

    const advance = (o: AdminOrder) => {
        if (!o.next) return;
        router.post(`/admin/orders/${o.id}/advance`, {}, { preserveScroll: true });
    };

    const logout = () => router.post('/logout');

    return (
        <>
            <Head title="Online orders" />
            <div className="adm">
                <header className="adm-top">
                    <div className="adm-brand">
                        <span className="adm-mark"><MaisonMark size={20} /></span>
                        <div>
                            <div className="adm-name">MAISON <span>admin</span></div>
                            <div className="adm-sub">Online orders · live board</div>
                        </div>
                    </div>
                    <div className="adm-top-right">
                        <span className="adm-live"><span className="pulse-dot" /> {stats.live} active</span>
                        <span className="adm-user">{auth.user?.name}</span>
                        <button className="adm-logout" onClick={logout}>Sign out</button>
                    </div>
                </header>

                {flash?.success && <div className="adm-flash ok">{flash.success}</div>}
                {flash?.error && <div className="adm-flash err">{flash.error}</div>}

                <section className="adm-stats">
                    <Stat label="Active orders" value={String(stats.live)} />
                    <Stat label="New" value={String(stats.new)} accent="warn" />
                    <Stat label="Preparing" value={String(stats.preparing)} accent="info" />
                    <Stat label="Completed" value={String(stats.completed)} />
                    <Stat label="Revenue" value={fmt(stats.revenue)} accent="mint" />
                </section>

                <section className="adm-board">
                    {COLUMNS.map((col) => {
                        const list = columns[col.key] ?? [];
                        return (
                            <div key={col.key} className="adm-col">
                                <div className={`adm-col-head s-${col.key}`}>
                                    <span className="dot" />
                                    <span className="t">{col.label}</span>
                                    <span className="c">{list.length}</span>
                                </div>
                                <div className="adm-col-body">
                                    {list.length === 0 && <div className="adm-empty">Nothing here</div>}
                                    {list.map((o) => {
                                        const TypeIcon = TYPE_ICON[o.type];
                                        return (
                                            <article key={o.id} className="adm-card">
                                                <div className="adm-card-head">
                                                    <span className="ref">{o.reference}</span>
                                                    <span className={`type-badge t-${o.type}`}><TypeIcon size={12} /> {o.type}</span>
                                                </div>
                                                <div className="adm-cust">{o.customer}</div>
                                                {o.address && <div className="adm-addr">{o.address}</div>}
                                                <ul className="adm-items">
                                                    {o.items.map((it, i) => (
                                                        <li key={i}><span className="q">{it.qty}×</span> {it.name}</li>
                                                    ))}
                                                </ul>
                                                {o.note && <div className="adm-note">“{o.note}”</div>}
                                                <div className="adm-card-foot">
                                                    <div className="meta">
                                                        <span className="tot">{fmt(o.total)}</span>
                                                        <span className="ago">{o.placedAt}{o.minsAgo != null ? ` · ${o.minsAgo}m ago` : ''}</span>
                                                    </div>
                                                    {o.next ? (
                                                        <button className="adm-advance" onClick={() => advance(o)}>
                                                            {STATUS_LABEL[o.next]} <ChevR size={13} />
                                                        </button>
                                                    ) : (
                                                        <span className="adm-done">Done</span>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>
        </>
    );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'mint' | 'warn' | 'info' }) {
    return (
        <div className={`adm-stat ${accent ?? ''}`}>
            <div className="lbl">{label}</div>
            <div className="val">{value}</div>
        </div>
    );
}
