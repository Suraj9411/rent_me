import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import CompactList from "../../components/list/CompactList";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

function ProfilePage() {
  const data = useLoaderData();
  const [userPosts, setUserPosts] = useState([]);

  const { updateUser, currentUser, loading } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if no user is authenticated
  if (!currentUser) {
    return (
      <ErrorPage
        title="Authentication Required"
        message="Please log in to view your profile."
        statusCode={401}
        showRefresh={false}
        showGoBack={true}
        showGoHome={true}
      />
    );
  }

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditProperty = (property) => {
    // Navigate to edit page with property data
    navigate(`/add?edit=${property.id}`, { 
      state: { 
        property: property,
        isEdit: true 
      } 
    });
  };

  const handleDeleteProperty = (propertyId) => {
    // Remove from local state
    setUserPosts(prev => prev.filter(post => post.id !== propertyId));
    
    // Show success toast (the Card component already handles the API call and shows its own toast)
    toast({
      title: "Property Removed",
      description: "The property has been removed from your listings.",
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 mb-6">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img 
                    src={currentUser?.avatar || "/noavatar.jpg"} 
                    alt="User Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg mx-auto"
                    onError={(e) => {
                      e.target.src = "/noavatar.jpg";
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{currentUser?.username || 'User'}</h2>
                <p className="text-gray-600">{currentUser?.email || 'No email'}</p>
              </div>

              {/* Profile Stats */}
              <Suspense fallback={
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">-</div>
                    <div className="text-sm text-gray-600">Properties</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">-</div>
                    <div className="text-sm text-gray-600">Saved</div>
                  </div>
                </div>
              }>
                <Await resolve={data.postResponse}>
                  {(postResponse) => (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{postResponse.data.userPosts?.length || 0}</div>
                        <div className="text-sm text-gray-600">Properties</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{postResponse.data.savedPosts?.length || 0}</div>
                        <div className="text-sm text-gray-600">Saved</div>
                      </div>
                    </div>
                  )}
                </Await>
              </Suspense>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link 
                  to="/profile/update" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full bg-red-500/80 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/add" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Add Property</div>
                    <div className="text-sm text-gray-600">List a new property</div>
                  </div>
                </Link>
                <Link 
                  to="/list" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Browse Properties</div>
                    <div className="text-sm text-gray-600">Find your next home</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Properties */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                    <p className="text-gray-600 mt-1">Manage your property listings</p>
                  </div>
                  <Link 
                    to="/add" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                }>
                  <Await
                    resolve={data.postResponse}
                    errorElement={
                      <ErrorPage
                        title="Authentication Required"
                        message="Please log in to view your profile. Your session may have expired."
                        statusCode="401"
                        showRefresh={true}
                        showBack={false}
                        showHome={true}
                      />
                    }
                  >
                    {(postResponse) => {
                      // Update local state when data loads
                      if (postResponse.data.userPosts && userPosts.length === 0) {
                        setUserPosts(postResponse.data.userPosts);
                      }
                      return <CompactList posts={userPosts.length > 0 ? userPosts : postResponse.data.userPosts} showActions={true} onEdit={handleEditProperty} onDelete={handleDeleteProperty} />;
                    }}
                  </Await>
                </Suspense>
              </div>
            </div>

            {/* Saved Properties */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
                    <p className="text-gray-600 mt-1">Properties you've saved for later</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Favorites</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                }>
                  <Await
                    resolve={data.postResponse}
                    errorElement={
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Saved Properties</h3>
                        <p className="text-gray-600">There was a problem loading your saved properties. Please try again.</p>
                      </div>
                    }
                  >
                    {(postResponse) => <CompactList posts={postResponse.data.savedPosts} showMessage={true} />}
                  </Await>
                </Suspense>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                    <p className="text-gray-600 mt-1">Your conversations with potential tenants</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Chats</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                }>
                  <Await
                    resolve={data.chatResponse}
                    errorElement={
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Messages</h3>
                        <p className="text-gray-600">There was a problem loading your messages. Please try again.</p>
                      </div>
                    }
                  >
                    {(chatResponse) => <Chat chats={chatResponse.data}/>}
                  </Await>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;