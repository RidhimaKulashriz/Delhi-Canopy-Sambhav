import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseCanopyAIOptions {
  type?: "chat" | "analysis" | "summary";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/canopy-ai-chat`;

function createLocalAssistantResponse(input: string) {
  const query = input.toLowerCase();
  if (query.includes("heat")) {
    return "**Local preview insight**\n\nPrioritise high heat-index wards with low green cover. Review the Heat Stress Analyzer for the ranked vulnerability packet, then use the AI Planner to compare a planting intervention. Treat the values as a demonstration packet until a connected source is available.";
  }
  if (query.includes("green") || query.includes("vegetation")) {
    return "**Local preview insight**\n\nThe Green Intelligence view highlights zones below the green-cover threshold. Use the Planting Space Finder to turn a screened candidate into a field-verification brief; the screen is not a permit or a substitute for site checks.";
  }
  if (query.includes("plant") || query.includes("strategy")) {
    return "**Local preview insight**\n\nOpen the AI Planner, choose a ward, adjust density and land type, then generate a strategy. Before field action, move the decision through TrustOps: credible evidence, red-team checks, a named reviewer, and an audit receipt are required.";
  }
  if (query.includes("risk") || query.includes("ward")) {
    return "**Local preview insight**\n\nReview the Command Center or Heat Stress Analyzer for ranked wards. A high score indicates prioritisation for review, not permission to plant or an official government determination.";
  }
  return "**Local preview assistant**\n\nI can guide you through heat-risk review, green-cover screening, planting strategies, and the TrustOps quality gate. Ask about a ward, heat stress, green cover, or a plantation strategy.";
}

export function useCanopyAI(options: UseCanopyAIOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalPreview, setIsLocalPreview] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    setIsLocalPreview(false);

    let assistantContent = "";

    const updateAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          type: options.type || "chat"
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }

    } catch (err) {
      console.error("Canopy AI error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: createLocalAssistantResponse(input) }]);
      setIsLocalPreview(true);
    } finally {
      setIsLoading(false);
    }
  }, [messages, options.type]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isLocalPreview,
  };
}
