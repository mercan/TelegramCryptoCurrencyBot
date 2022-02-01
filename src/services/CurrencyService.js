const fetch = require("node-fetch");
// Config
const { FINAGE } = require("../config/index");

class CurrencyService {
  async getPrice(currency) {
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
      data.price = data.lp.toFixed(4);

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
      data.price = data.price.toFixed(4);

      return data;
    }
  }
}

module.exports = new CurrencyService();
