'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormField';
import { HOME_REDIRECT, MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      const msg = `Password minimal ${MIN_PASSWORD_LENGTH} karakter`;
      setError(msg);
      toast.warning(msg);
      return;
    }

    setIsLoading(true);
    try {
      await register({ username, email, displayName, password });
      toast.success('Registrasi berhasil!');
      router.push(HOME_REDIRECT);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-center mb-6">Daftar Yomu</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Nama Tampilan"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Daftar
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}