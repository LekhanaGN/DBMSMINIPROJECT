CREATE DATABASE IF NOT EXISTS rural_healthcare;
USE rural_healthcare;

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  blood_type VARCHAR(5),
  phone VARCHAR(20),
  village VARCHAR(100),
  district VARCHAR(100),
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  condition_name VARCHAR(200),
  allergies TEXT,
  current_medications TEXT,
  notes TEXT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT,
  visit_date DATE NOT NULL,
  reason VARCHAR(255),
  diagnosis TEXT,
  prescription TEXT,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO doctors (name, specialization, phone) VALUES
  ('Dr. Ramesh Kumar', 'General Physician', '9876543210'),
  ('Dr. Priya Sharma', 'Pediatrician', '9876543211');

INSERT INTO patients (name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone) VALUES
  ('Lakshmi Devi', '1985-03-12', 'Female', 'O+', '9876501234', 'Nallur', 'Anantapur', 'Ramu (Husband)', '9876501235'),
  ('Venkat Rao', '1972-07-22', 'Male', 'A+', '9876502234', 'Gorantla', 'Anantapur', 'Sita (Wife)', '9876502235'),
  ('Baby Arun', '2019-11-05', 'Male', 'B+', '9876503234', 'Bukkapatnam', 'Anantapur', 'Suresh (Father)', '9876503235');

INSERT INTO medical_history (patient_id, condition_name, allergies, current_medications, notes) VALUES
  (1, 'Hypertension', 'Penicillin', 'Amlodipine 5mg daily', 'Monitor BP weekly'),
  (2, 'Type 2 Diabetes', 'None known', 'Metformin 500mg twice daily', 'HbA1c check every 3 months'),
  (3, 'None', 'None', 'None', 'Regular growth checkups needed');

INSERT INTO visits (patient_id, doctor_id, visit_date, reason, diagnosis, prescription, follow_up_date, notes) VALUES
  (1, 1, '2026-05-10', 'Headache and dizziness', 'Hypertension flare-up', 'Amlodipine 10mg, rest', '2026-06-10', 'BP was 160/100'),
  (2, 1, '2026-05-15', 'Routine sugar check', 'Diabetes under control', 'Continue Metformin', '2026-08-15', 'Fasting glucose: 118'),
  (3, 2, '2026-05-20', 'Fever and cold', 'Viral URTI', 'Paracetamol syrup, fluids', '2026-05-27', 'Mild throat infection');

-- Appointments table (run this if upgrading existing DB)
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  reason VARCHAR(255),
  status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
  (1, 1, CURDATE(), '10:00:00', 'BP checkup', 'Scheduled'),
  (2, 1, CURDATE(), '11:30:00', 'Diabetes follow-up', 'Scheduled'),
  (3, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', 'Growth checkup', 'Scheduled');
