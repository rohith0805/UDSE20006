import express from 'express';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/leaves', async (_req, res) => {
  const leaves = await Leave.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ leaves });
});

router.patch('/leaves/:id', async (req, res) => {
  try {
    const { status, adminComment = '' } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found.' });
    if (leave.status !== 'pending') return res.status(400).json({ message: 'This request has already been reviewed.' });

    if (status === 'approved') {
      const user = await User.findById(leave.user);
      const type = leave.leaveType;
      if (user.leaveBalance[type] < leave.days) {
        return res.status(400).json({ message: 'The employee no longer has enough leave balance.' });
      }
      user.leaveBalance[type] -= leave.days;
      await user.save();
    }
    leave.status = status;
    leave.adminComment = String(adminComment).slice(0, 500);
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();
    res.json({ message: `Leave ${status}.`, leave });
  } catch {
    res.status(500).json({ message: 'Could not review leave request.' });
  }
});

export default router;
