// Services
const TelegramService = require("../services/TelegramService");
const CurrencyService = require("../services/CurrencyService");

// Utils
const formatCurrencyMessage = require("../utils/formatCurrencyMessage");

TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const [command, currency] = callbackQuery.data.split("_");

  if (command === "PRICEMANUAL") {
    await TelegramService.deleteMessage(userId, messageId);

    return TelegramService.sendMessage(
      userId,
      "Fiyatını görmek istediğiniz para birimini giriniz.",
      {
        reply_markup: {
          input_field_placeholder: "Lütfen para birimini giriniz.",
          force_reply: true,
        },
      }
    );
  }

  if (command === "PRICE") {
    const [type, symbol] = currency.split("/");
    const response = await CurrencyService.getCurrencyPrice(type, symbol);
    const message = formatCurrencyMessage(response);

    return TelegramService.editMessageText(userId, messageId, message, {
      parse_mode: "HTML",
    });
  }
});
