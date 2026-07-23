import { useNavigate } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Target, Activity, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    // Changed to h-screen and flex-col to force single-screen fit
    <div className="relative h-screen bg-slate-50 font-sans selection:bg-emerald-200 overflow-hidden flex flex-col">
      
      {/* Custom Animations */}
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }
          .animate-slide-up {
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-glow {
            animation: pulseGlow 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/40 rounded-full blur-[100px] animate-glow -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[120px] animate-glow -z-10" style={{ animationDelay: '2s' }}></div>

      {/* Navbar (Reduced padding slightly to save vertical space) */}
      <nav className="relative flex items-center justify-between p-5 max-w-7xl mx-auto w-full opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white p-2 rounded-xl">
            <ShieldCheck size={28} />
          </div>
        
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">FinForge</span>
        </div>
        
        <button 
          onClick={() => navigate('/auth')}
          className="text-emerald-600 font-semibold border-2 border-emerald-500 hover:bg-emerald-50 px-6 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-emerald-500/20"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section (Uses flex-1 to center content vertically in remaining space) */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 w-full pb-8 text-center">
        
        {/* Adjusted text sizing and margins to prevent overflowing the screen */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Master your money.<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            Build your future.
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          The ultimate platform to track your expenses, grow your wealth, and build unbreakable financial habits. Stop guessing, start growing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={() => navigate('/auth', { state: { isSignup: true } })}
            className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1"
          >
            Start Building Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Cards (Reduced padding and margins to fit on one screen) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-float">
              <Activity size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Habit Tracking</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Build daily streaks for saving and logging expenses. Turn financial discipline into a game you actually want to play.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group opacity-0 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Wealth Analytics</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Visualize your net worth growth and monthly spending breakdowns with beautiful, interactive charts.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group opacity-0 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '1s' }}>
              <Target size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Savings Goals</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Set custom financial targets for emergencies or vacations, and watch your progress bars fill up over time.</p>
          </div>
          
        </div>
      </main>
    </div>
  );
}