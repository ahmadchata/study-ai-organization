import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingTracker from "../components/Common/Loading";
import ProtectedRoute from "./protectedRoutes";

const Login = lazy(() => import("../views"));
const Dashboard = lazy(() => import("../views/dashboard"));

const AllRoutes = () => {
  return (
    <Suspense fallback={<LoadingTracker />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
