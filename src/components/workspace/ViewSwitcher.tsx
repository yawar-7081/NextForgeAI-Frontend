import { Code2, MonitorSmartphone } from "lucide-react";

interface ViewSwitcherProps {
    viewMode: "preview" | "code";
    setViewMode: (mode: "preview" | "code") => void;
}


export default function ViewSwitcher({
    viewMode,
    setViewMode,
}: ViewSwitcherProps) {

    return (
        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl shadow-inner">
            <button onClick={() => setViewMode("preview")} className={`group flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-300 ${viewMode === "preview" ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                <MonitorSmartphone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                <span>Preview</span>
            </button>
        <button onClick={() => setViewMode("code")} className={`group flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-300 ${viewMode === "code" ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
            <Code2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Code</span>
        </button>
        </div>  
    );

}