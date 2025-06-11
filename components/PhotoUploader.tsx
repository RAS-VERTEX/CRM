// components/PhotoUploader.tsx
import React, { useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { PhotoGridItem } from "../types";

interface PhotoUploaderProps {
  onPhotosAdded: (photos: PhotoGridItem[]) => void;
  onError: (message: string) => void;
  loading: boolean;
  className?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosAdded,
  onError,
  loading,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      try {
        const photoPromises = files.map((file) => {
          return new Promise<PhotoGridItem>((resolve, reject) => {
            // Validate file type
            if (!file.type.startsWith("image/")) {
              reject(new Error(`${file.name} is not a valid image file`));
              return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
              reject(
                new Error(`${file.name} is too large. Maximum size is 10MB`)
              );
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: `upload_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                name: file.name,
                url: e.target?.result as string,
                size: file.size,
                source: "upload",
              });
            };
            reader.onerror = () =>
              reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          });
        });

        const loadedPhotos = await Promise.all(photoPromises);
        onPhotosAdded(loadedPhotos);

        // Clear the input so the same files can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to upload files");
      }
    },
    [onPhotosAdded, onError]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Photos
          </h3>
          <p className="text-gray-600 mb-6">
            Select multiple image files at once. Supports JPG, PNG, WebP, and
            other formats. Maximum file size: 10MB per image.
          </p>

          <button
            onClick={handleUploadClick}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Upload className="w-5 h-5" />
            {loading ? "Processing..." : "Choose Files"}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Tip: You can select multiple files at once by holding Ctrl (Windows)
            or Cmd (Mac)
          </p>
        </div>
      </div>
    </>
  );
};
