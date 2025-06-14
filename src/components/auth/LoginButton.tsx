
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

interface LoginButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  variant = "outline",
  size = "default",
  showIcon = true,
  className = ""
}) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (profile) {
      signOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleAuth}
      className={className}
    >
      {showIcon && (
        profile ? 
        <LogOut className="mr-2 h-4 w-4" /> : 
        <LogIn className="mr-2 h-4 w-4" />
      )}
      {profile ? "Sign Out" : "Sign In"}
    </Button>
  );
};
