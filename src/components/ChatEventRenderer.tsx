import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lightbulb, Database, FileEdit, Loader2 } from "lucide-react";
import { ChatEvent, ChatEventType } from "@/lib/types";

const formatThoughtContent = (content: string) => {
  const normalized = content.trim();

  // Expected format: "Thought for - 1785266405s"
  const match = normalized.match(/thought\s*for\s*-\s*(\d+)(?:s| seconds?)?$/i);
  if (match) {
    const seconds = match[1];
    return `Thought - ${seconds}s`;
  }

  // Keep compact thought style if possible
  const compact = normalized.replace(/thought\s*for\s*-\s*/i, "Thought - ");
  return compact;
};

export const ChatEventRenderer = ({
  event,
  isLoading,
  showSignature,
}: {
  event: ChatEvent;
  isLoading?: boolean;
  showSignature?: boolean;
}) => {
  switch (event.type) {
    case ChatEventType.THOUGHT:
      return (
        <div className="flex items-center gap-2 text-[#949494] text-[13px] font-normal mb-4">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Lightbulb className="w-4 h-4" />
          )}
          <span>{formatThoughtContent(event.content)}</span>
        </div>
      );

    case ChatEventType.TOOL_LOG:
      return (
        <CollapsibleEvent
          icon={<Database className="w-4 h-4" />}
          label="Read"
          event={event}
        />
      );

    case ChatEventType.FILE_EDIT:
      return (
        <CollapsibleEvent
          icon={
            isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <FileEdit className="w-4 h-4" />
            )
          }
          label={isLoading ? "Editing" : "Edited"}
          event={event}
          hideToggle
          forceSingleLine={isLoading} // Keep it simple while loading
        />
      );

    case ChatEventType.MESSAGE:
      return (
        <div className="prose prose-invert prose-sm max-w-none text-[#ececec] leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.content}
          </ReactMarkdown>

          {isLoading && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
          )}

          {!isLoading && showSignature && (
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs not-prose">
              <span className="text-zinc-400">
                ✨ Generated with{" "}
                <span className="font-semibold text-primary">NextForge AI</span>
              </span>

              <span className="text-zinc-500">
                Crafted with ❤️ by{" "}
                <span className="font-semibold text-white">
                  Mohd Yawar Raza
                </span>
              </span>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

const CollapsibleEvent = ({
  icon,
  label,
  event,
  hideToggle = false,
  forceSingleLine = false,
}: {
  icon: React.ReactNode;
  label: string;
  event: ChatEvent;
  hideToggle?: boolean;
  forceSingleLine?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse files
  const files =
    event.type === ChatEventType.FILE_EDIT
      ? ([event.filePath].filter(Boolean) as string[])
      : (event.metadata?.split(",") || []).filter(Boolean).map((f) => f.trim());

  if (files.length === 0) return null;

  const hasMultipleFiles = files.length > 1;
  const showButton = !hideToggle && hasMultipleFiles && !forceSingleLine;

  return (
    <div className="flex flex-col gap-2 my-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="text-[#949494] shrink-0">{icon}</div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#949494] text-[13px] font-medium shrink-0">
              {label}
            </span>

            {/* File Name Badge */}
            <span className="bg-[#262626] text-[#ececec] text-[12px] px-2 py-0.5 rounded-md font-mono border border-[#333] truncate">
              {files[0].split("/").pop()}
            </span>

            {/* +X more logic */}
            {!isExpanded && hasMultipleFiles && (
              <span className="text-[#949494] text-[11px] whitespace-nowrap">
                +{files.length - 1} more
              </span>
            )}
          </div>
        </div>

        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#949494] hover:text-[#ececec] text-[12px] font-medium bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333] transition-colors ml-4"
          >
            {isExpanded ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* List expansion logic */}
      {isExpanded && hasMultipleFiles && !forceSingleLine && (
        <div className="flex flex-col gap-2">
          {files.slice(1).map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <div className="text-[#949494] shrink-0 opacity-0">{icon}</div>{" "}
              {/* Invisible spacer icon */}
              <span className="text-[#949494] text-[13px] font-medium w-8 shrink-0">
                {label}
              </span>
              <span className="bg-[#262626] text-[#ececec] text-[12px] px-2 py-0.5 rounded-md font-mono border border-[#333] truncate">
                {file.split("/").pop()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
