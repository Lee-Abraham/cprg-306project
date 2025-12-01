
'use client';

import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink, verifyBeforeUpdateEmail } from 'firebase/auth';

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
            await auth.currentUser.reload(); // Refresh user session

            // Send verification link to new email
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

            alert(`Verification email sent to ${newEmail}. Please verify before continuing.`);
            router.push('../../screens/SettingScreen'); // Redirect back to settings
        } catch (error) {
            console.error('Error completing reauthentication or updating email:', error);
            alert('Failed to update email.');
        }
        }
    };

    completeReauth();
    }, [router]);

    return <p>Completing reauthentication...</p>;
}

