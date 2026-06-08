import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, getPatient, updatePatient } from '../services/api';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', dob: '', gender: '', blood_type: '', phone: '',
    village: '', district: '', emergency_contact: '', emergency_phone: ''
  });

  useEffect(() => {
    if (!isEdit) return;
    getPatient(id).then(r => {
      const p = r.data.data;
      setForm({ ...p, dob: p.dob?.split('T')[0] || '' });
    }).catch(() => setError('Failed to load patient')).finally(() => setLoading(false));
  }, [id, isEdit]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dob || !form.gender) { setError('Name, date of birth and gender are required.'); return; }
    setSaving(true); setError('');
    try {
      if (isEdit) await updatePatient(id, form);
      else await createPatient(form);
      navigate(isEdit ? `/patients/${id}` : '/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ padding: 32, color: '#64748b' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Patient' : 'Add New Patient'}</div>
          <div className="page-subtitle">{isEdit ? `Updating record for #${id}` : 'Register a new patient'}</div>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit} className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Personal Details</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Patient full name" required />
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input name="dob" type="date" value={form.dob} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={form.gender} onChange={handle} required>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Blood Type</label>
            <select name="blood_type" value={form.blood_type} onChange={handle}>
              <option value="">Unknown</option>
              {BLOOD_TYPES.map(bt => <option key={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="10-digit mobile" />
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, marginTop: 8 }}>Address</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Village / Town</label>
            <input name="village" value={form.village} onChange={handle} placeholder="Village name" />
          </div>
          <div className="form-group">
            <label>District</label>
            <input name="district" value={form.district} onChange={handle} placeholder="District" />
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, marginTop: 8 }}>Emergency Contact</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Contact Name</label>
            <input name="emergency_contact" value={form.emergency_contact} onChange={handle} placeholder="Name & relation" />
          </div>
          <div className="form-group">
            <label>Contact Phone</label>
            <input name="emergency_phone" value={form.emergency_phone} onChange={handle} placeholder="Phone number" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Patient' : 'Add Patient'}</button>
        </div>
      </form>
    </div>
  );
}
