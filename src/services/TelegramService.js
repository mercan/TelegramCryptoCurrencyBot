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

  async sendMessage(chatId, message, options = {}) {
    return await this.bot.sendMessage(chatId, message, options);
  }

  async editMessageText(chatId, messageId, message, options = {}) {
    return await this.bot.editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
      ...options,
    });
  }

  async deleteMessage(chatId, messageId) {
    return await this.bot.deleteMessage(chatId, messageId);
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
    description: "Start using bot",
  },
  {
    command: "follow",
    description:
      "You can start a new subscription with the command, or you can change the frequency of sending notifications of your existing subscription.",
  },
  {
    command: "price",
    description:
      "You can find out the last price of the currency unit you want with the command.",
  },
  // {
  //   command: "listcurrency",
  //   description: "Enter the currency you want to track.",
  // },
  {
    command: "subscriptions",
    description:
      "With the command, you can list all your subscriptions and see which channel you are on in the currency you subscribe to.",
  },
  {
    command: "cancel",
    description:
      "You can terminate your subscription to the currency of your choice with the command. The subscription can then be restarted.",
  },
  {
    command: "cancelall",
    description: "You can terminate all your subscriptions with the command.",
  },
  {
    command: "help",
    description: "Help",
  },
];

const Dependencies = {
  BOT_TOKEN: TELEGRAM.BOT_TOKEN,
  setCommands,
};

module.exports = new TelegramService(Dependencies);
