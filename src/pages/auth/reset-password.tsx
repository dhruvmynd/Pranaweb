import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check for recovery token
    const recoveryToken = sessionStorage.getItem('recovery_token');
    if (!recoveryToken || !recoveryToken.includes('type=recovery')) {
      navigate('/login', { 
        replace: true,
        state: { message: 'Invalid or expired password reset link. Please request a new one.' }
      });
      return;
    }

    // Parse the recovery token parameters
    const params = new URLSearchParams(recoveryToken);
    const type = params.get('type');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!type || !accessToken || type !== 'recovery') {
      navigate('/login', { 
        replace: true,
        state: { message: 'Invalid or expired password reset link. Please request a new one.' }
      });
      return;
    }

    // Set up the session with the recovery token
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    }).catch(() => {
      navigate('/login', { 
        replace: true,
        state: { message: 'Invalid or expired password reset link. Please request a new one.' }
      });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const recoveryToken = sessionStorage.getItem('recovery_token');
      if (!recoveryToken) {
        throw new Error('Recovery token not found');
      }

      // Parse the recovery token parameters
      const params = new URLSearchParams(recoveryToken);
      const type = params.get('type');
      const accessToken = params.get('access_token');
      
      if (!type || !accessToken || type !== 'recovery') {
        throw new Error('Invalid recovery token');
      }

      // Set the session with the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: params.get('refresh_token') || ''
      });

      if (sessionError) {
        throw new Error('Failed to set session: ' + sessionError.message);
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw new Error('Failed to update password: ' + updateError.message);
      }

      setSuccess(true);
      setLoading(false);

      // Sign out and redirect after showing success message
      setTimeout(async () => {
        // Clear the recovery token
        sessionStorage.removeItem('recovery_token');
        
        await supabase.auth.signOut();
        navigate('/login', { 
          replace: true,
          state: { message: 'Password has been reset successfully. Please log in with your new password.' }
        });
      }, 2000);

    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Set New Password</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              Password updated successfully! Redirecting to login...
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || success}
          >
            {loading ? 'Updating...' : success ? 'Password Updated!' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}