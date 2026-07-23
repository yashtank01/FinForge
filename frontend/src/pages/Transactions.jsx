import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';

export default function Transactions() {
  // FAST LOAD CACHE
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_trans')) || [];
  });
  const [form, setForm] = useState({ title: '', amount: '', category: 'General', type: 'expense' });
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTransactions = async () => {
    const res = await fetch(`http://localhost:5000/api/transactions/${user.id}`);
    const data = await res.json();
    const sortedTrans = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setTransactions(sortedTrans);
    sessionStorage.setItem('cached_trans', JSON.stringify(sortedTrans)); // Update Cache
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: user.id })
    });
    setForm({ title: '', amount: '', category: 'General', type: 'expense' }); 
    fetchTransactions(); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
        <p className="text-slate-500 mt-1">Log your income, expenses, and investments below.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</label>
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="e.g. Salary, Groceries" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount (₹)</label>
            <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="5000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-emerald-500 outline-none">
              <option value="General">General</option>
              <option value="Salary">Salary</option>
              <option value="Housing">Housing</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Investment">Investment</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-emerald-500 outline-none">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 transition-colors">
            <PlusCircle size={18} /> Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Your History</h3>
        <div className="space-y-4">
          {transactions.length === 0 ? <p className="text-slate-500">No transactions logged yet.</p> : null}
          {transactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : t.type === 'investment' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{t.title}</h4>
                  <p className="text-xs text-slate-500">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : t.type === 'investment' ? 'text-purple-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}