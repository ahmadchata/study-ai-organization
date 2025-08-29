import "./Sidebar.css";
import { Link } from "react-router-dom";
import { forwardRef, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";

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
