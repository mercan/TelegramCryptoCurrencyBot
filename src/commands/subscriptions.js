// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/subscriptions$/g, async (msg) => {
  const chatId = msg.chat.id;
  const currencies = await NotificationService.getSubscriber(chatId);
  let message = "📌 <b>My Subscriptions:</b>📌\n\n";

  if (!currencies.length) {
    return await TelegramService.sendMessage(
      chatId,
      "You do not have a subscription."
    );
  }

  currencies.forEach((currency) => {
    message += `<b>${currency.currency}:</b> ${currency.time} ${
      currency.timeUnit[0].toUpperCase() + currency.timeUnit.slice(1)
    }\n`;
  });

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
});
