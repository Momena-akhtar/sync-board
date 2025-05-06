import SidePanel from "./SidePanel";
import MainBoard from "./MainBoard/MainBoard";
import Features from "./Features";
import { useState } from "react";
const WhiteBoard = () => {
    const [title, setTitle] = useState("Untitled");
  
    return (
      <div className="flex h-screen w-screen bg-[#1E1E1E]">
        {/* Left Panel (SidePanel) */}
        <div className="w-1/5 bg-[#181818] text-white text-sm font-['Kumbh_Sans'] p-4">
          <SidePanel title={title} setTitle={setTitle} />
        </div>
  
        {/* Middle Section (MainBoard) - scrollable area */}
        <div className="flex-1 bg-[#1E1E1E] p-4 h-full overflow-auto">
          <MainBoard />
        </div>
  
        {/* Right Panel (Features) */}
        <div className="w-1/5 bg-[#181818] p-4">
          <Features title={title} />
        </div>
      </div>
    );
  };
  
  export default WhiteBoard;
  
  

