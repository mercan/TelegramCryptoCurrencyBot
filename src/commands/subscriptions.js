// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/subscriptions$/g, async (msg) => {
  const chatId = msg.chat.id;
  const subscribers = await NotificationService.getSubscriber(chatId);
  let message = "📌 <b>My Subscriptions:</b>📌\n\n";

  if (subscribers.length === 0) {
    message = "You do not have a subscription";
  } else {
    subscribers.forEach((subscriber) => {
      message += `<b>${subscriber.currency}:</b> ${subscriber.time} ${
        subscriber.timeUnit[0].toUpperCase() + subscriber.timeUnit.slice(1)
      }\n`;
    });
  }

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
});
