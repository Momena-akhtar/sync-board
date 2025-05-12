import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { ExportHandler } from './Handlers/Tools/ExportHandler';
import { Page } from './Types/WhiteboardTypes';
import { Collaborator } from '../../services/boardService';

interface FeaturesProps {
  title: string;
  whiteboardElements: Page[];
  onBackgroundColorChange: (color: string) => void;
  currentPageIndex: number;
  createdBy: string;
  collaborators: Collaborator[];
}

interface UserProfile {
  _id: string;
  username: string;
  profileImage: string | null;
}

const Features: React.FC<FeaturesProps> = ({ title, whiteboardElements, onBackgroundColorChange, currentPageIndex, createdBy, collaborators }) => {
  const [ownerProfile, setOwnerProfile] = useState<UserProfile | null>(null);
  const [collaboratorProfiles, setCollaboratorProfiles] = useState<UserProfile[]>([]);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [format, setFormat] = useState<'PNG' | 'JPG' | 'PDF'>('PNG');

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(`http://localhost:5000/api/userProfile/${userId}`, { credentials: 'include' });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!createdBy) return;
    fetchProfile(createdBy).then(profile => {
      if (profile) setOwnerProfile(profile);
    });
  }, [createdBy]);

  useEffect(() => {
    const fetchAllCollaborators = async () => {
      const profiles = await Promise.all(
        collaborators.map(collab => fetchProfile(collab.user))
      );
      setCollaboratorProfiles(profiles.filter((p): p is UserProfile => p !== null));
    };
    fetchAllCollaborators();
  }, [collaborators]);

  const handleExport = () => {
    const boardElement = document.querySelector('.flex-1.p-4.h-full.overflow-auto') as HTMLElement;
    if (!boardElement) return;
    const originalScrollLeft = boardElement.scrollLeft;
    const originalScrollTop = boardElement.scrollTop;
    const bottomPanel = document.querySelector('.fixed.bottom-8') as HTMLElement;
    if (bottomPanel) bottomPanel.style.visibility = 'hidden';
    boardElement.scrollLeft = 0;
    boardElement.scrollTop = 0;

    ExportHandler.exportBoard(boardElement, {
      format,
      filename: title || 'whiteboard',
      scale,
      pages: whiteboardElements
    }).finally(() => {
      boardElement.scrollLeft = originalScrollLeft;
      boardElement.scrollTop = originalScrollTop;
      if (bottomPanel) bottomPanel.style.visibility = 'visible';
    });
  };

  return (
    <div className="w-full bg-[#181818] font-[Kumbh_Sans]">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center rounded-full text-sm cursor-pointer hover:bg-[#383838] p-2">
          {ownerProfile?.profileImage ? (
            <img src={ownerProfile.profileImage} alt={ownerProfile.username} className="w-8 h-8 rounded-full" />
          ) : (
            <FaUserCircle className="text-white text-2xl" />
          )}
          <MdKeyboardArrowDown
            className="text-white ml-2 cursor-pointer"
            onClick={() => setShowCollaborators(prev => !prev)}
          />
          {showCollaborators && (
            <div className="absolute mt-25 w-48 bg-transparent backdrop-blur-lg text-sm rounded-xl shadow-lg z-50 py-2">
              {collaboratorProfiles.length === 0 ? (
                <p className="text-white text-sm px-3 py-2">No collaborators</p>
              ) : (
                collaboratorProfiles.map((profile) => (
                  <div key={profile._id} className="flex items-center px-3 py-2 hover:bg-[#383838]">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt={profile.username} className="w-6 h-6 rounded-full" />
                    ) : (
                      <FaUserCircle className="text-white w-6 h-6" />
                    )}
                    <p className="ml-2 text-white text-sm">{profile.username}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button className="border border-[#405CE3] text-white text-sm px-3 cursor-pointer py-1 rounded-xl hover:bg-[#405CE3]">
          Add Collaborator
        </button>
      </div>

      <hr className="border-none h-[2px] w-full my-2 bg-[#383838]" />

      <div className="px-2 mt-4">
        <label className="text-white text-sm mb-3">Page Color</label>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={whiteboardElements[currentPageIndex]?.backgroundColor || "#1E1E1E"}
            className="bg-transparent text-white text-xs border border-[#383838] rounded-lg p-1 w-30"
            readOnly
          />
          <div
            className="w-6 h-6 ml-1 cursor-pointer rounded-lg border border-[#383838]"
            style={{ backgroundColor: whiteboardElements[currentPageIndex]?.backgroundColor || "#1E1E1E" }}
            onClick={() => document.getElementById('colorPicker')?.click()}
          ></div>
          <input
            type="color"
            id="colorPicker"
            className="hidden"
            onChange={(e) => onBackgroundColorChange(e.target.value)}
          />
        </div>
      </div>

      <hr className="border-none h-[2px] w-full my-4 bg-[#383838]" />

      <div className="flex items-center justify-between mt-4 px-2">
        <label className="text-white text-sm">Export</label>
      </div>

      <div className="flex items-center gap-2 mt-2 px-2">
        <select
          className="border border-[#383838] w-20 text-white text-xs p-1 rounded-lg bg-[#1e1e1e]"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        >
          {[0.5, 0.75, 1, 1.5, 2, 3].map(val => (
            <option key={val} value={val}>{val}x</option>
          ))}
        </select>

        <select
          className="border border-[#383838] w-20 text-white text-xs p-1 rounded-lg bg-[#1e1e1e]"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'PNG' | 'JPG' | 'PDF')}
        >
          {['PNG', 'JPG', 'PDF'].map(fmt => (
            <option key={fmt} value={fmt}>{fmt}</option>
          ))}
        </select>
      </div>

      <button
className="mt-5 w-full bg-gradient-to-l border border-[#405CE3] cursor-pointer from-transparent via-[#405CE3] to-[#0A1F66] text-white text-sm font-semibold p-2 rounded-xl hover:opacity-90 transition duration-300"
onClick={handleExport}
      >
        Export {title}
      </button>

      <hr className="border-none h-[2px] w-full mt-6 mb-4 bg-[#383838]" />
    </div>
  );
};

export default Features;
