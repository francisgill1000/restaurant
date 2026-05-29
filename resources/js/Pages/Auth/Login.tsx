import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff, MaisonMark } from '@/Components/MaisonIcons';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [show, setShow] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Sign in" />
            <div className="auth-stage">
                <div className="auth-card">
                    <div className="auth-head">
                        <div className="auth-mark"><MaisonMark size={26} /></div>
                        <span className="auth-crumb">DIFC · DUBAI</span>
                    </div>
                    <h1>MAISON</h1>
                    <p className="auth-sub">Continental kitchen &amp; bar — sign in to continue</p>

                    <form onSubmit={submit}>
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
                            <div className="auth-pw">
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="auth-input"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="auth-eye"
                                    onClick={() => setShow((s) => !s)}
                                    aria-label={show ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className="auth-err">{errors.password}</span>}
                        </label>

                        <label className="auth-remember">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                            <span className="box" aria-hidden="true" />
                            <span>Remember me on this device</span>
                        </label>

                        <button type="submit" className="m-cta-btn" disabled={processing}>
                            {processing ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
