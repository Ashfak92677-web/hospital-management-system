const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../hospital.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite Database (hospital.sqlite)');
  }
});

db.serialize(async () => {
  // 1. Users Auth Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'doctor', 'receptionist')) DEFAULT 'receptionist',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Doctors table
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      phone TEXT,
      available_days TEXT DEFAULT 'Mon - Sat',
      consulting_fee REAL DEFAULT 500.00
    )
  `);

  // 3. Patients table
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL,
      blood_group TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'Scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    )
  `);

  // Seed default Admin & Receptionist agar user table khali ho
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (!err && row.count === 0) {
      const hashedAdminPass = await bcrypt.hash('admin123', 10);
      const hashedStaffPass = await bcrypt.hash('staff123', 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
      stmt.run("Dr. System Admin", "admin@medicare.com", hashedAdminPass, "admin");
      stmt.run("Frontdesk Reception", "staff@medicare.com", hashedStaffPass, "receptionist");
      stmt.finalize();
      console.log('🔒 Default Accounts Created:');
      console.log('   Admin: admin@medicare.com / admin123');
      console.log('   Staff: staff@medicare.com / staff123');
    }
  });

  // Seed doctors if empty
  db.get("SELECT COUNT(*) as count FROM doctors", (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare("INSERT INTO doctors (name, specialization, phone, available_days, consulting_fee) VALUES (?, ?, ?, ?, ?)");
      stmt.run("Dr. Rajesh Sharma", "Cardiologist", "9876543210", "Mon, Wed, Fri", 700.00);
      stmt.run("Dr. Priya Verma", "Pediatrician", "9876543211", "Tue, Thu, Sat", 500.00);
      stmt.run("Dr. Amit Patel", "Orthopedic", "9876543212", "Mon - Sat", 600.00);
      stmt.finalize();
    }
  });
});

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = { db, query, run, get };