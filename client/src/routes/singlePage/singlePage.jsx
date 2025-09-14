import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../hooks/use-toast";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authentication check - redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to view property details.",
        variant: "warning",
      });
      navigate("/login");
    }
  }, [currentUser, navigate, toast]);

  // Don't render the component if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to send messages.",
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    // Check if user data is available
    if (!post.user || !post.user.id) {
      toast({
        title: "User Data Missing",
        description: "Property owner information is not available.",
        variant: "destructive",
      });
      return;
    }

    // Check if trying to message yourself
    if (post.user.id === currentUser.id) {
      toast({
        title: "Cannot Message Yourself",
        description: "You cannot send a message to yourself.",
        variant: "warning",
      });
      return;
    }

    try {
      // Create or get existing chat with property owner
      const chatResponse = await apiRequest.post("/chats", { 
        receiverId: post.user.id 
      });
      
      // Navigate to the chat page
      navigate(`/chats/${chatResponse.data.id}`);
      
      toast({
        title: "Chat Opened",
        description: `Starting conversation with ${post.user.username}`,
        variant: "success",
      });
    } catch (err) {
      console.error("Error creating chat:", err);
      toast({
        title: "Failed to Start Chat",
        description: "Unable to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSmartDirections = async () => {
    if (!post || !post.latitude || !post.longitude) {
      toast({
        title: "Location Unavailable",
        description: "Property location not available for directions.",
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        // If geolocation not supported, open Google Maps without user location
        const dest = `${post.latitude},${post.longitude}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${dest}`;
        window.open(url, '_blank');
        
        toast({
          title: "Directions Opened",
          description: "Google Maps opened with property location.",
          variant: "success",
        });
        setIsLoading(false);
        return;
      }

      // Get user's current location automatically
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,        // Use GPS if available
          timeout: 10000,                  // Wait up to 10 seconds
          maximumAge: 300000               // Allow 5 minute old location
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Invalid coordinates received");
      }
      
      // Automatically open Google Maps with directions from user location to property
      const origin = `${latitude},${longitude}`;
      const dest = `${post.latitude},${post.longitude}`;
      const url = `https://www.google.com/maps/dir/${origin}/${dest}`;
      
      window.open(url, '_blank');
      
      toast({
        title: "Directions Opened",
        description: "Google Maps opened with directions from your location to the property.",
        variant: "success",
      });
      
      setIsLoading(false);
      
    } catch (error) {
      console.error("Location detection error:", error);
      
      // If location detection fails, still open Google Maps with property location
      const dest = `${post.latitude},${post.longitude}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${dest}`;
      window.open(url, '_blank');
      
      let errorMessage = "Could not detect your location, but opened Google Maps with property location.";
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = "Location permission denied. Please allow location access and try again. Opened Google Maps with property location.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Location unavailable. Opened Google Maps with property location.";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "Location request timed out. Opened Google Maps with property location.";
      }
      
      toast({
        title: "Directions Opened",
        description: errorMessage,
        variant: "success",
      });
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
          <div className="flex-1 lg:flex-1">
            <div className="w-full">
              <Slider images={post.images} />
              <div className="mt-8">
                <div className="flex justify-between flex-col sm:flex-row gap-5 mb-8">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {post.title}
                    </h1>
                    <div className="flex gap-2 items-center text-gray-500 text-sm">
                      <img src="/pin.png" alt="" className="w-4 h-4" />
                      <span>{post.address}</span>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg w-fit text-2xl font-bold text-blue-600">
                      ₹ {post.price}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <img 
                      src={post.user?.avatar || "/noavatar.jpg"} 
                      alt="" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      onError={(e) => {
                        e.target.src = "/noavatar.jpg";
                      }}
                    />
                    <span className="font-semibold text-gray-900">{post.user.username}</span>
                  </div>
                </div>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.postDetail.desc),
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 lg:flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/utility.png" alt="" className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">General</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <img src="/utility.png" alt="" className="w-6 h-6 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Utilities</span>
                        <p className="text-sm text-gray-600">
                          {post.postDetail.utilities === "owner" ? (
                            "Owner is responsible"
                          ) : (
                            "Tenant is responsible"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/pet.png" alt="" className="w-6 h-6 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Pet Policy</span>
                        <p className="text-sm text-gray-600">
                          {post.postDetail.pet === "allowed" ? (
                            "Pets Allowed"
                          ) : (
                            "Pets not Allowed"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/utility.png" alt="" className="w-6 h-6 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">RO/Geyser</span>
                        <p className="text-sm text-gray-600">{post.postDetail.roGeyser || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/utility.png" alt="" className="w-6 h-6 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Parking</span>
                        <p className="text-sm text-gray-600">{post.postDetail.parking || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Property Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                      <img src="/bed.png" alt="" className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.bedroom} beds</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                      <img src="/bath.png" alt="" className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.bathroom} bathroom</span>
                    </div>
                  </div>
                </div>
          
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Nearby Places</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <img src="/school.png" alt="" className="w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">School</span>
                          <p className="text-sm text-gray-600">
                            {post.postDetail.school > 999
                              ? post.postDetail.school / 1000 + "km"
                              : post.postDetail.school + "m"}{" "}
                            away
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <img src="/pet.png" alt="" className="w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">Bus Stop</span>
                          <p className="text-sm text-gray-600">{post.postDetail.bus}m away</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <img src="/utility.png" alt="" className="w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">Restaurant</span>
                          <p className="text-sm text-gray-600">{post.postDetail.restaurant}m away</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Location</h3>
          
                  {/* Get Directions Button */}
                  <div className="mb-4">
                    <button 
                      onClick={handleSmartDirections}
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 py-3 px-6 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                        isLoading ? 'bg-blue-500 cursor-wait' : ''
                      }`}
                      title="Automatically detect your location and get directions to this property"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                        </svg>
                        <span className="font-bold text-sm sm:text-base">
                          {isLoading ? 'Detecting Location...' : 'Get Directions'}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Map items={[post]} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      onClick={handleSendMessage}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <img src="/chat.png" alt="" className="w-4 h-4" />
                      Send a Message
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        saved 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <img src="/save.png" alt="" className="w-4 h-4" />
                      {saved ? "Place Saved" : "Save the Place"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SinglePage;