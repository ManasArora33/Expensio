const mongoose = require('mongoose');
require('dotenv').config();
const Expense = require('./models/Expense');

// Categories for expenses
const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

// Sample merchants for each category
const merchants = {
  Food: ['McDonalds', 'Starbucks', 'Pizza Hut', 'Burger King', 'Subway', 'Dominos', 'KFC'],
  Transport: ['Uber', 'Lyft', 'Metro', 'Bus', 'Train', 'Taxi', 'Gas Station'],
  Shopping: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Nike', 'Zara', 'H&M'],
  Bills: ['Electricity', 'Water', 'Internet', 'Phone', 'Rent', 'Netflix', 'Spotify'],
  Entertainment: ['Cinema', 'Concert', 'Theater', 'Amusement Park', 'Zoo', 'Museum', 'Bowling'],
  Health: ['Pharmacy', 'Hospital', 'Dentist', 'Optometrist', 'Gym', 'Yoga', 'Therapist'],
  Other: ['Gift', 'Donation', 'Repair', 'Service', 'Fee', 'Tax', 'Fine']
};

// Sample descriptions
const descriptions = {
  Food: ['Lunch', 'Dinner', 'Breakfast', 'Snacks', 'Coffee', 'Groceries', 'Restaurant'],
  Transport: ['Ride to work', 'Airport transfer', 'Monthly pass', 'Fuel', 'Parking', 'Taxi fare', 'Car maintenance'],
  Shopping: ['New shoes', 'T-shirt', 'Laptop', 'Headphones', 'Books', 'Groceries', 'Furniture'],
  Bills: ['Monthly bill', 'Subscription', 'Rent payment', 'Insurance', 'Loan payment', 'Credit card', 'Membership'],
  Entertainment: ['Movie night', 'Concert tickets', 'Museum visit', 'Zoo entry', 'Bowling', 'Amusement park', 'Theater show'],
  Health: ['Medicine', 'Doctor visit', 'Dental checkup', 'Eye exam', 'Gym membership', 'Supplements', 'Therapy session'],
  Other: ['Gift for friend', 'Charity', 'Car repair', 'Service fee', 'Bank charge', 'Tax payment', 'Late fee']
};

// Function to get a random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate mock expenses
async function generateMockExpenses(userId, count = 100) {
  const expenses = [];
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[category][Math.floor(Math.random() * merchants[category].length)];
    const description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
    // Random amount between 50 and 5000, with 90% of expenses under 1000
    let amount;
    if (Math.random() < 0.9) {
      amount = parseFloat((Math.random() * 950 + 50).toFixed(2)); // 50-1000 for 90% of expenses
    } else {
      amount = parseFloat((1000 + Math.random() * 4000).toFixed(2)); // 1000-5000 for 10% of expenses
    }
    const date = randomDate(oneYearAgo, now);
    
    expenses.push({
      user: userId,
      amount,
      category,
      description,
      merchant,
      date,
      rawInput: `${description} ₹${amount} at ${merchant}`,
      createdAt: date,
      updatedAt: date
    });
  }

  try {
    await Expense.insertMany(expenses);
    console.log(`Successfully inserted ${count} mock expenses`);
  } catch (error) {
    console.error('Error inserting mock expenses:', error);
  }
}

// Connect to MongoDB and run the script
async function main(userId) {
  try {
    // Validate user ID format (24-character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.error('Error: Invalid user ID format. It should be a 24-character hex string.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Verify the user exists
    const User = require('./models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      console.error(`❌ Error: User with ID ${userId} not found`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email || user.username || userId}`);
    console.log('Generating mock expenses...');
    
    // Generate 100 mock expenses
    await generateMockExpenses(userId, 100);
    
    console.log('✅ Mock data generation completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Get user ID from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide a user ID as an argument');
  console.log('Example: node mockExpenses.js 60d0fe4f5311236168a109ca');
  process.exit(1);
}

main(args[0]);
