// Builds the MovieForUs website, in Turkish and in English: a landing page,
// the privacy policy, the terms of use and a support page, twice over, with a
// link between each page and its twin.
//
//   node --experimental-strip-types build.mjs
//
// The terms pages are generated from the app's own dictionaries (src/i18n),
// so the text people accept in the app and the text published here cannot
// drift -- in either language.
//
// Everything that has to be filled in by a person lives in CONFIG. A value
// still in square brackets is shown highlighted on the page and makes this
// script say so, so an unfinished page cannot be published without noticing.

import fs from 'node:fs';
import path from 'node:path';

const CONFIG = {
  // Who is responsible for the data (KVKK "veri sorumlusu"). Named by role
  // rather than by the developer's own name, at the developer's request.
  controller: {
    tr: 'MovieForUs uygulamasının geliştiricisi',
    en: 'the developer of the MovieForUs app',
  },
  email: 'movieforus.destek@gmail.com',
  // Where the Supabase project runs. Established from the database host's
  // address against AWS's published ranges: eu-central-1.
  region: { tr: 'Frankfurt, Almanya (Avrupa Birliği)', en: 'Frankfurt, Germany (European Union)' },
  // Effective date of the privacy policy.
  effective: '2026-09-29',
  // The app's page on the App Store.
  appStore: 'https://apps.apple.com/tr/app/movieforus/id6811587180',
};

const app = path.join(process.env.HOME, 'Developer/MovieForUs');
const { tr } = await import(path.join(app, 'src/i18n/tr.ts'));
const { en } = await import(path.join(app, 'src/i18n/en.ts'));
// Read rather than imported: legal.ts imports through the app's '@/' alias,
// which node does not resolve, and the version is one line of it.
const TermsVersion = fs
  .readFileSync(path.join(app, 'src/constants/legal.ts'), 'utf8')
  .match(/TermsVersion = '([^']+)'/)[1];
const terms = { tr: tr.terms.sections, en: en.terms.sections };

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escapes, then marks any unfilled [placeholder] so it is impossible to miss. */
const fill = (text) =>
  escape(text).replace(/\[([^\]]+)\]/g, '<mark title="Doldurulmadı">[$1]</mark>');

const dateTR = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const dateEN = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const wordmark = '<span class="wordmark">Movie<span class="for">For</span>Us</span>';

/**
 * Every page and its twin in the other language. The switch in the header
 * lands on the same page rather than the front door, which is the difference
 * between changing language and losing your place.
 */
const twin = {
  'index.html': 'en.html',
  'en.html': 'index.html',
  'gizlilik.html': 'privacy.html',
  'privacy.html': 'gizlilik.html',
  'sartlar.html': 'terms.html',
  'terms.html': 'sartlar.html',
  'destek.html': 'support.html',
  'support.html': 'destek.html',
};

