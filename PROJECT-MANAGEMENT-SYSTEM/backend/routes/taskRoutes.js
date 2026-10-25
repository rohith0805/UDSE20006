import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = express.Router();
const statuses = ['Pending', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];

router.get('/stats', async (_req, res) => {
  try {
    const grouped = await Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const stats = { total: 0, pending: 0, inProgress: 0, completed: 0 };
    for (const item of grouped) {
      stats.total += item.count;
      if (item._id === 'Pending') stats.pending = item.count;
      if (item._id === 'In Progress') stats.inProgress = item.count;
      if (item._id === 'Completed') stats.completed = item.count;
    }
    res.json(stats);
  } catch { res.status(500).json({ message: 'Could not load task statistics.' }); }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (statuses.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) {
      const regex = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { assignee: regex }];
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch { res.status(500).json({ message: 'Could not load tasks.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, description = '', assignee = '', priority = 'Medium', status = 'Pending', dueDate = '' } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Task title is required.' });
    if (!priorities.includes(priority) || !statuses.includes(status)) {
      return res.status(400).json({ message: 'Choose a valid priority and status.' });
    }
    const task = await Task.create({
      title: title.trim(), description, assignee, priority, status,
      dueDate: dueDate ? new Date(dueDate) : null
    });
    res.status(201).json({ message: 'Task created successfully.', task });
  } catch { res.status(500).json({ message: 'Could not create task.' }); }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const allowed = ['title', 'description', 'assignee', 'priority', 'status', 'dueDate'];
    const updates = {};
    for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
    if ('title' in updates && !String(updates.title).trim()) return res.status(400).json({ message: 'Task title cannot be empty.' });
    if ('status' in updates && !statuses.includes(updates.status)) return res.status(400).json({ message: 'Invalid task status.' });
    if ('priority' in updates && !priorities.includes(updates.priority)) return res.status(400).json({ message: 'Invalid priority.' });
    if ('dueDate' in updates) updates.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task updated successfully.', task });
  } catch { res.status(500).json({ message: 'Could not update task.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch { res.status(500).json({ message: 'Could not delete task.' }); }
});

export default router;
