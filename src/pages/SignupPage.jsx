import { useLocation, useNavigate } from 'react-router-dom';
import { SignupForm } from '../Layout/ProductPage/signup-form';
import { resolveAuthRedirect, saveReturnTarget } from '../lib/authRedirect';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = resolveAuthRedirect(location, '/profile');

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <SignupForm
            showBackButton={false}
            onSuccess={() => navigate(returnTo, { replace: true })}
            onSwitchToLogin={() => {
              saveReturnTarget(location);
              navigate('/login', {
                state: {
                  from: location.state?.from || { pathname: returnTo },
                },
              });
            }}
          />

          <div className="mt-4">
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
