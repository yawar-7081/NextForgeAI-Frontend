import { useState, useEffect, useCallback } from "react";
import { FileTree } from "./FileTree";
import { CodeEditor } from "./CodeEditor";
import { FileTabs } from "./FileTabs";
import { api, OPEN_TABS_KEY, ACTIVE_TAB_KEY } from "@/lib/api";
import { FileNode } from "@/lib/types";

interface CodePanelProps {
  projectId: string;
  updatedFiles: Map<string, string>;
  refreshSignal?: number;
}

// Helper to find a file by path in the tree
function findFileInTree(files: FileNode[], targetPath: string): boolean {
  for (const node of files) {
    if (node.path === targetPath) return true;
    if (node.children && findFileInTree(node.children, targetPath)) return true;
  }
  return false;
}

// Storage key helpers
const getTabsKey = (projectId: string) => `${OPEN_TABS_KEY}_${projectId}`;
const getActiveTabKey = (projectId: string) => `${ACTIVE_TAB_KEY}_${projectId}`;

export function CodePanel({
  projectId,
  updatedFiles,
  refreshSignal = 0,
}: CodePanelProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const loadFiles = useCallback(async () => {
    setIsLoadingTree(true);
    try {
      const fileTree = await api.getFiles(projectId);
      setFiles(fileTree);

      if (openTabs.length === 0) {
        const defaultPaths = ["src/pages/Index.tsx", "pages/Index.tsx"];
        for (const defaultPath of defaultPaths) {
          if (findFileInTree(fileTree, defaultPath)) {
            setOpenTabs([defaultPath]);
            setActiveTab(defaultPath);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setIsLoadingTree(false);
    }
  }, [projectId]);

  // Load tabs from localStorage
  useEffect(() => {
    const savedTabs = localStorage.getItem(getTabsKey(projectId));
    const savedActiveTab = localStorage.getItem(getActiveTabKey(projectId));

    if (savedTabs) {
      try {
        const tabs = JSON.parse(savedTabs);
        if (Array.isArray(tabs) && tabs.length > 0) {
          setOpenTabs(tabs);
          setActiveTab(savedActiveTab || tabs[0]);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved tabs:", e);
      }
    }
  }, [projectId]);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    if (openTabs.length > 0) {
      localStorage.setItem(getTabsKey(projectId), JSON.stringify(openTabs));
    } else {
      localStorage.removeItem(getTabsKey(projectId));
    }
  }, [openTabs, projectId]);

  // Save active tab to localStorage
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem(getActiveTabKey(projectId), activeTab);
    } else {
      localStorage.removeItem(getActiveTabKey(projectId));
    }
  }, [activeTab, projectId]);

  // Load file tree only when the project opens or after a stream-complete refresh signal
  useEffect(() => {
    loadFiles();
  }, [projectId, refreshSignal, loadFiles]);

  // Load file content when active tab changes
  useEffect(() => {
    if (!activeTab) {
      setFileContent("");
      return;
    }

    // Check if we have an updated version from streaming
    if (updatedFiles.has(activeTab)) {
      setFileContent(updatedFiles.get(activeTab)!);
      return;
    }

    const loadContent = async () => {
      setIsLoadingFile(true);
      try {
        const content = await api.getFileContent(projectId, activeTab);
        setFileContent(content);
      } catch (error) {
        console.error("Failed to load file:", error);
        setFileContent("// Error loading file");
      } finally {
        setIsLoadingFile(false);
      }
    };

    loadContent();
  }, [projectId, activeTab, updatedFiles]);

  // Update content when streaming updates arrive for active file
  useEffect(() => {
    if (activeTab && updatedFiles.has(activeTab)) {
      setFileContent(updatedFiles.get(activeTab)!);
    }
  }, [activeTab, updatedFiles]);

  const handleSelectFile = useCallback(
    (path: string) => {
      // Add to tabs if not already open
      if (!openTabs.includes(path)) {
        setOpenTabs((prev) => [...prev, path]);
      }
      setActiveTab(path);
    },
    [openTabs],
  );

  const handleCloseTab = useCallback(
    (path: string) => {
      setOpenTabs((prev) => {
        const newTabs = prev.filter((t) => t !== path);

        // If closing active tab, switch to another tab
        if (activeTab === path) {
          const closingIndex = prev.indexOf(path);
          const newActiveIndex = Math.min(closingIndex, newTabs.length - 1);
          setActiveTab(newTabs[newActiveIndex] || null);
        }

        return newTabs;
      });
    },
    [activeTab],
  );

  const handleSelectTab = useCallback((path: string) => {
    setActiveTab(path);
  }, []);

  return (
    <div className="flex h-full">
      {/* File Tree */}
      <div className="w-72 shrink-0 border-r border-border/10 overflow-y-auto bg-[#0b1220]">
        <div className="border-b border-white/10 bg-[#0d1322] px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Explorer
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/20">
              📦
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Project Files
              </h3>

              <p className="text-xs text-white/45">Source Code</p>
            </div>
          </div>
        </div>
        <FileTree
          files={files}
          selectedPath={activeTab}
          onSelectFile={handleSelectFile}
          isLoading={isLoadingTree}
        />
      </div>

      {/* Code Editor with Tabs */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#0f1117]">
        {/* File Tabs */}
        <FileTabs
          openTabs={openTabs}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
        />

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            content={fileContent}
            filePath={activeTab}
            isLoading={isLoadingFile}
          />
        </div>
      </div>
    </div>
  );
}
