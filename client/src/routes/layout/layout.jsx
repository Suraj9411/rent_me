import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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