import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, bg, trend, trendLabel }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="stat-icon" style={{ background: bg }}>{icon}</div>
      {trend && <span className="stat-trend" style={{ color: '#16a34a' }}>↑ {trend}</span>}
    </div>
    <div>
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
        <div>Loading dashboard...</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back — here's what's happening today</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/appointments/new" className="btn btn-outline">📅 New Appointment</Link>
          <Link to="/patients/new" className="btn btn-primary">+ Add Patient</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Patients" value={stats?.total_patients} icon="👥" bg="#eff6ff" />
        <StatCard label="Total Visits" value={stats?.total_visits} icon="🩺" bg="#f0fdf4" />
        <StatCard label="Visits Today" value={stats?.visits_today} icon="📋" bg="#fff7ed" />
        <StatCard label="This Month" value={stats?.this_month} icon="📈" bg="#faf5ff" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Visits</div>
            <Link to="/patients" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          <div>
            {!stats?.recent_visits?.length
              ? <div className="empty-state"><div className="empty-icon">🩺</div><h4>No visits yet</h4></div>
              : stats.recent_visits.map((v, i) => (
              <div key={i} style={{ padding: '13px 20px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  {v.patient_name?.split(' ').map(w => w[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{v.patient_name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{v.reason} · {v.village}</div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
                  {new Date(v.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Patient Distribution</div>
          </div>
          <div style={{ padding: '20px' }}>
            {stats?.gender_dist?.map(g => {
              const pct = stats.total_patients ? Math.round((g.count / stats.total_patients) * 100) : 0;
              const color = g.gender === 'Female' ? '#ec4899' : g.gender === 'Male' ? '#2563eb' : '#f59e0b';
              return (
                <div key={g.gender} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{g.gender}</span>
                    <span style={{ color: '#64748b' }}>{g.count} patients <span style={{ color, fontWeight: 700 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Link to="/patients" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>All Patients</Link>
              <Link to="/doctors" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>All Doctors</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '18px 24px', background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#bfdbfe', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Quick Action</div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>Register a new patient from the village</div>
            <div style={{ color: '#93c5fd', fontSize: 13, marginTop: 4 }}>Add their details, medical history and schedule first appointment</div>
          </div>
          <Link to="/patients/new" className="btn" style={{ background: '#fff', color: '#1d4ed8', fontWeight: 700, padding: '11px 22px', flexShrink: 0 }}>+ New Patient</Link>
        </div>
      </div>
    </div>
  );
}
