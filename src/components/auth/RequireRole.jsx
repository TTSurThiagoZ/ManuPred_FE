import { Navigate } from "react-router-dom";
import { getStoredRole, ROLES } from "../../utils/roles";

export default function RequireRole({ allowed, children }) {
  const role = getStoredRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to={ROLES[role]?.homePath ?? "/"} replace />;
  }

  return children;
}