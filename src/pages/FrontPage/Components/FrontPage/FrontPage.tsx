import Buttons from "./Buttons";
import Features from "./Features";
import BackgroundShapes from "./BackgroundVideo";
import SyncLogo from "../../assets/sync.png"

const FrontPage = () => {
  return (
<div className="relative flex flex-col justify-center items-start h-screen px-12 bg-gradient-to-t from-[#c39f50] to-[#f5ebd3]"
style={{ fontFamily: "'Kumbh Sans', sans-serif" }}>
      
      <img src={SyncLogo} alt="Sync" className="w-70 mb-4 cursor-pointer" />
      <p className="text-lg text-black max-w-md">
        Sync helps you design and develop great products, together.
      </p>
      <Buttons />
      {/* Position Features at the bottom center */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Features />
      </div>
      <BackgroundShapes />
    </div>
  );
};

export default FrontPage;
