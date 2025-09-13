import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    propertyType: "",
    bedrooms: "",
    priceRange: "",
    location: ""
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search query
    const searchParams = new URLSearchParams();
    if (searchForm.propertyType) searchParams.append("type", searchForm.propertyType);
    if (searchForm.bedrooms) searchParams.append("bedrooms", searchForm.bedrooms);
    if (searchForm.priceRange) searchParams.append("price", searchForm.priceRange);
    if (searchForm.location) searchParams.append("location", searchForm.location);
    
    // Navigate to list page with search parameters
    const searchQuery = searchParams.toString();
    navigate(`/list?${searchQuery}`);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      // User is logged in, go to list page
      navigate("/list");
    } else {
      // User is not logged in, go to register page
      navigate("/register");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center py-8 md:py-16 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Floating Elements - Hidden on mobile for better performance */}
        <div className="hidden md:block absolute top-1/5 right-1/10 w-24 h-24 bg-white/10 rounded-full animate-bounce-slow"></div>
        <div className="hidden md:block absolute bottom-1/5 left-1/10 w-20 h-20 bg-white/8 rounded-full animate-bounce-slow" style={{animationDelay: '2s'}}></div>

        <div className="container mx-auto px-4 md:px-5 relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          <div className="flex-1 text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4 md:mb-6 text-white drop-shadow-lg tracking-tight animate-fade-in">
              Find Your Perfect Rental Home
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow-md mb-6 md:mb-8 leading-relaxed animate-fade-in px-2 sm:px-0" style={{animationDelay: '0.2s'}}>
              Discover thousands of properties in your area. From cozy apartments to spacious houses, we have the perfect place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link 
                to="/list" 
                className="group relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:scale-105 hover:shadow-xl text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                Browse Properties
              </Link>
              <button 
                onClick={handleGetStarted}
                className="group relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-full text-white bg-white/20 border-2 border-white/30 backdrop-blur-md transition-all duration-300 overflow-hidden hover:bg-white/30 hover:border-white/50 hover:-translate-y-1 hover:shadow-xl text-center cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                List Your Property
              </button>
            </div>
          </div>
          
          <div className="flex-1 animate-fade-in w-full lg:w-auto" style={{animationDelay: '0.6s'}}>
            <form 
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 w-full max-w-md mx-auto lg:max-w-none lg:mx-0"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Find Your Perfect Property
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-900 text-sm">Property Type</label>
                  <select 
                    name="propertyType"
                    value={searchForm.propertyType}
                    onChange={handleSearchChange}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 appearance-none"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-900 text-sm">Bedrooms</label>
                  <select 
                    name="bedrooms"
                    value={searchForm.bedrooms}
                    onChange={handleSearchChange}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 appearance-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-900 text-sm">Price Range</label>
                  <select 
                    name="priceRange"
                    value={searchForm.priceRange}
                    onChange={handleSearchChange}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 appearance-none"
                  >
                    <option value="">Any Price</option>
                    <option value="0-1000">$0 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="3000+">$3,000+</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-900 text-sm">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    placeholder="Enter city or neighborhood"
                    value={searchForm.location}
                    onChange={handleSearchChange}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Search Properties
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white relative">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose RentEase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We make finding and renting properties simple, secure, and enjoyable for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Selection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Browse through thousands of verified properties in your preferred location and budget.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data and transactions are protected with industry-leading security measures.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Communication</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect directly with property owners and agents through our built-in messaging system.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access our platform from anywhere with our responsive mobile-optimized design.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Listings</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All properties are verified and reviewed to ensure quality and accuracy.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <svg className="w-12 h-12 text-blue-500 mb-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Easy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Find your perfect home in minutes with our advanced search and filtering options.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h20v-20c11.046 0 20-8.954 20-20H20z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 relative z-10">
              Ready to Find Your Dream Home?
            </h3>
            <p className="text-xl text-white mb-8 relative z-10 max-w-2xl mx-auto">
              Join thousands of satisfied users who have found their perfect rental property through RentEase.
            </p>
            <button 
              onClick={handleGetStarted} 
              className="relative z-10 bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 backdrop-blur-md hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {currentUser ? "Browse Properties" : "Get Started Today"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <span className="block text-4xl md:text-5xl font-black text-gray-900 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                1000+
              </span>
              <span className="text-lg text-gray-600 font-semibold uppercase tracking-wider">
                Properties Listed
              </span>
            </div>
            
            <div className="group text-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <span className="block text-4xl md:text-5xl font-black text-gray-900 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                500+
              </span>
              <span className="text-lg text-gray-600 font-semibold uppercase tracking-wider">
                Happy Tenants
              </span>
            </div>
            
            <div className="group text-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <span className="block text-4xl md:text-5xl font-black text-gray-900 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                200+
              </span>
              <span className="text-lg text-gray-600 font-semibold uppercase tracking-wider">
                Property Owners
              </span>
            </div>
            
            <div className="group text-center bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <span className="block text-4xl md:text-5xl font-black text-gray-900 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent">
                24/7
              </span>
              <span className="text-lg text-gray-600 font-semibold uppercase tracking-wider">
                Customer Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;


