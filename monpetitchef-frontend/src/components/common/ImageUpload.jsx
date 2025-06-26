import React, { useState, useRef, useCallback } from "react";
import "./ImageUpload.css";

const ImageUpload = ({
  onImageSelect,
  initialImage = null,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  acceptedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
}) => {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Validation d'image
  const validateImage = useCallback(
    (file) => {
      if (!file) return { valid: true };

      if (file.size > maxSize) {
        return {
          valid: false,
          error: `L'image ne doit pas dépasser ${Math.round(
            maxSize / (1024 * 1024)
          )}MB`,
        };
      }

      if (!acceptedFormats.includes(file.type)) {
        return {
          valid: false,
          error: "Format d'image non supporté. Utilisez JPG, PNG, GIF ou WebP",
        };
      }

      return { valid: true };
    },
    [maxSize, acceptedFormats]
  );

  // Compression d'image (optionnelle)
  const compressImage = useCallback((file, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions (max 1200px de largeur)
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);

        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convertir en blob
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Traitement du fichier sélectionné
  const processFile = useCallback(
    async (file) => {
      setError("");
      setIsProcessing(true);
      setProgress(0);

      try {
        // Validation
        const validation = validateImage(file);
        if (!validation.valid) {
          setError(validation.error);
          setIsProcessing(false);
          return;
        }

        setProgress(25);

        // Compression si nécessaire (pour les gros fichiers)
        let processedFile = file;
        if (file.size > 1 * 1024 * 1024) {
          // 1MB
          setProgress(50);
          processedFile = await compressImage(file);
        }

        setProgress(75);

        // Créer le preview
        const previewUrl = URL.createObjectURL(processedFile);
        setImagePreview(previewUrl);
        setSelectedImage(processedFile);

        setProgress(100);

        // Notifier le composant parent
        if (onImageSelect) {
          onImageSelect(processedFile);
        }

        setTimeout(() => {
          setProgress(0);
          setIsProcessing(false);
        }, 500);
      } catch (error) {
        console.error("Error processing image:", error);
        setError("Erreur lors du traitement de l'image");
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [validateImage, compressImage, onImageSelect]
  );

  // Gestionnaires d'événements
  const handleFileSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onImageSelect) {
      onImageSelect(null);
    }
  }, [onImageSelect]);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  return (
    <div className="image-upload">
      <div className="image-upload-label">
        <span className="label-icon">📷</span>
        Image de la recette
        <span className="label-optional">(optionnel)</span>
      </div>

      {/* Zone de drop */}
      <div
        ref={dropZoneRef}
        className={`image-drop-zone ${
          isDragging ? "image-drop-zone--dragging" : ""
        } ${error ? "image-drop-zone--error" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="image-input-hidden"
        />

        {/* Preview de l'image */}
        {imagePreview ? (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="preview-image" />
            <div className="image-overlay">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="btn-remove-image"
              >
                🗑️ Supprimer
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickUpload();
                }}
                className="btn-change-image"
              >
                🔄 Changer
              </button>
            </div>
            {selectedImage && (
              <div className="image-info">
                <span className="image-size">
                  {formatFileSize(selectedImage.size)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="drop-zone-icon">{isProcessing ? "⏳" : "📷"}</div>
            <div className="drop-zone-text">
              {isProcessing
                ? "Traitement en cours..."
                : isDragging
                ? "Déposez votre image ici"
                : "Cliquez ou glissez une image ici"}
            </div>
            <div className="drop-zone-subtext">
              Formats acceptés : JPG, PNG, GIF, WebP (max{" "}
              {Math.round(maxSize / (1024 * 1024))}MB)
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {isProcessing && progress > 0 && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="image-upload-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Conseils */}
      <div className="image-upload-tips">
        <div className="tip-item">
          💡 Une belle photo améliore l'attractivité de votre recette
        </div>
        <div className="tip-item">
          📏 L'image sera automatiquement redimensionnée pour le web
        </div>
        <div className="tip-item">
          🎨 Privilégiez un éclairage naturel et un cadrage centré
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
