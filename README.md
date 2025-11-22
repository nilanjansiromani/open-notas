# Open Notas - Chrome Extension

A lightweight note-taking overlay Chrome extension powered by Tiptap editor.

## Features

- 📝 **Tiptap Editor**: Rich text editing with formatting options
- ✅ **Todo Management**: Create, check off, and delete todos
- 💾 **Persistent Storage**: All notes are saved to Chrome storage
- 🎨 **Clean UI**: Beautiful, lightweight overlay (30% width)
- ⌨️ **Keyboard Shortcut**: Press `Ctrl+Shift+N` to toggle the overlay
- 📱 **Multi-Note Support**: Create and manage multiple notes
- 🔄 **Auto-save**: Notes are automatically saved as you type

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome browser

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd open-notas
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

### Loading into Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `/dist` folder from this project
5. The extension should now appear in your extensions list

## Usage

### Taking Notes

1. Press `Ctrl+Shift+N` on any website to open the notes overlay
2. Start typing to create a note
3. Use the editor toolbar for formatting:
   - **Bold**: Use keyboard shortcut or toolbar
   - **Italic**: Use keyboard shortcut or toolbar
   - **Headings**: Convert paragraphs to headings
   - **Lists**: Create bullet or numbered lists
   - **Code blocks**: Add code with syntax highlighting

### Managing Todos

1. In the "Todos" section, click "+ Add Todo"
2. Type your todo item and press Enter or click "Add"
3. Check off completed todos
4. Delete todos by clicking the ✕ button

### Managing Notes

- **Create Note**: Click "+ New Note" button to create a new note
- **Switch Notes**: Click on any note in the notes list to switch to it
- **Delete Note**: Click the ✕ button next to a note to delete it
- **Note Preview**: The notes list shows a preview of the first 30 characters

### Keyboard Shortcuts

- `Ctrl+Shift+N`: Toggle the notes overlay open/closed
- `Ctrl+B`: Bold text
- `Ctrl+I`: Italic text
- `Ctrl+Alt+1`: Heading 1
- `Ctrl+Alt+2`: Heading 2
- `Ctrl+Alt+3`: Heading 3
- `Enter` (in todo input): Add todo

## Development

### Project Structure

```
open-notas/
├── src/
│   ├── background/       # Service worker
│   ├── content/          # Content script (injected into pages)
│   ├── components/       # React components
│   ├── utils/            # Utility functions
│   └── styles/           # CSS styles
├── public/
│   └── manifest.json     # Chrome extension manifest
├── dist/                 # Built extension files
├── package.json
├── tsconfig.json
├── webpack.config.js
└── .babelrc
```

### Development Workflow

1. Start webpack in watch mode:
```bash
npm run dev
```

2. Load the extension in Chrome from the `dist` folder
3. Make changes to the code
4. Webpack will automatically rebuild
5. Click the refresh button in `chrome://extensions/` to reload the extension

### Building for Production

```bash
npm run build
```

This creates optimized production builds in the `dist` folder.

## Data Storage

All notes and todos are stored in Chrome's local storage (`chrome.storage.local`). This means:

- ✅ Data persists even after closing the browser
- ✅ Data is specific to your user profile
- ✅ Data is synced across devices if you're signed into Chrome
- ✅ Data is local to your computer (not cloud-stored)

## Technologies Used

- **React 18**: UI framework
- **Tiptap 2**: Rich text editor
- **TypeScript**: Type safety
- **Webpack 5**: Module bundler
- **Babel**: JavaScript transpiler
- **Chrome Storage API**: Data persistence

## Troubleshooting

### Extension not loading
- Make sure the `dist` folder exists and contains the built files
- Run `npm run build` to generate the dist folder
- Clear the cache by removing and re-adding the extension

### Notes not saving
- Check that the extension has permission to use Chrome storage
- Open DevTools (F12) and check the Console for errors
- Verify that `chrome.storage.local` is accessible in your Chrome version

### Overlay not appearing
- Make sure the keyboard shortcut `Ctrl+Shift+N` is not conflicting with other extensions
- Try on a different website to ensure it's not blocked by site policies
- Check the extension's permissions in `chrome://extensions/`

### Styles not loading
- Clear the browser cache (Ctrl+Shift+Delete)
- Rebuild the extension (`npm run build`)
- Reload the extension in `chrome://extensions/`

## Future Enhancements

- [ ] Cloud sync (Google Drive, OneDrive)
- [ ] Note categories/tags
- [ ] Search and filtering
- [ ] Note export (PDF, Markdown)
- [ ] Customizable keyboard shortcuts
- [ ] Theme support (dark mode)
- [ ] Note sharing
- [ ] Collaborative editing

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
