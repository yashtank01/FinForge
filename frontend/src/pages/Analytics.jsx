import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, LineChart, Line } from 'recharts';

export default function Analytics() {
  // FAST LOAD CACHE
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(sessionStorage.getItem('cached_trans')) || [];
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(`http://localhost:5000/api/transactions/${user.id}`);
      const data = await res.json();
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setTransactions(sortedData);
      sessionStorage.setItem('cached_trans', JSON.stringify(sortedData)); // Update Cache
    };
    fetchTransactions();
  }, [user.id]);

  const expenses = transactions.filter(t => t.type === 'expense');
  const expenseTitles = [...new Set(expenses.map(t => t.title))]; 
  const pieData = expenseTitles.map(title => {
    const total = expenses.filter(t => t.title === title).reduce((sum, t) => sum + t.amount, 0);
    return { name: title, value: total };
  });
  const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  const monthlyDataMap = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0, netSavings: 0 };
    if (t.type === 'income') acc[month].income += t.amount;
    if (t.type === 'expense') acc[month].expense += t.amount;
    acc[month].netSavings = acc[month].income - acc[month].expense;
    return acc;
  }, {});

  let runningNetWorth = 0;
  const chartData = Object.values(monthlyDataMap).map(data => {
    runningNetWorth += data.netSavings;
    return { ...data, netWorth: runningNetWorth };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Wealth Analytics</h1>
        <p className="text-slate-500 mt-1">Deep dive into your financial growth and spending patterns.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-sm">
          Add some income and expenses in the Transactions tab to see your charts come to life!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Net Worth Trajectory</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis width={80} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(val) => `₹${val.toLocaleString()}`} />
                    <ChartTooltip cursor={{stroke: '#cbd5e1', strokeWidth: 2}} formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} name="Net Worth" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Expense Breakdown</h3>
              {pieData.length > 0 ? (
                <>
                  <div className="h-48 my-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <PieTooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4 max-h-32 overflow-y-auto pr-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-slate-600 truncate max-w-[100px]">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="my-auto text-center text-slate-400 text-sm">No expenses logged yet.</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Cash Flow (Income vs Expenses)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis width={80} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(val) => `₹${val.toLocaleString()}`} />
                  <ChartTooltip cursor={{fill: '#f8fafc'}} formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}