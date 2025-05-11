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
  userPhoto?: string;
}

const UserProfileModal = ({ isOpen, onClose, userPhoto }: UserProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    username: '',
    oldPassword: '',
    newPassword: ''
  });

  const displayedEmail = profile?.email?.endsWith("@noemail.com") ? "No email" : profile?.email;
  const isLocalUser = profile?.authProvider === 'local';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        setProfile(data);
        setUpdateData(prev => ({ ...prev, username: data.username }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatePayload: any = {};
      if (updateData.username !== profile?.username) {
        updatePayload.username = updateData.username;
      }
      if (updateData.oldPassword && updateData.newPassword) {
        updatePayload.oldPassword = updateData.oldPassword;
        updatePayload.newPassword = updateData.newPassword;
      }

      if (Object.keys(updatePayload).length === 0) {
        setMessage({ text: 'No changes to update', type: 'error' });
        return;
      }

      const updatedProfile = await authService.updateUserProfile(updatePayload);
      setProfile(updatedProfile);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      setUpdateData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
      console.error('Update error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#383838] text-white rounded-xl p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <FaTimes />
        </button>
        
        <div className="flex items-center mb-6">
          {userPhoto ? (
            <img src={userPhoto} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
          ) : (
            <FaUser className="w-16 h-16 text-gray-400 mr-4" />
          )}
          <div>
            <h2 className="text-xl font-bold">{profile?.username || 'Loading...'}</h2>
            <p className="text-white text-sm">{displayedEmail}</p>
          </div>
        </div>

        {message && (
          <div className={`text-center mb-4 p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Username</label>
              <input
                type="text"
                name="username"
                value={updateData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={updateData.oldPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={updateData.newPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-transparent border rounded-full cursor-pointer "
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Auth Provider</p>
              <p className="font-medium">{profile?.authProvider || 'Loading...'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{new Date(profile?.createdAt || '').toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              disabled={!isLocalUser}
              className={`flex justify-center align-center w-[80%] mx-auto cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-full ${
                isLocalUser 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;