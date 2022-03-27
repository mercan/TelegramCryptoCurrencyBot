require("dotenv").config();

module.exports = {
  FINAGE: {
    API_KEY: process.env.FINAGE_API_KEY,
  },
  TELEGRAM: {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME,
  },
  MONGODB: {
    URI: process.env.MONGODB_URI,
  },
  RABBITMQ: {
    HOST: process.env.RABBITMQ_HOST,
    USERNAME: process.env.RABBITMQ_USERNAME,
    PASSWORD: process.env.RABBITMQ_PASSWORD,
    VHOST: process.env.RABBITMQ_VHOST,
    URI: process.env.RABBITMQ_URI,
  },
};
