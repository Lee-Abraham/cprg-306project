'use client';

import React, { useState } from 'react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { dbf } from '../../lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function DeleteAccount() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const router = useRouter();
  
  async function deleteUserData(uid) {
    try {
      // Delete main user document
      await deleteDoc(doc(dbf, "users", uid));

      console.log("Firestore data deleted for user:", uid);
    } catch (error) {
      console.error("Error deleting Firestore data:", error);
    }
  }

  const handleDelete = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      setError('No authenticated user.');
      return;
    }

    setLoading(true);
    setError('');

    try {


      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete account
      await deleteUserData(user.uid);

      await user.delete();

      alert('Account deleted successfully!');
      router.push('../../screens/LogInScreen');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 w-full text-white px-4 py-2 rounded"
      >
        Delete Account
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl text-black font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-4 text-black">Enter your password to confirm:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border text-black w-full p-2 mb-4"
              placeholder="Password"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || !password}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

