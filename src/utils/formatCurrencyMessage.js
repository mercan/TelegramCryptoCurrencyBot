module.exports = ({ symbol, price, cpd, cpw, cpm }) => {
  let message = `💵 <b>${symbol}:</b> ${price}\n\n`;

  if (cpd) {
    if (cpd >= 0) {
      message += `Günlük Değişim: <b>⬆️ +${cpd}%</b>\n`;
    } else {
      message += `Günlük Değişim: <b>⬇️ ${cpd}%</b>\n`;
    }

    if (cpw >= 0) {
      message += `Haftalık Değişim: <b>⬆️ +${cpw}%</b>\n`;
    } else {
      message += `Haftalık Değişim: <b>⬇️ ${cpw}%</b>\n`;
    }

    if (cpm >= 0) {
      message += `Aylık Değişim: <b>⬆️ +${cpm}%</b>\n\n`;
    } else {
      message += `Aylık Değişim: <b>⬇️ ${cpm}%</b>\n\n`;
    }
  }

  return message;
};
