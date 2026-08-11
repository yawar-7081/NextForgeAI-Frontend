import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectResponse } from "@/lib/types";
import { generateGradient } from "@/lib/utils";
import { Download, Edit, MoreVertical, Trash } from "lucide-react";

interface ProjectSectionProps {
  project: ProjectResponse | null;
  onRename: () => void;
  onDelete: () => void;
  onDownload: () => void;
  canDownload?: boolean;
}

export default function ProjectSection({
  project,
  onRename,
  onDelete,
  onDownload,
  canDownload = true,
}: ProjectSectionProps) {
  if (!project) {
    return (
      <div className="flex items-center gap-4 pl-6">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
        <div>
          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 pl-6">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,.25)]"
        style={generateGradient(project.name)}
      >
        <span className="text-sm font-bold text-white">
          {project.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="leading-tight">
        <p className="max-w-[220px] truncate text-sm font-semibold text-white">
          {project.name}
        </p>
        <p className="flex items-center gap-1 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          AI Generated Project
        </p>
      </div>

      <div className="ml-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-emerald-300">
          Synced • Just now
        </span>
      </div>

      {project.role !== "VIEWER" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-52 rounded-2xl border border-white/10 bg-[#08101f]/95 p-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,.45)]"
          >
            <DropdownMenuItem
              onClick={onRename}
              className="cursor-pointer rounded-xl py-2.5 transition-all hover:bg-white/5"
            >
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>

            {canDownload && (
              <DropdownMenuItem
                onClick={onDownload}
                className="cursor-pointer rounded-xl py-2.5 transition-all hover:bg-white/5"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer rounded-xl py-2.5 text-red-400 transition-all hover:bg-red-500/10 focus:text-red-400"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
