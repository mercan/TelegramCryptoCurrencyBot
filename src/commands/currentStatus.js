// Services
const CurrencyService = require("../services/CurrencyService");
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const LanguageService = require("../services/LanguageService");

TelegramService.onText(/^\/currentStatus$/g, async (msg) => {
  const chatId = msg.chat.id;
  const currencies = await NotificationService.getSubscriber(chatId);
  const language = new LanguageService(msg.from.language_code);
  const messages = language.getCommands("currentStatus");
  const {
    dailyUpChange,
    dailyDownChange,
    weeklyUpChange,
    weeklyDownChange,
    monthlyUpChange,
    monthlyDownChange,
  } = language.get("currencyMessage");

  if (!currencies.length) {
    return await TelegramService.sendMessage(chatId, messages.noSubscription);
  }

  let message = "";
  for await (const { currency } of currencies) {
    const [currentType, currencyName] = currency.split("_");
    const { price, cpd, cpw, cpm } = await CurrencyService.getCurrencyPrice(
      currentType,
      currencyName
    );
    message += `<b>${currencyName}:</b> ${price}\n\n`;

    if (cpd) {
      if (cpd >= 0) {
        message += dailyUpChange.replace("{0}", cpd);
      } else {
        message += dailyDownChange.replace("{0}", cpd);
      }

      if (cpw >= 0) {
        message += weeklyUpChange.replace("{0}", cpw);
      } else {
        message += weeklyDownChange.replace("{0}", cpw);
      }

      if (cpm >= 0) {
        message += monthlyUpChange.replace("{0}", cpm) + "\n\n";
      } else {
        message += monthlyDownChange.replace("{0}", cpm) + "\n\n";
      }
    }
  }

  await TelegramService.sendMessage(chatId, message, { parse_mode: "HTML" });
});
