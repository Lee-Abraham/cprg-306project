
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, dbf } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

const UserContext = createContext({
  authUser: null,
  profile: null,
  loading: true,
  error: null,
});

export function UserProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let profileUnsub = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      if (u) {
        const slim = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
        };
        setAuthUser(slim);

        const userRef = doc(dbf, 'users', u.uid);

        // ✅ Attach snapshot immediately
        console.log('Attaching snapshot listener for:', userRef.path);
        profileUnsub = onSnapshot(
          userRef,
          (snap) => {
            console.log('Snapshot fired:', snap.exists(), snap.data());
            if (snap.exists()) {
              setProfile(snap.data());
            } else {
              setProfile({
                username: u.displayName ?? 'Guest',
                avatarUrl: u.photoURL ?? '/assets/default-avatar.png',
                email: u.email ?? '',
              });
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Profile subscription error:', err);
            setError('Failed to load profile');
            setLoading(false);
          }
        );

        // ✅ Patch or create doc asynchronously
        (async () => {
          try {
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
              await setDoc(userRef, {
                username: u.displayName || 'New User',
                email: u.email || '',
                avatarUrl: u.photoURL || '/assets/default-avatar.png',
                createdAt: Date.now(),
              });
              console.log('Created user doc for:', u.uid);
            } else {
              const data = snap.data();
              const updates = {};
              if (!data.username) updates.username = u.displayName || 'New User';
              if (!data.email) updates.email = u.email || '';
              if (!data.avatarUrl) updates.avatarUrl = u.photoURL || '/assets/default-avatar.png';
              if (Object.keys(updates).length > 0) {
                await setDoc(userRef, updates, { merge: true });
                console.log('Patched empty fields for:', u.uid);
              }
            }
          } catch (err) {
            console.error('Error ensuring user doc:', err);
          }
        })();
      } else {
        // Signed out
        setAuthUser(null);
        setProfile(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      unsubAuth();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  const value = useMemo(() => ({ authUser, profile, loading, error }), [authUser, profile, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

