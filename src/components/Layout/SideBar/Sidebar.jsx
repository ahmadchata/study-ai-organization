import "./Sidebar.css";
import { Link } from "react-router-dom";
import { forwardRef, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

const Sidebar = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
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
        <label>Hi, Brazen Tutors</label>
        <div className="d-block d-lg-none my-5 justify-content-between align-items-center">
          <div className="d-flex justify-content-between">
            <Link
              className={`text-decoration-none ${
                location.pathname === "/dashboard" ? "green-text" : "text-dark"
              }`}
              to={"/dashboard"}
              onClick={handleLinkClick}
            >
              <WorkspacesIcon style={{ color: "#000", marginRight: "10px" }} />
              Overview
            </Link>

            <Link
              className={`text-decoration-none ${
                location.pathname === "/dashboard/students"
                  ? "green-text"
                  : "text-dark"
              }`}
              to={"/dashboard/students"}
              onClick={handleLinkClick}
            >
              <GroupIcon style={{ color: "#000", marginRight: "10px" }} />
              Students
            </Link>

            <Link
              className={`text-decoration-none ${
                location.pathname.includes("/dashboard/subscriptions")
                  ? "green-text"
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
        <ul className="list-unstyled d-flex justify-content-between align-items-center mt-4">
          <Link
            to="/dashboard/account"
            className="text-decoration-none text-dark d-flex"
            onClick={handleLinkClick}
          >
            <PersonIcon style={{ color: "#000", marginRight: "10px" }} />
            <li>Account</li>
          </Link>
          <li
            onClick={handleLogout}
            className="text-danger"
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
