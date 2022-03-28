// Services
const TelegramService = require("../services/TelegramService");
const CurrencyService = require("../services/CurrencyService");
const NotificationService = require("../services/NotificationService");

// Utils
const formatCurrencyMessage = require("../utils/formatCurrencyMessage");

TelegramService.onText(/^\/sondurum$/g, async (msg) => {
  const userId = msg.from.id;
  const subscribedCurrencies =
    await NotificationService.getSubscriberedCurrencies(userId);
  const messages = [];

  if (!subscribedCurrencies.length) {
    const message =
      "Aboneliğiniz bulunmamaktadır!\n\n/takip komutunu kullanarak aboneliğinizi oluşturabilirsiniz.";
    return TelegramService.sendMessage(userId, message);
  }

  for (const { type, symbol } of subscribedCurrencies) {
    const response = await CurrencyService.getCurrencyPrice(type, symbol);
    messages.push(formatCurrencyMessage(response));
  }

  TelegramService.sendMessage(userId, messages.join("\n\n"), {
    parse_mode: "HTML",
  });
});
