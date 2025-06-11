// components/PhotoGrid.tsx
import React from "react";
import { X, CheckCircle } from "lucide-react";
import { PhotoGridItem, PhotoGridOptions, JobInfo } from "../types";

interface PhotoGridProps {
  photos: PhotoGridItem[];
  options: PhotoGridOptions;
  jobInfo?: JobInfo;
  onRemovePhoto: (photoId: string) => void;
  onAddMorePhotos: () => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  options,
  jobInfo,
  onRemovePhoto,
  onAddMorePhotos,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFileExtension = (filename: string): string => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  const totalSize = photos.reduce((acc, photo) => acc + photo.size, 0);
  const pageCount = Math.ceil(photos.length / options.photosPerPage);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Photo Grid Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">
                {photos.length} Photos
              </span>
            </div>

            {jobInfo?.name && (
              <div className="text-sm text-gray-600">
                Job: <span className="font-medium">{jobInfo.name}</span>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Total size:{" "}
              <span className="font-medium">{formatFileSize(totalSize)}</span>
            </div>

            <div className="text-sm text-blue-600 font-medium">
              {pageCount} page{pageCount > 1 ? "s" : ""} •{" "}
              {options.photosPerPage} photos per page
            </div>
          </div>

          <button
            onClick={onAddMorePhotos}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Add More Photos
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${options.gridCols} gap-6`}
        >
          {photos.map((photo) => (
            <PhotoGridItem
              key={photo.id}
              photo={photo}
              onRemove={() => onRemovePhoto(photo.id)}
              showFilename={options.includeFilenames}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface PhotoGridItemProps {
  photo: PhotoGridItem;
  onRemove: () => void;
  showFilename: boolean;
}

const PhotoGridItem: React.FC<PhotoGridItemProps> = ({
  photo,
  onRemove,
  showFilename,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFileExtension = (filename: string): string => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden relative group transition-transform hover:scale-[1.02]">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        title="Remove photo"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Image container */}
      <div className="aspect-square bg-white p-2">
        <img
          src={photo.url}
          alt={photo.name}
          className="w-full h-full object-cover rounded transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Photo info */}
      <div className="p-3">
        {showFilename && (
          <p className="text-sm font-medium text-gray-900 break-words leading-tight mb-2">
            {removeFileExtension(photo.name)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              photo.source === "simpro"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {photo.source === "simpro" ? "SimPRO" : "Uploaded"}
          </span>

          <span className="text-xs text-gray-500 font-medium">
            {formatFileSize(photo.size)}
          </span>
        </div>
      </div>
    </div>
  );
};
