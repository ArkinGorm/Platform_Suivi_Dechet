import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.terms) return setError("Vous devez accepter les conditions.");
    setLoading(true);
    const result = await register({
      nom: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
    });
    if (result.success) navigate('/login', { state: { message: 'Inscription réussie !' } });
    else setError(result.error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-extrabold text-white text-center mb-1 tracking-tight">
        Créer un compte
      </h2>
      <div className="w-10 h-0.5 bg-green-400 mx-auto mb-6 rounded-full" />

      {error && (
        <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-sm px-4 py-2.5 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Prénom + Nom */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Prénom', name: 'firstName', placeholder: 'Jean' },
          { label: 'Nom', name: 'lastName', placeholder: 'Dupont' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-green-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">{f.label}</label>
            <input
              type="text" name={f.name} value={formData[f.name]}
              onChange={handleChange} required placeholder={f.placeholder}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
            />
          </div>
        ))}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-green-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email</label>
        <input
          type="email" name="email" value={formData.email}
          onChange={handleChange} required placeholder="vous@exemple.com"
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
        />
      </div>

      {/* Mot de passe */}
      <div className="mb-4">
        <label className="block text-green-200 text-xs font-semibold mb-1.5 uppercase tracking-wider">Mot de passe</label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'} name="password"
            value={formData.password} onChange={handleChange} required
            placeholder="••••••••••"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all"
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition focus:outline-none">
            {showPwd
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Conditions */}
      <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none">
        <input type="checkbox" name="terms" checked={formData.terms}
          onChange={handleChange}
          className="h-4 w-4 rounded border-white/30 bg-white/10 accent-green-500 focus:ring-green-400 shrink-0"
        />
        <span className="text-sm text-white/60 leading-tight">
          J'accepte les{' '}
          <a href="#" className="text-green-300 hover:text-green-200 font-semibold">conditions d'utilisation</a>
        </span>
      </label>

      {/* Submit */}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 shadow-lg shadow-green-900/40"
        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
        {loading
          ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Création...</span>
          : 'Créer un compte'}
      </button>

      <p className="text-center text-sm text-white/50 mt-5">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-green-300 font-semibold hover:text-green-200 transition">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;