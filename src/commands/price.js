// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const CurrencyService = require("../services/CurrencyService");

const cryptoCurrency = require("../utils/CryptoCurrency.json");
const sortCryptoArray = require("../utils/sortCryptoArray");

TelegramService.onText(/^\/price/g, async (msg) => {
  const chatId = msg.chat.id;
  const message = "Select the currency you want to see the price for.";
  const errorMessage =
    "Select a crypto currency\n\n<b>Example</b>: /price or /price BTC";
  const selectCrypto = msg.text.split(" ")[1];

  if (!selectCrypto) {
    const subscribers = await NotificationService.getSubscriber(chatId);

    if (!subscribers.length) {
      return await TelegramService.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Manually enter the currency",
                callback_data: "PRICEMANUAL",
              },
            ],
          ],
        },
      });
    }

    const inline_keyboard = [
      ...subscribers.map((subscriber) => {
        return [
          {
            text: `${subscriber.currency}`,
            callback_data: `PRICE_${subscriber.currency}`,
          },
        ];
      }),
    ];

    inline_keyboard.push([
      {
        text: "Manually enter the currency",
        callback_data: "PRICEMANUAL",
      },
    ]);

    await TelegramService.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard,
      },
    });
  } else {
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
          callback_data: `PRICE_${crypto}`,
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
  }
});

TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const message = "Select a crypto currency\n\n<b>Example</b>: /price BTC";
  const chatId = callbackQuery.message.chat.id;
  const callBackData = callbackQuery.data;
  const callBackDataSplit = callBackData.split("_");
  const callBackDataType = callBackDataSplit[0];
  const callBackDataCurrency = callBackDataSplit[1];

  if (callBackDataType === "PRICEMANUAL") {
    return await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });
  }

  if (callBackDataType === "PRICE") {
    const { price, cpd, cpw, cpm } = await CurrencyService.getCurrency(
      callBackDataCurrency
    );
    let message = `<b>${callBackDataCurrency}:</b> ${price}\n\n`;

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
  }
});
