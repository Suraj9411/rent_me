import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Map from "../../components/map/Map";
import { useToast } from "../../hooks/use-toast";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProperty, setEditProperty] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check if we're in edit mode
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && location.state?.property) {
      setIsEditMode(true);
      setEditProperty(location.state.property);
      // Pre-populate form with existing data
      setValue(location.state.property.desc || "");
      setImages(location.state.property.images || []);
      if (location.state.property.latitude && location.state.property.longitude) {
        setSelectedLocation({
          latitude: parseFloat(location.state.property.latitude),
          longitude: parseFloat(location.state.property.longitude)
        });
      }
    }
  }, [searchParams, location.state]);

  // Detect user's current location with improved accuracy
  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Check accuracy and warn user if poor
          if (accuracy > 100) {
            toast({
              title: "Location Accuracy Warning",
              description: `Location accuracy is ${Math.round(accuracy)} meters. This might not be your exact location.`,
              variant: "warning",
            });
          }
          
          setUserLocation({ latitude, longitude });
          setSelectedLocation({ latitude, longitude });
          setIsDetectingLocation(false);
          
          toast({
            title: "Location Detected",
            description: `Location found with ${Math.round(accuracy)} meter accuracy.`,
            variant: "success",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsDetectingLocation(false);
          
          let errorMessage = "Could not detect your location. Please use the map to select a location.";
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location permission denied. Please enable location access and try again.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location unavailable. Please check your GPS/network connection and try again.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out. Please try again or use the map to select a location.";
          }
          
          toast({
            title: "Location Detection Failed",
            description: errorMessage,
            variant: "warning",
          });
        },
        {
          enableHighAccuracy: true,  // Use GPS if available
          timeout: 30000,            // Wait up to 30 seconds
          maximumAge: 0              // Force fresh location
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Geolocation is not supported by this browser. Please use the map to select a location.",
        variant: "warning",
      });
    }
  };

  // Handle map click to select location
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a location using the map or detect your current location.",
        variant: "warning",
      });
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const postData = {
      title: inputs.title,
      price: parseInt(inputs.price),
      address: inputs.address,
      city: inputs.city,
      bedroom: parseInt(inputs.bedroom),
      bathroom: parseInt(inputs.bathroom),
      type: inputs.type,
      property: inputs.property,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      images: images,
    };

    const postDetail = {
      desc: value,
      utilities: inputs.utilities,
      pet: inputs.pet,
      roGeyser: inputs.roGeyser,
      parking: inputs.parking,
      school: parseInt(inputs.school),
      bus: parseInt(inputs.bus),
      restaurant: parseInt(inputs.restaurant),
    };

    try {
      let res;
      if (isEditMode && editProperty) {
        // Update existing property
        res = await apiRequest.put(`/posts/${editProperty.id}`, {
          postData,
          postDetail,
        });
        toast({
          title: "Property Updated",
          description: "Your property has been successfully updated.",
          variant: "success",
        });
      } else {
        // Create new property
        res = await apiRequest.post("/posts", {
          postData,
          postDetail,
        });
        toast({
          title: "Property Created",
          description: "Your property has been successfully created.",
          variant: "success",
        });
      }
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.message || "Something went wrong");
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-10 md:py-8 sm:py-5">
      <div className="w-full max-w-6xl mx-auto px-5 md:px-4 sm:px-3">
        <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold text-gray-900 mb-10 md:mb-8 sm:mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {isEditMode ? "Edit Property" : "Add New Property"}
        </h1>
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-10 md:p-8 sm:p-5 shadow-2xl border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-semibold text-gray-900 text-base md:text-sm">
                    Title <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    id="title" 
                    name="title" 
                    type="text" 
                    required 
                    placeholder="Enter property title"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="price" className="font-semibold text-gray-900 text-base md:text-sm">
                    Price <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    id="price" 
                    name="price" 
                    type="number" 
                    required 
                    placeholder="Enter price"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="address" className="font-semibold text-gray-900 text-base md:text-sm">
                    Address <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    id="address" 
                    name="address" 
                    type="text" 
                    required 
                    placeholder="Enter property address"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="font-semibold text-gray-900 text-base md:text-sm">
                    City <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    id="city" 
                    name="city" 
                    type="text" 
                    required 
                    placeholder="Enter city"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="bedroom" className="font-semibold text-gray-900 text-base md:text-sm">
                    Bedrooms <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    min={1} 
                    id="bedroom" 
                    name="bedroom" 
                    type="number" 
                    required 
                    placeholder="Number of bedrooms"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="bathroom" className="font-semibold text-gray-900 text-base md:text-sm">
                    Bathrooms <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    min={1} 
                    id="bathroom" 
                    name="bathroom" 
                    type="number" 
                    required 
                    placeholder="Number of bathrooms"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="type" className="font-semibold text-gray-900 text-base md:text-sm">
                    Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="type" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="property" className="font-semibold text-gray-900 text-base md:text-sm">
                    Property Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="property" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="roGeyser" className="font-semibold text-gray-900 text-base md:text-sm">
                    RO/Geyser <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="roGeyser" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Policies & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="utilities" className="font-semibold text-gray-900 text-base md:text-sm">
                    Utilities Policy <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="utilities" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pet" className="font-semibold text-gray-900 text-base md:text-sm">
                    Pet Policy <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="pet" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="parking" className="font-semibold text-gray-900 text-base md:text-sm">
                    Parking <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="parking" 
                    required
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 cursor-pointer bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_16px_center] bg-no-repeat bg-[16px] pr-12 appearance-none"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nearby Amenities Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Nearby Amenities (in meters)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="school" className="font-semibold text-gray-900 text-base md:text-sm">
                    School Distance <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    min={0} 
                    id="school" 
                    name="school" 
                    type="number" 
                    required 
                    placeholder="Distance to nearest school"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="bus" className="font-semibold text-gray-900 text-base md:text-sm">
                    Bus Stop Distance <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    min={0} 
                    id="bus" 
                    name="bus" 
                    type="number" 
                    required 
                    placeholder="Distance to bus stop"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="restaurant" className="font-semibold text-gray-900 text-base md:text-sm">
                    Restaurant Distance <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    min={0} 
                    id="restaurant" 
                    name="restaurant" 
                    type="number" 
                    required 
                    placeholder="Distance to restaurants"
                    className="px-5 py-4 md:px-4 md:py-3 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg text-base md:text-sm sm:text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Description
              </h2>
              <div className="flex flex-col gap-2">
                <label htmlFor="desc" className="font-semibold text-gray-900 text-base md:text-sm">
                  Property Description <span className="text-red-500 ml-1">*</span>
                </label>
                <ReactQuill 
                  theme="snow" 
                  onChange={setValue} 
                  value={value} 
                  placeholder="Describe your property..."
                  className="bg-white rounded-lg"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Location Selection
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 md:p-5 sm:p-4 border-2 border-dashed border-gray-200">
                <div className="text-xl md:text-lg sm:text-base font-semibold text-gray-900 mb-4 text-center">
                  📍 Select Property Location
                </div>
                <div className="text-gray-600 text-center mb-5 leading-relaxed">
                  Use the map below to select your property location or detect your current location automatically.
                </div>
                <div className="w-full h-96 md:h-72 sm:h-60 rounded-lg overflow-hidden border-2 border-gray-200 mb-5">
                  <Map 
                    items={selectedLocation ? [{
                      id: 'selected',
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      title: 'Selected Location',
                      bedroom: 0,
                      price: 0,
                      images: ['/pin.png']
                    }] : []}
                    onMapClick={handleMapClick}
                    center={userLocation || { latitude: 20.5937, longitude: 78.9629 }}
                    zoom={5}
                  />
                </div>
                <div className="flex justify-between items-center bg-white p-4 md:p-3 sm:p-3 rounded-lg border border-gray-200 md:flex-col md:gap-3 md:text-center">
                  <div className="flex gap-5 md:flex-col md:gap-3 sm:flex-col sm:gap-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-semibold text-gray-900">Latitude:</span>
                      <span>{selectedLocation && typeof selectedLocation.latitude === 'number' ? selectedLocation.latitude.toFixed(6) : 'Not selected'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-semibold text-gray-900">Longitude:</span>
                      <span>{selectedLocation && typeof selectedLocation.longitude === 'number' ? selectedLocation.longitude.toFixed(6) : 'Not selected'}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none px-5 py-3 md:px-4 md:py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none disabled:hover:shadow-lg"
                  >
                    {isDetectingLocation ? "Detecting..." : "📍 Detect My Location"}
                  </button>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-10 md:mb-8 sm:mb-6">
              <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-900 mb-5 md:mb-4 sm:mb-3 pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Property Images
              </h2>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-10 md:p-8 sm:p-6 text-center bg-gray-50/50 transition-all duration-200 cursor-pointer hover:border-gray-400 hover:bg-gray-100/50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Trigger the upload widget button click
                  const uploadButton = document.getElementById('upload_widget');
                  if (uploadButton) {
                    uploadButton.click();
                  }
                }}
              >
                <div className="text-5xl md:text-4xl sm:text-3xl text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-lg md:text-base sm:text-sm text-gray-900 mb-3 font-semibold">
                  Upload Property Images
                </div>
                <div className="text-gray-600 text-sm mb-4">
                  Click here or the button below to upload multiple images of your property
                </div>
                <UploadWidget
                  uwConfig={{
                    multiple: true,
                    cloudName: "lamadev",
                    uploadPreset: "estate",
                    folder: "posts",
                  }}
                  setState={setImages}
                />
              </div>
              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
                      <img 
                        src={image} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-36 sm:h-28 object-cover" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500/90 text-white border-none rounded-full w-6 h-6 cursor-pointer flex items-center justify-center text-xs transition-all duration-200 hover:bg-red-500 hover:scale-110"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-center gap-5 pt-8 md:flex-col md:gap-4 sm:pt-5">
              <button 
                type="submit" 
                className="px-8 py-4 md:px-7 md:py-3 sm:px-6 sm:py-3 border-none rounded-lg font-semibold text-lg md:text-base sm:text-sm cursor-pointer transition-all duration-200 text-center min-w-36 md:min-w-32 sm:min-w-28 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                {isEditMode ? "Update Property" : "Add Property"}
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/")}
                className="px-8 py-4 md:px-7 md:py-3 sm:px-6 sm:py-3 border-2 border-gray-200 rounded-lg font-semibold text-lg md:text-base sm:text-sm cursor-pointer transition-all duration-200 text-center min-w-36 md:min-w-32 sm:min-w-28 bg-gray-50 text-gray-900 hover:bg-gray-200 hover:border-gray-300"
              >
                Cancel
              </button>
            </div>

            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;