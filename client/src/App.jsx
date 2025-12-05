import { ThemeProvider } from "@/components/theme-provider";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "./layouts/MainLayouts";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetails from "./pages/student/CourseDetails";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";

import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";

import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { useLoadUserQuery } from "@/features/api/authApi";


// ⭐ Load user BEFORE routing (VERY IMPORTANT)
function App() {
  const { isLoading } = useLoadUserQuery(null, {
    refetchOnMountOrArgChange: false,
  });

  // Show a loader until user is retrieved
  if (isLoading) return <div>Loading...</div>;

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayouts />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: (
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          ),
        },
        {
          path: "My-Learning",
          element: (
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          ),
        },
        {
          path: "Profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "course/search",
          element: (
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "course-details/:courseId",
          element: (
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "course-progress/:courseId",
          element: (
            <ProtectedRoute>
              <PurchaseCourseProtectedRoute>
                <CourseProgress />
              </PurchaseCourseProtectedRoute>
            </ProtectedRoute>
          ),
        },

        // ADMIN
        {
          path: "admin",
          element: (
            <AdminRoute>
              <Sidebar />
            </AdminRoute>
          ),
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "course", element: <CourseTable /> },
            { path: "course/create", element: <AddCourse /> },
            { path: "course/:courseId", element: <EditCourse /> },
            { path: "course/:courseId/lecture", element: <CreateLecture /> },
            { path: "course/:courseId/lecture/:lectureId", element: <EditLecture /> },
          ],
        },

        { path: "*", element: <div>404 - Page Not Found</div> },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <RouterProvider router={appRouter} />
      </main>
    </ThemeProvider>
  );
}

export default App;
