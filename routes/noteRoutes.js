import express from "express";
import Note from "../models/Note.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================
// CREATE NOTE
// =====================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, category, imageUrl } = req.body;
    const note = new Note({
      userId: req.user.userId,
      title, content, tags, category, imageUrl,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// GET ALL NOTES
// =====================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// GET SINGLE NOTE BY ID  ← NEW
// =====================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// UPDATE NOTE
// =====================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, category, isPinned, imageUrl } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, category, isPinned, imageUrl },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// DELETE NOTE
// =====================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PIN / UNPIN NOTE
// =====================
router.patch("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;