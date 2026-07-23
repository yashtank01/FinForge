import { useState, useEffect } from 'react';
import { Activity, PlusCircle, CheckCircle, Flame, CalendarClock, Trash2 } from 'lucide-react';

export default function Habits() {
  // FAST LOAD CACHE
  const [habits, setHabits] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_habits')) || [];
  });
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchHabits = async () => {
    const res = await fetch(`http://localhost:5000/api/habits/${user.id}`);
    const data = await res.json();
    setHabits(data);
    sessionStorage.setItem('cached_habits', JSON.stringify(data)); // Update Cache
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, frequency, userId: user.id })
    });
    setTitle('');
    setFrequency('Daily');
    fetchHabits();
  };

  const handleComplete = async (habitId) => {
    await fetch(`http://localhost:5000/api/habits/${habitId}/complete`, { method: 'PUT' });
    fetchHabits(); 
  };

  const handleDelete = async (habitId) => {
    if (!window.confirm("Delete this habit?")) return;
    await fetch(`http://localhost:5000/api/habits/${habitId}`, { method: 'DELETE' });
    fetchHabits(); 
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Financial Habits</h1>
        <p className="text-slate-500 mt-1">Build discipline for saving and logging expenses.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">New Habit</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="e.g. Save ₹100..." />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <button type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <PlusCircle size={20} /> Create Habit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 && <p className="text-slate-500 col-span-full">No habits created yet. Start building discipline today!</p>}
        {habits.map((habit) => {
          const isCompletedToday = habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
          return (
            <div key={habit._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Activity size={24} /></div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold"><Flame size={16} /> {habit.streak || 0} Streak</div>
                    <button onClick={() => handleDelete(habit._id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{habit.title}</h3>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"><CalendarClock size={14} /> {habit.frequency || 'Daily'}</div>
              </div>
              <button onClick={() => handleComplete(habit._id)} disabled={isCompletedToday} className={`mt-6 w-full font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 ${isCompletedToday ? 'bg-emerald-500 text-white cursor-not-allowed shadow-md shadow-emerald-500/30' : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200'}`}><CheckCircle size={18} /> {isCompletedToday ? 'Completed Today!' : 'Mark Complete'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}