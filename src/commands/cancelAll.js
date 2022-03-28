// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/tumiptal$/g, async (msg) => {
  const userId = msg.from.id;
  const subscribedCurrencies =
    await NotificationService.getSubscriberedCurrencies(userId);

  if (!subscribedCurrencies.length) {
    const message =
      "Aboneliğiniz bulunmamaktadır!\n\n/takip komutunu kullanarak aboneliğinizi oluşturabilirsiniz.";
    return TelegramService.sendMessage(userId, message);
  }

  subscribedCurrencies.forEach(({ type, symbol }) => {
    // Cancel Subscriber
    NotificationService.cancelSubscriber(userId, type, symbol);
  });

  // Send Message
  TelegramService.sendMessage(userId, "Tüm abonelikleriniz iptal edildi!");
});
