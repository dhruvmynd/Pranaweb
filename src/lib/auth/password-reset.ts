import { supabase } from '../supabase';

export async function sendPasswordResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function resetPassword(newPassword: string) {
  try {
    // Update the password using the current session
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new Error('Failed to update password: ' + updateError.message);
    }

    // Sign out after password reset
    await supabase.auth.signOut();

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}
