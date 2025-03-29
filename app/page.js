"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, CircularProgress, Alert, Typography } from "@mui/material";
import { Lock, Person, Email } from "@mui/icons-material";

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Added missing state

  useEffect(() => {
    if (localStorage.getItem("token")) router.push("/dashboard");
  }, [router]);

  const toggleAuthMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsNewUser(!isNewUser);
      setError("");
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const url = isNewUser 
        ? "http://localhost:5000/api/auth/signup" 
        : "http://localhost:5000/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNewUser ? user : { 
          email: user.email, 
          password: user.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4">
    <div className={`glassmorphic transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"} w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/10`}>
      <div className="text-center mb-8">
        <Typography 
          variant="h4" 
          component="h1" 
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-200 mb-2"
        >
          {isNewUser ? "Create Account" : "Welcome Back"}
        </Typography>
        <Typography variant="body2" className="text-gray-300">
          {isNewUser ? "Join us today!" : "Sign in to continue"}
        </Typography>
      </div>
  
      {error && (
        <Alert 
          severity="error" 
          className="mb-6 rounded-lg"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
  
      <form onSubmit={handleSubmit}>
        <div className="space-y-6"> {/* Increased vertical spacing */}
          {isNewUser && (
            <div className="mb-6"> {/* Added wrapper div with margin */}
              <TextField
                fullWidth
                label="Full Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                variant="outlined"
                InputProps={{
                  startAdornment: <Person className="text-gray-400 mr-2" />,
                }}
                className="bg-white/5 rounded-lg"
                InputLabelProps={{ className: "text-gray-300" }}
                required
              />
            </div>
          )}
          
          <div className="mb-6"> {/* Added wrapper div with margin */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              variant="outlined"
              InputProps={{
                startAdornment: <Email className="text-gray-400 mr-4" />,
              }}
              className="bg-white/5 rounded-lg"
              InputLabelProps={{ className: "text-gray-300" }}
              required
            />
          </div>
          
          <div className="mb-8"> {/* Increased margin before button */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              variant="outlined"
              InputProps={{
                startAdornment: <Lock className="text-gray-400 mr-2" />,
              }}
              className="bg-white/5 rounded-lg"
              InputLabelProps={{ className: "text-gray-300" }}
              required
            />
          </div>
  
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            className="py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isNewUser ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
  
      <div className="mt-8 text-center">
        <Typography 
          variant="body2" 
          className="text-gray-400 hover:text-white cursor-pointer transition-colors inline-flex items-center"
          onClick={toggleAuthMode}
        >
          {isNewUser ? "Already have an account? " : "Don't have an account? "}
          <span className="text-blue-300 ml-1 font-medium">
            {isNewUser ? "Sign In" : "Sign Up"}
          </span>
        </Typography>
      </div>
    </div>
  
    {/* Background animation elements */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  </div>
  );
}