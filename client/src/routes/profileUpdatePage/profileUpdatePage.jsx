import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar:avatar[0]
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Container */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Update Profile
              </h1>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter new password (leave blank to keep current)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300"
              >
                Update Profile
              </button>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Side Container */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="mb-8">
              <img 
                src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-indigo-200 shadow-lg"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Avatar</h3>
              <p className="text-gray-600 mb-6">Upload a new profile picture to personalize your account</p>
              
              <UploadWidget
                uwConfig={{
                  cloudName: "lamadev",
                  uploadPreset: "estate",
                  multiple: false,
                  maxImageFileSize: 2000000,
                  folder: "avatars",
                }}
                setState={setAvatar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;