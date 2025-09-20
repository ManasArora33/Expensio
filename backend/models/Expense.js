// backend/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  merchant: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  rawInput: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
