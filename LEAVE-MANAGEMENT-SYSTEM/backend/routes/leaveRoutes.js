import express from 'express';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

function inclusiveDays(start, end) {
  const a = new Date(start); const b = new Date(end);
  a.setUTCHours(0,0,0,0); b.setUTCHours(0,0,0,0);
  return Math.round((b - a) / 86400000) + 1;
}

router.get('/balance', async (req, res) => {
  const user = await User.findById(req.user._id).select('leaveBalance');
  res.json({ leaveBalance: user.leaveBalance });
});

router.get('/mine', async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ leaves });
});

router.post('/', async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!['casual', 'medical'].includes(leaveType)) {
      return res.status(400).json({ message: 'Choose casual or medical leave.' });
    }
    if (!startDate || !endDate || !reason?.trim()) {
      return res.status(400).json({ message: 'Start date, end date, and reason are required.' });
    }
    const start = new Date(startDate); const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return res.status(400).json({ message: 'Please provide valid dates. End date cannot be before start date.' });
    }
    start.setUTCHours(0,0,0,0); end.setUTCHours(0,0,0,0);
    if (start < new Date(new Date().setHours(0,0,0,0))) {
      return res.status(400).json({ message: 'Leave cannot start in the past.' });
    }
    const days = inclusiveDays(start, end);
    const balanceKey = leaveType;
    const user = await User.findById(req.user._id);
    if (days > user.leaveBalance[balanceKey]) {
      return res.status(400).json({ message: `You have only ${user.leaveBalance[balanceKey]} ${leaveType} leave day(s) available.` });
    }
    const overlap = await Leave.findOne({
      user: req.user._id, status: { $in: ['pending', 'approved'] },
      startDate: { $lte: end }, endDate: { $gte: start }
    });
    if (overlap) return res.status(409).json({ message: 'These dates overlap another pending or approved leave request.' });
    const leave = await Leave.create({
      user: req.user._id, leaveType, startDate: start, endDate: end, days, reason: reason.trim()
    });
    res.status(201).json({ message: 'Leave application submitted.', leave });
  } catch {
    res.status(500).json({ message: 'Could not submit leave application.' });
  }
});

export default router;
