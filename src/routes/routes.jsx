import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingTracker from "../components/Common/Loading";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "../components/404/NotFound";

const Login = lazy(() => import("../views"));
const Overview = lazy(() => import("../views/dashboard"));
const Students = lazy(() => import("../views/dashboard/students"));
const AddStudent = lazy(() => import("../views/dashboard/students/add"));
const TopStudents = lazy(() => import("../views/dashboard/top-students"));
const Exams = lazy(() => import("../views/dashboard/exams"));
const CreateExam = lazy(() => import("../views/dashboard/exams/create"));
const ViewExam = lazy(() => import("../views/dashboard/exams/view"));
const Subscriptions = lazy(() => import("../views/dashboard/subscriptions"));
const PurchaseCode = lazy(() => import("../views/dashboard/purchase-code"));
const Settings = lazy(() => import("../views/dashboard/settings"));
const DiscussionRoom = lazy(() => import("../views/dashboard/discussionRoom"));
const CreatePost = lazy(
  () => import("../views/dashboard/discussionRoom/createPost"),
);
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
          path="/dashboard/top-students"
          element={
            <ProtectedRoute>
              <TopStudents />
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
          path="/dashboard/students/add"
          element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/exams/create"
          element={
            <ProtectedRoute>
              <CreateExam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/exams/:examId"
          element={
            <ProtectedRoute>
              <ViewExam />
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
          path="/dashboard/discussion-room/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
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
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
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
