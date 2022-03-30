// Services
const TelegramService = require("../services/TelegramService");

// Utils
const cryptoCurrency = require("../utils/CryptoCurrency.json");
const forexCurrency = require("../utils/forex.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.on("message", async (msg) => {
  const replyMessage = msg.reply_to_message;
  const userId = msg.from.id;

  if (
    replyMessage &&
    replyMessage.text ===
      "Lütfen takip etmek istediğiniz para birimini giriniz."
  ) {
    const messageId = replyMessage.message_id;
    const selectedCurrency = msg.text.toUpperCase();

    // Forex Currency
    const filterForex = forexCurrency.flatMap((forex) => {
      if (
          selectedCurrency + "BTC" === forex ||
          selectedCurrency + "ETH" === forex ||
          selectedCurrency + "USD" === forex ||
          selectedCurrency + "EUR" === forex ||
          selectedCurrency + "TRY" === forex ||
          selectedCurrency + "GBP" === forex ||
          selectedCurrency + "RUB" === forex ||
          selectedCurrency + "AUD" === forex ||
          selectedCurrency + "JPY" === forex ||
          selectedCurrency + "CNY" === forex
      ) {
        return {
          text:
            forex.slice(0, selectedCurrency.length) +
            " • " +
            forex.slice(selectedCurrency.length, forex.length),
          callback_data: `FOLLOW_FOREX/${forex}`,
        };
      }

      return [];
    });

    if (filterForex.length) {
      // Delete Reply Message
      await TelegramService.deleteMessage(userId, messageId);

      return TelegramService.sendMessage(
        userId,
        "Lütfen takip etmek istediğiniz para birimini seçiniz.",
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
          selectedCurrency + "BTC" === crypto ||
          selectedCurrency + "ETH" === crypto ||
          selectedCurrency + "BNB" === crypto ||
          selectedCurrency + "USD" === crypto ||
          selectedCurrency + "BUSD" === crypto ||
          selectedCurrency + "EUR" === crypto ||
          selectedCurrency + "TRY" === crypto
      ) {
        return {
          text:
              selectedCurrency +
              " • " +
              crypto.slice(selectedCurrency.length, crypto.length),
          callback_data: `PRICE_CRYPTO/${crypto}`,
        };
      }

      return [];
    });

    if (filterCrypto.length) {
      const sortedCryptoList = sortCryptoArray(filterCrypto, selectedCurrency);

      // Delete Reply Message
      await TelegramService.deleteMessage(userId, messageId);

      return TelegramService.sendMessage(
        userId,
        "Lütfen takip etmek istediğiniz para birimini seçiniz.",
        {
          reply_markup: {
            inline_keyboard: [...sortedCryptoList.map((crypto) => [crypto])],
          },
        }
      );
    }

    // Delete Reply Message
    await TelegramService.deleteMessage(userId, messageId);
    return TelegramService.sendMessage(userId, "Bu para birimi mevcut değil.");
  }
});
