
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default function ReauthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForReauth');
      if (!email) {
        alert('Missing email for reauthentication.');
        return;
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          alert('Reauthentication successful! You can now update your email or password.');
          router.push('../../screens/SettingScreen'); // Redirect back to settings
        })
        .catch((error) => {
          console.error('Error completing reauthentication:', error);
          alert('Failed to complete reauthentication.');
        });
    }
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-xl">Completing reauthentication...</h1>
    </main>
  );
}

