import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Loads an image from a URL, Blob, or File and returns an HTMLImageElement
 * @param {string|Blob|File} source
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl = null;

    img.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error(`Failed to load image: ${err?.message || 'Invalid or corrupt image file'}`));
    };

    if (typeof source === 'string') {
      img.crossOrigin = 'anonymous';
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      reject(new Error('Unsupported image source type.'));
    }
  });
}

/**
 * Calculates positioning coordinates and dimensions for watermark overlay
 */
export function calculateWatermarkCoordinates({
  imageWidth,
  imageHeight,
  watermarkWidth,
  watermarkHeight,
  scale = 25,
  position = 'bottom-right',
  customPos = null,
}) {
  // Scale is percentage of base image width
  const scaleFraction = Math.max(0.01, Math.min(1, scale / 100));
  const targetWidth = Math.max(1, Math.round(imageWidth * scaleFraction));
  const aspectRatio = watermarkHeight && watermarkWidth ? watermarkHeight / watermarkWidth : 1;
  const targetHeight = Math.max(1, Math.round(targetWidth * aspectRatio));

  // 2% preset margin
  const marginX = Math.round(imageWidth * 0.02);
  const marginY = Math.round(imageHeight * 0.02);

  let x = 0;
  let y = 0;

  if (position === 'custom' && customPos) {
    const rawX = Math.round((customPos.x / 100) * imageWidth - targetWidth / 2);
    const rawY = Math.round((customPos.y / 100) * imageHeight - targetHeight / 2);
    x = Math.max(0, Math.min(Math.max(0, imageWidth - targetWidth), rawX));
    y = Math.max(0, Math.min(Math.max(0, imageHeight - targetHeight), rawY));
  } else {
    switch (position) {
      case 'top-left':
        x = marginX;
        y = marginY;
        break;
      case 'top-right':
        x = Math.max(0, imageWidth - targetWidth - marginX);
        y = marginY;
        break;
      case 'bottom-left':
        x = marginX;
        y = Math.max(0, imageHeight - targetHeight - marginY);
        break;
      case 'center':
        x = Math.max(0, Math.round((imageWidth - targetWidth) / 2));
        y = Math.max(0, Math.round((imageHeight - targetHeight) / 2));
        break;
      case 'bottom-right':
      default:
        x = Math.max(0, imageWidth - targetWidth - marginX);
        y = Math.max(0, imageHeight - targetHeight - marginY);
        break;
    }
  }

  return { x, y, width: targetWidth, height: targetHeight };
}

/**
 * Sanitizes and generates a unique filename for the processed image
 */
export function generateSafeFilename(originalName, mimeType, usedNames = new Set()) {
  const safeOriginal = (originalName || 'image').trim();
  const lastDot = safeOriginal.lastIndexOf('.');

  let ext = '';
  let rawBase = safeOriginal;

  if (lastDot > 0) {
    ext = safeOriginal.slice(lastDot);
    rawBase = safeOriginal.slice(0, lastDot);
  } else {
    if (mimeType === 'image/png') ext = '.png';
    else if (mimeType === 'image/webp') ext = '.webp';
    else ext = '.jpg';
  }

  // Windows-safe filename characters
  const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || 'image';

  let candidate = `${cleanBase}_tagged${ext}`;
  if (!usedNames.has(candidate)) {
    usedNames.add(candidate);
    return candidate;
  }

  let counter = 1;
  while (usedNames.has(`${cleanBase}_tagged_${counter}${ext}`)) {
    counter++;
  }
  candidate = `${cleanBase}_tagged_${counter}${ext}`;
  usedNames.add(candidate);
  return candidate;
}

/**
 * Processes a single image file on an HTML5 canvas and applies watermark
 * @param {object} imageItem - { id, file, originalName, previewUrl, type }
 * @param {object} tagSettings - { tagType, tagText, tagColor, tagOpacity, position, scale, customPos }
 * @param {object|null} tagImage - { file, originalName, previewUrl }
 * @param {Set} usedNames - Set of filenames already used
 * @returns {Promise<{ blob: Blob, filename: string, previewUrl: string, originalId: string }>}
 */
