const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user's notes
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all notes for the user, ordered by most recent first
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
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
    const userId = req.user.id;
    const { content } = req.body;

    // Validate note content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    // Create the note
    const newNote = await prisma.note.create({
      data: {
        content: content.trim(),
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update a note by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;

    // Validate note content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    // Check if note exists and belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to edit this note' });
    }

    // Update the note
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { content: content.trim() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete a note by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if note exists and belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found or you do not have permission to delete this note' });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId }
    });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
});

module.exports = router;