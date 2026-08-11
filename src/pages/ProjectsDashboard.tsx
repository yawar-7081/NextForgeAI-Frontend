import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  Search,
  Folder,
  Loader2,
  MoreVertical,
  Trash,
  Download,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api, removeAuthToken, removeUserInfo, getUserInfo } from "@/lib/api";
import { ProjectSummaryResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "http://localhost:8080/nextforgeai/api/v1";
import { generateGradient, cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProjectsDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Rename state
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] =
    useState<ProjectSummaryResponse | null>(null);
  const [renameName, setRenameName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
     if (newProjectName.trim().length < 5) {
      toast({
        title: "Invalid project name",
        description: "Project name must be at least 5 characters long.",
        variant: "destructive",
      });

      return;
    }
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const newProject = await api.createProject(newProjectName);
      setProjects([newProject, ...projects]);
      setNewProjectName("");
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      // Optionally navigate to the new project immediately
      // navigate(`/projects/${newProject.id}`);
    } catch (error) {
      toast({
        title: "Unable to create project",
        description:
          error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (
    e: React.MouseEvent,
    projectId: string,
  ) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId.toString()));
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

  const handleDownloadProject = async (
    e: React.MouseEvent,
    projectId: string,
  ) => {
    e.stopPropagation();
    try {
      const blob = await api.downloadProject(projectId.toString());
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

  const handleRenameClick = (
    e: React.MouseEvent,
    project: ProjectSummaryResponse,
  ) => {
    e.stopPropagation();
    setProjectToRename(project);
    setRenameName(project.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (renameName.trim().length < 5) {
      toast({
        title: "Invalid project name",
        description: "Project name must be at least 5 characters long.",
        variant: "destructive",
      });

      return;
    }
    if (!projectToRename || !renameName.trim()) return;

    try {
      await api.updateProject(projectToRename.id.toString(), renameName);
      setProjects(
        projects.map((p) =>
          p.id === projectToRename.id ? { ...p, name: renameName } : p,
        ),
      );
      setIsRenameDialogOpen(false);
      setProjectToRename(null);
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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 h-full w-80 bg-cyan-500/5 blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-80 bg-violet-500/5 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <div className="relative mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/30">
                ✨
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">NextForge AI</h2>

                <p className="text-xs text-white/45">AI Software Engineer</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {(() => {
                        const userInfo = getUserInfo();
                        if (userInfo?.name) {
                          return userInfo.name.charAt(0).toUpperCase();
                        }
                        return "U";
                      })()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {getUserInfo()?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getUserInfo()?.username || ""}
                  </p>
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-8 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              ✨ AI Software Engineer
            </div>

            <h1 className="mt-5 text-6xl font-bold leading-[1.05] tracking-tight text-white">
              Build AI
              <br />
              Applications
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
              Create production-ready React and Spring Boot applications powered
              by AI in minutes.
            </p>
          </div>

          <div className="max-w-3xl">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-8 text-base font-semibold shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-500/50">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Give your project a name to get started. You can change this
                    later.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="My Awesome Project"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateProject()
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={isCreating || !newProjectName.trim()}
                  >
                    {isCreating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Rename Dialog */}
            <Dialog
              open={isRenameDialogOpen}
              onOpenChange={setIsRenameDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Project</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    value={renameName}
                    onChange={(e) => setRenameName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && renameName.trim().length >= 5) {
                        handleRenameSubmit();
                      }
                    }}
                  />

                  {renameName.trim().length > 0 &&
                    renameName.trim().length < 5 && (
                      <p className="mt-2 text-sm text-red-500">
                        Project name must be at least 5 characters long.
                      </p>
                    )}
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
                    disabled={
                      renameName.trim().length < 5 ||
                      renameName.trim() === projectToRename?.name
                    }
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        {/* Projects Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Recent Projects
            </h2>

            <p className="mt-1 text-sm text-white/45">
              {filteredProjects.length} Projects
            </p>
          </div>

          <div className="relative w-[380px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 focus-visible:ring-cyan-500/30"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try a different search query"
                : "Create your first project to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_25px_80px_rgba(34,211,238,.18)]"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader className="relative p-0">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div>
                        <div
                          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                          style={generateGradient(project.name)}
                        />
                        <div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#08101f] via-transparent to-transparent" />

                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_45%)]" />
                        </div>

                        <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl font-bold text-white backdrop-blur-xl">
                          ✨
                        </div>
                        <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl font-bold text-white backdrop-blur-xl">
                          ✨
                        </div>

                        <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/15 px-3 py-1 text-[11px] font-medium text-cyan-300">
                            React
                          </span>

                          <span className="rounded-full border border-violet-500/20 bg-violet-500/15 px-3 py-1 text-[11px] font-medium text-violet-300">
                            Spring Boot
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">
                        {project.name}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleRenameClick(e, project)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDownloadProject(e, project.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={(e) => handleDeleteProject(e, project.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {project.role && (
                    <div className="flex">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                          project.role === "OWNER"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : project.role === "EDITOR"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {project.role}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-white/45">
                  <span>
                    <div className="flex items-center gap-2 text-white/45">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                      <span>
                        Updated{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </span>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Active
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
