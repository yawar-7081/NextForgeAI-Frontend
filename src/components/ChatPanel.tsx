import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  MoreHorizontal,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useStreamParser } from "../hooks/use-stream-parser";
import { ChatEventRenderer } from "./ChatEventRenderer";
import { ChatEvent } from "@/lib/types";
import { Check } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  createdAt?: string;
  events?: ChatEvent[]; // Structured events from the database
  editedFiles?: string[];
}

const SUGGESTIONS = [
  {
    title: "Todo Application",
    description: "CRUD • Authentication",
    icon: "✅",
    prompt:
      "Build a modern Todo application using React, Spring Boot, PostgreSQL and JWT authentication.",
  },
  {
    title: "Weather App",
    description: "API • Dashboard",
    icon: "🌤️",
    prompt:
      "Build a responsive weather application using React with a Spring Boot backend and weather API integration.",
  },
  {
    title: "Notes App",
    description: "Folders • Search",
    icon: "📝",
    prompt:
      "Build a notes application with folders, search functionality and JWT authentication using React and Spring Boot.",
  },
  {
    title: "URL Shortener",
    description: "Analytics • REST API",
    icon: "🔗",
    prompt:
      "Build a URL shortener application using Spring Boot, PostgreSQL and a React frontend with click analytics.",
  },
];
interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  isLoading?: boolean;
  readOnly?: boolean;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isStreaming,
  isLoading,
  readOnly,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly || !input.trim() || isStreaming) return;

    onSendMessage(input.trim());
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) {
      e.preventDefault();
      return;
    }

    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          // <div className="flex h-full flex-col px-6 py-6">
          //   <div>
          //     <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
          //       ✨ AI Software Engineer
          //     </div>

          //     <h2 className="mt-4 text-2xl font-bold text-white">
          //       Ready to build your next application
          //     </h2>

          //     <p className="mt-2 text-sm text-white/50">
          //       Generate complete full-stack applications with modern
          //       architecture.
          //     </p>
          //   </div>

          //   {readOnly ? (
          //     <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          //       You can view this project, but chat access is restricted for
          //       viewer accounts.
          //     </div>
          //   ) : (
          //     <div className="mt-8 ">
          //       <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          //         Quick Start
          //       </p>

          //       <div className="space-y-3">
          //         {SUGGESTIONS.map((item) => (
          //           <button
          //             key={item.title}
          //             onClick={() => setInput(item.prompt)}
          //             className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10"
          //           >
          //             <div className="flex items-center gap-4">
          //               <div className="text-2xl">{item.icon}</div>

          //               <div className="text-left">
          //                 <h3 className="font-medium text-white">
          //                   {item.title}
          //                 </h3>

          //                 <p className="text-xs text-white/50">
          //                   {item.description}
          //                 </p>
          //               </div>
          //             </div>

          //             <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-cyan-400">
          //               →
          //             </span>
          //           </button>
          //         ))}
          //       </div>
          //     </div>
          //   )}
          // </div>

          <div className="flex h-full justify-center overflow-y-auto pt-16">
            <div className="w-full max-w-4xl px-6 py-2">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
                  ✨ AI Software Engineer
                </div>

                <h2 className="mt-6 text-5xl font-bold text-white">
                  Ready to build your next application
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/55">
                  Generate complete full-stack applications with modern
                  architecture.
                </p>
              </div>

              {readOnly ? (
                <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/70">
                  You can view this project, but chat access is restricted for
                  viewer accounts.
                </div>
              ) : (
                <div className="mx-auto mt-14 max-w-2xl">
                  <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                    Quick Start
                  </p>

                  <div className="space-y-3">
                    {SUGGESTIONS.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => setInput(item.prompt)}
                        className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{item.icon}</div>

                          <div className="text-left">
                            <h3 className="font-medium text-white">
                              {item.title}
                            </h3>

                            <p className="text-xs text-white/50">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isStreaming={isStreaming && message.isStreaming}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0  bg-background">
        <div className="mx-auto w-full max-w-4xl p-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl p-3"
          >
            <Textarea
              ref={textareaRef}
              value={readOnly ? "" : input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                readOnly
                  ? "You have view-only access..."
                  : "Describe the application you want to build..."
              }
              disabled={isStreaming || readOnly}
              rows={1}
              className="min-h-[70px] max-h-[180px] resize-none border-0 bg-transparent px-1 text-white placeholder:text-white/40 shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-transparent"
            />

            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                  ⚛️ React
                </span>

                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                  🤖 AI Generated
                </span>
              </div>

              <Button
                type="submit"
                disabled={!input.trim() || isStreaming || readOnly}
                className="rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 shadow-lg shadow-cyan-500/20"
                onClick={() => {
                  if (readOnly) {
                    window.alert(
                      "Access denied. Viewer accounts cannot chat with the AI.",
                    );
                  }
                }}
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Generate
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Inner Component to handle logic per message
function MessageItem({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming: boolean;
}) {
  // Use the stream parser to turn raw XML text into Event objects live
  // 1. Parse content live if we are streaming OR if we don't have DB events yet
  const liveEvents = useStreamParser(message.content || "");

  // 2. Logic: If we have DB events, use them. Otherwise, use the parsed content.
  const eventsToRender =
    message.events && message.events.length > 0 ? message.events : liveEvents;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = eventsToRender
      .filter((event) => event.type === "MESSAGE" || event.type === "FILE")
      .map((event) => event.content)
      .join("\n\n");

    if (!text.trim()) return;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`p-5 bg-background `}>
      <div className="max-w-4xl mx-auto">
        {message.role === "user" ? (
          <div className="flex flex-col items-end gap-2">
            <div className="bg-primary/10 text-primary-foreground text-sm py-2.5 px-4 rounded-2xl rounded-tr-none border border-primary/20 max-w-[85%]">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
            {message.createdAt && (
              <span className="text-[10px] text-muted-foreground px-1 uppercase tracking-tight">
                {format(new Date(message.createdAt), "HH:mm")}
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Render granular events (Thought, Tool, Message, File) */}
            <div className="flex flex-col gap-3">
              {eventsToRender.map((event, idx) => {
                const isLast = idx === eventsToRender.length - 1;
                const lastMessageIndex = eventsToRender.reduce(
                  (lastIndex, event, index) => {
                    if (event.type === "MESSAGE") {
                      return index;
                    }
                    return lastIndex;
                  },
                  -1,
                );
                return (
                  // <ChatEventRenderer
                  //   key={idx}
                  //   event={event}
                  //   // It is "loading" only if:
                  //   // 1. The message is currently streaming
                  //   // 2. AND this is the last event in the list
                  //   isLoading={isStreaming && isLast}
                  // />
                  <ChatEventRenderer
                    key={idx}
                    event={event}
                    isLoading={isStreaming && isLast}
                    showSignature={
                      idx === lastMessageIndex && event.type === "MESSAGE"
                    }
                  />
                );
              })}
            </div>

            {/* Action buttons for assistant message */}
            {!message.isStreaming && eventsToRender.length > 0 && (
              <div className="flex items-center gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
