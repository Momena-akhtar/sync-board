import { useState, useEffect } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";
import untitledImage from "../assets/untitled.png";
import boardService from "../../../../services/boardService";
import { useNavigate } from "react-router-dom";
interface Project {
  _id: string;
  name: string;
  thumbnail_img: string;
  createdAt: string;
  updatedAt: string;
  security: 'public' | 'private';
  role: 'owner' | 'editor' | 'viewer';
}

const ProjectsGrid = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await boardService.getBoards();
        const mappedProjects: Project[] = data.map(board => ({
          _id: board._id,
          name: board.name,
          thumbnail_img: board.thumbnail_img || '',
          createdAt: board.createdAt.toString(),
          updatedAt: board.updatedAt.toString(),
          security: board.security,
          role: 'owner' // Since these are boards created by the user
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
  
    fetchProjects();
  }, []);

  const handleDelete = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await boardService.deleteBoard(boardId);
      // Remove the deleted project from the state
      setProjects(prevProjects => prevProjects.filter(project => project._id !== boardId));
      setShowMenu(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="sm:flex-8 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex bg-transparent items-center px-6 py-4">
        <span className="flex items-center space-x-6 text-white">
          <span className="font-['Kumbh_Sans'] text-[12px] border-b-2 border-white pb-1 cursor-pointer">
            Recently Viewed
          </span>
          <span className="font-['Kumbh_Sans'] text-[12px] cursor-pointer hover:text-gray-300 transition duration-200">
            Shared Projects
          </span>
        </span>
        <span className="flex-1"></span>
        <span className="flex space-x-4">
          {/* Grid View Icon */}
          <AiOutlineAppstore
            className={`cursor-pointer transition duration-200 ${
              viewMode === "grid" ? "text-blue-400" : "text-white hover:text-gray-300"
            }`}
            size={20}
            onClick={() => setViewMode("grid")}
          />
          {/* List View Icon */}
          <AiOutlineUnorderedList
            className={`cursor-pointer transition duration-200 ${
              viewMode === "list" ? "text-blue-400" : "text-white hover:text-gray-300"
            }`}
            size={20}
            onClick={() => setViewMode("list")}
          />
        </span>
      </div>

      {/* Projects Display */}
      <div className="p-6 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-white text-[12px] font-['Kumbh_Sans']">
            No projects to show
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {projects.map((proj, index) => (
              <div key={index} className="border cursor-pointer border-[#383838] rounded-lg p-2">
                <div className="relative">
                  <img 
                    src={proj.thumbnail_img || untitledImage} 
                    alt={proj.name} 
                    className="w-full h-40 object-cover rounded-md" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = untitledImage;
                    }}
                    onClick={() => navigate(`/whiteboard/${proj._id}`)}
                  />  
                  {proj.security === 'private' && (
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                      Private
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-white font-['Kumbh_Sans'] text-sm mt-2">{proj.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-white text-lg p-1 cursor-pointer relative" onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === index ? null : index);
                    }}>
                      ⋮
                      {showMenu === index && (
                        <div className="absolute left-6 -top-5 mt-1 w-32 bg-[#1E1E1E] rounded-lg shadow-lg py-1 z-50 border border-[#2E2E2E]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle update
                              setShowMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 cursor-pointer text-xs text-white hover:bg-[#383838] transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={(e) => handleDelete(proj._id, e)}
                            disabled={isDeleting}
                            className="w-full text-left px-4 py-2 cursor-pointer text-xs text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-gray-400 text-xs">Last edited {new Date(proj.updatedAt).toLocaleDateString()}</div>
                  <div className="text-gray-400 text-xs">{proj.role}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col space-y-3">
            {projects.map((proj, index) => (
              <div key={index} className="border border-gray-900 rounded-lg p-2 flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={proj.thumbnail_img || untitledImage} 
                    alt={proj.name} 
                    className="w-12 h-12 object-cover rounded-md" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = untitledImage;
                    }}
                  />
                  {proj.security === 'private' && (
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                      Private
                    </div>
                  )}
                </div>
                <div className="flex-1 text-white text-sm">{proj.name}</div>
                <div className="text-gray-400 text-xs">Last edited {new Date(proj.updatedAt).toLocaleDateString()}</div>
                <div className="text-gray-400 text-xs">{proj.role}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGrid;
