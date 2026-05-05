'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName(user?.displayName || '');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);

    try {
      const body: { displayName: string; password?: string; updatePassword?: boolean } = {
        displayName,
      };

      if (password) {
        body.password = password;
        body.updatePassword = true;
      }

      const res = await fetch(`${apiUrl}/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      // Update local storage with new display name
      const storedUser = localStorage.getItem('yomu_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.displayName = updatedUser.displayName;
        localStorage.setItem('yomu_user', JSON.stringify(parsed));
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-slate-600">Bacaan</Link>
            <Link href="/achievements" className="text-sm text-slate-600">Achievements</Link>
            <Link href="/profile" className="text-sm text-primary-600 font-medium">Profil</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                {displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{isEditing ? displayName : user.displayName}</h2>
                <p className="text-slate-500">@{user.username}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Username</label>
              <p className="font-medium">{user.username}</p>
            </div>

            {isEditing ? (
              <>
                <div>
                  <label htmlFor="displayName" className="text-sm text-slate-500">Display Name</label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="pt-4 border-t space-y-4">
                  <p className="text-sm text-slate-500">Leave password fields empty to keep your current password</p>

                  <div>
                    <label htmlFor="password" className="text-sm text-slate-500">New Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="text-sm text-slate-500">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={isLoading}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm text-slate-500">Display Name</label>
                  <p className="font-medium">{user.displayName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Role</label>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
