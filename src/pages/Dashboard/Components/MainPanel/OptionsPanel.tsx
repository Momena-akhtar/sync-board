import  { useState } from 'react';
import Option from "./Option";
import CreateBoardPopup from './CreateBoardPopup';

const OptionsPanel = () => {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const options = [
    { 
      icon_img: "", 
      hover_color: "rgba(163, 51, 85, 0.5)", 
      icon_color: "rgb(163, 51, 85)", 
      option_name: "New Design File", 
      option_url: "",
      onClick: () => setIsCreateBoardOpen(true)
    },
    { 
      icon_img: "", 
      hover_color: "rgba(51, 96, 163, 0.5)", 
      icon_color: "rgba(51, 96, 163, 0.5)", 
      option_name: "New Slide Deck", 
      option_url: "" 
    },
    { 
      icon_img: "", 
      hover_color: "rgba(163, 146, 51, 0.38)", 
      icon_color: "rgb(163, 146, 51)", 
      option_name: "Import", 
      option_url: "" 
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-6 p-6">
        {options.map((opt, index) => (
          <Option
            key={index}
            icon_color={opt.icon_color}
            hover_color={opt.hover_color}
            icon_img={opt.icon_img}
            option_name={opt.option_name}
            option_url={opt.option_url}
            onClick={opt.onClick}
          />
        ))}
      </div>
      <CreateBoardPopup 
        isOpen={isCreateBoardOpen} 
        onClose={() => setIsCreateBoardOpen(false)} 
      />
    </>
  );
};

export default OptionsPanel;
