import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../hooks/use-toast";
import ModernConfirmationDialog from "../../components/ui/modern-confirmation-dialog";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showAccuracyDialog, setShowAccuracyDialog] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast({
          title: "Geolocation Not Supported",
          description: "Geolocation is not supported by this browser.",
          variant: "warning",
        });
        setIsLoading(false);
        return;
      }

      // Get user's current location with high accuracy
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,        // Use GPS if available
          timeout: 30000,                  // Wait up to 30 seconds
          maximumAge: 0                    // Force fresh location
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Invalid coordinates received");
      }
      
      // Store location data for dialogs
      setLocationData({ latitude, longitude, accuracy });
      
      // Check location accuracy
      if (accuracy > 100) { // If accuracy is worse than 100 meters
        setShowAccuracyDialog(true);
        setIsLoading(false);
        return;
      }

      // Show location confirmation
      setShowLocationDialog(true);
      setIsLoading(false);
      
    } catch (error) {
      let errorMessage = "Failed to get your location.";
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 
          "📍 Location permission denied!\n\n" +
          "To fix this:\n" +
          "1. Click the lock/info icon in your browser address bar\n" +
          "2. Allow location access\n" +
          "3. Refresh the page and try again\n\n" +
          "Or try using a different browser.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 
          "📍 Location information unavailable!\n\n" +
          "Possible solutions:\n" +
          "1. Move to an area with better GPS signal\n" +
          "2. Go outside if you're indoors\n" +
          "3. Check your device location settings\n" +
          "4. Try refreshing the page";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 
          "📍 Location request timed out!\n\n" +
          "This usually means:\n" +
          "1. GPS signal is weak\n" +
          "2. You're in an area with poor signal\n" +
          "3. Device is taking too long to get location\n\n" +
          "Try moving to a different location or try again.";
      } else if (error.message === "Invalid coordinates received") {
        errorMessage = 
          "📍 Invalid location data received!\n\n" +
          "The location service returned invalid coordinates.\n" +
          "Please try again or use the map to select a location manually.";
      }
      
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLocationConfirm = () => {
    if (!locationData || !locationData.latitude || !locationData.longitude) {
      toast({
        title: "Invalid Location",
        description: "Location data is invalid. Please try again.",
        variant: "destructive",
      });
      setShowLocationDialog(false);
      setLocationData(null);
      return;
    }
    
    const { latitude, longitude, accuracy } = locationData;
    
    // Validate coordinates again
    if (isNaN(latitude) || isNaN(longitude)) {
      toast({
        title: "Invalid Coordinates",
        description: "Invalid coordinates detected. Please try again.",
        variant: "destructive",
      });
      setShowLocationDialog(false);
      setLocationData(null);
      return;
    }
    
    // Open Google Maps with route from user location to property
    const origin = `${latitude},${longitude}`;
    const dest = `${post.latitude},${post.longitude}`;
    const url = `https://www.google.com/maps/dir/${origin}/${dest}`;
    
    // Open in new tab
    window.open(url, '_blank');
    
    // Show success message
    toast({
      title: "Directions Opened",
      description: "Google Maps should open in a new tab with the route.",
      variant: "success",
    });
    
    setShowLocationDialog(false);
    setLocationData(null);
  };

  const handleAccuracyConfirm = () => {
    setShowAccuracyDialog(false);
    setShowLocationDialog(true);
  };

  const handleAccuracyCancel = () => {
    setShowAccuracyDialog(false);
    setLocationData(null);
  };

  const handleLocationTryAgain = () => {
    setShowLocationDialog(false);
    setLocationData(null);
    handleSmartDirections();
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

      {/* Modern Confirmation Dialogs */}
      <ModernConfirmationDialog
        isOpen={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationTryAgain}
        title="📍 Location Detected!"
        description={`Your coordinates: ${locationData?.latitude?.toFixed(6) || 'Unknown'}, ${locationData?.longitude?.toFixed(6) || 'Unknown'}\nAccuracy: ${Math.round(locationData?.accuracy || 0)} meters\n\nIs this your current location?`}
        confirmText="Open Directions"
        cancelText="Try Again"
        variant="default"
      />

      <ModernConfirmationDialog
        isOpen={showAccuracyDialog}
        onClose={handleAccuracyCancel}
        onConfirm={handleAccuracyConfirm}
        title="⚠️ Location Accuracy Warning!"
        description={`Your current location accuracy is: ${Math.round(locationData?.accuracy || 0)} meters\n\nThis might not be your exact location.\n\nPossible reasons:\n• GPS signal is weak\n• You're indoors\n• Browser location permission is limited\n\nDo you want to continue anyway?`}
        confirmText="Continue Anyway"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
}

export default SinglePage;