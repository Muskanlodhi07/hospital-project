const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Registered");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne(req.body);

    if (!user) return res.status(400).send("Invalid");

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;