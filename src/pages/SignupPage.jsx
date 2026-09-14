import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../Layout/ProductPage/signup-form';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <SignupForm
            showBackButton={false}
            onSuccess={() => navigate('/profile', { replace: true })}
            onSwitchToLogin={() => navigate('/login')}
          />

          <div className="mt-4">
            <button
              type="button"
              className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate('/')}
            >
              Go back home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
