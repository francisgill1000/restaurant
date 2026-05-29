import { ReactNode, useState } from 'react';
import {
    ArrowUp, Calendar, Check, ChevR, Clock, Download, Eye, Flame, More, Plus,
    Receipt, Repeat, Star, Timer, Users, Utensils, Wallet,
} from '@/Components/MaisonIcons';

/* ── shared data types ── */
export type StatusMeta = Record<string, { label: string; color: string }>;
export type Table = { id: string; seats: number; status: string; zone: string; x: number; y: number; guest?: string; party?: number; server?: string; since?: string; time?: string; course?: string; spend?: number };
export type KitchenTicket = { id: string; table: string; server: string; placed: string; mins: number; stage: string; items: { n: string; q: number; note?: string }[] };
export type Reservation = { id: string; name: string; party: number; time: string; table: string; status: string; phone: string; tag: string; note: string };
export type Staff = { id: string; initials: string; name: string; role: string; status: string; shift: string; section: string };
export type MenuItem = { id: string; cat: string; name: string; desc: string; price: number; tags: string[]; avail: boolean; sold: number; rating: number };
export type Daypart = { h: string; covers: number };
export type Week = { d: string; v: number };
export type SectionPerf = { name: string; pct: number; rev: number };

export type AdminData = {
    menu: MenuItem[]; categories: string[]; statusMeta: StatusMeta;
    tables: Table[]; kitchen: KitchenTicket[]; reservations: Reservation[];
    staff: Staff[]; daypart: Daypart[]; salesWeek: Week[]; sectionPerformance: SectionPerf[];
};

const fmt = (n: number) => 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });

