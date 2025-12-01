
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink, updateEmail } from 'firebase/auth';

export default function ReauthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const completeReauth = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem('emailForReauth');
        const newEmail = window.localStorage.getItem('newEmail'); // Store new email before reauth
        if (!email || !newEmail) {
          alert('Missing email information.');
          return;
        }

        try {
          // Complete reauthentication
          await signInWithEmailLink(auth, email, window.location.href);

          // Update email in Firebase
          await updateEmail(auth.currentUser, newEmail);

          alert('Email updated successfully!');
          router.push('../../screens/SettingScreen'); // Redirect back to settings
        } catch (error) {
          console.error('Error completing reauthentication or updating email:', error);
          alert('Failed to update email.');
        }
      }
    };

    completeReauth();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-xl">Completing reauthentication...</h1>
    </main>
  );
}
