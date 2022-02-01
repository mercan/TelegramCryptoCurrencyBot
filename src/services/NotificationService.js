const notificationModel = require("../models/Notification");

// Services
const CurrencyService = require("./CurrencyService");

class NotificationService {
  constructor() {
    this.notificationModel = notificationModel;
  }

  async save(notification) {
    const notificationRecord = await this.notificationModel.findOne({
      $or: [
        notification,
        {
          chatId: notification.chatId,
          currency: notification.currency,
        },
      ],
    });

    if (
      notificationRecord &&
      (notificationRecord.time != notification.time ||
        notificationRecord.timeUnit != notification.timeUnit)
    ) {
      return await this.notificationModel.updateOne(
        {
          chatId: notification.chatId,
          currency: notification.currency,
        },
        {
          $set: {
            time: notification.time,
            timeUnit: notification.timeUnit,
          },
        }
      );
    } else if (!notificationRecord) {
      return await this.notificationModel.create(notification);
    }
  }

  async deleteUser(chatId) {
    await this.notificationModel.deleteMany({
      chatId,
    });
  }

  async getSubscriber(chatId) {
    const subscribers = await this.notificationModel.find({
      chatId,
    });

    return subscribers.map((subscriber) => {
      return {
        chatId: subscriber.chatId,
        currency: subscriber.currency,
        time: subscriber.time,
        timeUnit: subscriber.timeUnit,
      };
    });
  }

  async cancelSubscriber(chatId, currency) {
    await this.notificationModel.deleteOne({
      chatId,
      currency,
    });
  }

  async get5MinuteNotifications() {
    const notifications = await this.notificationModel.find({
      time: 5,
      timeUnit: "minute",
    });

    return notifications;
  }

  async get10MinuteNotifications() {
    const notifications = await this.notificationModel.find({
      time: 10,
      timeUnit: "minute",
    });

    return notifications;
  }

  async get30MinuteNotifications() {
    const notifications = await this.notificationModel.find({
      time: 30,
      timeUnit: "minute",
    });

    return notifications;
  }

  async get1HourNotifications() {
    const notifications = await this.notificationModel.find({
      time: 1,
      timeUnit: "hour",
    });

    return notifications;
  }

  async get6HourNotifications() {
    const notifications = await this.notificationModel.find({
      time: 6,
      timeUnit: "hour",
    });

    return notifications;
  }

  async get12HourNotifications() {
    const notifications = await this.notificationModel.find({
      time: 12,
      timeUnit: "hour",
    });

    return notifications;
  }

  async get1DayNotifications() {
    const notifications = await this.notificationModel.find({
      time: 1,
      timeUnit: "day",
    });

    return notifications;
  }
}

module.exports = new NotificationService();
