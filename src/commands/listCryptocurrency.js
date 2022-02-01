// Services
const TelegramService = require("../services/TelegramService");

const cryptoCurrency = require("../utils/CryptoCurrency.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/listcrypto/g, async (msg) => {
  const chatId = msg.chat.id;
  const selectCrypto = msg.text.split(" ")[1];
  const message = "Select the currency you want to track";
  const errorMessage =
    "Select a crypto currency\n\n<b>Example</b>: /listcrypto BTC";

  if (!selectCrypto) {
    return await TelegramService.sendMessage(chatId, errorMessage, {
      parse_mode: "HTML",
    });
  }

  const filterCrypto = cryptoCurrency.flatMap((crypto) => {
    if (
      selectCrypto + "USD" === crypto ||
      selectCrypto + "BUSD" === crypto ||
      selectCrypto + "EUR" === crypto ||
      selectCrypto + "TRY" === crypto ||
      selectCrypto + "GBP" === crypto ||
      selectCrypto + "RUB" === crypto ||
      selectCrypto + "AUD" === crypto
    ) {
      return {
        text:
          crypto.slice(0, selectCrypto.length) +
          " • " +
          crypto.slice(selectCrypto.length, crypto.length),
        callback_data: `FOLLOW_${crypto}`,
      };
    } else {
      return [];
    }
  });

  if (filterCrypto.length === 0) {
    return await TelegramService.sendMessage(chatId, errorMessage, {
      parse_mode: "HTML",
    });
  }

  const sortedCryptoList = sortCryptoArray(filterCrypto, selectCrypto);

  await TelegramService.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [...sortedCryptoList.map((crypto) => [crypto])],
    },
  });
});
