// Services
const TelegramService = require("../services/TelegramService");

TelegramService.onText(/^\/bilgi$/g, (msg) => {
  const userId = msg.from.id;
  const message = `
Merhaba
  
Seçtiğiniz para biriminden size istediğiniz sıklıkta mesaj gönderebilir ve piyasadan sürekli haberdar olmanızı sağlayabilirim.
Aboneliklerinizi istediğiniz zaman sonlandırabilir veya haber alma sıklığında değişiklik yapabilirsiniz.
  
<b>Hızlı Kullanım:</b>
/takip Komutu ile yeni bir abonelik başlatabilir veya mevcut aboneliğinizin bildirim gönderme sıklığını değiştirebilirsiniz.
/sondurum Komutu ile abone olduğunuz tüm döviz birimlerinin son durumlarını öğrenebilirsiniz.
/fiyat Komutu ile istediğiniz para biriminin son fiyatını öğrenebilirsiniz.
/aboneliklerim Komutu ile tüm aboneliklerinizi listeleyebilir ve abone olduğunuz para biriminde hangi kanalda olduğunuzu görebilirsiniz.
/iptal Komutu ile istediğiniz para birimindeki aboneliğinizi sonlandırabilirsiniz. Abonelik daha sonra yeniden başlatılabilir.
/tumiptal Komutu ile tüm aboneliklerinizi sonlandırabilirsiniz.
/bilgi Komutu ile dilediğiniz zaman bu bilgilere tekrar ulaşabilirsiniz.
`;

  TelegramService.sendMessage(userId, message, {
    parse_mode: "HTML",
  });
});
