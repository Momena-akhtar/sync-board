import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage/Components/FrontPage/FrontPage";
import AuthPage from "./pages/AuthPage/Components/AuthPage/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Whiteboard from "./pages/WhiteBoard/Whiteboard";

const App = () => {
  return (
    <Router>
      <div className="w-screen h-screen">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/auth" element={<AuthPage closeModal={() => {}} />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/whiteboard/:id" element={<Whiteboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
