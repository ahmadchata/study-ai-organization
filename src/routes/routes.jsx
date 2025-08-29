import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingTracker from "../components/Common/Loading";
import ProtectedRoute from "./protectedRoutes";

const Login = lazy(() => import("../views"));
const Overview = lazy(() => import("../views/dashboard"));
const Students = lazy(() => import("../views/dashboard/students"));

const AllRoutes = () => {
  return (
    <Suspense fallback={<LoadingTracker />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
