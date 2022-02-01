// Services
const TelegramService = require("../services/TelegramService");
const NotificationService = require("../services/NotificationService");
const CurrencyService = require("../services/CurrencyService");

TelegramService.onText(/^\/follow$/g, async (msg) => {
  const chatId = msg.chat.id;
  const message = "Select the currency you want to track";

  await TelegramService.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "USD • TRY",
            callback_data: "FOLLOW_USDTRY",
          },
          {
            text: "EUR • USD",
            callback_data: "FOLLOW_EURUSD",
          },
        ],
        [
          {
            text: "Bitcoin USD (BTC • USD)",
            callback_data: "FOLLOW_BTCUSD",
          },
        ],
        [
          {
            text: "Bitcoin EUR (BTC • EUR)",
            callback_data: "FOLLOW_BTCEUR",
          },
        ],
        [
          {
            text: "Bitcoin TRY (BTC • TRY)",
            callback_data: "FOLLOW_BTCTRY",
          },
        ],
        [
          {
            text: "Ethereum USD (ETH • USD)",
            callback_data: "FOLLOW_ETHUSD",
          },
        ],
        [
          {
            text: "BNB USD (BNB • USD)",
            callback_data: "FOLLOW_BNBUSD",
          },
        ],
        [
          {
            text: "Lite Coin USD (LTC • USD)",
            callback_data: "FOLLOW_LTCUSD",
          },
        ],
        [
          {
            text: "NEO USD (NEO • USD)",
            callback_data: "FOLLOW_NEOUSD",
          },
        ],
        [
          {
            text: "Ripple USD (XRP • USD)",
            callback_data: "FOLLOW_XRPUSD",
          },
        ],
        [
          {
            text: "DOGE USD (DOGE • USD)",
            callback_data: "FOLLOW_DOGEUSD",
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

TelegramService.on("callback_query", async (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;
  const username = callbackQuery.from.username || null;
  const callBackData = callbackQuery.data;
  const callBackDataSplit = callBackData.split("_");
  const callBackDataType = callBackDataSplit[0];
  const callBackDataCurrency = callBackDataSplit[1];
  const callBackDataTimeUnit = callBackDataSplit[3];
  const notificationTime = callBackDataSplit[2];

  // Manuel input
  if (callBackDataType === "FOLLOWMANUAL") {
    const message =
      "Enter the currency you want to track\n\n<b>Example</b>: /listcrypto BTC";

    return await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });
  }

  if (callBackDataType === "FOLLOW") {
    const message = `How often do you want to receive notifications from <b>${callBackDataCurrency}</b>?`;

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "5 Minutes",
              callback_data: `TIME_${callBackDataCurrency}_5_MINUTE`,
            },
            {
              text: "10 Minutes",
              callback_data: `TIME_${callBackDataCurrency}_10_MINUTE`,
            },
            {
              text: "30 Minutes",
              callback_data: `TIME_${callBackDataCurrency}_30_MINUTE`,
            },
          ],
          [
            {
              text: "1 Hour",
              callback_data: `TIME_${callBackDataCurrency}_1_HOUR`,
            },
            {
              text: "6 Hour",
              callback_data: `TIME_${callBackDataCurrency}_6_HOUR`,
            },
            {
              text: "12 Hour",
              callback_data: `TIME_${callBackDataCurrency}_12_HOUR`,
            },
          ],
          [
            {
              text: "1 Day",
              callback_data: `TIME_${callBackDataCurrency}_1_DAY`,
            },
          ],
        ],
      },
    });
  } else if (callBackDataType === "TIME") {
    let message = "";
    const { price, cpd } = await CurrencyService.getCurrency(
      callBackDataCurrency
    );

    if (callBackDataTimeUnit === "MINUTE") {
      message = `You will receive a notifications every ${notificationTime} minutes.

<b>${callBackDataCurrency}:</b> ${price} ${
        cpd ? (cpd >= 0 ? `<b>↑ ${cpd}%</b>` : `<b>↓ ${cpd}%</b>`) : ""
      }`;
    } else if (callBackDataTimeUnit === "HOUR" && notificationTime === "1") {
      message = `You will receive a notifications every ${notificationTime} hour.
      
<b>${callBackDataCurrency}:</b> ${price} ${
        cpd ? (cpd >= 0 ? `<b>↑ ${cpd}%</b>` : `<b>↓ ${cpd}%</b>`) : ""
      }`;
    } else if (callBackDataTimeUnit === "HOUR") {
      message = `You will receive a notifications every ${notificationTime} hours.

<b>${callBackDataCurrency}:</b> ${price} ${
        cpd ? (cpd >= 0 ? `<b>↑ ${cpd}%</b>` : `<b>↓ ${cpd}%</b>`) : ""
      }`;
    } else if (callBackDataTimeUnit === "DAY") {
      message = `You will receive a notification once a day.

<b>${callBackDataCurrency}:</b> ${price} ${
        cpd ? (cpd >= 0 ? `<b>↑ ${cpd}%</b>` : `<b>↓ ${cpd}%</b>`) : ""
      }`;
    }

    await TelegramService.editMessageText(chatId, messageId, message, {
      parse_mode: "HTML",
    });

    let notificationTimeUnit = "";

    if (callBackDataTimeUnit === "MINUTE") {
      notificationTimeUnit = "minute";
    } else if (callBackDataTimeUnit === "HOUR") {
      notificationTimeUnit = "hour";
    } else if (callBackDataTimeUnit === "DAY") {
      notificationTimeUnit = "day";
    }

    // Save notification
    const notification = {
      username,
      chatId,
      currency: callBackDataCurrency,
      time: notificationTime,
      timeUnit: notificationTimeUnit,
    };

    await NotificationService.save(notification);
  }
});
