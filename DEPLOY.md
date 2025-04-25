# Deploying to Netlify

This guide will walk you through deploying your Crypto Price Tracker application to Netlify.

## Option 1: Deploy via Netlify UI (Easiest Method)

1. **Create a Netlify Account**
   - Go to [Netlify](https://www.netlify.com/) and sign up for a free account
   - You can sign up using your GitHub account for easier integration

2. **Prepare Your Project**
   - Make sure your project is built:
     ```bash
     npm run build
     ```
   - This will create a `dist` folder with your production-ready application

3. **Deploy to Netlify**
   - Log in to your Netlify account
   - Go to the "Sites" section
   - Drag and drop your `dist` folder onto the Netlify UI where it says "Drag and drop your site folder here"
   - Netlify will automatically upload and deploy your site
   - You'll get a random URL like `https://random-name-123456.netlify.app`

4. **Configure Your Site**
   - Click on "Site settings" to customize your site
   - You can change the site name to get a custom Netlify subdomain
   - Set up a custom domain if you have one

## Option 2: Deploy via GitHub Integration

1. **Push Your Code to GitHub**
   - Make sure your code is pushed to GitHub (which you've already done)

2. **Connect Netlify to GitHub**
   - Log in to Netlify
   - Click "New site from Git"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub repositories
   - Select your crypto-price-tracker repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Netlify will build and deploy your site
   - You'll get a URL where your site is live

## Option 3: Deploy via Netlify CLI

1. **Install Netlify CLI**
   - Install the Netlify CLI globally:
     ```bash
     npm install -g netlify-cli
     ```

2. **Login to Netlify**
   - Authenticate with Netlify:
     ```bash
     netlify login
     ```
   - This will open a browser window to log in

3. **Initialize Netlify in Your Project**
   - Run:
     ```bash
     netlify init
     ```
   - Follow the prompts to set up your site

4. **Deploy Your Site**
   - Run:
     ```bash
     netlify deploy --prod
     ```
   - This will deploy your site to production

## Continuous Deployment

Once you've set up GitHub integration, any changes you push to your main branch will automatically trigger a new build and deployment on Netlify.

## Environment Variables

If your application uses environment variables, you can set them in the Netlify UI:
1. Go to Site settings > Build & deploy > Environment
2. Add your environment variables there

## Custom Domain

To set up a custom domain:
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS settings

## Troubleshooting

If you encounter any issues with your deployment:
1. Check the deployment logs in the Netlify UI
2. Make sure your build command is correct
3. Verify that the publish directory is set to `dist`
4. Ensure that the `netlify.toml` file is correctly configured
