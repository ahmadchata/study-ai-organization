import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import LoadingTracker from "../components/Common/Loading";
import Header from "../components/Layout/Header/Header";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  if (loading) {
    return <LoadingTracker />;
  }

  return authenticated ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
