import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard', icon: '⊞', exact: true },
  { to: '/patients', label: 'Patients', icon: '👤' },
  { to: '/doctors', label: 'Doctors', icon: '🩺' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/patients/new', label: 'Add Patient', icon: '＋', divider: true },
];

export default function Sidebar() {
  const loc = useLocation();
  return (
    <aside style={{
      width: 230, minHeight: '100vh', background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      borderRight: '1px solid #1e293b'
    }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>🏥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', letterSpacing: '-0.01em' }}>Rural Health</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>Record Management</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map((item, i) => (
          <React.Fragment key={item.to}>
            {item.divider && <div style={{ height: 1, background: '#1e293b', margin: '8px 6px' }} />}
            <NavLink to={item.to} end={item.exact}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#1e40af' : 'transparent',
                transition: 'all 0.12s'
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#e2e8f0'; }}
              onMouseLeave={e => { if (!e.currentTarget.querySelector('a[aria-current]')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}>
              <span style={{ fontSize: 16, opacity: 0.9 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 11, color: '#334155', fontWeight: 600, marginBottom: 4 }}>BMSIT&M Mini Project</div>
        <div style={{ fontSize: 11, color: '#1e293b' }}>Rural Healthcare · 2026</div>
      </div>
    </aside>
  );
}
