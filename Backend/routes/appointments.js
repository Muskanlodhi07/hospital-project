const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointments");

// Book
router.post("/book", async (req, res) => {
  try {
    const appt = new Appointment(req.body);
    await appt.save();
    res.send("Booked");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all
router.get("/", async (req, res) => {
  const data = await Appointment.find();
  res.send(data);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;