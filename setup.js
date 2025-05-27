#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🥇 Gold Price Discord Bot Setup\n");
console.log(
  "This script will help you configure your environment variables.\n"
);

const questions = [
  {
    key: "DISCORD_TOKEN",
    question: "Enter your Discord bot token: ",
    required: true,
  },
  {
    key: "CHANNEL_ID",
    question: "Enter the Discord channel ID where updates will be sent: ",
    required: true,
  },
  {
    key: "TIMEZONE",
    question: "Enter your timezone (default: America/New_York): ",
    required: false,
    default: "America/New_York",
  },
];

let config = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFile();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(q.question, (answer) => {
    if (q.required && !answer.trim()) {
      console.log("❌ This field is required. Please try again.");
      askQuestion();
      return;
    }

    config[q.key] = answer.trim() || q.default || "";
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFile() {
  let envContent = "# Discord Bot Configuration\n";
  envContent += `DISCORD_TOKEN=${config.DISCORD_TOKEN}\n`;
  envContent += `CHANNEL_ID=${config.CHANNEL_ID}\n`;
  envContent += `TIMEZONE=${config.TIMEZONE}\n`;

  fs.writeFileSync(".env", envContent);

  console.log("\n✅ Environment file created successfully!");
  console.log("\nNext steps:");
  console.log("1. Run: npm run build");
  console.log("2. Run: npm start");
  console.log("\nFor development: npm run dev");
  console.log("\nYour bot is ready to go! 🚀");

  rl.close();
}

askQuestion();
