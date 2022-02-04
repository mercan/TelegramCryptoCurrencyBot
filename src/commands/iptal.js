// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/iptal$/g, async (msg) => {
  const userId = msg.from.id;
  const subscribedCurrencies =
    await NotificationService.getSubscriberedCurrencies(userId);
  const message =
    "Aboneliğinizi iptal etmek istediğiniz para birimini seçiniz.";

  if (!subscribedCurrencies.length) {
    return TelegramService.sendMessage(
      userId,
      "Aboneliğiniz bulunmamaktadır!\n\n/takip komutunu kullanarak aboneliğinizi oluşturabilirsiniz."
    );
  }

  const currencies = subscribedCurrencies.map(({ type, symbol }) => {
    return [
      {
        text: symbol,
        callback_data: `CANCEL_${type}/${symbol}`,
      },
    ];
  });

  TelegramService.sendMessage(userId, message, {
    reply_markup: {
      inline_keyboard: [...currencies],
    },
    parse_mode: "HTML",
  });
});
