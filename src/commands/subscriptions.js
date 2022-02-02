// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const LanguageService = require("../services/LanguageService");

TelegramService.onText(/^\/subscriptions$/g, async (msg) => {
  const chatId = msg.chat.id;
  const currencies = await NotificationService.getSubscriber(chatId);
  const messages = new LanguageService(msg.from.language_code).getCommands(
    "subscriptions"
  );
  let message = messages.mySubscriptions;

  if (!currencies.length) {
    return await TelegramService.sendMessage(chatId, messages.noSubscriptions);
  }

  currencies.forEach(({ currency, time, timeUnit }) => {
    const currencyName = currency.split("_")[1];

    message += `<b>${currencyName}:</b> ${time} ${
      timeUnit[0].toUpperCase() + timeUnit.slice(1)
    }\n`;
  });

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
});
