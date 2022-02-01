const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema(
  {
    username: {
      type: String,
    },

    chatId: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    time: {
      type: Number,
      required: true,
    },

    timeUnit: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", Notification);
