import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";
import UserProfileModal from "./UserProfileModal";

const SidePanel = () => {
  const { user } = useAuth(); // Access loading state
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      setIsDark(false);
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      setIsDark(true);
    }
  };
  const getDisplayName = () => {

    if (user === null) return "Guest";
    if (!user.displayName && user.isAnonymous) return "Guest User";
    
    return user.displayName || user.email?.split("@")[0] || "User";
  };

  const getPhoto = () => {
    // Get the original photoURL from Firebase
    const originalUrl = user?.photoURL;
  
    // Remove the size parameter (=s96-c) for full resolution
    const fullSizeUrl = originalUrl?.replace(/=s\d+-c$/, "");
  
    // Use the full-size URL or fallback
    if (fullSizeUrl) {
      return <img src={fullSizeUrl} alt="Profile" className="w-6 h-6 rounded-full" />;
    }
    return <FaUser className="text-white text-1xl" />;
  };
  
  const handleDraftsEvent = () => {
    navigate("/dashboard/drafts");
  };
  const handleAllProjectsEvent = () =>{
    navigate("/dashboard/all-projects");
  }
  const handleTrashEvent = () => {
    navigate("/dashboard/trash");
  }

  return (
    <div className="sm:flex-1 bg-[#1E1E1E] font-['Kumbh_Sans'] border-r border-[#383838] flex flex-col items-center p-4">
      {/* User Section */}
      <div className="flex items-center gap-2 w-full">
        {getPhoto()}
        <span className="text-white flex-1">{getDisplayName()}</span>
        <FaSignOutAlt 
          className="text-white text-lg cursor-pointer hover:text-gray-300 transition-colors" 
          onClick={handleLogout}
        />
      </div>
  
      {/* Toggle Theme Section */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-white text-[12px]">Dark Mode</span>
        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-blue-500 relative">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>
      </div>
      {/*Search for anything bar*/}
    <div className="flex items-center gap-2 w-full mt-4">
  <input
    type="text"
    placeholder="Search for anything..."
    className="w-full p-2 text-[12px] rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
    </div>
        {/*Recents Section */}
        <div className="w-full mt-4">
            <div className="flex items-center justify-between cursor-pointer transition-transform  hover:bg-gray-800 rounded-lg p-2"> 
            <span className="text-white text-[12px]">Recents</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
         {/* Teams Section */}
    <div className="w-full mt-4 border border-zinc-700 p-3 rounded-lg">
      <div className="text-white text-[14px] font-bold">Projects</div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:bg-gray-800 rounded-lg p-2"
        onClick={ handleDraftsEvent }>
      {/* Drafts Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16V8a4 4 0 018-4 4 4 0 018 4v8a4 4 0 01-8 4 4 4 0 01-8-4z" />
      </svg>
      <span className="text-white text-[12px]" >Drafts</span>
    </div>
    <div className="flex items-center gap-2 cursor-pointer transition-transform hover:bg-gray-800 rounded-lg p-2"
    onClick={ handleAllProjectsEvent }>
      {/* Projects Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18m-9 5h9" />
      </svg>
      <span className="text-white text-[12px]">Team  Projects</span>
    </div>
    <div className="flex items-center gap-2 cursor-pointer transition-transform hover:bg-gray-800 rounded-lg p-2" 
    onClick={ handleTrashEvent }>
      {/* Trash Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1 14H6L5 7m5 4v6m4-6v6M1 7h22" />
      </svg>
      <span className="text-white text-[12px]">Trash</span>
      </div>
    </div>
    </div>
        {/* Settings & Explore Community Section */}
          <div className="w-full mt-4">
      {/* Settings Section */}
      <div className="flex items-center justify-between cursor-pointer transition-transform hover:bg-gray-800 rounded-lg p-2">
        <div className="flex items-center gap-2">
        {/* Settings Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2m8-10h2M2 12h2m14.5-6.5l1.5-1.5M4.5 17.5l-1.5 1.5M16.5 17.5l1.5 1.5M4.5 4.5L3 3m9 4a3 3 0 110 6 3 3 0 010-6z" />
        </svg>
        <span className="text-white text-[12px]">Settings</span>
      </div>
      </div>
    </div>

    {/* Push Explore Community to the Bottom */}
    <div className="w-full mt-auto">
      <div className="flex items-center justify-between cursor-pointer transition-transform hover:bg-gray-800 rounded-lg p-2">
        <div className="flex items-center gap-2">
            {/* Community Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V10h-5m-8 10h5V4H9m-8 16h5V14H1v6z" />
            </svg>
          <span className="text-white text-[12px]">Explore Community</span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SidePanel;
