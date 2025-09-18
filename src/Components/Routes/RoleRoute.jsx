import { Navigate } from "react-router";
import useAuthContext from "../../Hooks/useAuthContext";


const RoleRoute = ({ children, allowedRoles }) => {
  const { user, authLoading } = useAuthContext();

  if (authLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
};

export default RoleRoute;
