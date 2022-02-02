// Services
const TelegramService = require("../services/TelegramService");
const LanguageService = require("../services/LanguageService");

TelegramService.onText(/^\/help$/g, async (msg) => {
  const chatId = msg.chat.id;
  const language = new LanguageService(msg.from.language_code);
  const message = language.getCommands("start").message;

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
});
