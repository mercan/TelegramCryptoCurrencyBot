// Services
const CurrencyService = require("../services/CurrencyService");
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");

TelegramService.onText(/^\/pricelist$/g, async (msg) => {
  const chatId = msg.chat.id;
  const currencies = await NotificationService.getSubscriber(chatId);

  if (!currencies.length) {
    return await TelegramService.sendMessage(
      chatId,
      "You do not have a subscription."
    );
  }

  let message = "";

  for await (const { currency } of currencies) {
    const { price, cpd, cpw, cpm } = await CurrencyService.getPrice(currency);
    message += `<b>${currency}:</b> ${price}\n\n`;

    if (cpd) {
      if (cpd >= 0) {
        message += `Daily Change: <b>↑ +${cpd}%</b>\n`;
      } else {
        message += `Daily Change: <b>↓ ${cpd}%</b>\n`;
      }

      if (cpw >= 0) {
        message += `Weekly Change: <b>↑ +${cpw}%</b>\n`;
      } else {
        message += `Weekly Change: <b>↓ ${cpw}%</b>\n`;
      }

      if (cpm >= 0) {
        message += `Monthly Change: <b>↑ +${cpm}%</b>\n\n`;
      } else {
        message += `Monthly Change: <b>↓ ${cpm}%</b>\n\n`;
      }
    }
  }

  await TelegramService.sendMessage(chatId, message, { parse_mode: "HTML" });
});
