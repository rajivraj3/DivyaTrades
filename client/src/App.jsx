import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Gauge,
  Landmark,
  LogOut,
  Menu,
  MoonStar,
  Newspaper,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
  UserCircle2,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import profileLogo from './assets/divyatrades-logo.png';

const dashboardChartData = [
  { name: 'Mon', value: 1720000 },
  { name: 'Tue', value: 1760000 },
  { name: 'Wed', value: 1820000 },
  { name: 'Thu', value: 1805000 },
  { name: 'Fri', value: 1882000 },
  { name: 'Sat', value: 1935000 },
  { name: 'Sun', value: 1983000 },
];

const marketOverview = [
  { name: 'NIFTY 50', value: '24,250.10', change: '+1.20%' },
  { name: 'SENSEX', value: '79,430.60', change: '+0.93%' },
  { name: 'Bank Nifty', value: '52,690.90', change: '+1.48%' },
];

const learningModules = [
  { id: 'stock-basics', title: 'What is a stock?', level: 'Beginner', progress: 75 },
  { id: 'ipo', title: 'What is an IPO?', level: 'Beginner', progress: 60 },
  { id: 'market-cap', title: 'What is market capitalization?', level: 'Intermediate', progress: 40 },
  { id: 'pe-ratio', title: 'What is P/E ratio?', level: 'Intermediate', progress: 55 },
  { id: 'diversification', title: 'What is diversification?', level: 'Intermediate', progress: 62 },
];

const COLORS = ['#22c55e', '#38bdf8', '#f59e0b', '#a78bfa', '#f87171'];
const founderPortrait = '/src/assets/rajiv-profile.png';

const formatMoney = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
const formatCompact = (value) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 2 }).format(value);

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('divyatrades_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('divyatrades_theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--panel)] text-[var(--text)] transition hover:border-[var(--brand)]"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
    </button>
  );
}

