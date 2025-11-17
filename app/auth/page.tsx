"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Perubahan di sini
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/lib/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Sekarang menggunakan next/navigation

  useEffect(() => {
    const checkExistingSession = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        await apiGet('/auth/me', { auth: true });
        router.push('/admin');
      } catch {
        clearAuthToken();
      }
    };

    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token } = await apiPost<{ token: string }>('/auth/login', { email, password });
      setAuthToken(token);
      toast.success('Logged in successfully!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 glow-text">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="neon-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="neon-border"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full btn-glow">
            {loading ? 'Processing...' : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;