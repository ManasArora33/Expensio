import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import FinancialAdvice from './pages/FinancialAdvice';
import Landing from './pages/Landing';

function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/expenses' element={<Expenses />} />
        <Route path='/advice' element={<FinancialAdvice />} />
      </Routes>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

