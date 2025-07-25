const express = require("express");
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken } = require("../middleware/authMiddleware");

// Get all attendance records for the authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // First verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    const attendance = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Get all attendance records (admin functionality)
router.get("/all", verifyToken, async (req, res) => {
  try {
    // You might want to add role-based authorization here
    const attendance = await prisma.attendance.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error fetching all attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Add a new attendance record
router.post("/", verifyToken, async (req, res) => {
  const { name, date, status } = req.body;
  const userId = req.user.id;

  if (!name || !date || !status) {
    return res.status(400).json({ message: "Student name, date and status are required" });
  }

  try {
    // First verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    // Check if attendance for this date already exists for the user
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: new Date(date)
      }
    });

    if (existingAttendance) {
      return res.status(409).json({ message: "Attendance already recorded for this date" });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        studentName: name,
        date: new Date(date),
        status,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(201).json(newAttendance);
  } catch (err) {
    console.error("Error adding attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Update an attendance record
router.put("/:id", verifyToken, async (req, res) => {
  const { name, date, status } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  if (!name || !date || !status) {
    return res.status(400).json({ message: "Student name, date and status are required" });
  }

  try {
    // First verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    const attendanceId = parseInt(id);

    // Check if record exists and belongs to the user
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
        userId: userId
      }
    });

    if (!existingRecord) {
      return res.status(404).json({ message: "Record not found or you do not have permission to edit this record" });
    }

    const updatedRecord = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        studentName: name,
        date: new Date(date),
        status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(200).json(updatedRecord);
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Delete an attendance record
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // First verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    const attendanceId = parseInt(id);

    // Check if record exists and belongs to the user
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
        userId: userId
      }
    });

    if (!existingRecord) {
      return res.status(404).json({ message: "Record not found or you do not have permission to delete this record" });
    }

    await prisma.attendance.delete({
      where: { id: attendanceId }
    });

    res.status(200).json({ message: "Record successfully deleted" });
  } catch (err) {
    console.error("Error deleting attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;