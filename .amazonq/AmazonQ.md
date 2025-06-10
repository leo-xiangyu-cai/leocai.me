# Leo Cai's Personal Website

This is a personal website and blog for Leo Cai, a Software Engineer at AWS Redshift. The site features a terminal-style UI and a blog section with markdown-based posts.

## Project Structure

- `/assets/` - CSS, JavaScript, and other static assets
  - `/assets/css/` - CSS stylesheets including terminal.css
  - `/assets/js/` - JavaScript files including matrix.js for background effects
- `/blog/` - Blog section of the website
  - `/blog/posts/` - Markdown files for individual blog posts
  - `/blog/index.html` - Blog listing page
  - `/blog/post.html` - Individual blog post template
- `/index.html` - Main landing page

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Styling**: Custom terminal-style UI
- **Blog**: Static markdown files with client-side rendering
- **Deployment**: AWS Amplify

## Blog System

The blog system uses a static approach:

1. Blog posts are written as markdown files in `/blog/posts/`
2. Post metadata is hardcoded in the JavaScript files
3. The post.html page uses marked.js to render markdown content
4. No build step is required - everything is client-side

## File Naming Conventions

- Blog posts: `YYYY-MM-DD-title-slug.md`
- CSS files: `name.css`
- JavaScript files: `name.js`

## Development Workflow

1. Edit HTML/CSS/JS files directly
2. Add new blog posts as markdown files in `/blog/posts/`
3. Update the blog post arrays in `blog/index.html` and `blog/post.html`
4. Commit and push to GitHub
5. AWS Amplify automatically deploys the changes

## Common Tasks

### Adding a New Blog Post

1. Create a new markdown file in `/blog/posts/` with the format `YYYY-MM-DD-title-slug.md`
2. Add the post metadata to the `blogPosts` array in `blog/index.html`
3. Add the post metadata to the `blogPosts` object in `blog/post.html`
4. Commit and push the changes

### Updating Styles

1. Edit the appropriate CSS file in `/assets/css/`
2. Test locally to ensure changes look correct
3. Commit and push the changes

### Deployment

The site is deployed using AWS Amplify, which automatically builds and deploys the site when changes are pushed to the main branch.

## Best Practices

- Keep the terminal UI aesthetic consistent across all pages
- Ensure all pages are responsive and work on mobile devices
- Maintain the dark theme with appropriate contrast for readability
- Use relative paths for all assets and links
- Keep JavaScript minimal and focused on enhancing the terminal experience
