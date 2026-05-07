'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormField';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { AUTH_REDIRECT, SUCCESS_MESSAGES, MIN_PASSWORD_LENGTH } from '@/lib/constants';

interface UserProfile {
  user: { id: string; username: string; displayName: string; role: string };
  stats: { readingsCompleted: number; quizzesTaken: number; averageAccuracy: number };
  achievements: Array<{ id: string; name: string; unlockedAt: string }>;
  clan: { id: string; name: string; tier: string; role: string } | null;
}

export default function ProfilePage() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user) router.push(AUTH_REDIRECT);
  }, [isLoading, mounted, user, router]);

  useEffect(() => {
    if (user) setDisplayName(user.displayName || '');
  }, [user]);

  useEffect(() => {
    if (user && token) {
      authService.getProfile(user.id, token)
        .then(setProfileData)
        .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [user, token]);

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
    if (!isEditing) setDisplayName(user?.displayName || '');
  };

  const handleSave = async () => {
    setError('');
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setIsSaving(true);
    try {
      const updateData: { displayName: string; password?: string; updatePassword?: boolean } = { displayName };
      if (password) { updateData.password = password; updateData.updatePassword = true; }
      await authService.updateProfile(user!.id, token!, updateData);
      setSuccess(SUCCESS_MESSAGES.PROFILE_UPDATED);
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || isLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card padding="lg">
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
              <Button variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-50">
              <h3 className="text-lg font-semibold mb-4">Statistik</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileData?.stats?.readingsCompleted || 0}</p>
                  <p className="text-sm text-slate-500">Bacaan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileData?.stats?.quizzesTaken || 0}</p>
                  <p className="text-sm text-slate-500">Kuis</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{Math.round((profileData?.stats?.averageAccuracy || 0) * 100)}%</p>
                  <p className="text-sm text-slate-500">Akurasi</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Achievements ({profileData?.achievements?.length || 0})</h3>
              {profileData?.achievements?.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {profileData.achievements.map(ach => (
                    <div key={ach.id} className="p-3 bg-amber-50 rounded-lg">
                      <p className="font-medium text-amber-800">{ach.name}</p>
                      <p className="text-xs text-amber-600">{new Date(ach.unlockedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Belum ada achievement</p>
              )}
            </Card>

            {profileData?.clan && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Clan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{profileData.clan.name}</p>
                    <p className="text-sm text-slate-500">Role: {profileData.clan.role}</p>
                  </div>
                  <Badge variant="tier" tier={profileData.clan.tier}>{profileData.clan.tier.toUpperCase()}</Badge>
                </div>
              </Card>
            )}
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Username</label>
              <p className="font-medium">{user.username}</p>
            </div>

            {isEditing ? (
              <>
                <Input label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <div className="pt-4 border-t space-y-4">
                  <p className="text-sm text-slate-500">Leave password fields empty to keep your current password</p>
                  <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" />
                  <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                  <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <div><label className="text-sm text-slate-500">Display Name</label><p className="font-medium">{user.displayName}</p></div>
                <div><label className="text-sm text-slate-500">Role</label><p className="font-medium capitalize">{user.role}</p></div>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t">
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Card>
      </main>
    </div>
  );
}