'use client';

import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {auth, dbf, storage} from '../../../lib/firebase'
import {doc, setDoc} from 'firebase/firestore';
import {useUser} from '../../components/UserProvider';
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsPage() {

  //Navigation
  const router = useRouter();

  //Get db of user
  const {profile, loading} = useUser();

  //Password change
  //When user press change password
  const [passChange, setPassChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  //Profile
  //When user press edit profile
  const [profEd, setProfEd] = useState(false);
  //Username
  const [username, setUsername] = useState('');
  //Email
  const [email, setEmail] = useState('');
  //Profile image
  const [imgUrl, setImgUrl] = useState('');

//-------------------------------------------Navigation-------------------------------------------
  //When user press home button
  const goHome = () => {
    router.push('/screens/HomeScreen');
  };

//---------------------------------------End Navigation-------------------------------------------

//-----------------------------------------Change Password----------------------------------------

  const onShowPassEdit = () => {
    if (!passChange) {
      setPassChange(true);
    }
    else {
      setPassChange(false);
    }
  }




  const handlePasswordChange = async (oldPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user) return alert("No user signed in");

    if (!navigator.onLine) return alert("You appear offline. Check your connection.");

    try {
      // Reauthenticate if old password is provided
      if (oldPassword) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
      }

      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Password change error:", error);

      switch (error.code) {
        case "auth/network-request-failed":
          alert("Network request failed. Check authorized domains or network settings.");
          break;
        case "auth/requires-recent-login":
          alert("Please log in again before changing your password.");
          break;
        default:
          alert(error.message);
      }
    }
  };







//------------------------------------------End Change Password-----------------------------------

//------------------------------------------Edit Profile------------------------------------------

//Get current user data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
      setImgUrl(profile.avatarUrl || '');
    }
  }, [profile]);


  const onShowEditProf = () => {
    if (!profEd) {
      setProfEd(true);
    }
    else {
      setProfEd(false);
    }
  };

  const onSaveProfile = async (e) => {

    e.preventDefault()
    //Get current user
    const user = auth.currentUser

    //Check if there is a user log in
    if (!user) {
      alert('You must be logged in to edit your profile');
      return;
    }

    //Error handling
    try {
      //Reference to user
      const userRef = doc(dbf, 'users', user.uid)

      const updates = {};

      //Double check that the data is not the same as the current data.
      if (username && username !== profile?.username) updates.username = username;
      if (email && email !== profile?.email) updates.email = email;
      if (imgUrl && imgUrl !== profile?.avatarUrl) updates.avatarUrl = imgUrl;

      // If nothing changed, don't write
      if (Object.keys(updates).length === 0) {
        alert('No changes to save.');
        return;
      }

      //Save/update data
      await setDoc(
        userRef, {
          username,
          email,
          avatarUrl: imgUrl,
        },
        {merge: true} //Only update fields that have been filled.
      );

      alert('Profile have been edited');

    }
    catch (error) {
      console.error('Error trying to edit profile: ', error);
    }

  };

//----------------------------------------End Edit Profile----------------------------------------

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-800 text-white p-6">
      {/* Header with Back Button */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={goHome}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Back Home
        </button>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Profile Settings */}
        <section className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Profile Settings</h2>
          <button onClick={onShowEditProf} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full">
            Edit Profile
          </button>
          {/* Edit profile */}
          {!profEd ? null : (
            <div className="bg-gray-700 rounded-lg p-4 shadow-lg mt-4">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <form className="flex flex-col gap-4">
                {/* Username */}
                <div>
                  <label className="block mb-1">Username:</label>
                  <input
                    value={username}
                    type="text"
                    placeholder="Enter username"
                    className="w-full px-3 py-2 rounded bg-gray-600 text-white focus:outline-none"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1">Email:</label>
                  <input
                    value={email}
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-3 py-2 rounded bg-gray-600 text-white focus:outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      const user = auth.currentUser;

                      if (!file) return;
                      if (!user) {
                        alert('You must be logged in to upload a profile picture.');
                        return;
                      }

                      try {
                        const filePath = `profileImages/${user.uid}/${file.name}`;
                        const storageRef = ref(storage, filePath);

                        await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(storageRef);

                        setImgUrl(downloadURL); // This is the permanent URL
                        alert('Image uploaded successfully!');
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        alert('Failed to upload image.');
                      }
                    }}
                  />
                </div>

                {/* Save Button */}
                <button
                onClick={onSaveProfile}
                  type="submit"
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          <button onClick={onShowPassEdit} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 w-full mt-2">
            Change Password
          </button>

          {!passChange? null : (
            // Div for password change
            <div className="p-4 bg-gray-100 lg:ml-12 mt-2 rounded shadow-md w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Old Password</label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded"
                  onClick={() => handlePasswordChange(oldPassword, newPassword)}
                >
                  Update Password
                </button>
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Notifications</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Game Alerts</span>
            <input type="checkbox" />
          </div>
          <div className="flex justify-between items-center">
            <span>Email Updates</span>
            <input type="checkbox" />
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Privacy & Security</h2>
          <button className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 w-full">
            Manage Privacy
          </button>
          <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full mt-2">
            Delete Account
          </button>
        </section>

        {/* About & Support */}
        <section className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">About & Support</h2>
          <p className="text-sm mb-2">Version: 1.0.0</p>
          <button className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 w-full">
            Contact Support
          </button>
        </section>
      </div>
    </main>
  );
}

