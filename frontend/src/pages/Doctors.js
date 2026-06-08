import React, { useEffect, useState } from 'react';
import { getDoctors, addDoctor, deleteDoctor } from '../services/api';

const SPECIALIZATIONS = ['General Physician','Pediatrician','Gynecologist','Orthopedic','Dermatologist','ENT Specialist','Ophthalmologist','Cardiologist','Neurologist','Psychiatrist','Dentist','Other'];

const colorPairs = [
  ['#eff6ff','#1d4ed8'],['#f0fdf4','#15803d'],['#faf5ff','#7e22ce'],
  ['#fff7ed','#c2410c'],['#f0fdfa','#0f766e'],['#fef2f2','#b91c1c'],
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); const r = await getDoctors().catch(()=>({data:{data:[]}})); setDoctors(r.data.data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault(); setSaving(true);
    await addDoctor(form).catch(()=>{});
    setShowForm(false); setForm({name:'',specialization:'',phone:''});
    await load(); setSaving(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Doctors</div>
          <div className="page-subtitle">{doctors.length} doctor{doctors.length!==1?'s':''} registered</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Add Doctor</button>
      </div>

      {loading ? <div style={{padding:48,textAlign:'center',color:'#94a3b8'}}>Loading...</div> :
        doctors.length === 0 ? (
          <div className="card"><div className="empty-state">
            <div className="empty-icon">🩺</div>
            <h4>No doctors yet</h4><p>Add the first doctor to the system</p>
            <button className="btn btn-primary" onClick={()=>setShowForm(true)}>Add Doctor</button>
          </div></div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {doctors.map((d,i) => {
              const [bg,fg] = colorPairs[i % colorPairs.length];
              const initials = d.name.replace(/^Dr\.?\s*/i,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
              return (
                <div key={d.id} className="card" style={{padding:22}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                    <div className="avatar" style={{width:52,height:52,fontSize:18,background:bg,color:fg,borderRadius:14}}>{initials}</div>
                    <button className="btn btn-danger btn-sm" onClick={()=>window.confirm(`Remove Dr. ${d.name}?`) && deleteDoctor(d.id).then(load)}>✕</button>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,color:'#0f172a',marginBottom:4}}>{d.name.startsWith('Dr') ? d.name : `Dr. ${d.name}`}</div>
                  <div style={{marginBottom:12}}>
                    <span className="badge" style={{background:bg,color:fg}}>{d.specialization||'General'}</span>
                  </div>
                  {d.phone && (
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#64748b'}}>
                      <span>📞</span> {d.phone}
                    </div>
                  )}
                  <div style={{fontSize:11,color:'#94a3b8',marginTop:10}}>
                    Joined {new Date(d.created_at).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }

      {showForm && (
        <div className="modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="modal" style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>🩺 Add Doctor</h3><button className="btn btn-outline btn-sm" onClick={()=>setShowForm(false)}>✕</button></div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dr. Ramesh Kumar" required/></div>
                <div className="form-group"><label>Specialization</label>
                  <select value={form.specialization} onChange={e=>setForm(f=>({...f,specialization:e.target.value}))}>
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Contact number"/></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Add Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
