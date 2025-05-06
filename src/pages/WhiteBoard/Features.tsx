import { FaUserCircle, FaPlay } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import {  FiMoreHorizontal, FiMinus } from "react-icons/fi";
import React from "react";

interface FeaturesProps {
    title: string;
}
const Features: React.FC<FeaturesProps> = ({ title }) => {
    return (
        <div className="w-full bg-[#181818] font-[Kumbh_Sans]">
            <div className="flex items-center justify-between bg-[#181818] p-2">
            {/* Left Side - User Icon */}
            <div className="flex items-center rounded-lg text-sm cursor-pointer hover:bg-[#383838] transition-colors duration-300 ease-in-out p-2">
                <FaUserCircle className="text-white text-2xl cursor-pointer" />
                <MdKeyboardArrowDown className="text-white ml-2" />
            </div>
            
            {/* Right Side - Play Icon and Share Button */}
            <div className="flex items-center">
                <FaPlay className="text-white ml-4 cursor-pointer rounded" />
                <button className="bg-[#405CE3] ml-4 text-white text-sm cursor-pointer px-3 py-1 rounded-lg">Share</button>
            </div>
            </div>
            {/* Below the user section */}
            <div className="flex items-center justify-between text-xs mt-4 px-2">
            {/* Left Side - Design & Prototype */}
            <div className="flex items-center space-x-4">
                <span className="text-white bg-[#383838] px-2 py-1 rounded-lg">Design</span>
                <span className="text-white">Prototype</span>
            </div>

            {/* Right Side - Editable Zoom Level */}
            <input
                type="text"
                defaultValue="100%"
                className="bg-transparent text-white text-right w-12 text-sm border border-[#383838] rounded-full px-1 focus:outline-none focus:border-[#405CE3]" />
            </div>
            <hr className="border-none h-[2px] w-full mt-2 mb-2 bg-[#383838]" />
            {/* Label Page and Color Palette */}
            <div className="px-2 mt-4">
                <label className="text-white text-sm mb-3">Page Color</label>
                <div className="flex items-center mt-4 ">
                    <input
                        type="text"
                        defaultValue="#383838"
                        className="bg-transparent text-white text-xs border border-[#383838] rounded-lg p-1 focus:outline-none focus:border-[#405CE3] w-30"
                        id="colorHexValue"
                    />
                    <input
                        type="text"
                        defaultValue="100%"
                        className="bg-transparent text-white text-xs border border-[#383838] rounded-lg p-1 focus:outline-none focus:border-[#405CE3] w-16 ml-1"
                        id="transparencyValue"
                    />
                    <div
                        className="w-6 h-6 ml-1 cursor-pointer rounded-lg border border-[#383838]"
                        style={{ backgroundColor: '#383838' }}
                        onClick={() => document.getElementById('colorPicker')?.click()}
                    ></div>
                    
                    <input
                        type="color"
                        id="colorPicker"
                        className="hidden"
                        onChange={(e) => {
                            const colorHexValue = document.getElementById('colorHexValue') as HTMLInputElement;
                            const colorBox = e.target.previousElementSibling as HTMLDivElement;
                            colorHexValue.value = e.target.value;
                            colorBox.style.backgroundColor = e.target.value;
                        }}
                    />
                </div>
                <hr className="border-none h-[2px] w-full mt-6 mb-4 bg-[#383838]" />
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
                <label className="text-white text-sm">Local styles</label>
                <svg 
                    className="w-4 h-4 text-white cursor-pointer hover:text-gray-400 transition-colors duration-200 ease-in-out" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
            <hr className="border-none h-[2px] w-full mt-4 mb-4 bg-[#383838]" />
            <div className="flex items-center justify-between mt-4 px-2">
                <label className="text-white text-sm">Export</label>
                <svg 
                    className="w-4 h-4 text-white cursor-pointer hover:text-gray-400 transition-colors duration-200 ease-in-out" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
             {/* Selection Dropdowns */}
             <div className="flex items-center text-xs justify-between mt-4">
                <select className="border border-[#383838] w-15 text-white text-xs p-1 rounded-lg outline-none">
                    <option className="bg-[#383838]">0.5x</option>
                    <option className="bg-[#383838]">0.75x</option>
                    <option className="bg-[#383838]">1x</option>
                    <option className="bg-[#383838]">1.5x</option>
                    <option className="bg-[#383838]">2x</option>
                    <option className="bg-[#383838]">3x</option>
                </select>

                <select className="border border-[#383838] text-white w-25 text-xs p-1 rounded-lg outline-none">
                    <option className="bg-[#383838]">PNG</option>
                    <option className="bg-[#383838]">JPG</option>
                    <option className="bg-[#383838]">PDF</option>
                </select>

                {/* More Options Button */}
                <FiMoreHorizontal className="text-white text-lg cursor-pointer hover:text-gray-400 transition" />
                
                {/* Remove Button */}
                <FiMinus className="text-white text-lg cursor-pointer hover:text-gray-400 transition" />
            </div>

            {/* Export Button */}
            <button className="mt-5 w-full bg-gradient-to-r from-[#405CE3] to-[#6A82FB] text-white text-sm font-semibold p-2 rounded-lg cursor-pointer shadow-lg hover:opacity-90 transition-opacity duration-300">
                Export {title}
            </button>
            <hr className="border-none h-[2px] w-full mt-6 mb-4 bg-[#383838]" />
        </div>
    );
    }
export default
Features;