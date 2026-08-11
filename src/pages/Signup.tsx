import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";
import { Chrome } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const strength = Object.values(passwordValidation).filter(Boolean).length;
  const strengthLabel =
    strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Strong";

  const strengthColor =
    strength <= 2
      ? "bg-red-500"
      : strength <= 4
        ? "bg-yellow-500"
        : "bg-green-500";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Missing details",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (strength < 5) {
      toast({
        title: "Weak password",
        description:
          "Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number and a special character.",
        variant: "destructive",
      });

      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signup({ name, email, password });
      toast({
        title: "Check your email",
        description: "Enter the OTP sent to your email to finish registration.",
      });
      navigate(`/verify-otp/${response.userId}`);
    } catch (error) {
      toast({
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-background">
    //     {/* Background gradient */}
    //     <div className="absolute inset-0 overflow-hidden">
    //         <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
    //     </div>

    //     <div className="relative w-full max-w-md">
    //         {/* Card */}
    //         <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
    //             {/* Logo */}
    //             <div className="text-center mb-8">
    //                 <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 mb-5">
    //                     <Sparkles className="w-7 h-7 text-primary" />
    //                 </div>
    //                 <h1 className="text-2xl font-semibold text-foreground mb-2">Create an account</h1>
    //                 <p className="text-muted-foreground text-sm">Start building your next big idea</p>
    //             </div>

    //             <form onSubmit={handleSubmit} className="space-y-5">
    //                 <div className="space-y-2">
    //                     <Label htmlFor="name" className="text-sm font-medium text-foreground">
    //                         Full Name
    //                     </Label>
    //                     <div className="relative">
    //                         <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    //                         <Input
    //                             id="name"
    //                             type="text"
    //                             placeholder="John Doe"
    //                             value={name}
    //                             onChange={(e) => setName(e.target.value)}
    //                             className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary rounded-xl text-sm"
    //                             disabled={isLoading}
    //                         />
    //                     </div>
    //                 </div>

    //                 <div className="space-y-2">
    //                     <Label htmlFor="email" className="text-sm font-medium text-foreground">
    //                         Email
    //                     </Label>
    //                     <div className="relative">
    //                         <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    //                         <Input
    //                             id="email"
    //                             type="email"
    //                             placeholder="you@example.com"
    //                             value={email}
    //                             onChange={(e) => setEmail(e.target.value)}
    //                             className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary rounded-xl text-sm"
    //                             disabled={isLoading}
    //                         />
    //                     </div>
    //                 </div>

    //                 <div className="space-y-2">
    //                     <Label htmlFor="password" className="text-sm font-medium text-foreground">
    //                         Password
    //                     </Label>
    //                     <div className="relative">
    //                         <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    //                         <Input
    //                             id="password"
    //                             type="password"
    //                             placeholder="••••••••"
    //                             value={password}
    //                             onChange={(e) => setPassword(e.target.value)}
    //                             className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary rounded-xl text-sm"
    //                             disabled={isLoading}
    //                         />
    //                     </div>
    //                 </div>

    //                 <Button
    //                     type="submit"
    //                     disabled={isLoading}
    //                     className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl text-sm"
    //                 >
    //                     {isLoading ? (
    //                         <>
    //                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    //                             Creating account...
    //                         </>
    //                     ) : (
    //                         "Create account"
    //                     )}
    //                 </Button>
    //             </form>

    //             <p className="text-center text-sm text-muted-foreground mt-6">
    //                 Already have an account?{" "}
    //                 <Link to="/login" className="text-primary hover:underline font-medium">
    //                     Sign in
    //                 </Link>
    //             </p>
    //         </div>
    //     </div>
    // </div>

    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[180px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
                    linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
                `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center"
          >
            {/* Logo */}

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">NextForge AI</h2>

                <p className="text-sm text-white/50">AI Software Engineer</p>
              </div>
            </div>

            {/* Hero */}

            <h1 className="mt-12 text-6xl font-bold leading-tight">
              <span className="text-white">Create</span>

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your Workspace
              </span>

              <br />

              <span className="text-white">In Minutes</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              Join NextForge AI to build, preview, and ship production-ready
              React applications with secure authentication and smart project
              generation.
            </p>

            {/* Feature Cards */}

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">⚡</h3>

                <h4 className="mt-4 font-semibold text-white">Fast Setup</h4>

                <p className="mt-2 text-sm text-white/50">
                  Create your account and start building instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🧠</h3>

                <h4 className="mt-4 font-semibold text-white">
                  AI Project Flow
                </h4>

                <p className="mt-2 text-sm text-white/50">
                  Generate secure, production-ready app structure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🚀</h3>

                <h4 className="mt-4 font-semibold text-white">
                  Live Workspace
                </h4>

                <p className="mt-2 text-sm text-white/50">
                  Preview and collaborate from day one.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            {/* KEEP YOUR LOGIN CARD HERE */}
            <div
              className="
    w-full
    max-w-md
    rounded-3xl
    border
    border-white/10
    bg-white/[0.04]
    backdrop-blur-2xl
    p-8
    shadow-[0_0_80px_rgba(59,130,246,.15)]
  "
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Create Your Account
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Join now and start generating AI-powered applications in
                  minutes.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/70 mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mohammad Yawar Raza"
                      className="w-full rounded-xl border border-white/10
bg-white/[0.03]
py-3
pl-11
pr-4
text-white
placeholder:text-white/35
transition-all
duration-300
focus:border-cyan-500
focus:bg-white/[0.05]
focus:ring-4
focus:ring-cyan-500/10
focus:outline-none
"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yawar7081@gmail.com"
                      className="w-full rounded-xl border border-white/10
bg-white/[0.03]
py-3
pl-11
pr-4
text-white
placeholder:text-white/35
transition-all
duration-300
focus:border-cyan-500
focus:bg-white/[0.05]
focus:ring-4
focus:ring-cyan-500/10
focus:outline-none
"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-white placeholder:text-white/35 transition-all duration-300 focus:border-cyan-500
focus:bg-white/[0.05]
focus:ring-4
focus:ring-cyan-500/10
focus:outline-none
"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
absolute
right-4
top-1/2
-translate-y-1/2
text-white/40
hover:text-cyan-400
transition-colors
"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {password.length > 0 && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-white/60">Password Strength</span>

                        <span
                          className={`font-medium ${
                            strength <= 2
                              ? "text-red-400"
                              : strength <= 4
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {strengthLabel}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full transition-all duration-500 ${strengthColor}`}
                          style={{
                            width: `${(strength / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 text-xs">
                      <ValidationItem
                        valid={passwordValidation.length}
                        text="At least 8 characters"
                      />

                      <ValidationItem
                        valid={passwordValidation.uppercase}
                        text="One uppercase letter"
                      />

                      <ValidationItem
                        valid={passwordValidation.lowercase}
                        text="One lowercase letter"
                      />

                      <ValidationItem
                        valid={passwordValidation.number}
                        text="One number"
                      />

                      <ValidationItem
                        valid={passwordValidation.special}
                        text="One special character"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-white/70">
                    <input type="checkbox" className="w-4 h-4" /> Remember me
                  </label>
                  <Link to="/forgot-password" className="text-blue-400">
                    Forgot?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || strength < 5}
                  className="disabled:cursor-not-allowed
disabled:opacity-50
group
w-full
rounded-xl
bg-gradient-to-r
from-cyan-500
via-blue-600
to-purple-600
py-3
font-semibold
text-white
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-[0_0_30px_rgba(59,130,246,.45)]
active:scale-[0.99]
"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-[#020617] px-4 text-xs uppercase tracking-wider text-white/40">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={api.loginWithGoogle}
                    type="button"
                    className="group relative overflow-hidden flex items-center justify-center gap-3 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,.25)] active:scale-[0.98]"
                  >
                    {/* Animated Glow */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Chrome className=" relative h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 " />

                    <span className="relative">Signup with Google</span>
                  </button>
                </div>
                <div className="mt-6 flex justify-center gap-6 text-xs text-white/40">
                  <span>🔒 Secure</span>

                  <span>⚡ Fast</span>

                  <span>🛡 Private</span>
                </div>

                <p className="text-center text-xs text-white/60 mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 transition-colors ${
        valid ? "text-green-400" : "text-white/40"
      }`}
    >
      <span>{valid ? "✓" : "○"}</span>
      <span>{text}</span>
    </div>
  );
}
