// Services
const TelegramService = require("../services/TelegramService");

TelegramService.onText(/^\/takip$/g, async (msg) => {
  const userId = msg.from.id;
  const message = "Lütfen takip etmek istediğiniz para birimini seçiniz.";

  await TelegramService.sendMessage(userId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "USD • TRY",
            callback_data: "FOLLOW_FOREX/USDTRY",
          },
          {
            text: "EUR • USD",
            callback_data: "FOLLOW_FOREX/EURUSD",
          },
        ],
        [
          {
            text: "Bitcoin USD (BTC • USD)",
            callback_data: "FOLLOW_CRYPTO/BTCUSD",
          },
        ],
        [
          {
            text: "Bitcoin TRY (BTC • TRY)",
            callback_data: "FOLLOW_CRYPTO/BTCTRY",
          },
        ],
        [
          {
            text: "Ethereum USD (ETH • USD)",
            callback_data: "FOLLOW_CRYPTO/ETHUSD",
          },
        ],
        [
          {
            text: "BNB USD (BNB • USD)",
            callback_data: "FOLLOW_CRYPTO/BNBUSD",
          },
        ],
        [
          {
            text: "Ons Altın USD (XAU • USD)",
            callback_data: "FOLLOW_FOREX/XAUUSD",
          },
        ],
        [
          {
            text: "Ons Altın TRY (XAU • TRY)",
            callback_data: "FOLLOW_FOREX/XAUTRY",
          },
        ],
        [
          {
            text: "Para birimini manuel olarak girin",
            callback_data: "FOLLOWMANUAL",
          },
        ],
      ],
    },
  });
});
