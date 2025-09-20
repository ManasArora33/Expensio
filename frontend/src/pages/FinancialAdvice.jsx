import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';

const FinancialAdvice = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your financial advisor. How can I help you with your expenses today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This will throw if not authenticated, and the catch block will handle it
        await api.get('/auth/me');
      } catch (error) {
        console.error('Auth check failed:', error);
        toast.error('Please log in to use the Financial Advisor.');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get user's expenses for context
      const expensesResponse = await api.get('/expenses/get');
      const expenses = expensesResponse.data.expenses || [];

      // Send message to AI
      const response = await api.post('/ai/get-advice', {
        query: input,
        expenses
      });

      setMessages(prevMessages => {
        const botMessage = {
          id: prevMessages.length + 1,
          text: response.data.data.message, // Adjusted to match backend on success
          sender: 'bot',
          timestamp: new Date()
        };
        return [...prevMessages, botMessage];
      });
    } catch (error) {
      console.error('Error getting financial advice:', error);
      const errorText = error.response?.data?.message || 'Failed to get advice. Please try again.';
      toast.error(errorText);

      setMessages(prevMessages => {
        const errorMessage = {
          id: prevMessages.length + 1,
          text: "I'm sorry, I couldn't process your request. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        };
        return [...prevMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Financial Advisor</h1>
            <p className="text-sm text-gray-500">Ask me anything about your expenses</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600 text-white ml-3' : 'bg-gray-200 text-gray-700 mr-3'
                    }`}
                >
                  {message.sender === 'user' ? (
                    <User size={16} />
                  ) : message.isError ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 ${message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : message.isError
                      ? 'bg-red-50 text-red-700 rounded-tl-none border border-red-100'
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200'
                    }`}
                >
                  {message.sender === 'bot' ? (
                    <ReactMarkdown
                      children={message.text}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  )}
                  <div
                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 text-gray-700 mr-3 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for financial advice..."
            className="w-full p-4 pr-14 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinancialAdvice;