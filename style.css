/* ============================================================
   MUSLIM LIFE OS™ - Premium Islamic Glassmorphism UI
   Apple-level polish | Emerald + Gold + Cream | Dark/Light
   ============================================================ */

:root {
  --emerald-50: #ecfdf5;
  --emerald-100: #d1fae5;
  --emerald-600: #059669;
  --emerald-700: #047857;
  --emerald-800: #065f46;
  --emerald-900: #064e3b;
  
  --gold: #d4af37;
  --gold-dark: #b8860b;
  --cream: #fdfaf3;
  --cream-dark: #f5f0e6;
  
  --dark-bg: #0f172a;
  --dark-surface: #1e2937;
  --dark-glass: rgba(15, 23, 42, 0.85);
  
  --light-bg: #f8fafc;
  --light-surface: #ffffff;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-inverse: #f8fafc;
  
  --radius-xl: 1rem;
  --radius-2xl: 1.25rem;
  --radius-3xl: 1.5rem;
  
  --shadow-soft: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-glass: 0 8px 32px rgb(0 0 0 / 0.12);
  --shadow-premium: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Dark mode (default elegant) */
html.dark {
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --dark-bg: #0f172a;
  --dark-surface: #1e2937;
  color-scheme: dark;
}

/* Glassmorphism Core */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: var(--shadow-glass);
}

.dark .glass {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.glass-gold {
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 8px 32px rgb(212 175 55 / 0.1);
}

/* Premium Card Styles */
.premium-card {
  border-radius: var(--radius-3xl);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.premium-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-premium);
}

.premium-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  opacity: 0.3;
}

/* Islamic Elegant Accents */
.islamic-border {
  border-image: linear-gradient(to right, var(--emerald-700), var(--gold), var(--emerald-700)) 1;
}

.gold-accent {
  color: var(--gold);
}

.emerald-gradient {
  background: linear-gradient(135deg, var(--emerald-700), var(--emerald-800));
}

/* Prayer Status Badges */
.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  letter-spacing: -.025em;
}

.status-awal { background-color: #10b981; color: white; }
.status-lewat { background-color: #f59e0b; color: white; }
.status-qada { background-color: #ef4444; color: white; }
.status-jemaah { background-color: #3b82f6; color: white; }

/* Digital Tasbih Big Counter */
.tasbih-counter {
  font-size: 5.5rem;
  line-height: 1;
  font-weight: 700;
  font-feature-settings: "tnum";
  transition: all 0.1s cubic-bezier(0.23, 1.0, 0.32, 1);
}

.tasbih-counter:active {
  transform: scale(0.96);
}

/* Progress Ring */
.progress-ring {
  transition: stroke-dashoffset 0.5s ease;
}

/* Heatmap */
.heatmap-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  transition: transform 0.1s ease;
}

.heatmap-cell:hover {
  transform: scale(1.3);
  z-index: 10;
}

/* Navigation */
.nav-link {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-xl);
}

.nav-link.active {
  background-color: rgba(5, 150, 105, 0.15);
  color: var(--emerald-700);
  font-weight: 600;
}

.dark .nav-link.active {
  background-color: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

/* Modal */
.modal {
  animation: modalEnter 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes modalEnter {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Beautiful Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.4);
  border-radius: 20px;
}
.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.3);
}

/* Micro interactions */
.btn-premium {
  transition: all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-premium:active {
  transform: scale(0.985);
}

.btn-premium::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 50%;
  height: 200%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );
  transition: 0.5s;
}

.btn-premium:hover::after {
  left: 250%;
}

/* Module Header with Islamic flair */
.module-header {
  background: linear-gradient(90deg, var(--emerald-800), var(--emerald-900));
  color: white;
}

.dark .module-header {
  background: linear-gradient(90deg, #064e3b, #022c22);
}

/* Stats Number Animation */
.stat-number {
  font-variant-numeric: tabular-nums;
}

/* Responsive adjustments for PWA */
@media (max-width: 768px) {
  .tasbih-counter {
    font-size: 4rem;
  }
  
  .premium-card {
    border-radius: var(--radius-2xl);
  }
}

/* Print styles for reports */
@media print {
  .no-print { display: none !important; }
  .glass { background: white; box-shadow: none; border: 1px solid #ddd; }
}
/* ========== v1.1 Extra Polish ========== */
.animate-fade-in {
  animation: fadeInUp 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.mobile-nav-btn {
  transition: color 0.2s ease;
}

.sedekah-cat:active {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(6, 95, 70, 0.2);
}

.tasbih-counter {
  transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.grayscale {
  filter: grayscale(1);
  opacity: 0.7;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
