const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, department, photo, dob, phone, blood_group, address, prn, study_year } = req.body;

  if (!name || !email || !password || !prn) {
    return res.status(400).json({ message: 'Please add all fields including PRN' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userExists = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.run(
      'INSERT INTO users (name, email, password, role, department, photo, dob, phone, blood_group, address, prn, study_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, normalizedEmail, hashedPassword, role || 'student', department, photo, dob, phone, blood_group, address, prn, study_year]
    );

    console.log('User inserted successfully, ID:', result.lastID);

    const userId = result.lastID;
    const newUser = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = newUser.rows[0];

    // Automatically Generate ID Card using provided PRN as ID Number
    const { v4: uuidv4 } = require('uuid');
    const id_uuid = uuidv4();
    const id_number = prn; // Use PRN from form
    const issue_date = new Date().toISOString();
    const expiry_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

    console.log('Generating ID Card for user:', userId, 'with PRN:', prn);

    await db.run(
      'INSERT INTO idcards (id_uuid, user_id, id_number, issue_date, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id_uuid, userId, id_number, issue_date, expiry_date, 'active']
    );

    console.log('ID Card generated successfully');

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      photo: user.photo,
      dob: user.dob,
      phone: user.phone,
      blood_group: user.blood_group,
      address: user.address,
      prn: user.prn,
      study_year: user.study_year,
      token: generateToken(user.id, user.role, user.name, user.email),
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    const user = userResult.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        photo: user.photo,
        dob: user.dob,
        phone: user.phone,
        blood_group: user.blood_group,
        address: user.address,
        prn: user.prn,
        study_year: user.study_year,
        token: generateToken(user.id, user.role, user.name, user.email),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { name, department, photo, dob, phone, blood_group, address, password, study_year } = req.body;
  const userId = req.user.id;

  console.log(`Updating user ${userId} with:`, { name, department, phone, study_year });

  try {
    let updateQuery = 'UPDATE users SET name = ?, department = ?, photo = ?, dob = ?, phone = ?, blood_group = ?, address = ?, study_year = ?';
    let params = [name, department, photo, dob, phone, blood_group, address, study_year];

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(userId);

    const result = await db.run(updateQuery, params);

    if (result.changes === 0) {
        console.warn('No rows updated in database');
        return res.status(404).json({ message: 'User not found or no changes made' });
    }

    console.log('Database update successful');
    const updatedUserResult = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    res.status(200).json(updatedUserResult.rows[0]);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Since we don't have an email service, we'll return the reset token directly for now
    // In a real app, this token would be sent via email
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'Password reset link generated', resetToken });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { registerUser, loginUser, getMe, updateUser, forgotPassword, resetPassword };