/* ── shared UI ── */
function Card({ title, action, padding = true, children, style }: { title?: string; action?: ReactNode; padding?: boolean; children: ReactNode; style?: React.CSSProperties }) {
    return (
        <div className="card" style={style}>
            {(title || action) && <div className="card-header"><h3>{title}</h3>{action}</div>}
            <div className={padding ? 'card-body' : ''}>{children}</div>
        </div>
    );
}
function StatTile({ label, value, currency, delta, dir = 'up', sub }: { label: string; value: ReactNode; currency?: string; delta?: string; dir?: 'up' | 'flat'; sub?: string }) {
    return (
        <div className="stat">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{currency && <span className="currency">{currency}</span>}{value}</div>
            {delta && <div className={`stat-delta ${dir}`}>{dir === 'up' && <ArrowUp size={13} />}<span>{delta}</span>{sub && <span style={{ color: 'var(--text-4)', marginLeft: 4 }}>{sub}</span>}</div>}
        </div>
    );
}
function DpBars({ data, height = 150 }: { data: { label: string; value: number }[]; height?: number }) {
    const max = Math.max(...data.map((d) => d.value));
    return (
        <div className="dp-bars" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="dp-bar-col">
                    <div className={`dp-bar ${d.value === max ? 'peak' : ''}`} style={{ height: `${(d.value / max) * 100}%` }}><span className="cap">{d.value}</span></div>
                    <span className="dp-label">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

/* ═══ OVERVIEW ═══ */
export function Overview({ d, onNav }: { d: AdminData; onNav: (s: string) => void }) {
    const seated = d.tables.filter((t) => t.status === 'seated' || t.status === 'bill');
    const covers = seated.reduce((s, t) => s + (t.party || 0), 0);
    const occupancy = Math.round((seated.length / d.tables.length) * 100);
    const topDishes = [...d.menu].sort((a, b) => b.sold - a.sold).slice(0, 5);

    return (
        <>
            <PageHead title="Service overview" subtitle="Friday, May 29 · Dinner service · 19:00 – 01:00"
                actions={<><button className="btn btn-secondary"><Download size={15} /> Day sheet</button><button className="btn btn-primary"><Plus size={15} /> New reservation</button></>} />

            <div className="mz-hero">
                <div className="mz-metric feature">
                    <div className="top"><div className="ic mint"><Wallet size={18} /></div><span className="trend up"><ArrowUp size={12} /> 14%</span></div>
                    <div className="lbl">Tonight's revenue</div><div className="val"><span className="cur">AED</span>18.4k</div><div className="sub">vs AED 16.1k last Fri</div>
                </div>
                <div className="mz-metric">
                    <div className="top"><div className="ic blue"><Users size={18} /></div><span className="trend up"><ArrowUp size={12} /> 8</span></div>
                    <div className="lbl">Covers seated</div><div className="val">{covers}</div><div className="sub">{seated.length} active tables</div>
                </div>
                <div className="mz-metric">
                    <div className="top"><div className="ic amber"><Receipt size={18} /></div><span className="trend up"><ArrowUp size={12} /> 6%</span></div>
                    <div className="lbl">Avg check</div><div className="val"><span className="cur">AED</span>312</div><div className="sub">per cover AED 142</div>
                </div>
                <div className="mz-metric">
                    <div className="top"><div className="ic violet"><Repeat size={18} /></div><span className="trend up"><ArrowUp size={12} /> 0.3</span></div>
                    <div className="lbl">Table turnover</div><div className="val">2.4×</div><div className="sub">{occupancy}% occupancy now</div>
                </div>
            </div>

            <div className="mz-grid">
                <div className="mz-col">
                    <Card title="Covers by hour" action={<span className="muted" style={{ fontSize: 12 }}>tonight</span>}>
                        <DpBars data={d.daypart.map((x) => ({ label: x.h, value: x.covers }))} />
                    </Card>
                    <Card title="Top dishes tonight" action={<button className="btn btn-ghost btn-sm" onClick={() => onNav('menu')}>Menu <ChevR size={13} /></button>}>
                        {topDishes.map((dish) => (
                            <div key={dish.id} className="dish-row">
                                <div className="dish-thumb"><Utensils size={16} /></div>
                                <div><div className="dish-nm">{dish.name}</div><div className="dish-mt"><span className="star"><Star size={11} fill="#f4b860" /> {dish.rating}</span> · {fmt(dish.price)}</div></div>
                                <div className="dish-sold">{dish.sold}<span className="u">sold</span></div>
                            </div>
                        ))}
                    </Card>
                </div>
                <div className="mz-col">
                    <Card title="Floor status" action={<button className="btn btn-ghost btn-sm" onClick={() => onNav('floor')}>Floor plan <ChevR size={13} /></button>}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {Object.entries(d.statusMeta).map(([k, m]) => {
                                const n = d.tables.filter((t) => t.status === k).length;
                                return (
                                    <div key={k} className="kpi-tile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 4, background: m.color, flexShrink: 0 }} />
                                        <div><div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>{n}</div><div style={{ fontSize: 11, color: 'var(--text-4)' }}>{m.label}</div></div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    <Card title="Upcoming reservations" action={<button className="btn btn-ghost btn-sm" onClick={() => onNav('reservations')}>All <ChevR size={13} /></button>}>
                        <div className="res-mini">
                            {d.reservations.slice(0, 5).map((r) => (
                                <div key={r.id} className="res-mini-row">
                                    <span className="t">{r.time}</span>
                                    <div><div className="nm">{r.name}</div><div className="mt">{r.party} guests · {r.tag}{r.note ? ` · ${r.note}` : ''}</div></div>
                                    <span className={`res-pill ${r.status}`}>{r.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

/* ═══ FLOOR ═══ */
export function Floor({ d }: { d: AdminData }) {
    const [sel, setSel] = useState('T9');
    const table = d.tables.find((t) => t.id === sel);
    const zones = [
        { name: 'Window', x: 0.02, y: 0.03 }, { name: 'Center', x: 0.02, y: 0.31 },
        { name: 'Private', x: 0.02, y: 0.61 }, { name: 'Bar', x: 0.60, y: 0.61 },
    ];
    const sizeFor = (s: number) => (s <= 2 ? 58 : s <= 4 ? 70 : s <= 6 ? 82 : 96);

    return (
        <>
            <PageHead title="Floor plan" subtitle="Main dining room · 12 tables · live status"
                actions={<><button className="btn btn-secondary"><Calendar size={15} /> Seat reservation</button><button className="btn btn-primary"><Plus size={15} /> Seat walk-in</button></>} />
            <div className="floor-layout">
                <div>
                    <div className="floor-wrap">
                        {zones.map((z) => <span key={z.name} className="floor-zone-label" style={{ left: `${z.x * 100}%`, top: `${z.y * 100}%` }}>{z.name}</span>)}
                        {d.tables.map((t) => {
                            const m = d.statusMeta[t.status];
                            const sz = sizeFor(t.seats);
                            return (
                                <div key={t.id} className={`table-node ${sel === t.id ? 'selected' : ''}`} onClick={() => setSel(t.id)}
                                    style={{ left: `${t.x * 100 + 6}%`, top: `${t.y * 100 + 10}%`, width: sz, height: sz, borderColor: m.color, color: m.color, background: t.status === 'available' ? 'rgba(13,18,16,0.7)' : `color-mix(in oklab, ${m.color} 12%, rgba(13,18,16,0.92))` }}>
                                    {(t.status === 'seated' || t.status === 'bill') && <span className="tn-pulse" />}
                                    <span className="tn-id" style={{ color: 'var(--text-1)' }}>{t.id}</span>
                                    <span className="tn-seats">{t.party ? `${t.party}/${t.seats}` : `${t.seats} seats`}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="floor-legend">
                        {Object.entries(d.statusMeta).map(([k, m]) => <span key={k} className="li"><span className="sw" style={{ background: m.color }} />{m.label}</span>)}
                    </div>
                </div>
                <div className="tbl-detail">
                    {table ? (
                        <>
                            <div className="tbl-detail-head">
                                <span className="big-id" style={{ color: d.statusMeta[table.status].color }}>{table.id}</span>
                                <div className="meta"><div style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 600 }}>{d.statusMeta[table.status].label}</div><div className="z">{table.zone} · {table.seats} seats</div></div>
                            </div>
                            <div className="tbl-detail-body">
                                {table.guest ? (
                                    <>
                                        <div className="tbl-stat"><span className="l">Guest</span><span className="v">{table.guest}</span></div>
                                        <div className="tbl-stat"><span className="l">Party size</span><span className="v">{table.party}</span></div>
                                        {table.server && <div className="tbl-stat"><span className="l">Server</span><span className="v">{table.server}</span></div>}
                                        {table.since && <div className="tbl-stat"><span className="l">Seated since</span><span className="v">{table.since}</span></div>}
                                        {table.time && <div className="tbl-stat"><span className="l">Arriving</span><span className="v">{table.time}</span></div>}
                                        {table.course && <div className="tbl-stat"><span className="l">Current course</span><span className="v" style={{ color: 'var(--mint-300)' }}>{table.course}</span></div>}
                                        {table.spend != null && <div className="tbl-stat"><span className="l">Running total</span><span className="v">{fmt(table.spend)}</span></div>}
                                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                            <button className="btn btn-secondary btn-sm"><Receipt size={14} /> View order</button>
                                            {table.status === 'bill' ? <button className="btn btn-primary btn-sm"><Check size={14} /> Close table</button> : <button className="btn btn-primary btn-sm"><Wallet size={14} /> Print bill</button>}
                                        </div>
                                    </>
                                ) : (
                                    <div className="tbl-empty">
                                        {table.status === 'cleaning' ? 'Table is being reset. It will be available shortly.' : 'Open table — ready to seat.'}
                                        <div style={{ marginTop: 14 }}><button className="btn btn-primary btn-sm"><Users size={14} /> Seat guests</button></div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : <div className="tbl-empty">Select a table</div>}
                </div>
            </div>
        </>
    );
}

/* ═══ KITCHEN ═══ */
export function Kitchen({ d }: { d: AdminData }) {
    const cols = [
        { id: 'new', title: 'New', color: '#60a5fa', next: 'Start' },
        { id: 'cooking', title: 'Cooking', color: '#f4b860', next: 'Mark ready' },
        { id: 'ready', title: 'Ready', color: '#00ffcc', next: 'Serve' },
        { id: 'served', title: 'Served', color: '#5d6661', next: '' },
    ];
    return (
        <>
            <PageHead title="Kitchen display" subtitle="Pass · live tickets · avg fire-to-pass 14 min"
                actions={<><button className="btn btn-secondary"><Timer size={15} /> Bump history</button><button className="btn btn-primary"><Flame size={15} /> Fire all starters</button></>} />
            <div className="kds-board">
                {cols.map((col) => {
                    const tickets = d.kitchen.filter((o) => o.stage === col.id);
                    return (
                        <div key={col.id} className="kds-col">
                            <div className="kds-col-head"><h4><span className="sw" style={{ background: col.color }} />{col.title}</h4><span className="ct">{tickets.length}</span></div>
                            <div className="kds-cards">
                                {tickets.map((o) => {
                                    const urgent = o.mins >= 20 && (o.stage === 'cooking' || o.stage === 'new');
                                    const timerCls = o.stage === 'ready' ? 'ok' : urgent ? 'warn' : '';
                                    return (
                                        <div key={o.id} className={`kds-ticket ${urgent ? 'urgent' : ''}`}>
                                            <div className="kds-ticket-head"><span><span className="oid">{o.id}</span><span className="tbl">· {o.table}</span></span><span className={`kds-timer ${timerCls}`}><Clock size={11} /> {o.mins}m</span></div>
                                            {o.items.map((it, i) => <div key={i} className="kds-item"><span className="q">{it.q}×</span><span style={{ flex: 1 }}>{it.n}{it.note && <span className="note"> · {it.note}</span>}</span></div>)}
                                            <div className="kds-ticket-foot"><span className="srv">{o.server} · {o.placed}</span>{col.next && <button className="kds-advance">{col.next} <ChevR size={12} /></button>}</div>
                                        </div>
                                    );
                                })}
                                {tickets.length === 0 && <div className="kds-empty">No tickets</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

/* ═══ RESERVATIONS ═══ */
export function Reservations({ d }: { d: AdminData }) {
    const [filter, setFilter] = useState('all');
    const totalCovers = d.reservations.reduce((s, r) => s + r.party, 0);
    const confirmed = d.reservations.filter((r) => r.status === 'confirmed').length;
    const waitlist = d.reservations.filter((r) => r.status === 'waitlist').length;
    const rows = d.reservations.filter((r) => (filter === 'all' ? true : r.status === filter));
    return (
        <>
            <PageHead title="Reservations" subtitle="Friday, May 29 · dinner book"
                actions={<><button className="btn btn-secondary"><Calendar size={15} /> May 29</button><button className="btn btn-primary"><Plus size={15} /> Add booking</button></>} />
            <div className="res-stat-row">
                <StatTile label="Total bookings" value={d.reservations.length} delta="+4 vs last Fri" />
                <StatTile label="Covers booked" value={totalCovers} delta="evening" dir="flat" />
                <StatTile label="Confirmed" value={confirmed} delta="ready" />
                <StatTile label="Waitlist" value={waitlist} delta="2 flexible" dir="flat" />
            </div>
            <Card padding={false} title="Tonight's book" action={
                <div className="seg-toggle">
                    {[['all', 'All'], ['confirmed', 'Confirmed'], ['pending', 'Pending'], ['waitlist', 'Waitlist']].map(([k, l]) => (
                        <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{l}</button>
                    ))}
                </div>
            }>
                <div className="table-wrap">
                    <table className="table">
                        <thead><tr><th>Time</th><th>Guest</th><th>Party</th><th>Table</th><th>Zone</th><th>Note</th><th>Status</th><th /></tr></thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}>
                                    <td className="num" style={{ color: 'var(--text-1)', fontSize: 14 }}>{r.time}</td>
                                    <td><div style={{ color: 'var(--text-1)', fontWeight: 500 }}>{r.name}</div><div style={{ color: 'var(--text-4)', fontSize: 11.5 }}>{r.phone}</div></td>
                                    <td className="num">{r.party}</td>
                                    <td className="num" style={{ color: r.table === '—' ? 'var(--text-5)' : 'var(--mint-300)' }}>{r.table}</td>
                                    <td className="muted">{r.tag}</td>
                                    <td className="muted">{r.note || '—'}</td>
                                    <td><span className={`res-pill ${r.status}`}>{r.status}</span></td>
                                    <td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm btn-icon"><More size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
}

/* ═══ MENU ═══ */
export function MenuAdmin({ d }: { d: AdminData }) {
    const [cat, setCat] = useState(d.categories[0] ?? 'Starters');
    const [avail, setAvail] = useState<Record<string, boolean>>(() => Object.fromEntries(d.menu.map((m) => [m.id, m.avail])));
    const dishes = d.menu.filter((m) => m.cat === cat);
    return (
        <>
            <PageHead title="Menu" subtitle="À la carte · 15 dishes across 6 sections"
                actions={<><button className="btn btn-secondary"><Eye size={15} /> Preview</button><button className="btn btn-primary"><Plus size={15} /> Add dish</button></>} />
            <div className="menu-layout">
                <div className="menu-cats">
                    {d.categories.map((c) => (
                        <div key={c} className={`menu-cat ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                            <span>{c}</span><span className="ct">{d.menu.filter((m) => m.cat === c).length}</span>
                        </div>
                    ))}
                </div>
                <div className="menu-cards">
                    {dishes.map((dish) => {
                        const isOn = avail[dish.id];
                        return (
                            <div key={dish.id} className={`dish-card ${isOn ? '' : 'off'}`}>
                                <div className="img"><Utensils size={30} /><span className="price-tag">{fmt(dish.price)}</span></div>
                                <div className="body">
                                    <div className="nm">{dish.name}{dish.tags.map((t) => <span key={t} className={`tag-chip ${t}`}>{t === 'veg' ? 'Veg' : 'Signature'}</span>)}</div>
                                    <div className="desc">{dish.desc}</div>
                                    <div className="foot">
                                        <span className="meta"><span className="star"><Star size={11} fill="#f4b860" /> {dish.rating}</span><span>{dish.sold} sold</span></span>
                                        <span className={`avail-switch ${isOn ? 'on' : ''}`} onClick={() => setAvail((a) => ({ ...a, [dish.id]: !a[dish.id] }))} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

/* ═══ STAFF ═══ */
export function StaffPage({ d }: { d: AdminData }) {
    const on = d.staff.filter((s) => s.status === 'on').length;
    const label: Record<string, string> = { on: 'On shift', break: 'On break', off: 'Off' };
    return (
        <>
            <PageHead title="Staff" subtitle={`Dinner rota · ${on} on shift now`}
                actions={<><button className="btn btn-secondary"><Calendar size={15} /> Rota</button><button className="btn btn-primary"><Plus size={15} /> Add staff</button></>} />
            <div className="res-stat-row">
                <StatTile label="On shift" value={on} delta="full floor" />
                <StatTile label="Kitchen" value={d.staff.filter((s) => s.section === 'Kitchen').length} delta="brigade" dir="flat" />
                <StatTile label="Front of house" value={5} delta="servers + host" dir="flat" />
                <StatTile label="Covers / server" value="11" delta="-2 vs avg" sub="lighter" />
            </div>
            <Card padding={false} title="Tonight's brigade">
                <div className="table-wrap">
                    <table className="table">
                        <thead><tr><th>Name</th><th>Role</th><th>Section</th><th>Shift</th><th>Status</th></tr></thead>
                        <tbody>
                            {d.staff.map((s) => (
                                <tr key={s.id}>
                                    <td><div className="cust-row"><div className="agent-avatar" style={{ width: 32, height: 32 }}>{s.initials}</div><div className="cust-name">{s.name}</div></div></td>
                                    <td>{s.role}</td>
                                    <td className="muted">{s.section}</td>
                                    <td className="num muted">{s.shift}</td>
                                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}><span className={`staff-pip ${s.status}`} />{label[s.status]}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
}

/* ═══ REPORTS ═══ */
export function Reports({ d }: { d: AdminData }) {
    return (
        <>
            <PageHead title="Reports" subtitle="Week of May 25 – 31" actions={<button className="btn btn-secondary"><Download size={15} /> Export</button>} />
            <div className="res-stat-row">
                <StatTile label="Revenue · week" currency="AED" value="412k" delta="+11%" sub="vs last wk" />
                <StatTile label="Covers" value="1,284" delta="+96" />
                <StatTile label="Avg check" currency="AED" value="298" delta="+4%" />
                <StatTile label="No-show rate" value="3.2%" delta="-0.8pt" sub="improved" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }} className="reports-grid">
                <Card title="Revenue by day" action={<span className="muted" style={{ fontSize: 12 }}>AED thousands</span>}>
                    <DpBars data={d.salesWeek.map((x) => ({ label: x.d, value: x.v }))} height={180} />
                </Card>
                <Card title="Section performance">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {d.sectionPerformance.map((s) => (
                            <div key={s.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}><span style={{ color: 'var(--text-2)' }}>{s.name}</span><span className="num" style={{ color: 'var(--text-3)' }}>AED {s.rev}k</span></div>
                                <div className="quota-bar" style={{ height: 6 }}><div className={`quota-fill ${s.pct >= 80 ? '' : s.pct >= 60 ? 'warn' : 'low'}`} style={{ width: `${s.pct}%` }} /></div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
}

/* ═══ SETTINGS ═══ */
export function SettingsPage() {
    const Row = ({ label, value, toggle }: { label: string; value?: string; toggle?: boolean }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-1)' }}>
            <span style={{ color: 'var(--text-1)', fontSize: 13.5 }}>{label}</span>
            {toggle ? <span className="avail-switch on" /> : <span style={{ color: 'var(--text-2)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{value}</span>}
        </div>
    );
    return (
        <>
            <PageHead title="Settings" subtitle="Restaurant & service preferences" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="reports-grid">
                <Card title="Service"><Row label="Service hours" value="19:00 – 01:00" /><Row label="Default turn time" value="120 min" /><Row label="Auto-waitlist when full" toggle /><Row label="Online bookings" toggle /></Card>
                <Card title="Kitchen"><Row label="Ticket warning threshold" value="20 min" /><Row label="Auto-fire starters" toggle /><Row label="86 alerts to floor" toggle /><Row label="Course pacing" value="Manual" /></Card>
            </div>
        </>
    );
}

/* shared page header */
function PageHead({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
    return (
        <div className="page-header">
            <div><h1 style={{ fontSize: 24 }}>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    );
}
