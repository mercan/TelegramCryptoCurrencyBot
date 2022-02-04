// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.on("callback_query", (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const { data } = callbackQuery;
  const [command, currency] = data.split("_");

  if (command === "CANCEL") {
    const [type, symbol] = currency.split("/");
    const message = `<b>${symbol}</b> Aboneliğiniz iptal edildi!`;

    NotificationService.cancelSubscriber(userId, type, symbol);
    TelegramService.editMessageText(userId, messageId, message, {
      parse_mode: "HTML",
    });
  }
});
