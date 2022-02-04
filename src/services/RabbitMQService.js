const { RABBITMQ } = require("../config/index");
const amqplib = require("amqplib");
const amqpUrl = RABBITMQ.URI;

// Services
const TelegramService = require("./TelegramService");
const NotificationService = require("./NotificationService");

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queueName = "notification";

    this.connect();
  }

  async connect() {
    this.connection = await amqplib.connect(amqpUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName);

    this.channel.consume(this.queueName, async (msg) => {
      const message = JSON.parse(msg.content.toString());
      const userId = message.userId;
      const messageText = message.text;

      try {
        await TelegramService.sendMessage(userId, messageText, {
          parse_mode: "HTML",
        });

        console.log(
          `LOG: Message sent to ${userId} successfully with text: ${messageText
            .trim()
            .replace(/\n/g, "")} - ${Date.now()}`
        );
        this.channel.ack(msg);
      } catch (error) {
        console.error(
          "Send Message Error:",
          {
            error_code: error.response.body.error_code,
            description: error.response.body.description,
            timestamp: Date.now(),
          },
          "Message:",
          message
        );

        if (error.response.body.error_code === 403) {
          await NotificationService.deleteUser(userId);
          this.channel.ack(msg);
        } else if (error.response.body.error_code === 429) {
          this.channel.nack(msg);
        }
      }
    });
  }

  sendToQueue(message) {
    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(message))
    );
  }
}

module.exports = new RabbitMQService();
