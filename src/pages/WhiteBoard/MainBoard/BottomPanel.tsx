import { useState } from "react";
import { Move, Square, Pen, Type, MessageSquare, Zap, ChevronDown } from "lucide-react";
import { JSX } from "react/jsx-runtime";

interface Tool {
    name: string;
    icon: JSX.Element;
    key: string;
}

const tools: Tool[] = [
    { name: "Move ", icon: <Move size={20} />, key: "move" },
    { name: "Frame", icon: <Square size={20} />, key: "frame" },
    { name: "Rectangle", icon: <Square size={20} />, key: "rectangle" },
    { name: "Pen", icon: <Pen size={20} />, key: "pen" },
    { name: "Text ", icon: <Type size={20} />, key: "text" },
    { name: "Comment", icon: <MessageSquare size={20} />, key: "comment" },
    { name: "Actions ", icon: <Zap size={20} />, key: "actions" },
];

const BottomPanel = () => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const toggleTooltip = (key: string) => {
        setActiveTooltip(activeTooltip === key ? null : key);
    };

    return (
        <div className="relative flex justify-center bg-[#383838] border border-[#454545] font-[Kumbh_Sans] p-4 rounded-[20px] space-x-6">
            {tools.map((tool) => (
                <div key={tool.key} className="relative flex flex-col items-center">
                    <button
                        className="flex items-center gap-1 cursor-pointer text-white hover:opacity-80 transition-all duration-200"
                        onMouseEnter={() => toggleTooltip(tool.key)}
                        onMouseLeave={() => setActiveTooltip(null)}
                    >
                        {tool.icon}
                        <ChevronDown size={14} />
                    </button>

                    {activeTooltip === tool.key && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white text-xs px-3 py-1 rounded-md shadow-lg transition-all duration-200 opacity-90">
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1E1E1E]"></div>
                            {tool.name}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BottomPanel;
