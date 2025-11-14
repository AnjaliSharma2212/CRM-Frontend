// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
export default function ProtectedRoute({children, roles}) {
  const token = localStorage.getItem("token");
  if(!token) return <Navigate to="/login" />;
  try {
    const { role } = jwtDecode(token);
    if(roles && !roles.includes(role)) return <Navigate to="/unauthorized" />;
    return children;
  } catch { return <Navigate to="/login" /> }
}
