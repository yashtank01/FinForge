import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Activity, Target, PieChart, MessageSquare, LogOut, Menu, ChevronLeft, Shield, ShieldCheck } from 'lucide-react';

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Habits', path: '/habits', icon: Activity },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Support', path: '/support', icon: MessageSquare },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      
      {/* Header & Toggle Button */}
      <div className="flex items-center justify-between p-4 h-20 border-b border-slate-800">
        {isSidebarOpen && (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl tracking-tight">
            <ShieldCheck size={24} /> FinForge
          </div>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors mx-auto"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'hover:bg-slate-800 hover:text-slate-100'} ${!isSidebarOpen && 'justify-center'}`}
              title={link.name}
            >
              <Icon size={20} />
              {isSidebarOpen && <span className="font-medium">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section (Logout & Admin) */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={handleLogout} 
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          title="Logout"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
        
        <Link 
          to="/admin" 
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-100 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          title="Admin Panel"
        >
          <Shield size={20} />
          {isSidebarOpen && <span className="font-medium text-sm">Admin Panel</span>}
        </Link>
      </div>
    </div>
  );
}