import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/ShareDialog";
import { Crown, Rocket, Share2 } from "lucide-react";

interface WorkspaceActionsProps {
  projectId: string;
  onPublish: () => void;
}

export default function WorkspaceActions({
  projectId,
  onPublish,
}: WorkspaceActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <ShareDialog
        projectId={projectId}
        trigger={
          <Button
            variant="ghost"
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        }
      />
      <Button
        variant="ghost"
        className="h-10 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 text-amber-300 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
      >
        <Crown className="mr-2 h-4 w-4" />
        Pro
      </Button>
      <Button
        onClick={onPublish}
        className="h-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-5 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-cyan-500/50"
      >
        <Rocket className="mr-2 h-4 w-4" />
        Publish
      </Button>
    </div>
  );
}
