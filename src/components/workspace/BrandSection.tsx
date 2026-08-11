import { Sparkles } from "lucide-react";

export default function BrandSection() {
    return (
        <div className="flex items-center gap-3 pr-6 border-r border-white/10">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:rotate-6">

                <Sparkles className="h-5 w-5 text-white" />

            </div>

            <div className="leading-tight">

                <p className="text-sm font-semibold tracking-wide text-white">
                    NextForge AI
                </p>

                <p className="text-xs text-white/50">
                    AI Workspace
                </p>

            </div>

        </div>
    );
}