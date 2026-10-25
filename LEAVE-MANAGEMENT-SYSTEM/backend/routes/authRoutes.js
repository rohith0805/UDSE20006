import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = (user) => ({
  id: user._id, name: user.name, email: user.email, role: user.role,
  leaveBalance: user.leaveBalance
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const role = normalizedEmail === (process.env.ADMIN_EMAIL || '').trim().toLowerCase() ? 'admin' : 'employee';
    const user = await User.create({
      name: name.trim(), email: normalizedEmail,
      password: await bcrypt.hash(password, 10), role
    });
    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not register user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch {
    res.status(500).json({ message: 'Could not log in.' });
  }
});

router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));

export default router;
