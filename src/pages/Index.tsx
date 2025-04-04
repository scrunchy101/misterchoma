
import React, { useEffect } from "react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { AdminTools } from "@/components/auth/AdminTools";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { user, profile } = useAuth();
  
  // Show admin tools in a special section for admins and superusers
  const showAdminTools = profile?.role === "admin" || profile?.email === "misterchoma@gmail.com";

  useEffect(() => {
    // Log info on component mount to help with debugging
    console.log("Index page mounted with user profile:", profile);
    console.log("Admin tools should display:", showAdminTools);
    console.log("Current user role:", profile?.role);
  }, [profile, showAdminTools]);
  
  return (
    <div className="flex flex-col">
      <DashboardPage />
      
      {/* Admin Tools Section */}
      {showAdminTools && (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTools />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
