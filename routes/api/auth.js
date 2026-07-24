const { Router } = require('express');
const User = require('../../models/user');

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ fullName, email, password });
    const token = await User.matchPasswordAndCreateToken(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.status(201).json({
      message: 'Registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const token = await User.matchPasswordAndCreateToken(email, password);
    const user = await User.findOne({ email }).select('-password -salt');

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.json({
      message: 'Logged in successfully',
      user,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }

  const user = await User.findById(req.user._id).select('-password -salt');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
});

module.exports = router;
