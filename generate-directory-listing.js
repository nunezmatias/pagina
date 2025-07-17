#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate directory listings for bilingual content discovery
 */
function generateDirectoryListing() {
    const directories = [
        'src/content/projects',
        'src/content/writing'
    ];

    directories.forEach(dir => {
        try {
            const files = fs.readdirSync(dir);
            const bilingualFiles = extractBilingualBasenames(files);
            
            const listing = {
                directory: dir,
                timestamp: new Date().toISOString(),
                totalFiles: files.length,
                bilingualFiles: bilingualFiles,
                allFiles: files
            };

            // Write to the directory for the web server to access
            const outputPath = path.join(dir, 'directory-listing.json');
            fs.writeFileSync(outputPath, JSON.stringify(listing, null, 2));
            
            console.log(`✅ Generated listing for ${dir}:`);
            console.log(`   📁 Total files: ${files.length}`);
            console.log(`   🌐 Bilingual pairs: ${bilingualFiles.length}`);
            bilingualFiles.forEach(file => {
                console.log(`      - ${file} (ES & EN)`);
            });
            console.log(`   💾 Saved to: ${outputPath}`);
            console.log('');
            
        } catch (error) {
            console.error(`❌ Error processing ${dir}:`, error.message);
        }
    });
}

function extractBilingualBasenames(fileList) {
    const basenames = new Set();
    const esFiles = fileList.filter(file => file.endsWith('_ES.md'));
    const enFiles = fileList.filter(file => file.endsWith('_EN.md'));
    
    esFiles.forEach(file => {
        const basename = file.replace('_ES.md', '');
        if (enFiles.includes(`${basename}_EN.md`)) {
            basenames.add(basename);
        }
    });
    
    return Array.from(basenames);
}

// Run the script
console.log('🔍 Scanning directories for bilingual content...\n');
generateDirectoryListing();
console.log('✨ Directory listing generation complete!');