import React, { useState, useEffect } from 'react';
import { User } from '../../../services/boardService';
import boardService from '../../../services/boardService';
import { useParams } from 'react-router-dom';

interface CollaboratorSearchPopupProps {
  onClose: () => void;
  onCollaboratorAdded: () => void;
}

interface UserWithPermission extends User {
  permission: 'view' | 'edit';
}

const CollaboratorSearchPopup: React.FC<CollaboratorSearchPopupProps> = ({ onClose, onCollaboratorAdded }) => {
  const { id: boardId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserWithPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const results = await boardService.searchUsers(searchQuery);
        // Initialize each user with 'view' permission
        setSearchResults(results.map(user => ({ ...user, permission: 'view' as const })));
      } catch (err) {
        setError('Failed to search users');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handlePermissionChange = (userId: string, permission: 'view' | 'edit') => {
    setSearchResults(prev => 
      prev.map(user => 
        user._id === userId ? { ...user, permission } : user
      )
    );
  };

  const handleAddCollaborator = async (userId: string) => {
    if (!boardId) return;

    const user = searchResults.find(u => u._id === userId);
    if (!user) return;

    try {
      await boardService.addCollaborator(boardId, userId, user.permission);
      onCollaboratorAdded();
      onClose();
    } catch (err) {
      setError('Failed to add collaborator');
      console.error('Add collaborator error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-lg p-6 w-140 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">Add Collaborators</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-3 py-2 bg-[#1E1E1E] text-white rounded-lg border border-[#383838] focus:outline-none focus:border-[#405CE3]"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="text-white text-center py-4">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col p-2 bg-[#1E1E1E] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-white">{user.username}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                    <button
                      onClick={() => handleAddCollaborator(user._id)}
                      className="px-3 py-1 border border-[#405CE3] text-white rounded-full cursor-pointer hover:bg-[#2d4bb8] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-white text-sm">Permission:</label>
                    <select
                      value={user.permission}
                      onChange={(e) => handlePermissionChange(user._id, e.target.value as 'view' | 'edit')}
                      className="px-2 py-1 bg-[#1E1E1E] text-white text-sm rounded-lg border border-[#383838] focus:outline-none focus:border-[#405CE3]"
                    >
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-white text-center py-4">No users found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSearchPopup; 