import "./Header.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../../Context/AuthContext";

const getPageMeta = (pathname) => {
  if (pathname.startsWith("/dashboard/students/add")) {
    return {
      crumbs: [{ label: "Students", to: "/dashboard/students" }],
      current: "Add students",
      backTo: "/dashboard/students",
    };
  }
  if (pathname === "/dashboard/top-students") {
    return {
      crumbs: [{ label: "Dashboard", to: "/dashboard" }],
      current: "Top students",
      backTo: "/dashboard",
    };
  }
  if (pathname === "/dashboard/students") {
    return { title: "Students" };
  }
  if (pathname.startsWith("/dashboard/exams/create")) {
    return {
      crumbs: [{ label: "Exam", to: "/dashboard/exams" }],
      current: "Create exam",
      backTo: "/dashboard/exams",
    };
  }
  if (pathname.startsWith("/dashboard/exams/")) {
    return {
      crumbs: [{ label: "Exams", to: "/dashboard/exams" }],
      current: "View exam",
      backTo: "/dashboard/exams",
    };
  }
  if (pathname === "/dashboard/exams") {
    return { title: "Exams" };
  }
  if (pathname.startsWith("/dashboard/discussion-room/create-post")) {
    return {
      crumbs: [{ label: "Community", to: "/dashboard/discussion-room" }],
      current: "post",
      backTo: "/dashboard/discussion-room",
    };
  }
  if (pathname.startsWith("/dashboard/discussion-room/post/")) {
    return {
      crumbs: [{ label: "Community", to: "/dashboard/discussion-room" }],
      current: "Post",
      backTo: "/dashboard/discussion-room",
    };
  }
  if (pathname === "/dashboard/discussion-room/notifications") {
    return {
      crumbs: [{ label: "Community", to: "/dashboard/discussion-room" }],
      current: "Notifications",
      backTo: "/dashboard/discussion-room",
    };
  }
  if (pathname === "/dashboard/discussion-room") {
    return { title: "Community" };
  }
  if (pathname.startsWith("/dashboard/subscriptions/purchase-code")) {
    return {
      crumbs: [{ label: "Subscription", to: "/dashboard/subscriptions" }],
      current: "Purchase code",
      backTo: "/dashboard/subscriptions",
    };
  }
  if (pathname === "/dashboard/subscriptions") {
    return { title: "Subscription" };
  }
  if (pathname === "/dashboard/settings") {
    return { title: "Settings" };
  }
  return { title: "Dashboard" };
};

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const meta = getPageMeta(location.pathname);
  const orgName = user?.organization_profile?.organization_name;
  const initial = (orgName || user?.user?.email || "A").charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className="app-topbar d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn d-lg-none p-1 me-1"
          onClick={onToggleSidebar}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        {meta.title ? (
          <h5 className="m-0 topbar-title">{meta.title}</h5>
        ) : (
          <div className="d-flex align-items-center topbar-breadcrumb">
            <button
              className="btn p-0 me-2 back-chevron"
              onClick={() => navigate(meta.backTo)}
              aria-label="Go back"
            >
              <ChevronLeftIcon />
            </button>
            {meta.crumbs?.map((crumb) => (
              <span key={crumb.to} className="d-flex align-items-center">
                <Link to={crumb.to} className="crumb-link text-decoration-none">
                  {crumb.label}
                </Link>
                <ChevronRightIcon className="crumb-sep" fontSize="small" />
              </span>
            ))}
            <span className="crumb-current">{meta.current}</span>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn topbar-icon-btn" aria-label="Notifications">
          <NotificationsOutlinedIcon />
        </button>
        <div className="position-relative">
          <button
            className="btn p-0 topbar-avatar"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account menu"
          >
            {initial}
          </button>
          {menuOpen && (
            <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
              <div className="topbar-menu">
                <Link
                  to="/dashboard/settings"
                  className="topbar-menu-item text-decoration-none"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="topbar-menu-item text-danger"
                  disabled={loggingOut}
                  onClick={handleLogout}
                >
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            </ClickAwayListener>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
