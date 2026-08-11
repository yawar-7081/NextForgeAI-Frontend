import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ChatPanel, ChatMessage } from "@/components/ChatPanel";
import { CodePanel } from "@/components/CodePanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  api,
  isAuthenticated,
  removeAuthToken,
  getUserInfo,
  removeUserInfo,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import {
  RuntimeErrorAlert,
  RuntimeError,
} from "@/components/RuntimeErrorAlert";
import { generateGradient, cn } from "@/lib/utils";
import { ProjectResponse, WorkspaceStatusResponse } from "@/lib/types";
import { ShareDialog } from "@/components/ShareDialog";

const BASE_URL = "http://localhost:8080/nextforgeai/api/v1";

import {
  Code,
  Sparkles,
  LogOut,
  RotateCcw,
  Maximize2,
  RefreshCw,
  MoreVertical,
  Trash,
  Download,
  Edit,
  ChevronDown,
} from "lucide-react";

type ViewMode = "code" | "preview";

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [updatedFiles, setUpdatedFiles] = useState<Map<string, string>>(
    new Map(),
  );
  const [refreshFiles, setRefreshFiles] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [workspaceStatus, setWorkspaceStatus] =
    useState<WorkspaceStatusResponse | null>(null);
  const isViewer = project?.role === "VIEWER";
  const canShowFileExplorer = workspaceStatus?.hasFileExplorer ?? false;
  const canShowPreview = workspaceStatus?.hasPreview ?? false;
  const canDownloadProject = workspaceStatus?.canDownload ?? false;
  const shouldShowWorkspace = canShowFileExplorer || canShowPreview;

  // Rename state
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameName, setRenameName] = useState("");

  // Track edited files for current streaming response
  const currentEditedFilesRef = useRef<string[]>([]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Load chat history on mount
  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      setIsLoadingHistory(true);
      try {
        const [history, projectData, workspaceData] = await Promise.all([
          api.getChatHistory(projectId),
          api.getProject(projectId),
          api.getWorkspaceStatus(projectId).catch(
            () =>
              ({
                initialized: false,
                hasFileExplorer: false,
                hasPreview: false,
                canDownload: false,
              }) as WorkspaceStatusResponse,
          ),
        ]);

        const formattedMessages: ChatMessage[] = history.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role === "USER" ? "user" : "assistant",
          content: msg.content,
          createdAt: msg.createdAt,
          events: msg.events,
        }));
        setMessages(formattedMessages);
        setProject(projectData);
        setWorkspaceStatus(workspaceData);
      } catch (error) {
        console.error("Failed to load project data:", error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadData();
  }, [projectId, toast]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      removeAuthToken();
      removeUserInfo();
      navigate("/login");
    }
  };

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!projectId || isViewer) return;

      // Reset edited files tracker
      currentEditedFilesRef.current = [];

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      // Create placeholder for AI response
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        isStreaming: true,
        editedFiles: [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      const cleanup = api.streamChat(
        projectId,
        content,
        (chunk) => {
          // Append chunk to streaming message (character by character)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk, isStreaming: true }
                : msg,
            ),
          );
        },
        (path, fileContent) => {
          // Update file content
          setUpdatedFiles((prev) => new Map(prev).set(path, fileContent));

          // Track edited file
          if (!currentEditedFilesRef.current.includes(path)) {
            currentEditedFilesRef.current.push(path);
          }

          // Update the message with edited files
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, editedFiles: [...currentEditedFilesRef.current] }
                : msg,
            ),
          );
        },
        () => {
          // Stream complete
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    isStreaming: false,
                    editedFiles: [...currentEditedFilesRef.current],
                  }
                : msg,
            ),
          );

          if (projectId) {
            api
              .getWorkspaceStatus(projectId)
              .then(setWorkspaceStatus)
              .catch(() => {
                setWorkspaceStatus({
                  initialized: false,
                  hasFileExplorer: false,
                  hasPreview: false,
                  canDownload: false,
                });
              });
          }

          setRefreshFiles((prev) => prev + 1);
          setIsStreaming(false);
        },
        (error) => {
          // Handle error
          toast({
            title: "Chat error",
            description: error.message,
            variant: "destructive",
          });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: "Sorry, an error occurred.",
                    isStreaming: false,
                  }
                : msg,
            ),
          );
          setIsStreaming(false);
        },
      );

      return cleanup;
    },
    [projectId, toast],
  );

  // Listen for runtime errors from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check: ensure message is from our expected source if possible
      // In local dev, origins might be localhost:5173 or localhost:8080

      const data = event.data;
      if (data?.type === "PreviewError") {
        const error = data.payload;
        console.log("Caught runtime error:", error);
        setRuntimeError({
          message: error.message,
          source: data.subType,
          stack: error.stack,
          filename: error.source, // Map filename from payload source
          lineno: error.lineno,
          colno: error.colno,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleFixError = useCallback(
    (error: RuntimeError) => {
      const prompt = `I encountered a ${error.source || "runtime error"} in my application:
    
Error Message: ${error.message}
${error.filename ? `File: ${error.filename}` : ""}
${error.lineno ? `Line: ${error.lineno}` : ""}

Stack Trace:
${error.stack || "No stack trace available"}

Please analyze this error and fix the code to resolve it.`;

      handleSendMessage(prompt);
      setRuntimeError(null);
    },
    [handleSendMessage],
  );

  const handleDeleteProject = async () => {
    if (!projectId) return;
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.deleteProject(projectId);
      navigate("/projects");
      toast({ title: "Success", description: "Project deleted successfully" });
    } catch (error) {
      console.error("Failed to delete:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleDownloadProject = async () => {
    if (!projectId || !canDownloadProject) return;
    try {
      const blob = await api.downloadProject(projectId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "Download started" });
    } catch (error) {
      console.error("Failed to download:", error);
      toast({
        title: "Error",
        description: "Failed to download project",
        variant: "destructive",
      });
    }
  };

  const openRenameDialog = () => {
    if (project) {
      setRenameName(project.name);
      setIsRenameDialogOpen(true);
    }
  };

  const handleRenameSubmit = async () => {
    if (!projectId || !renameName.trim()) return;

    try {
      const updated = await api.updateProject(projectId, renameName);
      setProject((prev) => (prev ? { ...prev, name: updated.name } : null));
      setIsRenameDialogOpen(false);
      toast({ title: "Success", description: "Project renamed successfully" });
    } catch (error) {
      console.error("Failed to rename:", error);
      toast({
        title: "Error",
        description: "Failed to rename project",
        variant: "destructive",
      });
    }
  };

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Invalid project ID</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <WorkspaceHeader
        project={project}
        projectId={projectId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRename={() => setIsRenameDialogOpen(true)}
        onDelete={handleDeleteProject}
        onDownload={handleDownloadProject}
        canDownload={canDownloadProject}
        onPublish={() => {}}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {shouldShowWorkspace ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full border-r border-border/50 bg-panel">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isStreaming={isStreaming}
                  isLoading={isLoadingHistory}
                  readOnly={isViewer}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border/50 hover:bg-primary/50 transition-colors" />

            <ResizablePanel defaultSize={65} minSize={50} maxSize={75}>
              <div className="h-full">
                <div className="h-full relative">
                  <div
                    className={cn(
                      "h-full absolute inset-0",
                      viewMode !== "code" && "hidden",
                    )}
                  >
                    {canShowFileExplorer ? (
                      <CodePanel
                        projectId={projectId}
                        updatedFiles={updatedFiles}
                        refreshSignal={refreshFiles}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#0f1117] px-6 text-center text-sm text-white/60">
                        <div className="max-w-sm rounded-2xl border border-white/10 bg-[#0b1220]/70 p-6">
                          <p className="text-lg font-semibold text-white">
                            Workspace preview
                          </p>
                          <p className="mt-2">
                            The file explorer is not available for this project
                            yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "h-full absolute inset-0",
                      viewMode !== "preview" && "hidden",
                    )}
                  >
                    {canShowPreview ? (
                      <PreviewPanel
                        projectId={projectId}
                        runtimeError={runtimeError}
                        onDismiss={() => setRuntimeError(null)}
                        onFix={handleFixError}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#0f1117] px-6 text-center text-sm text-white/60">
                        <div className="max-w-sm rounded-2xl border border-white/10 bg-[#0b1220]/70 p-6">
                          <p className="text-lg font-semibold text-white">
                            Preview unavailable
                          </p>
                          <p className="mt-2">
                            Preview is not enabled for this project yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full overflow-auto bg-background">
            <div className="mx-auto flex h-full w-full flex-col">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                isLoading={isLoadingHistory}
                readOnly={isViewer}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!renameName.trim() || renameName === project?.name}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
