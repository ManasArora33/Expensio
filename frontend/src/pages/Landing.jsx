import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Bot, CheckCircle, ChevronRight, DollarSign, MessageSquare, PieChart, Play, Plus, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Parsing",
      description: "Automatically categorize expenses with natural language processing. Just type like you talk and let AI handle the rest."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: "Smart Analytics",
      description: "Beautiful visualizations and insights about your spending patterns to help you make better financial decisions."
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-500" />,
      title: "Financial Advisor Chat",
      description: "Get personalized money advice and answers to your financial questions from our AI assistant."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Add Expenses",
      description: "Simply type or take a photo of your receipt. Our AI will extract all the details."
    },
    {
      number: "2",
      title: "Get Insights",
      description: "AI analyzes your spending patterns and provides actionable insights."
    },
    {
      number: "3",
      title: "Receive Advice",
      description: "Chat with our AI financial advisor for personalized money-saving tips."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "This app has completely transformed how I manage my business expenses. The AI categorization saves me hours every month!"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The financial insights are incredibly accurate. I've saved 20% on my monthly expenses since I started using it."
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      content: "The AI chat feature is like having a financial advisor in my pocket. It's helped me make better business decisions."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Expensio
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Expense Tracking with <span className="text-blue-600">AI-Powered</span> Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Transform how you manage money with intelligent expense parsing and personalized financial advice.
              Take control of your finances like never before.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
            </div>
          </div>
          <div className="mt-16 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1554224155-3a58922a22c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Expense Tracker Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-gray-500 mb-8">TRUSTED BY INNOVATIVE TEAMS</p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
            {['Google', 'Microsoft', 'Slack', 'Shopify', 'Airbnb'].map((company) => (
              <div key={company} className="flex justify-center items-center col-span-1">
                <span className="text-2xl font-bold text-gray-700">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AI Expense Tracker</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features to help you take control of your finances
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and experience the future of expense tracking
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div className="bg-white p-8 rounded-xl h-full pt-12">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by 10,000+ Users</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who have transformed their financial lives
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already managing their expenses smarter with AI
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Integrations', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Documentation', 'Guides', 'API', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'GDPR'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <DollarSign className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">Expensio</span>
            </div>
            <p className="text-sm"> 2025 Expensio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;