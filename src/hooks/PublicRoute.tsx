import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";

export default function PublicRoute() {
  return !isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/projects" replace />
  );
}