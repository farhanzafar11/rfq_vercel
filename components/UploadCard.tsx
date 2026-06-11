"use client";

import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface UploadCardProps {
  onStatusChange: (status: "idle" | "uploading" | "success" | "error", message?: string, data?: Record<string, unknown> | null) => void;
  isUploading: boolean;
}

export function UploadCard({ onStatusChange, isUploading }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      onStatusChange("error", "Please upload a valid PDF file.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      onStatusChange("error", "File exceeds the 20 MB limit.");
      return;
    }
    setFile(selectedFile);
    onStatusChange("idle");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    onStatusChange("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/submit-boq", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        onStatusChange("error", data.error || "Failed to upload BOQ.");
      } else {
        // Pass the full response object so the dashboard can display all webhook fields
        const { message, ...rest } = data;
        const responseData = Object.keys(rest).length > 0 ? rest : null;
        onStatusChange("success", message, responseData);
        setFile(null);
      }
    } catch (err) {
      onStatusChange("error", "Failed to communicate with proxy.");
    }
  };

  return (
    <div className="bg-white border border-[var(--gc-gray-200)] rounded-[0.75rem] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col gap-6">
      <div 
        className={`border-2 border-dashed rounded-[0.5rem] p-10 flex flex-col items-center justify-center transition-all duration-150 text-center cursor-pointer
          ${isDragOver ? "border-[var(--gc-orange-500)] bg-[var(--gc-orange-50)]" : "border-[var(--gc-gray-300)] hover:border-[var(--gc-orange-500)] hover:bg-[var(--gc-orange-50)]"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="application/pdf"
          ref={inputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--gc-orange-50)] flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-[var(--gc-orange-500)]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[var(--gc-gray-900)]">{file.name}</p>
              <p className="text-[12px] text-[var(--gc-gray-500)] mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button 
              className="mt-2 text-[13px] text-[var(--gc-gray-500)] hover:text-[var(--gc-error)] font-medium flex items-center gap-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onStatusChange("idle");
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={48} className="text-[var(--gc-orange-500)] mb-2" />
            <p className="text-[16px] font-medium text-[var(--gc-gray-900)]">
              Drag & drop your BOQ PDF here
            </p>
            <p className="text-[14px] text-[var(--gc-gray-500)]">
              or click to browse — max 20MB
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={!file || isUploading}
        className="w-full h-[44px] bg-[var(--gc-orange-500)] hover:bg-[var(--gc-orange-600)] text-white rounded-lg px-4 text-[14px] font-semibold transition-colors duration-150 disabled:opacity-50 flex items-center justify-center"
      >
        {isUploading ? "Processing your BOQ..." : "Generate Quote"}
      </button>
    </div>
  );
}
