import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/button';
import { Input } from '../components/ui/input';
import { saveReturnTarget } from '../lib/authRedirect';

/**
 * ForgotPasswordPage Component
 *
 * Allows users to request a password reset link via email.
 * Integrates with Supabase auth to send password reset emails.
 *
 * Features:
 * - Email validation
 * - Loading states during submission
 * - Success/error messages
 * - Accessible form design
 * - Link back to login page
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  /**
   * Validate email format using a simple regex pattern
   */
  const validateEmail = (emailInput) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    setIsValidEmail(validateEmail(emailInput));
    setError('');
  };

  /**
   * Handle form submission
   * Calls Supabase resetPasswordForEmail to send password reset link
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);

      // Validate email before making API call
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      // Call Supabase to send password reset email
      // The resetTo URL should point to your UpdatePassword page
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (resetError) {
        throw new Error(
          resetError.message || 'Failed to send reset email. Please try again.'
        );
      }

      // Show success message
      setSuccess(true);
      setEmail('');

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        const returnFrom = location.state?.from || { pathname: '/' };
        saveReturnTarget({ state: { from: returnFrom } });
        navigate('/login', { state: { from: returnFrom } });
      }, 3000);
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError(
        err.message ||
          'An error occurred while sending the reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => {
              const returnFrom = location.state?.from || { pathname: '/' };
              saveReturnTarget({ state: { from: returnFrom } });
              navigate('/login', { state: { from: returnFrom } });
            }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
            aria-label="Back to login"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password?
          </h1>
          <p className="mt-2 text-slate-600">
            No problem. Enter your email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Success State */}
          {success && (
            <div
              className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Email sent!</p>
                <p className="mt-1 text-sm text-green-700">
                  Check your email for the password reset link. Redirecting you
                  to login...
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && !success && (
            <div
              className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
              role="alert"
            >
              <div className="flex-1">
                <p className="font-medium text-red-900">Error</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-label="Email address"
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the email address associated with your account.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValidEmail || isLoading}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          {/* Info Box */}
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-700">
              💡 Password reset links expire after 24 hours. If you don't
              receive an email, check your spam folder or try again.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => {
                const returnFrom = location.state?.from || { pathname: '/' };
                saveReturnTarget({ state: { from: returnFrom } });
                navigate('/login', { state: { from: returnFrom } });
              }}
              className="font-medium text-emerald-600 transition hover:text-emerald-700"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
