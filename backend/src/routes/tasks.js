const express = require('express');
const { body } = require('express-validator');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, getStats } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const validate = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('dueDate').optional().isISO8601()
];

router.get('/stats', getStats);
router.get('/', getTasks);
router.post('/', [body('title').trim().notEmpty(), ...validate], createTask);
router.get('/:id', getTaskById);
router.put('/:id', validate, updateTask);
router.patch('/:id', validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
