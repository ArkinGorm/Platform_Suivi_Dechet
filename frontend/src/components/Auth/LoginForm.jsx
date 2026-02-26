import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-extrabold text-white text-center mb-1 tracking-tight">
        Se connecter
      </h2>
      <div className="w-10 h-0.5 bg-green-400 mx-auto mb-6 rounded-full" />

      {error && (
        <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-sm px-4 py-2.5 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="block text-green-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email" name="email" value={formData.email}
          onChange={handleChange} required
          placeholder="vous@exemple.com"
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
        />
      </div>

      {/* Mot de passe */}
      <div className="mb-6">
        <label className="block text-green-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'} name="password"
            value={formData.password} onChange={handleChange} required
            placeholder="••••••••••"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition focus:outline-none">
            {showPwd
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
        <div className="text-right mt-1">
          <a href="#" className="text-xs text-green-300 hover:text-green-200 transition">Mot de passe oublié ?</a>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 shadow-lg shadow-green-900/40"
        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
        {loading
          ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Connexion...</span>
          : 'Se connecter'}
      </button>

      {/* Social icons */}
      <div className="flex justify-center gap-5 mt-5">
        {[
          { label: 'Google', path: 'M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.4-1.8 4.44-1.2 1.34-3 2.28-5.74 2.28-4.1 0-7.4-3.3-7.4-7.4s3.3-7.4 7.4-7.4c2.2 0 4.1.8 5.6 2.1l2.4-2.4C17.4 2.6 14.8 1.5 12 1.5 6.2 1.5 1.5 6.2 1.5 12s4.7 10.5 10.5 10.5c4.6 0 8.9-3 8.9-8.5 0-.8-.1-1.6-.3-2.3l-8.1.1z', fill: '#4ade80' },
          { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', fill: '#86efac', stroke: true },
        ].map(s => (
          <button key={s.label} type="button"
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={s.stroke ? 'none' : s.fill} stroke={s.stroke ? s.fill : 'none'} strokeWidth={s.stroke ? 2 : 0} strokeLinecap="round" strokeLinejoin="round">
              <path d={s.path} />
            </svg>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-white/50 mt-5">
        Pas de compte ?{' '}
        <Link to="/register" className="text-green-300 font-semibold hover:text-green-200 transition">
          S'inscrire
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;