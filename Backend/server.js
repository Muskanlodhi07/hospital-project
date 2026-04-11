require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Import Models (IMPORTANT)
const User = require("./models/user");
const Appointment = require("./models/appointments");

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 MongoDB Connection
console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// ================= ROUTES =================

// 🔹 Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    await User.create({ name, email, password, role });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering" });
  }
});


// 🔹 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
  }
});


// 🔹 Get Doctors (FIXED)
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({
      role: { $regex: "^doctor$", $options: "i" }
    });

    console.log("Doctors:", doctors); // debug

    res.json(doctors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});


// 🔹 Book Appointment
app.post("/book", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { patientName, doctorName, date } = req.body;

    const newAppointment = await Appointment.create({
      patientName,
      doctorName,
      date,
    });

    console.log("✅ SAVED:", newAppointment);

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Doctor View
app.get("/appointments/:doctorName", async (req, res) => {
  try {
    const { doctorName } = req.params;

    const data = await Appointment.find({ doctorName });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});


// 🔹 Patient View
app.get("/patientAppointments/:patientName", async (req, res) => {
  try {
    const { patientName } = req.params;

    const data = await Appointment.find({ patientName });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});


// 🔹 Delete Appointment
app.delete("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting ID:", id);

    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting" });
  }
});


// 🔹 Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});