import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Bag, Bike, ChevL, ChevR, Check, Eye, Heart, Home as HomeIcon,
    Minus, Pin, Plus, Receipt, Star, User, Wallet,
} from '@/Components/MaisonIcons';
import WebShell from '@/Components/Web/WebShell';

/* ─── Types ─── */
type MenuItem = { id: string; cat: string; name: string; desc: string | null; price: number; tags: string[]; avail: boolean; sold: number; rating: number };
type PlacedItem = { name: string; qty: number; price: number };
type OrderType = 'delivery' | 'pickup' | 'dine-in';
type PlacedOrder = { reference: string; type: OrderType; status: string; eta: string; address: string | null; note: string | null; subtotal: number; delivery: number; vat: number; total: number; placedAt: string | null; items: PlacedItem[] };
type View = 'home' | 'menu' | 'cart' | 'checkout' | 'track' | 'profile';

type PageProps = {
    menu: MenuItem[];
    categories: string[];
    recentOrders: PlacedOrder[];
    config: { currency: string; vatRate: number; deliveryFee: number };
    flash: { order?: PlacedOrder | null };
    auth: { user: { name: string; email: string } | null };
};

const TYPE_META: Record<OrderType, { label: string }> = { delivery: { label: 'Delivery' }, pickup: { label: 'Pickup' }, 'dine-in': { label: 'Dine-in' } };
const TYPE_OPTS: { t: OrderType; Icon: (p: { size?: number }) => JSX.Element; l: string }[] = [
    { t: 'delivery', Icon: Bike, l: 'Delivery' },
    { t: 'pickup', Icon: Bag, l: 'Pickup' },
    { t: 'dine-in', Icon: Receipt, l: 'Dine-in' },
];
const TITLES: Record<View, string> = { home: 'MAISON', menu: 'Menu', cart: 'Your order', checkout: 'Checkout', track: 'Order tracking', profile: 'Profile' };

