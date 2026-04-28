'use client';
import { useState, useEffect, useRef } from 'react';
import { Users, PhoneOutgoing, Calendar as CalendarIcon, Activity, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Pause, TrendingUp, BarChart3, PieChart, AlertTriangle, Phone, UserCheck, XCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RPieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { name: 'Mon', appointments: 40, calls: 24, noShows: 3 },
  { name: 'Tue', appointments: 30, calls: 13, noShows: 1 },
  { name: 'Wed', appointments: 20, calls: 58, noShows: 5 },
  { name: 'Thu', appointments: 27, calls: 39, noShows: 2 },
  { name: 'Fri', appointments: 18, calls: 48, noShows: 4 },
  { name: 'Sat', appointments: 23, calls: 38, noShows: 1 },
  { name: 'Sun', appointments: 34, calls: 43, noShows: 2 },
];

const monthlyData = [
  { name: 'Wk 1', appointments: 180, calls: 120, noShows: 12 },
  { name: 'Wk 2', appointments: 210, calls: 145, noShows: 8 },
  { name: 'Wk 3', appointments: 195, calls: 160, noShows: 15 },
  { name: 'Wk 4', appointments: 240, calls: 190, noShows: 6 },
];

const callOutcomeData = [
  { name: 'Confirmed', value: 68, color: '#30D158' },
  { name: 'Rescheduled', value: 15, color: '#FF9F0A' },
  { name: 'No Answer', value: 12, color: '#636366' },
  { name: 'Cancelled', value: 5, color: '#FF453A' },
];

const hourlyLoad = [
  { hour: '8AM', load: 40 }, { hour: '9AM', load: 75 }, { hour: '10AM', load: 95 },
  { hour: '11AM', load: 88 }, { hour: '12PM', load: 55 }, { hour: '1PM', load: 70 },
  { hour: '2PM', load: 92 }, { hour: '3PM', load: 85 }, { hour: '4PM', load: 60 },
  { hour: '5PM', load: 30 },
];

const INITIAL_CALLS = [
  { id: 1, name: "Eleanor Vance", status: "Confirming Procedure", seconds: 72, type: "Outbound", outcome: null },
  { id: 2, name: "Dr. Jonathan Reyes", status: "Answering Insurance Query", seconds: 225, type: "Inbound", outcome: null },
  { id: 3, name: "Samantha Hughes", status: "Rescheduling MRI", seconds: 45, type: "Outbound", outcome: null },
];

const NEW_PATIENTS = ["Liam Sterling", "Olivia Chen", "Nathaniel Rossi", "Ava Sinclair", "Elijah Montgomery", "Sophia Patel", "Marcus Wellington", "Isabella Choi"];
const STATUSES = ["Dialing...", "Confirming Appointment", "Leaving Secure Voicemail", "Answering Pre-op Questions", "Processing Copay"];

