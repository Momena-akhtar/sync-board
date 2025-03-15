import { useState } from "react";
import { FaFileAlt, FaFilePowerpoint, FaFileImport } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // If using React Router


interface OptionProps {
  icon_color: string;
  hover_color: string;
  option_name: string;
  option_url: "../../../WhiteBoard/Whiteboard"; // Path to the whiteboard or other destination
}

const Option: React.FC<OptionProps> = ({
  icon_color,
  hover_color,
  option_name,
}) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  const getIcon = (name: string) => {
    switch (name) {
      case "New Design File":
        return <FaFileAlt className="text-white text-[12px]" />;
      case "New Slide Deck":
        return <FaFilePowerpoint className="text-white text-[12px]" />;
      case "Import":
        return <FaFileImport className="text-white text-[12px]" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (option_name === "New Design File") {
      // If using React Router
      navigate("/whiteboard");
    }
  };

  return (
    <div
      className="flex-1 flex items-center gap-3 p-3 bg-zinc-800 hover:bg-opacity-80 m-4 min-h-[80px] rounded-lg cursor-pointer transition-all duration-200 ease-in-out border border-zinc-700 shadow-sm"
      style={{ backgroundColor: hover ? hover_color : "#3f3f46" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick} // Click handling
    >
      <div
        className="w-8 h-8 flex items-center justify-center rounded-full bg-opacity-30"
        style={{ backgroundColor: icon_color }}
      >
        {getIcon(option_name)}
      </div>

      <span className="text-white font-['Kumbh_Sans'] text-[12px]">{option_name}</span>
    </div>
  );
};

export default Option;
