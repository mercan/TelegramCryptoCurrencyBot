// Services
const TelegramService = require("../services/TelegramService");

// Follow And Follow Manual
TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const [command, currency] = callbackQuery.data.split("_");

  if (command === "FOLLOWMANUAL") {
    const message = "Lütfen takip etmek istediğiniz para birimini giriniz.";
    const placeholder = "Para birimi girin";

    // Delete previous message
    await TelegramService.deleteMessage(userId, messageId);

    return TelegramService.sendMessage(userId, message, {
      reply_markup: {
        input_field_placeholder: placeholder,
        force_reply: true,
      },
    });
  }

  if (command === "FOLLOW") {
    const symbol = currency.split("/")[1];
    const message = `<b>${symbol}</b>'den ne sıklıkla bildirim almak istiyorsunuz?`;

    await TelegramService.editMessageText(userId, messageId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "10 Dakika",
              callback_data: `TIME_${currency}_10`,
            },
            {
              text: "30 Dakika",
              callback_data: `TIME_${currency}_30`,
            },
          ],
          [
            {
              text: "1 Saat",
              callback_data: `TIME_${currency}_60`,
            },
            {
              text: "6 saat",
              callback_data: `TIME_${currency}_360`,
            },
            {
              text: "12 Saat",
              callback_data: `TIME_${currency}_720`,
            },
          ],
          [
            {
              text: "1 Gün",
              callback_data: `TIME_${currency}_1440`,
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  }
});
