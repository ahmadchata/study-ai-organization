import "./Sidebar.css";
import { Link } from "react-router-dom";
import { forwardRef, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const Sidebar = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { logout } = useAuth();
  const { onClose } = props;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <div
      ref={ref}
      className={`side-bar bg-white position-absolute rounded-4 p-4 border border-2`}
      style={{ minWidth: "272px" }}
    >
      <div>
        {/* Tab Switcher */}
        <div className="d-flex gap-5 mb-4">
          <button
            className={`tab-button ${activeTab === "dashboard" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "discussion" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("discussion")}
          >
            Discussion Room
          </button>
        </div>

        {/* Dashboard Links */}
        {activeTab === "dashboard" && (
          <div className="d-block d-lg-none mt-1 justify-content-between align-items-center">
            <div className="d-fle justify-content-between">
              <Link
                className={`text-decoration-none d-flex ${
                  location.pathname === "/dashboard"
                    ? "side-bar-active"
                    : "text-dark"
                }`}
                to={"/dashboard"}
                onClick={handleLinkClick}
              >
                <WorkspacesIcon
                  style={{ color: "#000", marginRight: "10px" }}
                />
                Overview
              </Link>

              <Link
                className={`text-decoration-none d-flex my-3 ${
                  location.pathname === "/dashboard/students"
                    ? "side-bar-active"
                    : "text-dark"
                }`}
                to={"/dashboard/students"}
                onClick={handleLinkClick}
              >
                <GroupIcon style={{ color: "#000", marginRight: "10px" }} />
                Students
              </Link>

              <Link
                className={`text-decoration-none d-flex ${
                  location.pathname.includes("/dashboard/subscriptions")
                    ? "side-bar-active"
                    : "text-dark"
                }`}
                to={"/dashboard/subscriptions"}
                onClick={handleLinkClick}
              >
                <SpeakerGroupIcon
                  style={{ color: "#000", marginRight: "10px" }}
                />
                Subscriptions
              </Link>
            </div>
          </div>
        )}

        {/* Discussion Room Links */}
        {activeTab === "discussion" && (
          <div className="d-block d-lg-none mt-1 justify-content-between align-items-center">
            <div className="d-fle justify-content-between">
              <Link
                className={`text-decoration-none d-flex ${
                  location.pathname === "/dashboard/discussion-room"
                    ? "side-bar-active"
                    : "text-dark"
                }`}
                to={"/dashboard/discussion-room"}
                onClick={handleLinkClick}
              >
                <HomeOutlinedIcon
                  style={{ color: "#000", marginRight: "10px" }}
                />
                Homepage
              </Link>

              <Link
                className={`text-decoration-none d-flex my-3 ${
                  location.pathname ===
                  "/dashboard/discussion-room/notifications"
                    ? "side-bar-active"
                    : "text-dark"
                }`}
                to={"/dashboard/discussion-room/notifications"}
                onClick={handleLinkClick}
              >
                <NotificationsOutlinedIcon
                  style={{ color: "#000", marginRight: "10px" }}
                />
                Notifications
              </Link>
            </div>
          </div>
        )}
        <ul className="list-unstyled mt-3 mt-lg-4 d-block d-lg-flex justify-content-between">
          <Link
            to="/dashboard/account"
            className={`text-decoration-none d-flex ${
              location.pathname.includes("/dashboard/account")
                ? "side-bar-active"
                : "text-dark"
            }`}
            onClick={handleLinkClick}
          >
            <PersonIcon style={{ color: "#000", marginRight: "8px" }} />
            <li>Account</li>
          </Link>
          <li
            onClick={handleLogout}
            className="text-danger mt-5 mt-lg-0"
            style={{ cursor: "pointer" }}
          >
            {loading ? "Logging out..." : "Logout"}
          </li>
        </ul>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

export default Sidebar;
