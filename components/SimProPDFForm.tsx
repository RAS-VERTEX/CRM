"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SimproJob {
  ID: number;
  Name: string;
  Description?: string;
  Customer?: {
    ID: number;
    Name: string;
  };
  Site?: {
    ID: number;
    Name: string;
    Address?: string;
  };
}

interface ProjectFormData {
  projectName: string;
  preparedFor: string;
  preparedBy: string;
  address: string;
  qbcc: string;
  abn: string;
  website: string;
}

interface SimproPDFFormProps {
  jobNumber: string;
  onJobFetch?: (job: SimproJob) => void;
}

const SimproPDFForm: React.FC<SimproPDFFormProps> = ({
  jobNumber,
  onJobFetch,
}) => {
  const [job, setJob] = useState<SimproJob | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    preparedFor: "",
    preparedBy: "Shane Kidby",
    address: "",
    qbcc: "1307234",
    abn: "53 167 652 637",
    website: "rasvertex.com.au",
  });

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Fetch job details when jobNumber changes
  useEffect(() => {
    if (jobNumber && jobNumber.trim()) {
      fetchJobDetails(jobNumber);
    } else {
      setJob(null);
      setAttachments([]);
      setFetchStatus("idle");
    }
  }, [jobNumber]);

  // Auto-populate form when job data is available
  useEffect(() => {
    if (job) {
      setFormData((prev) => ({
        ...prev,
        projectName: job.Name || "",
        address: job.Site?.Address || "",
        preparedFor: job.Customer?.Name || "",
      }));
      onJobFetch?.(job);
    }
  }, [job, onJobFetch]);

  const fetchJobDetails = async (jobId: string) => {
    setLoading(true);
    setFetchStatus("loading");
    setError(null);

    try {
      // Fetch job details
      const jobResponse = await fetch(`/api/simpro/jobs/${jobId}`);
      if (!jobResponse.ok) {
        throw new Error("Failed to fetch job details");
      }
      const jobData = await jobResponse.json();
      setJob(jobData);

      // Fetch attachments
      const attachmentsResponse = await fetch(
        `/api/simpro/jobs/${jobId}/attachments?companyId=0`
      );
      if (!attachmentsResponse.ok) {
        throw new Error("Failed to fetch attachments");
      }
      const { attachments: attachmentData } = await attachmentsResponse.json();
      setAttachments(attachmentData || []);

      setFetchStatus("success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setFetchStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!job) {
      setError("No job data available");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const reportData = {
        job,
        attachments,
        projectDetails: {
          ...formData,
          date: new Date().toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        },
      };

      const response = await fetch("/api/pdf/job-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.projectName || "job-report"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      preparedFor: "",
      preparedBy: "Shane Kidby",
      address: "",
      qbcc: "1307234",
      abn: "53 167 652 637",
      website: "rasvertex.com.au",
    });
    setError(null);
  };

  const StatusIndicator = () => {
    switch (fetchStatus) {
      case "loading":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Fetching job data...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Job data loaded ({attachments.length} photos)</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Failed to load job data</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Professional PDF Report Generator
              </h2>
              <p className="text-sm text-gray-600">
                Generate branded reports using Chrome headless browser
              </p>
            </div>
          </div>
          <StatusIndicator />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {jobNumber && !job && fetchStatus !== "loading" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Enter a job number to fetch details from SimPro, or fill in the
              form manually.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 border-b pb-2">
              Project Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prepared For (Customer)
              </label>
              <input
                type="text"
                value={formData.preparedFor}
                onChange={(e) =>
                  handleInputChange("preparedFor", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Customer name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Project address..."
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 border-b pb-2">
              Company Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prepared By
              </label>
              <input
                type="text"
                value={formData.preparedBy}
                onChange={(e) =>
                  handleInputChange("preparedBy", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QBCC Number
              </label>
              <input
                type="text"
                value={formData.qbcc}
                onChange={(e) => handleInputChange("qbcc", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="QBCC number..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ABN
              </label>
              <input
                type="text"
                value={formData.abn}
                onChange={(e) => handleInputChange("abn", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABN number..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company website..."
              />
            </div>
          </div>
        </div>

        {/* Job Information Display */}
        {job && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              SimPro Job Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Job ID:</span>
                <span className="ml-2 text-gray-900">{job.ID}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Job Name:</span>
                <span className="ml-2 text-gray-900">{job.Name}</span>
              </div>
              {job.Customer && (
                <div>
                  <span className="font-medium text-gray-700">Customer:</span>
                  <span className="ml-2 text-gray-900">
                    {job.Customer.Name}
                  </span>
                </div>
              )}
              {job.Site && (
                <div>
                  <span className="font-medium text-gray-700">Site:</span>
                  <span className="ml-2 text-gray-900">{job.Site.Name}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Photos:</span>
                <span className="ml-2 text-gray-900">
                  {
                    attachments.filter((att) =>
                      att.MimeType?.startsWith("image/")
                    ).length
                  }{" "}
                  images
                </span>
              </div>
              {job.Description && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">
                    Description:
                  </span>
                  <span className="ml-2 text-gray-900">{job.Description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePDF}
            disabled={generating || !formData.projectName.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Professional PDF
              </>
            )}
          </button>

          <button
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            Reset Form
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> This system uses Chrome headless
            browser to generate pixel-perfect PDFs with your branding. Enter a
            SimPro job number to auto-populate fields, or fill manually. The PDF
            will include a professional cover page and photo galleries based on
            your job attachments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimproPDFForm;
