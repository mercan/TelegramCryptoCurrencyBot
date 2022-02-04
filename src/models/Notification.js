const { Schema, model } = require("mongoose");

// Create the model class
const Notification = new Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },

    username: {
      type: String,
    },

    currencies: [
      {
        _id: false,

        symbol: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          required: true,
          enum: ["FOREX", "CRYPTO"],
        },

        timeInMinutes: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Export the model
module.exports = model("Notification", Notification);