export default function Dashboard() {
  const [isDialing, setIsDialing] = useState(false);
  const [activeCalls, setActiveCalls] = useState(INITIAL_CALLS);
  const [toastMessage, setToastMessage] = useState(null);
  const [chartRange, setChartRange] = useState('week');
  const [chartType, setChartType] = useState('area');
  const [liveMetrics, setLiveMetrics] = useState({ appointments: 42, successRate: 89.4, noShow: 3.2, utilization: 94, totalCalls: 187, completed: 156, avgDuration: '2:34' });
  const [completedToday, setCompletedToday] = useState(156);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleDialer = () => {
    if (!isDialing) {
      setIsDialing(true);
      showToast("AI Dialer Started: Calling 42 queued patients.");
    } else {
      setIsDialing(false);
      showToast("AI Dialer Paused.");
    }
  };

  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  // Real-time WebSocket Metrics with Singleton Pattern
  useEffect(() => {
    const connect = () => {
      // Don't connect if already connected or connecting
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      console.log('Attempting WebSocket connection...');
      const socket = new WebSocket('ws://localhost:8080/ws/metrics');
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket Connected Successfully');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveMetrics(prev => ({ ...prev, ...data }));
        } catch (e) {
          console.error('Error parsing WS data:', e);
        }
      };

      socket.onerror = (event) => {
        // Only log if it's not a voluntary close
        if (socket.readyState !== WebSocket.CLOSED) {
          console.error('WebSocket Error:', event);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket Connection Closed');
        socketRef.current = null;
        // Only reconnect if the component is still mounted
        reconnectTimerRef.current = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      console.log('Cleaning up WebSocket...');
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, []);

  // Simulate calls progressing
  useEffect(() => {
    let interval;
    if (isDialing) {
      interval = setInterval(() => {
        setActiveCalls(prev => {
          let updated = prev.map(c => ({ ...c, seconds: c.seconds + 1 }));
          if (Math.random() > 0.8 && updated.length > 0) {
            const finished = updated.shift();
            setCompletedToday(c => c + 1);
            const newCall = {
              id: Date.now(),
              name: NEW_PATIENTS[Math.floor(Math.random() * NEW_PATIENTS.length)],
              status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
              seconds: 0,
              type: "Outbound",
              outcome: null
            };
            updated.push(newCall);
          } else if (updated.length < 4 && Math.random() > 0.6) {
            const newCall = {
              id: Date.now(),
              name: NEW_PATIENTS[Math.floor(Math.random() * NEW_PATIENTS.length)],
              status: "Dialing...",
              seconds: 0,
              type: "Outbound",
              outcome: null
            };
            updated.push(newCall);
          }
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDialing]);

  const formatDuration = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const chartData = chartRange === 'week' ? weeklyData : monthlyData;

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: '50%', 
              zIndex: 9999,
              background: '#30D158',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'none'
            }}
          >
            <CheckCircle2 size={20} />
            <span style={{ letterSpacing: '0.01em' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="page-header flex-between" style={{ padding: '40px 48px 24px 48px' }}>
        <div>
          <h1 className="text-gradient">Dashboard Overview</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex-center" style={{ gap: '16px' }}>
          <div className="flex-center" style={{ gap: '8px', background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', borderRadius: '12px', padding: '4px' }}>
            <button onClick={() => setChartType('area')} style={{ padding: '8px 12px', borderRadius: '8px', background: chartType === 'area' ? 'rgba(255,255,255,0.1)' : 'transparent', color: chartType === 'area' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              <TrendingUp size={16} />
            </button>
            <button onClick={() => setChartType('bar')} style={{ padding: '8px 12px', borderRadius: '8px', background: chartType === 'bar' ? 'rgba(255,255,255,0.1)' : 'transparent', color: chartType === 'bar' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              <BarChart3 size={16} />
            </button>
          </div>
          <button 
            className="btn-primary" onClick={toggleDialer}
            style={{ background: isDialing ? 'var(--danger)' : 'var(--text-primary)', color: isDialing ? 'white' : 'var(--bg-primary)' }}
          >
            {isDialing ? <Pause size={18} /> : <PhoneOutgoing size={18} />}
            {isDialing ? 'Pause Campaigns' : 'Launch Outreach Campaign'}
          </button>
        </div>
      </header>

      <div className="content-padding" style={{ padding: '0 48px 40px 48px', flex: 1, overflowY: 'auto' }}>
        {/* Metric Cards */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <MetricCard title="Appointments Today" value={liveMetrics.appointments} trend="+12%" isPositive={true} icon={<CalendarIcon size={24} color="var(--accent-color)" />} delay={0.1} live />
          <MetricCard title="AI Call Success Rate" value={`${liveMetrics.successRate}%`} trend="+4.2%" isPositive={true} icon={<PhoneOutgoing size={24} color="var(--success)" />} delay={0.2} live />
          <MetricCard title="No-show Prediction" value={`${liveMetrics.noShow}%`} trend="-1.1%" isPositive={true} icon={<Users size={24} color="var(--warning)" />} delay={0.3} live />
          <MetricCard title="Clinic Utilization" value={`${liveMetrics.utilization}%`} trend="-2%" isPositive={false} icon={<Activity size={24} color="var(--danger)" />} delay={0.4} live />
        </div>
        {/* Predictive Insights Panel */}
        <motion.div className="glass-card" style={{ marginBottom: '32px', padding: '24px', background: 'rgba(162, 89, 255, 0.03)', border: '1px solid rgba(162, 89, 255, 0.15)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '16px', color: '#a259ff' }}><Sparkles size={20} /> Gemini Predictive Scheduling Insights</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px' }}>
            Based on patient demographic analysis, seasonal trend mapping, and automated traffic vectors, Gemini predicts:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '12px', border: '2px solid var(--glass-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>High Risk No-Shows</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--warning)' }}>4 Patients</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Suggested: Trigger automated pre-confirmation sequence via Twilio Voice.</div>
            </div>
            <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '12px', border: '2px solid var(--glass-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Telehealth Optimization</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--success)' }}>+18% Capacity</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Moving follow-ups to virtual links frees diagnostic equipment pipelines.</div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Stats Row */}
        <div className="grid-3" style={{ marginBottom: '32px', gap: '20px' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(48, 209, 88, 0.1)', padding: '10px', borderRadius: '12px' }}><Phone size={20} color="var(--success)" /></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Calls Today</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{liveMetrics.totalCalls}</div>
              </div>
            </div>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(209, 209, 214, 0.1)', padding: '10px', borderRadius: '12px' }}><UserCheck size={20} color="var(--accent-color)" /></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completed Calls</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{completedToday}</div>
              </div>
            </div>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(255, 159, 10, 0.1)', padding: '10px', borderRadius: '12px' }}><Clock size={20} color="var(--warning)" /></div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Avg Call Duration</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{liveMetrics.avgDuration}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid-2" style={{ marginBottom: '32px' }}>
          {/* Chart Section */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h3>Weekly Engagement</h3>
              <select value={chartRange} onChange={e => setChartRange(e.target.value)} style={{ background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'area' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a259ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a259ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderColor: 'var(--glass-border)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="appointments" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorAppointments)" />
                    <Area type="monotone" dataKey="calls" stroke="#a259ff" fillOpacity={1} fill="url(#colorCalls)" />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderColor: 'var(--glass-border)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="appointments" fill="var(--accent-color)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="calls" fill="#a259ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="flex-center" style={{ gap: '24px', marginTop: '16px' }}>
              <span className="flex-center" style={{ gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-color)' }}></span> Appointments
              </span>
              <span className="flex-center" style={{ gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a259ff' }}></span> AI Calls
              </span>
            </div>
          </motion.div>

          {/* Active Calls List */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h3>Active Outreach Campaigns</h3>
              <span className={`badge flex-center ${isDialing ? 'badge-accent' : ''}`} style={{ gap: '6px', background: !isDialing ? 'rgba(255,255,255,0.1)' : undefined }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isDialing ? 'var(--accent-color)' : 'gray', display: 'inline-block', animation: isDialing ? 'pulse 1.5s infinite' : 'none' }}></span>
                {activeCalls.length} Active
              </span>
            </div>
            <div className="flex-column" style={{ gap: '12px' }}>
              <AnimatePresence>
                {activeCalls.map(call => (
                  <motion.div key={call.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} layout>
                    <CallRow name={call.name} status={call.status} duration={formatDuration(call.seconds)} type={call.type} isDialing={isDialing} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeCalls.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active calls. Start the dialer to begin campaigning.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Call Outcomes + Hourly Load */}
        <div className="grid-2" style={{ marginBottom: '32px' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <h3 style={{ marginBottom: '24px' }}>Call Outcomes Today</h3>
            <div className="flex-center" style={{ gap: '32px' }}>
              <div style={{ width: '160px', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie data={callOutcomeData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                      {callOutcomeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-column" style={{ gap: '16px' }}>
                {callOutcomeData.map(item => (
                  <div key={item.name} className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', minWidth: '90px' }}>{item.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h3>Hourly Clinic Load</h3>
              <span className="badge badge-accent flex-center" style={{ gap: '4px' }}>
                <AlertTriangle size={12} /> Peak: 10 AM
              </span>
            </div>
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderColor: 'var(--glass-border)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value) => [`${value}%`, 'Load']} />
                  <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                    {hourlyLoad.map((entry, index) => (
                      <Cell key={index} fill={entry.load > 90 ? '#FF453A' : entry.load > 70 ? '#FF9F0A' : '#30D158'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}} />
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive, icon, delay, live }) {
  return (
    <motion.div 
      className="glass-card flex-column"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <div style={{ background: 'var(--glass-bg)', padding: '10px', borderRadius: '12px' }}>
          {icon}
        </div>
        <span className={`badge ${isPositive ? 'badge-success' : 'badge-danger'} flex-center`} style={{ gap: '4px' }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-muted" style={{ fontWeight: 500, marginBottom: '4px' }}>{title}</h4>
        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{value}</div>
          {live && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158', animation: 'pulse 2s infinite' }}></span>}
        </div>
      </div>
    </motion.div>
  );
}

function CallRow({ name, status, duration, type, isDialing }) {
  return (
    <div className="flex-between" style={{ padding: '14px 16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '2px solid var(--glass-border)' }}>
      <div className="flex-center" style={{ gap: '14px' }}>
        <div className="flex-center" style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDialing ? 'rgba(41, 151, 255, 0.1)' : 'rgba(255,255,255,0.05)', color: isDialing ? 'var(--accent-color)' : 'var(--text-muted)' }}>
          <PhoneOutgoing size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: isDialing ? 'var(--text-muted)' : 'gray', marginTop: '2px' }}>{status}</div>
        </div>
      </div>
      <div className="flex-column" style={{ alignItems: 'flex-end', gap: '2px' }}>
        <div className="flex-center" style={{ gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
          <Clock size={14} /> {duration}
        </div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{type}</div>
      </div>
    </div>
  );
}
