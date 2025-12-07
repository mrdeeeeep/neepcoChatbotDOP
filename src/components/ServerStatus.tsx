import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "https://kalpokoch-chatbotdemo.hf.space";
const CHECK_INTERVAL_MS = 30000; // 30 seconds
const WAKE_UP_ESTIMATE_MS = 270000; // 4.5 minutes

type ServerState = "online" | "sleeping" | "waking" | "unknown";

interface ServerStatusProps {
  className?: string;
}

const ServerStatus = ({ className = "" }: ServerStatusProps) => {
  const [status, setStatus] = useState<ServerState>("unknown");
  const [wakeProgress, setWakeProgress] = useState(0);
  const [wakeStartTime, setWakeStartTime] = useState<number | null>(null);

  const checkServerStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus("online");
        setWakeStartTime(null);
        setWakeProgress(0);
      } else if (response.status === 503) {
        // Server is sleeping
        if (status !== "waking") {
          setStatus("sleeping");
        }
      } else {
        setStatus("unknown");
      }
    } catch (error) {
      // Check if it's a timeout or network error
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          // Request timed out - likely server is sleeping or waking
          if (status === "waking") {
            // Keep waking status
          } else {
            setStatus("sleeping");
          }
        } else {
          // Network error - could be sleeping
          if (status !== "waking") {
            setStatus("sleeping");
          }
        }
      }
    }
  }, [status]);

  // Initial check and periodic checking
  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkServerStatus]);

  // Progress animation when waking
  useEffect(() => {
    if (status === "waking" && wakeStartTime) {
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - wakeStartTime;
        const progress = Math.min((elapsed / WAKE_UP_ESTIMATE_MS) * 100, 95);
        setWakeProgress(progress);

        // Check if server is actually online now
        checkServerStatus();
      }, 1000);

      return () => clearInterval(progressInterval);
    }
  }, [status, wakeStartTime, checkServerStatus]);

  // Listen for wake-up trigger from chat
  useEffect(() => {
    const handleWakeUp = () => {
      if (status === "sleeping" || status === "unknown") {
        setStatus("waking");
        setWakeStartTime(Date.now());
        setWakeProgress(0);
      }
    };

    window.addEventListener("serverWakeUp", handleWakeUp);
    return () => window.removeEventListener("serverWakeUp", handleWakeUp);
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "sleeping":
        return "bg-red-500";
      case "waking":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Server Online";
      case "sleeping":
        return "Server Sleeping";
      case "waking":
        return "Server Starting...";
      default:
        return "Checking...";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {status === "waking" ? (
          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
        ) : (
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${status === "online" ? "animate-pulse" : ""}`} />
        )}
        <span className="text-xs font-quicksand text-custom-blue/70">
          {getStatusText()}
        </span>
      </div>
      
      {status === "waking" && (
        <div className="w-full">
          <div className="h-1.5 bg-custom-blue/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${wakeProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-custom-blue/50 mt-1 font-quicksand">
            Est. ~{Math.max(1, Math.ceil((WAKE_UP_ESTIMATE_MS - (Date.now() - (wakeStartTime || Date.now()))) / 60000))} min remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerStatus;
