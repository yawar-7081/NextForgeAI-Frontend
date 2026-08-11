import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Chrome } from "lucide-react";
import { CheckCircle2, Terminal, Code2 } from "lucide-react";
// OR use a Google SVG/logo for an even better look.
export function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      const authToken = response.accessToken ?? response.token;

      if (authToken) {
        setAuthToken(authToken);
        console.log("JWT:", authToken);
        console.log("Stored:", localStorage.getItem("auth_token"));
      }

      setUserInfo({
        id: Number(response.userId),
        username: response.username,
        name: response.name,
      });
      toast({ title: "Welcome back!", description: "Successfully logged in" });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <span className="text-white">Generate</span>

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Production Ready
              </span>

              <br />

              <span className="text-white">React Apps</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              Turn your ideas into production-ready React applications using AI.
              Generate components, authentication, backend APIs and
              deployment-ready projects in minutes.
            </p>

            {/* Feature Cards */}

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">⚡</h3>

                <h4 className="mt-4 font-semibold text-white">AI Generation</h4>

                <p className="mt-2 text-sm text-white/50">
                  Generate apps instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🧠</h3>

                <h4 className="mt-4 font-semibold text-white">
                  Smart Architecture
                </h4>

                <p className="mt-2 text-sm text-white/50">
                  Enterprise-ready structure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🚀</h3>

                <h4 className="mt-4 font-semibold text-white">Live Preview</h4>

                <p className="mt-2 text-sm text-white/50">Preview instantly.</p>
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
                  Welcome Back 👋
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Continue building production-ready applications with AI.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/70 mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 left-4
top-1/2
-translate-y-1/2 text-white/40"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="
w-full
rounded-xl
border
border-white/10
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
                    <Lock
                      className="absolute left-3 left-4
top-1/2
-translate-y-1/2 text-white/40"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="
w-full
rounded-xl
border
border-white/10
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
                  className="
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
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
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

                    <span className="relative">Continue with Google</span>
                  </button>
                </div>
                <div className="mt-6 flex justify-center gap-6 text-xs text-white/40">
                  <span>🔒 Secure</span>

                  <span>⚡ Fast</span>

                  <span>🛡 Private</span>
                </div>

                <p className="text-center text-xs text-white/60 mt-3">
                  New here?{" "}
                  <Link to="/signup" className="text-blue-400">
                    Create account
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

