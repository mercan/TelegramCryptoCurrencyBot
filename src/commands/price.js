// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/fiyat$/g, async (msg) => {
  const userId = msg.from.id;
  const message = "Fiyatını görmek istediğiniz para birimini seçiniz.";
  const selectedCurrency = msg.text.split(" ")[1];

  if (!selectedCurrency) {
    const subscribedCurrencies =
      await NotificationService.getSubscriberedCurrencies(userId);

    const inline_keyboard = [
      ...subscribedCurrencies.map(({ type, symbol }) => {
        return [
          {
            text: symbol,
            callback_data: `PRICE_${type}/${symbol}`,
          },
        ];
      }),
    ];

    inline_keyboard.push([
      {
        text: "Para birimini manuel olarak seçiniz",
        callback_data: "PRICEMANUAL",
      },
    ]);

    TelegramService.sendMessage(userId, message, {
      reply_markup: {
        inline_keyboard,
      },
    });
  }
});
