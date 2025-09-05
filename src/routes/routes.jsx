import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingTracker from "../components/Common/Loading";
import ProtectedRoute from "./protectedRoutes";

const Login = lazy(() => import("../views"));
const Overview = lazy(() => import("../views/dashboard"));
const Students = lazy(() => import("../views/dashboard/students"));
const Subscriptions = lazy(() => import("../views/dashboard/subscriptions"));
const PurchaseCode = lazy(() => import("../views/dashboard/purchase-code"));
const Account = lazy(() => import("../views/dashboard/account"));

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

        <Route
          path="/dashboard/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/subscriptions/purchase-code"
          element={
            <ProtectedRoute>
              <PurchaseCode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
