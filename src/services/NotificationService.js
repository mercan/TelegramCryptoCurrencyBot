// Model
const notificationModel = require("../models/Notification");

class NotificationService {
  constructor() {
    this.notificationModel = notificationModel;
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
    return this.notificationModel.aggregate([
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

  async getSubscriberedCurrencies(userId) {
    const notificationRecord = await this.notificationModel.findOne(
      {
        userId,
      },
      "currencies"
    );

    return notificationRecord ? notificationRecord.currencies : [];
  }

  async cancelSubscriber(userId, type, symbol) {
    return this.notificationModel.updateOne(
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

  async deleteUser(userId) {
    await this.notificationModel.deleteOne({ userId });
  }
}

module.exports = new NotificationService();
