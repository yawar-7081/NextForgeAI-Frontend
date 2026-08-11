import {
  ChatMessage,
  DeployResponse,
  FileNode,
  LoginCredentials,
  ProjectSummaryResponse,
  ProjectRequest,
  ProjectResponse,
  ProjectMember,
  ProjectRole,
  SignupRequest,
  RegisterResponse,
  AuthResponse,
  WorkspaceStatusResponse,
} from "./types";

// const BASE_URL = "http://localhost:8080/nextforgeai/api/v1";
const BASE_URL = "https://nextforge-ai-backend.onrender.com/nextforgeai/api/v1";

export const getAuthToken = () => localStorage.getItem("auth_token");

export const setAuthToken = (token: string) =>
  localStorage.setItem("auth_token", token);

export const setRefreshToken = (_token: string) => {
  // Refresh token is stored by the backend in an HttpOnly cookie.
  // No client-side storage is needed here.
};

export const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
  document.cookie = "refreshToken=; Max-Age=0; path=/; SameSite=Lax";
};

export const isAuthenticated = () => !!getAuthToken();

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      removeAuthToken();
      removeUserInfo();
      return false;
    }

    const data: AuthResponse = await response.json();

    if (!data.accessToken) {
      removeAuthToken();
      removeUserInfo();
      return false;
    }

    setAuthToken(data.accessToken);

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);

    removeAuthToken();
    removeUserInfo();

    return false;
  }
};

const fetchWithAuth = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  retry = true,
): Promise<Response> => {
  const headers = new Headers(init.headers || {});
  const token = getAuthToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const retryHeaders = new Headers(init.headers || {});
      const newToken = getAuthToken();

      if (newToken) {
        retryHeaders.set("Authorization", `Bearer ${newToken}`);
      }

      return fetchWithAuth(input, { ...init, headers: retryHeaders }, false);
    }
  }

  return response;
};

// User info storage
export const setUserInfo = (user: {
  id: number;
  username: string;
  name: string;
}) => {
  localStorage.setItem("user_info", JSON.stringify(user));
};

export const getUserInfo = (): {
  id: number;
  username: string;
  name: string;
} | null => {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeUserInfo = () => localStorage.removeItem("user_info");

// LocalStorage keys
export const PREVIEW_URL_KEY = "preview_url";
export const OPEN_TABS_KEY = "open_tabs";
export const ACTIVE_TAB_KEY = "active_tab";

// API response format for files endpoint
interface FilesApiResponse {
  files?: { path: string }[];
  paths?: { path: string }[];
}

interface FileUpdate {
  path: string;
  content: string;
}

const FILE_UPDATE_REGEX = /<file\s+path=["']([^"']+)["']>([\s\S]*?)<\/file>/gi;

export function extractFileUpdates(text: string): FileUpdate[] {
  const updates: FileUpdate[] = [];
  const streamText = text ?? "";
  let match: RegExpExecArray | null;

  FILE_UPDATE_REGEX.lastIndex = 0;

  while ((match = FILE_UPDATE_REGEX.exec(streamText)) !== null) {
    const path = match[1];
    const content = match[2].replace(/^\r?\n/, "").replace(/\r?\n$/, "");

    updates.push({ path, content });
  }

  return updates;
}

// Convert flat file paths to nested tree structure
function buildFileTree(paths: { path: string }[]): FileNode[] {
  const root: FileNode[] = [];
  const nodeMap = new Map<string, FileNode>();

  // Sort paths to ensure directories come before their children
  const sortedPaths = [...paths].sort((a, b) => a.path.localeCompare(b.path));

  for (const { path } of sortedPaths) {
    const parts = path.split("/");
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Skip if node already exists
      if (nodeMap.has(currentPath)) continue;

      const isFile = i === parts.length - 1;
      const node: FileNode = {
        name: part,
        path: currentPath,
        type: isFile ? "file" : "directory",
        children: isFile ? undefined : [],
      };

      nodeMap.set(currentPath, node);

      if (parentPath) {
        const parent = nodeMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      } else {
        root.push(node);
      }
    }
  }

  // Sort each level: directories first, then alphabetically
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children) sortNodes(node.children);
    });
  };

  sortNodes(root);
  return root;
}

