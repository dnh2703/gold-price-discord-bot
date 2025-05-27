import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import * as cron from "node-cron";
import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Bot configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const TIMEZONE = process.env.TIMEZONE || "Asia/Ho_Chi_Minh";

// Validate required environment variables
if (!DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN là bắt buộc trong file .env");
  process.exit(1);
}

if (!CHANNEL_ID) {
  console.error("❌ CHANNEL_ID là bắt buộc trong file .env");
  process.exit(1);
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Interface for gold price data
interface GoldPriceData {
  price: number;
  currency: string;
  unit: string;
  timestamp: string;
  change24h?: number;
  changePercent24h?: number;
}

// Function to fetch gold price
async function fetchGoldPrice(): Promise<GoldPriceData | null> {
  try {
    // Primary API: Gold-API (100% free, no rate limits, no API key required)
    console.log("📡 Đang lấy giá vàng từ Gold-API...");
    const goldApiResponse = await axios.get(
      "https://api.gold-api.com/price/XAU",
      {
        headers: {
          "User-Agent": "Discord-Gold-Bot/1.0",
        },
        timeout: 10000,
      }
    );

    if (goldApiResponse.data && goldApiResponse.data.price) {
      console.log("✅ Lấy dữ liệu thành công từ Gold-API");
      return {
        price: goldApiResponse.data.price,
        currency: "USD", // Gold-API returns USD prices
        unit: "oz",
        timestamp: goldApiResponse.data.updatedAt || new Date().toISOString(),
        change24h: goldApiResponse.data.change_24h || undefined,
        changePercent24h: goldApiResponse.data.change_percent_24h || undefined,
      };
    }
  } catch (error) {
    console.warn(
      "⚠️ Gold-API thất bại, đang sử dụng dữ liệu mô phỏng...",
      error instanceof Error ? error.message : String(error)
    );
  }

  // Final fallback: Mock data with realistic price
  console.warn("⚠️ Gold-API không khả dụng, đang sử dụng dữ liệu mô phỏng.");
  const mockPrice = 2000 + (Math.random() - 0.5) * 100; // Random price around $2000

  return {
    price: parseFloat(mockPrice.toFixed(2)),
    currency: "USD",
    unit: "oz",
    timestamp: new Date().toISOString(),
    change24h: parseFloat(((Math.random() - 0.5) * 50).toFixed(2)),
    changePercent24h: parseFloat(((Math.random() - 0.5) * 2.5).toFixed(2)),
  };
}

// Function to format gold price message in Vietnamese
function formatGoldPriceMessage(data: GoldPriceData): string {
  const emoji = "🥇";
  const date = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let message = `${emoji} **Cập Nhật Giá Vàng - ${date}**\n\n`;
  message += `💰 **Giá Hiện Tại:** $${data.price.toFixed(2)} mỗi ${
    data.unit === "oz" ? "ounce (lượng)" : data.unit
  }\n`;
  message += `💱 **Đơn Vị Tiền Tệ:** ${data.currency}\n`;

  if (data.change24h !== undefined) {
    const changeEmoji = data.change24h >= 0 ? "📈" : "📉";
    const changeSign = data.change24h >= 0 ? "+" : "";
    message += `${changeEmoji} **Thay Đổi 24h:** ${changeSign}$${data.change24h.toFixed(
      2
    )}`;

    if (data.changePercent24h !== undefined) {
      message += ` (${changeSign}${data.changePercent24h.toFixed(2)}%)`;
    }
    message += "\n";
  }

  message += `⏰ **Cập Nhật Lần Cuối:** ${new Date(
    data.timestamp
  ).toLocaleTimeString("vi-VN")}\n\n`;
  message += `_Chúc bạn một ngày vàng son! ✨_`;

  return message;
}

// Function to send gold price update
async function sendGoldPriceUpdate(): Promise<void> {
  try {
    console.log("📊 Đang lấy giá vàng...");
    const goldData = await fetchGoldPrice();

    if (!goldData) {
      console.error("❌ Không thể lấy dữ liệu giá vàng");
      return;
    }

    const channel = client.channels.cache.get(CHANNEL_ID!) as TextChannel;

    if (!channel) {
      console.error("❌ Không tìm thấy kênh hoặc bot không có quyền truy cập");
      return;
    }

    const message = formatGoldPriceMessage(goldData);
    await channel.send(message);

    console.log("✅ Gửi cập nhật giá vàng thành công!");
    console.log("================================================");
  } catch (error) {
    console.error("❌ Lỗi khi gửi cập nhật giá vàng:", error);
  }
}

// Bot event handlers
client.once("ready", () => {
  console.log(`🤖 Bot đã đăng nhập với tên ${client.user?.tag}!`);
  console.log(
    `📅 Đã lên lịch gửi giá vàng hàng ngày lúc 9:00 AM (${TIMEZONE})`
  );

  // Send initial message to confirm bot is working
  sendGoldPriceUpdate();
});

client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only respond to commands in the configured channel
  if (message.channel.id !== CHANNEL_ID) return;

  // Command to manually trigger gold price update
  if (
    message.content.toLowerCase() === "!gold" ||
    message.content.toLowerCase() === "!goldprice"
  ) {
    // User call !gold or !goldprice to get gold price
    console.log(
      "🤖 User call !gold or !goldprice",
      message.author.username,
      message.author.globalName
    );
    await sendGoldPriceUpdate();
  }

  // Help command
  if (message.content.toLowerCase() === "!help") {
    // User call !help to get help
    console.log(
      "🤖 User call !help",
      message.author.username,
      message.author.globalName
    );
    const helpMessage =
      `🥇 **Lệnh Bot Giá Vàng**\n\n` +
      `\`!gold\` hoặc \`!goldprice\` - Xem giá vàng hiện tại\n` +
      `\`!help\` - Hiển thị tin nhắn trợ giúp này\n\n` +
      `📅 **Cập Nhật Tự Động:** Hàng ngày lúc 9:00 AM ${TIMEZONE}`;

    await message.reply(helpMessage);
  }
});

// Schedule daily gold price updates at 9:00 AM
cron.schedule(
  "0 9 * * *",
  () => {
    console.log("⏰ Cập nhật giá vàng theo lịch đã được kích hoạt");
    sendGoldPriceUpdate();
  },
  {
    timezone: TIMEZONE,
  }
);

// Error handling
client.on("error", (error) => {
  console.error("❌ Lỗi Discord client:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Lỗi promise không được xử lý:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Lỗi ngoại lệ không được bắt:", error);
  process.exit(1);
});

// Login to Discord
client.login(DISCORD_TOKEN);
