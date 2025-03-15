import { Routes, Route } from "react-router-dom";
import SidePanel from "./Components/SidePanel";
import MainPanel from "./Components/MainPanel/MainPanel";
import Drafts from "./Components/Drafts/Drafts";
import AllProjects from "./Components/TeamProjects/TeamProjects";
import Trash from "./Components/Trash/Trash";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex">
      <SidePanel />
      <Routes>
          <Route path="/" element={<MainPanel />} /> {/* Default Panel */}
          <Route path="drafts" element={<Drafts />} /> {/* Drafts Panel */}
          <Route path="all-projects" element={<AllProjects />} /> {/* All Projects Panel */}  
          <Route path="trash" element={<Trash />} /> {/* Trash Panel */}  
        </Routes>
    </div>
  );
};

export default Dashboard;
