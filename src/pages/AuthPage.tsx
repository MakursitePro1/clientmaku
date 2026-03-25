import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      if (!displayName.trim()) { setError("Name is required"); setLoading(false); return; }
      const { error } = await signUp(email, password, displayName);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await signIn(email, password);
      if (error) { setError(error.message); setLoading(false); return; }
    }
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={isSignUp ? "Sign Up — Cyber Venom" : "Login — Cyber Venom"} description="Login or create your account" path="/auth" />
      <Navbar />
      <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
            {/* Glow background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center glow-shadow">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {isSignUp ? "Join Cyber Venom today" : "Login to your account"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Your Name"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="pl-10 rounded-xl bg-accent/30 border-border/30"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 rounded-xl bg-accent/30 border-border/30"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-xl bg-accent/30 border-border/30"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold h-11 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
                </Button>
              </form>

              <p className="text-sm text-center mt-5 text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-primary font-semibold hover:underline">
                  {isSignUp ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
