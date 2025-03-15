import SidePanel from "./SidePanel";
import MainBoard from "./MainBoard/MainBoard";
import Features from "./Features";

const WhiteBoard = () => {
    return (
        <div className="flex h-screen w-screen bg-[#1E1E1E]">
            {/* Left Panel (SidePanel) */}
            <div className="w-1/5 bg-[#181818] text-white text-sm font-['Kumbh_Sans'] p-4">
                <SidePanel />
            </div>
            
            {/* Middle Section (Board) */}
            <div className="flex-1 bg-[#1E1E1E] p-4">
                <MainBoard />
            </div>
            
            {/* Right Panel (Features) */}
            <div className="w-1/5 bg-[#181818] p-4">
                <Features />
            </div>
        </div>
    );
};

export default WhiteBoard;
