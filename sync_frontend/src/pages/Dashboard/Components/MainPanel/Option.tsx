import { useState } from "react";
interface OptionProps {
  icon_color: string;
  hover_color: string;
  option_name: string;
  option_url: string;
  icon_img: string;
}

const Option: React.FC<OptionProps> = ({
  icon_color,
  hover_color,
  option_name,
  option_url,
  icon_img,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex-1 flex items-center gap-2 p-2 bg-stone-600 m-4 min-h-18 max-h-20 rounded-md cursor-pointer"
      style={{ backgroundColor: hover ? hover_color : "#57534e" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`w-4 h-4 rounded-full`}
        style={{ backgroundColor: icon_color }}
      ></div>
      <span>{option_name}</span>
    </div>
  );
};

export default Option;
