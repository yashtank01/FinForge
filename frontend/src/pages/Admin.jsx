import { useState, useEffect } from 'react';
import { Shield, Users, Activity, Target, Database, LogOut } from 'lucide-react';

export default function Admin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = () => {
    fetch('https://finforge-backend-dvlz.onrender.com/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStats();
    }
  }, [isAdminLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('https://finforge-backend-dvlz.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('adminToken', data.token);
      setIsAdminLoggedIn(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This permanently deletes the user and ALL their data!")) return;
    await fetch(`https://finforge-backend-dvlz.onrender.com/api/admin/users/${userId}`, { method: 'DELETE' });
    fetchStats();
  };

  const handleDeleteFeedback = async (feedbackId) => {
    await fetch(`https://finforge-backend-dvlz.onrender.com/api/feedback/${feedbackId}`, { method: 'DELETE' });
    fetchStats();
  };

  //ADMIN LOGIN SCREEN 
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-slate-900 text-white p-4 rounded-2xl mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal Access</h2>
          <p className="text-slate-500 text-sm mt-1">Authorized personnel only.</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Admin Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4" placeholder="Admin Email" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Master Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  //ADMIN DASHBOARD
  if (!stats) return <div className="text-slate-500 font-medium">Loading live database stats...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Analytics</h1>
          <p className="text-slate-500 mt-1">Live data feed from User.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors">
          <LogOut size={18} /> Exit Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Total Users</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalUsers}</h3>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Users size={24} /></div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Total Transactions</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalTransactions}</h3>
          </div>
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl"><Database size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Habits Tracked</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalHabits}</h3>
          </div>
          <div className="bg-orange-100 text-orange-600 p-3 rounded-xl"><Activity size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Goals Created</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalGoals}</h3>
          </div>
          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl"><Target size={24} /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent User Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">User Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Account ID</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers?.map(u => (
                <tr key={u._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{u._id}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">User Feedback & Complaints</h3>
        {stats.feedbacks?.length === 0 ? <p className="text-sm text-slate-500">No feedback submitted yet.</p> : (
          <div className="space-y-4">
            {stats.feedbacks?.map(fb => (
              <div key={fb._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-start gap-4">
                <div>
                  <span className="font-bold text-slate-800 text-sm">{fb.userName}</span>
                  <span className="text-xs text-slate-400 ml-2">{new Date(fb.date).toLocaleDateString()}</span>
                  <p className="text-slate-600 mt-1 text-sm">{fb.message}</p>
                </div>
                <button onClick={() => handleDeleteFeedback(fb._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}