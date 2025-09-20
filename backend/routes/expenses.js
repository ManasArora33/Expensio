const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense, getAnalytics } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, createExpense);
router.get('/get', authMiddleware, getExpenses);
router.put('/update/:id', authMiddleware, updateExpense);
router.delete('/delete/:id', authMiddleware, deleteExpense);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
