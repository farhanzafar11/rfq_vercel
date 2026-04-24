import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export type StatusType = "idle" | "uploading" | "success" | "error";

interface StatusBannerProps {
  status: StatusType;
  message?: string;
  onRetry?: () => void;
}

export function StatusBanner({ status, message, onRetry }: StatusBannerProps) {
  if (status === "idle") return null;

  if (status === "uploading") {
    return (
      <div className="mt-4 p-4 rounded-md border border-gc-border bg-gc-bg-card flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-gc-accent animate-spin" />
        <span className="text-gc-text-primary text-sm font-medium">Sending to processing pipeline…</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mt-4 p-4 rounded-md border border-gc-success/50 bg-gc-success/10 flex items-center gap-3">
        <CheckCircle2 className="w-5 flex-shrink-0 h-5 text-gc-success" />
        <span className="text-gc-success text-sm font-medium">{message || "Your proposal will be emailed within 5 minutes."}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 p-4 rounded-md border border-gc-error/50 bg-gc-error/10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-gc-error">
          <XCircle className="w-5 flex-shrink-0 h-5" />
          <span className="text-sm font-medium">{message || "An error occurred."}</span>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-sm font-medium underline hover:text-red-400 transition-colors text-gc-error"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
