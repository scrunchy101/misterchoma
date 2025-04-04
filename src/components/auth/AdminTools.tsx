
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, User, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("loading...");
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const targetEmail = "misterchoma@gmail.com";

  // Fetch the current user role on component mount
  useEffect(() => {
    fetchCurrentRole();
  }, []);

  const fetchCurrentRole = async () => {
    try {
      setRefreshing(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', targetEmail)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        setCurrentRole("unknown");
      } else {
        setCurrentRole(data?.role || "unknown");
      }
    } catch (error) {
      console.error("Error in fetchCurrentRole:", error);
      setCurrentRole("error");
    } finally {
      setRefreshing(false);
    }
  };

  const updateUserRole = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      console.log("Starting role update process for:", targetEmail);
      
      // Directly update the role using the email as identifier
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', targetEmail);
      
      if (updateError) {
        console.error("Error updating role:", updateError);
        throw updateError;
      }
      
      console.log("Update operation completed, response:", updateData);
      
      // Verify the update was successful by fetching the updated profile
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', targetEmail)
        .single();
      
      if (verifyError) {
        console.error("Error verifying update:", verifyError);
        throw verifyError;
      }
      
      console.log("Verification check completed:", verifyData);
      
      if (verifyData?.role === 'admin') {
        setCurrentRole('admin');
        setResult("Success! User role updated to admin.");
        toast({
          title: "Role Updated",
          description: `User ${targetEmail} is now an admin`,
        });
      } else {
        throw new Error("Update appeared to succeed but role is not admin");
      }
      
    } catch (error: any) {
      console.error("Error updating user role:", error);
      setResult(`Error: ${error.message}`);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Role Update
        </CardTitle>
        <CardDescription>
          Change the role of user {targetEmail} to admin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <span>User: {targetEmail}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCurrentRole} 
            disabled={refreshing}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Current role: <span className="font-medium">{currentRole}</span><br />
          New role: <span className="font-medium text-green-500">admin</span>
        </div>
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${
            result.startsWith("Error") 
              ? "bg-red-500/10 border border-red-500/20 text-red-500" 
              : "bg-green-500/10 border border-green-500/20 text-green-500"
          }`}>
            {result}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={updateUserRole} 
          disabled={loading || currentRole === 'admin'}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : currentRole === 'admin' ? (
            'Already Admin'
          ) : (
            'Update to Admin Role'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
