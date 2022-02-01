const cron = require("node-cron");
const NotificationService = require("./services/NotificationService");
const RabbitMQService = require("./services/RabbitMQService");
const CurrencyService = require("./services/CurrencyService");

async function getNotificationMessage(notifications) {
  const currency = {};

  return notifications.map(async (notification) => {
    const { currency: currencyName, chatId } = notification;

    if (!currency[currencyName]) {
      const response = await CurrencyService.getPrice(currencyName);

      currency[currencyName] = {
        ...response,
        price: response.lp ? response.lp : response.price,
      };
    }

    const { price, cpd, cpw, cpm } = currency[currencyName];
    let message = `
    ​
<b>${currencyName}:</b> ${price}\n\n`;

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

    return {
      chatId,
      message,
    };
  });
}

cron.schedule("0,5,10,15,20,25,30,35,40,45,50,55 * * * *", async () => {
  const notifications = await NotificationService.get5MinuteNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0,10,20,30,40,50 * * * *", async () => {
  const notifications = await NotificationService.get10MinuteNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0,30 * * * *", async () => {
  const notifications = await NotificationService.get30MinuteNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0 * * * *", async () => {
  const notifications = await NotificationService.get1HourNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0 0,6,12,18 * * *", async () => {
  const notifications = await NotificationService.get6HourNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0 0,12 * * *", async () => {
  const notifications = await NotificationService.get12HourNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});

cron.schedule("0 0 * * *", async () => {
  const notifications = await NotificationService.get1DayNotifications();
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ chatId, message }) => {
    RabbitMQService.sendToQueue({
      chatId,
      text: message,
    });
  });
});
