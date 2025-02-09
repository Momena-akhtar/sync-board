import OptionsPanel from "./OptionsPanel";
import ProjectsGrid from "./ProjectsGrid";

const MainPanel = () => {
  return (
    <div className="sm:flex-5 bg-zinc-700 flex flex-col overflow-hidden">
      <div className="sm:flex-1 flex bg-transparent border-b border-solid border-zinc-500 "></div>

      <div className="sm:flex-12 flex-col bg-transparent flex overflow-hidden ">
        <OptionsPanel />
        <ProjectsGrid />
      </div>
    </div>
  );
};

export default MainPanel;
