# Pushing Your Project to GitHub/GitLab

Follow these steps to push your project to GitHub or GitLab.

## GitHub Instructions

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com)
   - Click the "+" icon in the top right and select "New repository"
   - Name your repository (e.g., "crypto-price-tracker")
   - Add a description (optional)
   - Choose public or private visibility
   - Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. Push your local repository to GitHub:
   ```bash
   # Add the remote repository
   git remote add origin https://github.com/yourusername/crypto-price-tracker.git

   # Push your code
   git push -u origin main
   ```

3. Verify your repository on GitHub:
   - Refresh your GitHub repository page
   - All your files should now be visible

## GitLab Instructions

1. Create a new project on GitLab:
   - Go to [GitLab](https://gitlab.com)
   - Click "New project"
   - Select "Create blank project"
   - Name your project (e.g., "crypto-price-tracker")
   - Add a description (optional)
   - Choose visibility level
   - Click "Create project"

2. Push your local repository to GitLab:
   ```bash
   # Add the remote repository
   git remote add origin https://gitlab.com/yourusername/crypto-price-tracker.git

   # Push your code
   git push -u origin main
   ```

3. Verify your project on GitLab:
   - Refresh your GitLab project page
   - All your files should now be visible

## Adding a Demo GIF

1. Record a demo of your application (see record-demo.md)
2. Save the GIF as `demo.gif` in the root directory
3. Add and commit the GIF:
   ```bash
   git add demo.gif
   git commit -m "Add demo GIF"
   git push
   ```

4. The GIF will automatically appear in your README on GitHub/GitLab

## Updating Repository Information

After pushing, update these items in your README:
1. Replace `https://github.com/yourusername/crypto-price-tracker.git` with your actual repository URL
2. Add a link to a live demo if you deploy your application
3. Update the copyright in the LICENSE file with your name/organization

## Setting Up GitHub Pages (Optional)

If you want to deploy your application to GitHub Pages:

1. Build your application:
   ```bash
   npm run build
   ```

2. Create a new branch for GitHub Pages:
   ```bash
   git checkout -b gh-pages
   git add dist -f
   git commit -m "Add dist for GitHub Pages"
   ```

3. Push the branch to GitHub:
   ```bash
   git push origin gh-pages
   ```

4. Configure GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Set Source to "gh-pages" branch
   - Save

5. Your application will be available at `https://yourusername.github.io/crypto-price-tracker`
