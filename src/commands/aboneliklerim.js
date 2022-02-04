// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/aboneliklerim$/g, async (msg) => {
  const userId = msg.from.id;
  const subscribedCurrencies =
    await NotificationService.getSubscriberedCurrencies(userId);

  if (!subscribedCurrencies.length) {
    return TelegramService.sendMessage(
      userId,
      "Aboneliğiniz bulunmamaktadır!\n\n/takip komutunu kullanarak aboneliğinizi oluşturabilirsiniz."
    );
  }

  const message = subscribedCurrencies.reduce(
    (acc, { symbol, timeInMinutes }, currentIndex) => {
      let timeType, timeUnit;

      // !currentIndex
      if (currentIndex === 0) {
        acc = "📌 <b>Aboneliklerim</b> 📌\n\n";
      }

      if (timeInMinutes >= 5 && timeInMinutes <= 30) {
        timeType = "Dakika";
        timeUnit = timeInMinutes;
      } else if (timeInMinutes >= 60 && timeInMinutes <= 720) {
        timeType = "Saat";
        timeUnit = timeInMinutes / 60;
      } else {
        timeType = "Gün";
        timeUnit = timeInMinutes / 1440;
      }

      acc += `<b>${symbol}:</b> ${timeUnit} ${timeType}\n`;

      return acc;
    },
    ""
  );

  TelegramService.sendMessage(userId, message, { parse_mode: "HTML" });
});
