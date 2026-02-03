import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingTracker from "../components/Common/Loading";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "../components/404/NotFound";

const Login = lazy(() => import("../views"));
const Overview = lazy(() => import("../views/dashboard"));
const Students = lazy(() => import("../views/dashboard/students"));
const Subscriptions = lazy(() => import("../views/dashboard/subscriptions"));
const PurchaseCode = lazy(() => import("../views/dashboard/purchase-code"));
const Account = lazy(() => import("../views/dashboard/account"));
const DiscussionRoom = lazy(() => import("../views/dashboard/discussionRoom"));
const ViewPost = lazy(
  () => import("../views/dashboard/discussionRoom/viewPost"),
);
const Notifications = lazy(
  () => import("../views/dashboard/discussionRoom/notifications"),
);

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
          path="/dashboard/discussion-room"
          element={
            <ProtectedRoute>
              <DiscussionRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/discussion-room/post/:id"
          element={
            <ProtectedRoute>
              <ViewPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/discussion-room/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
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

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
