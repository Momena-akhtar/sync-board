import { useState } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";
import untitledImage from "../assets/untitled.png";

const dummyProjects = Array(6).fill({
  name: "Untitled",
  last_edited: "Edited 10 months ago",
});

const ProjectsGrid = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {dummyProjects.map((proj, index) => (
              <div key={index} className="border cursor-pointer border-[#383838] rounded-lg p-2">
                <img src={untitledImage} alt="Untitled" className="w-full h-40 object-cover rounded-md" />
                <div className="text-white font-['Kumbh_Sans'] text-sm mt-2">{proj.name}</div>
                <div className="text-gray-400 text-xs">{proj.last_edited}</div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col space-y-3">
            {dummyProjects.map((proj, index) => (
              <div key={index} className="border border-gray-900 rounded-lg p-2 flex items-center space-x-4">
                <img src={untitledImage} alt="Untitled" className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1 text-white text-sm">{proj.name}</div>
                <div className="text-gray-400 text-xs">{proj.last_edited}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGrid;
