const { z } = require('zod');

// Zod schema for creating an expense
const createExpenseSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number"
  }).positive({
    message: "Amount must be a positive number"
  }),
  
  category: z.enum([
    'Food', 
    'Transport', 
    'Shopping', 
    'Bills', 
    'Entertainment', 
    'Health', 
    'Other'
  ], {
    required_error: "Category is required",
    invalid_type_error: "Invalid category"
  }),
  
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string"
  })
  .min(3, {
    message: "Description must be at least 3 characters long"
  })
  .max(200, {
    message: "Description cannot exceed 200 characters"
  })
  .trim(),
  
  merchant: z.string()
    .max(100, {
      message: "Merchant name cannot exceed 100 characters"
    })
    .trim()
    .optional(),
  
  date: z.string().datetime().or(z.date()).optional()
    .transform(val => new Date(val))
    .default(() => new Date()),
  
  rawInput: z.string({
    required_error: "Raw input is required",
    invalid_type_error: "Raw input must be a string"
  }).min(1, {
    message: "Raw input cannot be empty"
  })
});

// Schema for updating an expense (all fields optional)
const updateExpenseSchema = z.object({
  amount: z.number().optional(),
  category: z.enum([
    'Food', 
    'Transport', 
    'Shopping', 
    'Bills', 
    'Entertainment', 
    'Health', 
    'Other'
  ]).optional(),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters long"
  }).max(200, {
    message: "Description cannot exceed 200 characters"
  }).trim().optional(),
  merchant: z.string().max(100, {
    message: "Merchant name cannot exceed 100 characters"
  }).trim().optional(),
  date: z.string().or(z.date())
    .transform(val => new Date(val))
    .default(() => new Date())
    .optional(),
  rawInput: z.string().optional()
});

// Schema for expense ID validation
const expenseIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid expense ID format"
});

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
  expenseIdSchema
};