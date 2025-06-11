// components/PDFSettingsPanel.tsx
import React from "react";
import { X } from "lucide-react";
import { PhotoGridOptions } from "../types";

interface PDFSettingsPanelProps {
  options: PhotoGridOptions;
  onChange: (options: PhotoGridOptions) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const PDFSettingsPanel: React.FC<PDFSettingsPanelProps> = ({
  options,
  onChange,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  const updateOption = <K extends keyof PhotoGridOptions>(
    key: K,
    value: PhotoGridOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            PDF Generation Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos per Page
            </label>
            <select
              value={options.photosPerPage}
              onChange={(e) =>
                updateOption("photosPerPage", Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={4}>4 Photos</option>
              <option value={6}>6 Photos</option>
              <option value={8}>8 Photos</option>
              <option value={12}>12 Photos</option>
              <option value={16}>16 Photos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grid Columns
            </label>
            <select
              value={options.gridCols}
              onChange={(e) =>
                updateOption(
                  "gridCols",
                  Number(e.target.value) as 2 | 3 | 4 | 6
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
              <option value={6}>6 Columns</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <select
              value={options.fontSize}
              onChange={(e) =>
                updateOption(
                  "fontSize",
                  e.target.value as "small" | "medium" | "large"
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Size
            </label>
            <select
              value={options.paperSize}
              onChange={(e) =>
                updateOption("paperSize", e.target.value as "A4" | "Letter")
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <select
              value={options.orientation}
              onChange={(e) =>
                updateOption(
                  "orientation",
                  e.target.value as "portrait" | "landscape"
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.includeFilenames}
              onChange={(e) =>
                updateOption("includeFilenames", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm text-gray-700">
              Include filenames below photos
            </span>
          </label>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            PDF Preview
          </h4>
          <p className="text-sm text-blue-700">
            {Math.ceil(100 / options.photosPerPage)} pages for 100 photos •
            {options.gridCols} columns per row •
            {options.includeFilenames ? "With" : "Without"} filenames
          </p>
        </div>
      </div>
    </div>
  );
};
