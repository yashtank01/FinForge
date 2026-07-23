import { useState, useEffect } from 'react';
import { Target, PlusCircle, Trash2 } from 'lucide-react';

export default function Goals() {
  // FAST LOAD CACHE
  const [goals, setGoals] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_goals')) || [];
  });
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '2026-12-31' });
  const [customAmounts, setCustomAmounts] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchGoals = async () => {
    const res = await fetch(`https://finforge-backend-dvlz.onrender.com/api/goals/${user.id}`);
    const data = await res.json();
    setGoals(data);
    sessionStorage.setItem('cached_goals', JSON.stringify(data)); // Update Cache
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://finforge-backend-dvlz.onrender.com/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: user.id })
    });
    setForm({ title: '', targetAmount: '', deadline: '2026-12-31' });
    fetchGoals();
  };

  const handleAddFunds = async (goalId, amount) => {
    await fetch(`https://finforge-backend-dvlz.onrender.com/api/goals/${goalId}/add`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    fetchGoals(); 
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Delete this goal?")) return;
    await fetch(`https://finforge-backend-dvlz.onrender.com/api/goals/${goalId}`, { method: 'DELETE' });
    fetchGoals(); 
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Savings Goals</h1>
        <p className="text-slate-500 mt-1">Set financial targets and watch your progress.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Goal Name</label>
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="e.g. New Laptop" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target (₹)</label>
            <input type="number" required value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="50000" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 transition-colors">
            <PlusCircle size={18} /> Add Goal
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 && <p className="text-slate-500 col-span-full">No goals set yet.</p>}
        {goals.map((goal) => {
          const progress = Math.min(((goal.currentAmount / goal.targetAmount) * 100), 100).toFixed(1);
          const customValue = customAmounts[goal._id] || '';
          
          return (
            <div key={goal._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 text-rose-600 p-3 rounded-xl"><Target size={24} /></div>
                    <h3 className="text-xl font-bold text-slate-800">{goal.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{progress}%</span>
                    <button onClick={() => handleDelete(goal._id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-500">Saved: ₹{goal.currentAmount.toLocaleString()}</span>
                    <span className="text-slate-800">Target: ₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <input type="number" placeholder="Amount ₹" value={customValue} onChange={(e) => setCustomAmounts({...customAmounts, [goal._id]: e.target.value})} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                <button onClick={() => { if(customValue) handleAddFunds(goal._id, Number(customValue)); setCustomAmounts({...customAmounts, [goal._id]: ''}); }} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Add</button>
                <button onClick={() => { if(customValue) handleAddFunds(goal._id, -Number(customValue)); setCustomAmounts({...customAmounts, [goal._id]: ''}); }} className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-3 py-2 rounded-lg transition-colors">Withdraw</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}  