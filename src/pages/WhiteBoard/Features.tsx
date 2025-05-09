import { FaUserCircle, FaPlay } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiMoreHorizontal, FiMinus } from "react-icons/fi";
import React, { useState } from 'react';
import { ExportHandler } from './Handlers/Tools/ExportHandler';
import { WhiteboardObject, Page } from './Types/WhiteboardTypes';

interface FeaturesProps {
    title: string;
    whiteboardElements: Page[];
    onBackgroundColorChange: (color: string) => void;
    currentPageIndex: number;
}

const Features: React.FC<FeaturesProps> = ({ title, whiteboardElements, onBackgroundColorChange, currentPageIndex }) => {
    const [scale, setScale] = useState<number>(1);
    const [format, setFormat] = useState<'PNG' | 'JPG' | 'PDF'>('PNG');

    const handleExport = () => {
        // Get the main board container element - specifically the content area
        const boardElement = document.querySelector('.flex-1.p-4.h-full.overflow-auto') as HTMLElement;
        if (!boardElement) {
            console.error('Could not find whiteboard element');
            return;
        }

        // Store original scroll position
        const originalScrollLeft = boardElement.scrollLeft;
        const originalScrollTop = boardElement.scrollTop;

        // Hide bottom panel temporarily
        const bottomPanel = document.querySelector('.fixed.bottom-8') as HTMLElement;
        if (bottomPanel) {
            bottomPanel.style.visibility = 'hidden';
        }

        // Reset scroll position temporarily
        boardElement.scrollLeft = 0;
        boardElement.scrollTop = 0;

        ExportHandler.exportBoard(boardElement, {
            format,
            filename: title || 'whiteboard',
            scale,
            pages: whiteboardElements
        }).finally(() => {
            // Restore original scroll position and bottom panel
            boardElement.scrollLeft = originalScrollLeft;
            boardElement.scrollTop = originalScrollTop;
            if (bottomPanel) {
                bottomPanel.style.visibility = 'visible';
            }
        });
    };
    const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setScale(parseFloat(e.target.value));
    };

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormat(e.target.value as 'PNG' | 'JPG' | 'PDF');
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        onBackgroundColorChange(newColor);
        const colorHexValue = document.getElementById('colorHexValue') as HTMLInputElement;
        const colorBox = document.querySelector('.color-preview') as HTMLDivElement;
        if (colorHexValue) colorHexValue.value = newColor;
        if (colorBox) colorBox.style.backgroundColor = newColor;
    };

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
            
            </div>
            <hr className="border-none h-[2px] w-full mt-2 mb-2 bg-[#383838]" />
            {/* Label Page and Color Palette */}
            <div className="px-2 mt-4">
                <label className="text-white text-sm mb-3">Page Color</label>
                <div className="flex items-center  mt-4 ">
                    <input
                        type="text"
                        value={whiteboardElements[currentPageIndex]?.backgroundColor || "#1E1E1E"}
                        className="bg-transparent text-white text-xs border border-[#383838] rounded-lg p-1 focus:outline-none focus:border-[#405CE3] w-30"
                        id="colorHexValue"
                        readOnly
                    />
                    <div
                        className="w-6 h-6 ml-1 cursor-pointer rounded-lg border border-[#383838] color-preview"
                        style={{ backgroundColor: whiteboardElements[currentPageIndex]?.backgroundColor || "#1E1E1E" }}
                        onClick={() => document.getElementById('colorPicker')?.click()}
                    ></div>
                    
                    <input
                        type="color"
                        id="colorPicker"
                        className="hidden"
                        value={whiteboardElements[currentPageIndex]?.backgroundColor || "#1E1E1E"}
                        onChange={handleColorChange}
                    />
                </div>
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
             <div className="flex items-center justify-between gap-2 mt-2 px-2">
                <select 
                    className="border border-[#383838] w-20 text-white text-xs p-1 rounded-lg outline-none bg-[#1e1e1e]"
                    value={scale}
                    onChange={handleScaleChange}
                >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                </select>

                <select 
                    className="border border-[#383838] text-white w-20 text-xs p-1 rounded-lg outline-none bg-[#1e1e1e]"
                    value={format}
                    onChange={handleFormatChange}
                >
                    <option value="PNG">PNG</option>
                    <option value="JPG">JPG</option>
                    <option value="PDF">PDF</option>
                </select>

                {/* More Options Button */}
                <FiMoreHorizontal className="text-white text-lg cursor-pointer hover:text-gray-400 transition" />
                
                {/* Remove Button */}
                <FiMinus className="text-white text-lg cursor-pointer hover:text-gray-400 transition" />
            </div>

            {/* Export Button */}
            <button 
                className="mt-5 w-full bg-gradient-to-r from-[#405CE3] to-[#6A82FB] text-white text-sm font-semibold p-2 rounded-lg cursor-pointer shadow-lg hover:opacity-90 transition-opacity duration-300"
                onClick={handleExport}
            >
                Export {title}
            </button>
            <hr className="border-none h-[2px] w-full mt-6 mb-4 bg-[#383838]" />
        </div>
    );
}

export default Features;