import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "../../utils/cn";

export function UploadZone({ label, helper, file, accept, onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onDrop(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "panel-soft cursor-pointer border border-dashed p-6 transition",
        isDragActive && "border-brand-400 bg-brand-500/10"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
          <UploadCloud size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold">{label}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
          <p className="mt-4 truncate text-sm text-slate-600 dark:text-slate-300">
            {file ? file.name : "Drag and drop or click to browse"}
          </p>
        </div>
      </div>
    </div>
  );
}
