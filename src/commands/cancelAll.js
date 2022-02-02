// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/cancelall$/g, async (msg) => {
  const chatId = msg.chat.id;
  const errorMessage = "You do not have a subscription!";
  const message = "All your subscriptions have been canceled!";
  const currencies = await NotificationService.getSubscriber(chatId);

  if (!currencies.length) {
    return TelegramService.sendMessage(chatId, errorMessage);
  }

  currencies.forEach(async ({ currency }) => {
    // Cancel Subscriber
    await NotificationService.cancelSubscriber(chatId, currency);
  });

  // Send Message
  await TelegramService.sendMessage(chatId, message);
});
