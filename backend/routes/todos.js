import express from "express";
import { ToDo } from "../models/Todo.js";

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await ToDo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const newTodo = new ToDo({ text });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a todo by ID
router.put("/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await ToDo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "ToDo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await ToDo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "ToDo not found" });
    }

    res.status(200).json({ message: "ToDo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
