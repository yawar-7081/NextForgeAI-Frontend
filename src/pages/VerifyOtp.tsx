import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOtp() {
  const { userId } = useParams<{ userId: string }>();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: "Missing code",
        description: "Please enter the 6-digit code sent to your email.",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Missing user",
        description: "Unable to verify OTP without a user ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.verifyOtp(userId, { otp });
      const authToken = response.accessToken ?? response.token;

      if (authToken) {
        setAuthToken(authToken);
      }

      setUserInfo({
        id: Number(response.userId),
        username: response.username,
        name: response.name,
      });
      toast({
        title: "Registration complete",
        description: "Your account is now active.",
      });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Verification failed",
        description:
          error instanceof Error ? error.message : "Could not verify code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">NextForge AI</h2>
                <p className="text-sm text-white/50">AI Software Engineer</p>
              </div>
            </div>

            <h1 className="mt-12 text-6xl font-bold leading-tight">
              <span className="text-white">Verify</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                One-Time Code
              </span>
              <br />
              <span className="text-white">Secure Access</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              Enter the 6-digit code sent to your email to continue securely.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">📩</h3>
                <h4 className="mt-4 font-semibold text-white">Email Check</h4>
                <p className="mt-2 text-sm text-white/50">
                  Verify the code sent to your inbox.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🛡</h3>
                <h4 className="mt-4 font-semibold text-white">Secure Access</h4>
                <p className="mt-2 text-sm text-white/50">
                  Protect your account with one-time verification.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">⚡</h3>
                <h4 className="mt-4 font-semibold text-white">
                  Quick Continue
                </h4>
                <p className="mt-2 text-sm text-white/50">
                  Complete setup and move into your workspace.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(59,130,246,.15)]">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Verify OTP
                </h1>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/70 mb-2 block">
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 px-4 text-white placeholder:text-white/35 transition-all duration-300 focus:border-cyan-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-500/10 focus:outline-none tracking-[0.35em] text-center"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,.45)] active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-white/60 mt-6">
                Back to{" "}
                <Link to="/login" className="text-blue-400">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
