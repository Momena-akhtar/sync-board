import OptionsPanel from "./OptionsPanel";
import ProjectsGrid from "./ProjectsGrid";

const MainPanel = () => {
  return (
    <div className="sm:flex-5 bg-[#1E1E1E] flex flex-col overflow-hidden">
  <div className="sm:flex-1 flex bg-transparent text-white font-['Kumbh_Sans'] border-b border-[#383838] justify-start items-center pl-4">
    Recents
  </div>
   {/* Welcome Back Card */}
   <div className="w-[80%] bg-gradient-to-r from-[rgb(178, 184, 190)] to-[rgb(33,64,175)] text-white text-lg font-bold font-['Kumbh_Sans'] flex items-center justify-center rounded-lg p-4 mt-4 mx-auto border-1 border-[rgb(20,120,255)]">
   Welcome Back
</div>

      <div className="sm:flex-12 flex-col bg-transparent flex overflow-hidden ">
        <OptionsPanel />
        <ProjectsGrid />
      </div>
    </div>
  );
};

export default MainPanel;
