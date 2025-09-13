import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="flex-1 min-h-0 w-full p-0 m-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="flex-1 min-h-0 w-full p-0 m-0 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };