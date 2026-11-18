const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./api/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api', apiRoutes);

// Serve project images if requested
const IMAGES_DIR = path.join(__dirname, '../Images');
if (fs.existsSync(IMAGES_DIR)) {
    app.use('/project-images', express.static(IMAGES_DIR));
}

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SnapTag API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
