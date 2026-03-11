# SnapTag — Bulk Image Watermarking Tool

> Upload hundreds of images at once and apply a PNG logo or text watermark to all of them in seconds.

![SnapTag UI](./logo%202.png)

---

## ✨ Features

- **Bulk Upload** — drag & drop or click-to-browse; handles hundreds of images in batched requests
- **PNG Image Watermark** — overlay any transparent PNG at a configurable position, size, and opacity
- **Text Stamp** — render custom text watermarks with your choice of colour and opacity
- **Live Preview** — click or drag the watermark directly on a preview image to fine-tune position
- **5 Position Presets** — Top Left · Top Right · Bottom Left · Bottom Right · Center — plus free-drag custom placement
- **Batch Processing** — powered by [Sharp](https://sharp.pixelplumbing.com/); all images processed server-side
- **One-click ZIP Download** — download all tagged images as a single `.zip` archive
- **Processing Animation** — real-time overlay with spinner, progress bar, bouncing dots, and animated success checkmark

---

## 🗂️ Project Structure

```
SnapTag/
├── backend/
│   ├── api/
│   │   └── routes.js          # REST API endpoints
│   ├── image-processor/
│   │   └── processor.js       # Sharp-based image compositing engine
│   ├── server.js              # Express server (port 3001)
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx  # Main workflow UI + processing overlay
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── TagSettings.jsx
│   │   │   ├── PreviewPanel.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   └── index.css          # Design system & animations
│   └── package.json
│
├── uploads/   # Temporary uploaded source images
├── tags/      # Uploaded watermark PNGs
└── output/    # Processed result images
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v18 + |
| npm | v9 + |

### 1 · Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2 · Run the Backend

```bash
cd backend
node server.js
# → Server running on http://localhost:3001
```

### 3 · Run the Frontend

```bash
cd frontend
npm run dev
# → App available at http://localhost:5173
```

---

## 🔌 API Reference

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload-images` | Upload source images (`multipart/form-data`, field: `images`) |
| `POST` | `/upload-tag` | Upload watermark PNG (`multipart/form-data`, field: `tag`) |
| `POST` | `/process` | Process all uploaded images with current settings |
| `GET` | `/download-zip` | Download all processed images as a ZIP |
| `POST` | `/remove-image` | Remove a specific image from the session (`{ id }`) |
| `POST` | `/clear` | Clear the current session |
| `GET` | `/uploads/:file` | Serve uploaded source images |
| `GET` | `/tags/:file` | Serve uploaded watermark files |
| `GET` | `/output/:file` | Serve processed output images |
| `GET` | `/health` | Health check |

### `POST /api/process` — Request Body

```json
{
  "tagType":    "image",            // "image" | "text"
  "tagText":    "© 2024 MyBrand",  // used when tagType = "text"
  "tagColor":   "#ffffff",
  "tagOpacity": 80,                 // 0–100
  "position":   "bottom-right",    // "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom"
  "scale":      25,                 // % of image width
  "customPos":  { "x": 75, "y": 90 } // used when position = "custom"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Lucide Icons |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js, Express 5 |
| Image Processing | [Sharp](https://sharp.pixelplumbing.com/) |
| File Upload | Multer |
| ZIP Export | Archiver |

---

## 📸 UI Walkthrough

1. **Upload Images** — drag & drop your source photos into the upload zone
2. **Set Up Watermark** — choose "Image PNG" (upload a transparent .png logo) or "Text Stamp" (type your text and pick a colour)
3. **Preview & Position** — click or drag on the live preview to position the watermark exactly where you want it
4. **Adjust Size & Opacity** — use the sliders to scale and fade the watermark
5. **Start Processing** — click the **Start Processing** button; watch the animated overlay as your images are processed in bulk
6. **Download** — click **Download ZIP** to get all tagged images in one file

---

## ⚙️ Configuration

| Setting | Default | Notes |
|---------|---------|-------|
| Backend Port | `3001` | Set `PORT` env variable to override |
| Max images per batch | `50` | Configured in `ImageUpload.jsx` |
| Max upload limit | `50 MB` per request | Set in `server.js` |
| Max files per upload | `5000` | Set in `routes.js` |

---

## 📝 License

MIT © SnapTag
