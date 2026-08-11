import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Missing email",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.forgotPassword({ email });
      toast({
        title: "Email sent",
        description: "Check your email for password reset instructions.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Request failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not send reset request.",
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
              <span className="text-white">Recover</span>

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your Access
              </span>

              <br />

              <span className="text-white">Securely</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              Reset your password quickly and keep building with AI-powered app
              generation, secure authentication, and instant preview workflows.
            </p>

            {/* Feature Cards */}

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">⚡</h3>

                <h4 className="mt-4 font-semibold text-white">
                  Quick Recovery
                </h4>

                <p className="mt-2 text-sm text-white/50">
                  Reset your password in seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🧠</h3>

                <h4 className="mt-4 font-semibold text-white">Secure Access</h4>

                <p className="mt-2 text-sm text-white/50">
                  Protect your workspace and continue safely.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🚀</h3>

                <h4 className="mt-4 font-semibold text-white">
                  Resume Building
                </h4>

                <p className="mt-2 text-sm text-white/50">
                  Jump back into your AI-generated projects.
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
                  Reset Access
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Enter your email and we’ll send you a secure password reset
                  link.
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
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
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
                <p className="text-center text-xs text-white/60 mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400">
                    Sign In
                  </Link>
                </p>{" "}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
