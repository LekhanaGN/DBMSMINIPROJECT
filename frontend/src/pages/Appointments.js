import React, { useEffect, useState } from 'react';
import { getAppointments, addAppointment, updateAppointment, deleteAppointment, getPatients, getDoctors } from '../services/api';

const statusStyle = {
  Scheduled: { bg:'#eff6ff', color:'#1d4ed8' },
  Completed: { bg:'#f0fdf4', color:'#15803d' },
  Cancelled: { bg:'#fef2f2', color:'#dc2626' },
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ patient_id:'', doctor_id:'', appointment_date:'', appointment_time:'', reason:'', notes:'' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [a, p, d] = await Promise.all([
      getAppointments().catch(()=>({data:{data:[]}})),
      getPatients().catch(()=>({data:{data:[]}})),
      getDoctors().catch(()=>({data:{data:[]}})),
    ]);
    setAppointments(a.data.data); setPatients(p.data.data); setDoctors(d.data.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    await addAppointment(form).catch(()=>{});
    setShowForm(false); setForm({patient_id:'',doctor_id:'',appointment_date:'',appointment_time:'',reason:'',notes:''});
    await load(); setSaving(false);
  };

  const changeStatus = async (id, status) => { await updateAppointment(id, {status}).catch(()=>{}); load(); };

  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date?.split('T')[0] === today);
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Appointments</div>
          <div className="page-subtitle">{scheduled} upcoming · {todayAppts.length} today</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Book Appointment</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:22}}>
        {[
          {label:'Today',value:todayAppts.length,icon:'📅',bg:'#eff6ff',color:'#1d4ed8'},
          {label:'Scheduled',value:scheduled,icon:'🕐',bg:'#f0fdf4',color:'#15803d'},
          {label:'Total',value:appointments.length,icon:'📋',bg:'#faf5ff',color:'#7e22ce'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:'18px 20px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{s.icon}</div>
            <div><div style={{fontSize:24,fontWeight:700}}>{s.value}</div><div style={{fontSize:12,color:'#64748b'}}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:16,padding:'12px 16px',display:'flex',gap:6}}>
        {['All','Scheduled','Completed','Cancelled'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="btn btn-sm"
            style={{background:filter===f?'#2563eb':'#f1f5f9',color:filter===f?'#fff':'#64748b',border:'none',fontWeight:600}}>
            {f}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <div style={{padding:48,textAlign:'center',color:'#94a3b8'}}>Loading...</div>
        : filtered.length===0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h4>No appointments</h4><p>Book an appointment for a patient</p>
            <button className="btn btn-primary" onClick={()=>setShowForm(true)}>Book Now</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(a => {
                  const st = statusStyle[a.status] || statusStyle.Scheduled;
                  const apptDate = a.appointment_date?.split('T')[0];
                  const isToday = apptDate === today;
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{fontWeight:600}}>{a.patient_name}</div>
                        <div style={{fontSize:11,color:'#94a3b8'}}>{a.village} · {a.patient_phone}</div>
                      </td>
                      <td>
                        {a.doctor_name ? <><div style={{fontWeight:500}}>Dr. {a.doctor_name}</div><div style={{fontSize:11,color:'#94a3b8'}}>{a.specialization}</div></> : <span style={{color:'#cbd5e1'}}>—</span>}
                      </td>
                      <td>
                        <div style={{fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
                          {isToday && <span className="badge badge-orange" style={{fontSize:10}}>Today</span>}
                          {new Date(apptDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        </div>
                        {a.appointment_time && <div style={{fontSize:12,color:'#64748b'}}>🕐 {a.appointment_time.slice(0,5)}</div>}
                      </td>
                      <td style={{maxWidth:160}}><div style={{fontSize:13}}>{a.reason||'—'}</div></td>
                      <td><span className="badge" style={{background:st.bg,color:st.color}}>{a.status}</span></td>
                      <td>
                        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                          {a.status==='Scheduled' && <>
                            <button className="btn btn-success btn-sm" onClick={()=>changeStatus(a.id,'Completed')}>✓ Done</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>changeStatus(a.id,'Cancelled')}>✕</button>
                          </>}
                          <button className="btn btn-outline btn-sm" onClick={()=>window.confirm('Delete this appointment?')&&deleteAppointment(a.id).then(load)}>🗑</button>
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

      {showForm && (
        <div className="modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>📅 Book Appointment</h3><button className="btn btn-outline btn-sm" onClick={()=>setShowForm(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group"><label>Patient *</label>
                  <select value={form.patient_id} onChange={e=>setForm(f=>({...f,patient_id:e.target.value}))} required>
                    <option value="">Select patient</option>
                    {patients.map(p=><option key={p.id} value={p.id}>{p.name} — {p.village||'N/A'}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Doctor</label>
                  <select value={form.doctor_id} onChange={e=>setForm(f=>({...f,doctor_id:e.target.value}))}>
                    <option value="">Select doctor (optional)</option>
                    {doctors.map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialization||'General'}</option>)}
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group"><label>Date *</label><input type="date" value={form.appointment_date} onChange={e=>setForm(f=>({...f,appointment_date:e.target.value}))} required/></div>
                  <div className="form-group"><label>Time</label><input type="time" value={form.appointment_time} onChange={e=>setForm(f=>({...f,appointment_time:e.target.value}))}/></div>
                </div>
                <div className="form-group"><label>Reason</label><input value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} placeholder="Reason for visit"/></div>
                <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} placeholder="Additional notes"/></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Booking...':'Book Appointment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
