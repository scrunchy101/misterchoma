
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const GlobalErrorListener = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Handle uncaught exceptions
    const handleUncaughtError = (event: ErrorEvent) => {
      console.error("Uncaught error:", event.error);
      
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again or refresh the page.",
        variant: "destructive",
      });
      
      // Prevent the default browser error overlay
      event.preventDefault();
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      
      toast({
        title: "Async Operation Failed",
        description: event.reason?.message || "A background operation failed. Please try again.",
        variant: "destructive",
      });
      
      // Prevent the default browser error overlay
      event.preventDefault();
    };

    // Handle network status changes
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        toast({
          title: "Connection Restored",
          description: "Your internet connection has been restored.",
        });
      } else {
        toast({
          title: "You're Offline",
          description: "Please check your internet connection.",
          variant: "destructive",
        });
      }
    };

    // Add event listeners
    window.addEventListener("error", handleUncaughtError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Clean up
    return () => {
      window.removeEventListener("error", handleUncaughtError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, [toast]);

  return null;
};
