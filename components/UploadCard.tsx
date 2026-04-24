"use client";

import { useState, useRef, ReactNode } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadCardProps {
  onStatusChange: (status: "idle" | "uploading" | "success" | "error", message?: string) => void;
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
        onStatusChange("success", data.message);
        setFile(null);
      }
    } catch (err) {
      onStatusChange("error", "Failed to communicate with proxy.");
    }
  };

  return (
    <div className="bg-gc-bg-card border border-gc-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors text-center cursor-pointer
          ${isDragOver ? "border-gc-border-focus bg-gc-border-focus/5" : "border-gc-border hover:border-gc-text-secondary/50"}
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
            <div className="w-12 h-12 rounded-full bg-gc-bg-input flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-gc-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gc-text-primary">{file.name}</p>
              <p className="text-xs text-gc-text-secondary mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button 
              className="mt-2 text-xs text-gc-error hover:text-red-400 font-medium flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onStatusChange("idle");
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <X className="w-3 h-3" /> Remove File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gc-bg-input flex items-center justify-center mb-2">
              <UploadCloud className="w-6 h-6 text-gc-text-secondary" />
            </div>
            <p className="text-sm text-gc-text-secondary">
              Drag & drop your PDF here, or <span className="text-gc-accent font-medium hover:underline">Browse files</span>
            </p>
            <p className="text-xs text-gc-text-secondary/70 mt-1">Max 20 MB</p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!file || isUploading}
        className="w-full bg-gc-accent hover:bg-orange-600 text-white font-medium py-6"
      >
        {isUploading ? "Uploading..." : "Submit BOQ"}
      </Button>
    </div>
  );
}
