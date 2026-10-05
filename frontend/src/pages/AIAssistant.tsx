import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../services/api";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

const suggestions = [
    "Analyze my infrastructure",
    "Show active incidents",
    "What are the current risks?",
    "Explain recent alerts",
];

export default function AIAssistant() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content:
                "Hello Bilal. I'm OpsMind AI. I can help analyze your infrastructure, monitoring data, alerts, and operational problems.",
        },
    ]);

    async function handleSend() {
        const message = input.trim();

        if (!message) {
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: message,
        };

        setMessages((current) => [...current, userMessage]);
        setInput("");

        try {
            const response = await api.post<{ response: string }>(
                "/api/ai/chat",
                { message },
            );

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: response.data.response,
            };

            setMessages((current) => [...current, assistantMessage]);
        } catch (error) {
            console.error("Failed to send AI message:", error);

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        "I couldn't connect to the OpsMind AI service. Please check that the backend is running.",
                },
            ]);
        }
    }

    function handleSuggestion(suggestion: string) {
        setInput(suggestion);
    }

    return (
        <div className="flex min-h-[calc(100vh-7rem)] flex-col">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                        <Sparkles className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            OpsMind AI Assistant
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Analyze infrastructure, monitoring, alerts, and
                            operational problems.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                                    <Bot className="h-4 w-4 text-cyan-400" />
                                </div>
                            )}

                            <div
                                className={`max-w-2xl rounded-xl px-4 py-3 text-sm ${
                                    message.role === "user"
                                        ? "bg-cyan-500/10 leading-6 text-cyan-100"
                                        : "bg-slate-800 text-slate-300"
                                }`}
                            >
                                {message.role === "assistant" ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => (
                                                <h1 className="mb-3 text-lg font-semibold text-white">
                                                    {children}
                                                </h1>
                                            ),

                                            h2: ({ children }) => (
                                                <h2 className="mb-3 mt-5 text-base font-semibold text-white">
                                                    {children}
                                                </h2>
                                            ),

                                            h3: ({ children }) => (
                                                <h3 className="mb-2 mt-4 text-sm font-semibold text-cyan-300">
                                                    {children}
                                                </h3>
                                            ),

                                            p: ({ children }) => (
                                                <p className="mb-3 leading-6 text-slate-300 last:mb-0">
                                                    {children}
                                                </p>
                                            ),

                                            ul: ({ children }) => (
                                                <ul className="mb-3 list-disc space-y-1.5 pl-5 text-slate-300">
                                                    {children}
                                                </ul>
                                            ),

                                            ol: ({ children }) => (
                                                <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-slate-300">
                                                    {children}
                                                </ol>
                                            ),

                                            li: ({ children }) => (
                                                <li className="leading-6">
                                                    {children}
                                                </li>
                                            ),

                                            strong: ({ children }) => (
                                                <strong className="font-semibold text-white">
                                                    {children}
                                                </strong>
                                            ),

                                            code: ({ children }) => (
                                                <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-cyan-300">
                                                    {children}
                                                </code>
                                            ),

                                            blockquote: ({ children }) => (
                                                <blockquote className="my-3 border-l-2 border-cyan-500/40 pl-4 text-slate-400">
                                                    {children}
                                                </blockquote>
                                            ),

                                            hr: () => (
                                                <hr className="my-4 border-slate-700" />
                                            ),
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                ) : (
                                    message.content
                                )}
                            </div>

                            {message.role === "user" && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                                    <User className="h-4 w-4 text-slate-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-800 p-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestion(suggestion)}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSend();
                                }
                            }}
                            placeholder="Ask OpsMind AI about your infrastructure..."
                            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send className="h-4 w-4" />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}