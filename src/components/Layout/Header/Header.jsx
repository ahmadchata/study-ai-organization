import "./Header.css";
import { useState, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Sidebar from "../SideBar/Sidebar";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const sideBarRef = useRef(null);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  <header
    className="border-bottom bg-dark m-0 p-0 sticky-top d-flex align-items-end"
    style={{ minHeight: "65px" }}
  >
    <div className="container position-relative">
      <div className="d-flex">
        <div className={`d-none d-lg-flex align-items-center`}>
          <img
            src="/assets/logo.svg"
            width={186}
            height={32}
            alt="Study AI logo"
            className="img-fluid"
          />
        </div>
        <div className="d-flex justify-content-between w-100">
          <div className="ms-0 ms-lg-5 header-tabs">
            <Link
              className={`text-decoration-none h-100 ${
                location.pathname === "/dashboard"
                  ? "header-active"
                  : "grey-text"
              }`}
              to={"/dashboard"}
              style={{
                padding: "0.7rem 1rem",
              }}
            >
              <span className="">Home</span>
            </Link>
            {location.pathname === "/dashboard/profile" ? (
              <Link
                className={`text-decoration-none ${
                  location.pathname === "/dashboard/profile"
                    ? "header-active"
                    : "grey-text"
                }`}
                to={"/dashboard/profile"}
                style={{
                  padding: "0.7rem 1rem",
                }}
              >
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                className={`text-decoration-none ${
                  location.pathname.includes("/dashboard/learning")
                    ? "header-active"
                    : "grey-text"
                }`}
                to={"/dashboard/learning"}
                style={{
                  padding: "0.7rem 1rem",
                }}
              >
                <span>Learning</span>
              </Link>
            )}
          </div>
          <div className="d-flex align-items-center mb-lg-0">
            <button className="btn" onClick={toggleSidebar}>
              <PersonIcon />
            </button>
          </div>
        </div>
      </div>
      <CSSTransition
        in={sidebar}
        timeout={300}
        classNames="sidebar"
        nodeRef={sideBarRef}
        unmountOnExit
      >
        <Sidebar ref={sideBarRef} onClose={toggleSidebar} />
      </CSSTransition>
    </div>
  </header>;
};
export default Header;
