import { useState } from "react";
import { Move, Square, Pen, Eraser, Shapes, Image, Type,  ArrowDownLeft, ChevronDown, Circle, Triangle, Diamond, Hexagon } from "lucide-react";
import { JSX } from "react/jsx-runtime";

interface Tool {
    name: string;
    icon: JSX.Element;
    key: string;
    hasSubmenu?: boolean;
    submenuItems?: Array<{
        name: string;
        icon: JSX.Element;
        key: string;
    }>;
}

interface BottomPanelProps {
    activeTool: string;
    setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}

const tools: Tool[] = [
    { name: "Move", icon: <Move size={20} />, key: "move" },
    { name: "Frame", icon: <Square size={20} />, key: "frame" },
    { 
        name: "Shapes", 
        icon: <Shapes size={20} />, 
        key: "shapes", 
        hasSubmenu: true,
        submenuItems: [
            { name: "Rectangle", icon: <Square size={16} />, key: "rectangle" },
            { name: "Circle", icon: <Circle size={16} />, key: "circle" },
            { name: "Triangle", icon: <Triangle size={16} />, key: "triangle" },
            { name: "Diamond", icon: <Diamond size={16} />, key: "diamond" },
            { name: "Hexagon", icon: <Hexagon size={16} />, key: "hexagon" },
            { name: "Arrow", icon: <ArrowDownLeft size={16} />, key: "hexagon" },
        ]
    },
    { name: "Pen", icon: <Pen size={20} />, key: "pen" },
    { name: "Eraser", icon: <Eraser size={20} />, key: "eraser" },
    { name: "Text", icon: <Type size={20} />, key: "text" },
    { name: "Image", icon: <Image size={20} />, key: "Image" },
];

const BottomPanel: React.FC<BottomPanelProps> = ({ activeTool, setActiveTool }) => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleTooltip = (key: string) => {
        if (openSubmenu) return;
        setActiveTooltip(activeTooltip === key ? null : key);
    };

    const toggleSubmenu = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenSubmenu(openSubmenu === key ? null : key);
        setActiveTooltip(null);
    };

    // Close submenu when clicking outside
    const handleClickOutside = () => {
        setOpenSubmenu(null);
    };
  
    return (
        <div 
            className="relative flex justify-center bg-transparent backdrop-blur-lg border border-[#454545] font-[Kumbh_Sans] p-4 rounded-[20px] space-x-6"
            onClick={handleClickOutside}
        >
            {tools.map((tool) => (
                <div key={tool.key} className="relative flex flex-col items-center">
                    <button
                        className={`flex items-center gap-1 cursor-pointer text-white hover:opacity-80 transition-all duration-200 ${activeTool === tool.key || (tool.submenuItems?.some(item => item.key === activeTool) ?? false) ? 'text-blue-400' : ''}`}
                        onMouseEnter={() => toggleTooltip(tool.key)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={(e) => {
                            if (tool.hasSubmenu) {
                                toggleSubmenu(tool.key, e);
                            } else {
                                setActiveTool(tool.key);
                                setOpenSubmenu(null);
                            }
                        }}
                    >
                        {tool.icon}
                        <ChevronDown 
                            size={14} 
                            className={`transition-transform duration-200 ${openSubmenu === tool.key ? 'rotate-180' : ''}`} 
                        />
                    </button>

                    {activeTooltip === tool.key && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white text-xs px-3 py-1 rounded-md shadow-lg transition-all duration-200 opacity-90 z-50">
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1E1E1E]"></div>
                            {tool.name}
                        </div>
                    )}

                    {/* Submenu for shapes */}
                    {tool.hasSubmenu && openSubmenu === tool.key && (
                        <div 
                            className="absolute -top-60 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white rounded-md shadow-lg transition-all duration-200 z-50 w-40 border border-[#454545] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1E1E1E]"></div>
                            {tool.submenuItems?.map((item) => (
                                <div 
                                    key={item.key}
                                    className={`flex items-center gap-2 px-3 py-2 hover:bg-[#2a2a2a] cursor-pointer ${activeTool === item.key ? 'bg-[#2a2a2a] text-blue-400' : ''}`}
                                    onClick={() => {
                                        setActiveTool(item.key);
                                        setOpenSubmenu(null);
                                    }}
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BottomPanel; 