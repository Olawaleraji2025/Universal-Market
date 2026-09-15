import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { clearAuth } from '../../features/authSlice';
import Button from './button';

/**
 * DeleteAccountModal Component
 *
 * A production-ready component for secure account deletion with:
 * - Confirmation modal with overlay
 * - Loading states during deletion
 * - Error handling and display
 * - Keyboard support (Esc to close)
 * - Background scroll prevention
 * - Accessibility features
 */
export default function DeleteAccountModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  /**
   * Open the confirmation modal
   */
  const openModal = () => {
    setIsModalOpen(true);
    setError('');
  };

  /**
   * Close the confirmation modal and reset state
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setIsDeleting(false);
  };

  /**
   * Handle account deletion:
   * 1. Call Supabase RPC to delete user and related data
   * 2. Sign out the user
   * 3. Clear Redux auth state
   * 4. Redirect to signup page
   */
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError('');

      // Call Supabase RPC function to delete user account and related data
      const { error: rpcError } = await supabase.rpc('delete_user');

      if (rpcError) {
        throw new Error(rpcError.message || 'Failed to delete account');
      }

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(signOutError.message || 'Failed to sign out');
      }

      // Clear Redux auth state
      dispatch(clearAuth());

      // Close modal and redirect to signup
      closeModal();
      navigate('/signup', { replace: true });
    } catch (err) {
      console.error('Account deletion failed:', err);
      setError(
        err.message || 'Failed to delete your account. Please try again.'
      );
      setIsDeleting(false);
    }
  };

  /**
   * Handle Esc key press to close modal
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Delete Account Button */}
      <Button
        type="button"
        onClick={openModal}
        className="w-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
      >
        Delete Account
      </Button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-lg">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2
                      id="delete-modal-title"
                      className="text-lg font-semibold text-slate-900"
                    >
                      Delete Account
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isDeleting}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                {/* Warning Message */}
                <p
                  id="delete-modal-description"
                  className="text-base text-slate-700"
                >
                  Are you sure you want to delete your account? This action
                  cannot be undone. All your data, including orders, requests,
                  and wishlist items will be permanently deleted.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={isDeleting}
                  className="flex-1 border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
