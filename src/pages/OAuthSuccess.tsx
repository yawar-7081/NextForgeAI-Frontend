import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "@/lib/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setAuthToken(token);

    navigate("/projects", { replace: true });
  }, [navigate]);

  return null;
}