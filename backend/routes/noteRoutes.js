// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const { verifyToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Get user's notes
router.get('/', verifyToken, async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all notes for the user, ordered by most recent first
    const notes = await Note.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new note
router.post('/', verifyToken, async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { content } = req.body;

    // Validate note content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    // Create the note
    const newNote = await Note.create({
      content: content.trim(),
      userId
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete a note by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Note.destroy({ where: { id } });
  
      if (!deleted) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
  });

module.exports = router;