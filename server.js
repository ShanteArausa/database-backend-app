require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fullstack-client-vert.vercel.app"
  ],
  credentials: true
}));
// Create Express App FIRST
app.use(express.json());

// Debug

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("Database connection error:", err));

// Create Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"]
  },
});

// Create Model
const User = mongoose.model("User", userSchema);

// ✅ Routes (AFTER app is created)

app.post("/users", async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
    });

    res.status(201).json({
      message: "User saved to database ✅",
      user: newUser,
    });
  } catch (error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: error.message
    });
  }

  res.status(500).json({ error: "Server error" });
}
});

// Get all users from database
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true },
    );

    res.json({
      message: "User updated ✅",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted ✅",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
