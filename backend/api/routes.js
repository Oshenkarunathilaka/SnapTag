const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { processImage } = require('../image-processor/processor');

const router = express.Router();

// Ensure directories exist
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const TAGS_DIR = path.join(__dirname, '../../tags');
const OUTPUT_DIR = path.join(__dirname, '../../output');

[UPLOADS_DIR, TAGS_DIR, OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'tag') {
            cb(null, TAGS_DIR);
        } else {
            cb(null, UPLOADS_DIR);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ storage: storage });

// Temporary state to hold session data (In a real app, use a DB or Redis)
let sessionData = {
    images: [],
    tag: null,
    processedImages: []
};


// 1. Upload Images
const uploadImagesHandler = upload.array('images', 5000);

router.post('/upload-images', (req, res) => {
    uploadImagesHandler(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ error: err.message });
        }
        
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }
            
            const newImages = req.files.map(f => ({
                id: f.filename,
                originalName: f.originalname,
                path: f.path,
                filename: f.filename
            }));
            
            sessionData.images = [...sessionData.images, ...newImages];
            
            res.json({ message: 'Images uploaded successfully', images: sessionData.images });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
});

// 2. Upload Tag PNG
router.post('/upload-tag', upload.single('tag'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No tag uploaded.' });
        }
        sessionData.tag = {
            id: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            filename: req.file.filename
        };
        res.json({ message: 'Tag uploaded successfully', tag: sessionData.tag });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Clear Session / Remove specific images
router.post('/remove-image', express.json(), (req, res) => {
    const { id } = req.body;
    sessionData.images = sessionData.images.filter(img => img.id !== id);
    res.json({ message: 'Image removed', images: sessionData.images });
});

router.post('/clear', (req, res) => {
    sessionData = { images: [], tag: null, processedImages: [] };
    // Optionally clean up files from disk
    res.json({ message: 'Session cleared' });
});

// 4. Process Images
router.post('/process', express.json(), async (req, res) => {
    try {
        const { tagType, tagText, tagColor, tagOpacity, customPos, position, scale, customWidth, customHeight, customX, customY } = req.body;
        
        if (tagType !== 'text' && !sessionData.tag) {
            return res.status(400).json({ error: 'No tag uploaded yet.' });
        }
        if (tagType === 'text' && !tagText) {
            return res.status(400).json({ error: 'No text provided.' });
        }
        if (sessionData.images.length === 0) {
            return res.status(400).json({ error: 'No images uploaded yet.' });
        }

        sessionData.processedImages = [];
        
        const settings = {
            tagType,
            tagText,
            tagColor,
            tagOpacity,
            customPos,
            position, 
            scale,
            customWidth,
            customHeight,
            x: customX,
            y: customY
        };

        for (const img of sessionData.images) {
            // Generate output filename
            const ext = path.extname(img.originalName);
            const baseName = path.basename(img.originalName, ext);
            const outputFilename = `${baseName}_tagged${ext}`;
            const outputPath = path.join(OUTPUT_DIR, outputFilename);
            
            try {
                await processImage(img.path, sessionData.tag ? sessionData.tag.path : null, outputPath, settings);
                
                sessionData.processedImages.push({
                    originalId: img.id,
                    filename: outputFilename,
                    path: outputPath
                });
            } catch (err) {
                console.error(`Skipping image ${img.originalName} due to processing error:`, err.message);
            }
        }

        res.json({ 
            message: 'Processing complete', 
            processedCount: sessionData.processedImages.length,
            processedImages: sessionData.processedImages.map(img => img.filename)
        });
    } catch (err) {
        console.error('Processing error:', err);
        res.status(500).json({ error: 'Failed to process images.' });
    }
});

// 5. Download ZIP
router.get('/download-zip', (req, res) => {
    if (sessionData.processedImages.length === 0) {
        return res.status(400).json({ error: 'No processed images available.' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.attachment('snaptag_results.zip');
    
    archive.on('error', (err) => {
        res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    sessionData.processedImages.forEach(img => {
        archive.file(img.path, { name: img.filename });
    });

    archive.finalize();
});

// Serve static files for previewing
router.use('/uploads', express.static(UPLOADS_DIR));
router.use('/tags', express.static(TAGS_DIR));
router.use('/output', express.static(OUTPUT_DIR));

module.exports = router;
