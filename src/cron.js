const cron = require("node-cron");

// Services
const NotificationService = require("./services/NotificationService");
const RabbitMQService = require("./services/RabbitMQService");

// Utils
const getNotificationMessage = require("./utils/getNotificationMessage");

cron.schedule("0,10,20,30,40,50 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(10);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0,30 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(30);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 * * * *", async () => {
  const notifications = await NotificationService.getNotifications(60);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0,6,12,18 * * *", async () => {
  const notifications = await NotificationService.getNotifications(360);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0,12 * * *", async () => {
  const notifications = await NotificationService.getNotifications(720);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});

cron.schedule("0 0 * * *", async () => {
  const notifications = await NotificationService.getNotifications(1440);
  const messages = await Promise.all(await getNotificationMessage(notifications));

  messages.forEach(({ userId, message }) => {
    RabbitMQService.sendToQueue({
      userId,
      text: message,
    });
  });
});
