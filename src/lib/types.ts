export interface LoginCredentials {
  email: string;
  password: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

export interface DeployResponse {
  previewUrl: string;
}

export interface ChatHistoryMessage {
  id: number;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export enum ChatEventType {
  THOUGHT = "THOUGHT",
  MESSAGE = "MESSAGE",
  FILE_EDIT = "FILE_EDIT",
  TOOL_LOG = "TOOL_LOG",
}

export interface ChatEvent {
  id?: number;
  type: ChatEventType;
  content: string; // Markdown, Code, or Tool Summary
  metadata?: string; // Tool args (e.g. "src/App.tsx")
  filePath?: string; // For FILE_EDIT
  sequenceOrder?: number;
}

export interface ChatMessage {
  id: number;
  role: "USER" | "ASSISTANT";
  content?: string; // Fallback raw text
  events: ChatEvent[]; // The granular events
  createdAt?: string;
}

export interface ProjectSummaryResponse {
  id: string;
  name: string;
  projectMemberRole?: ProjectRole;
  role?: ProjectRole;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  role?: ProjectRole;
  public?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkspaceStatusResponse {
  initialized: boolean;
  hasFileExplorer: boolean;
  hasPreview: boolean;
  canDownload: boolean;
}

export interface ProjectRequest {
  projectName: string;
}

export type ProjectRole = "OWNER" | "EDITOR" | "VIEWER";

export interface ProjectMember {
  userId: string;
  username: string;
  email?: string;
  name?: string;
  role: ProjectRole;
}

export interface InviteMemberRequest {
  username: string;
  role: ProjectRole;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  userId: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string | null;
  token?: string;
  userId: string;
  name: string;
  username: string;
  email: string;
}
