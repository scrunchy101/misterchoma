
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebaseConnection } from "@/hooks/pos/useFirebaseConnection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X, RefreshCw, Database } from "lucide-react";

const DatabaseTest = () => {
  const { connectionStatus, checkConnection: checkFirebase } = useFirebaseConnection();
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; checking: boolean }>({
    connected: false,
    checking: false
  });
  const { toast } = useToast();

  const checkSupabaseConnection = async () => {
    try {
      setSupabaseStatus(prev => ({ ...prev, checking: true }));
      console.log("Checking Supabase connection...");
      
      // Simple query to check if Supabase is accessible
      const { data, error } = await supabase.from('menu_items').select('id').limit(1);
      
      if (error) throw error;
      
      console.log("Supabase connection successful:", data);
      setSupabaseStatus({ connected: true, checking: false });
      
      toast({
        title: "Supabase Connection Success",
        description: "Successfully connected to Supabase database",
      });
    } catch (error) {
      console.error("Supabase connection check failed:", error);
      setSupabaseStatus({ connected: false, checking: false });
      
      const errorMessage = error instanceof Error 
        ? error.message
        : "Could not connect to Supabase. Please check your internet connection and configuration.";
      
      toast({
        title: "Supabase Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSupabaseStatus(prev => ({ ...prev, checking: false }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Database className="h-8 w-8" />
        Database Connection Test
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Firebase Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Connection Test</CardTitle>
            <CardDescription>
              Test connection to Firestore database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${
                connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {connectionStatus.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            {connectionStatus.connected && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-500">Firebase connection is working correctly</span>
              </div>
            )}
            
            {!connectionStatus.connected && !connectionStatus.checking && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-500">Unable to connect to Firebase</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={checkFirebase} 
              disabled={connectionStatus.checking}
              className="w-full"
            >
              {connectionStatus.checking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Test Firebase Connection'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Supabase Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Test</CardTitle>
            <CardDescription>
              Test connection to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${
                supabaseStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {supabaseStatus.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            {supabaseStatus.connected && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-500">Supabase connection is working correctly</span>
              </div>
            )}
            
            {!supabaseStatus.connected && !supabaseStatus.checking && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-500">Unable to connect to Supabase</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={checkSupabaseConnection} 
              disabled={supabaseStatus.checking}
              className="w-full"
            >
              {supabaseStatus.checking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Test Supabase Connection'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <p className="text-gray-500 dark:text-gray-400">
          This page allows you to test connections to your databases. If connections fail, check your 
          configuration settings and ensure you have proper network connectivity.
        </p>
      </div>
    </div>
  );
};

export default DatabaseTest;
