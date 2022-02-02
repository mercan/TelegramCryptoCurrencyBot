// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const CurrencyService = require("../services/CurrencyService");
const LanguageService = require("../services/LanguageService");

// Utils
const cryptoCurrency = require("../utils/CryptoCurrency.json");
const forexCurrency = require("../utils/forex.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/price/g, async (msg) => {
  const chatId = msg.chat.id;
  const messages = new LanguageService(msg.from.language_code).getCommands(
    "price"
  );
  const message = messages.selectCurrency;
  const selectCurrency = msg.text.split(" ")[1];

  if (!selectCurrency) {
    const currencies = await NotificationService.getSubscriber(chatId);

    if (!currencies.length) {
      return TelegramService.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: messages.button.manualCurrency,
                callback_data: "PRICEMANUAL",
              },
            ],
          ],
        },
      });
    }

    const inline_keyboard = [
      ...currencies.map(({ currency }) => {
        return [
          {
            text: currency.split("_")[1],
            callback_data: `PRICE_${currency}`,
          },
        ];
      }),
    ];

    inline_keyboard.push([
      {
        text: messages.button.manualCurrency,
        callback_data: "PRICEMANUAL",
      },
    ]);

    return TelegramService.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard,
      },
    });
  }
});

TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;
  const callbackData = callbackQuery.data;
  const callbackDataSplit = callbackData.split("_");
  const callbackDataType = callbackDataSplit[0];
  const currencyType = callbackDataSplit[1];
  const currency = callbackDataSplit[2];
  const language = new LanguageService(callbackQuery.from.language_code);
  const messages = language.getCommands("price");
  const {
    dailyUpChange,
    dailyDownChange,
    weeklyUpChange,
    weeklyDownChange,
    monthlyUpChange,
    monthlyDownChange,
  } = language.get("currencyMessage");

  if (callbackDataType === "PRICEMANUAL") {
    // Delete Previous Message
    await TelegramService.deleteMessage(chatId, messageId);

    return TelegramService.sendMessage(
      chatId,
      messages.callbackQueryLang.pricemanual.selectCurrency,
      {
        reply_markup: {
          input_field_placeholder:
            messages.callbackQueryLang.pricemanual.placeholder,
          force_reply: true,
        },
      }
    );
  }

  if (callbackDataType === "PRICE") {
    const { price, cpd, cpw, cpm } = await CurrencyService.getCurrencyPrice(
      currencyType,
      currency
    );
    let message = `<b>${currency}:</b> ${price}\n\n`;

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
        message += monthlyUpChange.replace("{0}", cpm);
      } else {
        message += monthlyDownChange.replace("{0}", cpm);
      }
    }

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });
  }
});

// Reply Message (PRICEMANUAL)
TelegramService.on("message", async (msg) => {
  const replyMessage = msg.reply_to_message;
  const chatId = msg.chat.id;

  if (replyMessage) {
    if (
      replyMessage.text ===
        "Fiyatını görmek istediğiniz para birimini girin." ||
      replyMessage.text === "Enter the currency you want to see the price for."
    ) {
      const messages = new LanguageService(msg.from.language_code).getCommands(
        "price"
      );
      const selectCurrency = msg.text;

      // Forex Currency
      const filterForex = forexCurrency.flatMap((forex) => {
        if (
          selectCurrency + "USD" === forex ||
          selectCurrency + "EUR" === forex ||
          selectCurrency + "TRY" === forex ||
          selectCurrency + "GBP" === forex ||
          selectCurrency + "RUB" === forex ||
          selectCurrency + "AUD" === forex ||
          selectCurrency + "JPY" === forex ||
          selectCurrency + "CNY" === forex
        ) {
          return {
            text:
              forex.slice(0, selectCurrency.length) +
              " • " +
              forex.slice(selectCurrency.length, forex.length),
            callback_data: `PRICE_FOREX_${forex}`,
          };
        }

        return [];
      });

      if (filterForex.length) {
        // Delete Reply Message
        await TelegramService.deleteMessage(chatId, replyMessage.message_id);

        return TelegramService.sendMessage(
          chatId,
          messages.replyMessage.pricemanual.selectCurrency,
          {
            reply_markup: {
              inline_keyboard: [...filterForex.map((forex) => [forex])],
            },
          }
        );
      }

      // Crypto Currency
      const filterCrypto = cryptoCurrency.flatMap((crypto) => {
        if (
          selectCurrency + "USD" === crypto ||
          selectCurrency + "BUSD" === crypto ||
          selectCurrency + "EUR" === crypto ||
          selectCurrency + "TRY" === crypto ||
          selectCurrency + "GBP" === crypto ||
          selectCurrency + "RUB" === crypto ||
          selectCurrency + "AUD" === crypto
        ) {
          return {
            text:
              crypto.slice(0, selectCurrency.length) +
              " • " +
              crypto.slice(selectCurrency.length, crypto.length),
            callback_data: `PRICE_CRYPTO_${crypto}`,
          };
        }

        return [];
      });

      if (filterCrypto.length) {
        const sortedCryptoList = sortCryptoArray(filterCrypto, selectCurrency);

        // Delete Reply Message
        await TelegramService.deleteMessage(chatId, replyMessage.message_id);

        return TelegramService.sendMessage(
          chatId,
          messages.replyMessage.pricemanual.selectCurrency,
          {
            reply_markup: {
              inline_keyboard: [...sortedCryptoList.map((crypto) => [crypto])],
            },
          }
        );
      }

      // Delete Reply Message
      await TelegramService.deleteMessage(chatId, replyMessage.message_id);
      return TelegramService.sendMessage(chatId, messages.errorMessage);
    }
  }
});
