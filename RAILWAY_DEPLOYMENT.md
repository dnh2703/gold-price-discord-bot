# Railway Deployment Guide for Discord Gold Bot

This guide will help you set up continuous deployment for your Discord Gold Bot using Railway and GitHub Actions.

## Prerequisites

1. A Railway account ([railway.app](https://railway.app))
2. A GitHub repository with your Discord bot code
3. A Discord bot token and channel ID

## Step 1: Create Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your Discord bot repository
5. Railway will automatically detect your `nixpacks.toml` configuration

## Step 2: Configure Environment Variables in Railway

In your Railway project dashboard:

1. Go to **Variables** tab
2. Add the following environment variables:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `CHANNEL_ID`: The Discord channel ID where the bot will send messages
   - `TIMEZONE`: (Optional) Default is `Asia/Ho_Chi_Minh`

## Step 3: Get Railway Project Token

1. In your Railway project, go to **Settings**
2. Navigate to **Tokens** section
3. Click **Create Token**
4. Copy the generated token (you'll need this for GitHub Actions)

## Step 4: Add Railway Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `RAILWAY_TOKEN`
5. Value: Paste your Railway project token from Step 3

## Step 5: GitHub Actions Workflow

The workflow in `.github/workflows/deploy.yml` is already configured with:

- **Automated Testing**: Runs tests on every push and PR
- **Conditional Deployment**: Only deploys on pushes to `main` branch
- **Railway CLI Integration**: Uses Railway's official CLI container
- **Error Handling**: Proper validation and error messages

### Workflow Features:

```yaml
# Triggers on push to main and pull requests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

# Two jobs: test and deploy
jobs:
  test:    # Runs on all pushes and PRs
  deploy:  # Only runs on main branch pushes
```

## Step 6: Deployment Process

Once everything is set up:

1. **Push to any branch**: Tests will run automatically
2. **Push to main branch**: Tests run first, then deployment to Railway
3. **Pull Requests**: Only tests run (no deployment)

## Step 7: Monitoring

### Railway Dashboard
- Monitor deployment status in Railway dashboard
- Check logs for any runtime issues
- View resource usage and metrics

### GitHub Actions
- Check workflow status in **Actions** tab
- View detailed logs for each step
- Get notifications on deployment success/failure

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DISCORD_TOKEN` | Yes | Your Discord bot token | `MTIzNDU2Nzg5...` |
| `CHANNEL_ID` | Yes | Discord channel ID for messages | `123456789012345678` |
| `TIMEZONE` | No | Timezone for scheduled messages | `Asia/Ho_Chi_Minh` |

## Troubleshooting

### Common Issues:

1. **Deployment fails with "RAILWAY_TOKEN not found"**
   - Ensure you've added the token to GitHub repository secrets
   - Check the secret name is exactly `RAILWAY_TOKEN`

2. **Bot doesn't start on Railway**
   - Verify environment variables are set in Railway dashboard
   - Check Railway logs for error messages
   - Ensure Discord token is valid

3. **Tests fail in CI**
   - Check that all dependencies are properly installed
   - Verify TypeScript compilation succeeds
   - Review test output in GitHub Actions logs

### Useful Commands:

```bash
# Test locally with Bun
bun test

# Build the project
bun run build

# Run locally
bun run dev

# Check Railway status (if CLI is installed)
railway status
```

## Security Best Practices

1. **Never commit sensitive tokens** to your repository
2. **Use Railway environment variables** for all secrets
3. **Regularly rotate your Discord bot token**
4. **Monitor Railway logs** for any suspicious activity

## Next Steps

After successful deployment:

1. Test the bot in your Discord server
2. Monitor the scheduled gold price updates
3. Check Railway metrics for performance
4. Set up additional monitoring if needed

Your Discord Gold Bot should now be automatically deployed to Railway whenever you push changes to the main branch! 🚀 