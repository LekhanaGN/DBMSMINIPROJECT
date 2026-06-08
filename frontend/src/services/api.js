import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const getPatients = (search = '') => API.get(`/patients${search ? `?search=${search}` : ''}`);
export const getPatient = (id) => API.get(`/patients/${id}`);
export const createPatient = (data) => API.post('/patients', data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

export const getVisits = (patientId) => API.get(`/visits/${patientId}`);
export const addVisit = (data) => API.post('/visits', data);
export const deleteVisit = (id) => API.delete(`/visits/${id}`);

export const getHistory = (patientId) => API.get(`/history/${patientId}`);
export const addHistory = (data) => API.post('/history', data);
export const deleteHistory = (id) => API.delete(`/history/${id}`);

export const getStats = () => API.get('/stats');

export const getDoctors = () => API.get('/doctors');
export const addDoctor = (data) => API.post('/doctors', data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

export const getAppointments = () => API.get('/appointments');
export const addAppointment = (data) => API.post('/appointments', data);
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);
