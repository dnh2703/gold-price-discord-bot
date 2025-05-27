# 🥇 Gold Price Discord Bot

A professional Discord bot built with Node.js and TypeScript that automatically sends daily gold price updates at 9:00 AM time and responds to manual commands.

## ✨ Features

- 📅 **Daily Scheduled Updates**: Automatically sends gold price updates every day at 9:00 AM time
- 💰 **Real-time Gold Prices**: Fetches current gold prices from reliable APIs
- 📊 **Price Change Tracking**: Shows 24-hour price changes and percentages
- 🤖 **Manual Commands**: Users can request gold prices on-demand
- 🌍 **Timezone Support**: Configurable timezone for scheduling
- 🛡️ **Error Handling**: Robust error handling and fallback mechanisms
- 📱 **Beautiful Formatting**: Rich Discord embeds with emojis and formatting

## 🚀 Quick Start

### Prerequisites

- Bun 1.0 or higher (recommended) or Node.js 16.x or higher
- A Discord bot token
- A Discord server where you want to deploy the bot

### Installation

1. **Clone or download this project**
   ```bash
   git clone <your-repo-url>
   cd gold-price-discord-bot
   ```

2. **Install dependencies**
   
   **With Bun (recommended):**
   ```bash
   bun install
   ```
   
   **Or with npm:**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **For local development:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```
   
   **For GitHub Actions/CI:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add these repository secrets:
     - `DISCORD_TOKEN`: Your Discord bot token
     - `CHANNEL_ID`: Your Discord channel ID
     - `TIMEZONE`: Your preferred timezone (optional)
   
   **For other platforms:**
   - **Heroku**: `heroku config:set DISCORD_TOKEN=your_token`
   - **Railway**: `railway variables set DISCORD_TOKEN=your_token`
   - **Vercel**: `vercel env add DISCORD_TOKEN`

4. **Build the project**
   
   **With Bun:**
   ```bash
   bun run build
   ```
   
   **Or with npm:**
   ```bash
   npm run build
   ```

5. **Start the bot**
   
   **With Bun:**
   ```bash
   bun run start
   ```
   
   **Or with npm:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   
   **With Bun:**
   ```bash
   bun run dev
   ```
   
   **Or with npm:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Discord Bot Setup

1. **Create a Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to the "Bot" section and click "Add Bot"
   - Copy the bot token and add it to your `.env` file

2. **Bot Permissions**
   Your bot needs the following permissions:
   - Send Messages
   - Read Message History
   - Use Slash Commands (optional)

3. **Invite Bot to Server**
   - In the Discord Developer Portal, go to OAuth2 > URL Generator
   - Select "bot" scope and the required permissions
   - Use the generated URL to invite the bot to your server

4. **Get Channel ID**
   - Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
   - Right-click on the channel where you want updates
   - Click "Copy ID" and add it to your `.env` file

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | ✅ Yes | - |
| `CHANNEL_ID` | Discord channel ID for updates | ✅ Yes | - |
| `TIMEZONE` | Timezone for scheduling | ❌ No | Asia/Ho_Chi_Minh |

### Timezone Configuration

The bot supports any valid timezone string. Common examples:
- `Asia/Ho_Chi_Minh` (Vietnam Time - Default)
- `Asia/Bangkok` (Thailand Time)
- `Asia/Tokyo` (Japan Time)
- `America/New_York` (Eastern Time)
- `Europe/London` (GMT/BST)
- `UTC` (Coordinated Universal Time)

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `!gold` or `!goldprice` | Get current gold price |
| `!help` | Show available commands |

## 📊 Gold Price API

The bot uses [Gold-API](https://api.gold-api.com/price/XAU) for reliable gold price data:

1. **Primary**: [Gold-API](https://api.gold-api.com/price/XAU) - 100% free with unlimited requests
2. **Fallback**: Mock data for testing when API is unavailable

### API Benefits

- ✅ **Completely free** - No API key required
- ✅ **Unlimited requests** - No rate limits
- ✅ **Real-time data** - Updated every few seconds
- ✅ **Reliable** - High uptime and fast response
- ✅ **Simple JSON** - Easy to parse and use

## 🛠️ Development

### Project Structure

```
gold-price-discord-bot/
├── src/
│   └── index.ts          # Main bot file
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables (create this)
└── README.md            # This file
```

### Available Scripts

**With Bun (recommended):**
```bash
bun run build       # Compile TypeScript to JavaScript
bun run start       # Start the compiled bot
bun run dev         # Start with native TypeScript support
bun run watch       # Watch for changes and recompile
bun test            # Run tests with Bun's built-in test runner
bun run lint:commit # Check commit message format
```

**Or with npm:**
```bash
npm run build       # Compile TypeScript to JavaScript
npm run start       # Start the compiled bot
npm run dev         # Start with native TypeScript support
npm run watch       # Watch for changes and recompile
npm test            # Run tests
npm run lint:commit # Check commit message format
```

### Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint and Husky:

**Format**: `type(scope): description`

**Allowed types**:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `perf`: Performance improvements
- `revert`: Reverting changes

**Allowed scopes**:
- `build`: Build system/tooling
- `deps`: Dependencies
- `bot`: Bot functionality
- `api`: API integration
- `config`: Configuration
- `docs`: Documentation
- `ci`: CI/CD
- `test`: Testing

**Examples**:
```bash
feat(bot): add new gold price alert command
fix(api): handle API timeout errors gracefully
docs(readme): update installation instructions
chore(deps): update discord.js to latest version
```

## 🚀 CI/CD with GitHub Actions

This project includes a GitHub Actions workflow for automated testing and deployment:

### **Workflow Features:**
- ✅ **Automated testing** on every push and pull request
- ✅ **Bun setup** for fast builds and tests
- ✅ **Environment variables** from GitHub secrets
- ✅ **Deployment** on main branch pushes

### **Required GitHub Secrets:**
Set these in your repository settings:
- `DISCORD_TOKEN`: Your Discord bot token
- `CHANNEL_ID`: Target Discord channel ID
- `TIMEZONE`: Bot timezone (optional)

### **Workflow File:**
The workflow is defined in `.github/workflows/deploy.yml`

### Adding New Features

1. **New Commands**: Add command handlers in the `messageCreate` event
2. **Scheduled Tasks**: Use `node-cron` to add new scheduled functions
3. **API Integration**: Add new price sources in the `fetchGoldPrice` function

## 🔒 Security

- Never commit your `.env` file to version control
- Keep your Discord bot token secure
- Use environment variables for all sensitive data
- Regularly rotate your API keys

## 📝 Logging

The bot includes comprehensive logging:
- ✅ Successful operations
- ❌ Errors and failures
- ⚠️ Warnings and fallbacks
- 📊 API requests and responses

## 🐛 Troubleshooting

### Common Issues

1. **Bot doesn't respond**
   - Check if the bot is online in your Discord server
   - Verify the bot has proper permissions
   - Check console logs for errors

2. **Scheduled messages not working**
   - Verify timezone configuration
   - Check if the bot has been running continuously
   - Ensure the channel ID is correct

3. **API errors**
   - Check your internet connection
   - Verify API endpoints are accessible
   - Check rate limits

### Debug Mode

For detailed logging, you can modify the console.log statements or add a debug environment variable.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the console logs
3. Create an issue in the repository

---

**Happy trading! 🥇✨** 