import SidePanel from "./Components/SidePanel";
import MainPanel from "./Components/MainPanel/MainPanel";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex">
      <SidePanel />
      <MainPanel />
    </div>
  );
};

export default Dashboard;
