// components/photo/PhotoGrid.tsx - Updated styling
"use client";

import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoRemove: (id: string) => void;
  onPhotoRename: (id: string, newName: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos = [],
  onPhotoRemove,
  onPhotoRename,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const naturalSort = (a: string, b: string): number => {
    const chunkify = (str: string) => {
      return str.split(/(\d+)/).filter((chunk) => chunk !== "");
    };

    const chunksA = chunkify(a);
    const chunksB = chunkify(b);

    for (let i = 0; i < Math.max(chunksA.length, chunksB.length); i++) {
      const chunkA = chunksA[i] || "";
      const chunkB = chunksB[i] || "";

      if (/^\d+$/.test(chunkA) && /^\d+$/.test(chunkB)) {
        const numA = parseInt(chunkA, 10);
        const numB = parseInt(chunkB, 10);
        if (numA !== numB) {
          return numA - numB;
        }
      } else {
        const result = chunkA.localeCompare(chunkB);
        if (result !== 0) {
          return result;
        }
      }
    }
    return 0;
  };

  const sortedPhotos = React.useMemo(() => {
    if (!Array.isArray(photos)) {
      console.warn("PhotoGrid: photos prop is not an array:", photos);
      return [];
    }
    return [...photos].sort((a, b) => naturalSort(a.name, b.name));
  }, [photos]);

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName.replace(/\.[^/.]+$/, ""));
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      const photo = photos.find((p) => p.id === id);
      if (photo) {
        const extension = photo.name.includes(".")
          ? "." + photo.name.split(".").pop()
          : "";
        onPhotoRename(id, editingName.trim() + extension);
      }
    }
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  if (!Array.isArray(photos) || photos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Photos Yet
        </h3>
        <p className="text-gray-600">
          Import photos from a SimPRO job or upload files to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Photos ({photos.length})
        </h3>
        <p className="text-sm text-gray-600">Click photo names to edit</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.map((photo) => (
          <div key={photo.id} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onPhotoRemove(photo.id)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {editingId === photo.id ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full text-sm text-gray-700 text-center bg-transparent border-none outline-none placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") saveEdit(photo.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  onBlur={() => saveEdit(photo.id)}
                  autoFocus
                />
              </div>
            ) : (
              <div
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => startEditing(photo.id, photo.name)}
              >
                <p className="text-sm text-gray-700 text-center truncate font-medium">
                  {photo.name.replace(/\.[^/.]+$/, "")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
