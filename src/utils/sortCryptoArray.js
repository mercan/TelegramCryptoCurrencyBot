module.exports = (cryptoArray, cryptoCurrency) => {
  const sortedCryptoList = [];

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

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "GBP" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "RUB" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  for (const { text, callback_data } of cryptoArray) {
    if (cryptoCurrency + " • " + "AUD" === text) {
      sortedCryptoList.push({ text, callback_data });
      break;
    }
  }

  return sortedCryptoList;
};
