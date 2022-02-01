// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/cancel$/g, async (msg) => {
  const messageId = msg.message_id;
  const chatId = msg.chat.id;
  const message =
    "Select the currency in which you want to cancel your subscription";

  const currencies = await NotificationService.getSubscriber(chatId);

  if (currencies.length === 0) {
    return await TelegramService.sendMessage(
      chatId,
       "You do not have a subscription!"
    );
  }

  const currenciesList = currencies.map((subscriber) => {
    return subscriber.currency;
  });

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        ...currenciesList.map((currency) => {
          return [
            {
              text: currency,
              callback_data: `CANCEL_${currency}`,
            },
          ];
        }),
      ],
    },
  });
});

// Cancel Subscriber
TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;
  const callBackData = callbackQuery.data;
  const callBackDataSplit = callBackData.split("_");
  const currency = callBackDataSplit[1];
  const message = `<b>${currency}</b> your subscription has been canceled`;

  if (callBackDataSplit[0] === "CANCEL") {
    // Cancel Subscriber
    await NotificationService.cancelSubscriber(chatId, currency);

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });
  }
});
