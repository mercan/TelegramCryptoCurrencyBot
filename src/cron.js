const cron = require("node-cron");
const NotificationService = require("./services/NotificationService");
const RabbitMQService = require("./services/RabbitMQService");
const CurrencyService = require("./services/CurrencyService");

async function getNotificationMessage(notifications) {
  const currency = {};

  return notifications.map(async (notification) => {
    const { currency: currencyName, chatId } = notification;

    if (!currency[currencyName]) {
      const response = await CurrencyService.getCurrency(currencyName);

      currency[currencyName] = {
        price: response.lp ? response.lp : response.price,
        cpd: response.cpd,
      };
    }

    const { price, cpd } = currency[currencyName];

    const message = `<b>${currencyName}:</b> ${price} ${
      cpd ? (cpd >= 0 ? `<b>↑ ${cpd}%</b>` : `<b>↓ ${cpd}%</b>`) : ""
    }`;

    return {
      chatId,
      message,
    };
  });
}

cron.schedule("0,5,10,15,20,25,30,35,40,45,50,55 * * * *", async () => {
  console.log("Cron Status: Started => 5 Dakika");
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
  console.log("Cron Status: Started => 10 Dakika");
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
  console.log("Cron Status: Started => 30 Dakika");
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
  console.log("Cron Status: Started => 1 Saat");
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
  console.log("Cron Status: Started => 4 Saat");
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
  console.log("Cron Status: Started => 12 Saat");
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
  console.log("Cron Status: Started => 1 Gün");
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
