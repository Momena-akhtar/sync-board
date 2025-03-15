import React from "react";

interface ProjOptionProps {
  name?: string;
  last_edited?: string;
  image: string;
}

const ProjOption: React.FC<ProjOptionProps> = ({
  name = "Untitled",
  last_edited,
  image,
}) => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="border p-2 h-40 w-70 rounded-lg shadow-md bg-gray">
      <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <h3 className="mt-2 text-[10px] font-semibold text-gray-800 font-['Kumbh_Sans'] truncate">
        {name}
      </h3>
      <p className="text-[10px] text-gray-500 font-['Kumbh_Sans']">
        Last Edited: {last_edited || today}
      </p>
    </div>
  );
};

export default ProjOption;
