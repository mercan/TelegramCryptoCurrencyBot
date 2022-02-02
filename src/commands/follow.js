// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const CurrencyService = require("../services/CurrencyService");
const LanguageService = require("../services/LanguageService");

// Utils
const cryptoCurrency = require("../utils/CryptoCurrency.json");
const forexCurrency = require("../utils/forex.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/follow$/g, async (msg) => {
  const chatId = msg.chat.id;
  const messages = new LanguageService(msg.from.language_code).getCommands(
    "follow"
  );
  const message = messages.selectCurrencyTrack;

  await TelegramService.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "USD • TRY",
            callback_data: "FOLLOW_FOREX_USDTRY",
          },
          {
            text: "EUR • USD",
            callback_data: "FOLLOW_FOREX_EURUSD",
          },
        ],
        [
          {
            text: "Bitcoin USD (BTC • USD)",
            callback_data: "FOLLOW_CRYPTO_BTCUSD",
          },
        ],
        [
          {
            text: "Bitcoin TRY (BTC • TRY)",
            callback_data: "FOLLOW_CRYPTO_BTCTRY",
          },
        ],
        [
          {
            text: "Ethereum USD (ETH • USD)",
            callback_data: "FOLLOW_CRYPTO_ETHUSD",
          },
        ],
        [
          {
            text: "BNB USD (BNB • USD)",
            callback_data: "FOLLOW_CRYPTO_BNBUSD",
          },
        ],
        [
          {
            text: "GOLD USD (XAU • USD)",
            callback_data: "FOLLOW_FOREX_XAUUSD",
          },
        ],
        [
          {
            text: "Lite Coin USD (LTC • USD)",
            callback_data: "FOLLOW_CRYPTO_LTCUSD",
          },
        ],
        [
          {
            text: "SHIB USD (SHIB • USD)",
            callback_data: "FOLLOW_CRYPTO_SHIBUSD",
          },
        ],
        [
          {
            text: messages.button.manualCurrency,
            callback_data: "FOLLOWMANUAL",
          },
        ],
      ],
    },
  });
});

// Follow And Follow Manual
TelegramService.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const callbackData = callbackQuery.data;
  const callbackDataArray = callbackData.split("_");
  const callbackQueryType = callbackDataArray[0];
  const language = new LanguageService(callbackQuery.from.language_code);
  const { callbackQueryLang } = language.getCommands("follow");
  const { buttonTimes } = language.language;

  if (callbackQueryType === "FOLLOW" || callbackQueryType === "FOLLOWMANUAL") {
    // Follow Manual
    if (callbackQueryType === "FOLLOWMANUAL") {
      // Delete previous message
      await TelegramService.deleteMessage(chatId, messageId);

      return TelegramService.sendMessage(
        chatId,
        callbackQueryLang.followmanual.message,
        {
          reply_markup: {
            input_field_placeholder: callbackQueryLang.followmanual.placeholder,
            force_reply: true,
          },
        }
      );
    }
    // Follow
    const currencyType = callbackDataArray[1];
    const currency = callbackDataArray[2];
    const message = callbackQueryLang.follow.frequency.replace("{0}", currency);

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: buttonTimes["5min"],
              callback_data: `TIME_${currencyType}_${currency}_5_MINUTE`,
            },
            {
              text: buttonTimes["10min"],
              callback_data: `TIME_${currencyType}_${currency}_10_MINUTE`,
            },
            {
              text: buttonTimes["30min"],
              callback_data: `TIME_${currencyType}_${currency}_30_MINUTE`,
            },
          ],
          [
            {
              text: buttonTimes["1hour"],
              callback_data: `TIME_${currencyType}_${currency}_1_HOUR`,
            },
            {
              text: buttonTimes["6hour"],
              callback_data: `TIME_${currencyType}_${currency}_6_HOUR`,
            },
            {
              text: buttonTimes["12hour"],
              callback_data: `TIME_${currencyType}_${currency}_12_HOUR`,
            },
          ],
          [
            {
              text: buttonTimes["1day"],
              callback_data: `TIME_${currencyType}_${currency}_1_DAY`,
            },
          ],
        ],
      },
    });
  }
});

// TIME
TelegramService.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const username = callbackQuery.from.username || null;
  const callbackData = callbackQuery.data;
  const callbackDataArray = callbackData.split("_");
  const callbackQueryType = callbackDataArray[0];
  const currencyType = callbackDataArray[1];
  const currency = callbackDataArray[2];
  const time = callbackDataArray[3];
  const timeType = callbackDataArray[4];
  const language = new LanguageService(callbackQuery.from.language_code);
  const { callbackQueryLang } = language.getCommands("follow");
  const {
    dailyUpChange,
    dailyDownChange,
    weeklyUpChange,
    weeklyDownChange,
    monthlyUpChange,
    monthlyDownChange,
  } = language.get("currencyMessage");

  if (callbackQueryType === "TIME") {
    let message = "";

    if (timeType === "MINUTE") {
      message = callbackQueryLang.time.minute.replace("{0}", time);
    } else if (
      timeType === "HOUR" &&
      (time === "1" || callbackQuery.from.language_code === "tr")
    ) {
      message = callbackQueryLang.time.hour.replace("{0}", time);
    } else if (timeType === "HOUR" && callbackQueryLang.time.hours) {
      message = callbackQueryLang.time.hours.replace("{0}", time);
    } else if (timeType === "DAY") {
      message = callbackQueryLang.time.day;
    }

    const { price, cpd, cpw, cpm } = await CurrencyService.getCurrencyPrice(
      currencyType,
      currency
    );

    message += `<b>${currency}:</b> ${price}\n\n`;

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

    const notification = {
      username,
      chatId,
      currency: `${currencyType}_${currency}`,
      time: time,
      timeUnit: timeType.toLowerCase(),
    };

    // Save Notification
    await NotificationService.save(notification);
  }
});

// Reply Message (Follow Manual)
TelegramService.on("message", async (msg) => {
  const replyMessage = msg.reply_to_message;
  const chatId = msg.chat.id;

  if (replyMessage) {
    if (
      replyMessage.text === "Takip etmek istediğiniz para birimini girin." ||
      replyMessage.text === "Enter the currency you want to track."
    ) {
      const messages = new LanguageService(msg.from.language_code).getCommands(
        "follow"
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
            callback_data: `FOLLOW_FOREX_${forex}`,
          };
        }

        return [];
      });

      if (filterForex.length) {
        // Delete Reply Message
        await TelegramService.deleteMessage(chatId, replyMessage.message_id);

        return TelegramService.sendMessage(
          chatId,
          messages.selectCurrencyTrack,
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
            callback_data: `FOLLOW_CRYPTO_${crypto}`,
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
          messages.selectCurrencyTrack,
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
