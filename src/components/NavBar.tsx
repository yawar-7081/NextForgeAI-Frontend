import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/8">
            <Sparkles className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <Link to="/home" className="font-semibold text-lg">NextForge AI</Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/features" className="hover:text-white">Features</Link>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <Link to="/docs" className="hover:text-white">Documentation</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm">Login</Link>
          <Link to="/signup" className="ml-2">
            <button className="px-4 py-2 rounded-lg bg-[#3B82F6] text-black font-medium">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
