import ProtectedRoute from "./ProtectedRoute";

const AdminRoute = ({ children }) => <ProtectedRoute role="admin">{children}</ProtectedRoute>;

export default AdminRoute;
