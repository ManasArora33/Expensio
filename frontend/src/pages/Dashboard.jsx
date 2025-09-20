import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  Pie,
  Line
} from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ArcElement
} from 'chart.js';
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/expenses/analytics?timeRange=${timeRange}`);
        setAnalytics(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Chart data with fallbacks
  const chartData = {
    category: {
      labels: analytics?.categories?.map(cat => cat._id) || [],
      datasets: [{
        data: analytics?.categories?.map(cat => cat.total) || [],
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B',
          '#EF4444', '#8B5CF6', '#EC4899'
        ],
        borderWidth: 0,
      }]
    },
    monthly: {
      labels: analytics?.monthlyTrends?.map(item => item.month) || [],
      datasets: [{
        label: 'Monthly Spending',
        data: analytics?.monthlyTrends?.map(item => item.total) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      }]
    },
    comparison: {
      labels: analytics?.categoryComparison?.labels || [],
      datasets: [
        {
          label: 'Current Period',
          data: analytics?.currentPeriod || [],
          backgroundColor: '#3B82F6',
        },
        {
          label: 'Previous Period',
          data: analytics?.previousPeriod || [],
          backgroundColor: '#9CA3AF',
        }
      ]
    }
  };

  // Loading state
  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Dashboard</h1>
            <p className="text-gray-600">Track and analyze your spending</p>
          </div>
          <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm w-full md:w-auto">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md flex-1 md:flex-none ${timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Spent Card */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {formatCurrency(analytics?.totals?.currentPeriod || 0)}
                </p>
                {analytics?.totals?.percentageChange !== undefined && (
                  <div className="flex items-center mt-2">
                    {analytics.totals?.percentageChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`ml-1 text-sm ${analytics.totals.percentageChange >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}
                    >
                      {Math.abs(analytics.totals?.percentageChange || 0)}% from last {timeRange}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Other stat cards with similar structure */}
          {/* ... */}

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Spending Trends</h3>
            <div className="h-80">
              {chartData.monthly.labels.length > 0 ? (
                <Line
                  data={chartData.monthly}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { callback: value => `₹${value}` }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No trend data available
                </div>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
            <div className="h-80">
              {chartData.category.labels.length > 0 ? (
                <Pie
                  data={chartData.category}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ₹${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <button
                onClick={() => navigate('/expenses')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.recentTransactions?.length > 0 ? (
                    analytics?.recentTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          {transaction.merchant && (
                            <div className="text-sm text-gray-500">
                              {transaction.merchant}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.category === 'Food' ? 'bg-green-100 text-green-800' :
                            transaction.category === 'Transport' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {transaction.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No recent transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;