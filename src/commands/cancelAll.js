// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const LanguageService = require("../services/LanguageService");

TelegramService.onText(/^\/cancelall$/g, async (msg) => {
  const chatId = msg.chat.id;
  const messages = new LanguageService(msg.from.language_code).getCommands(
    "cancelAll"
  );
  const errorMessage = messages.noSubscription;
  const message = messages.allUnsubscribed;
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
