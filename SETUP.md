# Open Notas - Setup & Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will create a `dist/` folder with all the compiled files including:
- `manifest.json` - Chrome extension manifest
- `background.js` - Service worker
- `content.js` - Content script
- `overlay.js` - UI bundle (React + Tiptap)

### 3. Load into Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right corner)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from this project
5. The extension should appear in your extensions list

### 4. Test It Out

1. Visit any website (e.g., google.com)
2. Press **`Ctrl+Shift+N`** (or `Cmd+Shift+N` on Mac)
3. The notes overlay should appear on the right side (30% width)
4. Start taking notes!

## Development Workflow

### Watch Mode

For development, use watch mode to automatically rebuild on file changes:

```bash
npm run dev
```

Then reload the extension in `chrome://extensions/` after changes:
1. Find "Open Notas" in the extensions list
2. Click the refresh icon
3. Your changes should be live

### Project Structure

```
open-notas/
├── src/
│   ├── background/
│   │   └── index.ts          # Service worker (background tasks)
│   ├── content/
│   │   └── index.ts          # Content script (runs on every page)
│   ├── components/
│   │   ├── Overlay.tsx       # Main React component
│   │   └── index.tsx         # Entry point & React mount
│   ├── utils/
│   │   └── storage.ts        # Chrome storage utilities
│   └── styles/
│       └── overlay.css       # Overlay UI styles
├── public/
│   └── manifest.json         # Chrome extension manifest (copied to dist)
├── dist/                     # Built files (generated)
├── webpack.config.js         # Webpack build configuration
├── tsconfig.json            # TypeScript configuration
├── .babelrc                 # Babel configuration
└── package.json             # Project dependencies
```

## How It Works

### Keyboard Shortcut
- Press `Ctrl+Shift+N` on any website
- Injects an overlay container into the page
- Loads React component and starts the note-taking app

### Note Storage
- All data is stored in `chrome.storage.local`
- Persists across browser sessions
- Syncs across devices if signed into Chrome
- No external backend or cloud storage required

### Components

1. **Content Script** (`src/content/index.ts`)
   - Listens for `Ctrl+Shift+N` shortcut
   - Injects overlay div and UI script
   - Handles overlay toggle

2. **Overlay UI** (`src/components/Overlay.tsx`)
   - React component with Tiptap editor
   - Todo management
   - Note switching and creation
   - Auto-saves to Chrome storage

3. **Background Service Worker** (`src/background/index.ts`)
   - Handles background messaging
   - Can be extended for sync, notifications, etc.

## Features

✅ Rich text editing with Tiptap  
✅ Todo management (create, check, delete)  
✅ Multiple note support  
✅ Auto-save functionality  
✅ Persistent storage  
✅ Clean, minimal UI  
✅ Works on any website  

## Troubleshooting

### Extension doesn't load
- Make sure `dist/manifest.json` exists
- Run `npm run build` again
- Check for errors in `chrome://extensions/`

### Overlay not appearing
- Try pressing `Ctrl+Shift+N` on a different website
- Check that no other extension uses this shortcut
- Open DevTools (F12) and check Console for errors

### Notes not saving
- Check Chrome permissions for the extension
- Open DevTools and look for storage errors
- Verify `chrome.storage.local` access

### Build errors
- Delete `node_modules` and `dist` folders
- Run `npm install` and `npm run build` again
- Check Node.js version (requires v14+)

## Customization

### Change keyboard shortcut
Edit `src/content/index.ts`:
```typescript
// Change 'KeyN' to any other key
if (event.ctrlKey && event.shiftKey && event.code === 'KeyN') {
```

### Adjust overlay width
Edit `src/content/index.ts`:
```typescript
width: 30%;  // Change this percentage
```

### Customize editor toolbar
Edit `src/components/Overlay.tsx` and `webpack.config.js` to add more Tiptap extensions:
```typescript
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
// ... add to extensions array
```

## Building for Distribution

```bash
npm run build
```

The `dist/` folder is ready to:
1. Load locally in Chrome
2. Publish to Chrome Web Store (requires packaging as .crx)
3. Share as unpacked extension

## License

ISC

## Support

For issues or questions, refer to:
- [Tiptap Documentation](https://tiptap.dev)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
