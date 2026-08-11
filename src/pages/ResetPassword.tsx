import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const canSubmit = Boolean(
    token && password && confirmPassword && password === confirmPassword,
  );

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

    if (!token) {
      toast({
        title: "Invalid link",
        description:
          "The reset token is missing. Please use the email reset link.",
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

    if (!password || !confirmPassword) {
      toast({
        title: "Missing password",
        description: "Please enter and confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword({ token, newPassword: password });
      toast({
        title: "Password updated",
        description: "Your password has been reset successfully.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Reset failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not reset your password.",
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
              <span className="text-white">Reset</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your Password
              </span>
              <br />
              <span className="text-white">Securely</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
              Set a new password and continue building production-ready
              applications with confidence.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🔐</h3>
                <h4 className="mt-4 font-semibold text-white">
                  Secure Recovery
                </h4>
                <p className="mt-2 text-sm text-white/50">
                  Create a fresh password for your workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">⚡</h3>
                <h4 className="mt-4 font-semibold text-white">Fast Resume</h4>
                <p className="mt-2 text-sm text-white/50">
                  Continue where you left off in seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="text-3xl">🚀</h3>
                <h4 className="mt-4 font-semibold text-white">
                  Project Access
                </h4>
                <p className="mt-2 text-sm text-white/50">
                  Jump back into AI-generated apps confidently.
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
                  Reset Password
                </h1>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Enter a new password for your account.
                </p>
              </div>

              {token ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-white/70 mb-2 block">
                      New password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-11 text-white placeholder:text-white/35 transition-all duration-300 focus:border-cyan-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
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
                  </div>

                  <div>
                    <label className="text-xs text-white/70 mb-2 block">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-11 text-white placeholder:text-white/35 transition-all duration-300 focus:border-cyan-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !canSubmit || strength < 5}
                    className="disabled:cursor-not-allowed
disabled:opacity-50 group w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,.45)] active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-white/70">
                    No reset token was found on the link. Please use the
                    password reset link in the email.
                  </p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-400 hover:text-cyan-400 text-sm"
                  >
                    Request a new reset email
                  </Link>
                </div>
              )}

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
