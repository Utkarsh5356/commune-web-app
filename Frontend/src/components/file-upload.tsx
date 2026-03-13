import { useState } from "react";
import { uploadCloudinary } from "@/lib/cloudinary";
import { X, FileText, Plus } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const isPdf = (url: string) => url?.includes("/raw/") || url?.endsWith(".pdf");

export const FileUpload = ({ value, onChange, disabled }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const url = await uploadCloudinary(file, setProgress);
    onChange(url);
    e.target.value = "";

    setIsUploading(false);
  };

  return (
    <div className="relative">
      {value ? (
        <div className="relative w-24 h-24">
          {isPdf(value) ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center h-full w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              <FileText className="h-8 w-8 text-indigo-500" />
              <span className="text-xs text-zinc-500 mt-1">PDF</span>
            </a>
          ) : (
            <img
              src={value}
              alt="upload"
              className="h-full w-full object-cover rounded-lg"
            />
          )}

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1 -right-1 bg-black/60 rounded-full p-1 cursor-pointer"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      ) : (
        <label className={`flex items-center justify-center h-24 w-24 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600 cursor-pointer hover:border-indigo-500 transition ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <Plus className="h-6 w-6 text-zinc-500" />
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={onFileChange}
            disabled={disabled || isUploading}
          />
        </label>
      )}

      {isUploading && (
        <div className="mt-2 h-1.5 w-24 bg-zinc-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};