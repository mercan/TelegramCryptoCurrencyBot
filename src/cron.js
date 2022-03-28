const cron = require("node-cron");

// Services
const NotificationService = require("./services/NotificationService");
const RabbitMQService = require("./services/RabbitMQService");
const CurrencyService = require("./services/CurrencyService");

// Utils
const formatCurrencyMessage = require("./utils/formatCurrencyMessage");

async function getNotificationMessage(notifications) {
  return notifications.map(async ({ userId, currencies }) => {
    const currenciesObject = {};

    const messages = await Promise.all(
      currencies.map(async ({ type, symbol }) => {
        if (!currenciesObject[symbol]) {
          const response = await CurrencyService.getCurrencyPrice(type, symbol);
          currenciesObject[symbol] = response;
        }

        const response = currenciesObject[symbol];
        const message = formatCurrencyMessage(response);

        return message;
      })
    );

    return {
      userId,
      message: messages.reduce((acc, message) => (acc += message), ""),
    };
  });
}

cron.schedule("0,10,20,30,40,50 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(10);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0,30 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(30);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(60);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0,6,12,18 * * *", async () => {
  const notifications = await NotificationService.getNotifications(360);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0,12 * * *", async () => {
  const notifications = await NotificationService.getNotifications(720);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0 * * *", async () => {
  const notifications = await NotificationService.getNotifications(1440);
  const messages = await Promise.all(
    await getNotificationMessage(notifications)
  );

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});
