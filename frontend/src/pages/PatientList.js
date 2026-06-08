import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPatients, deletePatient } from '../services/api';

const bloodColor = { 'A+':'badge-blue','A-':'badge-purple','B+':'badge-green','B-':'badge-teal','AB+':'badge-orange','AB-':'badge-red','O+':'badge-gray','O-':'badge-gray' };

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try { const r = await getPatients(search); setPatients(r.data.data); } catch {}
    setLoading(false);
  }, [search]);

  useEffect(() => { const t = setTimeout(fetchPatients, 300); return () => clearTimeout(t); }, [fetchPatients]);

  const filtered = filter === 'All' ? patients : patients.filter(p => p.gender === filter);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" and all their records?`)) return;
    await deletePatient(id).catch(() => {});
    fetchPatients();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Patients</div>
          <div className="page-subtitle">{filtered.length} record{filtered.length !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}</div>
        </div>
        <Link to="/patients/new" className="btn btn-primary">+ Add Patient</Link>
      </div>

      <div className="card" style={{ marginBottom: 18, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
        <input type="text" placeholder="Search by name, village or phone..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#1e293b', background: 'transparent' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {['All','Male','Female','Other'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
              style={{ background: filter === f ? '#2563eb' : '#f1f5f9', color: filter === f ? '#fff' : '#64748b', border: 'none', fontWeight: 600 }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading patients...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4>No patients found</h4>
            <p>Try a different search term or add a new patient</p>
            <Link to="/patients/new" className="btn btn-primary">Add First Patient</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>#</th><th>Patient</th><th>Age</th><th>Blood</th>
                <th>Village</th><th>Phone</th><th>Registered</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((p, i) => {
                  const age = Math.floor((new Date() - new Date(p.dob)) / (365.25*24*3600*1000));
                  const initials = p.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
                  const genderColor = p.gender==='Female'?'#fce7f3':p.gender==='Male'?'#eff6ff':'#fef9c3';
                  const genderText = p.gender==='Female'?'#9d174d':p.gender==='Male'?'#1d4ed8':'#854d0e';
                  return (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/patients/${p.id}`)}>
                      <td style={{ color: '#94a3b8', fontSize: 12 }}>#{p.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ background: genderColor, color: genderText, fontSize: 12 }}>{initials}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 600 }}>{age}</span> <span style={{ color: '#94a3b8' }}>yrs</span></td>
                      <td>{p.blood_type ? <span className={`badge ${bloodColor[p.blood_type]||'badge-gray'}`}>{p.blood_type}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.village || '—'}</div>
                        {p.district && <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.district}</div>}
                      </td>
                      <td style={{ color: '#2563eb', fontWeight: 500 }}>{p.phone || '—'}</td>
                      <td style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/patients/${p.id}`)}>View</button>
                          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/patients/${p.id}/edit`)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
