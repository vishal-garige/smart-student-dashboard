import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all tasks (ONLY logged-in user's tasks)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // ✅ FILTER BY USER
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE task (attach user)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id // ✅ VERY IMPORTANT
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task (only own task)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ✅ secure
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task (only own task)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id // ✅ secure
    });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;