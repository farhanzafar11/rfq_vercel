"use client";

import { useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { StatusBanner, StatusType } from "@/components/StatusBanner";

export function DashboardClient() {
  const [status, setStatus] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleStatusChange = (newStatus: StatusType, message?: string) => {
    setStatus(newStatus);
    if (message) {
      setStatusMessage(message);
    } else {
      setStatusMessage("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col pt-12 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gc-text-primary mb-2">Submit BOQ for Proposal</h1>
        <p className="text-gc-text-secondary text-sm">Upload a vendor quotation PDF (Huawei · Fortinet · Cisco)</p>
      </div>

      <UploadCard 
        onStatusChange={handleStatusChange} 
        isUploading={status === "uploading"} 
      />

      <StatusBanner 
        status={status} 
        message={statusMessage} 
        onRetry={() => handleStatusChange("idle")}
      />

      <div className="mt-6 bg-gc-bg-input rounded-lg p-4 text-center border border-gc-border/50">
        <p className="text-xs text-gc-text-secondary">
          Only PDF files containing product pricing tables (BOQ/quotation format) will be processed.
        </p>
      </div>
    </div>
  );
}
