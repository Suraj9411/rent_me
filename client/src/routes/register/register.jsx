import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
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
                Join Thousands of Happy Renters
              </p>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Verified Properties</h3>
                  <p className="text-sm text-white/80 leading-relaxed">All listings are verified for quality and accuracy</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Fast & Easy</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Find your perfect home in minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Premium Experience</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Enjoy a seamless rental platform</p>
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
                Join Thousands of Happy Renters
              </p>
            </div>
            
            {/* Desktop Header - Only visible on desktop */}
            <div className="text-center mb-5 hidden md:block">
              <h2 className="text-3xl md:text-2xl font-extrabold text-gray-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-sm md:text-xs text-gray-600 leading-relaxed">
                Join RentEase and start your rental journey today
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
                  type="text"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base bg-white text-gray-900 transition-all duration-300 box-border focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 focus:-translate-y-0.5 placeholder:text-gray-400"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold text-gray-900 mb-1 text-sm">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
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
                  placeholder="Create a strong password"
                  required
                  minLength={6}
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account? <Link to="/login" className="text-blue-600 no-underline font-semibold transition-colors duration-300 hover:text-blue-800 hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
