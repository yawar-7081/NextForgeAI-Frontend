import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/6 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/8">
              <Sparkles className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <div className="font-semibold">NextForge AI</div>
          </div>
          <div className="text-sm text-muted-foreground">AI-generated full-stack apps for modern teams.</div>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="mb-2 font-medium">Product</div>
          <ul className="space-y-2">
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="mb-2 font-medium">Company</div>
          <ul className="space-y-2">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/6 py-4 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} NextForge AI — Built with ❤️</div>
    </footer>
  );
}
