
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-300 mb-6">Page Not Found</p>
        
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="border-gray-600 hover:bg-gray-600" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => navigate("/")}
          >
            <Home size={16} className="mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
