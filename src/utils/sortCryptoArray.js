module.exports = (cryptoArray, cryptoCurrency) => {
  const sortedCryptoList = [];

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "BTC" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "ETH" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "BNB" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "USD" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "BUSD" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "EUR" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "TRY" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  return sortedCryptoList;
};
