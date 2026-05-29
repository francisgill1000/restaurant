import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { MaisonMark } from '@/Components/MaisonIcons';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Sign in" />
            <div className="auth-stage">
                <form className="auth-card" onSubmit={submit}>
                    <div className="auth-mark"><MaisonMark size={26} /></div>
                    <h1>MAISON</h1>
                    <p className="auth-sub">Continental kitchen &amp; bar · sign in to continue</p>

                    <label className="auth-field">
                        <span className="lbl">Email</span>
                        <input
                            type="email"
                            className="auth-input"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            autoFocus
                            placeholder="you@example.com"
                        />
                        {errors.email && <span className="auth-err">{errors.email}</span>}
                    </label>

                    <label className="auth-field">
                        <span className="lbl">Password</span>
                        <input
                            type="password"
                            className="auth-input"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="auth-err">{errors.password}</span>}
                    </label>

                    <label className="auth-remember">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        <span>Keep me signed in</span>
                    </label>

                    <button type="submit" className="m-cta-btn" disabled={processing} style={{ marginTop: 4 }}>
                        {processing ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </>
    );
}
