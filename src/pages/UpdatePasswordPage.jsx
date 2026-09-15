import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/button';
import { Input } from '../components/ui/input';

const MIN_PASSWORD_LENGTH = 6;

/**
 * UpdatePasswordPage Component
 *
 * SECURE: Only accessible via Supabase password recovery email link.
 * Uses auth state change listener to verify PASSWORD_RECOVERY event.
 *
 * Features:
 * - Listens for PASSWORD_RECOVERY auth event from Supabase
 * - Blocks direct visits and unauthorized access
 * - Password strength validation (min 6 characters)
 * - Password confirmation matching
 * - Show/hide password toggle with accessibility support
 * - Real-time validation feedback
 * - Loading states during submission
 * - Success/error messages with auto-redirect
 * - Accessible form design with ARIA labels
 * - Proper auth listener cleanup on unmount
 */
export default function UpdatePasswordPage() {
  const navigate = useNavigate();

  // Auth verification state
  const [isVerifying, setIsVerifying] = useState(true);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [accessDeniedError, setAccessDeniedError] = useState('');

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * CRITICAL: Verify user arrived via Supabase password recovery flow
   *
   * This hook uses onAuthStateChange to listen for the PASSWORD_RECOVERY
   * auth event. This event is ONLY triggered when:
   * 1. User clicks the secure email link from Supabase
   * 2. The link contains a valid recovery token
   * 3. The token hasn't expired (typically 24 hours)
   *
   * Direct navigation or regular login sessions will NOT trigger PASSWORD_RECOVERY.
   *
   * Uses isMounted flag to prevent setState cascading and memory leaks.
   */
  useEffect(() => {
    let isMounted = true;
    let unsubscribe;

    const setupAuthListener = async () => {
      try {
        // Subscribe to auth state changes
        // onAuthStateChange returns an object with a data property containing subscription
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          // Prevent state updates if component unmounted
          if (!isMounted) return;

          // Check if this is a PASSWORD_RECOVERY event
          if (event === 'PASSWORD_RECOVERY' && session?.user) {
            // User has valid recovery token - allow access
            setIsRecoveryFlow(true);
            setAccessDeniedError('');
          } else if (event === 'SIGNED_IN' && session?.user) {
            // User is logged in normally (not via recovery link)
            // This is a security issue - block access
            setIsRecoveryFlow(false);
            setAccessDeniedError(
              'This page is only accessible via the password reset link sent to your email.'
            );
          } else if (!session?.user) {
            // No valid session at all
            setIsRecoveryFlow(false);
            setAccessDeniedError(
              'No valid reset link detected. Please request a new password reset.'
            );
          }

          // Initial verification complete
          if (isMounted) {
            setIsVerifying(false);
          }
        });

        // Store the unsubscribe function (it's part of the subscription object)
        unsubscribe = data?.subscription?.unsubscribe;
      } catch (err) {
        console.error('Auth listener setup failed:', err);
        if (isMounted) {
          setIsRecoveryFlow(false);
          setAccessDeniedError(
            'Unable to verify your access. Please request a new password reset.'
          );
          setIsVerifying(false);
        }
      }
    };

    // Setup listener
    setupAuthListener();

    // Cleanup: Unsubscribe from auth listener on unmount
    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Validate if new password meets requirements
   */
  const isPasswordValid = (password) => {
    return password.length >= MIN_PASSWORD_LENGTH;
  };

  /**
   * Check if passwords match
   */
  const passwordsMatch = newPassword === confirmPassword;

  /**
   * Check if form is valid for submission
   */
  const isFormValid =
    isPasswordValid(newPassword) &&
    passwordsMatch &&
    newPassword.trim().length > 0;

  /**
   * Handle form submission
   * Calls Supabase updateUser to change password
   * Only accessible after PASSWORD_RECOVERY event verification
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setFormError('');
      setSuccess(false);

      // Final validation before submission
      if (!isPasswordValid(newPassword)) {
        setFormError(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
        );
        setIsLoading(false);
        return;
      }

      if (!passwordsMatch) {
        setFormError('Passwords do not match. Please try again.');
        setIsLoading(false);
        return;
      }

      // Call Supabase to update user password
      // This only works if the user has valid PASSWORD_RECOVERY session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword.trim(),
      });

      if (updateError) {
        throw new Error(
          updateError.message || 'Failed to update password. Please try again.'
        );
      }

      // Show success message
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');

      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Password update failed:', err);
      setFormError(
        err.message ||
          'An error occurred while updating your password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        {/* VERIFYING STATE: Show loading spinner while checking auth */}
        {isVerifying && (
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-flex">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
              </div>
              <p className="text-slate-600">Verifying your reset link...</p>
            </div>
          </div>
        )}

        {/* ACCESS DENIED STATE: Show for unauthorized direct visits */}
        {!isVerifying && !isRecoveryFlow && (
          <>
            <div className="mb-8">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                aria-label="Back to login"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>

              <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
              <p className="mt-2 text-slate-600">
                This page is only accessible via the password reset link sent to your email.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Error Alert */}
              <div
                className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">
                    Invalid or Expired Link
                  </p>
                  <p className="mt-1 text-sm text-red-700">{accessDeniedError}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Request New Reset Link
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/login')}
                  className="w-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50"
                >
                  Back to Login
                </Button>
              </div>

              {/* Info Box */}
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-900">
                  💡 Password reset links expire after 24 hours. If your link has
                  expired, you can request a new one.
                </p>
              </div>
            </div>
          </>
        )}

        {/* AUTHORIZED RECOVERY FLOW: Show password form */}
        {!isVerifying && isRecoveryFlow && !success && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Set New Password
              </h1>
              <p className="mt-2 text-slate-600">
                Enter a new password for your account. Make it strong and unique.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Error Alert */}
              {formError && (
                <div
                  className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
                  role="alert"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="mt-1 text-sm text-red-700">{formError}</p>
                  </div>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* New Password Input */}
                <div className="mb-6">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    New Password
                  </label>
                  <div className="mt-2 relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Enter your new password"
                      disabled={isLoading}
                      required
                      aria-required="true"
                      aria-label="New password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
                      aria-label={
                        showNewPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Validation Feedback */}
                  <div className="mt-2 space-y-2">
                    <p
                      className={`text-xs font-medium ${
                        isPasswordValid(newPassword)
                          ? 'text-green-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {newPassword.length === 0
                        ? `• At least ${MIN_PASSWORD_LENGTH} characters`
                        : isPasswordValid(newPassword)
                          ? `✓ Strong password (${newPassword.length} characters)`
                          : `• At least ${MIN_PASSWORD_LENGTH} characters (${newPassword.length}/${MIN_PASSWORD_LENGTH})`}
                    </p>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-6">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFormError('');
                      }}
                      placeholder="Confirm your new password"
                      disabled={isLoading}
                      required
                      aria-required="true"
                      aria-label="Confirm password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Feedback */}
                  {confirmPassword.length > 0 && (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {passwordsMatch
                        ? '✓ Passwords match'
                        : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>

              {/* Password Requirements Box */}
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="mb-2 text-xs font-semibold text-blue-900">
                  Password Requirements:
                </p>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>• At least {MIN_PASSWORD_LENGTH} characters</li>
                  <li>• Mix of uppercase and lowercase letters (recommended)</li>
                  <li>• Include numbers or special characters (recommended)</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* SUCCESS STATE: Show confirmation and redirect */}
        {!isVerifying && isRecoveryFlow && success && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Success!</h1>
              <p className="mt-2 text-slate-600">
                Your password has been successfully updated.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div
                className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
                role="status"
                aria-live="polite"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Password Updated!</p>
                  <p className="mt-1 text-sm text-green-700">
                    Your password has been successfully changed. Redirecting you
                    to login...
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Go to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
