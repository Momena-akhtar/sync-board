import videoSrc from "../../assets/video.mp4"; // Adjust path based on your structure

const BackgroundShapes = () => {
  return (
    <div className="absolute right-10 h-full w-1/3 flex flex-col gap-8 ">
  
      <video 
        src={videoSrc} 
        className="w-300 h-300" 
        autoPlay 
        loop 
        muted 
      />
      
    </div>
  );
};
export default BackgroundShapes;
