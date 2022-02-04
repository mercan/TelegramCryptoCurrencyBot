const Telegram = require("node-telegram-bot-api");
const { TELEGRAM } = require("../config/index");

class TelegramService {
  constructor({ BOT_TOKEN, setCommands }) {
    const config = { polling: true };
    this.config = config;
    this.token = BOT_TOKEN;

    this.bot = new Telegram(this.token, this.config);
    this.on("polling_error", console.error);

    this.bot.setMyCommands(setCommands);
  }

  async sendMessage(userId, message, options = {}) {
    return await this.bot.sendMessage(userId, message, options);
  }

  async editMessageText(userId, messageId, message, options = {}) {
    return await this.bot.editMessageText(message, {
      chat_id: userId,
      message_id: messageId,
      ...options,
    });
  }

  async deleteMessage(userId, messageId) {
    return await this.bot.deleteMessage(userId, messageId);
  }

  async answerCallbackQuery(callbackQueryId, text) {
    return await this.bot.answerCallbackQuery(callbackQueryId, text);
  }

  onText(regexp, callback) {
    this.bot.onText(regexp, callback);
  }

  on(event, callback) {
    this.bot.on(event, callback);
  }
}

const setCommands = [
  {
    command: "start",
    description: "Detaylı bilgi verir.",
  },
  {
    command: "takip",
    description:
      "Komutu ile yeni bir abonelik başlatabilir veya mevcut aboneliğinizin bildirim gönderme sıklığını değiştirebilirsiniz.",
  },
  {
    command: "sondurum",
    description:
      "Komutu ile abone olduğunuz tüm döviz birimlerinin son durumlarını öğrenebilirsiniz.",
  },
  {
    command: "fiyat",
    description:
      "Komutu ile istediğiniz para biriminin son fiyatını öğrenebilirsiniz..",
  },
  {
    command: "aboneliklerim",
    description:
      "Komutu ile tüm aboneliklerinizi listeleyebilir ve bildirim sıklığını görebilirsiniz.",
  },
  {
    command: "iptal",
    description:
      "Komutu ile istediğiniz para birimine aboneliğinizi sonlandırabilirsiniz. Abonelik daha sonra yeniden başlatılabilir.",
  },
  {
    command: "tumiptal",
    description: "Komutu ile tüm aboneliklerinizi sonlandırabilirsiniz.",
  },
  {
    command: "bilgi",
    description: "Detaylı bilgi verir.",
  },
];

const Dependencies = {
  BOT_TOKEN: TELEGRAM.BOT_TOKEN,
  setCommands,
};

module.exports = new TelegramService(Dependencies);
