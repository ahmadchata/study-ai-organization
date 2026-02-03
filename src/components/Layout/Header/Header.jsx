import "./Header.css";
import { useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Sidebar from "../SideBar/Sidebar";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroupOutlined";
import WorkspacesIcon from "@mui/icons-material/WorkspacesOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuLogo from "../../../assets/menu-white.svg";
import { useAuth } from "../../../Context/AuthContext";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CreatePostModal from "../../Dashboard/DiscussionRoom/CreatePostModal";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const sideBarRef = useRef(null);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const id = user?.organization_profile?.admin_communities[0]?.name;

  const currentPage = {
    "/dashboard": "Overview",
    "/dashboard/students": "Students",
    "/dashboard/subscriptions": "Subscriptions",
  };

  const goBack = () => {
    navigate("/dashboard/students");
  };

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  return (
    <header
      className="header-bg m-0 p-0 d-flex align-items-center px-lg-5 px-2 py-4"
      style={{ minHeight: "65px" }}
    >
      <div className="position-relative w-100">
        <div className="d-block d-lg-flex justify-content-between align-items-center">
          <div>
            <div className="w-100 d-flex justify-content-between align-items-center">
              <Link to={"/dashboard"}>
                <img
                  src="/assets/logo-white.svg"
                  alt="Study AI logo"
                  className="img-fluid"
                />
              </Link>
              <button className="btn d-lg-none" onClick={toggleSidebar}>
                <img src={MenuLogo} alt="Menu" className="img-fluid" />
              </button>
            </div>
          </div>
          <div className="d-none d-lg-flex justify-content-between align-items-center">
            <div className="header-tabs">
              <Link
                className={`text-decoration-none ${
                  location.pathname === "/dashboard"
                    ? "header-active"
                    : "header"
                }`}
                to={"/dashboard"}
              >
                <WorkspacesIcon style={{ marginRight: "10px" }} />
                Overview
              </Link>

              <Link
                className={`text-decoration-none mx-3 ${
                  location.pathname === "/dashboard/students"
                    ? "header-active"
                    : "header"
                }`}
                to={"/dashboard/students"}
              >
                <GroupIcon style={{ marginRight: "10px" }} />
                Students
              </Link>

              <Link
                className={`text-decoration-none me-3 ${
                  location.pathname.includes("/dashboard/subscriptions")
                    ? "header-active"
                    : "header"
                }`}
                to={"/dashboard/subscriptions"}
              >
                <SpeakerGroupIcon style={{ marginRight: "10px" }} />
                Subscriptions
              </Link>

              <div className="d-flex align-items-center mb-lg-0 border-start">
                <button className="btn header ms-3" onClick={toggleSidebar}>
                  <PersonIcon />
                  <KeyboardArrowDownIcon style={{ marginLeft: "10px" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {location.pathname.includes("/dashboard/discussion-room") ? (
          <div className="d-flex mt-4 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <button
                className="d-flex header-bk-btn align-items-center btn me-2"
                onClick={goBack}
              >
                <ArrowBackIosIcon style={{ fontSize: "14px" }} /> Back
              </button>
              <label className="text-white fs-5">Discussion room</label>
            </div>
            <button
              className="d-flex d-lg-none p-0 text-white align-items-center btn me-2"
              onClick={() => setShowModal(true)}
            >
              <AddCircleOutlinedIcon style={{ fontSize: "40px" }} />
            </button>
          </div>
        ) : (
          <div className="text-white mt-4">
            <label className="header-label">
              {user?.organization_profile?.organization_name}
            </label>
            <label className="ms-3 fw-regular">
              {currentPage[location.pathname] ?? ""}
            </label>
          </div>
        )}
        <CreatePostModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          communityId={id}
        />
        <CSSTransition
          in={sidebar}
          timeout={300}
          classNames="sidebar"
          nodeRef={sideBarRef}
          unmountOnExit
        >
          <Sidebar
            ref={sideBarRef}
            onClose={toggleSidebar}
            orgName={user?.organization_profile?.organization_name}
          />
        </CSSTransition>
      </div>
    </header>
  );
};
export default Header;