const PriceTrend = ({ value, className = '' }) => {
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${positive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'} ${className}`}>
      {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
};

function TradeModal({ stock, isOpen, mode, onClose, onTrade }) {
  const { user } = useAuth();
  const [side, setSide] = useState(mode || 'BUY');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [heldQuantity, setHeldQuantity] = useState(0);
  const [holdingsLoaded, setHoldingsLoaded] = useState(false);

  useEffect(() => {
    if (stock) {
      setSide(mode || 'BUY');
      setQuantity(1);
      setError('');
    }
  }, [stock, mode, isOpen]);

  useEffect(() => {
    if (!isOpen || !stock) return undefined;

    let cancelled = false;
    setHoldingsLoaded(false);
    api.get('/portfolio/holdings')
      .then((response) => {
        if (!cancelled) {
          const holding = response.data.holdings.find((item) => item.stock === stock.ticker);
          setHeldQuantity(holding?.quantity || 0);
        }
      })
      .catch(() => {
        if (!cancelled) setHeldQuantity(0);
      })
      .finally(() => {
        if (!cancelled) setHoldingsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, stock?.ticker]);

  if (!isOpen || !stock) return null;

  const total = Number(stock.price || 0) * Number(quantity || 0);
  const availableCash = Number(user?.virtualCash || 0);

  const handleSubmit = async () => {
    const parsedQuantity = Number(quantity);
    if (!Number.isSafeInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('Enter a positive whole number of shares.');
      return;
    }
    if (side === 'BUY' && total > availableCash) {
      setError('The estimated total exceeds your available virtual cash.');
      return;
    }
    if (side === 'SELL' && parsedQuantity > heldQuantity) {
      setError(`You currently hold ${heldQuantity} ${stock.ticker} shares.`);
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onTrade({
        stock: stock.ticker,
        quantity: parsedQuantity,
        side,
        orderType: 'Market',
      });
    } catch (tradeError) {
      setError(tradeError?.response?.data?.message || 'Trade failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-cyan-500/10">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Paper Trading — Simulated Orders</div>
            <h3 className="mt-2 text-2xl font-semibold text-white">{stock.ticker}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-700 px-2 py-1 text-sm text-slate-200">Close</button>
        </div>

        <div className="mb-4 flex gap-2 rounded-full border border-slate-700 bg-slate-800 p-1">
          {['BUY', 'SELL'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSide(option)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${side === option ? (option === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-slate-950') : 'text-slate-300'}`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Current price (simulated)</span>
            <span>₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
            <span>{side === 'BUY' ? 'Available virtual cash' : 'Current holdings'}</span>
            <span className="text-slate-200">{side === 'BUY' ? `₹${availableCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : holdingsLoaded ? `${heldQuantity} shares` : 'Loading...'}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <label className="text-sm text-slate-300">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-24 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-right text-white outline-none"
            />
          </div>
          <div className="mt-4 border-t border-slate-700 pt-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>{side === 'BUY' ? 'Estimated total' : 'Estimated sale value'}</span>
              <span className="font-semibold text-white">₹{Number(total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || (side === 'SELL' && !holdingsLoaded)}
          className={`mt-5 w-full rounded-2xl px-4 py-3 font-semibold text-slate-950 ${side === 'BUY' ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-rose-400 hover:bg-rose-300'} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSubmitting ? 'Saving simulated order...' : `Confirm simulated ${side}`}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">No real money, broker, or exchange order is involved.</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
    { to: '/markets', label: 'Markets' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/orders', label: 'Orders' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/journal', label: 'Trade Journal' },
    { to: '/learning', label: 'Learn' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--nav-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
          <img src={profileLogo} alt="" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <div className="text-lg font-semibold text-[var(--text)]">DivyaTrades</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Invest with Clarity.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm transition ${item.label === 'Settings' ? (isActive ? 'text-[var(--brand)] font-semibold' : 'text-[var(--muted)] hover:text-[var(--text)]') : `text-[#8B5E3C] hover:text-[#734d2f] ${isActive ? 'font-semibold' : ''}`}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" className="hidden items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--text)] md:flex">
                <UserCircle2 size={16} />
                {user.name}
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="rounded-full border border-[var(--border-soft)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--brand)]">
                <span className="hidden md:inline">Logout</span>
                <LogOut className="md:hidden" size={16} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full border border-[var(--border-soft)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text)]">Login</Link>
              <Link to="/register" className="hidden rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white sm:inline-flex">Start Trading</Link>
            </div>
          )}
        </div>
      </div>

      <nav className="grid grid-cols-5 gap-2 border-t border-[var(--border-soft)] bg-[var(--panel)] px-3 py-2 lg:hidden">
        {[
          { to: '/dashboard', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/markets', label: 'Markets' },
          { to: '/portfolio', label: 'Portfolio' },
          { to: '/profile', label: 'Profile' },
        ].map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-xs ${isActive ? 'bg-[var(--brand-soft)] text-[var(--brand)] font-semibold' : 'text-[var(--muted)]'}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 pb-16">
        <section className="relative overflow-hidden pb-12 pt-10 md:pb-16 md:pt-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_30%)]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                <Sparkles size={12} />
                Smart investing clarity
              </div>
              <h1 className="max-w-xl text-4xl font-bold tracking-[-0.06em] text-[var(--text)] md:text-6xl">
                Invest with Clarity.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
                Track markets, practice investing, and understand your portfolio — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="rounded-full bg-[var(--brand)] px-5 py-3 font-semibold text-white shadow-[0_18px_38px_rgba(14,165,233,0.28)] transition hover:translate-y-[-1px]">Start Trading</Link>
                <Link to="/markets" className="rounded-full border border-[var(--border-soft)] bg-[var(--panel)] px-5 py-3 font-medium text-[var(--text)] transition hover:border-[var(--brand)]">Explore Markets</Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[var(--brand)]" /> Paper trading only</span>
                <span className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Education-first approach</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-[var(--brand)]/10 blur-3xl" />
              <div className="absolute -bottom-8 right-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="relative min-w-0 rounded-[30px] border border-[var(--border-soft)] bg-[var(--panel)] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--panel-soft)] p-4">
                  <div className="mb-4 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Illustrative Paper Portfolio</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">+18.4%</span>
                  </div>
                  <div className="mb-6 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-sm text-[var(--muted)]">Sample portfolio value</div>
                      <div className="mt-1 text-3xl font-bold text-[var(--text)]">₹34,82,500</div>
                    </div>
                    <div className="rounded-2xl bg-[var(--panel)] px-3 py-2 text-right shadow-sm">
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">Today</div>
                      <div className="mt-1 text-sm font-semibold text-emerald-600">+₹18,540</div>
                    </div>
                  </div>
                  <div className="h-40 min-w-0 w-full overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardChartData}>
                        <defs>
                          <linearGradient id="landingArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.08} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(148,163,184,0.25)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="url(#landingArea)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {['Smart Portfolio', 'Market Insights', 'Risk Awareness', 'Simple Trading'].map((item) => (
                      <div key={item} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--panel)] p-3 text-sm text-[var(--text)]">{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-[var(--brand)]">Why DivyaTrades?</div>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Build smarter investing habits.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Smart Portfolio', 'Understand allocation and concentration with a simple health score.'],
              ['Simple Trading', 'Buy and sell with virtual cash while building confidence.'],
              ['Market Insights', 'Track leaders, sectors and momentum from one place.'],
              ['Risk Awareness', 'See diversification signals before moving capital.'],
            ].map(([title, text]) => (
              <div key={title} className="card-surface rounded-2xl p-5">
                <div className="mb-4 inline-flex rounded-xl bg-[#8B5E3C]/10 p-2 text-[#8B5E3C]"><TrendingUp size={18} /></div>
                <h3 className="text-xl font-semibold text-[#8B5E3C]">{title}</h3>
                <p className="mt-2 text-sm text-[#8B5E3C]/80">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-[1fr_1fr]">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-6 text-sm uppercase tracking-[0.2em] text-cyan-300">How It Works</div>
            <ol className="space-y-4">
              {['Create account', 'Explore stocks', 'Build portfolio', 'Track performance', 'Improve your strategy'].map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5E3C] text-sm font-bold text-white">{index + 1}</div>
                  <div className="text-lg text-[#8B5E3C]">{step}</div>
                </li>
              ))}
            </ol>
          </div>
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-6 text-sm uppercase tracking-[0.2em] text-cyan-300">Platform Features</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Live market dashboard', 'Interactive charts', 'Watchlists', 'Portfolio analytics', 'Order management', 'Market news', 'Learning center', 'Risk advisory'].map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-slate-200">{feature}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 text-center">
          <h2 className="text-3xl font-semibold text-white">Trust built for demo-first investing.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            DivyaTrades is a demonstration trading platform. No real-money transactions are performed.
          </p>
        </section>
      </main>
    </div>
  );
}

function AboutPage() {
  return (
    <AppFrame title="About">
      <section className="card-surface rounded-3xl p-6 py-10 md:p-10">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[300px_minmax(0,1fr)] md:gap-16">
          <figure className="flex flex-col items-center">
            <img
              src={founderPortrait}
              alt="Portrait of Rajiv Raj"
              className="h-60 w-60 rounded-full object-cover md:h-64 md:w-64"
            />
            <figcaption className="mt-6 text-center">
              <div className="text-lg font-medium text-[var(--text)]">Rajiv Raj</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Founder, CEO of DivyaTrades</div>
            </figcaption>
          </figure>
          <div className="space-y-5 text-base leading-8 text-[var(--muted)]">
            <p>
              Rajiv founded DivyaTrades in 2026 with a simple vision: to make investing
              easier to understand and more accessible for everyday investors.
            </p>
            <p>
              As the CEO of DivyaTrades, Rajiv focuses on building a smarter and more
              transparent trading experience that combines technology, market insights,
              and practical learning.
            </p>
            <p>
              Under his leadership, DivyaTrades has grown into a modern paper-trading
              platform where users can explore stocks, practice buying and selling,
              track portfolios, and learn the fundamentals of investing without risking
              real money.
            </p>
            <p>
              Outside the markets, Rajiv enjoys playing cricket, exploring new
              technologies, and following the evolution of the AI-tech industry.
            </p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span>Connect with me on</span>
              <a href="https://www.linkedin.com/in/rajiv-raj-312rnc/" target="_blank" rel="noreferrer" className="text-sky-600 underline underline-offset-2">LinkedIn</a>
              <span>and</span>
              <a href="https://www.facebook.com/rajiv.raj.856098" target="_blank" rel="noreferrer" className="text-sky-600 underline underline-offset-2">Facebook</a>
            </p>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)]">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--panel)]/90 shadow-[var(--shadow)] backdrop-blur-sm">
        <div className="grid md:grid-cols-2">
          <div className="bg-[radial-gradient(circle_at_top,_rgba(139,94,60,0.18),_transparent_65%)] p-8 md:p-12">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5E3C] text-xl font-bold text-white">D</div>
              <div>
                <div className="text-2xl font-semibold text-[var(--text)]">DivyaTrades</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Trade. Understand. Improve.</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[var(--text)]">{isRegister ? 'Start your trading journey' : 'Welcome back'}</h1>
            <p className="mt-4 max-w-sm text-[var(--muted)]">Build confidence, understand your portfolio and learn before you invest.</p>
            <div className="mt-8 space-y-4 text-[var(--text)]">
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-soft)] p-3"><Gauge size={18} className="text-[#8B5E3C]" /> Portfolio Health score insights</div>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-soft)] p-3"><BookOpen size={18} className="text-[#8B5E3C]" /> Learning-first investing education</div>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-soft)] p-3"><ShieldCheck size={18} className="text-[#8B5E3C]" /> Demo-safe simulation environment</div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[var(--text)]">{isRegister ? 'Create account' : 'Login'}</h2>
              <Link to="/" className="text-sm text-[#8B5E3C]">Back home</Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <label htmlFor="auth-name" className="sr-only">Full name</label>
                  <input id="auth-name" autoComplete="name" className="input-shell w-full rounded-2xl px-4 py-3 outline-none ring-0 placeholder:text-[var(--muted)]" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
                </>
              )}
              <label htmlFor="auth-email" className="sr-only">Email address</label>
              <input id="auth-email" autoComplete="email" className="input-shell w-full rounded-2xl px-4 py-3 outline-none placeholder:text-[var(--muted)]" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email address" required />
              {isRegister && (
                <>
                  <label htmlFor="auth-phone" className="sr-only">Phone number</label>
                  <input id="auth-phone" autoComplete="tel" className="input-shell w-full rounded-2xl px-4 py-3 outline-none placeholder:text-[var(--muted)]" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="Phone number" />
                </>
              )}
              <label htmlFor="auth-password" className="sr-only">Password</label>
              <input id="auth-password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 6 : undefined} className="input-shell w-full rounded-2xl px-4 py-3 outline-none placeholder:text-[var(--muted)]" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" required />

              {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

              <button type="submit" className="w-full rounded-2xl bg-[#8B5E3C] px-4 py-3 font-semibold text-white transition hover:bg-[#734d2f]">{isRegister ? 'Create account' : 'Login'}</button>
            </form>

            <div className="mt-5 text-center text-sm text-[var(--muted)]">
              {isRegister ? 'Already have an account?' : 'Need an account?'} <Link to={isRegister ? '/login' : '/register'} className="text-[#8B5E3C] font-medium">{isRegister ? 'Login' : 'Create one'}</Link>
            </div>
            {!isRegister && (
              <div className="mt-3 text-center text-sm text-[var(--muted)]">
                <Link to="/forgot-password" className="text-[#8B5E3C]">Forgot password?</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('demo@divyatrades.com');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[var(--border-soft)] bg-[var(--panel)] p-6 shadow-[var(--shadow)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--brand)]">Reset access</div>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text)]">Forgot password</h1>
          </div>
          <Link to="/login" className="text-sm text-[var(--brand)]">Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="input-shell w-full rounded-2xl px-4 py-3 outline-none placeholder:text-[var(--muted)]"
          />

          <button type="submit" className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white">
            Send reset link
          </button>
        </form>

        {sent && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            Demo reset link is ready. Use the demo account credentials to continue in local mode.
          </div>
        )}
      </div>
    </div>
  );
}

