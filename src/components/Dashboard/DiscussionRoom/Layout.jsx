import "./styles.css";
import { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";

const Layout = ({ id, children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="discussion-room-container">
      {/* Fixed Column */}
      <div className="d-none d-lg-block fixed-column">
        <nav className="nav-buttons">
          <Link
            className={`text-decoration-none`}
            to={"/dashboard/discussion-room"}
          >
            <button
              type="button"
              className={`nav-button ${
                location.pathname === "/dashboard/discussion-room" &&
                "nav-button-active"
              }`}
            >
              <HomeOutlinedIcon fontSize="small" />
              <span>Homepage</span>
            </button>
          </Link>
          <Link
            className={`text-decoration-none`}
            to={"/dashboard/discussion-room/notifications"}
          >
            <button
              type="button"
              className={`nav-button ${
                location.pathname ===
                  "/dashboard/discussion-room/notifications" &&
                "nav-button-active"
              }`}
            >
              <NotificationsOutlinedIcon fontSize="small" />
              <span>Notifications</span>
            </button>
          </Link>
          {/* <Link
            className={`text-decoration-none`}
            to={"/dashboard/discussion-room/notifications"}
          >
            <button
              type="button"
              className={`nav-button ${
                location.pathname ===
                  "/dashboard/discussion-room/notifications" &&
                "nav-button-active"
              }`}
            >
              <FactCheckOutlinedIcon fontSize="small" />
              <span>Posts</span>
            </button>
          </Link> */}
          <button
            type="button"
            className="btn create-post mt-5"
            onClick={() => setShowModal(true)}
          >
            Create Post
          </button>
        </nav>
      </div>

      {/* Scrollable Column */}
      <div className="scrollable-column">{children}</div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        communityId={id}
      />
    </div>
  );
};

export default Layout;
