const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateIDCard = async (req, res) => {
  const { user_id, expiry_date } = req.body;
  let targetUserId = user_id || req.user.id;

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE id = ?', [targetUserId]);
    if (userCheck.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    const user = userCheck.rows[0];

    const existingID = await db.query(
        "SELECT * FROM idcards WHERE user_id = ? AND status = 'active'", 
        [targetUserId]
    );

    if (existingID.rows.length > 0) {
        return res.status(400).json({ message: 'User already has an active ID card' });
    }

    const id_uuid = uuidv4();
    const id_number = user.prn || Math.floor(100000 + Math.random() * 900000).toString(); 
    const issue_date = new Date().toISOString();
    const expiry = expiry_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

    await db.run(
      'INSERT INTO idcards (id_uuid, user_id, id_number, issue_date, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id_uuid, targetUserId, id_number, issue_date, expiry, 'active']
    );

    const newID = await db.query('SELECT * FROM idcards WHERE id_uuid = ?', [id_uuid]);
    res.status(201).json(newID.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyIDCard = async (req, res) => {
  try {
    console.log('Fetching ID Card for User ID:', req.user.id);
    const idCard = await db.query(
        `SELECT ic.id_uuid, ic.id_number, ic.issue_date, ic.expiry_date, ic.status, 
                u.name, u.email, u.department, u.photo, u.role, u.dob, u.phone, u.blood_group, u.address, u.prn, u.study_year
         FROM idcards ic 
         JOIN users u ON ic.user_id = u.id 
         WHERE ic.user_id = ? AND ic.status = 'active'`,
        [req.user.id]
    );

    console.log('ID Card Query Result Rows:', idCard.rows.length);

    if (idCard.rows.length === 0) {
      console.log('No active ID card found in DB for user', req.user.id);
      return res.status(404).json({ message: 'No active ID card found' });
    }

    res.json(idCard.rows[0]);
  } catch (error) {
    console.error('getMyIDCard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyIDCard = async (req, res) => {
    const { uuid } = req.params;

    try {
        const idCardResult = await db.query(
            `SELECT ic.*, u.name, u.department, u.photo, u.role, u.dob, u.phone, u.blood_group, u.address, u.prn, u.study_year
             FROM idcards ic
             JOIN users u ON ic.user_id = u.id
             WHERE ic.id_uuid = ?`,
            [uuid]
        );

        if (idCardResult.rows.length === 0) {
            return res.status(404).json({ status: 'INVALID', message: 'ID Card not found' });
        }

        const idCard = idCardResult.rows[0];
        const now = new Date();
        const expiry = new Date(idCard.expiry_date);

        let status = 'VALID';
        let message = 'ID is valid';

        if (idCard.status !== 'active') {
            status = 'REVOKED';
            message = 'ID has been revoked';
        } else if (now > expiry) {
            status = 'EXPIRED';
            message = 'ID has expired';
        }

        await db.run(
            'INSERT INTO verification_logs (id_uuid, result, timestamp) VALUES (?, ?, ?)',
            [uuid, status, now.toISOString()]
        );

        res.json({
            status,
            message,
            details: {
                name: idCard.name,
                role: idCard.role,
                department: idCard.department,
                photo: idCard.photo,
                id_number: idCard.id_number,
                issue_date: idCard.issue_date,
                expiry_date: idCard.expiry_date,
                id_uuid: idCard.id_uuid,
                dob: idCard.dob,
                phone: idCard.phone,
                blood_group: idCard.blood_group,
                address: idCard.address,
                prn: idCard.prn,
                study_year: idCard.study_year
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllIDCards = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT ic.*, u.name, u.email 
            FROM idcards ic 
            JOIN users u ON ic.user_id = u.id
            ORDER BY ic.issue_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const revokeIDCard = async (req, res) => {
    const { uuid } = req.params;
    try {
        await db.run("UPDATE idcards SET status = 'revoked' WHERE id_uuid = ?", [uuid]);
        const result = await db.query("SELECT * FROM idcards WHERE id_uuid = ?", [uuid]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ID Card not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { generateIDCard, getMyIDCard, verifyIDCard, getAllIDCards, revokeIDCard };
