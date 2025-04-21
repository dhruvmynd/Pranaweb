import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/use-profile';
import { updateProfile, deleteUserData } from '@/lib/profile';
import { updatePassword, deleteUser } from '@/lib/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfileData } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    notification_time: null as string | null
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || '',
        notification_time: profile.notification_time || null
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Only include notification_time if it has a value
      const dataToUpdate = {
        ...formData,
        notification_time: formData.notification_time || null
      };

      const updatedProfile = await updateProfile(user.id, dataToUpdate);
      updateProfileData(updatedProfile);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await updatePassword(passwordData.newPassword);
      setSuccess('Password updated successfully');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;

    if (deleteConfirmEmail !== user.email) {
      setError('Email address does not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteUserData(user.id);
      await deleteUser();
      navigate('/');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again or contact support.');
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <ImageUpload
                value={formData.avatar_url}
                onChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                bucket="avatars"
                folder="profile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">Email address cannot be changed</p>
            </div>

            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="notification_time" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notification Time
              </label>
              <input
                type="time"
                id="notification_time"
                value={formData.notification_time || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  notification_time: e.target.value || null 
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-sm text-gray-500">Choose when you'd like to receive daily practice reminders</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>

          <div className="border-t pt-8 mt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-600">
              <User className="h-5 w-5" />
              Delete Account
            </h2>

            {!showDeleteConfirm ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Deleting your account will permanently remove all your data, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                  <li>Profile information</li>
                  <li>Practice history and statistics</li>
                  <li>Mood tracking data</li>
                  <li>All other associated data</li>
                </ul>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete My Account
                </Button>
              </div>
            ) : (
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-4">
                  Confirm Account Deletion
                </h3>
                <p className="text-red-600 mb-4">
                  This action cannot be undone. Please type your email address to confirm:
                </p>
                <input
                  type="email"
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  placeholder={user.email || ''}
                  className="mt-1 block w-full rounded-md border border-red-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 mb-4"
                />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmEmail !== user.email}
                  >
                    {loading ? 'Deleting...' : 'Confirm Deletion'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmEmail('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}