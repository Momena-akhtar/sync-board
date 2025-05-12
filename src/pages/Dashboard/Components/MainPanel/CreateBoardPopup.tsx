import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  boardService  from '../../../../services/boardService';

interface Collaborator {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface BoardCollaborator {
  user: string;
  permission: 'view' | 'edit';
}

const CreateBoardPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');
  const [security, setSecurity] = useState<'private' | 'public'>('private');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Collaborator[]>([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState<BoardCollaborator[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const results = await boardService.searchUsers(searchQuery);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const addCollaborator = (collaborator: Collaborator) => {
    if (!selectedCollaborators.find(c => c.user === collaborator._id)) {
      setSelectedCollaborators([
        ...selectedCollaborators,
        { user: collaborator._id, permission: 'view' }
      ]);
    }
  };

  const removeCollaborator = (userId: string) => {
    setSelectedCollaborators(selectedCollaborators.filter(c => c.user !== userId));
  };

  const updateCollaboratorPermission = (userId: string, permission: 'view' | 'edit') => {
    setSelectedCollaborators(selectedCollaborators.map(c => 
      c.user === userId ? { ...c, permission } : c
    ));
  };

  const handleCreateBoard = async () => {
    if (!boardName) return;
    
    setLoading(true);
    try {
      const boardData = {
        name: boardName,
        security,
        collaborators: selectedCollaborators
      };
      
      const response = await boardService.createBoard(boardData);
      navigate(`/whiteboard/${response._id}`);
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] text-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Board</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Board Name</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full p-2 border border-[#555555] rounded-lg"
            placeholder="Enter board name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Security</label>
          <select
            value={security}
            onChange={(e) => setSecurity(e.target.value as 'private' | 'public')}
            className="w-full p-2 border border-[#555555] rounded-lg bg-[#1E1E1E]"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search Collaborators</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-[#555555] rounded-lg"
              placeholder="Search by name or email"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 border border-blue-500 cursor-pointer text-white rounded-full hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 border border-[#555555] rounded-xl">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => addCollaborator(user)}
                    className="px-3 py-1 border border-green-500 cursor-pointer text-white rounded-full hover:bg-green-800"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCollaborators.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Selected Collaborators</h3>
            <div className="space-y-2">
              {selectedCollaborators.map((collab) => {
                const user = searchResults.find(u => u._id === collab.user);
                return (
                  <div key={collab.user} className="flex items-center justify-between p-2 border border-[#555555] rounded-xl">
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={collab.permission}
                        onChange={(e) => updateCollaboratorPermission(collab.user, e.target.value as 'view' | 'edit')}
                        className="p-1 border border-[#555555] rounded-full cursor-pointer bg-[#1E1E1E]"
                      >
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                      </select>
                      <button
                        onClick={() => removeCollaborator(collab.user)}
                        className="px-3 py-1 border border-red-500 text-white cursor-pointer rounded-full hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-full cursor-pointer hover:bg-[#2E2E2E]"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBoard}
            disabled={loading || !boardName}
            className="px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardPopup; 