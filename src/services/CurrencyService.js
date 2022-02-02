const fetch = require("node-fetch");
// Config
const { FINAGE } = require("../config/index");

class CurrencyService {
  async getCurrencyPrice(currencyType, currency) {
    if (currencyType === "CRYPTO") {
      return await this.getCryptoCurrency(currency);
    } else if (currencyType === "FOREX") {
      return await this.getForexCurrency(currency);
    }
  }

  async getCryptoCurrency(currency) {
    try {
      const response = await fetch(
        `https://api.finage.co.uk/last/crypto/changes/${currency}?apikey=${FINAGE.API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      data.price = Number(data.lp.toFixed(4));

      return data;
    } catch {
      const response = await fetch(
        `https://api.finage.co.uk/last/crypto/${currency}?apikey=${FINAGE.API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      data.price = Number(data.price.toFixed(4));

      return data;
    }
  }

  async getForexCurrency(currency) {
    const response = await fetch(
      `https://api.finage.co.uk/last/forex/${currency}?apikey=${FINAGE.API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      return null;
    }

    data.price = Number(data.ask.toFixed(4));
    return data;
  }
}

module.exports = new CurrencyService();
