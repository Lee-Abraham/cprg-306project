
'use client';

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { dbf } from '../../../lib/firebase';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(dbf, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          console.warn('No profile found for user.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-white">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-white">No profile data found.</div>;
  }

  // Fallback avatar logic
  const avatar =
    profile.avatarUrl === '/assets/default-avatar.png' || !profile.avatarUrl
      ? '/assets/Profile.gif'
      : profile.avatarUrl;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Back Home
        </button>
      </div>

      {/* Profile Info */}
      <div className="bg-gray-700 rounded-lg p-6 shadow-lg w-full max-w-4xl flex flex-col items-center mb-8">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <h2 className="text-2xl font-semibold">{profile.username || 'Anonymous'}</h2>
        <p className="text-gray-300">{profile.bio || 'Game on!!'}</p>
      </div>

      {/* Recent Games */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Recently Played</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(profile.recentGames || []).map((game, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img src={game.img} alt={game.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{game.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

