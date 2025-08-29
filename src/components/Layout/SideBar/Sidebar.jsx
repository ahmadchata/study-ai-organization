import "./Sidebar.css";
import { Link } from "react-router-dom";
import { forwardRef, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation } from "react-router-dom";

const Sidebar = forwardRef((props, ref) => {
  const location = useLocation();
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
      className={`side-bar position-absolute rounded-4 p-4 border border-2`}
    >
      <div>
        <ul className="list-unstyled d-flex justify-content-between align-items-center">
          <Link
            to="/dashboard/community"
            className="text-decoration-none text-dark"
            onClick={handleLinkClick}
          >
            <li>Community</li>
          </Link>
          {location.pathname === "/dashboard/profile" ? (
            <Link
              to="/dashboard/learning"
              className="text-decoration-none text-dark"
              onClick={handleLinkClick}
            >
              <li className="mx-5">Learning</li>
            </Link>
          ) : (
            <Link
              to="/dashboard/profile"
              className="text-decoration-none text-dark"
              onClick={handleLinkClick}
            >
              <li className="mx-5">Profile</li>
            </Link>
          )}

          <li
            onClick={handleLogout}
            className="text-danger"
            style={{ cursor: "pointer" }}
          >
            {loading ? "Logging out..." : "Logout"}
          </li>
        </ul>
        <Link
          to="/dashboard/study-ai"
          className="text-decoration-none"
          onClick={handleLinkClick}
        >
          <button className="py-3 d-flex align-items-center btn secondary-btn mt-4 px-4 py-2">
            <img
              src="/assets/logo.svg"
              width={94}
              height={19}
              className="img-fluid"
            />
          </button>
        </Link>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

export default Sidebar;
