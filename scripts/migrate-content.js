import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contentDir = path.join(__dirname, '../src/content/docs');

// Function to recursively find all MDX files
function findMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to migrate a single file
function migrateFile(filePath) {
  console.log(`Migrating: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove category field from frontmatter
  if (content.includes('category:')) {
    content = content.replace(/^category:.*$/m, '');
    modified = true;
  }

  // Update lastUpdated format from string to date (remove quotes)
  const lastUpdatedMatch = content.match(/lastUpdated:\s*["'](\d{4}-\d{2}-\d{2})["']/);
  if (lastUpdatedMatch) {
    content = content.replace(
      /lastUpdated:\s*["'](\d{4}-\d{2}-\d{2})["']/,
      'lastUpdated: $1'
    );
    modified = true;
  }

  // Update internal links - remove /docs/ prefix
  if (content.includes('/docs/')) {
    content = content.replace(/\/docs\//g, '/');
    modified = true;
  }

  // Replace Alert components with Aside components
  if (content.includes('<Alert')) {
    content = content.replace(/<Alert\s+type="info">/g, '<Aside type="note">');
    content = content.replace(/<Alert\s+type="warning">/g, '<Aside type="caution">');
    content = content.replace(/<Alert\s+type="success">/g, '<Aside type="tip">');
    content = content.replace(/<Alert\s+type="danger">/g, '<Aside type="danger">');
    content = content.replace(/<\/Alert>/g, '</Aside>');
    modified = true;
  }

  // Add Aside import if Aside component is used but import is missing
  if (content.includes('<Aside') && !content.includes("import { Aside }")) {
    // Find the end of frontmatter
    const frontmatterEnd = content.indexOf('---', 3) + 3;
    if (frontmatterEnd > 2) {
      content = content.slice(0, frontmatterEnd) +
        '\n\nimport { Aside } from \'@astrojs/starlight/components\';\n' +
        content.slice(frontmatterEnd);
      modified = true;
    }
  }

  // Clean up extra blank lines in frontmatter
  content = content.replace(/---\n([\s\S]*?)\n---/, (match, frontmatter) => {
    const cleaned = frontmatter.replace(/\n{3,}/g, '\n\n').replace(/\n\n+---/g, '\n---');
    return `---\n${cleaned}\n---`;
  });

  // Clean up multiple blank lines in content
  content = content.replace(/\n{4,}/g, '\n\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Updated`);
  } else {
    console.log(`  - No changes needed`);
  }
}

// Main execution
console.log('Starting content migration...\n');

const files = findMdxFiles(contentDir);
console.log(`Found ${files.length} files to process\n`);

files.forEach(migrateFile);

console.log('\n✅ Migration complete!');
console.log(`Processed ${files.length} files`);

