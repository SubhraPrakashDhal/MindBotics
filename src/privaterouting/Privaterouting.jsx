import { Navigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";

const PrivateRouting = ({ children }) => {
  const { loggedin, loading } = useAuth();

  // Show loading spinner while validating token
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!loggedin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRouting;
