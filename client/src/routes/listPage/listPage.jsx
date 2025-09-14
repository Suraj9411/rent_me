import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useNavigate, Link } from "react-router-dom";
import { Suspense, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../hooks/use-toast";

function ListPage() {
  const data = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [savingStates, setSavingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState([]);

  // Load saved properties from the posts data and handle pagination
  useEffect(() => {
    if (data.postResponse) {
      data.postResponse.then((response) => {
        if (response.data) {
          const savedIds = new Set();
          response.data.forEach(post => {
            if (post.isSaved) {
              savedIds.add(post.id);
            }
          });
          setSavedProperties(savedIds);
          
          // Set up pagination
          const postsPerPage = 6; // 2 columns on mobile, 3 on desktop
          const startIndex = (currentPage - 1) * postsPerPage;
          const endIndex = startIndex + postsPerPage;
          setDisplayedPosts(response.data.slice(startIndex, endIndex));
        }
      }).catch(error => {
        console.error("Error loading posts:", error);
      });
    }
  }, [data.postResponse, currentPage]);

  const handleViewDetails = (propertyId) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to view property details.",
        variant: "warning",
      });
      navigate('/login');
      return;
    }
    
    // Navigate to property details page
    navigate(`/${propertyId}`);
  };

  const handleSaveProperty = async (propertyId) => {
    if (!currentUser) {
      // User not logged in, redirect to login page
      navigate('/login');
      return;
    }
    
    // Set saving state for this property
    setSavingStates(prev => ({ ...prev, [propertyId]: true }));
    
    try {
      const response = await apiRequest.post('/users/save', {
        postId: propertyId
      });
      
      // Toggle saved state
      setSavedProperties(prev => {
        const newSet = new Set(prev);
        if (newSet.has(propertyId)) {
          newSet.delete(propertyId);
        } else {
          newSet.add(propertyId);
        }
        return newSet;
      });
      
      // Show success toast
      const isCurrentlySaved = savedProperties.has(propertyId);
      if (isCurrentlySaved) {
        toast({
          title: "Property Removed",
          description: "Property has been removed from your saved list.",
          variant: "default",
        });
      } else {
        toast({
          title: "Property Saved",
          description: "Property has been added to your saved list.",
          variant: "success",
        });
      }
      
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear saving state
      setSavingStates(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const isPropertySaved = (propertyId) => {
    return savedProperties.has(propertyId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (data.postResponse) {
      data.postResponse.then((response) => {
        const totalPosts = response.data.length;
        const postsPerPage = 6;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 md:py-16">
      <div className="w-11/12 max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
        {/* Left Section - Filters and Listings */}
        <div className="space-y-6 pb-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/30">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Find Your Property
            </h2>
            <Filter />
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-5 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Available Properties
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 pr-0 lg:pr-4">
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) =>
                    displayedPosts.length > 0 ? (
                      displayedPosts.map((post) => (
                        <div key={post.id} className="group bg-white/95 backdrop-blur-xl rounded-xl overflow-hidden transition-all duration-300 border border-white/30 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:border-blue-500">
                            <img 
                              src={post.images && post.images.length > 0 ? post.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'} 
                              alt={post.title} 
                              className="w-full h-28 sm:h-32 md:h-40 object-cover transition-all duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                              }}
                            />
                            <div className="p-2.5 sm:p-3.5 md:p-4">
                              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
                                {post.title}
                              </h4>
                              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 flex items-center gap-1">
                                <span className="text-blue-500 text-xs sm:text-sm">📍</span>
                                <span className="truncate">{post.address}, {post.city}</span>
                              </div>
                              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-500 mb-2 sm:mb-3">
                                ₹{post.price}
                              </div>
                              <div className="flex justify-between py-1.5 sm:py-2.5 border-t border-b border-gray-100 mb-2.5 sm:mb-3.5">
                                <div className="text-center flex-1">
                                  <span className="block text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">{post.bedroom}</span>
                                  <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Bed</span>
                                </div>
                                <div className="text-center flex-1">
                                  <span className="block text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">{post.bathroom}</span>
                                  <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Bath</span>
                                </div>
                                <div className="text-center flex-1">
                                  <span className="block text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">{post.type}</span>
                                  <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Type</span>
                                </div>
                              </div>
                              <div className="flex gap-1.5 sm:gap-2.5">
                                <button 
                                  onClick={() => handleViewDetails(post.id)}
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-300 text-center shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35"
                                >
                                  Details
                                </button>
                                <button 
                                  className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-300 text-center ${
                                    !currentUser 
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-blue-500 font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30' 
                                      : isPropertySaved(post.id)
                                        ? 'bg-blue-500 text-white border-2 border-blue-500 font-bold hover:bg-red-500 hover:border-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30'
                                        : 'bg-white/90 text-gray-900 border-2 border-gray-100 hover:bg-white hover:border-blue-500 hover:text-blue-500'
                                  } ${savingStates[post.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  onClick={() => handleSaveProperty(post.id)}
                                  disabled={savingStates[post.id]}
                                >
                                  {savingStates[post.id] ? 'Saving...' : 
                                   !currentUser ? 'Login' : 
                                   isPropertySaved(post.id) ? 'Saved' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-16 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/30">
                        <div className="text-5xl text-gray-400 mb-4 opacity-60">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          No Properties Found
                        </h3>
                        <p className="text-gray-600 text-base mb-5 max-w-md mx-auto leading-relaxed">
                          Try adjusting your search criteria or check back later for new listings.
                        </p>
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35">
                          Reset Filters
                        </button>
                      </div>
                    )
                  }
                </Await>
              </Suspense>
            </div>
            
            {/* Pagination */}
            <Suspense fallback={<div className="flex justify-center items-center gap-2 mt-6">
              <div className="px-4 py-2 border-2 border-gray-100 bg-white/90 text-gray-900 rounded-md font-semibold min-w-10 text-center backdrop-blur-sm">
                Loading...
              </div>
            </div>}>
              <Await
                resolve={data.postResponse}
                errorElement={<div className="flex justify-center items-center gap-2 mt-6">
                  <div className="px-4 py-2 border-2 border-gray-100 bg-white/90 text-gray-900 rounded-md font-semibold min-w-10 text-center backdrop-blur-sm">
                    Error
                  </div>
                </div>}
              >
                {(postResponse) => {
                  const totalPosts = postResponse.data.length;
                  const postsPerPage = 6;
                  const totalPages = Math.ceil(totalPosts / postsPerPage);
                  
                  // Only show pagination if there are multiple pages
                  if (totalPages <= 1) {
                    return null;
                  }
                  
                  return (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      {/* Show current page twice as "1 1" format */}
                      <button 
                        className="px-4 py-2 border-2 border-gray-100 bg-white/90 text-gray-900 rounded-md cursor-pointer transition-all duration-300 font-semibold min-w-10 text-center backdrop-blur-sm hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:-translate-y-0.5"
                        onClick={() => handlePageChange(currentPage)}
                      >
                        {currentPage}
                      </button>
                      <button 
                        className="px-4 py-2 border-2 border-gray-100 bg-white/90 text-gray-900 rounded-md cursor-pointer transition-all duration-300 font-semibold min-w-10 text-center backdrop-blur-sm hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:-translate-y-0.5"
                        onClick={() => handlePageChange(currentPage)}
                      >
                        {currentPage}
                      </button>
                      {currentPage < totalPages && (
                        <button 
                          className="px-4 py-2 border-2 border-gray-100 bg-white/90 text-gray-900 rounded-md cursor-pointer transition-all duration-300 font-semibold min-w-10 text-center backdrop-blur-sm hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:-translate-y-0.5"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>

        {/* Right Section - Map */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/30">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Property Map
            </h3>
            <div className="w-full h-96 md:h-80 lg:h-96 rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
              <Suspense fallback={<p>Loading map...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading map!</p>}
                >
                  {(postResponse) => <Map items={postResponse.data} />}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListPage;