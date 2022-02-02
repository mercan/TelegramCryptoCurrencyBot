// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/cancel$/g, async (msg) => {
  const chatId = msg.chat.id;
  const message =
    "Select the currency in which you want to cancel your subscription";

  const currencies = await NotificationService.getSubscriber(chatId);

  if (!currencies.length) {
    return await TelegramService.sendMessage(
      chatId,
      "You do not have a subscription!"
    );
  }

  const currencyList = currencies.map(({ currency }) => {
    return [
      {
        text: currency.split("_")[1],
        callback_data: `CANCEL_${currency}`,
      },
    ];
  });

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [...currencyList],
    },
  });
});

// Cancel Subscriber
TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;
  const callbackData = callbackQuery.data;
  const callbackDataArray = callbackData.split("_");
  const callbackQueryType = callbackDataArray[0];
  const currencyType = callbackDataArray[1];
  const currency = callbackDataArray[2];
  const message = `<b>${currency}</b> your subscription has been canceled`;

  if (callbackQueryType === "CANCEL") {
    // Cancel Subscriber
    await NotificationService.cancelSubscriber(
      chatId,
      `${currencyType}_${currency}`
    );

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });
  }
});
