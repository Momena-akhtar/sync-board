import React from "react";

interface ProjOptionProps {
  name: string;
  last_edited: string;
  image: string;
}

const ProjOption: React.FC<ProjOptionProps> = ({
  name,
  last_edited,
  image,
}) => {
  return (
    <div className="border p-2 lg:h-56 lg:w-64 sm:h-40 sm:w-40 h-56 w-64 rounded-lg shadow-lg bg-white">
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-md"
      />
      <h3 className="mt-2 text-lg font-bold">{name}</h3>
      <p className="text-gray-600">Last Edited: {last_edited}</p>
    </div>
  );
};

export default ProjOption;
