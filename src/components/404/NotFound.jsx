import { useNavigate } from "react-router-dom";
import NotFoundOutlinedIcon from "@mui/icons-material/NotListedLocationOutlined";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <h1 className="not-found-code">404</h1>
          <NotFoundOutlinedIcon className="not-found-icon" />
        </div>

        <h2 className="not-found-title">Page Not Found</h2>

        <p className="not-found-message">
          Sorry, the page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className="not-found-actions">
          <button className="btn default-btn" onClick={handleGoHome}>
            Go to Home
          </button>

          <button className="btn secondary-btn" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
