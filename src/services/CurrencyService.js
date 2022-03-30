const fetch = require("node-fetch");
// Config
const { FINAGE } = require("../config/index");

class CurrencyService {
  getCurrencyPrice(type, symbol) {
    if (type === "FOREX") {
      return this.getForexCurrency(symbol);
    }

    if (type === "CRYPTO") {
      return this.getCryptoCurrency(symbol);
    }
  }

  async getCryptoCurrency(symbol) {
    try {
      const response = await fetch(
        `https://api.finage.co.uk/last/crypto/changes/${symbol}?apikey=${FINAGE.API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      data.price = data.lp;
      data.symbol = data.s;

      return data;
    } catch {
      const response = await fetch(
        `https://api.finage.co.uk/last/crypto/${symbol}?apikey=${FINAGE.API_KEY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      data.symbol = data.s;

      return data;
    }
  }

  async getForexCurrency(symbol) {
    const response = await fetch(
      `https://api.finage.co.uk/last/forex/${symbol}?apikey=${FINAGE.API_KEY}`,
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

    data.price = data.ask;
    return data;
  }
}

module.exports = new CurrencyService();
