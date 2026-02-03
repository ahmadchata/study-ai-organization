import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "./ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="error-page-container">
      <div className="error-content">
        <ErrorOutlineIcon className="error-icon" />

        <h1 className="error-title">Oops! Something went wrong</h1>

        <p className="error-message">
          We encountered an unexpected error. Please try refreshing the page or
          go back to home.
        </p>

        <div className="error-actions">
          <button className="btn default-btn" onClick={handleRefresh}>
            Refresh Page
          </button>

          <button className="btn secondary-btn" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
