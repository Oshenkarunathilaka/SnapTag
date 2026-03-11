const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Process a single image
 * @param {string} inputImagePath - Path to the original image
 * @param {string} tagImagePath - Path to the tag PNG (null for text)
 * @param {string} outputImagePath - Path to save the processed image
 * @param {object} settings - Tag settings
 */
async function processImage(inputImagePath, tagImagePath, outputImagePath, settings) {
  try {
    const { 
      tagType = 'image', tagText, tagColor = '#ffffff', tagOpacity = 100, customPos,
      position = 'bottom-right', scale = 100, customWidth, customHeight 
    } = settings;

    // Load main image to get its metadata
    const mainImage = sharp(inputImagePath);
    const mainMetadata = await mainImage.metadata();
    
    let tagBuffer;
    let compositeOptions = {};

    if (tagType === 'text') {
      // TEXT WATERMARK using SVG
      // Calculate font size relative to main image width based on scale
      const fontSize = Math.max(12, Math.round(mainMetadata.width * (scale / 1000)));
      const opacityVal = tagOpacity / 100;
      
      // Determine SVG position
      let x = '50%';
      let y = '50%';
      let textAnchor = 'middle';
      let dominantBaseline = 'middle';
      
      if (position === 'custom' && customPos) {
        x = `${customPos.x}%`;
        y = `${customPos.y}%`;
      } else {
         switch (position) {
          case 'top-left': x = '2%'; y = '2%'; textAnchor = 'start'; dominantBaseline = 'hanging'; break;
          case 'top-right': x = '98%'; y = '2%'; textAnchor = 'end'; dominantBaseline = 'hanging'; break;
          case 'bottom-left': x = '2%'; y = '98%'; textAnchor = 'start'; dominantBaseline = 'auto'; break;
          case 'bottom-right': x = '98%'; y = '98%'; textAnchor = 'end'; dominantBaseline = 'auto'; break;
          case 'center': break; // already default
        }
      }

      // Escape text safely for SVG
      const safeText = tagText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      const svgString = `
        <svg width="${mainMetadata.width}" height="${mainMetadata.height}">
          <style>
            .text {
              font-family: sans-serif;
              font-weight: bold;
              font-size: ${fontSize}px;
              fill: ${tagColor};
              opacity: ${opacityVal};
            }
          </style>
          <text x="${x}" y="${y}" class="text" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}">${safeText}</text>
        </svg>
      `;
      
      tagBuffer = Buffer.from(svgString);
      compositeOptions.input = tagBuffer;
      compositeOptions.top = 0;
      compositeOptions.left = 0;

    } else {
      // IMAGE WATERMARK
      let tagSharp = sharp(tagImagePath);
      const tagMetadata = await tagSharp.metadata();

      let resizeOptions = {};
      if (customWidth || customHeight) {
        if (customWidth) resizeOptions.width = parseInt(customWidth, 10);
        if (customHeight) resizeOptions.height = parseInt(customHeight, 10);
      } else {
        const scaleFraction = parseInt(scale, 10) / 100;
        resizeOptions.width = Math.max(1, Math.round(mainMetadata.width * scaleFraction));
      }
      
      tagSharp = tagSharp.resize({ ...resizeOptions, fit: 'inside' });
      tagBuffer = await tagSharp.toBuffer();
      
      // Apply Opacity to image watermark
      const opacityVal = tagOpacity / 100;
      if (opacityVal < 1) {
        tagBuffer = await sharp(tagBuffer)
          .ensureAlpha()
          .composite([{
              input: Buffer.from([255, 255, 255, Math.round(opacityVal * 255)]),
              raw: { width: 1, height: 1, channels: 4 },
              tile: true,
              blend: 'dest-in'
          }])
          .toBuffer();
      }

      const finalTagMetadata = await sharp(tagBuffer).metadata();
      compositeOptions.input = tagBuffer;

      // Determine position
      if (position === 'custom' && customPos) {
        const left = Math.round((customPos.x / 100) * mainMetadata.width - finalTagMetadata.width / 2);
        const top = Math.round((customPos.y / 100) * mainMetadata.height - finalTagMetadata.height / 2);
        
        // Clamp to prevent out of bounds errors in Sharp
        // Note: Sharp sometimes allows negative top/left in newer versions, but clamping is safer.
        compositeOptions.left = Math.max(0, Math.min(mainMetadata.width - finalTagMetadata.width, left));
        compositeOptions.top = Math.max(0, Math.min(mainMetadata.height - finalTagMetadata.height, top));
      } else {
        let gravity = sharp.gravity.southeast; // Default: bottom-right
        switch (position) {
          case 'top-left': gravity = sharp.gravity.northwest; break;
          case 'top-right': gravity = sharp.gravity.northeast; break;
          case 'bottom-left': gravity = sharp.gravity.southwest; break;
          case 'bottom-right': gravity = sharp.gravity.southeast; break;
          case 'center': gravity = sharp.gravity.center; break;
        }
        compositeOptions.gravity = gravity;
      }
    }

    // Process and save
    await mainImage
      .composite([compositeOptions])
      .toFile(outputImagePath);

    return { success: true, path: outputImagePath };
  } catch (error) {
    console.error('Error processing image:', inputImagePath, tagImagePath, error.message, error.stack);
    throw error;
  }
}

module.exports = {
  processImage
};
