import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function CompactCard({ item, showActions = false, onEdit, onDelete, showMessage = false }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await onDelete(item.id);
      setShowDeleteDialog(false);
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
        variant: "success",
      });
      // Auto refresh after successful deletion
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Failed to Delete",
        description: "There was an error deleting the property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to send messages.",
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    if (!item.user || !item.user.id) {
      toast({
        title: "User Data Missing",
        description: "Property owner information is not available.",
        variant: "destructive",
      });
      return;
    }

    if (item.user.id === currentUser.id) {
      toast({
        title: "Cannot Message Yourself",
        description: "You cannot send a message to yourself.",
        variant: "warning",
      });
      return;
    }

    try {
      const chatResponse = await apiRequest.post("/chats", {
        receiverId: item.user.id
      });
      navigate(`/chats/${chatResponse.data.id}`);
      toast({
        title: "Chat Opened",
        description: `Starting conversation with ${item.user.username}`,
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

  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span>{item.bedroom || 0} Bed</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                </svg>
                <span>{item.bathroom || 0} Bath</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{item.address}, {item.city}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-blue-600">
                ${item.price?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Property'}
              </div>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            {showMessage && (
              <button
                onClick={handleMessage}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Message Owner"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            )}
            {showActions && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit Property"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete Property"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}

export default CompactCard;
