import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get("/api/verify-token", authenticate, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ valid: true, user: { id: user._id, username: user.username } });
});

app.post(
  "/api/signup",
  [
    body("username").trim().isLength({ min: 3 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { username, password } = req.body;
      if (await User.findOne({ username })) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = new User({ username, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({
        token,
        userId: user._id,
        username: user.username,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Registration failed", details: err.message });
    }
  }
);

app.post(
  "/api/login",
  [body("username").trim().notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        token,
        userId: user._id,
        username: user.username,
      });
    } catch (err) {
      res.status(500).json({ error: "Login failed", details: err.message });
    }
  }
);
app.post("/api/suggest", authenticate, async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: `As a professional travel planner, create a detailed itinerary for: ${req.body.prompt}. 
                  Format your response with:
                  ### Day-by-Day Itinerary
                  - Morning: ...
                  - Afternoon: ...
                  ### Estimated Budget
                  - Transportation: Rs...
                  - Accommodation: Rs...
                  ### Packing Tips
                  - ... Please format links as [Display Text](URL) and provide the hotels original websites link in front of hotels as per the name and location.
                  Also provide links of tourist places as per suggested in suggestions. When clicked on those links it should redirect to the to that particular tourist spots information on google`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // Get raw response first
      console.error("GROQ API Error:", errorData);
      throw new Error("Failed to get suggestions from AI service");
    }

    const data = await response.json();
    res.json({
      suggestion: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({
      error: "Failed to generate suggestions",
      details: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