function page({ file, lang = 'tr', title, description, body }) {
  const links =
    lang === 'tr'
      ? `<a href="./">Ana sayfa</a><a href="gizlilik.html">Gizlilik</a><a href="sartlar.html">Şartlar</a><a href="destek.html">Destek</a>`
      : `<a href="en.html">Home</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="support.html">Support</a>`;
  // Labelled in the language it leads to, as language switches are.
  const other = `<a class="lang" href="${twin[file]}" hreflang="${lang === 'tr' ? 'en' : 'tr'}">${
    lang === 'tr' ? 'English' : 'Türkçe'
  }</a>`;
  const nav = links + other;
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="alternate" hreflang="${lang === 'tr' ? 'en' : 'tr'}" href="${twin[file]}">
<link rel="alternate" hreflang="${lang}" href="${file}">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="top"><a class="brand" href="./">${wordmark}</a><nav>${nav}</nav></header>
<main>
${body}
</main>
<footer>
  <a class="tmdb" href="https://www.themoviedb.org/"><img src="tmdb-logo.svg" alt="TMDB"></a>
  <p>This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.</p>
  ${lang === 'tr' ? '<p>Bu uygulama TMDB’yi ve TMDB API’lerini kullanır, ancak TMDB tarafından onaylanmış, sertifikalandırılmış ya da başka bir şekilde desteklenmiş değildir.</p>' : ''}
  <p>© ${new Date().getFullYear()} MovieForUs</p>
</footer>
</body>
</html>
`;
  fs.writeFileSync(new URL(file, import.meta.url), html);
}

const section = (heading, ...paragraphs) =>
  `<section><h2>${escape(heading)}</h2>${paragraphs.join('\n')}</section>`;
const p = (text) => `<p>${fill(text)}</p>`;
const list = (items) => `<ul>${items.map((item) => `<li>${fill(item)}</li>`).join('')}</ul>`;

/* ------------------------------------------------------------------ */
/* landing page                                                        */
/* ------------------------------------------------------------------ */

page({
  file: 'index.html',
  title: 'MovieForUs — Film zevkin tutan biriyle tanış',
  description: 'MovieForUs film zevkine göre eşleştiren bir tanışma uygulamasıdır.',
  body: `
<section class="hero">
  <h1>${wordmark}</h1>
  <p class="lead">Film zevkin tutan biriyle tanış.</p>
  <p>Film kaydır, beğendiklerin ve geçtiklerin üzerinden zevkin ortaya çıksın. Aynı filmlerde seninle anlaşan, 100 km içindeki kişilerle eşleş; sohbet et, ardından birlikte izleyeceğiniz filmi birlikte seçin.</p>
  <p class="store">
    <!-- Apple's own badge, unmodified and at its own proportions, as its
         marketing guidelines require. The black badge carries its own
         background, so it reads on the dark page and on the light one. Served from this site so the page does not
         call out to Apple for it. -->
    <a class="store-badge" href="${CONFIG.appStore}">
      <img src="app-store-badge-tr.svg" alt="App Store’dan İndirin" width="151" height="40">
    </a>
  </p>
  <p class="muted">iPhone için ücretsiz. 18 yaş ve üzeri.</p>
</section>
<section class="cards">
  <div class="card"><h3>Film kaydır</h3><p>Herkesin gördüğü ortak filmler ve sana özel öneriler. Günde 30 kart.</p></div>
  <div class="card"><h3>Eşleş</h3><p>En az 8 ortak filmde anlaştığın kişiler sana önerilir.</p></div>
  <div class="card"><h3>Birlikte seç</h3><p>Eşleştiğin kişiyle aynı filmleri kaydırın, ikinizin de beğendiği film ortaya çıksın.</p></div>
</section>
<section class="links">
  <a href="${CONFIG.appStore}">App Store</a> · <a href="gizlilik.html">Gizlilik Politikası</a> · <a href="sartlar.html">Kullanım Şartları</a> · <a href="destek.html">Destek</a> · <a href="en.html">English</a>
</section>`,
});

/* ------------------------------------------------------------------ */
/* landing page — English                                              */
/* ------------------------------------------------------------------ */

page({
  file: 'en.html',
  lang: 'en',
  title: 'MovieForUs — Meet someone with your taste in films',
  description: 'MovieForUs is a dating app that matches people on their taste in films.',
  body: `
<section class="hero">
  <h1>${wordmark}</h1>
  <p class="lead">Meet someone with your taste in films.</p>
  <p>Swipe through films and let your taste show in what you keep and what you pass on. Match with people within 100 km who agree with you on the same films; talk, then pick what to watch together, together.</p>
  <p class="store">
    <a class="store-badge" href="${CONFIG.appStore}">
      <img src="app-store-badge-tr.svg" alt="Download on the App Store" width="151" height="40">
    </a>
  </p>
  <p class="muted">Free for iPhone. 18 and over.</p>
</section>
<section class="cards">
  <div class="card"><h3>Swipe films</h3><p>Films everybody sees, and recommendations made for you. 30 cards a day.</p></div>
  <div class="card"><h3>Match</h3><p>People who agreed with you on at least 8 of the same films — or liked 5 of the same ones.</p></div>
  <div class="card"><h3>Choose together</h3><p>Swipe the same films with the person you matched with, and the one you both like surfaces.</p></div>
</section>
<section class="links">
  <a href="${CONFIG.appStore}">App Store</a> · <a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms of Use</a> · <a href="support.html">Support</a> · <a href="./">Türkçe</a>
</section>`,
});

/* ------------------------------------------------------------------ */
/* privacy policy — Turkish                                            */
/* ------------------------------------------------------------------ */

page({
  file: 'gizlilik.html',
  title: 'Gizlilik Politikası — MovieForUs',
  description: 'MovieForUs uygulamasının kişisel verileri nasıl işlediği.',
  body: `
<h1>Gizlilik Politikası</h1>
<p class="muted">Yürürlük tarihi: ${dateTR(CONFIG.effective)} · <a href="privacy.html">English</a></p>
<p>Bu metin, MovieForUs mobil uygulamasını kullanırken hangi kişisel verilerinin işlendiğini, neden işlendiğini, kimlerle paylaşıldığını ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki haklarını açıklar.</p>

${section('1. Veri sorumlusu',
  p(`Veri sorumlusu: ${CONFIG.controller.tr}. Bize ${CONFIG.email} adresinden ulaşabilirsin.`))}

${section('2. Hangi verileri işliyoruz',
  list([
    'Hesap bilgileri: Apple ya da Google ile giriş yaparsan o hesabın bize ilettiği e-posta adresin (Apple’da “E-postamı gizle”yi seçersen Apple’ın yönlendirme adresi), adın ve hesabına özel bir kimlik; şifren bize hiç gelmez. E-posta ve şifreyle açılmış hesaplarda e-posta adresin ve şifren (şifren kimlik doğrulama sağlayıcımızda şifrelenmiş olarak saklanır; biz göremeyiz). Apple ile girişte, hesabını sildiğinde Apple’daki bağlantıyı iptal edebilmek için Apple’ın verdiği bir erişim anahtarını saklarız. Misafir olarak devam edersen yalnızca bir hesap kimliği oluşturulur.',
    'Profil bilgileri: görünen adın, profil fotoğrafın, doğum tarihin, boyun, sigara ve alkol kullanımın, favori bir filmden alıntın, cinsiyetin ve eşleşme tercihlerin (ilgilendiğin cinsiyetler ve yaş aralığı).',
    'Film zevkin: ilk açılış anketindeki cevapların, kaydırdığın filmler (beğendin ya da geçtin), kalple beğendiğin filmler, izleme listen, verdiğin puanlar ve oluşturduğun film listeleri (adları ve içindeki filmler).',
    'Konum: izin verirsen cihazının hassas konumu ve bu konumdan bulunan şehir adı.',
    'Eşleşmeler ve mesajlar: kimlerle eşleştiğin, eşleşmelerinin durumu, gönderdiğin ve aldığın mesajlar, ortak odalar ve odalarda kaydırdığın filmler.',
    'Güvenlik kayıtları: yaptığın ve hakkında yapılan şikayetler, engellediğin kişiler, kullanım şartlarını kabul kayıtların ve profil fotoğraflarının otomatik kontrol sonuçları.',
    'Cihaz bilgisi: bildirim gönderebilmek için cihazına özel bildirim anahtarı.',
    'Kullanım verileri: uygulama içinde yaptıkların; açtığın ekranlar, açtığın, beğendiğin, puanladığın, listelere eklediğin ve kaydırdığın filmler ve bir filmi hangi bölümden açtığın, eşleşmelerin ve eşleşme işlemlerin, mesaj gönderdiğin (mesajın içeriği değil), ortak odaları kullanman, bir aramanın kaç sonuç bulduğu (aradığın kelimeler değil) ve ayar değişikliklerin. Bunlarla birlikte uygulama sürümü, cihaz modeli, işletim sistemi sürümü, uygulama dili, rastgele üretilmiş bir cihaz numarası ve hesap kimliğin.',
    'Teknik kayıtlar: sunucularımıza bağlandığında IP adresin ve istek bilgileri, servis sağlayıcılarımızın kayıtlarında tutulabilir.',
  ]),
  p('Reklam göstermiyoruz, seni başka uygulama ve siteler arasında izlemiyoruz, reklam kimliğini kullanmıyoruz ve kişisel verilerini satmıyoruz. Uygulamayı geliştirmek için yalnızca aşağıda açıklanan kullanım analizini yapıyoruz.'))}

${section('3. Verilerini neden işliyoruz',
  list([
    'Hizmeti sunmak (KVKK md. 5/2-c, sözleşmenin kurulması ve ifası): hesabını yönetmek, profilini göstermek, film zevkine göre eşleşme önermek, mesajlaşmayı ve ortak odaları çalıştırmak.',
    'Konuma dayalı eşleşme (açık rıza): yalnızca 100 km içindeki kişilerle eşleşebilmen için mesafe hesaplamak. Konum iznini cihaz ayarlarından istediğin zaman geri alabilirsin; bu durumda eşleşme özelliği çalışmaz.',
    'Özel nitelikli veriler (açık rıza): cinsiyetin ve ilgilendiğin cinsiyetler, cinsel hayatına ilişkin bilgi ortaya koyabilir. Bu bilgileri yalnızca eşleşme önerisi için ve açık rızanla işleriz.',
    'Bildirimler (açık rıza): yeni eşleşme ve mesajları haber vermek. Bildirim iznini cihaz ayarlarından kapatabilirsin.',
    'Uygulamayı geliştirmek (KVKK md. 5/2-f, meşru menfaat): hangi özelliklerin ne kadar kullanıldığını, kişilerin nerede zorlandığını ve hangi değişikliklerin işe yaradığını anlamak için kullanım verilerini analiz etmek. Bu analiz, Kullanım Şartları’nda anlatıldığı için şartları kabul etmeden başlamaz; kabulden önce yaptıkların (örneğin kayıt olman) cihazında bekletilir. Uygulamayı kullanmak için bu analize izin vermen gerekmez: Profil → Ayarlar → Gizlilik bölümündeki “Kullanım verilerini paylaş” anahtarını kapattığında o cihazdan bir daha kullanım verisi gönderilmez.',
    'Topluluğun güvenliği (meşru menfaat ve hukuki yükümlülük): profil fotoğraflarını başkalarına gösterilmeden önce otomatik olarak kontrol etmek, şikayetleri incelemek, kurallara aykırı içeriği kaldırmak, kötüye kullanımı önlemek ve yasal taleplere yanıt vermek. Otomatik kontrol, fotoğrafında çıplaklık, cinsel içerik, şiddet ya da kendine zarar verme olup olmadığına bakar; uygun bulunmayan fotoğraf silinir ve profilinde kullanılamaz. Bu karara itiraz etmek için bize yazabilirsin; itirazları bir kişi inceler.',
  ]))}

${section('4. Bilgilerini kimler görebilir',
  list([
    'Eşleştiğin kişiler: görünen adın, fotoğrafın, yaşın, boyun, sigara ve alkol bilgin, film alıntın, cinsiyetin, aranızdaki yuvarlanmış yaklaşık mesafe, ortak beğendiğiniz filmler ve uyum oranınız. Doğum tarihin ve tam konumun kimseye gösterilmez.',
    'Aynı odadaki kişiler: görünen adın, emojin ve profil fotoğrafın. Bir odaya ancak kodunu paylaştığın kişiler girebilir; eşleşmeden açılan odalar yalnızca o iki kişiye açıktır.',
    'Bir filmin sayfasını açan, eşleşebileceğin kişiler: o filmi kalple beğendiysen fotoğrafın orada bulanıklaştırılmış olarak, en fazla iki kişilik küçük bir daire ve bir sayı içinde görünebilir. Adın, yaşın, mesafen ya da başka hangi filmleri beğendiğin gösterilmez ve yalnızca senin eşleşme filtrenden (yaş aralığı, cinsiyet tercihi, 100 km) karşılıklı olarak geçen kişiler bunu görebilir. Bunu istemiyorsan uygulamada Profil → Ayarlar → Gizlilik bölümündeki “Film sayfalarında fotoğrafım” anahtarını kapatabilirsin; kapattığında fotoğrafın yine yalnızca eşleştiğin kişilere ve aynı odadakilere gösterilir, eşleşme özelliğin bundan etkilenmez.',
    'Bir eşleşmeyi geçer ya da kişiyi engellersen fotoğrafına erişimi kapanır.',
    'Moderatörler: yalnızca incelenen bir şikayetle ya da fotoğraf kontrolüne yapılan bir itirazla ilgili bilgiler.',
    'Yetkili kamu kurumları: yalnızca yasal bir zorunluluk olduğunda.',
  ]))}

${section('5. Hizmet sağlayıcılar ve yurt dışına aktarım',
  p('Uygulamayı çalıştırmak için aşağıdaki hizmet sağlayıcılardan yararlanıyoruz. Bu sağlayıcıların sunucuları Türkiye dışında bulunabilir; verilerin KVKK md. 9 kapsamında açık rızana dayanarak ya da Kanun’un öngördüğü diğer güvencelerle aktarılır.'),
  list([
    `Supabase: veritabanı, kimlik doğrulama, fotoğraf depolama ve anlık iletişim altyapısı. Sunucu bölgesi: ${CONFIG.region.tr}.`,
    'Expo (650 Industries, ABD): bildirimlerin cihazına iletilmesi.',
    'OpenAI (ABD): profil fotoğraflarının otomatik kontrolü. Yüklediğin fotoğraf yalnızca bu kontrol için gönderilir. OpenAI, API üzerinden gelen verileri model eğitiminde kullanmaz; kötüye kullanımı izlemek için en fazla 30 gün saklayabilir.',
    'Amplitude (Amplitude, Inc., ABD; veriler Avrupa Birliği’ndeki sunucularında tutulur): kullanım analizi. Bu hizmete adın, e-posta adresin, fotoğrafların, mesajlarının içeriği, arama metinlerin, konumun, IP adresin, cinsiyetin ve eşleşme tercihlerin gönderilmez; yalnızca hesap kimliğinle tanınırsın.',
    'Apple: Apple ile giriş, bildirimlerin iOS cihazına ulaştırılması ve konumdan şehir adının bulunması.',
    'Google (ABD): Google ile giriş. Google, giriş yaptığın hesabın e-posta adresini, adını ve kimliğini bize iletir.',
    'TMDB (The Movie Database): film bilgileri ve görselleri. Cihazın bu bilgileri doğrudan TMDB’den ister; TMDB bu sırada IP adresini ve film aramalarını görebilir.',
    'YouTube: bir fragmanı açtığında fragman YouTube’da açılır ve YouTube’un kendi gizlilik kuralları geçerli olur.',
  ]))}

${section('6. Ne kadar süre saklıyoruz',
  list([
    'Hesabın açık olduğu sürece verilerini saklarız.',
    'Hesabını uygulama içinden (Profil → Hesap → Hesabımı sil) sildiğinde profilin, fotoğrafların ve kontrol kayıtları, film zevkin, izleme listen, film listelerin, kaydırmaların, eşleşmelerin, mesajların ve bildirim anahtarın hemen ve kalıcı olarak silinir.',
    `Kullanım analizi kayıtları Amplitude’da tutulur. Hesabını sildiğinde bu kayıtların silinmesi Amplitude’dan otomatik olarak istenir ve Amplitude silmeyi en geç 30 gün içinde tamamlar. Bir sorun olursa ${CONFIG.email} adresine yazabilirsin.`,
    'Topluluğun güvenliği için, bir kişi hakkında yapılan şikayet kayıtları o kişinin hesabı silindikten sonra en fazla 2 yıl saklanabilir.',
    'Servis sağlayıcılarımızın yedeklerinde ve teknik kayıtlarında kalan kopyalar, onların saklama döngüsü sonunda silinir.',
  ]))}

${section('7. Verilerini nasıl koruyoruz',
  p('Uygulama ile sunucular arasındaki tüm bağlantılar şifrelidir. Her veri, satır bazlı erişim kurallarıyla yalnızca görmesi gereken kişiye açılır. Fotoğrafların herkese açık olmayan bir depoda tutulur ve kısa süreli, imzalı bağlantılarla gösterilir.'))}

${section('8. Hakların',
  p('KVKK md. 11 uyarınca verilerinin işlenip işlenmediğini öğrenme, bilgi talep etme, işlenme amacını öğrenme, aktarıldığı kişileri bilme, düzeltilmesini, silinmesini ya da yok edilmesini isteme, bunların aktarıldığı kişilere bildirilmesini isteme, otomatik sistemlerle yapılan bir analiz sonucuna itiraz etme ve zarara uğradıysan zararın giderilmesini talep etme hakların vardır.'),
  p(`Hesabını ve verilerini istediğin zaman uygulama içinden silebilirsin. Diğer talepler için ${CONFIG.email} adresine yazabilirsin; başvurunu en geç 30 gün içinde yanıtlarız.`))}

${section('9. Avrupa Birliği, AEA ya da Birleşik Krallık’taysan (GDPR)',
  p('Verilerin için AB Genel Veri Koruma Tüzüğü (GDPR) ya da Birleşik Krallık GDPR’ı da geçerlidir. Aşağıdakiler yukarıdaki bölümlere eklenir.'),
  list([
    'Hukuki dayanaklar: Hesabını, profilini, eşleşmeyi, mesajlaşmayı ve ortak odaları çalıştırmak seninle yaptığımız sözleşmenin ifasıdır (md. 6/1-b). Konum ve bildirimler açık rızana dayanır (md. 6/1-a); cihaz ayarlarından istediğin zaman geri alabilirsin. Cinsel yönelimini ortaya koyabilecek olan cinsiyetin ve ilgilendiğin cinsiyetler, onları girerken verdiğin açık rızaya dayanır (md. 9/2-a); hesabını silerek kaldırabilirsin. Fotoğraf kontrolü, şikayetlerin incelenmesi ve kötüye kullanımın önlenmesi güvenli bir topluluğa yönelik meşru menfaatimize (md. 6/1-f) ve yasal yükümlülüklere (md. 6/1-c) dayanır. Kullanım analizi, uygulamayı geliştirmeye yönelik meşru menfaatimize dayanır (md. 6/1-f); Ayarlar’daki “Kullanım verilerini paylaş” anahtarıyla istediğin zaman itiraz edebilirsin.',
    `Hakların: Verilerine erişmeyi ve bir kopyasını taşınabilir bir biçimde almayı, düzeltilmesini ya da silinmesini, işlenmesinin kısıtlanmasını istemeyi, işlenmesine itiraz etmeyi ve verdiğin her rızayı istediğin zaman geri almayı talep edebilirsin; rızayı geri almak ondan önceki işlemeyi etkilemez. Bunların çoğunu uygulamada kendin yapabilirsin; diğerleri için ${CONFIG.email} adresine yaz. En geç bir ay içinde yanıtlarız.`,
    'Otomatik kararlar: Otomatik fotoğraf kontrolü bir fotoğrafın gösterilip gösterilemeyeceğine karar verir. Bu kararı bir kişinin incelemesini isteyebilir, görüşünü bildirebilir ve karara itiraz edebilirsin.',
    'Verilerin nerede: Profilin, mesajların ve kullanım analizi kayıtların Avrupa Birliği’nde tutulur (Supabase Frankfurt’ta, Amplitude AB sunucularında). 5. bölümde sayılan AB dışındaki sağlayıcılar (OpenAI, Expo, Google, Apple) yalnızca orada anlatılan verileri alır; bu aktarımlar, sağlayıcıların veri işleme şartlarındaki Avrupa Komisyonu Standart Sözleşme Maddelerine ya da sağlayıcı sertifikalıysa AB-ABD Veri Gizliliği Çerçevesi’ne dayanır.',
    `Şikayet: Yaşadığın ya da çalıştığın ülkedeki veri koruma otoritesine şikayette bulunabilirsin; Birleşik Krallık’ta bu, Information Commissioner’s Office’tir (ico.org.uk). Önce bize ${CONFIG.email} adresinden yazarsan sorunu çözmeye çalışırız.`,
  ]))}

${section('10. Çocuklar',
  p('MovieForUs 18 yaşın altındaki kişiler için değildir. 18 yaşından küçük birine ait olduğunu fark ettiğimiz hesapları kapatırız.'))}

${section('11. Değişiklikler',
  p('Bu politikayı güncelleyebiliriz. Önemli bir değişiklik olduğunda seni uygulama içinden bilgilendiririz; güncel metin her zaman bu sayfadadır.'))}
`,
});

/* ------------------------------------------------------------------ */
/* privacy policy — English                                            */
/* ------------------------------------------------------------------ */

page({
  file: 'privacy.html',
  lang: 'en',
  title: 'Privacy Policy — MovieForUs',
  description: 'How the MovieForUs app handles personal data.',
  body: `
<h1>Privacy Policy</h1>
<p class="muted">Effective: ${dateEN(CONFIG.effective)} · <a href="gizlilik.html">Türkçe</a></p>
<p>This policy explains what personal data the MovieForUs mobile app processes, why, who it is shared with, and your rights. The Turkish version is authoritative for users in Türkiye.</p>

${section('1. Controller',
  p(`Data controller: ${CONFIG.controller.en}. Contact: ${CONFIG.email}.`))}

${section('2. What we collect',
  list([
    'Account: if you sign in with Apple or Google, the email address that account shares with us (Apple’s relay address if you choose “Hide My Email”), your name and an identifier for that account; your password never reaches us. For accounts made with an email and password, your email address and password (stored hashed by our authentication provider; we cannot see it). With Sign in with Apple we keep a token Apple issues, so that the link with Apple can be revoked when you delete your account. Continuing as a guest creates only an account identifier.',
    'Profile: display name, profile photo, date of birth, height, smoking and drinking habits, a quote from a favourite film, your gender and matching preferences (genders you are interested in and an age range).',
    'Film taste: your first-run survey answers, the films you swipe (liked or passed), your watchlist and ratings, and the film lists you create (their names and the films in them).',
    'Location: if you allow it, your device’s precise location and the city derived from it.',
    'Matches and messages: who you matched with, the state of each match, messages you send and receive, shared rooms and the films swiped in them.',
    'Safety records: reports you file and reports about you, people you block, your acceptances of the terms of use, and the results of the automatic checks on your profile photos.',
    'Device: a push notification token for your device.',
    'Usage data: what you do in the app: the screens you open; the films you open, heart, rate, add to lists and swipe, and which section you opened a film from; your matches and what you do with them; that you sent a message (not what it said); your use of shared rooms; how many results a search found (not what you searched for); and changes to your settings. Along with these, the app version, device model, operating system version, app language, a randomly generated device number and your account identifier.',
    'Technical logs: your IP address and request details may be recorded in our service providers’ logs when you connect.',
  ]),
  p('We show no ads, do not track you across other apps and websites, do not use your advertising identifier, and do not sell personal data. The only analysis we do is the usage analytics described below, to improve the app.'))}

${section('3. Why we process it',
  list([
    'To provide the service: managing your account, showing your profile, suggesting matches based on film taste, and running messaging and shared rooms.',
    'Location-based matching (consent): to calculate distance so that you are matched only with people within 100 km. You can withdraw location permission in your device settings at any time; matching then stops working.',
    'Special category data (explicit consent): your gender and the genders you are interested in may reveal information about your sex life or orientation. We use them only to suggest matches.',
    'Notifications (consent): to tell you about new matches and messages. You can turn them off in your device settings.',
    'Improving the app (legitimate interest): analysing usage data to understand which features are used and how much, where people struggle and which changes work. Because the Terms of Use describe it, it does not start before you accept them; what you do before that (signing up, for instance) is held on your device. You do not have to allow it to use the app: turn off “Share usage data” under Profile → Settings → Privacy and no more usage data is sent from that device.',
    'Community safety (legitimate interest and legal obligation): checking profile photos automatically before anyone else can see them, reviewing reports, removing content that breaks the rules, preventing abuse and responding to lawful requests. The automatic check looks for nudity, sexual content, violence and self-harm; a photo that fails it is deleted and cannot be used on your profile. You can contest the decision by writing to us, and a person will review it.',
  ]))}

${section('4. Who can see your information',
  list([
    'People you match with: your display name, photo, age, height, smoking and drinking habits, film quote, gender, a rounded approximate distance between you, films you both liked and your compatibility score. Your date of birth and exact location are never shown.',
    'People in the same room: your display name, emoji and profile photo. A room can only be entered by someone you send the code to; a room opened from a match belongs to those two people alone.',
    'People who could match with you and open a film\u2019s page: if you have hearted that film, your photo can appear there blurred, inside a small circle among at most two, next to a count. Your name, age, distance and the other films you like are not shown, and only people who pass your matching filters (age range, gender preference, 100 km) mutually can see it. You can turn this off in the app under Profile \u2192 Settings \u2192 Privacy, \u201cMy photo on film pages\u201d; with it off your photo is again shown only to your matches and the people in your rooms, and your matching is unaffected.',
    'If you pass a match or block someone, their access to your photo ends.',
    'Moderators: only what relates to a report under review or to a contested photo check.',
    'Public authorities: only where the law requires it.',
  ]))}

${section('5. Service providers and international transfers',
  p('We rely on the providers below, whose servers may be located outside Türkiye.'),
  list([
    `Supabase: database, authentication, photo storage and realtime infrastructure. Server region: ${CONFIG.region.en}.`,
    'Expo (650 Industries, USA): delivering push notifications.',
    'OpenAI (USA): the automatic check of profile photos. A photo you upload is sent only for that check. OpenAI does not use data sent through its API to train models, and may keep it for up to 30 days to monitor abuse.',
    'Amplitude (Amplitude, Inc., USA; the data is kept on its servers in the European Union): usage analytics. Your name, email address, photos, message content, search text, location, IP address, gender and matching preferences are not sent to it; it knows you only by your account identifier.',
    'Apple: Sign in with Apple, delivering notifications to iOS devices and looking up a city name from a location.',
    'Google (USA): Sign in with Google. Google shares the email address, name and identifier of the account you sign in with.',
    'TMDB (The Movie Database): film information and images, requested directly from your device; TMDB can see your IP address and film searches.',
    'YouTube: trailers open on YouTube, where YouTube’s own privacy policy applies.',
  ]))}

${section('6. How long we keep it',
  list([
    'We keep your data for as long as your account exists.',
    'When you delete your account in the app (Profile → Account → Delete my account), your profile, photos and their check records, film taste, watchlist, film lists, swipes, matches, messages and push token are deleted immediately and permanently.',
    `Usage analytics records are kept at Amplitude. When you delete your account, Amplitude is automatically asked to delete them and completes the deletion within 30 days. If anything goes wrong, write to ${CONFIG.email}.`,
    'For community safety, reports about a person may be kept for up to 2 years after that person’s account is deleted.',
    'Copies in our providers’ backups and technical logs are removed at the end of their retention cycles.',
  ]))}

${section('7. How we protect it',
  p('All connections between the app and our servers are encrypted. Row-level access rules open each piece of data only to the people who need to see it. Photos are kept in private storage and shown through short-lived signed links.'))}

${section('8. Your rights',
  p('You can access, correct or delete your data, object to processing, and ask who it has been shared with. You can delete your account and data at any time from within the app.'),
  p(`For any other request, write to ${CONFIG.email}; we reply within 30 days.`))}

${section('9. If you are in the European Union, the EEA or the United Kingdom',
  p('The EU General Data Protection Regulation (GDPR), or the UK GDPR, applies to your data as well. What follows adds to the sections above.'),
  list([
    'Legal bases: running your account, profile, matching, messages and shared rooms is the performance of our contract with you (Art. 6(1)(b)). Location and notifications rest on your consent (Art. 6(1)(a)), which you can withdraw in your device settings at any time. Your gender and the genders you are interested in, which may reveal your sexual orientation, rest on the explicit consent you give by entering them (Art. 9(2)(a)); you can remove them by deleting your account. Photo checks, handling reports and preventing abuse rest on our legitimate interest in a safe community (Art. 6(1)(f)) and on legal obligations (Art. 6(1)(c)). Usage analytics rests on our legitimate interest in improving the app (Art. 6(1)(f)); you can object at any time with the “Share usage data” switch in Settings.',
    `Your rights: you can ask to access your data and receive a copy in a portable format, to have it corrected or erased, to restrict its processing, to object to it, and to withdraw any consent you gave at any time; withdrawing consent does not affect processing before it. Most of this you can do in the app yourself; for the rest, write to ${CONFIG.email}. We answer within one month.`,
    'Automated decisions: the automatic photo check decides whether a photo can be shown. You can ask for a person to review the decision, give your view and contest it.',
    'Where your data is: your profile, messages and usage analytics records are kept in the European Union (Supabase in Frankfurt, Amplitude on its EU servers). The providers outside the EU listed in section 5 (OpenAI, Expo, Google, Apple) receive only what is described there; transfers to them rely on the European Commission’s Standard Contractual Clauses in their data processing terms or, where the provider is certified, on the EU–US Data Privacy Framework.',
    `Complaints: you can complain to the data protection authority where you live or work; in the United Kingdom that is the Information Commissioner’s Office (ico.org.uk). If you write to us first at ${CONFIG.email}, we will try to put things right.`,
  ]))}

${section('10. Children',
  p('MovieForUs is not for anyone under 18. We close accounts we find belong to someone under 18.'))}

${section('11. Changes',
  p('We may update this policy. We will let you know in the app about significant changes; the current version is always on this page.'))}
`,
});

/* ------------------------------------------------------------------ */
/* terms of use — from the app's own text                              */
/* ------------------------------------------------------------------ */

/** The app's own sections, laid out as a page: bullets become a list. */
const termsBody = (sections) =>
  sections
    .map((s) => {
      const bullets = s.body.filter((line) => line.startsWith('•'));
      const plain = s.body.filter((line) => !line.startsWith('•'));
      return section(
        s.title,
        ...plain.map(p),
        bullets.length ? list(bullets.map((b) => b.replace(/^•\s*/, ''))) : ''
      );
    })
    .join('\n');

page({
  file: 'sartlar.html',
  title: 'Kullanım Şartları — MovieForUs',
  description: 'MovieForUs kullanım şartları.',
  body: `
<h1>Kullanım Şartları</h1>
<p class="muted">Son güncelleme: ${dateTR(TermsVersion)} · <a href="terms.html">English</a></p>
${termsBody(terms.tr)}
${section('İletişim', p(`Soruların ve şikayetlerin için bize ${CONFIG.email} adresinden ulaşabilirsin.`))}
`,
});

/* ------------------------------------------------------------------ */
/* terms of use — English                                              */
/* ------------------------------------------------------------------ */

page({
  file: 'terms.html',
  lang: 'en',
  title: 'Terms of Use — MovieForUs',
  description: 'The MovieForUs terms of use.',
  body: `
<h1>Terms of Use</h1>
<p class="muted">Last updated: ${dateEN(TermsVersion)} · <a href="sartlar.html">Türkçe</a></p>
<p class="muted">A translation of the Turkish terms, which are the ones accepted in the app and the authoritative version for users in Türkiye.</p>
${termsBody(terms.en)}
${section('Contact', p(`For questions and complaints you can reach us at ${CONFIG.email}.`))}
`,
});

/* ------------------------------------------------------------------ */
/* support                                                             */
/* ------------------------------------------------------------------ */

page({
  file: 'destek.html',
  title: 'Destek — MovieForUs',
  description: 'MovieForUs destek ve iletişim.',
  body: `
<h1>Destek</h1>
<p>Bir sorun mu yaşıyorsun ya da bir sorun mu var? Bize <strong>${fill(CONFIG.email)}</strong> adresinden yaz; en kısa sürede dönüş yaparız.</p>
<p class="muted"><a href="support.html">English</a></p>

${section('Birini nasıl şikayet ederim?',
  p('Eşleşme ekranında sağ üstteki ⋯ menüsünden “Şikayet et”i seç. Bir mesajı şikayet etmek için mesaja uzun bas. Şikayetin gizli tutulur ve moderatörlerimize anında iletilir.'))}

${section('Birini nasıl engellerim?',
  p('Eşleşme ekranında ⋯ menüsünden “Engelle”yi seç. Engellediğin kişi seninle bir daha eşleşemez ve sana yazamaz.'))}

${section('Hesabımı nasıl silerim?',
  p('Profil → Hesap bölümündeki “Hesabımı sil” bağlantısını kullan. Profilin, fotoğrafların, eşleşmelerin ve mesajların hemen ve kalıcı olarak silinir.'))}

${section('Neden kimseyle eşleşemiyorum?',
  p('Eşleşme için profilinin tamamlanmış olması, konum izni vermen ve karşı tarafla aynı filmlerin en az 8 tanesinde karar vermiş olmanız gerekir. Günde 30 film kaydırabilirsin; ortak filmler birkaç günde birikir.'))}

${section('Acil bir durum mu var?',
  p('Kendini tehlikede hissediyorsan lütfen hemen 112’yi ara.'))}
`,
});

/* ------------------------------------------------------------------ */
/* support — English                                                   */
/* ------------------------------------------------------------------ */

page({
  file: 'support.html',
  lang: 'en',
  title: 'Support — MovieForUs',
  description: 'MovieForUs support and contact.',
  body: `
<h1>Support</h1>
<p>Stuck, or something wrong? Write to us at <strong>${fill(CONFIG.email)}</strong> and we will get back to you as soon as we can.</p>
<p class="muted"><a href="destek.html">Türkçe</a></p>

${section('How do I report someone?',
  p('On the match screen, open the ⋯ menu at the top right and choose “Report”. To report a message, press and hold it. Your report is confidential and reaches our moderators straight away.'))}

${section('How do I block someone?',
  p('On the match screen, open the ⋯ menu and choose “Block”. Somebody you block can no longer match with you or write to you.'))}

${section('How do I delete my account?',
  p('Use “Delete my account” under Profile → Account. Your profile, your photos, your matches and your messages are deleted immediately and permanently.'))}

${section('Why am I not matching with anyone?',
  p('Matching needs a finished profile, location permission, and either agreement with somebody on at least 8 of the same films or 5 of the same films liked. You can swipe 30 films a day; films in common build up over a few days.'))}

${section('Is this an emergency?',
  p('If you feel you are in danger, call your local emergency number straight away.'))}
`,
});

/* ------------------------------------------------------------------ */
/* stylesheet                                                          */
/* ------------------------------------------------------------------ */

fs.writeFileSync(new URL('style.css', import.meta.url), `:root {
  --bg: #0a0a0c; --surface: #16161a; --border: #2a2a30;
  --text: #f2f2f7; --muted: #9a9aa3; --primary: #ff375f;
  color-scheme: dark;
}
@media (prefers-color-scheme: light) {
  :root { --bg: #fafafa; --surface: #ffffff; --border: #e4e4e8; --text: #151518; --muted: #6b6b73; color-scheme: light; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  max-width: 820px; margin: 0 auto; padding: 20px 24px; }
.top nav { display: flex; gap: 18px; font-size: 15px; }
.top nav a { color: var(--muted); }
/* The language switch reads as a control rather than another page. */
.top nav a.lang { color: var(--text); border: 1px solid var(--border); border-radius: 999px;
  padding: 2px 10px; font-size: 14px; }
.brand { color: var(--text); font-size: 20px; }
.wordmark { font-weight: 800; letter-spacing: -0.02em; }
.for { color: var(--primary); }
main { max-width: 820px; margin: 0 auto; padding: 8px 24px 48px; }
h1 { font-size: 34px; line-height: 1.15; margin: 24px 0 8px; letter-spacing: -0.02em; }
h2 { font-size: 20px; margin: 36px 0 8px; }
h3 { margin: 0 0 6px; font-size: 17px; }
p, li { color: var(--text); }
.muted, footer { color: var(--muted); font-size: 14px; }
ul { padding-left: 22px; }
li { margin: 6px 0; }
mark { background: #ffd60a; color: #000; padding: 0 4px; border-radius: 4px; }
.hero h1 { font-size: 52px; margin-top: 48px; }
.lead { font-size: 22px; margin: 0 0 12px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 36px 0; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px; }
.card p { margin: 0; color: var(--muted); font-size: 15px; }
.store { margin: 28px 0 8px; }
/* Apple asks for clear space around the badge and a minimum height. */
.store-badge { display: inline-block; padding: 6px; }
.store-badge:hover { opacity: .85; }
.store-badge img { height: 52px; width: auto; display: block; }
.links { margin-top: 24px; }
footer { max-width: 820px; margin: 0 auto; padding: 24px; border-top: 1px solid var(--border); }
footer p { color: var(--muted); margin: 6px 0; }
/* TMDB's terms: its mark, smaller than MovieForUs's own. */
.tmdb img { height: 14px; width: auto; display: block; margin-bottom: 8px; }
`);

/* ------------------------------------------------------------------ */

const unfilled = Object.entries(CONFIG).filter(([, value]) => typeof value === 'string' && /^\[.*\]$/.test(value));
console.log(
  'pages: index.html, gizlilik.html, sartlar.html, destek.html · en.html, privacy.html, terms.html, support.html'
);
if (unfilled.length) {
  console.log(`NOT READY TO PUBLISH — fill in: ${unfilled.map(([key]) => key).join(', ')}`);
}
