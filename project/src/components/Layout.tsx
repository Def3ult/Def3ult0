import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cyber-secondary">
      {user.isAuthenticated && (
        <header className="bg-cyber-surface border-b border-cyber-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyber-primary" />
              <h1 className="text-xl font-semibold text-cyber-primary">
                مرحباً {user.username}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="cyber-button flex items-center gap-2"
            >
              <LogOut size={18} />
              تسجيل خروج
            </button>
          </div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}