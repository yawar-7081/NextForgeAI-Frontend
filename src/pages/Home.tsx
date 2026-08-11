import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
  getUserInfo,
  isAuthenticated,
  removeAuthToken,
  removeUserInfo,
} from "@/lib/api";

import {
  Sparkles,
  BrainCircuit,
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  BadgeCheck,
  Server,
  Code2,
  Database,
  Container,
} from "lucide-react";
import { api } from "@/lib/api";


function Stat({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1200;
    const step = 16;
    const inc = Math.max(1, Math.round((value / dur) * step));
    const t = setInterval(() => {
      start += inc;
      if (start >= value) {
        setDisplay(value);
        clearInterval(t);
      } else setDisplay(start);
    }, step);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className="flex flex-col items-start">
      <div className="text-3xl font-extrabold">
        {display}
        {value >= 1000 ? "+" : ""}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const user = getUserInfo();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeAuthToken();
      removeUserInfo();

      navigate("/", { replace: true });
    }
  };

  return (
    <div>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#020617]" />

        {/* Animated Blurred Circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-xl border-b border-white/10 bg-[#020617]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="text-white font-bold text-xl">NextForge</span>
            </div>

            {/* Nav Links - Hidden on mobile */}
            <div className="hidden md:flex gap-8">
              {["Features", "Architecture", "Pricing", "Documentation"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>

            <div className="flex items-center gap-3">
              {authenticated ? (
                <>
                  <span className="hidden md:block text-sm text-white/70">
                    Welcome,{" "}
                    <span className="font-semibold text-white">
                      {user?.name}
                    </span>
                  </span>

                  <Link
                    to="/projects"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/40"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Build Production Ready
                  </span>
                  <br />
                  <span className="text-white">AI Applications</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    10x Faster.
                  </span>
                </h1>

                <p className="text-lg text-white/70 max-w-lg leading-relaxed">
                  Generate complete React applications using AI. Collaborate in
                  real-time. Preview instantly. Deploy with confidence.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  "✓ AI Generated Code",
                  "✓ Live Preview",
                  "✓ Team Collaboration",
                  "✓ Enterprise Security",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 pt-4">
                {authenticated ? (
                  <Link
                    to="/projects"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
                  >
                    Start Building Free
                  </Link>
                )}
                <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all">
                  View Live Demo
                </button>
              </div>
            </div>

            {/* Right Side - Dashboard Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

                {/* Dashboard Card */}
                <div className="relative bg-gradient-to-br from-[#111827] to-[#0F172A] border border-white/10 rounded-3xl p-6 backdrop-blur-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>

                  {/* Content Grid */}
                  <div className="space-y-3">
                    {/* Project Tree */}
                    <div className="bg-[#0F172A]/50 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-white/50 font-mono space-y-2">
                        <div>📁 src/</div>
                        <div className="ml-3">📁 components/</div>
                        <div className="ml-6 text-green-400">✓ Header.tsx</div>
                        <div className="ml-6 text-green-400">✓ Hero.tsx</div>
                        <div className="ml-3">📁 pages/</div>
                        <div className="ml-6 text-blue-400">▶ Dashboard</div>
                      </div>
                    </div>

                    {/* Code Block */}
                    <div className="bg-[#0F172A]/50 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-white/50 font-mono space-y-1">
                        <div>
                          <span className="text-purple-400">const</span> app ={" "}
                          <span className="text-orange-400">new</span>{" "}
                          NextForge()
                        </div>
                        <div>
                          <span className="text-purple-400">const</span>{" "}
                          generated ={" "}
                          <span className="text-orange-400">await</span>{" "}
                          app.generate()
                        </div>
                        <div className="text-green-400">→ Ready to deploy</div>
                      </div>
                    </div>

                    {/* Streaming Status */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400">
                        Generating... 2.3s elapsed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= Meet The Creator ======================= */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
        {/* Background Glow */}

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Heading */}

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-2 backdrop-blur">
              <Sparkles className="w-4 h-4 text-yellow-400" />

              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-sm font-medium text-transparent">
                Meet the Creator
              </span>
            </div>

            <h2 className="mt-6 text-4xl lg:text-5xl font-bold">
              <span className="text-white">Built by a Developer,</span>

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                for Developers.
              </span>
            </h2>
          </div>

          {/* Main Card */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/60 backdrop-blur-xl">
            {/* Card Glow */}

            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

            <div className="relative grid lg:grid-cols-[260px_1fr] gap-10 p-8 lg:p-10 items-center">
              {/* LEFT */}

              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-xl opacity-40" />

                  <div className="relative rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[3px]">
                    <img
                      src="/yawar.jpg"
                      alt="Mohd Yawar Raza"
                      className="h-36 w-36 rounded-full object-cover bg-slate-900"
                    />
                  </div>
                </div>

                <h3 className="mt-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-3xl font-bold text-transparent">
                  Mohd Yawar Raza
                </h3>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                  <BadgeCheck className="h-4 w-4 text-blue-400" />

                  <span className="text-sm text-blue-300">
                    Backend Engineer @ TCS
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {/* GitHub */}
                  <Button
                    asChild
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all"
                  >
                    <a
                      href="https://github.com/your-github"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  {/* LinkedIn */}
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 hover:border-blue-500/40"
                  >
                    <a
                      href="https://linkedin.com/in/your-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>

                  {/* Email */}
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10"
                  >
                    <a href="mailto:your-email@example.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* RIGHT */}

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                    <BrainCircuit className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-white">
                    About NextForge AI
                  </h3>
                </div>

                <p className="leading-8 text-white/70">
                  NextForge AI is my vision of AI-assisted software development.
                  Built using Spring AI, Java, React, and modern cloud-native
                  technologies, it generates production-ready React applications
                  from natural language prompts while providing secure
                  authentication, project management, and real-time streaming.
                </p>

                {/* Stack */}

                <div className="mt-8">
                  <h4 className="mb-4 text-lg font-semibold text-white">
                    Technology Stack
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        icon: <Server className="h-5 w-5" />,
                        title: "Spring Boot",
                      },
                      {
                        icon: <BrainCircuit className="h-5 w-5" />,
                        title: "Spring AI",
                      },
                      {
                        icon: <Code2 className="h-5 w-5" />,
                        title: "React",
                      },
                      {
                        icon: <Database className="h-5 w-5" />,
                        title: "PostgreSQL",
                      },
                      {
                        icon: <Database className="h-5 w-5" />,
                        title: "Redis",
                      },
                      {
                        icon: <Container className="h-5 w-5" />,
                        title: "Docker",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:bg-blue-500/5"
                      >
                        <div className="mb-3 text-cyan-400">{item.icon}</div>

                        <p className="text-sm font-medium text-white">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Technology Stack ================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
              ⚙️ Modern Technology Stack
            </span>

            <h2 className="mt-6 text-5xl font-bold text-white">
              Built With Industry
              <br />
              Standard Technologies
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-white/60 leading-8">
              Every component of NextForge AI is built using modern,
              production-ready technologies trusted by startups and enterprise
              engineering teams.
            </p>
          </div>

          {/* Tech Grid */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                name: "Spring Boot",
                icon: "🍃",
                color: "group-hover:border-green-500/40",
              },
              {
                name: "Java",
                icon: "☕",
                color: "group-hover:border-orange-500/40",
              },
              {
                name: "React",
                icon: "⚛️",
                color: "group-hover:border-cyan-500/40",
              },
              {
                name: "PostgreSQL",
                icon: "🗄️",
                color: "group-hover:border-blue-500/40",
              },
              {
                name: "Redis",
                icon: "⚡",
                color: "group-hover:border-red-500/40",
              },
              {
                name: "Docker",
                icon: "🐳",
                color: "group-hover:border-sky-500/40",
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-sm p-6 hover:-translate-y-2 transition-all duration-300 ${tech.color}`}
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/5 to-purple-500/10 transition-opacity" />

                <div className="relative">
                  <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">
                    {tech.icon}
                  </div>

                  <h3 className="font-semibold text-white text-lg">
                    {tech.name}
                  </h3>

                  <p className="mt-2 text-xs text-white/50">Production Ready</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Everything you need to build production-ready AI applications at
              scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Code Generation",
                desc: "Generate production-ready applications instantly",
                icon: "✨",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Live Streaming",
                desc: "Watch AI generate code in real time with WebSocket streaming",
                icon: "🔴",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Project Management",
                desc: "Organize and manage multiple AI-generated projects",
                icon: "📊",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                title: "Version History",
                desc: "Track all generated changes and revert when needed",
                icon: "📜",
                gradient: "from-orange-500 to-red-500",
              },
              {
                title: "Team Collaboration",
                desc: "Invite teammates and collaborate in real-time",
                icon: "👥",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                title: "Enterprise Security",
                desc: "JWT, OAuth2, and comprehensive security controls",
                icon: "🔒",
                gradient: "from-rose-500 to-pink-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}
                />

                <div className="relative">
                  <div
                    className={`text-4xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/60">
              Seven simple steps from idea to production deployment
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Describe your idea",
              "AI understands requirements",
              "Spring AI processes request",
              "Tool calling generates plan",
              "Generate complete project",
              "Live preview in browser",
              "Deploy to production",
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-white font-medium">{step}</p>
                </div>
                {idx < 6 && <div className="text-2xl text-white/30">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ================= Architecture ================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-sm font-medium">
              🏗 Enterprise Architecture
            </span>

            <h2 className="mt-6 text-5xl font-bold text-white">
              Built for Scale.
              <br />
              Designed for AI.
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-white/60 leading-8">
              NextForge AI combines a modern frontend, enterprise-grade backend,
              cloud-native infrastructure, and intelligent AI services to
              deliver production-ready software generation.
            </p>
          </div>

          {/* Cards */}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Frontend */}

            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-3xl">
                  ⚛️
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">Frontend</h3>

                  <p className="text-white/50">Modern React Application</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["React", "TypeScript", "Vite", "Tailwind CSS"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}

            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-green-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-3xl">
                  ☕
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">Backend</h3>

                  <p className="text-white/50">Enterprise Java APIs</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["Java 21", "Spring Boot", "Spring AI", "PostgreSQL"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Infrastructure */}

            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-3xl">
                  ☁️
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Infrastructure
                  </h3>

                  <p className="text-white/50">Cloud Native Deployment</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "Docker",
                  "Kubernetes",
                  "GitHub Actions",
                  "Cloudflare R2",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}

            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-3xl">
                  🚀
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Platform Services
                  </h3>

                  <p className="text-white/50">Authentication & AI Services</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["Redis", "JWT", "OAuth2", "Stripe"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/60">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "₹0",
                features: ["5 projects", "Basic support", "Community access"],
                cta: "Get Started",
              },
              {
                name: "Basic",
                price: "₹499",
                features: ["50 projects", "Email support", "API access"],
                cta: "Start Free",
                featured: true,
              },
              {
                name: "Pro",
                price: "₹999",
                features: [
                  "Unlimited projects",
                  "Priority support",
                  "Team collaboration",
                  "Advanced analytics",
                ],
                cta: "Start Free",
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.featured
                    ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 ring-2 ring-blue-500/20 lg:scale-105"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-white/60">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-white/80 text-sm"
                    >
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.featured
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
                      : "border border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-white/60">
              See what our community is building with NextForge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Chen",
                company: "TechStartup Inc",
                text: "Reduced development time by 70%. This is a game-changer.",
                stars: 5,
              },
              {
                name: "Sarah Johnson",
                company: "Enterprise Corp",
                text: "The best code generation tool we've tested. Highly recommended.",
                stars: 5,
              },
              {
                name: "Mike Rodriguez",
                company: "Indie Developer",
                text: "I shipped 3 projects in a month. Worth every penny.",
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-white/80 mb-4">{testimonial.text}</p>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is NextForge AI?",
                a: "NextForge AI is an intelligent platform that generates production-ready full-stack applications using Spring Boot, React, and PostgreSQL. Simply describe your idea and watch as AI builds your entire application.",
              },
              {
                q: "How does AI generation work?",
                a: "Our platform uses advanced LLMs combined with Spring AI and custom advisors to understand your requirements, generate optimal architecture, and create clean, production-ready code.",
              },
              {
                q: "Can I deploy generated apps?",
                a: "Absolutely! Generated applications come with Docker configurations and Kubernetes manifests for easy deployment. Use GitHub Actions for CI/CD automation.",
              },
              {
                q: "How secure is my data?",
                a: "We implement enterprise-grade security including JWT authentication, OAuth2, Spring Security, encrypted storage in Cloudflare R2, and comprehensive audit logging.",
              },
              {
                q: "Do you support team collaboration?",
                a: "Yes! Create unlimited teams, invite collaborators, share projects, and collaborate in real-time on your generated applications.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <summary className="flex justify-between items-center font-bold text-white">
                  {item.q}
                  <span className="ml-4 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-white/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Build
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              with AI?
            </span>
          </h2>

          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are building the future with
            NextForge AI. Start for free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {authenticated ? (
              <Link
                to="/projects"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                Start Building Free
              </Link>
            )}
            <button className="px-8 py-4 border-2 border-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
              View on GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-[#020617]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                <span className="text-white font-bold">NextForge</span>
              </div>
              <p className="text-white/50 text-sm">
                Generate production-ready AI applications 10x faster.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", items: ["Features", "Pricing", "Security"] },
              {
                title: "Resources",
                items: ["Documentation", "Blog", "Community"],
              },
              { title: "Company", items: ["About", "GitHub", "Status"] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-white font-bold mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm">
              © 2024 NextForge AI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
