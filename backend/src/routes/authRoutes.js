const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  console.log('requireAdmin middleware - User:', req.user);
  console.log('requireAdmin middleware - Role:', req.user?.role);
  
  if (!req.user || req.user.role !== 'admin') {
    console.log('requireAdmin middleware - Access denied for role:', req.user?.role);
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.',
      userRole: req.user?.role || 'unknown'
    });
  }
  
  console.log('requireAdmin middleware - Access granted');
  next();
};

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation: Ensure all fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Validate role
  const validRoles = ['faculty', 'admin'];
  const userRole = role && validRoles.includes(role) ? role : 'faculty';

  try {
    // Check for existing user (unique email constraint)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ 
      where: { email: email.trim().toLowerCase() } 
    });

    // Generic error for security
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (Admin only)
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    console.log('GET /users - User authenticated:', req.user);
    console.log('GET /users - User role:', req.user.role);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`GET /users - Found ${users.length} users`);
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete user (Admin only - cannot delete other admins)
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.id;

    // Validate that ID is provided
    if (!id) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Prevent self-deletion
    if (parseInt(id) === requestingUserId) {
      return res.status(400).json({ 
        error: 'Cannot delete your own account' 
      });
    }

    // Check if the user to be deleted exists
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!userToDelete) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Prevent deletion of other admin users
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ 
        error: 'Cannot delete admin users' 
      });
    }

    // Delete attendance records first (cascade delete)
    await prisma.attendance.deleteMany({
      where: { userId: parseInt(id) }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: userToDelete.id,
        name: userToDelete.name,
        email: userToDelete.email,
        role: userToDelete.role
      }
    });
  } catch (err) {
    console.error('Delete user error:', err);
    
    // Handle Prisma specific errors
    if (err.code === 'P2025') {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to delete user',
      message: 'Internal server error' 
    });
  }
});

module.exports = router;