export const api = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    const data: AuthResponse = await response.json();
    return data;
  },

  async logout(): Promise<void> {
    const response = await fetchWithAuth(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  async signup(data: SignupRequest): Promise<RegisterResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Signup failed");
    }

    return response.json();
  },

  loginWithGoogle() {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  },

  async verifyOtp(
    userId: string,
    otpData: { otp: string },
  ): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(otpData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "OTP verification failed");
    }

    const data: AuthResponse = await response.json();
    return data;
  },

  async forgotPassword(data: { email: string }): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Forgot password request failed");
    }
  },

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Reset password failed");
    }
  },

  async getFiles(projectId: string): Promise<FileNode[]> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-file/${projectId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }

    const data: FilesApiResponse = await response.json();
    const fileEntries = data.files ?? data.paths;
    if (!fileEntries || !Array.isArray(fileEntries)) {
      throw new Error("Invalid files response format");
    }
    return buildFileTree(fileEntries);
  },

  async getFileContent(projectId: string, path: string): Promise<string> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-file/${projectId}/content?path=${path}`,
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Error fetching file: ${response.status} ${response.statusText}`,
      );
      throw new Error("Failed to fetch file content");
    }

    return data.content;
  },

  async deploy(projectId: string): Promise<DeployResponse> {
    const response = await fetchWithAuth(
      `${BASE_URL}/projects/${projectId}/deploy`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Deployment failed");
    }

    return response.json();
  },

  async getProjects(): Promise<ProjectSummaryResponse[]> {
    const response = await fetchWithAuth(`${BASE_URL}/project`);

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return response.json();
  },

  async createProject(name: string): Promise<ProjectSummaryResponse> {
    const response = await fetchWithAuth(`${BASE_URL}/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName: name }),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to create project");
    }

    return response.json();
  },

  async getProject(id: string): Promise<ProjectResponse> {
    const response = await fetchWithAuth(`${BASE_URL}/project/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }

    return response.json();
  },

  async getWorkspaceStatus(
    projectId: string,
  ): Promise<WorkspaceStatusResponse> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project/${projectId}/workspace-status`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch workspace status");
    }

    return response.json();
  },

  async updateProject(id: string, name: string): Promise<ProjectResponse> {
    const response = await fetchWithAuth(`${BASE_URL}/project/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName: name }),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    return response.json();
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetchWithAuth(`${BASE_URL}/project/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
  },

  async downloadProject(id: string): Promise<Blob> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-file/${id}/download`,
    );

    if (!response.ok) {
      throw new Error("Failed to download project");
    }

    return response.blob();
  },

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-member/${projectId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch project members");
    }

    const members = await response.json();
    return members.map((member: any) => ({
      userId: member.id,
      username: member.username,
      name: member.name,
      email: member.email,
      role: member.projectMemberRole as ProjectRole,
    }));
  },

  async inviteMember(
    projectId: string,
    username: string,
    role: ProjectRole,
  ): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-member/addMember/${projectId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to invite member");
    }
  },

  async updateMemberRole(
    projectId: string,
    userId: number,
    role: ProjectRole,
  ): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-member/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectMemberId: userId.toString(), role }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update member role");
    }
  },

  async removeMember(projectId: string, userId: number): Promise<void> {
    const response = await fetchWithAuth(
      `${BASE_URL}/project-member/${projectId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectMemberId: userId.toString() }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to remove member");
    }
  },

  async getChatHistory(projectId: string): Promise<ChatMessage[]> {
    const response = await fetchWithAuth(`${BASE_URL}/chat/${projectId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch chat history");
    }

    return response.json();
  },

  async streamChat(
    projectId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onFile: (path: string, content: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
  ) {
    const controller = new AbortController();

    fetchWithAuth(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, projectId }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok){
         const error = await response.json();
          throw new Error(error.message || "Chat stream failed");
        }
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();

        // Buffers
        let sseBuffer = "";
        let fullContentBuffer = "";
        let lastProcessedIndex = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          sseBuffer += chunk;

          const lines = sseBuffer.split("\n");
          sseBuffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;

            const dataStr = trimmedLine.slice(5).trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.text ?? "";

              onChunk(content);

              fullContentBuffer += content;
              const newText = fullContentBuffer.slice(lastProcessedIndex);
              const fileUpdates = extractFileUpdates(newText);

              fileUpdates.forEach(({ path, content: fileContent }) => {
                onFile(path, fileContent);
              });

              lastProcessedIndex = fullContentBuffer.length;
            } catch (e) {
              console.error("Failed to parse SSE JSON:", e);
            }
          }
        }

        onComplete();
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Stream error:", error);
          onError(error);
        }
      });

    return () => controller.abort();
  },
};
