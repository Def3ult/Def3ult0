import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Welcome() {
  const [visitorName, setVisitorName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      toast.error('الرجاء إدخال اسمك');
      return;
    }
    localStorage.setItem('visitorName', visitorName);
    navigate('/encryption-method');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-8">
            نظام التشفير الآمن
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            مرحباً بك في نظام التشفير. الرجاء إدخال اسمك للمتابعة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full text-center text-lg p-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
              placeholder="أدخل اسمك هنا"
              dir="rtl"
            />
            <button 
              type="submit" 
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              متابعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}