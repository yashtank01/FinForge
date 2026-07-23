import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function Support() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://finforge-backend-dvlz.onrender.com/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.name, message })
    });
    setSubmitted(true);
    setMessage('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Support & Feedback</h1>
        <p className="text-slate-500 mt-1">Found a bug or have a suggestion? Let the Admin know.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-emerald-600">
            <CheckCircle size={48} className="mb-4" />
            <h3 className="text-xl font-bold">Feedback Sent!</h3>
            <p className="text-slate-500">Thank you for helping us improve FinForge.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Message</label>
              <textarea required value={message} onChange={e => setMessage(e.target.value)} rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Describe your issue or share your ideas..."></textarea>
            </div>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
              <Send size={18} /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}