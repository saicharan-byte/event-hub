import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ParticleBackground from '../components/ParticleBackground.jsx';

function Login() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleCardClick = (role) => {
        setSelectedRole(role);
        setError('');
    };

    const handleBack = () => {
        setSelectedRole(null);
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email'); return; }
        if (!password) { setError('Please enter your password'); return; }
        const result = login(email.trim(), password, selectedRole);
        if (!result.success) { setError(result.message); return; }
        navigate(result.role === 'Admin' ? '/admin' : '/student');
    };

    return (
        <div className="relative min-h-screen overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1145 30%, #302b63 60%, #24243e 100%)' }}>
            <ParticleBackground />

            {/* Gradient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
                 style={{ background: 'rgba(99, 102, 241, 0.2)' }} />
            <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
                 style={{ background: 'rgba(168, 85, 247, 0.2)' }} />

            {/* Centered Layout */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full" style={{ maxWidth: '700px' }}>

                    {/* Hero */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span style={{
                            display: 'inline-block', padding: '8px 20px', borderRadius: '50px',
                            fontSize: '0.85rem', fontWeight: 600,
                            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.25)',
                            color: '#818cf8', marginBottom: '20px'
                        }}>
                            🎓 Campus Events
                        </span>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}>
                            Event<span style={{
                                background: 'linear-gradient(to right, #818cf8, #a855f7, #ec4899)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>Hub</span>
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: '1.05rem', maxWidth: '450px', margin: '0 auto' }}>
                            Your one-stop platform for college event management and registration
                        </p>
                    </div>

                    {/* Role Selection */}
                    {!selectedRole && (
                        <div>
                            <h2 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
                                Select Your Role
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                {/* Admin Card */}
                                <div onClick={() => handleCardClick('Admin')} className="glass"
                                    style={{
                                        borderRadius: '16px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                                        position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #6366f1, #a855f7)', borderRadius: '16px 16px 0 0' }} />
                                    <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🛡️</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Admin Portal</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6 }}>
                                        Create &amp; manage events, view student registrations, and oversee your campus activities.
                                    </p>
                                </div>

                                {/* Student Card */}
                                <div onClick={() => handleCardClick('Student')} className="glass"
                                    style={{
                                        borderRadius: '16px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                                        position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, #a855f7, #ec4899)', borderRadius: '16px 16px 0 0' }} />
                                    <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🎒</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Student Portal</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6 }}>
                                        Discover exciting events, register with ease, and never miss out on campus happenings.
                                    </p>
                                </div>
                            </div>

                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                                Don&apos;t have an account?{' '}
                                <Link to="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign up here</Link>
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    {selectedRole && (
                        <div className="glass-strong" style={{
                            borderRadius: '16px', padding: '36px 32px', maxWidth: '440px', margin: '0 auto'
                        }}>
                            <button onClick={handleBack} style={{
                                background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.85rem',
                                cursor: 'pointer', padding: 0, marginBottom: '16px', fontFamily: 'inherit'
                            }}>
                                ← Back
                            </button>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '28px' }}>
                                {selectedRole === 'Admin' ? '🛡️' : '🎒'} {selectedRole} Login
                            </h2>

                            <form onSubmit={handleLogin}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>
                                        Email Address
                                    </label>
                                    <input
                                        id="login-email" type="email" placeholder="you@college.edu"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
                                            boxSizing: 'border-box', transition: 'border-color 0.3s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>
                                        Password
                                    </label>
                                    <input
                                        id="login-password" type="password" placeholder="Enter your password"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
                                            boxSizing: 'border-box', transition: 'border-color 0.3s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                {error && <p style={{ color: '#f87171', fontSize: '0.84rem', fontWeight: 500, marginBottom: '16px' }}>{error}</p>}

                                <button type="submit" style={{
                                    width: '100%', padding: '13px', borderRadius: '12px',
                                    background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
                                    color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none',
                                    cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => e.target.style.boxShadow = '0 6px 30px rgba(99,102,241,0.4)'}
                                onMouseLeave={e => e.target.style.boxShadow = 'none'}>
                                    Login as {selectedRole}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: '20px' }}>
                                Don&apos;t have an account?{' '}
                                <Link to="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign up here</Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer style={{ padding: '32px 0 16px', color: '#4b5563', fontSize: '0.82rem', textAlign: 'center' }}>
                    <p>© 2026 EventHub — Built for Campus Communities</p>
                </footer>
            </div>
        </div>
    );
}

export default Login;
