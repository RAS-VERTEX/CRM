// components/SimproImporter.tsx
import React, { useState, useCallback } from "react";
import { Building2, Search, Loader2 } from "lucide-react";
import { PhotoGridItem, SimproJob, SimproAttachment } from "../types";

interface SimproImporterProps {
  onPhotosImported: (photos: PhotoGridItem[], job: SimproJob) => void;
  onError: (message: string) => void;
  loading: boolean;
  className?: string;
}

export const SimproImporter: React.FC<SimproImporterProps> = ({
  onPhotosImported,
  onError,
  loading,
  className = "",
}) => {
  const [jobNumber, setJobNumber] = useState("");
  const [companyId, setCompanyId] = useState("0");

  const fetchSimproAttachments = useCallback(async () => {
    if (!jobNumber.trim()) {
      onError("Please enter a job number");
      return;
    }

    try {
      const response = await fetch(
        `/api/simpro/jobs/${encodeURIComponent(
          jobNumber
        )}/attachments?companyId=${encodeURIComponent(companyId)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch attachments: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const {
        attachments,
        job,
      }: { attachments: SimproAttachment[]; job: SimproJob } =
        await response.json();

      // Filter for image attachments only
      const imageAttachments = attachments.filter((att: SimproAttachment) =>
        att.MimeType?.startsWith("image/")
      );

      if (imageAttachments.length === 0) {
        onError("No image attachments found for this job");
        return;
      }

      // Convert to PhotoGridItem format
      const simproPhotos: PhotoGridItem[] = imageAttachments.map(
        (att: SimproAttachment) => ({
          id: `simpro_${att.ID}`,
          name: att.Filename,
          url: `data:${att.MimeType};base64,${att.Base64Data}`,
          size: att.FileSizeBytes,
          source: "simpro" as const,
          simproData: att,
        })
      );

      onPhotosImported(simproPhotos, job);
    } catch (err) {
      console.error("SimPRO import error:", err);
      onError(
        err instanceof Error
          ? err.message
          : "Failed to fetch SimPRO attachments"
      );
    }
  }, [jobNumber, companyId, onPhotosImported, onError]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      fetchSimproAttachments();
    },
    [fetchSimproAttachments]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        fetchSimproAttachments();
      }
    },
    [fetchSimproAttachments]
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm p-8 ${className}`}>
      <div className="text-center mb-6">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Import from SimPRO
        </h3>
        <p className="text-gray-600">
          Enter a job number to automatically import photo attachments from your
          SimPRO system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="companyId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company ID
            </label>
            <input
              id="companyId"
              type="text"
              placeholder="0"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="jobNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Number
            </label>
            <input
              id="jobNumber"
              type="text"
              placeholder="Enter job number..."
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !jobNumber.trim()}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? "Importing..." : "Import Photos"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          How it works:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enter your SimPRO job number</li>
          <li>• System fetches all image attachments</li>
          <li>• Photos are automatically added to the grid</li>
          <li>• Generate PDF with job information included</li>
        </ul>
      </div>
    </div>
  );
};
