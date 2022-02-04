// Model
const notificationModel = require("../models/Notification");

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

  async deleteUser(userId) {
    await this.notificationModel.deleteOne({ userId });
  }

  async getSubscriberedCurrencies(userId) {
    const notificationRecord = await this.notificationModel.findOne(
      {
        userId,
      },
      "currencies"
    );

    return notificationRecord.currencies;
  }

  async cancelSubscriber(userId, type, symbol) {
    return await this.notificationModel.updateOne(
      {
        userId,
      },
      {
        $pull: {
          currencies: {
            type,
            symbol,
          },
        },
      }
    );
  }

  async createOrUpdateNotification(notification) {
    const { userId, username, currencies } = notification;
    const notificationRecord = await this.notificationModel.findOne({ userId });

    if (notificationRecord) {
      const checkCurrency = notificationRecord.currencies.filter(
        ({ type, symbol, timeInMinutes }) => {
          if (currencies[0].type === type && currencies[0].symbol === symbol) {
            return {
              type,
              symbol,
              timeInMinutes,
            };
          }
        }
      );

      if (checkCurrency.length) {
        return this.notificationModel.updateOne(
          {
            userId,
            currencies: {
              $elemMatch: {
                type: checkCurrency[0].type,
                symbol: checkCurrency[0].symbol,
              },
            },
          },
          {
            "currencies.$.timeInMinutes": currencies[0].timeInMinutes,
          }
        );
      }

      return this.notificationModel.updateOne(
        {
          userId,
        },
        {
          $push: {
            currencies,
          },
        }
      );
    }

    const newNotification = {
      userId,
      username,
      currencies,
    };

    return this.notificationModel.create(newNotification);
  }

  async getNotifications(timeInMinutes) {
    return await this.notificationModel.aggregate([
      {
        $match: {
          currencies: {
            $elemMatch: {
              timeInMinutes,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          currencies: {
            $filter: {
              input: "$currencies",
              as: "currency",
              cond: {
                $eq: ["$$currency.timeInMinutes", timeInMinutes],
              },
            },
          },
        },
      },
    ]);
  }
}

module.exports = new NotificationService();
