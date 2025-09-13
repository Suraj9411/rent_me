import { useRouteError } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-8">{error?.message || "An unexpected error occurred"}</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            🔄 Refresh Page
          </button>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            ⬅️ Go Back
          </button>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
