
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const { signIn, signUp, isLoading, session, adminLogin } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error: any) {
      setAuthError(error.message || "Failed to sign in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }
    
    try {
      await signUp(email, password, { full_name: fullName });
      // Don't navigate immediately as the user might need to confirm email
    } catch (error: any) {
      setAuthError(error.message || "Failed to sign up");
    }
  };

  const handleAdminLogin = async () => {
    setAuthError(null);
    try {
      await adminLogin();
      navigate(from, { replace: true });
    } catch (error: any) {
      setAuthError(error.message || "Admin login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <Card className="w-[350px] bg-gray-900 text-white border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Restaurant CRM</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                {authError && (
                  <div className="text-red-500 text-sm">{authError}</div>
                )}
                <Button 
                  type="button" 
                  className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                  onClick={handleAdminLogin}
                  disabled={isLoading}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isLoading ? "Signing in..." : "Administrator Login"}
                </Button>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="emailSignup" className="text-sm font-medium">Email</label>
                  <Input
                    id="emailSignup"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="passwordSignup" className="text-sm font-medium">Password</label>
                  <Input
                    id="passwordSignup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                {authError && (
                  <div className="text-red-500 text-sm">{authError}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
