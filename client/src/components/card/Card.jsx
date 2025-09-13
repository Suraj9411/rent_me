import { Link } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { useToast } from "../../hooks/use-toast";
import { ConfirmationDialog } from "../ui/confirmation-dialog";

function Card({ item, showActions = false, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await apiRequest.delete(`/posts/${item.id}`);
      onDelete && onDelete(item.id);
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
        variant: "success",
      });
      
      // Refresh the page after successful deletion
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Wait 1.5 seconds to show the success toast
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
      toast({
        title: "Edit Property",
        description: "Redirecting to edit property page...",
        variant: "default",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-5 bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-0 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300">
      {/* Image - Show on mobile but smaller */}
      <Link to={`/${item.id}`} className="md:flex-2 h-32 md:h-48 w-full md:w-auto relative group">
        <img 
          src={item.images?.[0] || '/home1.jpg'} 
          alt={item.title} 
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg"></div>
      </Link>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-between gap-3 md:gap-2 p-4 md:p-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 transition-all duration-300 hover:text-blue-600 hover:scale-105 mb-2">
            <Link to={`/${item.id}`} className="overflow-hidden text-ellipsis">{item.title}</Link>
          </h2>
          <p className="text-sm flex items-center gap-1 text-gray-600 mb-2">
            <svg className="w-4 h-4 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.address}</span>
          </p>
          <p className="text-xl font-bold p-2 rounded bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 w-max border border-blue-200">
            ₹ {item.price}
          </p>
        </div>
        
        {/* Features and Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-2">
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
              </svg>
              <span className="text-gray-600">{item.bedroom}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-gray-600">{item.bathroom}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {showActions ? (
              <>
                <button 
                  onClick={handleEdit}
                  className="border border-blue-300 p-2 rounded-md cursor-pointer flex items-center justify-center hover:bg-blue-50 transition-colors duration-200"
                  title="Edit Property"
                >
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="border border-red-300 p-2 rounded-md cursor-pointer flex items-center justify-center hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                  title="Delete Property"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button className="border border-blue-300 p-2 rounded-md cursor-pointer flex items-center justify-center hover:bg-blue-50 transition-colors duration-200">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="border border-blue-300 p-2 rounded-md cursor-pointer flex items-center justify-center hover:bg-blue-50 transition-colors duration-200">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

export default Card;