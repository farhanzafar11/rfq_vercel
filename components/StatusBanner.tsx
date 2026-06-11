import { CheckCircle2, AlertCircle, Loader2, Bot, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export type StatusType = "idle" | "uploading" | "success" | "error";

interface StatusBannerProps {
  status: StatusType;
  message?: string;
  webhookData?: Record<string, unknown> | null;
  onRetry?: () => void;
}

function WebhookResponsePanel({ data, message }: { data?: Record<string, unknown> | null; message?: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="mt-4 rounded-xl border border-[var(--gc-success)] bg-[var(--gc-success-bg)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--gc-success)]/20">
        <div className="w-8 h-8 rounded-full bg-[var(--gc-success)]/10 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[var(--gc-success)]" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--gc-success)]">Workflow Completed Successfully</p>
          {message && <p className="text-[13px] text-[var(--gc-success)]/80 mt-0.5">{message}</p>}
        </div>
      </div>

      {/* Webhook Response Data */}
      {hasData && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-medium text-[var(--gc-success)] hover:bg-[var(--gc-success)]/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Workflow Response Details</span>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="px-5 pb-5">
              <div className="rounded-lg bg-white/60 border border-[var(--gc-success)]/20 overflow-hidden">
                {/* Try to render key-value pairs */}
                <div className="divide-y divide-[var(--gc-success)]/10">
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 px-4 py-3">
                      <span className="text-[12px] font-semibold uppercase tracking-wide text-[var(--gc-success)]/70 sm:w-[160px] flex-shrink-0">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-[13px] text-[var(--gc-gray-800)] break-words flex-1">
                        {typeof value === "object" ? (
                          <pre className="text-[11px] bg-[var(--gc-gray-50)] rounded p-2 overflow-auto max-h-40 text-[var(--gc-gray-700)]">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          String(value)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Raw text response if no structured data */}
      {!hasData && message && (
        <div className="px-5 py-4">
          <p className="text-[13px] text-[var(--gc-success)]/90 leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}

export function StatusBanner({ status, message, webhookData, onRetry }: StatusBannerProps) {
  if (status === "idle") return null;

  if (status === "uploading") {
    return (
      <div className="mt-4 p-4 rounded-xl border border-[var(--gc-gray-200)] bg-[var(--gc-gray-50)] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <Loader2 className="w-5 h-5 text-[var(--gc-orange-500)] animate-spin flex-shrink-0" />
        <div>
          <span className="text-[var(--gc-gray-700)] text-[14px] font-medium">Processing your BOQ…</span>
          <p className="text-[12px] text-[var(--gc-gray-500)] mt-0.5">This may take a moment. Please don't close this page.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return <WebhookResponsePanel data={webhookData} message={message} />;
  }

  if (status === "error") {
    return (
      <div className="mt-4 p-4 rounded-xl border-l-4 border-l-[var(--gc-error)] bg-[var(--gc-error-bg)] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-3 text-[var(--gc-error)]">
          <AlertCircle className="w-5 flex-shrink-0 h-5" />
          <span className="text-[14px] font-medium">{message || "An error occurred."}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[13px] font-medium underline hover:opacity-80 transition-opacity text-[var(--gc-error)] flex-shrink-0 ml-4"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
