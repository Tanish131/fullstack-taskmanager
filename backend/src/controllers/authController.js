const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const sign = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET || 'devsecret123', { expiresIn: '24h' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.create(req.body);
    res.status(201).json({ token: sign(user.id), user: user.toJSON() });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password } = req.body;
    const user = User.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ token: sign(user.id), user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const getProfile = (req, res) => res.json({ user: req.user.toJSON() });

module.exports = { register, login, getProfile };
