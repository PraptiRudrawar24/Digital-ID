const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get my projects
router.get('/', protect, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a project
router.post('/', protect, async (req, res) => {
  const { title, description, project_url } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO projects (user_id, title, description, project_url) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description, project_url]
    );
    const newProject = await db.query('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    res.status(201).json(newProject.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', protect, async (req, res) => {
  try {
    await db.run('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
