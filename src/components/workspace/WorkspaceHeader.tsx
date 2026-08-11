import BrandSection from "./BrandSection";
import ProjectSection from "./ProjectSection";
import ViewSwitcher from "./ViewSwitcher";
import WorkspaceActions from "./WorkspaceActions";
import UserDropdown from "./UserDropdown";

import { Button } from "@/components/ui/button";
import { Crown, Rocket, Share2 } from "lucide-react";
import { ProjectResponse } from "@/lib/types";

interface WorkspaceHeaderProps {
  project: ProjectResponse | null;
  projectId: string;
  viewMode: "preview" | "code";
  setViewMode: (mode: "preview" | "code") => void;
  onRename: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPublish: () => void;
  onLogout: () => void;
  canDownload?: boolean;
}

export default function WorkspaceHeader({
  project,
  projectId,
  viewMode,
  setViewMode,
  onRename,
  onDelete,
  onDownload,
  onPublish,
  onLogout,
  canDownload = true,
}: WorkspaceHeaderProps) {
  return (
    <header className="relative sticky top-0 z-50 h-16 border-b border-white/10 bg-[#08101f]/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,.25)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-80 bg-cyan-500/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-80 bg-violet-500/5 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-[1800px] items-center justify-between px-6">
        {/* Left */}

        <div className="flex min-w-0 items-center gap-6">
          <BrandSection />
          <ProjectSection
            project={project}
            onRename={onRename}
            onDelete={onDelete}
            onDownload={onDownload}
            canDownload={canDownload}
          />
        </div>

        {/* Center */}
        <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />

        {/* Right */}

        <div className="flex items-center gap-3">
          <WorkspaceActions projectId={projectId} onPublish={onPublish} />
          <UserDropdown onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
