import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';

const Shapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute rounded-full border-2 border-white/10"
      style={{ width: 420, height: 420, top: -140, right: -100 }} />
    <div className="absolute rounded-full border-2 border-white/10"
      style={{ width: 280, height: 280, bottom: -90, left: -70 }} />
    <div className="absolute border-2 border-white/8 rounded-3xl"
      style={{ width: 180, height: 180, top: '28%', left: '36%', transform: 'rotate(28deg)' }} />
    <div className="absolute rounded-full bg-green-400/10"
      style={{ width: 120, height: 120, top: '52%', right: '28%' }} />
    <div className="absolute bg-white/10 rounded-full"
      style={{ width: 3, height: 200, top: '8%', left: '33%', transform: 'rotate(20deg)' }} />
    <div className="absolute bg-green-300/15 rounded-full"
      style={{ width: 3, height: 160, top: '42%', right: '20%', transform: 'rotate(-30deg)' }} />
    <div className="absolute rounded-full blur-3xl bg-green-500/20"
      style={{ width: 320, height: 320, top: -60, left: -60 }} />
    <div className="absolute rounded-full blur-3xl bg-emerald-400/15"
      style={{ width: 260, height: 260, bottom: -40, right: -40 }} />
  </div>
);

const RegisterPage = () => (
  <div
    className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
    style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)' }}
  >
    <Shapes />

    {/* ══════════════════════════════════════════
        EFFET DEUX BLOCS EMPILÉS
    ══════════════════════════════════════════ */}
    <div className="relative z-10 w-full max-w-4xl">

      {/* ── Bloc 1 : Grand bloc arrière (background card) ── */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          transform: 'translate(14px, 14px)',
        }}
      />

      {/* ── Bloc 2 : Petit bloc avant (foreground card) ── */}
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col lg:flex-row"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Côté gauche — texte */}
        <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-green-400 flex items-center justify-center text-green-900 text-lg font-black shadow-md">
              ♻️
            </div>
            <span className="text-white font-black text-xl tracking-tight">Smart Bins</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white leading-none mb-4 tracking-tight">
            Bienvenue !
          </h1>
          <div className="w-12 h-1 bg-green-400 rounded-full mb-6" />
          <p className="text-white/55 text-base leading-relaxed max-w-xs">
            Rejoignez la plateforme Smart Bins et aidez votre ville à mieux gérer ses déchets.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['IoT en temps réel', 'Alertes auto', 'Tournées IA'].map(f => (
              <span key={f}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-green-400/30 text-green-300 bg-green-400/10">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden lg:block w-px bg-white/10 my-10" />

        {/* Côté droit — formulaire */}
        <div
          className="w-full lg:w-[400px] shrink-0 p-10 lg:p-12 flex items-center"
          style={{ background: 'rgba(0,0,0,0.15)' }}
        >
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
);

export default RegisterPage;