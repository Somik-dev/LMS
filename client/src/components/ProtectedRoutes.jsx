import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ------------------------
// Protected Route
// ------------------------
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // While checking user status
  if (loading) return <div>Loading...</div>;

  // If user is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ------------------------
// Redirect authenticated user away from Login/Register
// ------------------------
export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ------------------------
// Admin Route (Instructor Only)
// ------------------------
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not instructor
  if (!user || user.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return children;
};
