const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/user");  // Assuming there's a User model

// Get all attendance records
router.get("/", verifyToken, async (req, res) => {
  try {
    const attendance = await Attendance.findAll();
    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Add a new attendance record
router.post("/", verifyToken, async (req, res) => {
  const { name, date, status } = req.body;

  if (!name || !date || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAttendance = await Attendance.create({ name, date, status });
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

  if (!name || !date || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const record = await Attendance.findByPk(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updatedRecord = await record.update({ name, date, status });
    res.status(200).json(updatedRecord);
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Delete an attendance record
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Attendance.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record successfully deleted" });
  } catch (err) {
    console.error("Error deleting attendance:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});



module.exports = router;
