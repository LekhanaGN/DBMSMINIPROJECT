import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPatient, getVisits, getHistory, addVisit, addHistory, deleteVisit, deleteHistory } from '../services/api';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('visits');
  const [loading, setLoading] = useState(true);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [visitForm, setVisitForm] = useState({ visit_date: '', reason: '', diagnosis: '', prescription: '', follow_up_date: '', notes: '' });
  const [histForm, setHistForm] = useState({ condition_name: '', allergies: '', current_medications: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [p, v, h] = await Promise.all([getPatient(id), getVisits(id), getHistory(id)]);
      setPatient(p.data.data); setVisits(v.data.data); setHistory(h.data.data);
    } catch { navigate('/patients'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const submitVisit = async e => { e.preventDefault(); setSaving(true); await addVisit({...visitForm,patient_id:id}).catch(()=>{}); setShowVisitForm(false); setVisitForm({visit_date:'',reason:'',diagnosis:'',prescription:'',follow_up_date:'',notes:''}); await load(); setSaving(false); };
  const submitHistory = async e => { e.preventDefault(); setSaving(true); await addHistory({...histForm,patient_id:id}).catch(()=>{}); setShowHistoryForm(false); setHistForm({condition_name:'',allergies:'',current_medications:'',notes:''}); await load(); setSaving(false); };

  if (loading) return <div style={{padding:48,textAlign:'center',color:'#94a3b8'}}>Loading patient...</div>;
  if (!patient) return null;

  const age = Math.floor((new Date() - new Date(patient.dob)) / (365.25*24*3600*1000));
  const initials = patient.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const dob = new Date(patient.dob).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="avatar" style={{ width:56,height:56,fontSize:18,background:'#eff6ff',color:'#1d4ed8',borderRadius:14 }}>{initials}</div>
          <div>
            <div className="page-title">{patient.name}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
              <span className="badge badge-blue">#{patient.id}</span>
              <span className="badge badge-gray">{age} yrs · {patient.gender}</span>
              {patient.blood_type && <span className="badge badge-red">🩸 {patient.blood_type}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setShowIDCard(true)}>🪪 ID Card</button>
          <Link to={`/patients/${id}/edit`} className="btn btn-outline">✏️ Edit</Link>
          <button className="btn btn-outline" onClick={() => navigate('/patients')}>← Back</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Date of Birth', value: dob, icon: '🎂' },
          { label: 'Village', value: `${patient.village||'—'}${patient.district?', '+patient.district:''}`, icon: '📍' },
          { label: 'Phone', value: patient.phone || '—', icon: '📞' },
          { label: 'Emergency', value: patient.emergency_contact ? `${patient.emergency_contact} (${patient.emergency_phone||'—'})` : '—', icon: '🚨' },
        ].map(f => (
          <div key={f.label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 16, marginBottom: 6 }}>{f.icon}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{f.value}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab==='visits'?'active':''}`} onClick={()=>setTab('visits')}>🩺 Visits ({visits.length})</button>
        <button className={`tab-btn ${tab==='history'?'active':''}`} onClick={()=>setTab('history')}>📋 Medical History ({history.length})</button>
      </div>

      {tab === 'visits' && (
        <div className="card">
          <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontWeight:700,fontSize:15}}>Visit Log</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowVisitForm(true)}>+ Add Visit</button>
          </div>
          {visits.length===0 ? <div className="empty-state"><div className="empty-icon">🩺</div><h4>No visits yet</h4><p>Record this patient's first visit</p></div> :
            visits.map(v => (
              <div key={v.id} style={{padding:'16px 20px',borderBottom:'1px solid #f8fafc'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                      <span style={{fontWeight:700,fontSize:14}}>{v.reason||'General Visit'}</span>
                      <span className="badge badge-blue">{new Date(v.visit_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    {v.doctor_name && <div style={{fontSize:12,color:'#64748b',marginBottom:4}}>👨‍⚕️ Dr. {v.doctor_name}</div>}
                    {v.diagnosis && <div style={{fontSize:13,color:'#374151',marginBottom:3}}><span style={{fontWeight:600,color:'#64748b'}}>Diagnosis:</span> {v.diagnosis}</div>}
                    {v.prescription && <div style={{fontSize:13,color:'#15803d',marginBottom:3}}>💊 {v.prescription}</div>}
                    {v.follow_up_date && <div style={{fontSize:12,color:'#d97706'}}>📅 Follow-up: {new Date(v.follow_up_date).toLocaleDateString('en-IN')}</div>}
                    {v.notes && <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>📝 {v.notes}</div>}
                  </div>
                  <button className="btn btn-danger btn-sm" style={{marginLeft:12}} onClick={()=>deleteVisit(v.id).then(load)}>✕</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontWeight:700,fontSize:15}}>Medical History</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowHistoryForm(true)}>+ Add Record</button>
          </div>
          {history.length===0 ? <div className="empty-state"><div className="empty-icon">📋</div><h4>No records yet</h4><p>Add this patient's medical background</p></div> :
            history.map(h => (
              <div key={h.id} style={{padding:'16px 20px',borderBottom:'1px solid #f8fafc'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{flex:1}}>
                    {h.condition_name && <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>{h.condition_name}</div>}
                    {h.allergies && <div style={{fontSize:13,color:'#dc2626',marginBottom:4}}>⚠️ <span style={{fontWeight:600}}>Allergies:</span> {h.allergies}</div>}
                    {h.current_medications && <div style={{fontSize:13,color:'#15803d',marginBottom:4}}>💊 <span style={{fontWeight:600}}>Medications:</span> {h.current_medications}</div>}
                    {h.notes && <div style={{fontSize:12,color:'#64748b',marginTop:4}}>📝 {h.notes}</div>}
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:8}}>{new Date(h.recorded_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" style={{marginLeft:12}} onClick={()=>deleteHistory(h.id).then(load)}>✕</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {showVisitForm && (
        <div className="modal-overlay" onClick={()=>setShowVisitForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>🩺 Add Visit</h3><button className="btn btn-outline btn-sm" onClick={()=>setShowVisitForm(false)}>✕</button></div>
            <form onSubmit={submitVisit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group"><label>Visit Date *</label><input type="date" value={visitForm.visit_date} onChange={e=>setVisitForm(f=>({...f,visit_date:e.target.value}))} required/></div>
                  <div className="form-group"><label>Reason</label><input value={visitForm.reason} onChange={e=>setVisitForm(f=>({...f,reason:e.target.value}))} placeholder="Chief complaint"/></div>
                </div>
                <div className="form-group"><label>Diagnosis</label><input value={visitForm.diagnosis} onChange={e=>setVisitForm(f=>({...f,diagnosis:e.target.value}))} placeholder="Diagnosis / Findings"/></div>
                <div className="form-group"><label>Prescription</label><textarea value={visitForm.prescription} onChange={e=>setVisitForm(f=>({...f,prescription:e.target.value}))} rows={2} placeholder="Medicines prescribed"/></div>
                <div className="form-grid-2">
                  <div className="form-group"><label>Follow-up Date</label><input type="date" value={visitForm.follow_up_date} onChange={e=>setVisitForm(f=>({...f,follow_up_date:e.target.value}))}/></div>
                  <div className="form-group"><label>Notes</label><input value={visitForm.notes} onChange={e=>setVisitForm(f=>({...f,notes:e.target.value}))} placeholder="Additional notes"/></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setShowVisitForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Visit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryForm && (
        <div className="modal-overlay" onClick={()=>setShowHistoryForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>📋 Medical Record</h3><button className="btn btn-outline btn-sm" onClick={()=>setShowHistoryForm(false)}>✕</button></div>
            <form onSubmit={submitHistory}>
              <div className="modal-body">
                <div className="form-group"><label>Condition</label><input value={histForm.condition_name} onChange={e=>setHistForm(f=>({...f,condition_name:e.target.value}))} placeholder="e.g. Hypertension, Diabetes"/></div>
                <div className="form-group"><label>Allergies</label><input value={histForm.allergies} onChange={e=>setHistForm(f=>({...f,allergies:e.target.value}))} placeholder="Known allergies (or None)"/></div>
                <div className="form-group"><label>Current Medications</label><textarea value={histForm.current_medications} onChange={e=>setHistForm(f=>({...f,current_medications:e.target.value}))} rows={2} placeholder="Ongoing medications"/></div>
                <div className="form-group"><label>Notes</label><textarea value={histForm.notes} onChange={e=>setHistForm(f=>({...f,notes:e.target.value}))} rows={2} placeholder="Additional notes"/></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setShowHistoryForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIDCard && (
        <div className="modal-overlay" onClick={()=>setShowIDCard(false)}>
          <div className="modal" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>🪪 Patient ID Card</h3>
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-primary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
                <button className="btn btn-outline btn-sm" onClick={()=>setShowIDCard(false)}>✕</button>
              </div>
            </div>
            <div className="modal-body">
              <div style={{border:'2px solid #2563eb',borderRadius:14,padding:24,background:'#fff'}}>
                <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:16,paddingBottom:12,borderBottom:'1px solid #e2e8f0'}}>
                  <span style={{fontSize:22}}>🏥</span>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:'#1d4ed8'}}>Rural Healthcare Centre</div>
                    <div style={{fontSize:11,color:'#64748b'}}>Anantapur District, Andhra Pradesh</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
                  <div className="avatar" style={{width:64,height:64,fontSize:22,background:'#eff6ff',color:'#1d4ed8',borderRadius:12,flexShrink:0}}>{initials}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:18,color:'#0f172a',marginBottom:4}}>{patient.name}</div>
                    <div style={{fontSize:12,color:'#64748b',marginBottom:10}}>Patient ID: <strong style={{color:'#2563eb'}}>RHC-{String(patient.id).padStart(4,'0')}</strong></div>
                    {[
                      ['Age / Gender', `${age} yrs · ${patient.gender}`],
                      ['Blood Type', patient.blood_type || 'Unknown'],
                      ['Date of Birth', dob],
                      ['Village', `${patient.village||'—'}${patient.district?', '+patient.district:''}`],
                      ['Phone', patient.phone || '—'],
                      ['Emergency', patient.emergency_contact || '—'],
                    ].map(([l,v]) => (
                      <div key={l} style={{display:'flex',gap:8,fontSize:12,marginBottom:5}}>
                        <span style={{color:'#94a3b8',minWidth:90,fontWeight:600}}>{l}</span>
                        <span style={{color:'#1e293b',fontWeight:500}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginTop:16,paddingTop:12,borderTop:'1px dashed #e2e8f0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:11,color:'#94a3b8'}}>Issued: {new Date().toLocaleDateString('en-IN')}</div>
                  <div style={{fontSize:11,color:'#94a3b8'}}>Visits: {visits.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
