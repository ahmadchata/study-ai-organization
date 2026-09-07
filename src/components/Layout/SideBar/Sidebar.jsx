import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CloseIcon from "@mui/icons-material/Close";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: DashboardOutlinedIcon,
    match: (path) => path === "/dashboard" || path === "/dashboard/top-students",
  },
  {
    label: "Students",
    to: "/dashboard/students",
    icon: GroupOutlinedIcon,
    match: (path) => path.startsWith("/dashboard/students"),
  },
  {
    label: "Exams",
    to: "/dashboard/exams",
    icon: MenuBookOutlinedIcon,
    match: (path) => path.startsWith("/dashboard/exams"),
  },
  {
    label: "Community",
    to: "/dashboard/discussion-room",
    icon: ChatBubbleOutlineOutlinedIcon,
    match: (path) => path.startsWith("/dashboard/discussion-room"),
  },
  {
    label: "Subscription",
    to: "/dashboard/subscriptions",
    icon: CreditCardOutlinedIcon,
    match: (path) => path.startsWith("/dashboard/subscriptions"),
  },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <>
      {open && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}
      <aside className={`app-sidebar ${open ? "app-sidebar-open" : ""}`}>
        <div className="d-flex align-items-center justify-content-between mb-4 px-1">
          <Link to="/dashboard" className="d-inline-flex">
            <img src="/assets/logo-green.png" alt="StudyAI" className="sidebar-logo" />
          </Link>
          <button className="btn d-lg-none p-1" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="d-flex flex-column gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.match(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`sidebar-nav-item text-decoration-none ${active ? "sidebar-nav-item-active" : ""}`}
              >
                <Icon fontSize="small" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
