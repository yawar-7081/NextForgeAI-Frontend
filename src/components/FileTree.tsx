import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  Image,
} from "lucide-react";
import { FileNode } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  files: FileNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  isLoading?: boolean;
}

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return FileCode;
    case "json":
      return FileJson;
    case "md":
    case "txt":
      return FileText;
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "gif":
      return Image;
    default:
      return File;
  }
};

const getFileColor = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
      return "text-blue-400";
    case "js":
    case "jsx":
      return "text-yellow-400";
    case "json":
      return "text-amber-400";
    case "css":
    case "scss":
      return "text-pink-400";
    case "html":
      return "text-orange-400";
    case "md":
      return "text-gray-400";
    default:
      return "text-muted-foreground";
  }
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

function FileTreeItem({
  node,
  depth,
  selectedPath,
  onSelectFile,
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  const isDirectory = node.type === "directory";
  const isSelected = selectedPath === node.path;
  const FileIcon = isDirectory
    ? isExpanded
      ? FolderOpen
      : Folder
    : getFileIcon(node.name);
  const fileColor = isDirectory ? "text-amber-400" : getFileColor(node.name);

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group mx-2 my-0.5 flex h-9 cursor-pointer items-center rounded-lg px-2 text-sm transition-all duration-200",
          isSelected
            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-sm ring-1 ring-cyan-500/20"
            : "text-white/65 hover:bg-white/5 hover:text-white",
        )}
        style={{ paddingLeft: `${depth * 16 + 10}px` }}
        onClick={handleClick}
      >
        {isDirectory ? (
          isExpanded ? (
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-200",
                isExpanded && "rotate-90",
              )}
            />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 rotate-90 text-white/40 transition-transform duration-200" />
          )
        ) : (
          <span className="w-4" />
        )}
        <FileIcon className={cn("mr-2 h-4 w-4 shrink-0", fileColor)} />
        <span className="truncate text-[13px] font-medium">{node.name}</span>
      </div>

      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  files,
  selectedPath,
  onSelectFile,
  isLoading,
}: FileTreeProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2 animate-pulse rounded-lg bg-white/5">
            <div className="w-4 h-4 bg-muted rounded" />
            <div
              className="h-4 bg-muted rounded flex-1"
              style={{ width: `${50 + i * 10}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No files yet
      </div>
    );
  }

  return (
    <div className="py-2">
      {files.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
