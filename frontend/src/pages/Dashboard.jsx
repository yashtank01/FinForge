import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Bell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // PRO TRICK: Instantly load cached data if it exists, otherwise start empty.
  // This completely eliminates the loading screen!
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_trans')) || [];
  });
  const [habits, setHabits] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_habits')) || [];
  }); 

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch Transactions
        const transRes = await fetch(`http://localhost:5000/api/transactions/${user.id}`);
        const transData = await transRes.json();
        const sortedTrans = transData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update state AND update the cache for next time
        setTransactions(sortedTrans);
        sessionStorage.setItem('cached_trans', JSON.stringify(sortedTrans));

        // Fetch Habits
        const habRes = await fetch(`http://localhost:5000/api/habits/${user.id}`);
        const habData = await habRes.json();
        
        // Update state AND update the cache for next time
        setHabits(habData);
        sessionStorage.setItem('cached_habits', JSON.stringify(habData));
        
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    // Quietly fetch fresh data in the background every time the page loads
    fetchDashboardData();
  }, [user, navigate]);

  // Dynamic Math Calculations based on Real Data
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const investments = transactions.filter(t => t.type === 'investment').reduce((acc, t) => acc + t.amount, 0);

  const netSavings = income - expenses - investments; 
  const netWorth = netSavings + investments; 

  const today = new Date().toDateString();
  const pendingHabitsCount = habits.filter(h => 
    h.frequency === 'Daily' && (!h.lastCompleted || new Date(h.lastCompleted).toDateString() !== today)
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Financial Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-emerald-600">{user?.name}</span>! Here is your real-time financial health.</p>
        
        {pendingHabitsCount > 0 && (
          <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl shadow-sm animate-pulse">
            <Bell size={20} className="text-blue-500" />
            <span className="font-medium text-sm">
              Reminder: You have {pendingHabitsCount} daily habit{pendingHabitsCount > 1 ? 's' : ''} left to complete today. Keep your streak alive!
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Net Worth</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{netWorth.toLocaleString()}</h3>
            </div>
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Wallet size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Income</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{income.toLocaleString()}</h3>
            </div>
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1">₹{expenses.toLocaleString()}</h3>
            </div>
            <div className="bg-red-100 text-red-600 p-2 rounded-xl"><TrendingDown size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Investments</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">₹{investments.toLocaleString()}</h3>
            </div>
            <div className="bg-purple-100 text-purple-600 p-2 rounded-xl"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No transactions found.</p>
            <p className="text-sm text-slate-400 mt-1">Start tracking your income and expenses to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t, index) => (
              <div key={index} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 
                    t.type === 'investment' ? 'bg-purple-100 text-purple-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{t.title}</h4>
                    <p className="text-xs text-slate-500">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <span className={`font-bold ${
                  t.type === 'income' ? 'text-emerald-600' : 
                  t.type === 'investment' ? 'text-purple-600' : 
                  'text-red-500'
                }`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}