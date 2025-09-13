import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      updateUser(res.data)

      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex min-h-96">
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-6 items-center justify-center relative overflow-hidden min-h-96">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10 text-white w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-3xl font-black mb-3 text-white drop-shadow-lg">
                RentEase
              </h1>
              <p className="text-lg md:text-base text-white/90 leading-relaxed">
                Your Perfect Rental Journey Starts Here
              </p>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Find Your Dream Home</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Browse thousands of verified properties</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Secure & Trusted</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Your data is protected with industry standards</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Direct Communication</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Connect directly with property owners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 lg:p-5 flex items-center justify-center min-h-96 w-full">
          <div className="w-full max-w-sm">
            {/* Mobile Header - Only visible on mobile */}
            <div className="text-center mb-6 md:hidden">
              <h1 className="text-2xl font-black mb-2 text-gray-900">
                RentEase
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your Perfect Rental Journey Starts Here
              </p>
            </div>
            
            {/* Desktop Header - Only visible on desktop */}
            <div className="text-center mb-5 hidden md:block">
              <h2 className="text-3xl md:text-2xl font-extrabold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm md:text-xs text-gray-600 leading-relaxed">
                Sign in to continue your rental journey
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block font-semibold text-gray-900 mb-1 text-sm">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  required
                  minLength={3}
                  maxLength={20}
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base bg-white text-gray-900 transition-all duration-300 box-border focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-0.5 placeholder:text-gray-400"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block font-semibold text-gray-900 mb-1 text-sm">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base bg-white text-gray-900 transition-all duration-300 box-border focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-0.5 placeholder:text-gray-400"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-3 text-sm text-center">
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none px-5 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 shadow-lg hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account? <Link to="/register" className="text-blue-600 no-underline font-semibold transition-colors duration-300 hover:text-blue-800 hover:underline">Sign Up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
