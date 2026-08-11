import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";

export default function ProtectedRoute() {
  const authenticated = isAuthenticated();

  console.log("ProtectedRoute");
  console.log("Authenticated:", authenticated);
  console.log("Token:", localStorage.getItem("auth_token"));

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}