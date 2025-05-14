import Buttons from "./Buttons";
import Features from "./Features";
import SyncLogo from "../../assets/sync.png"

const FrontPage = () => {
  return (
<div className="relative flex font-semibold flex-col justify-center bg-gradient-to-t from-[#c4b696] to-[#f0f0f0] items-center h-screen px-12"
style={{ fontFamily: "'Kumbh Sans', sans-serif" }}>
      
      <img src={SyncLogo} alt="Sync" className="w-70 mb-4 cursor-pointer" />
      <p className="text-lg text-black max-w-md text-center">
        Sync helps you{' '}
        <span className="text-2xl font-bold px-2 py-1 bg-gradient-to-r from-red-500/50 to-white rounded-full">
          design
        </span>
        {' '}and{' '}
        <span className="text-2xl font-bold px-2 py-1 bg-gradient-to-r from-white to-yellow-500/50 rounded-full">
          develop
        </span>
        {' '}great products,{' '}
        <span className="text-2xl px-2 font-bold py-1 border border-green-500 bg-green-500/20 rounded-full animate-typing transition duration-300 hover:scale-105">
          together
        </span>
        .
      </p>
      <Buttons />
      {/* Position Features at the bottom center */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Features />
      </div>
    </div>
  );
};

export default FrontPage;
