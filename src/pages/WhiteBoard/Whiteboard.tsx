import SidePanel from "./SidePanel";
import MainBoard from "./MainBoard/MainBoard";
import Features from "./Features";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WhiteBoard = () => {
    const [title, setTitle] = useState("Untitled");
    const [sidePanelVisible, setSidePanelVisible] = useState(true);
    const [featuresPanelVisible, setFeaturesPanelVisible] = useState(true);
  
    return (
      <div className="flex h-screen w-screen bg-[#1E1E1E]">
        {/* Left Panel (SidePanel) */}
        <div className={`relative transition-all duration-300 ease-in-out ${
          sidePanelVisible ? 'w-1/5' : 'w-0'
        } bg-[#181818]`}>
          {sidePanelVisible && (
            <div className="text-white text-sm font-['Kumbh_Sans'] p-4">
              <SidePanel title={title} setTitle={setTitle} />
            </div>
          )}
          <button
            onClick={() => setSidePanelVisible(!sidePanelVisible)}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-[#181818] text-white p-2 rounded-full z-50 hover:bg-[#383838] transition-colors duration-300"
          >
            {sidePanelVisible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
  
        {/* Middle Section (MainBoard) - scrollable area */}
        <div className="flex-1 bg-[#1E1E1E] p-4 h-full overflow-auto">
          <MainBoard />
        </div>
  
        {/* Right Panel (Features) */}
        <div className={`relative transition-all duration-300 ease-in-out ${
          featuresPanelVisible ? 'w-1/5' : 'w-0'
        } bg-[#181818]`}>
          {featuresPanelVisible && (
            <div className="p-4">
              <Features title={title} />
            </div>
          )}
          <button
            onClick={() => setFeaturesPanelVisible(!featuresPanelVisible)}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-[#181818] text-white p-2 rounded-full z-50 hover:bg-[#383838] transition-colors duration-300"
          >
            {featuresPanelVisible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    );
  };
  
  export default WhiteBoard;
  
  

