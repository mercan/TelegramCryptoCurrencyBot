// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const CurrencyService = require("../services/CurrencyService");

// Utils
const cryptoCurrency = require("../utils/CryptoCurrency.json");
const forexCurrency = require("../utils/forex.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/follow$/g, async (msg) => {
  const chatId = msg.chat.id;
  const message = "Select the currency you want to track";

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
            text: "Manually enter the currency",
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

  if (callbackQueryType === "FOLLOW" || callbackQueryType === "FOLLOWMANUAL") {
    // Follow Manual
    if (callbackQueryType === "FOLLOWMANUAL") {
      // Delete previous message
      await TelegramService.deleteMessage(chatId, messageId);

      return TelegramService.sendMessage(
        chatId,
        "Enter the currency you want to track.",
        {
          reply_markup: {
            input_field_placeholder: "Enter the currency",
            force_reply: true,
          },
        }
      );
    }
    // Follow
    const currencyType = callbackDataArray[1];
    const currency = callbackDataArray[2];
    const message = `How often do you want to receive notifications from <b>${currency}</b>?`;

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "5 Minutes",
              callback_data: `TIME_${currencyType}_${currency}_5_MINUTE`,
            },
            {
              text: "10 Minutes",
              callback_data: `TIME_${currencyType}_${currency}_10_MINUTE`,
            },
            {
              text: "30 Minutes",
              callback_data: `TIME_${currencyType}_${currency}_30_MINUTE`,
            },
          ],
          [
            {
              text: "1 Hour",
              callback_data: `TIME_${currencyType}_${currency}_1_HOUR`,
            },
            {
              text: "6 Hour",
              callback_data: `TIME_${currencyType}_${currency}_6_HOUR`,
            },
            {
              text: "12 Hour",
              callback_data: `TIME_${currencyType}_${currency}_12_HOUR`,
            },
          ],
          [
            {
              text: "1 Day",
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

  if (callbackQueryType === "TIME") {
    let message = "";

    if (timeType === "MINUTE") {
      message = `You will receive a notifications every ${time} minutes.\n\n`;
    } else if (timeType === "HOUR" && time === "1") {
      message = `You will receive a notifications every ${time} hour.\n\n`;
    } else if (timeType === "HOUR") {
      message = `You will receive a notifications every ${time} hours.\n\n`;
    } else if (timeType === "DAY") {
      message = `You will receive a notification once a day.\n\n`;
    }

    const { price, cpd, cpw, cpm } = await CurrencyService.getCurrencyPrice(
      currencyType,
      currency
    );

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
        message += `Monthly Change: <b>↑ +${cpm}%</b>`;
      } else {
        message += `Monthly Change: <b>↓ ${cpm}%</b>`;
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

TelegramService.on("message", async (msg) => {
  const replyMessage = msg.reply_to_message;
  const chatId = msg.chat.id;

  if (replyMessage) {
    if (replyMessage.text === "Enter the currency you want to track.") {
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
          "Enter the currency you want to track.",
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
          "Enter the currency you want to track.",
          {
            reply_markup: {
              inline_keyboard: [...sortedCryptoList.map((crypto) => [crypto])],
            },
          }
        );
      }

      // Delete Reply Message
      await TelegramService.deleteMessage(chatId, replyMessage.message_id);
      return TelegramService.sendMessage(chatId, "Invalid currency.");
    }
  }
});
