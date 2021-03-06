# Telegram Cryptocurrency Notification Bot

Telegram'da belirlediğiniz dakika, saat ve gün aralığında size istediğiniz para ve kripto para biriminin anlık fiyatını mesaj olarak gönderip piyasadan haberdar olmanızı sağlar.

[Telegram Bot Link](https://t.me/CryptoCurrency_NotificationBot)

[![CodeFactor](https://www.codefactor.io/repository/github/mercan/telegramcryptocurrencybot/badge)](https://www.codefactor.io/repository/github/mercan/telegramcryptocurrencybot)

## Bilgisayarınızda Çalıştırın

Projeyi klonlayın

```bash
  git clone https://github.com/mercan/TelegramCryptoCurrencyBot.git
```

Proje dizinine gidin

```bash
  cd TelegramCryptoCurrencyBot
```

Docker build alın ve çalıştırın\
Bilgisayarınızda docker yoksa buradan indirebilirsiniz [Docker İndir](https://docs.docker.com/get-docker/)

```bash
  docker-compose up
```

## Ortam Değişkenleri

Bu projeyi çalıştırmak için aşağıdaki ortam değişkenlerini .env dosyanıza eklemeniz gerekecek

`TELEGRAM_BOT_TOKEN`

`MONGODB_URI`

`FINAGE_API_KEY`

`RABBITMQ_URI`

## Kullanılan Teknolojiler

**Sunucu:** Docker, Node, MongoDB, RabbitMQ

## Sponsor

- [Finage](https://finage.co.uk/) finansal veriler için.
