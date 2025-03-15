import { useState } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";
import untitledImage from "../assets/untitled.png";

const dummyProjects = [
  { name: "Untitled", last_edited: "Edited 5 days ago" },
  { name: "Untitled", last_edited: "Edited 6 days ago" },
  { name: "Untitled", last_edited: "Edited 1 month ago" },
  { name: "Untitled", last_edited: "Edited 10 months ago" },
  { name: "Untitled", last_edited: "Edited 10 months ago" },
  { name: "Untitled", last_edited: "Edited 10 months ago" },
];

const DraftsGrid = () => {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="sm:flex-8 flex flex-col overflow-hidden bg-inherit p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center px-6 py-4 border-b border-[#383838]">
        <span className="text-white text-sm font-semibold">All files</span>
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
              <div
                key={index}
                className="bg-inherit border border-[#383838] rounded-lg overflow-hidden cursor-pointer"
              >
                <img src={untitledImage} alt="Untitled" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-white text-xs font-['Kumbh Sans'] font-semibold">{proj.name}</div>
                  <div className="text-gray-400 text-xs">{proj.last_edited}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col space-y-3">
            {dummyProjects.map((proj, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-800 rounded-lg p-3 cursor-pointer transition hover:bg-gray-700"
              >
                <img src={untitledImage} alt="Untitled" className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1 ml-4">
                  <div className="text-white text-sm font-semibold">{proj.name}</div>
                  <div className="text-gray-400 text-xs">{proj.last_edited}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftsGrid;
