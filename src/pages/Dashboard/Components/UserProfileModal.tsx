import { useEffect, useState } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { authService } from '../../../services/authService';

interface UserProfile {
  username: string;
  email: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhoto?: string | null;
}

const UserProfileModal = ({ isOpen, onClose, userPhoto }: UserProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const displayedEmail = profile?.email?.endsWith("@noemail.com") ? "No email" : profile?.email;
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        console.log("received data",  data);  
        setProfile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-[8px] flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          {userPhoto ? (
            <img
              src={userPhoto.replace(/=s\d+-c$/, "")}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              <FaUser size={24} className="text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-white">
              {loading ? 'Loading...' : profile?.username || 'user'}
            </h2>
            <p className="text-gray-400 text-sm">
              {displayedEmail || 'Loading...'}
            </p>
          </div>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : loading ? (
          <div className="text-gray-400 text-center py-4">Loading profile...</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-2">Account Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Auth Provider</span>
                  <p className="text-white">{profile?.authProvider}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <p className="text-white">
                    {new Date(profile?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Last Updated</span>
                  <p className="text-white">
                    {new Date(profile?.updatedAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;