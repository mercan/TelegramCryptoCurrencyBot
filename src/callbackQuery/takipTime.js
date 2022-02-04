// Services
const TelegramService = require("../services/TelegramService");
const CurrencyService = require("../services/CurrencyService");
const NotificationService = require("../services/NotificationService");

// Utils
const formatCurrencyMessage = require("../utils/formatCurrencyMessage");

// Follow And Follow Manual
TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const { data } = callbackQuery;
  const [command, currency, timeInMinutes] = data.split("_");

  if (command === "TIME") {
    const [type, symbol] = currency.split("/");
    let message;

    if (timeInMinutes >= 5 && timeInMinutes <= 30) {
      message = `Her ${timeInMinutes} dakikada bir bildirim alacaksınız.\n\n`;
    } else if (timeInMinutes >= 60 && timeInMinutes <= 720) {
      message = `Her ${
        timeInMinutes / 60
      } saatte bir bildirim alacaksınız.\n\n`;
    } else {
      message = "Günde bir kez bildirim alacaksınız.\n\n";
    }

    const response = await CurrencyService.getCurrencyPrice(type, symbol);
    message += formatCurrencyMessage(response);

    await TelegramService.editMessageText(userId, messageId, message, {
      parse_mode: "HTML",
    });

    const newNotification = {
      userId,
      username: callbackQuery.from.username,
      currencies: [
        {
          type,
          symbol,
          timeInMinutes: Number(timeInMinutes),
        },
      ],
    };

    NotificationService.createOrUpdateNotification(newNotification);
  }
});
