import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { FileCode, Loader2 } from "lucide-react";
import { githubDark } from "@uiw/codemirror-theme-github";

interface CodeEditorProps {
  content: string;
  filePath: string | null;
  isLoading?: boolean;
  onCodeChange?: (newCode: string) => void;
}

export function CodeEditor({
  content,
  filePath,
  isLoading,
  onCodeChange,
}: CodeEditorProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#0f1117]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />

        <p className="mt-5 text-sm text-white/50">Loading file...</p>
      </div>
    );
  }

  if (!filePath) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#0f1117]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 shadow-xl">
          <FileCode className="h-10 w-10 text-white" />
        </div>

        <h2 className="mt-8 text-xl font-semibold text-white">Select a file</h2>

        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-white/50">
          Select a file from the explorer to view its source code.
        </p>
      </div>
    );
  }

  // Auto-detect language extension
  const getLanguage = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return [javascript({ jsx: true, typescript: true })];
      case "json":
        return [json()];
      case "css":
      case "scss":
        return [css()];
      case "html":
      case "svg":
        return [javascript({ jsx: true })];
      default:
        return [];
    }
  };

  return (
    <div className="h-full w-full overflow-hidden border-l">
      <CodeMirror
        value={content}
        height="100%"
        theme={githubDark}
        editable={false}
        extensions={getLanguage(filePath)}
        onChange={(value) => onCodeChange?.(value)}
        basicSetup={{
          highlightActiveLine: true,

          highlightActiveLineGutter: true,

          lineNumbers: true,

          foldGutter: true,

          indentOnInput: true,

          bracketMatching: true,

          closeBrackets: true,

          autocompletion: false,

          searchKeymap: true,
        }}
        className="h-full text-[14px]"
      />
    </div>
  );
}
