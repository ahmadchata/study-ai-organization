import "./styles.css";
import { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";
import SearchIcon from "@mui/icons-material/Search";

const Layout = ({ id, title, showNavDiv, children }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      <div className="scrollable-column">
        <div>
          {showNavDiv && (
            <div className="nav-div d-flex align-items-center position-sticky top-0 p-2 justify-content-between">
              {!showMobileSearch && <h5 className="m-0">{title}</h5>}
              <div
                className={`search-container ${
                  showMobileSearch ? "search-active" : ""
                }`}
              >
                <SearchIcon
                  className="search-icon"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search room"
                  value={searchQuery}
                  onBlur={() => setShowMobileSearch(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        {children}
      </div>

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
