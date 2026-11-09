import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Réservé aux utilisateurs connectés ; `role` restreint en plus l'accès à un rôle précis.
const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/notfound" replace />;
  return children;
};

export default ProtectedRoute;
