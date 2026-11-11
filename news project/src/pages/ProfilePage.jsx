import React, { useCallback, useEffect, useState } from 'react'
import { FiCamera, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getUserProfile } from '../lib/auth';
import supabase from '../lib/supabase';

const ProfilePage = () => {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);


  const { user, updateProfile } = useAuth();


  
  useEffect(() => () => {
    if (avatarUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarUrl)
    }
  }, [avatarUrl])

  const fetchUserProfile = useCallback(async () => {
    try{
      const { username, avatar_url} = await getUserProfile(user.id);
      setUsername(username || '')
      setAvatarUrl(avatar_url || null)
      return
    } catch (error) {
      console.error("Error getting user profile", error)
      toast.error("Unable to load your profile")
    } finally { 
        setLoading(false)
    }

  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user, fetchUserProfile])

  const handleAvatarChange = (e) => {

    if (e.target.files && e.target.files[0]) {
      const file =  e.target.files[0];

     if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      e.target.value = ''
      return
     }

     if(file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be 2MB or less")
      e.target.value = ''
      return
     }

     setAvatar(file)

     const previewURL = URL.createObjectURL(file)
     setAvatarUrl(previewURL)
    }

  }

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      toast.error("Username cannot be empty")
      setLoading(false)
      return
    }

    let updates = {
      username: trimmedUsername,
    };

    // 1. Upload avatar if selected
    if (avatar instanceof File) {
      const fileExt = avatar.name.split(".").pop();

      const fileName = `${user.id}-${Math.random()
        .toString(36)
        .substring(2)}`;

      const filePath = `${fileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar);

      if (uploadError) throw uploadError;

      // 2. Get uploaded image URL
      const { data: imageData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      updates.avatar_url = imageData.publicUrl;
    }

    console.log("Updates to be applied:", updates);

    // 3. Update profile in database
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("username, avatar_url")
      .single();

    if (error) throw error;

    // 4. Update React state
    if (data) {
      setUsername(data.username);
      setAvatarUrl(data.avatar_url);
      setAvatar(null)
      updateProfile(data)
    }

    toast.success("Profile updated successfully!");

  } catch (error) {
    console.error("Profile update error:", error);
    toast.error(error.message || "Error updating user profile");
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8 pb-12 text-gray-900 dark:bg-zinc-950 dark:text-white sm:px-6 lg:px-8'>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
        <div
          className="relative flex h-56 items-end bg-cover bg-center px-6 pb-6 sm:h-72 sm:px-10"
          role="img"
          aria-label="Gym training area"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(9, 9, 11, 0.88), rgba(9, 9, 11, 0.2)), url("https://c8.alamy.com/comp/GJM7AG/word-in-stars-announcing-brand-new-product-or-improvement-GJM7AG.jpg")',
          }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Train · Recover · Repeat</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">Your fitness profile</h2>
          </div>
        </div>

        <section className="relative px-6 pb-7 sm:px-10">
          <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end">
            <div className="relative h-36 w-36 shrink-0 rounded-full border-4 border-white bg-gray-200 shadow-lg shadow-black/20 dark:border-zinc-900 dark:bg-zinc-800 dark:shadow-black/50 sm:h-40 sm:w-40">
              <img
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(username || user?.email || 'User')}&background=f97316&color=fff&size=256`}
                alt={`${username || 'User'}'s profile`}
                className="h-full w-full rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                aria-label="Change profile picture"
                className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-orange-500 p-2 text-white shadow-md transition hover:scale-105 hover:bg-orange-400"
              >
                <FiCamera className="h-5 w-5" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="min-w-0 pb-1">
              <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900 dark:text-white">
                {username || 'Your Profile'}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                <FiMail aria-hidden="true" />
                <span className="break-all">{user?.email}</span>
              </p>
              <span className="mt-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
                Gym member
              </span>
            </div>
          </div>
        </section>

        <nav className="flex min-h-14 items-center border-y border-gray-200 bg-gray-50 px-4 dark:border-zinc-800 dark:bg-zinc-950" aria-label="Profile sections">
          <span className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
            <FiUser aria-hidden="true" />
            About
          </span>
        </nav>

        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-7 px-6 py-8 sm:px-10">
          <div className="border-b border-gray-200 pb-4 dark:border-zinc-700">
            <label htmlFor="username" className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-0 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="border-b border-gray-200 pb-4 dark:border-zinc-700">
            <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              readOnly
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-500 focus:outline-none dark:border-zinc-700 dark:text-zinc-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}

export default ProfilePage
