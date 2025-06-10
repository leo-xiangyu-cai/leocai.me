/**
 * Script to generate posts-list.json from the blog/posts directory
 * Run this script whenever you add or update blog posts
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_FILE = path.join(__dirname, 'posts-list.json');

// Function to extract metadata from a markdown file
function extractMetadata(filePath, filename) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Try to parse frontmatter if it exists
    try {
      const { data } = matter(fileContent);
      return {
        filename,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : filename.substring(0, 10),
        title: data.title || getTitleFromContent(fileContent) || filename.substring(11).replace(/-/g, ' ').replace('.md', ''),
        url: `/blog/post.html?post=${filename.replace('.md', '')}`
      };
    } catch (e) {
      // If frontmatter parsing fails, extract title from content
      return {
        filename,
        date: filename.substring(0, 10),
        title: getTitleFromContent(fileContent) || filename.substring(11).replace(/-/g, ' ').replace('.md', ''),
        url: `/blog/post.html?post=${filename.replace('.md', '')}`
      };
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return {
      filename,
      date: filename.substring(0, 10),
      title: filename.substring(11).replace(/-/g, ' ').replace('.md', ''),
      url: `/blog/post.html?post=${filename.replace('.md', '')}`
    };
  }
}

// Function to extract title from markdown content
function getTitleFromContent(content) {
  // Look for the first heading (# Title)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return null;
}

// Main function
function generatePostsList() {
  try {
    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      console.error(`Posts directory not found: ${POSTS_DIR}`);
      return;
    }

    // Get all markdown files
    const files = fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.md'))
      .filter(file => /^\d{4}-\d{2}-\d{2}-.*\.md$/.test(file)); // Ensure filename starts with date format

    // Extract metadata from each file
    const postsList = files.map(filename => {
      const filePath = path.join(POSTS_DIR, filename);
      return extractMetadata(filePath, filename);
    });

    // Sort by date (newest first)
    postsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(postsList, null, 2));
    console.log(`Successfully generated ${OUTPUT_FILE} with ${postsList.length} posts`);
  } catch (error) {
    console.error('Error generating posts list:', error);
  }
}

// Run the generator
generatePostsList();
