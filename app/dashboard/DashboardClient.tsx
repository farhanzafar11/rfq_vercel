"use client";

import { useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { StatusBanner, StatusType } from "@/components/StatusBanner";
import { ChevronRight } from "lucide-react";

export function DashboardClient() {
  const [status, setStatus] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [webhookData, setWebhookData] = useState<Record<string, unknown> | null>(null);

  const handleStatusChange = (
    newStatus: StatusType,
    message?: string,
    data?: Record<string, unknown> | null
  ) => {
    setStatus(newStatus);
    setStatusMessage(message ?? "");
    if (data !== undefined) {
      setWebhookData(data);
    } else if (newStatus !== "success") {
      setWebhookData(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--gc-gray-500)] mb-1">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 text-[var(--gc-gray-400)]" />
          <span className="text-[var(--gc-orange-500)]">Submit BOQ</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--gc-gray-900)] leading-tight">Submit a Request for Quote</h1>
        <p className="text-[14px] text-[var(--gc-gray-500)] max-w-[600px]">
          Upload your Bill of Quantities PDF and our system will generate a pricing proposal automatically.
        </p>
      </div>

      <UploadCard
        onStatusChange={handleStatusChange}
        isUploading={status === "uploading"}
      />

      <StatusBanner
        status={status}
        message={statusMessage}
        webhookData={webhookData}
        onRetry={() => handleStatusChange("idle")}
      />

      <div className="mt-4 bg-[var(--gc-gray-100)] rounded-lg p-4 text-center border border-[var(--gc-gray-200)]">
        <p className="text-xs text-[var(--gc-gray-500)]">
          Only PDF files containing product pricing tables (BOQ/quotation format) will be processed.
        </p>
      </div>
    </div>
  );
}
