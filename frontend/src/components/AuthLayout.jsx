import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Navbar from "./Navbar";

export default function AuthLayout() {
  const { token } = useAuthContext();

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
