import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { SocketContext } from "../../context/SocketContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { currentUser, updateUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (currentUser) {
      // Add a small delay to ensure authentication is fully established
      const timer = setTimeout(() => {
        console.log("Navbar: Fetching notifications for user:", currentUser.id);
        fetch().catch(err => {
          console.log("Failed to fetch notifications:", err);
        });
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, fetch]);

  // Listen for real-time notification updates
  useEffect(() => {
    if (socket && typeof socket.on === 'function' && currentUser) {
      const handleNewMessage = (data) => {
        console.log("Navbar: New message received, refreshing notifications");
        setTimeout(() => {
          fetch().catch(err => console.log("Failed to refresh navbar notifications:", err));
        }, 500);
      };

      socket.on("getMessage", handleNewMessage);

      return () => {
        if (socket && typeof socket.off === 'function') {
          socket.off("getMessage", handleNewMessage);
        }
      };
    }
  }, [socket, currentUser, fetch]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      // First, emit logout event to socket if connected
      if (socket && typeof socket.emit === 'function') {
        socket.emit('logout');
      }

      // Make logout request to backend
      const res = await fetch("http://localhost:8800/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        // Clear user from context
        updateUser(null);
        
        // Close mobile menu if open
        setMobileMenuOpen(false);
        
        // Clear any stored user data
        localStorage.removeItem('user');
        
        // Redirect to home page
        window.location.href = '/';
      } else {
        console.log("Logout failed:", res.status, res.statusText);
        // Even if backend logout fails, clear local user data
        updateUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } catch (err) {
      console.log("Logout error:", err);
      // Even if there's an error, clear local user data
      updateUser(null);
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg ${
      scrolled 
        ? 'bg-white/98 backdrop-blur-xl shadow-xl' 
        : 'bg-white/95 backdrop-blur-lg'
    }`}>
      {/* Gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-600 opacity-60"></div>
      
      <div className="container mx-auto px-5 flex items-center justify-between h-16 md:h-[70px]">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex items-center gap-3 text-gray-900 font-bold text-xl md:text-2xl transition-all duration-300 hover:scale-105">
            <img 
              src="/logo.png" 
              alt="Rent Me" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
            />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Rent Me
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-5">
            <Link 
              to="/" 
              className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/') 
                  ? 'text-blue-500 bg-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-blue-500 hover:-translate-y-0.5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/list" 
              className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/list') 
                  ? 'text-blue-500 bg-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-blue-500 hover:-translate-y-0.5'
              }`}
            >
              Properties
            </Link>
            <Link 
              to="/about" 
              className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-blue-500 bg-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-blue-500 hover:-translate-y-0.5'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/contact') 
                  ? 'text-blue-500 bg-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-blue-500 hover:-translate-y-0.5'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/agents" 
              className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/agents') 
                  ? 'text-blue-500 bg-white shadow-md' 
                  : 'text-gray-600 hover:text-white hover:bg-blue-500 hover:-translate-y-0.5'
              }`}
            >
              Agents
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 md:gap-4">
              <Link 
                to="/profile" 
                className="relative bg-white/80 border border-gray-200 rounded-full w-10 h-10 md:w-11 md:h-11 flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-600 hover:bg-white hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-md backdrop-blur-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {number > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-semibold border-2 border-white animate-pulse">
                    {number}
                  </span>
                )}
              </Link>

              <Link 
                to="/profile" 
                className="hidden md:flex items-center gap-3 text-gray-900 px-4 py-2 rounded-full bg-white/80 border border-gray-100 transition-all duration-300 hover:bg-white hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-md backdrop-blur-sm"
              >
                <img 
                  src={currentUser.avatar || "/noavatar.jpg"} 
                  alt={currentUser.username}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-blue-500 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                />
                <span className="font-semibold text-sm tracking-tight">
                  {currentUser.username}
                </span>
              </Link>

              <button 
                onClick={handleLogout} 
                className="hidden md:block bg-red-500 text-white border-0 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-md hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-white/80 border border-gray-200 transition-all duration-300 hover:text-gray-900 hover:bg-white hover:border-blue-500 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button 
            className={`md:hidden bg-white/80 border border-gray-200 rounded-lg w-10 h-10 md:w-11 md:h-11 flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-900 hover:bg-white hover:border-blue-500 hover:text-blue-500 backdrop-blur-sm`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`w-5 h-0.5 bg-current relative transition-all duration-300 ${
              mobileMenuOpen ? 'bg-transparent' : ''
            }`}>
              <span className={`absolute top-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'top-0 rotate-45' : '-top-1.5'
              }`}></span>
              <span className={`absolute top-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'top-0 -rotate-45' : 'top-1.5'
              }`}></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-16 md:top-[70px] left-0 right-0 bg-white backdrop-blur-xl border-b border-gray-100 px-4 py-6 transform transition-all duration-300 shadow-xl z-40 ${
        mobileMenuOpen 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-full opacity-0 invisible'
      }`}>
        <div className="flex flex-col gap-2.5 mb-4">
          <Link 
            to="/" 
            className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
              isActive('/') 
                ? 'text-blue-500 bg-gray-50 border-blue-500' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link 
            to="/list" 
            className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
              isActive('/list') 
                ? 'text-blue-500 bg-gray-50 border-blue-500' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Properties
          </Link>
          <Link 
            to="/about" 
            className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
              isActive('/about') 
                ? 'text-blue-500 bg-gray-50 border-blue-500' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          <Link 
            to="/contact" 
            className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
              isActive('/contact') 
                ? 'text-blue-500 bg-gray-50 border-blue-500' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:border-blue-500 hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </Link>
          <Link 
            to="/agents" 
            className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
              isActive('/agents') 
                ? 'text-blue-500 bg-gray-50 border-blue-500' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agents
          </Link>
          {currentUser && (
            <Link 
              to="/profile" 
              className={`px-3.5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 text-center bg-white/80 border border-gray-100 flex items-center justify-center gap-2 ${
                isActive('/profile') 
                  ? 'text-blue-500 bg-gray-50 border-blue-500' 
                  : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:border-blue-500 hover:-translate-y-0.5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile {number > 0 && `(${number})`}
            </Link>
          )}
        </div>

        {!currentUser && (
          <div className="flex flex-col gap-2.5">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-white/80 border border-gray-200 transition-all duration-300 text-center hover:text-gray-900 hover:bg-gray-50 hover:border-blue-500"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md transition-all duration-300 text-center hover:-translate-y-0.5 hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        )}

        {currentUser && (
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 rounded-lg font-semibold text-sm text-gray-600 bg-white/80 border border-gray-200 transition-all duration-300 text-center hover:text-gray-900 hover:bg-gray-50 hover:border-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;