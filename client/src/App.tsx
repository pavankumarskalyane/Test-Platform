import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import TakeTest from './pages/user/TakeTest';
import Result from './pages/user/Result';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateTest from './pages/admin/CreateTest';
import AdminResults from './pages/admin/AdminResults';

// A helper for the root path
const RootRedirect = () => {
   const { user } = useAuth();
   if (!user) return <Navigate to="/login" replace />;
   return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-blue-600">Test Platform</h1>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
               <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/test/:testId" element={<ProtectedRoute><TakeTest /></ProtectedRoute>} />
                  <Route path="/results/:resultId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/test/create" element={<ProtectedRoute adminOnly={true}><CreateTest /></ProtectedRoute>} />
                  <Route path="/admin/results/:testId" element={<ProtectedRoute adminOnly={true}><AdminResults /></ProtectedRoute>} />
               </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
