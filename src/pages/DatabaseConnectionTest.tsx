
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Check, X, RefreshCw, Database, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { checkDatabaseConnections } from "@/utils/transactions/connectionUtils";

const DatabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionResults, setConnectionResults] = useState<{
    supabase: {
      connected: boolean;
      writeSuccess: boolean | null;
      error: string | null;
    };
    firebase: {
      connected: boolean;
      writeSuccess: boolean | null;
      error: string | null;
    };
  }>({
    supabase: { connected: false, writeSuccess: null, error: null },
    firebase: { connected: false, writeSuccess: null, error: null }
  });
  const { toast } = useToast();

  const checkConnections = async () => {
    setIsLoading(true);
    try {
      console.log("[Test] Checking database connections...");
      const connections = await checkDatabaseConnections();
      
      setConnectionResults({
        supabase: { 
          connected: connections.supabase, 
          writeSuccess: null,
          error: connections.errors.supabase 
        },
        firebase: { 
          connected: connections.firebase, 
          writeSuccess: null,
          error: connections.errors.firebase
        }
      });
      
      toast({
        title: "Connection Check Complete",
        description: connections.primaryAvailable 
          ? `Connected to ${connections.primaryAvailable} as primary database`
          : "No database connections available",
        variant: connections.primaryAvailable ? "default" : "destructive"
      });
    } catch (error) {
      console.error("[Test] Connection check error:", error);
      toast({
        title: "Connection Check Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseWrite = async () => {
    setIsLoading(true);
    try {
      console.log("[Test] Testing Supabase write operation...");
      
      // First check if connection is available
      const { data, error: connectionError } = await supabase
        .from('test_data')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error("[Test] Supabase connection error:", connectionError);
        throw new Error(`Supabase connection error: ${connectionError.message}`);
      }
      
      // Attempt a write operation
      const testRecord = {
        message: "Test data",
        timestamp: new Date().toISOString(),
        source: "connection_test"
      };
      
      const { error: writeError } = await supabase
        .from('test_data')
        .insert(testRecord);
      
      if (writeError) {
        // If table doesn't exist, try creating it first
        if (writeError.code === "42P01") { // relation does not exist
          console.log("[Test] Creating test_data table in Supabase...");
          
          // Try to create the test table using SQL
          const { error: createTableError } = await supabase.rpc(
            'create_test_table',
            {}
          );
          
          if (createTableError) {
            console.error("[Test] Failed to create test table:", createTableError);
            throw new Error(`Could not create test table: ${createTableError.message}`);
          }
          
          // Try the insert again
          const { error: retryError } = await supabase
            .from('test_data')
            .insert(testRecord);
          
          if (retryError) {
            throw new Error(`Write failed after table creation: ${retryError.message}`);
          }
        } else {
          throw new Error(`Supabase write failed: ${writeError.message}`);
        }
      }
      
      console.log("[Test] Supabase write successful!");
      setConnectionResults(prev => ({
        ...prev,
        supabase: { 
          ...prev.supabase, 
          writeSuccess: true, 
          error: null 
        }
      }));
      
      toast({
        title: "Supabase Write Success",
        description: "Successfully wrote test data to Supabase",
      });
    } catch (error) {
      console.error("[Test] Supabase write error:", error);
      setConnectionResults(prev => ({
        ...prev,
        supabase: { 
          ...prev.supabase, 
          writeSuccess: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        }
      }));
      
      toast({
        title: "Supabase Write Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testFirebaseWrite = async () => {
    setIsLoading(true);
    try {
      console.log("[Test] Testing Firebase write operation...");
      
      if (!db) {
        throw new Error("Firebase database reference is not initialized");
      }
      
      // Create a test collection if it doesn't exist and add a document
      const testCollectionRef = collection(db, "test_data");
      const testRecord = {
        message: "Test data",
        timestamp: serverTimestamp(),
        source: "connection_test"
      };
      
      const docRef = await addDoc(testCollectionRef, testRecord);
      console.log("[Test] Firebase write successful with ID:", docRef.id);
      
      setConnectionResults(prev => ({
        ...prev,
        firebase: { 
          ...prev.firebase, 
          writeSuccess: true, 
          error: null 
        }
      }));
      
      toast({
        title: "Firebase Write Success",
        description: `Successfully wrote test data to Firebase with ID: ${docRef.id}`,
      });
    } catch (error) {
      console.error("[Test] Firebase write error:", error);
      
      // Check for specific Firebase errors
      let errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("permission-denied")) {
        errorMessage = "Firebase permission denied. Check your security rules.";
      } else if (errorMessage.includes("storage is not allowed")) {
        errorMessage = "Browser storage access denied. This is expected in some environments.";
      } else if (errorMessage.includes("network error")) {
        errorMessage = "Network error when connecting to Firebase.";
      }
      
      setConnectionResults(prev => ({
        ...prev,
        firebase: { 
          ...prev.firebase, 
          writeSuccess: false, 
          error: errorMessage 
        }
      }));
      
      toast({
        title: "Firebase Write Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab="database-test" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Database Connection Test" />
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-400" />
                <h1 className="text-2xl font-bold">Database Connection & Write Test</h1>
              </div>
              
              <Button 
                onClick={checkConnections} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check All Connections"
                )}
              </Button>
            </div>
            
            <Alert className="mb-6 bg-blue-950/50 border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                This page tests both database connections and write operations to ensure your application can connect to and write data to the databases.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="supabase" className="mb-6">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="supabase">Supabase</TabsTrigger>
                <TabsTrigger value="firebase">Firebase</TabsTrigger>
              </TabsList>
              
              <TabsContent value="supabase">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Supabase Database Test</span>
                      <Badge variant={connectionResults.supabase.connected ? "success" : "destructive"}>
                        {connectionResults.supabase.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Test connection and write operations to Supabase database
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {connectionResults.supabase.connected && (
                      <div className="flex items-start gap-2 p-3 bg-green-900/20 rounded border border-green-600/30">
                        <Check className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-400">Connection Successful</div>
                          <p className="text-sm text-green-400/80">Your application can successfully connect to Supabase.</p>
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.supabase.connected === false && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 rounded border border-red-600/30">
                        <X className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-400">Connection Failed</div>
                          <p className="text-sm text-red-400/80">
                            {connectionResults.supabase.error || "Could not connect to Supabase database"}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.supabase.writeSuccess === true && (
                      <div className="flex items-start gap-2 p-3 bg-green-900/20 rounded border border-green-600/30">
                        <Check className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-400">Write Operation Successful</div>
                          <p className="text-sm text-green-400/80">Your application can successfully write data to Supabase.</p>
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.supabase.writeSuccess === false && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 rounded border border-red-600/30">
                        <X className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-400">Write Operation Failed</div>
                          <p className="text-sm text-red-400/80">
                            {connectionResults.supabase.error || "Failed to write data to Supabase database"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={testSupabaseWrite}
                      disabled={isLoading || connectionResults.supabase.connected === false}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing Write...
                        </>
                      ) : (
                        "Test Supabase Write Operation"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="firebase">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Firebase Database Test</span>
                      <Badge variant={connectionResults.firebase.connected ? "success" : "destructive"}>
                        {connectionResults.firebase.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Test connection and write operations to Firebase database
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {connectionResults.firebase.connected && (
                      <div className="flex items-start gap-2 p-3 bg-green-900/20 rounded border border-green-600/30">
                        <Check className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-400">Connection Successful</div>
                          <p className="text-sm text-green-400/80">Your application can successfully connect to Firebase.</p>
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.firebase.connected === false && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 rounded border border-red-600/30">
                        <X className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-400">Connection Failed</div>
                          <p className="text-sm text-red-400/80">
                            {connectionResults.firebase.error || "Could not connect to Firebase database"}
                          </p>
                          {connectionResults.firebase.error?.includes("storage is not allowed") && (
                            <p className="text-xs text-amber-400 mt-2">
                              Note: Browser storage access issues are common in preview environments and may not indicate a real problem.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.firebase.writeSuccess === true && (
                      <div className="flex items-start gap-2 p-3 bg-green-900/20 rounded border border-green-600/30">
                        <Check className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-400">Write Operation Successful</div>
                          <p className="text-sm text-green-400/80">Your application can successfully write data to Firebase.</p>
                        </div>
                      </div>
                    )}
                    
                    {connectionResults.firebase.writeSuccess === false && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 rounded border border-red-600/30">
                        <X className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-400">Write Operation Failed</div>
                          <p className="text-sm text-red-400/80">
                            {connectionResults.firebase.error || "Failed to write data to Firebase database"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={testFirebaseWrite}
                      disabled={isLoading || connectionResults.firebase.connected === false}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing Write...
                        </>
                      ) : (
                        "Test Firebase Write Operation"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/pos'} variant="outline">
                Return to POS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
