import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Send } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingExpenses, setFetchingExpenses] = useState(true);

  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await api.get('/auth/me');
        if (!response) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };
    checkAuth();
    fetchExpenses();
  }, [navigate]);

  // Fetch all expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses/get');
      setExpenses(response.data.expenses);
    } catch (error) {
      toast.error('Error fetching expenses');
    } finally {
      setFetchingExpenses(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Step 1: Parse expense with AI
      const parseResponse = await api.post('/ai/parse-expense', {
        rawInput: input
      });
      fetchExpenses();
      toast.success('Expense added successfully! 🎉');
      
    } catch (error) {
      toast.error('Error adding expense');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/delete/${id}`);
      fetchExpenses();
      toast.success('Expense deleted');
    } catch (error) {
      toast.error('Error deleting expense');
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transport: 'bg-blue-100 text-blue-800',
      Shopping: 'bg-purple-100 text-purple-800',
      Bills: 'bg-red-100 text-red-800',
      Entertainment: 'bg-yellow-100 text-yellow-800',
      Health: 'bg-pink-100 text-pink-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.Other;
  };

  if (fetchingExpenses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Expenses</h1>
        <p className="text-gray-600">Tell me about your expense in natural language</p>
      </div>

      {/* Chat Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🤖</span>
          </div>
          <h2 className="text-lg font-semibold">AI Expense Parser</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='e.g., "Bought lunch for ₹250 at McDonalds" or "Uber ride ₹120"'
              className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </div>
          
          {loading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 flex items-center space-x-2">
                <div className="animate-pulse">🧠</div>
                <span>AI is parsing your expense...</span>
              </p>
            </div>
          )}
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Examples:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>"Coffee ₹150 at Starbucks"</li>
            <li>"Grocery shopping ₹2500 at Big Bazaar"</li>
            <li>"Movie tickets ₹400 at PVR"</li>
          </ul>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Expenses</h2>
          <div className="text-sm text-gray-500">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} total
          </div>
        </div>
        
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <PlusCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-500">Add your first expense using the chat input above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div 
                key={expense._id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                    {expense.merchant && (
                      <span className="text-sm text-gray-500">at {expense.merchant}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                    {expense.rawInput && (
                      <span className="italic">"{expense.rawInput}"</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
