const { createExpenseSchema, updateExpenseSchema } = require('../zod/expenseSchema');
const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
    try {
        const { success, error } = createExpenseSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: 'Invalid input',
                error: error.message
            });
        }

        const expense = await Expense.create({
            user: req.user._id,
            ...req.body,
            rawInput: req.body.rawInput
        });

        res.status(200).json({
            message: 'Expense created successfully',
            expense: expense
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create expense',
            error: error.message
        });
    }
}

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

        res.status(200).json({
            message: 'Successfully retrieved expenses',
            expenses: expenses
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve expenses',
            error: error.message
        });
    }
}

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { success, error } = updateExpenseSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: 'Invalid input',
                error: error.message
            });
        }

        const expense = await Expense.findByIdAndUpdate(id, { ...req.body }, { new: true });

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            message: 'Expense updated successfully',
            expense: expense
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update expense',
            error: error.message
        });
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            message: 'Expense deleted successfully',
            expense: expense
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete expense',
            error: error.message
        });
    }
}

const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total spending
        const totalResult = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSpent = totalResult[0]?.total || 0;

        // Category breakdown
        const categoryBreakdown = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        // Monthly trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrends = await Expense.aggregate([
            { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            success: true,
            analytics: {
                totalSpent,
                categoryBreakdown,
                monthlyTrends
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense, getAnalytics }


