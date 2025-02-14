import { useState } from "react";
import AuthPage from "../../../AuthPage/Components/AuthPage/AuthPage";

const Buttons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 mt-6">
        <button
          className="bg-black text-white font-semibold px-6 py-2 rounded-full cursor-pointer transition duration-300 hover:scale-110"
          onClick={() => setIsModalOpen(true)}
        >
          Get Started
        </button>
        <button
          className="bg-[#e9d8b5] text-black font-semibold px-6 py-2 rounded-full cursor-pointer transition duration-300 hover:bg-[#d6c09a] hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          Login
        </button>
      </div>

      {isModalOpen && <AuthPage closeModal={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Buttons;
