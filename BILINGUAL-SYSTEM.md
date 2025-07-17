# Bilingual Content System

## Overview

This portfolio uses an intelligent bilingual content system that automatically detects and displays content in both Spanish (ES) and English (EN).

## How It Works

### 1. Directory Scanning
The system automatically scans for bilingual content files using a two-step approach:

1. **Primary Method**: Uses generated directory listings (`directory-listing.json`)
2. **Fallback Method**: Verifies known files if directory listing is unavailable

### 2. File Naming Convention
All bilingual content must follow this naming pattern:
- Spanish version: `filename_ES.md`
- English version: `filename_EN.md`

Example:
```
src/content/projects/
├── remote-sensing_ES.md
├── remote-sensing_EN.md
├── chatbot-ela-static_ES.md
└── chatbot-ela-static_EN.md
```

### 3. Automatic Discovery
The system will automatically detect and display any new bilingual content you add, as long as both language versions exist.

## Adding New Content

### Step 1: Create Content Files
Create two markdown files with the same base name:
```bash
# For projects
src/content/projects/my-new-project_ES.md
src/content/projects/my-new-project_EN.md

# For writing/articles
src/content/writing/my-new-article_ES.md
src/content/writing/my-new-article_EN.md
```

### Step 2: Update Directory Listings
Run the scan command to update the directory listings:
```bash
npm run scan-content
```

This will:
- ✅ Scan both `projects` and `writing` directories
- ✅ Identify all bilingual file pairs
- ✅ Generate `directory-listing.json` files
- ✅ Show a summary of discovered content

### Step 3: Refresh the Website
The new content will automatically appear on the website after refreshing.

## File Structure

```
src/content/
├── projects/
│   ├── directory-listing.json          # Auto-generated
│   ├── remote-sensing_ES.md
│   ├── remote-sensing_EN.md
│   ├── chatbot-ela-static_ES.md
│   ├── chatbot-ela-static_EN.md
│   └── ...
└── writing/
    ├── directory-listing.json          # Auto-generated
    ├── felix_ES.md
    ├── felix_EN.md
    ├── ai-epistemological-lens_ES.md
    ├── ai-epistemological-lens_EN.md
    └── ...
```

## Current Content

### Projects (5 bilingual pairs)
- `remote-sensing` - Remote sensing and satellite data analysis
- `chatbot-ela-static` - AI communication system for ALS patients
- `chatbot-ela` - Enhanced ELA communication chatbot
- `linguistic-reconstruction` - Historical linguistics with embeddings
- `un-data-clustering` - UN SDG data analysis and clustering

### Writing (4 bilingual pairs)
- `felix` - Adventure and exploration writing
- `ai-epistemological-lens` - AI and philosophy essay
- `language-cognitive-tech` - Language and cognitive technology
- `rivers-complex-systems` - Rivers as complex systems

## Features

### ✅ Automatic Content Detection
- No need to manually update JavaScript code
- System discovers new content automatically
- Supports unlimited bilingual content pairs

### ✅ Smooth Language Switching
- Instant language switching on main page
- Smooth transitions in content pages
- Maintains context when switching languages

### ✅ Error Handling
- Graceful fallback if files are missing
- Clear console logging for debugging
- Verification of file availability

### ✅ Performance Optimized
- Uses directory listings for fast discovery
- Batch processing to avoid server overload
- Efficient caching and loading strategies

## Development Commands

```bash
# Scan and update directory listings
npm run scan-content

# Start development server
npm run dev

# Build for production
npm run build
```

## Console Output Example

When running `npm run scan-content`:

```
🔍 Scanning directories for bilingual content...

✅ Generated listing for src/content/projects:
   📁 Total files: 15
   🌐 Bilingual pairs: 5
      - chatbot-ela-static (ES & EN)
      - linguistic-reconstruction (ES & EN)
      - remote-sensing (ES & EN)
      - un-data-clustering (ES & EN)
   💾 Saved to: src/content/projects/directory-listing.json

✅ Generated listing for src/content/writing:
   📁 Total files: 8
   🌐 Bilingual pairs: 4
      - felix (ES & EN)
      - ai-epistemological-lens (ES & EN)
      - language-cognitive-tech (ES & EN)
      - rivers-complex-systems (ES & EN)
   💾 Saved to: src/content/writing/directory-listing.json

✨ Directory listing generation complete!
```

## Troubleshooting

### Content Not Appearing?
1. Check that both `_ES.md` and `_EN.md` files exist
2. Run `npm run scan-content` to update directory listings
3. Check browser console for error messages
4. Verify file paths and naming conventions

### Language Switching Issues?
1. Check that both language versions have the same base filename
2. Verify frontmatter is properly formatted in both files
3. Check browser console for loading errors

This system provides a robust, scalable solution for managing bilingual content that grows with your portfolio!