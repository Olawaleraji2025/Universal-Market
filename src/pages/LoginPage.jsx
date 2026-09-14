import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../Layout/ProductPage/LoginForm';
import { selectIsAuthenticated } from '../features/authSlice';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  const handleSuccess = (data) => {
    const from = location.state?.from?.pathname || '/profile';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <LoginForm
            showBackButton={false}
            onSuccess={handleSuccess}
            onSwitchToSignup={() => navigate('/signup')}
          />

          <div className="mt-4 flex items-center justify-between gap-2 ">
            {/* <ArrowLeft className="inline-block " /> */}
            <button
              type="button"
              className="w-full px-4 py-2 rounded-xl text-gray-600
hover:text-green-700 hover:underline transition-colors duration-200 cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
