const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');
const { createExpenseSchema } = require('../zod/expenseSchema');

const router = express.Router();

// Parse raw expense text into structured data
// Parse raw expense text into structured data
router.post('/parse-expense', authMiddleware, async (req, res) => {
    try {
        const { rawInput } = req.body;

        // Validate input
        if (!rawInput) {
            return res.status(400).json({
                success: false,
                message: 'rawInput is required'
            });
        }

        // Call AI service to parse the expense
        const response = await axios.post('http://127.0.0.1:5000/parse-expense', {
            rawInput
        });

        // Get the parsed data from AI service
        const parsedData = response.data.data;

        // Forward the request to create expense endpoint
        // The authMiddleware has already verified the user's session
        const expense = await Expense.create({
            ...parsedData,
            rawInput,
            user: req.user._id  // Add user ID from the authenticated session
        });

        // Return the created expense
        res.status(200).json({
            success: true,
            data: expense
        });

    } catch (error) {
        console.error('Error parsing expense:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to parse expense',
            error: error.response?.data?.message || error.message
        });
    }
});

// Get AI-powered financial advice
router.post('/get-advice', authMiddleware, async (req, res) => {
    try {
        const { query, expenses } = req.body;

        // Validate input
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        // Get user's expenses
        // const expenses = await Expense.find({ user: req.user._id })
        //     .sort({ date: -1 })
        //     .lean();
        // console.log(expenses);
        // Call AI service for advice
        const response = await axios.post('http://127.0.0.1:5000/get-advice', {
            query,
            expenses
        });

        // Return the AI's response
        res.status(200).json({
            success: true,
            data: {
                message: response.data.message,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error getting advice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get advice',
            error: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;
