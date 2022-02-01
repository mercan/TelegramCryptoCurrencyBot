// Services
const TelegramService = require("../services/TelegramService");

TelegramService.onText(/^\/help$/g, async (msg) => {
  const chatId = msg.chat.id;
  const message = `
Hello

I can send you a message as often as you want from the currency you have chosen, and I can ensure that you are constantly informed of the market.
  
You can terminate your subscriptions at any time or make changes to the frequency of receiving news.

<b>Quick Use:</b>
/follow You can start a new subscription with the command, or you can change the frequency of sending notifications of your existing subscription.
/price You can find out the last price of the currency unit you want with the command.
/subscriptions With the command, you can list all your subscriptions and see which channel you are on in the currency you subscribe to.
/cancel You can terminate your subscription to the currency of your choice with the command. The subscription can then be restarted.
/cancelall You can terminate all your subscriptions with the command.
`;

  await TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
});
