
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, User } from "lucide-react";

export const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const updateUserRole = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      // First, find the user's ID from their email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'misterchoma@gmail.com')
        .single();
      
      if (userError) {
        throw new Error(`User not found: ${userError.message}`);
      }
      
      if (!userData || !userData.id) {
        throw new Error("User with email misterchoma@gmail.com not found");
      }
      
      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setResult("Success! User role updated to admin.");
      toast({
        title: "Role Updated",
        description: "User misterchoma@gmail.com is now an admin",
      });
      
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
          Change the role of user misterchoma@gmail.com to admin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-blue-500" />
          <span>User: misterchoma@gmail.com</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current role: cashier<br />
          New role: admin
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
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update to Admin Role'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
