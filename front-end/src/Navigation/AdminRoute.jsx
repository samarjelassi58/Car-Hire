import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userA = useSelector((state) => state.auth.user);
 console.log("userA premiere:", userA)
  if (!userA || userA.role !== "admin") {
    console.log("userA deuxieme :", userA)
    return <Navigate to="/NotFound" />;
  }

  return children;
};

export default AdminRoute;
