// Services
const TelegramService = require("../services/TelegramService");

const cryptoCurrency = require("../utils/CryptoCurrency.json");
const forexCurrency = require("../utils/forex.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/listcurrency/g, async (msg) => {
  const chatId = msg.chat.id;
  const selectCurrency = msg.text.split(" ")[1];
  const message = "Select the currency you want to track";
  const errorMessage =
    "Choose a crypto or forex currency\n\n<b>Example</b>: /listcurrency BTC";

  if (!selectCurrency) {
    return await TelegramService.sendMessage(chatId, errorMessage, {
      parse_mode: "HTML",
    });
  }

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
    return await TelegramService.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [...filterForex.map((forex) => [forex])],
      },
    });
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

    return await TelegramService.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [...sortedCryptoList.map((crypto) => [crypto])],
      },
    });
  }

  return await TelegramService.sendMessage(chatId, errorMessage, {
    parse_mode: "HTML",
  });
});