export default function OrderApp() {
    const { menu, categories, recentOrders, config, flash, auth } = usePage<PageProps>().props;
    const initials = (auth.user?.name ?? 'Guest').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    const fmt = (n: number) => `${config.currency} ` + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });
    const menuById = useMemo(() => Object.fromEntries(menu.map((it) => [it.id, it])) as Record<string, MenuItem>, [menu]);

    const [view, setView] = useState<View>('home');
    const [cat, setCat] = useState<string>(categories[0] ?? 'Starters');
    const [cart, setCart] = useState<Record<string, number>>({ m8: 1, m10: 2 });
    const [orderType, setOrderType] = useState<OrderType>('delivery');
    const [submitting, setSubmitting] = useState(false);
    const [placed, setPlaced] = useState<PlacedOrder | null>(null);

    const items = Object.entries(cart).filter(([, q]) => q > 0);
    const count = items.reduce((s, [, q]) => s + q, 0);
    const subtotal = items.reduce((s, [id, q]) => s + (menuById[id]?.price || 0) * q, 0);
    const deliveryFee = orderType === 'delivery' ? config.deliveryFee : 0;
    const vat = Math.round(subtotal * config.vatRate);
    const total = subtotal + deliveryFee + vat;

    const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    const sub = (id: string) => setCart((c) => ({ ...c, [id]: Math.max((c[id] || 0) - 1, 0) }));

    const handledRef = useRef<string | null>(null);
    useEffect(() => {
        if (flash.order && handledRef.current !== flash.order.reference) {
            handledRef.current = flash.order.reference;
            setPlaced(flash.order);
            setSubmitting(false);
            setView('track');
        }
    }, [flash.order]);

    const placeOrder = () => {
        setSubmitting(true);
        router.post(route('orders.store'), {
            type: orderType,
            note: 'Med-rare. Leave at the door.',
            address: orderType === 'delivery' ? 'Index Tower, DIFC · Apt 1204' : null,
            items: items.map(([id, qty]) => ({ id, qty })),
        }, { preserveScroll: true, preserveState: true, onError: () => setSubmitting(false), onFinish: () => setSubmitting(false) });
    };

    const nav = [
        { id: 'home', label: 'Home', Icon: HomeIcon },
        { id: 'menu', label: 'Menu', Icon: Eye },
        { id: 'cart', label: 'Cart', Icon: Bag, badge: count || undefined },
        { id: 'profile', label: 'Profile', Icon: User },
    ];

    const TypeSeg = ({ style }: { style?: React.CSSProperties }) => (
        <div className="mo-type-seg" style={style}>
            {TYPE_OPTS.map(({ t, Icon, l }) => (
                <button key={t} className={`mo-type ${orderType === t ? 'active' : ''}`} onClick={() => setOrderType(t)}><Icon size={18} /> {l}</button>
            ))}
        </div>
    );
    const Summary = () => (
        <div className="mo-summary">
            <div className="mo-sum-row"><span>Subtotal</span><span className="v">{fmt(subtotal)}</span></div>
            {deliveryFee > 0 && <div className="mo-sum-row"><span>Delivery</span><span className="v">{fmt(deliveryFee)}</span></div>}
            <div className="mo-sum-row"><span>VAT (5%)</span><span className="v">{fmt(vat)}</span></div>
            <div className="mo-sum-row total"><span>Total</span><span className="v">{fmt(total)}</span></div>
        </div>
    );
    const CartSticky = () => (count > 0 ? (
        <button className="cust-cartbar" onClick={() => setView('cart')}>
            <span className="ct">{count}</span><span className="lbl">View cart</span><span className="tot">{fmt(total)}</span>
        </button>
    ) : null);

    /* ─── content per view ─── */
    let content: JSX.Element;

    if (view === 'home') {
        const sigs = menu.filter((m) => m.tags.includes('signature'));
        const popular = menu.filter((m) => m.sold > 40).slice(0, 6);
        content = (
            <div className="cust">
                <div className="mb-hero cust-hero">
                    <div className="mb-hero-top"><span className="mb-crumb"><Receipt size={14} /> DIFC · DUBAI</span><button className="m-icon-btn" style={{ background: 'rgba(10,14,12,0.6)' }} aria-label="Favourite"><Heart size={18} /></button></div>
                    <div className="plate" />
                    <h1>MAISON</h1>
                    <div className="tagline">Continental kitchen &amp; bar</div>
                    <div className="meta-row"><span className="mi star"><Star size={13} /> 4.8</span><span className="mi"><Bike size={13} /> 30–40 min</span><span className="mi open">● Open till 1 AM</span></div>
                </div>
                <TypeSeg style={{ maxWidth: 520, marginBottom: 6 }} />
                <div className="mb-sec"><h3>Signature dishes</h3><button className="link" onClick={() => setView('menu')}>Full menu</button></div>
                <div className="mb-dish-scroll">
                    {sigs.map((d) => (
                        <button key={d.id} className="mb-dish" onClick={() => { setView('menu'); setCat(d.cat); }}>
                            <div className="pic"><Eye size={26} /><span className="fav" role="button" aria-label={`Add ${d.name}`} onClick={(e) => { e.stopPropagation(); add(d.id); }}><Plus size={15} /></span></div>
                            <div className="info"><div className="nm">{d.name}</div><div className="pr">{fmt(d.price)}</div><div className="rt"><span className="s"><Star size={10} /></span> {d.rating}</div></div>
                        </button>
                    ))}
                </div>
                <div className="mb-sec"><h3>Popular near you</h3></div>
                <div className="mb-menu-list cust-grid">
                    {popular.map((d) => (
                        <div key={d.id} className="mb-menu-item">
                            <div className="mo-cart-thumb" style={{ width: 46, height: 46 }}><Eye size={18} /></div>
                            <div className="txt"><div className="nm">{d.name}</div><div className="ds">{fmt(d.price)} · {d.sold} sold</div></div>
                            <button className="mo-add" onClick={() => add(d.id)} aria-label={`Add ${d.name}`}><Plus size={18} /></button>
                        </div>
                    ))}
                </div>
                <CartSticky />
            </div>
        );
    } else if (view === 'menu') {
        content = (
            <div className="cust">
                <div className="mb-cat-tabs">
                    {categories.map((c) => <button key={c} className={`mb-cat-tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
                </div>
                <div className="mb-menu-list cust-grid">
                    {menu.filter((m) => m.cat === cat).map((d) => {
                        const q = cart[d.id] || 0;
                        return (
                            <div key={d.id} className="mb-menu-item">
                                <div className="mo-cart-thumb"><Eye size={18} /></div>
                                <div className="txt">
                                    <div className="nm">{d.name}{d.tags.map((t) => <span key={t} className={`tag-chip ${t}`}>{t === 'veg' ? 'Veg' : 'Chef'}</span>)}{!d.avail && <span className="dish-out">86’d</span>}</div>
                                    <div className="ds">{d.desc}</div>
                                    <div className="pr" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--mint-300)', marginTop: 5 }}>{fmt(d.price)}</div>
                                </div>
                                {!d.avail ? <div className="mo-add" style={{ opacity: 0.3, pointerEvents: 'none' }}><Plus size={18} /></div>
                                    : q > 0 ? <div className="mo-qty"><button onClick={() => sub(d.id)} aria-label="Decrease"><Minus size={15} /></button><span className="n">{q}</span><button className="plus" onClick={() => add(d.id)} aria-label="Increase"><Plus size={15} /></button></div>
                                        : <button className="mo-add" onClick={() => add(d.id)} aria-label={`Add ${d.name}`}><Plus size={18} /></button>}
                            </div>
                        );
                    })}
                </div>
                <CartSticky />
            </div>
        );
    } else if (view === 'cart') {
        content = (
            <div className="cust cust-col">
                {items.length === 0 ? (
                    <div className="mo-empty"><div className="ico"><Bag size={26} /></div><div className="t">Your cart is empty</div><div className="s">Add a few plates to get started</div></div>
                ) : (
                    <>
                        {items.map(([id, q]) => { const d = menuById[id]; return (
                            <div key={id} className="mo-cart-row">
                                <div className="mo-cart-thumb"><Eye size={20} /></div>
                                <div className="mo-cart-info"><div className="nm">{d.name}</div><div className="pr">{fmt(d.price * q)}</div></div>
                                <div className="mo-qty"><button onClick={() => sub(id)} aria-label="Decrease"><Minus size={15} /></button><span className="n">{q}</span><button className="plus" onClick={() => add(id)} aria-label="Increase"><Plus size={15} /></button></div>
                            </div>
                        ); })}
                        <div className="mb-sec" style={{ marginBottom: 10 }}><h3 style={{ fontSize: 14 }}>Order summary</h3></div>
                        <Summary />
                        <button className="m-cta-btn no-pulse" style={{ marginTop: 16 }} onClick={() => setView('checkout')}>Checkout · {fmt(total)}</button>
                    </>
                )}
            </div>
        );
    } else if (view === 'checkout') {
        content = (
            <div className="cust cust-col">
                <button className="mo-back" onClick={() => setView('cart')} style={{ marginBottom: 12 }}><ChevL size={16} /> Back to cart</button>
                <div className="m-field"><div className="label">Order type</div><TypeSeg /></div>
                {orderType === 'delivery' && (
                    <div className="m-field"><div className="label">Deliver to</div>
                        <div className="m-input"><Pin size={16} /><div className="v-customer" style={{ display: 'block' }}><div className="name" style={{ fontSize: 13.5 }}>Index Tower, DIFC</div><div className="sub">Apt 1204 · {auth.user?.name}</div></div><span className="chev"><ChevR size={14} /></span></div>
                    </div>
                )}
                <div className="m-field"><div className="label">Payment</div><div className="m-input"><Wallet size={16} /><span style={{ flex: 1, color: 'var(--text-1)', fontSize: 14 }}>Visa ·· 4471</span><span className="chev"><ChevR size={14} /></span></div></div>
                <div className="m-field"><div className="label">Add a note</div><textarea className="m-textarea" placeholder="Allergies, delivery instructions…" defaultValue="Med-rare. Leave at the door." /></div>
                <Summary />
                <button className="m-cta-btn no-pulse" style={{ marginTop: 16 }} onClick={placeOrder} disabled={submitting || count === 0}><Check size={16} /> {submitting ? 'Placing…' : `Place order · ${fmt(total)}`}</button>
            </div>
        );
    } else if (view === 'track') {
        const o = placed;
        const type = o?.type ?? orderType;
        const tItems = o?.items ?? items.map(([id, q]) => ({ name: menuById[id].name, qty: q, price: menuById[id].price * q }));
        const tTotal = o?.total ?? total;
        const etaMin = type === 'dine-in' ? null : parseInt(o?.eta ?? '28', 10) || 28;
        const steps = [
            { l: 'Order received', s: `Sent to MAISON · ${o?.placedAt ?? '20:34'}`, state: 'done', Icon: Check },
            { l: 'Preparing in kitchen', s: 'Chef Étienne is on it', state: 'active', Icon: Receipt },
            { l: type === 'delivery' ? 'Out for delivery' : 'Ready for pickup', s: type === 'delivery' ? 'Rider assigned' : 'Collect at counter', state: 'pending', Icon: type === 'delivery' ? Bike : Bag },
            { l: type === 'delivery' ? 'Delivered' : 'Picked up', s: 'Enjoy your meal', state: 'pending', Icon: Heart },
        ];
        content = (
            <div className="cust cust-col">
                <div className="mo-track-hero"><div className="eta-big">{etaMin ?? '—'}<span style={{ fontSize: 18, color: 'var(--text-3)' }}> {etaMin ? 'min' : ''}</span></div><div className="eta-lbl">{type === 'delivery' ? 'Estimated delivery · 21:02' : type === 'pickup' ? 'Ready for pickup · 20:58' : 'Being prepared now'} · {o?.reference ?? ''}</div></div>
                {type === 'delivery' && (
                    <div className="mo-track-map">
                        <svg viewBox="0 0 1 1" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}><path d="M 0.15 0.8 Q 0.4 0.6 0.55 0.45 T 0.82 0.22" stroke="#00ffcc" strokeWidth="0.012" fill="none" strokeDasharray="0.03 0.02" strokeLinecap="round" opacity="0.7" /></svg>
                        <div style={{ position: 'absolute', left: '15%', top: '80%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: '50%', background: '#5d6661', border: '2px solid #0a0e0c' }} />
                        <div style={{ position: 'absolute', left: '55%', top: '45%', transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(160deg,var(--mint-400),var(--mint-600))', border: '2px solid #0a0e0c', display: 'grid', placeItems: 'center', color: '#03130b', boxShadow: '0 0 16px rgba(0,255,204,0.5)' }}><Bike size={15} /></div>
                        <div style={{ position: 'absolute', left: '82%', top: '22%', transform: 'translate(-50%,-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--mint-400)', border: '2px solid #0a0e0c' }} />
                    </div>
                )}
                <div className="mo-track-steps" style={{ marginTop: type === 'delivery' ? 0 : 16 }}>
                    {steps.map((st, i) => <div key={i} className={`mo-track-step ${st.state}`}><div className="dot"><st.Icon size={15} /></div><div className="tx"><div className="l">{st.l}</div><div className="s">{st.s}</div></div></div>)}
                </div>
                <div className="mb-sec"><h3 style={{ fontSize: 14 }}>Your order</h3></div>
                <div className="mo-summary">
                    {tItems.map((it, i) => <div key={i} className="mo-sum-row"><span>{it.qty}× {it.name}</span><span className="v">{fmt(it.price)}</span></div>)}
                    <div className="mo-sum-row total"><span>Total paid</span><span className="v">{fmt(tTotal)}</span></div>
                </div>
                <button className="m-cta-btn no-pulse" style={{ marginTop: 16 }} onClick={() => { setCart({}); setView('home'); }}>Back to home</button>
            </div>
        );
    } else {
        content = (
            <div className="cust cust-col">
                <div className="mb-prof-hero"><div className="mb-prof-av">{initials}</div><div><h2>{auth.user?.name ?? 'Guest'}</h2><div className="sub">{auth.user?.email}</div></div></div>
                <div className="mb-loyalty"><div className="lh"><span className="tier">◆ Gold member</span><Star size={18} fill="#00d4aa" /></div><div className="pts">2,480<span className="u">points</span></div><div className="bar"><i style={{ width: '74%' }} /></div><div className="nxt">520 points to Platinum · free chef's tasting</div></div>
                <div className="mb-sec"><h3 style={{ fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent orders</h3></div>
                {recentOrders.length === 0 && <div className="mo-empty" style={{ padding: '28px 20px' }}><div className="s">No orders yet — your past orders will show here.</div></div>}
                {recentOrders.map((o) => (
                    <div key={o.reference} className="mb-booking-card">
                        <div className="bc-head"><div className="bc-date"><div className="bc-cal"><span className="m">{TYPE_META[o.type].label.slice(0, 3)}</span><span className="d">{o.items.length}</span></div><div><div className="bc-title">{o.items.map((i) => i.name).slice(0, 2).join(', ')}</div><div className="bc-sub">{o.reference} · {fmt(o.total)}</div></div></div><button className="reorder">Reorder →</button></div>
                    </div>
                ))}
                <div className="m-settings-group" style={{ marginTop: 14 }}>
                    <div className="m-settings-row"><div className="ico"><Pin size={16} /></div><div className="body"><div className="l">Saved addresses</div><div className="s">Index Tower · Home</div></div><span className="chev"><ChevR size={14} /></span></div>
                    <div className="m-settings-row"><div className="ico"><Wallet size={16} /></div><div className="body"><div className="l">Payment methods</div><div className="s">Visa ·· 4471</div></div><span className="chev"><ChevR size={14} /></span></div>
                </div>
            </div>
        );
    }

    const cartTotalAction = count > 0 && (view === 'home' || view === 'menu')
        ? <button className="btn btn-primary" onClick={() => setView('cart')}><Bag size={15} /> {fmt(total)}</button>
        : undefined;

    return (
        <>
            <Head title={view === 'home' ? 'Order' : TITLES[view]} />
            <WebShell
                navTitle="Order"
                nav={nav}
                active={view === 'checkout' || view === 'track' ? 'cart' : view}
                onNav={(id) => setView(id as View)}
                title={TITLES[view]}
                user={auth.user}
                onLogout={() => router.post(route('logout'))}
                actions={cartTotalAction}
            >
                {content}
            </WebShell>
        </>
    );
}