function AppFrame({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
        <div className="mb-5 flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <ShieldCheck size={16} />
          <span className="font-bold text-green-700">Paper Trading — Simulated Orders. No real money or broker connection.</span>
        </div>
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-[var(--brand)]">DivyaTrades</div>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text)]">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function DashboardPage() {
  const [summary, setSummary] = useState({ totalPortfolioValue: 0, todayProfit: 0, totalProfit: 0, investedAmount: 0, availableCash: 0, returnPercent: 0 });
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, stocksResponse] = await Promise.all([
          api.get('/portfolio/summary'),
          api.get('/stocks'),
        ]);
        setSummary(summaryResponse.data);
        setStocks(stocksResponse.data.stocks || []);
      } catch (error) {
        console.warn('Could not load dashboard data.', error.message);
      }
    };
    load();
  }, []);

  return (
    <AppFrame title="Dashboard" subtitle="A simple snapshot of your active portfolio and market position.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total portfolio value', value: formatMoney(summary.totalPortfolioValue ?? 0), icon: <Wallet size={18} />, tone: 'bg-cyan-500/10 text-cyan-300' },
          { label: 'Today\'s P&L', value: formatMoney(summary.todayProfit ?? 0), icon: <TrendingUp size={18} />, tone: 'bg-emerald-500/10 text-emerald-300' },
          { label: 'Total P&L', value: formatMoney(summary.totalProfit ?? 0), icon: <BarChart3 size={18} />, tone: 'bg-violet-500/10 text-violet-300' },
          { label: 'Invested amount', value: formatMoney(summary.investedAmount ?? 0), icon: <CreditCard size={18} />, tone: 'bg-orange-500/10 text-orange-300' },
          { label: 'Available virtual cash', value: formatMoney(summary.availableCash ?? 0), icon: <CircleDollarSign size={18} />, tone: 'bg-sky-500/10 text-sky-300' },
        ].map((item) => (
          <div key={item.label} className="card-surface rounded-3xl p-5">
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}>{item.icon}</div>
            <div className="text-sm font-bold text-black">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="card-surface rounded-3xl p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-white">Illustrative portfolio trend</h3>
              <div className="text-sm text-slate-400">Sample values, not account performance</div>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">DEMO</span>
          </div>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardChartData}>
                <defs>
                  <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#portfolioFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Market overview</h3>
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">Demo values</span>
          </div>
          <div className="space-y-3">
            {marketOverview.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
                <div>
                  <div className="text-sm text-slate-400">{item.name}</div>
                  <div className="text-lg font-semibold text-white">{item.value}</div>
                </div>
                <span className="text-emerald-300">{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Watchlist</h3>
            <Link to="/watchlist" className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950">View Watchlist</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Change</th>
                  <th className="pb-3">Change %</th>
                  <th className="pb-3">Market status</th>
                </tr>
              </thead>
              <tbody>
                {stocks.slice(0, 5).map((stock) => (
                  <tr key={stock.ticker} className="border-t border-slate-700/80 text-slate-200">
                    <td className="py-3 font-medium text-white">{stock.ticker}</td>
                    <td className="py-3 font-bold text-black">₹{stock.price.toFixed(2)}</td>
                    <td className="py-3 font-bold text-black">{stock.changePercent > 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}</td>
                    <td className="py-3"><PriceTrend value={stock.changePercent} className="!font-bold !text-black" /></td>
                    <td className="py-3"><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">{stock.marketStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-surface rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-white">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <Link to="/markets" className="rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left text-slate-200 hover:border-cyan-400">Buy simulated shares</Link>
            <Link to="/markets" className="rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left text-slate-200 hover:border-cyan-400">Sell held shares</Link>
            <Link to="/watchlist" className="rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left text-slate-200 hover:border-cyan-400">View watchlists</Link>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function StockExplorerPage() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [tradeStock, setTradeStock] = useState(null);
  const [tradeMode, setTradeMode] = useState('BUY');
  const { updateUser } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/stocks');
        setStocks(response.data.stocks || []);
      } catch (error) {
        console.warn('Could not load simulated stock quotes.', error.message);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return stocks.filter((stock) => {
      const matchesSearch = !query || stock.name.toLowerCase().includes(query) || stock.ticker.toLowerCase().includes(query) || stock.sector.toLowerCase().includes(query);
      return matchesSearch && (sectorFilter === 'all' || stock.sector.toLowerCase() === sectorFilter.toLowerCase());
    });
  }, [stocks, search, sectorFilter]);

  const handleTrade = async ({ stock, quantity, side, orderType, price }) => {
    try {
      const response = await api.post('/orders/place', { stock, quantity, side, orderType, price });
      updateUser((previousUser) => ({ ...previousUser, virtualCash: response.data.remainingCash }));
      setTradeStock(null);
      window.dispatchEvent(new CustomEvent('divyatrades:refresh'));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <AppFrame title="Stock Explorer" subtitle="Search, filter and sort companies across the market.">
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" placeholder="Search stock or sector" />
          </div>
          <div className="flex gap-2">
            {['All', 'Technology', 'Banking', 'Energy'].map((filter) => (
              <button key={filter} type="button" aria-pressed={sectorFilter === filter.toLowerCase()} onClick={() => setSectorFilter(filter.toLowerCase())} className={`rounded-full border px-3 py-2 text-sm font-bold text-black ${sectorFilter === filter.toLowerCase() ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700'}`}>{filter}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((stock) => (
            <div key={stock.ticker} className="card-surface rounded-3xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{stock.name}</div>
                  <div className="text-sm text-slate-400">{stock.ticker}</div>
                </div>
                <PriceTrend value={stock.changePercent} />
              </div>
              <div className="text-2xl font-bold text-white">₹{stock.price.toFixed(2)}</div>
              <div className="mt-4 flex justify-between text-sm text-slate-400">
                <span>{stock.sector}</span>
                <span>{stock.marketStatus}</span>
              </div>
              <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...Array(8)].map((_, index) => ({ value: stock.price * (0.98 + index * 0.01) }))}>
                    <Line type="monotone" dataKey="value" stroke={stock.changePercent >= 0 ? '#34d399' : '#f87171'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/stocks/${stock.ticker}`} className="flex-1 rounded-full bg-cyan-500 px-3 py-2 text-center text-sm font-semibold text-slate-950">View</Link>
                <button
                  onClick={() => {
                    setTradeMode('BUY');
                    setTradeStock(stock);
                  }}
                  className="rounded-full border border-slate-700 px-3 py-2 text-sm font-bold text-black"
                >
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </AppFrame>
      <TradeModal stock={tradeStock} isOpen={Boolean(tradeStock)} mode={tradeMode} onClose={() => setTradeStock(null)} onTrade={handleTrade} />
    </>
  );
}

function StockDetailPage() {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [stockError, setStockError] = useState('');
  const [explain, setExplain] = useState(null);
  const [tradeStock, setTradeStock] = useState(null);
  const [tradeMode, setTradeMode] = useState('BUY');
  const { updateUser } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/stocks/${ticker}`);
        setStock(response.data.stock);
        setExplain(response.data.explain);
      } catch (error) {
        setStock(null);
        setStockError(error.response?.status === 404 ? 'This stock is not in the simulated market catalog.' : 'Could not load the simulated stock quote. Check the API connection and try again.');
      }
    };
    load();
  }, [ticker]);

  const handleTrade = async ({ stock: stockTicker, quantity, side, orderType, price }) => {
    try {
      const response = await api.post('/orders/place', { stock: stockTicker, quantity, side, orderType, price });
      updateUser((previousUser) => ({ ...previousUser, virtualCash: response.data.remainingCash }));
      setTradeStock(null);
      window.dispatchEvent(new CustomEvent('divyatrades:refresh'));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  if (!stock) {
    return (
      <AppFrame title={stockError ? 'Stock unavailable' : 'Loading...'} subtitle={stockError || 'Fetching simulated market details.'}>
        {stockError && <Link to="/markets" className="inline-flex rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Back to simulated stocks</Link>}
      </AppFrame>
    );
  }

  const chartData = [
    { name: '1D', value: stock.price - 10 },
    { name: '1W', value: stock.price - 18 },
    { name: '1M', value: stock.price + 35 },
    { name: '6M', value: stock.price + 130 },
    { name: '1Y', value: stock.price + 250 },
    { name: '5Y', value: stock.price + 480 },
  ];

  return (
    <>
      <AppFrame title={stock.name} subtitle={`${stock.ticker} • ${stock.sector}`}>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <div className="card-surface rounded-3xl p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-400">Current price</div>
                  <div className="mt-2 text-4xl font-bold text-white">₹{stock.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Day change</div>
                  <div className="mt-2 text-lg text-emerald-300">+₹{(stock.price * (stock.changePercent / 100)).toFixed(2)}</div>
                  <div className="text-sm text-emerald-300">{stock.changePercent.toFixed(2)}%</div>
                </div>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-surface rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Explain This Stock</h3>
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Educational only</span>
              </div>
              <p className="text-slate-300">{explain?.summary}</p>
              <div className="mt-5 space-y-3">
                {(explain?.simpleWords || []).map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-200">{item}</div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                Educational content is informational, not financial advice.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface rounded-3xl p-5">
              <h3 className="text-lg font-semibold text-white">Trade {stock.ticker}</h3>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setTradeMode('BUY');
                    setTradeStock(stock);
                  }}
                  className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950"
                >
                  Buy
                </button>
                <button
                  onClick={() => {
                    setTradeMode('SELL');
                    setTradeStock(stock);
                  }}
                  className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-slate-950"
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="card-surface rounded-3xl p-5">
              <h3 className="text-lg font-semibold text-white">Key statistics</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
                {[
                  ['Market cap', '₹19.4T'],
                  ['P/E ratio', '24.8'],
                  ['EPS', '58.4'],
                  ['52W high', '₹1555'],
                  ['52W low', '₹1210'],
                  ['Dividend yield', '0.8%'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-3">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</div>
                    <div className="mt-1 font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface rounded-3xl p-5">
              <h3 className="text-lg font-semibold text-white">Risk indicator</h3>
              <div className="mt-3 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-200">Moderate</div>
              <p className="mt-3 text-sm text-slate-300">The company has strong business scale and sector momentum, but volatility remains moderate due to cyclical demand and valuation sensitivity.</p>
            </div>
          </div>
        </div>
      </AppFrame>
      <TradeModal stock={tradeStock} isOpen={Boolean(tradeStock)} mode={tradeMode} onClose={() => setTradeStock(null)} onTrade={handleTrade} />
    </>
  );
}

function WatchlistPage() {
  const [watchlists, setWatchlists] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/watchlists');
        setWatchlists(response.data.watchlists || []);
      } catch (error) {
        console.warn('Could not load account watchlists.', error.message);
        setWatchlists([]);
      }
    };
    load();
  }, []);

  return (
    <AppFrame title="Watchlist" subtitle="Track the names you care about most.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {watchlists.length ? watchlists.map((list) => (
          <div key={list.id} className="card-surface rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{list.name}</h3>
              <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">{list.items.length} stocks</span>
            </div>
            <div className="space-y-3">
              {list.items.map((ticker) => (
                <Link key={`${list.id}-${ticker}`} to={`/stocks/${ticker}`} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400">
                  <span>{ticker}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        )) : (
          <div className="card-surface rounded-3xl p-8 text-slate-300">Your watchlist is empty.</div>
        )}
      </div>
    </AppFrame>
  );
}

function PortfolioPage() {
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState({ investedAmount: 0, currentPortfolioValue: 0, availableCash: 0, totalProfit: 0, todayProfit: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [holdingsResponse, summaryResponse] = await Promise.all([
          api.get('/portfolio/holdings'),
          api.get('/portfolio/summary'),
        ]);
        setHoldings(holdingsResponse.data.holdings || []);
        setSummary(summaryResponse.data);
      } catch (error) {
        console.warn('Could not load portfolio from the account.', error.message);
      }
    };
    load();
  }, []);

  const sectorTotals = holdings.reduce((totals, holding) => {
    totals[holding.sector] = (totals[holding.sector] || 0) + holding.currentValue;
    return totals;
  }, {});
  const allocationTotal = Object.values(sectorTotals).reduce((sum, value) => sum + value, 0);
  const portfolioAllocationData = Object.entries(sectorTotals).map(([name, amount]) => ({
    name,
    amount,
    value: allocationTotal ? (amount / allocationTotal) * 100 : 0,
  }));

  return (
    <AppFrame title="Portfolio" subtitle="Review holding value, performance and exposure.">
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total investment', summary.investedAmount],
          ['Current portfolio value', summary.currentPortfolioValue],
          ['Available cash', summary.availableCash],
          ['Total P&L', summary.totalProfit],
          ["Today's P&L", summary.todayProfit],
        ].map(([label, value]) => (
          <div key={label} className="card-surface rounded-2xl p-4">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="mt-2 text-lg font-semibold text-white">{formatMoney(value)}</div>
          </div>
        ))}
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface min-w-0 rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Holdings</h3>
            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Portfolio Health: 78/100</span>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Avg Price</th>
                  <th className="pb-3">Current Price</th>
                  <th className="pb-3">Invested</th>
                  <th className="pb-3">Current Value</th>
                  <th className="pb-3">P&L</th>
                  <th className="pb-3">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  return (
                    <tr key={holding.stock} className="border-t border-slate-700/80 text-slate-200">
                      <td className="py-3 font-medium text-white">{holding.stock}</td>
                      <td className="py-3">{holding.quantity}</td>
                      <td className="py-3">₹{holding.averagePrice.toFixed(2)}</td>
                      <td className="py-3">₹{holding.currentPrice.toFixed(2)}</td>
                      <td className="py-3">{formatMoney(holding.investedAmount)}</td>
                      <td className="py-3">{formatMoney(holding.currentValue)}</td>
                      <td className={`py-3 ${holding.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{formatMoney(holding.pnl)}</td>
                      <td className={`py-3 ${holding.pnlPercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{holding.pnlPercent.toFixed(2)}%</td>
                    </tr>
                  );
                })}
                {!holdings.length && <tr><td colSpan={8} className="py-8 text-center text-slate-400">No holdings yet. Place a simulated BUY order to get started.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-surface min-w-0 rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-white">Allocation</h3>
          {portfolioAllocationData.length ? <>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={portfolioAllocationData} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={5}>
                  {portfolioAllocationData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {portfolioAllocationData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />{entry.name}</div>
                <span>{entry.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          </> : <p className="mt-4 text-sm text-slate-400">Allocation appears after you buy simulated shares.</p>}
        </div>
      </div>

      <div className="mt-6 card-surface min-w-0 rounded-3xl p-5">
        <h3 className="text-lg font-semibold text-white">Illustrative portfolio trend</h3>
        <p className="text-sm text-slate-400">Sample values, not account performance.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardChartData}>
              <defs>
                <linearGradient id="portfolioGraph" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" hide />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#portfolioGraph)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppFrame>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/orders/history');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.warn('Could not load account order history.', error.message);
      }
    };
    load();
  }, []);

  const visibleOrders = orderFilter === 'ALL' ? orders : orders.filter((order) => order.side === orderFilter);

  return (
    <AppFrame title="Order History" subtitle="Paper Trading — Simulated Orders">
      <div className="card-surface rounded-3xl p-5">
        <div className="mb-4 flex gap-2 text-sm">
          {['ALL', 'BUY', 'SELL'].map((filter) => (
            <button key={filter} type="button" aria-pressed={orderFilter === filter} onClick={() => setOrderFilter(filter)} className={`rounded-full border px-3 py-2 ${orderFilter === filter ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-slate-200'}`}>{filter}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order._id} className="border-t border-slate-700/80">
                  <td className="py-3 text-slate-300">{new Date(order.createdAt).toLocaleString('en-IN')}</td>
                  <td className="py-3 font-medium text-white">{order.stock}</td>
                  <td className="py-3 text-slate-200">{order.side}</td>
                  <td className="py-3">{order.quantity}</td>
                  <td className="py-3">₹{Number(order.price).toFixed(2)}</td>
                  <td className="py-3">₹{Number(order.total).toLocaleString('en-IN')}</td>
                  <td className="py-3"><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">{order.status}</span></td>
                </tr>
              ))}
              {!visibleOrders.length && <tr><td colSpan={7} className="py-8 text-center text-slate-400">{orders.length ? 'No orders match this filter.' : 'No simulated orders yet.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppFrame>
  );
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('ALL');

  useEffect(() => {
    api.get('/transactions')
      .then((response) => setTransactions(response.data.transactions || []))
      .catch((error) => console.warn('Could not load account transactions.', error.message));
  }, []);

  const visibleTransactions = transactions.filter((transaction) => {
    if (transactionFilter === 'BUY' || transactionFilter === 'SELL') return transaction.type === transactionFilter;
    if (transactionFilter === 'MONTH') {
      const date = new Date(transaction.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <AppFrame title="Transactions" subtitle="Complete history of your simulated trades.">
      <div className="card-surface rounded-3xl p-5">
        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {[
            ['ALL', 'All'],
            ['BUY', 'BUY'],
            ['SELL', 'SELL'],
            ['MONTH', 'This month'],
          ].map(([filter, label]) => (
            <button key={filter} type="button" aria-pressed={transactionFilter === filter} onClick={() => setTransactionFilter(filter)} className={`rounded-full border px-3 py-2 ${transactionFilter === filter ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-slate-200'}`}>{label}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-700/80 text-slate-200">
                  <td className="py-3">{new Date(tx.date).toLocaleString('en-IN')}</td>
                  <td className="py-3 font-medium text-white">{tx.stock}</td>
                  <td className={`py-3 ${tx.type === 'BUY' ? 'text-emerald-300' : 'text-rose-300'}`}>{tx.type}</td>
                  <td className="py-3">{tx.quantity}</td>
                  <td className="py-3">₹{Number(tx.price).toFixed(2)}</td>
                  <td className="py-3">₹{Number(tx.total).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!visibleTransactions.length && <tr><td colSpan={6} className="py-8 text-center text-slate-400">{transactions.length ? 'No transactions match this filter.' : 'No transactions yet.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppFrame>
  );
}

function NewsPage() {
  const [news, setNews] = useState([
    { title: 'Indian benchmark indices recover after strong banking buying', summary: 'Banking and IT stocks helped benchmarks rebound as investors rotate into large caps.', source: 'Market Pulse', timestamp: '2h ago', category: 'Market' },
    { title: 'Auto makers signal stronger demand as festive sales pick up', summary: 'Analysts expect improved production volumes in the quarter ahead.', source: 'TradeWire', timestamp: '3h ago', category: 'Stocks' },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/news');
        setNews(response.data.news || news);
      } catch (error) {
        console.warn('Fallback news loaded.', error.message);
      }
    };
    load();
  }, []);

  return (
    <AppFrame title="Market News" subtitle="Keep an eye on market events, sector rotation and macro updates.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <article key={item.title} className="card-surface rounded-3xl p-5">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-cyan-300">
              <span>{item.category}</span>
              <span>{item.timestamp}</span>
            </div>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{item.summary}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
              <span>{item.source}</span>
              <ChevronRight size={16} />
            </div>
          </article>
        ))}
      </div>
    </AppFrame>
  );
}

function LearningPage() {
  return (
    <AppFrame title="Learning Center" subtitle="Learn before you trade with beginner-friendly modules and progress tracking.">
      <div className="mb-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
        <div className="flex items-center gap-3 text-cyan-200"><Target size={18} /> Learn Before You Trade</div>
        <p className="mt-2 text-sm text-cyan-100">A thoughtful, education-first approach helps you build confidence and improve risk awareness before making any decision.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {learningModules.map((item) => (
          <div key={item.id} className="card-surface rounded-3xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{item.title}</div>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.level}</span>
            </div>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${item.progress}%` }} />
            </div>
            <div className="text-sm text-slate-300">Progress: {item.progress}%</div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

function JournalPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/journal');
        setEntries(response.data.entries || []);
      } catch (error) {
        console.warn('Could not load account journal.', error.message);
      }
    };
    load();
  }, []);

  return (
    <AppFrame title="Investment Journal" subtitle="Capture trade rationale, outcomes and lessons for future decisions.">
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={`${entry.stock}-${entry.reason}`} className="card-surface rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{entry.stock}</div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${entry.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{entry.action}</span>
            </div>
            <div className="text-sm text-slate-300">{entry.reason}</div>
            <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-200">{entry.outcome}</div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  return (
    <AppFrame title="Profile" subtitle="Manage your account, preferences and security settings.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card-surface rounded-3xl p-5 text-center">
          <img src={profileLogo} alt="DivyaTrades logo" className="mx-auto mb-4 h-40 w-40 rounded-2xl object-cover" />
          <h3 className="text-2xl font-semibold text-white">{user?.name}</h3>
          <div className="mt-2 text-slate-400">{user?.email}</div>
        </div>
        <div className="space-y-6">
          <div className="card-surface rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-white">Account details</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Name</div><div className="mt-1 text-white">{user?.name}</div></div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Email</div><div className="mt-1 text-white">{user?.email}</div></div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Phone</div><div className="mt-1 text-white">{user?.phone || 'Not provided'}</div></div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Created</div><div className="mt-1 text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</div></div>
            </div>
          </div>

          <div className="card-surface rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-white">Settings</h3>
            <div className="mt-4 space-y-3 text-slate-200">
              <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><span>Dark mode</span><span className="text-cyan-300">Enabled</span></div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><span>Notifications</span><span className="text-cyan-300">On</span></div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 p-3"><span>Security</span><span className="text-cyan-300">Protected</span></div>
              <Link to="/settings" className="block w-full rounded-2xl border border-slate-700 bg-slate-800/60 p-3 text-left text-slate-100">Change password</Link>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function SettingsPage() {
  return (
    <AppFrame title="Settings" subtitle="Adjust trading preferences and account controls.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-white">Preferences</h3>
          <div className="mt-4 space-y-3">
            {[
              ['Theme', 'Dark mode'],
              ['Notifications', 'Enabled'],
              ['Market alerts', 'On'],
              ['Risk reminders', 'Enabled'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 p-3 text-slate-200">
                <span>{label}</span>
                <span className="text-cyan-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-3xl p-5">
          <h3 className="text-lg font-semibold text-white">Security</h3>
          <div className="mt-4 space-y-3 text-slate-200">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-sm text-slate-400">Password</div>
              <div className="mt-2 font-medium text-white">Last updated 2 weeks ago</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-sm text-slate-400">Two-step verification</div>
              <div className="mt-2 font-medium text-white">Not enabled</div>
            </div>
            <Link to="/forgot-password" className="block rounded-2xl bg-cyan-500 px-4 py-3 text-center font-semibold text-slate-950">Reset password</Link>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function AdminPage() {
  const [metrics, setMetrics] = useState({ totalUsers: 12, activeUsers: 8, totalTrades: 148, totalPortfolioValue: 5428600, mostTradedStocks: ['RELIANCE', 'TCS', 'INFY'] });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setMetrics(response.data.metrics || metrics);
      } catch (error) {
        console.warn('Falling back to demo admin metrics.', error.message);
      }
    };
    load();
  }, []);

  return (
    <AppFrame title="Admin dashboard" subtitle="Platform analytics and operations overview.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total users', metrics.totalUsers],
          ['Active users', metrics.activeUsers],
          ['Total virtual trades', metrics.totalTrades],
          ['Total portfolio value', formatCompact(metrics.totalPortfolioValue)],
          ['Most traded stocks', metrics.mostTradedStocks.join(', ')],
        ].map(([label, value]) => (
          <div key={label} className="card-surface rounded-3xl p-5">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/markets" element={<ProtectedRoute><StockExplorerPage /></ProtectedRoute>} />
      <Route path="/stocks/:ticker" element={<ProtectedRoute><StockDetailPage /></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default App;
