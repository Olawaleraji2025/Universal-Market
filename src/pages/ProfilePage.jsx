import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Mail, Phone, UserRound } from 'lucide-react';
import { selectCurrentUser, selectUserProfile, setProfile } from '../features/authSlice';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/button';

const formatLabel = (value, fallback = 'Not provided') => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  return value ?? fallback;
};

const getDisplayName = (profile, user) =>
  formatLabel(profile?.full_name || profile?.name || user?.user_metadata?.full_name, 'User');

const getEmail = (profile, user) =>
  formatLabel(profile?.email || user?.email || user?.user_metadata?.email, 'No email available');

const getPhone = (profile) =>
  formatLabel(profile?.phone_number || profile?.phone || profile?.mobile_number, 'Not provided');

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        setLoadError('Unable to load your profile. Please try again.');
        return;
      }

      if (profile?.id === currentUser.id) {
        setIsLoading(false);
        setLoadError('');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          setLoadError('Unable to load your profile. Please try again.');
          setIsLoading(false);
          return;
        }

        if (data) {
          dispatch(setProfile(data));
        }

        setLoadError('');
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setLoadError('Unable to load your profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, profile, dispatch]);

  const userName = useMemo(
    () => getDisplayName(profile, currentUser),
    [profile, currentUser]
  );

  const email = useMemo(
    () => getEmail(profile, currentUser),
    [profile, currentUser]
  );

  const phoneNumber = useMemo(
    () => getPhone(profile),
    [profile]
  );

  const infoRows = [
    {
      icon: UserRound,
      label: 'Full Name',
      value: userName,
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: email,
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: phoneNumber,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-3 pb-10 pt-2 sm:px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm sm:px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Profile</h1>
        </header>

        {isLoading ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mx-auto mb-4 h-20 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto mb-2 h-5 w-36 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto h-4 w-44 animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-5 w-full animate-pulse rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-700">Unable to load your profile.</p>
            <p className="mt-2 text-sm text-red-600">Please try again.</p>
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#064e3b] text-white hover:bg-emerald-900"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <main className="space-y-5">
            <section className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center shadow-sm sm:px-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-800 shadow-sm sm:h-24 sm:w-24">
                {profile?.avatar_url || currentUser?.user_metadata?.avatar_url ? (
                  <img
                    src={profile?.avatar_url || currentUser?.user_metadata?.avatar_url}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-10 w-10 sm:h-12 sm:w-12" />
                )}
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
                {userName}
              </h2>
              <p className="mt-1 break-all text-sm text-gray-500 sm:text-base">{email}</p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {infoRows.map(({ icon: Icon, label, value }, index) => (
                <div key={label}>
                  <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-600">{label}</p>
                      <p className="mt-1 break-all text-base font-medium text-slate-900 sm:text-lg">
                        {value}
                      </p>
                    </div>
                  </div>
                  {index < infoRows.length - 1 && (
                    <div className="border-t border-gray-200" />
                  )}
                </div>
              ))}
            </section>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
                className="w-full max-w-xs border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Back to home
              </Button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