export async function processSingleImage(imageItem, tagSettings, tagImage, usedNames = new Set()) {
  const {
    tagType = 'image',
    tagText = '',
    tagColor = '#ffffff',
    tagOpacity = 100,
    position = 'bottom-right',
    scale = 25,
    customPos = null,
  } = tagSettings;

  // Load the main image (full natural resolution)
  const mainImgSource = imageItem.file || imageItem.previewUrl;
  const mainImg = await loadImage(mainImgSource);

  const imgW = mainImg.naturalWidth || mainImg.width;
  const imgH = mainImg.naturalHeight || mainImg.height;

  if (!imgW || !imgH) {
    throw new Error(`Invalid image dimensions: ${imgW}x${imgH}`);
  }

  // Create full-resolution canvas
  const canvas = document.createElement('canvas');
  canvas.width = imgW;
  canvas.height = imgH;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // Draw base image
  ctx.drawImage(mainImg, 0, 0, imgW, imgH);

  // Apply watermark
  const opacityVal = Math.max(0, Math.min(1, tagOpacity / 100));

  if (tagType === 'image' && tagImage) {
    const tagSource = tagImage.file || tagImage.previewUrl;
    const tagImg = await loadImage(tagSource);

    const tagNaturalW = tagImg.naturalWidth || tagImg.width;
    const tagNaturalH = tagImg.naturalHeight || tagImg.height;

    const { x, y, width: targetW, height: targetH } = calculateWatermarkCoordinates({
      imageWidth: imgW,
      imageHeight: imgH,
      watermarkWidth: tagNaturalW,
      watermarkHeight: tagNaturalH,
      scale: Number(scale),
      position,
      customPos,
    });

    ctx.save();
    ctx.globalAlpha = opacityVal;
    ctx.drawImage(tagImg, x, y, targetW, targetH);
    ctx.restore();

  } else if (tagType === 'text' && tagText && tagText.trim().length > 0) {
    // Relative font size proportional to image width (scale/1000)
    const fontSize = Math.max(14, Math.round(imgW * (Number(scale) / 1000)));

    ctx.save();
    ctx.globalAlpha = opacityVal;
    ctx.font = `800 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = tagColor || '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = Math.max(4, Math.round(fontSize * 0.16));
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.max(2, Math.round(fontSize * 0.05));

    // Calculate text position
    let textX = 0;
    let textY = 0;

    if (position === 'custom' && customPos) {
      textX = (customPos.x / 100) * imgW;
      textY = (customPos.y / 100) * imgH;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    } else {
      switch (position) {
        case 'top-left':
          textX = imgW * 0.02;
          textY = imgH * 0.02;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          break;
        case 'top-right':
          textX = imgW * 0.98;
          textY = imgH * 0.02;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          break;
        case 'bottom-left':
          textX = imgW * 0.02;
          textY = imgH * 0.98;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          break;
        case 'center':
          textX = imgW * 0.5;
          textY = imgH * 0.5;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          break;
        case 'bottom-right':
        default:
          textX = imgW * 0.98;
          textY = imgH * 0.98;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          break;
      }
    }

    ctx.fillText(tagText, textX, textY);
    ctx.restore();
  }

  // Determine output MIME type
  let outputMimeType = imageItem.type || imageItem.file?.type || 'image/jpeg';
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(outputMimeType)) {
    outputMimeType = 'image/jpeg';
  }

  const quality = outputMimeType === 'image/png' ? undefined : 0.92;

  // Convert canvas to Blob
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Canvas toBlob failed to create image'));
    }, outputMimeType, quality);
  });

  // Release canvas memory buffer
  canvas.width = 0;
  canvas.height = 0;

  const filename = generateSafeFilename(imageItem.originalName, outputMimeType, usedNames);
  const previewUrl = URL.createObjectURL(blob);

  return {
    blob,
    filename,
    previewUrl,
    originalId: imageItem.id,
  };
}

/**
 * Sequentially watermarks all images in the browser and packages them into a ZIP
 * @param {Array} images - List of image objects
 * @param {object} tagSettings - Watermark configurations
 * @param {object|null} tagImage - Watermark image object
 * @param {Function} onProgress - Callback (info: { current, total, percent, filename })
 * @returns {Promise<{ zipBlob: Blob, processedImages: Array, failedCount: number }>}
 */
export async function batchWatermarkAndZip(images, tagSettings, tagImage, onProgress = null) {
  if (!images || images.length === 0) {
    throw new Error('No images provided for processing.');
  }

  const zip = new JSZip();
  const usedNames = new Set();
  const processedImages = [];
  let failedCount = 0;

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    try {
      const processed = await processSingleImage(item, tagSettings, tagImage, usedNames);
      processedImages.push(processed);

      // Add to ZIP
      zip.file(processed.filename, processed.blob);

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: images.length,
          percent: Math.round(((i + 1) / images.length) * 100),
          filename: processed.filename,
        });
      }
    } catch (err) {
      console.error(`Failed to watermark image ${item.originalName}:`, err);
      failedCount++;
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: images.length,
          percent: Math.round(((i + 1) / images.length) * 100),
          filename: item.originalName,
          error: err.message,
        });
      }
    }

    // Small yield to allow UI update/reflow
    await new Promise((res) => setTimeout(res, 10));
  }

  if (processedImages.length === 0) {
    throw new Error('All images failed to process.');
  }

  // Generate ZIP file
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return {
    zipBlob,
    processedImages,
    failedCount,
  };
}

/**
 * Downloads a Blob directly to user's device
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadFile(blob, filename) {
  try {
    saveAs(blob, filename);
  } catch {
    // Fallback if file-saver encounters environment issues
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
