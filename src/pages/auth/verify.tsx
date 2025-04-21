import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Get the token and type from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          throw new Error('Invalid verification link');
        }

        if (type === 'recovery') {
          // Verify the recovery token
          const { error } = await supabase.auth.verifyOtp({
            token,
            type: 'recovery'
          });

          if (error) throw error;

          // Redirect to reset password page
          navigate('/auth/reset-password');
          return;
        }

        // Handle other verification types if needed
        navigate('/login');
      } catch (error) {
        console.error('Verification error:', error);
        navigate('/login');
      }
    };

    handleVerification();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Verifying...</h2>
        <p className="text-muted-foreground">Please wait while we verify your request.</p>
      </div>
    </div>
  );
}