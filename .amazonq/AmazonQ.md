# leocai.me - Personal Website Project

## Project Overview

This is a personal website for Leo Cai, a Software Engineer at AWS Redshift. The website features a terminal-themed homepage and a blog section. The site is built as a static website using Jekyll for the blog functionality, with custom HTML, CSS, and JavaScript for the terminal interface.

## Project Structure

```
leocai.me/
├── _config.yml              # Jekyll configuration
├── _layouts/                # Jekyll layouts
│   └── post.html            # Blog post layout template
├── _posts/                  # Blog posts in Markdown format
│   └── 2024-04-09-welcome-to-my-blog.md
├── assets/                  # Static assets
│   ├── css/                 # CSS stylesheets
│   │   ├── blog.css         # Blog-specific styles
│   │   ├── style.css        # Original site styles
│   │   └── terminal.css     # Terminal theme styles
│   └── js/                  # JavaScript files
│       ├── matrix.js        # Matrix background effect
│       └── terminal.js      # Terminal functionality
├── blog/                    # Blog section
│   └── index.html           # Blog listing page
├── CNAME                    # Custom domain configuration
├── icon.webp                # Site favicon
└── index.html               # Homepage with terminal interface
```

## Key Components

### 1. Terminal Interface (Homepage)

The homepage features an interactive terminal interface with:
- Command input functionality
- Command history navigation
- Multiple commands (`help`, `about`, `skills`, etc.)
- ASCII art and visual effects
- Skills display in terminal-style cards

**Key files:**
- `index.html` - Main terminal interface
- `assets/css/terminal.css` - Terminal styling
- `assets/js/terminal.js` - Terminal functionality
- `assets/js/matrix.js` - Matrix background effect

### 2. Blog System

The blog section uses Jekyll to:
- Generate blog post pages from Markdown files
- Create a listing page of all posts
- Apply consistent styling across posts

**Key files:**
- `_config.yml` - Jekyll configuration
- `_layouts/post.html` - Blog post template
- `blog/index.html` - Blog listing page
- `assets/css/blog.css` - Blog styling

## Development Workflow

### Local Development

1. **Preview with Python HTTP Server:**
   ```bash
   cd /Users/caixy/Leo/workspace/leocai.me
   python3 -m http.server 8000
   ```
   Then visit http://localhost:8000

2. **Jekyll Limitations:**
   - The Python server doesn't process Jekyll templates
   - Blog post listing won't work locally with this method
   - Individual pages with Jekyll front matter won't render properly

### Deployment

The site is deployed using GitHub Pages:

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **GitHub Pages Processing:**
   - GitHub Pages automatically processes Jekyll templates
   - Changes typically deploy within a few minutes
   - The site is accessible at https://leocai.me

## Common Tasks

### Adding a New Blog Post

1. Create a new Markdown file in the `_posts` directory with the naming format: `YYYY-MM-DD-title.md`
2. Add Jekyll front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: YYYY-MM-DD
   ---
   ```
3. Write your content in Markdown format
4. Commit and push to deploy

### Modifying the Terminal Interface

1. Edit `index.html` for structure changes
2. Modify `assets/css/terminal.css` for styling
3. Update `assets/js/terminal.js` for functionality changes
4. Add new commands by extending the `processCommand()` function

### Styling Changes

- `terminal.css` - Terminal theme styling
- `blog.css` - Blog-specific styling
- `style.css` - Original site styling (mostly superseded by terminal.css)

## Best Practices

1. **Local Testing:**
   - Always preview changes locally before pushing
   - For blog changes, be aware that Jekyll features won't work in local preview

2. **Responsive Design:**
   - Test on multiple screen sizes
   - Terminal interface is designed to be responsive

3. **Performance:**
   - Keep JavaScript minimal and efficient
   - Optimize images (using WebP format)
   - Minimize external dependencies

4. **SEO:**
   - Maintain proper meta tags and descriptions
   - Use semantic HTML elements
   - Include Open Graph tags for social sharing

## Future Enhancements

Potential improvements to consider:

1. **Local Jekyll Preview:**
   - Set up a local Jekyll environment for complete testing

2. **Additional Terminal Commands:**
   - Add more interactive commands
   - Create a projects showcase command

3. **Blog Enhancements:**
   - Add categories and tags
   - Implement a search function
   - Add related posts section

4. **Performance Optimization:**
   - Implement lazy loading for images
   - Add service worker for offline capabilities

5. **Analytics:**
   - Add privacy-friendly analytics

## Troubleshooting

### Blog Post Not Appearing

- Ensure the post file follows the correct naming convention
- Verify the front matter is formatted correctly
- Check that the post date is not in the future

### Terminal Commands Not Working

- Check the browser console for JavaScript errors
- Verify that the command is registered in the `processCommand()` function
- Ensure event listeners are properly attached

### Styling Issues

- Use browser developer tools to inspect elements
- Check for CSS specificity conflicts
- Verify media queries for responsive design issues
