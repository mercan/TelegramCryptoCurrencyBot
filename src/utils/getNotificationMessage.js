const CurrencyService = require("../services/CurrencyService");
const formatCurrencyMessage = require("./formatCurrencyMessage");

module.exports = async (notifications) => {
    return notifications.map(async ({ userId, currencies }) => {
        const currenciesObject = {};
        const messages = [];

        for (const {type, symbol} of currencies) {
            if (!currenciesObject[symbol]) {
                currenciesObject[symbol] = await CurrencyService.getCurrencyPrice(type, symbol);
            }

            const response = currenciesObject[symbol];
            messages.push(formatCurrencyMessage(response));
        }

        return {
            userId,
            message: messages.reduce((acc, message) => (acc + message), ""),
        };
    });
}