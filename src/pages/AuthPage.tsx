import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, AtSign, ArrowRight, Eye, EyeOff, Check, X, ShieldCheck, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: "At least 8 characters", test: pw => pw.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: pw => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)", test: pw => /[a-z]/.test(pw) },
  { label: "One number (0-9)", test: pw => /[0-9]/.test(pw) },
  { label: "One special character (!@#$%^&*)", test: pw => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
];

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const passed = passwordRules.filter(r => r.test(password)).length;
    return { passed, total: passwordRules.length, percent: (passed / passwordRules.length) * 100 };
  }, [password]);

  const allPasswordRulesPassed = passwordStrength.passed === passwordStrength.total;

  const strengthColor = passwordStrength.percent <= 20 ? "bg-destructive" :
    passwordStrength.percent <= 40 ? "bg-orange-500" :
    passwordStrength.percent <= 60 ? "bg-yellow-500" :
    passwordStrength.percent <= 80 ? "bg-blue-500" : "bg-green-500";

  const strengthLabel = passwordStrength.percent <= 20 ? "Very Weak" :
    passwordStrength.percent <= 40 ? "Weak" :
    passwordStrength.percent <= 60 ? "Fair" :
    passwordStrength.percent <= 80 ? "Strong" : "Very Strong";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      if (!displayName.trim()) { setError("Full name is required"); setLoading(false); return; }
      if (!username.trim()) { setError("Username is required"); setLoading(false); return; }
      if (username.length < 3) { setError("Username must be at least 3 characters"); setLoading(false); return; }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError("Username can only contain letters, numbers, and underscores"); setLoading(false); return; }
      if (!allPasswordRulesPassed) { setError("Password does not meet all requirements"); setLoading(false); return; }

      const result = await signUp(email, password, displayName, username);
      if (result.error) { setError(result.error.message); setLoading(false); return; }
      if (result.needsVerification) {
        setVerificationSent(true);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address first. Check your inbox for the verification link.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    navigate("/");
  };

  // Verification success screen
  if (verificationSent) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Verify Your Email — Cyber Venom" description="Check your email to verify your account" path="/auth" />
        <Navbar />
        <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl p-8 shadow-2xl overflow-hidden text-center">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-green-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-5"
                >
                  <MailCheck className="w-10 h-10 text-green-500" />
                </motion.div>

                <h1 className="text-2xl font-bold mb-2">Check Your Email!</h1>
                <p className="text-muted-foreground mb-4">
                  We've sent a verification link to:
                </p>
                <p className="font-semibold text-primary mb-6 break-all">{email}</p>
                <div className="bg-accent/30 rounded-2xl p-4 mb-6 text-left space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Step 1:</span> Open your email inbox
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Step 2:</span> Click the verification link
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Step 3:</span> Come back and login
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Didn't get the email? Check your spam folder.
                </p>
                <Button
                  onClick={() => { setVerificationSent(false); setIsSignUp(false); setPassword(""); }}
                  className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold h-11"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <img src="/logo.png" alt="Cyber Venom" className="w-12 h-12 rounded-2xl object-cover glow-shadow" />
              </div>

              <h1 className="text-2xl font-bold text-center mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {isSignUp ? "Join Cyber Venom today" : "Login to your account"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Full Name"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          className="pl-10 rounded-xl bg-accent/30 border-border/30"
                        />
                      </div>

                      {/* Username */}
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Username (e.g. john_doe)"
                          value={username}
                          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          className="pl-10 rounded-xl bg-accent/30 border-border/30"
                          maxLength={30}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
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

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-xl bg-accent/30 border-border/30"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength (only on signup) */}
                <AnimatePresence>
                  {isSignUp && password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-accent/30 rounded-xl p-3 space-y-2.5 border border-border/20">
                        {/* Strength bar */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[11px] font-semibold text-muted-foreground">Password Strength</span>
                          </div>
                          <span className={`text-[11px] font-bold ${allPasswordRulesPassed ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {strengthLabel}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${strengthColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.percent}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        {/* Rules checklist */}
                        <div className="space-y-1">
                          {passwordRules.map(rule => {
                            const passed = rule.test(password);
                            return (
                              <div key={rule.label} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                  {passed ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                                </div>
                                <span className={`text-[11px] ${passed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                  {rule.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading || (isSignUp && !allPasswordRulesPassed && password.length > 0)}
                  className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold h-11 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
                </Button>
              </form>

              <p className="text-sm text-center mt-5 text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setPassword(""); }} className="text-primary font-semibold hover:underline">
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
