"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Eye, X, Search, AlertCircle } from "lucide-react";
import { PhotoItem } from "@/types";
import styles from "./PhotoReport.module.css";

export default function PhotoReportGenerator() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [companyId, setCompanyId] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: PhotoItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: e.target?.result as string,
            timestamp: new Date().toLocaleString(),
            size: file.size,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const fetchSimproAttachments = async () => {
    if (!jobNumber.trim()) {
      setError("Please enter a job number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/simpro/jobs/${jobNumber}/attachments?companyId=${companyId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to fetch attachments: ${response.statusText}`
        );
      }

      const { attachments, metadata } = await response.json();

      if (!attachments || attachments.length === 0) {
        setError(`No image attachments found for job ${jobNumber}`);
        return;
      }

      const simproPhotos: PhotoItem[] = attachments.map((att: any) => ({
        id: `simpro_${att.ID}`,
        name: att.Filename,
        url: `data:${att.MimeType};base64,${att.Base64Data}`,
        timestamp: new Date().toLocaleString(),
        size: att.FileSizeBytes || 0,
      }));

      setPhotos((prev) => [...prev, ...simproPhotos]);
      setError(
        `Successfully loaded ${simproPhotos.length} photos from SimPRO job ${jobNumber}`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error("SimPRO fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch SimPRO attachments"
      );
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const clearAllPhotos = () => {
    setPhotos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePrintView = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Photo Report - ${jobTitle || jobNumber || "Untitled"}</title>
          <style>
            @media print {
              @page {
                margin: 10mm;
                size: A4;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              background: white;
              color: #333;
            }
            .photo-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              padding: 20px 0;
            }
            .photo-item {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .photo-container {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .photo-img {
              width: 100%;
              height: 180px;
              object-fit: cover;
              display: block;
            }
            .photo-caption {
              padding: 8px 12px;
              background: #f9fafb;
              font-size: 11px;
              color: #374151;
              text-align: center;
              font-weight: 500;
              word-wrap: break-word;
            }
            @media print {
              .photo-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              }
              .photo-img {
                height: 140px;
              }
              .photo-caption {
                font-size: 10px;
                padding: 6px 8px;
              }
            }
          </style>
        </head>
        <body>
          <div class="photo-grid">
            ${photos
              .map(
                (photo) => `
              <div class="photo-item">
                <div class="photo-container">
                  <img src="${photo.url}" alt="${
                  photo.name
                }" class="photo-img" />
                  <div class="photo-caption">${photo.name.replace(
                    /\.[^/.]+$/,
                    ""
                  )}</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.photoReportGenerator}>
      {/* Error/Success Message */}
      {error && (
        <div
          className={`${styles.alert} ${
            error.includes("Successfully") ? styles.success : styles.error
          }`}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Job Information & SimPRO Fetch */}
      <div className={styles.jobInfoCard}>
        <h3 className={styles.cardTitle}>Job Information</h3>
        <div className={styles.jobInfoGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Job Number</label>
            <div className={styles.inputWithButton}>
              <input
                type="text"
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                placeholder="Enter SimPRO job number..."
                className={styles.input}
              />
              <button
                onClick={fetchSimproAttachments}
                disabled={loading || !jobNumber.trim()}
                className={`${styles.button} ${styles.primary}`}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Fetch Photos</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Job Title (Optional)</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title..."
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className={styles.photoUploadCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Photos ({photos.length})</h3>
          <div className={styles.cardActions}>
            {photos.length > 0 && (
              <>
                <button
                  onClick={generatePrintView}
                  className={`${styles.button} ${styles.primary}`}
                >
                  <Eye size={16} />
                  <span>Preview & Print</span>
                </button>
                <button
                  onClick={clearAllPhotos}
                  className={`${styles.button} ${styles.danger}`}
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className={styles.hiddenInput}
          />
          <Upload className={styles.uploadIcon} />
          <p className={styles.uploadText}>Drag and drop images here, or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`${styles.button} ${styles.primary}`}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className={styles.photoGridCard}>
          <h3 className={styles.cardTitle}>Photo Preview</h3>
          <div className={styles.photoGrid}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.photoItem}>
                <div className={styles.photoContainer}>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className={styles.photoImage}
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className={styles.removeButton}
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className={styles.photoName}>{photo.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
