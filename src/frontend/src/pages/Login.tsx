import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await login(username.trim(), password);
      toast.success("Welcome back!");
      navigate({ to: "/" });
    } catch {
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-orange-brand flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-navy" />
            </div>
            <h1 className="font-display text-2xl font-bold gold-gradient mb-1">
              Welcome Back
            </h1>
            <p className="text-foreground/60 text-sm">
              Sign in to your SandeepKarnaLive account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                data-ocid="login.input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-ocid="login.input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              data-ocid="login.submit_button"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold to-orange-brand text-navy font-bold hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gold hover:underline font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
