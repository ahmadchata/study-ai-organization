import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import LoadingTracker from "../components/Common/Loading";
import Header from "../components/Layout/Header/Header";
import Sidebar from "../components/Layout/SideBar/Sidebar";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingTracker />;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell d-flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main flex-fill min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
