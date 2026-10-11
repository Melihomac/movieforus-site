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

import { anchors, getLabel, homeOf, landingBody } from './landing.mjs';

const CONFIG = {
  // Who is responsible for the data (KVKK "veri sorumlusu"). Named by role
  // rather than by the developer's own name, at the developer's request.
  controller: {
    tr: 'MovieForUs uygulamasının geliştiricisi',
    en: 'the developer of the MovieForUs app',
  },
  email: 'support@movieforus.com',
  // Where the Supabase project runs. Established from the database host's
  // address against AWS's published ranges: eu-central-1.
  region: { tr: 'Frankfurt, Almanya (Avrupa Birliği)', en: 'Frankfurt, Germany (European Union)' },
  // Effective date of the privacy policy.
  effective: '2026-10-02',
  // The app's page on the App Store.
  appStore: 'https://apps.apple.com/app/movieforus/id6811587180',
  // The app's page on Google Play. Empty until the app is public there: while
  // it is only in closed testing the page says "not found" to everybody else,
  // so the room page says it is coming instead of linking to it.
  playStore: '',
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
// The fan clubs, by name in each language, for the landing page.
const { FanClubs } = await import(path.join(app, 'src/constants/fan-clubs.ts'));
const clubNames = { tr: FanClubs.map((c) => c.name.tr), en: FanClubs.map((c) => c.name.en) };

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
  'hesap-silme.html': 'delete-account.html',
  'delete-account.html': 'hesap-silme.html',
  'cocuk-guvenligi.html': 'child-safety.html',
  'child-safety.html': 'cocuk-guvenligi.html',
  'katil.html': 'join.html',
  'join.html': 'katil.html',
};

function page({ file, lang = 'tr', title, description, body, home = false }) {
  // The landing page links to its own sections; every other page to the
  // other pages.
  const links = home
    ? anchors(lang)
    : lang === 'tr'
      ? `<a href="./">Ana sayfa</a><a href="gizlilik.html">Gizlilik</a><a href="sartlar.html">Şartlar</a><a href="destek.html">Destek</a>`
      : `<a href="en.html">Home</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="support.html">Support</a>`;
  // Labelled in the language it leads to, as language switches are.
  const other = `<a class="lang" href="${twin[file]}" hreflang="${lang === 'tr' ? 'en' : 'tr'}">${
    lang === 'tr' ? 'EN' : 'TR'
  }</a>`;
  const footLinks =
    lang === 'tr'
      ? [['gizlilik.html', 'Gizlilik Politikası'], ['sartlar.html', 'Kullanım Şartları'], ['destek.html', 'Destek'],
         ['hesap-silme.html', 'Hesap silme'], ['cocuk-guvenligi.html', 'Çocuk güvenliği'], ['en.html', 'English']]
      : [['privacy.html', 'Privacy Policy'], ['terms.html', 'Terms of Use'], ['support.html', 'Support'],
         ['delete-account.html', 'Delete your account'], ['child-safety.html', 'Child safety'], ['./', 'Türkçe']];
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#050506">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<link rel="icon" href="logo.png">
<link rel="apple-touch-icon" href="logo.png">
<link rel="alternate" hreflang="${lang === 'tr' ? 'en' : 'tr'}" href="${twin[file]}">
<link rel="alternate" hreflang="${lang}" href="${file}">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="top"><div class="top-in">
  <a class="brand" href="${homeOf(lang)}"><img src="logo.png" alt="" width="30" height="30">${wordmark}</a>
  <nav class="top-links${home ? ' sections' : ''}">${links}</nav>
  <div class="top-right">${other}<a class="get" href="${CONFIG.appStore}">${getLabel(lang)} →</a></div>
</div></header>
<main class="${home ? 'home' : 'doc'}">
${body}
</main>
<footer class="foot"><div class="foot-in">
  <div class="foot-brand">
    <a class="brand" href="${homeOf(lang)}"><img src="logo.png" alt="" width="30" height="30">${wordmark}</a>
    <p>${lang === 'tr' ? 'Film zevkine göre tanışma uygulaması.' : 'A dating app built on taste in films.'}</p>
    <p><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></p>
  </div>
  <nav class="foot-links">${footLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
  <div class="foot-legal">
    <a class="tmdb" href="https://www.themoviedb.org/"><img src="tmdb-logo.svg" alt="TMDB"></a>
    <p>This application uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.</p>
    ${lang === 'tr' ? '<p>Bu uygulama TMDB’yi ve TMDB API’lerini kullanır, ancak TMDB tarafından onaylanmış, sertifikalandırılmış ya da başka bir şekilde desteklenmiş değildir.</p>' : ''}
    <p>© ${new Date().getFullYear()} MovieForUs</p>
  </div>
</div></footer>
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
  home: true,
  title: 'MovieForUs — Aynı filmleri seven biriyle tanış',
  description: 'MovieForUs film zevkine göre eşleştiren bir tanışma uygulamasıdır: insanları değil filmleri kaydır, aynı filmleri seven kişilerle eşleş.',
  body: landingBody('tr', { ...CONFIG, clubs: clubNames.tr, escape }),
});

page({
  file: 'en.html',
  lang: 'en',
  home: true,
  title: 'MovieForUs — Meet someone who loves your films',
  description: 'MovieForUs is a dating app that matches people on their taste in films: swipe films, not people, and match with people who love the same ones.',
  body: landingBody('en', { ...CONFIG, clubs: clubNames.en, escape }),
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
    'Konuma dayalı eşleşme (açık rıza): yalnızca 300 km içindeki (fan kulüplerinde 1000 km içindeki) kişilerle eşleşebilmen için mesafe hesaplamak. Konum iznini cihaz ayarlarından istediğin zaman geri alabilirsin; bu durumda eşleşme özelliği çalışmaz.',
    'Özel nitelikli veriler (açık rıza): cinsiyetin ve ilgilendiğin cinsiyetler, cinsel hayatına ilişkin bilgi ortaya koyabilir. Bu bilgileri yalnızca eşleşme önerisi için ve açık rızanla işleriz.',
    'Bildirimler (açık rıza): yeni eşleşme ve mesajları haber vermek. Bildirim iznini cihaz ayarlarından kapatabilirsin.',
    'Uygulamayı geliştirmek (KVKK md. 5/2-f, meşru menfaat): hangi özelliklerin ne kadar kullanıldığını, kişilerin nerede zorlandığını ve hangi değişikliklerin işe yaradığını anlamak için kullanım verilerini analiz etmek. Bu analiz, Kullanım Şartları’nda anlatıldığı için şartları kabul etmeden başlamaz; kabulden önce yaptıkların (örneğin kayıt olman) cihazında bekletilir. Uygulamayı kullanmak için bu analize izin vermen gerekmez: Profil → Ayarlar → Gizlilik bölümündeki “Kullanım verilerini paylaş” anahtarını kapattığında o cihazdan bir daha kullanım verisi gönderilmez.',
    'Topluluğun güvenliği (meşru menfaat ve hukuki yükümlülük): profil fotoğraflarını başkalarına gösterilmeden önce otomatik olarak kontrol etmek, şikayetleri incelemek, kurallara aykırı içeriği kaldırmak, kötüye kullanımı önlemek ve yasal taleplere yanıt vermek. Otomatik kontrol, fotoğrafında çıplaklık, cinsel içerik, şiddet ya da kendine zarar verme olup olmadığına bakar; uygun bulunmayan fotoğraf silinir ve profilinde kullanılamaz. Bu karara itiraz etmek için bize yazabilirsin; itirazları bir kişi inceler.',
  ]))}

${section('4. Bilgilerini kimler görebilir',
  list([
    'Eşleştiğin kişiler: görünen adın, fotoğrafın, yaşın, boyun, sigara ve alkol bilgin, film alıntın, cinsiyetin, aranızdaki yuvarlanmış yaklaşık mesafe, ortak beğendiğiniz filmler, uyum oranınız ve katıldığın fan kulüpleri. Doğum tarihin ve tam konumun kimseye gösterilmez.',
    'Fan kulüpleri: bir kulübe katılırken verdiğin 5 cevap saklanır. Hangi kulüplerde olduğunu yalnızca sen ve eşleştiğin kişiler görebilir; bir kulüp üzerinden eşleştiğin kişi, aynı cevapları verdiğiniz soruları da görür. Kulüpten istediğin zaman ayrılabilirsin; ayrıldığında cevapların silinir.',
    'Aynı odadaki kişiler: görünen adın, emojin ve profil fotoğrafın. Bir odaya ancak kodunu paylaştığın kişiler girebilir; eşleşmeden açılan odalar yalnızca o iki kişiye açıktır.',
    'Bir filmin sayfasını açan, eşleşebileceğin kişiler: o filmi kalple beğendiysen fotoğrafın orada bulanıklaştırılmış olarak, en fazla iki kişilik küçük bir daire ve bir sayı içinde görünebilir. Adın, yaşın, mesafen ya da başka hangi filmleri beğendiğin gösterilmez ve yalnızca senin eşleşme filtrenden (yaş aralığı, cinsiyet tercihi, 300 km) karşılıklı olarak geçen kişiler bunu görebilir. Bunu istemiyorsan uygulamada Profil → Ayarlar → Gizlilik bölümündeki “Film sayfalarında fotoğrafım” anahtarını kapatabilirsin; kapattığında fotoğrafın yine yalnızca eşleştiğin kişilere ve aynı odadakilere gösterilir, eşleşme özelliğin bundan etkilenmez.',
    'Bir eşleşmeyi geçer ya da kişiyi engellersen fotoğrafına erişimi kapanır.',
    'Moderatörler: yalnızca incelenen bir şikayetle ya da fotoğraf kontrolüne yapılan bir itirazla ilgili bilgiler.',
    'Yetkili kamu kurumları: yalnızca yasal bir zorunluluk olduğunda.',
  ]))}

${section('5. Hizmet sağlayıcılar ve yurt dışına aktarım',
  p('Uygulamayı çalıştırmak için aşağıdaki hizmet sağlayıcılardan yararlanıyoruz. Bu sağlayıcıların sunucuları Türkiye dışında bulunabilir; verilerin KVKK md. 9 kapsamında açık rızana dayanarak ya da Kanun’un öngördüğü diğer güvencelerle aktarılır.'),
  list([
    `Supabase: veritabanı, kimlik doğrulama, fotoğraf depolama ve anlık iletişim altyapısı. Sunucu bölgesi: ${CONFIG.region.tr}.`,
    'Expo (650 Industries, ABD): bildirimlerin cihazına iletilmesi ve uygulama güncellemelerinin dağıtılması. Expo bu sırada cihazının IP adresi ve hata kayıtları gibi teknik verileri kendi hizmetini geliştirmek için toplu olarak analiz edebilir; bu kullanımda Expo kendi gizlilik politikasına tabidir.',
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
    'Location-based matching (consent): to calculate distance so that you are matched only with people within 300 km (1000 km in fan clubs). You can withdraw location permission in your device settings at any time; matching then stops working.',
    'Special category data (explicit consent): your gender and the genders you are interested in may reveal information about your sex life or orientation. We use them only to suggest matches.',
    'Notifications (consent): to tell you about new matches and messages. You can turn them off in your device settings.',
    'Improving the app (legitimate interest): analysing usage data to understand which features are used and how much, where people struggle and which changes work. Because the Terms of Use describe it, it does not start before you accept them; what you do before that (signing up, for instance) is held on your device. You do not have to allow it to use the app: turn off “Share usage data” under Profile → Settings → Privacy and no more usage data is sent from that device.',
    'Community safety (legitimate interest and legal obligation): checking profile photos automatically before anyone else can see them, reviewing reports, removing content that breaks the rules, preventing abuse and responding to lawful requests. The automatic check looks for nudity, sexual content, violence and self-harm; a photo that fails it is deleted and cannot be used on your profile. You can contest the decision by writing to us, and a person will review it.',
  ]))}

${section('4. Who can see your information',
  list([
    'People you match with: your display name, photo, age, height, smoking and drinking habits, film quote, gender, a rounded approximate distance between you, films you both liked, your compatibility score and the fan clubs you are in. Your date of birth and exact location are never shown.',
    'Fan clubs: the 5 answers you give when you join a club are stored. Only you and the people you match with can see which clubs you are in; someone you matched with through a club also sees the questions you answered alike. You can leave a club at any time, and your answers are deleted when you do.',
    'People in the same room: your display name, emoji and profile photo. A room can only be entered by someone you send the code to; a room opened from a match belongs to those two people alone.',
    'People who could match with you and open a film\u2019s page: if you have hearted that film, your photo can appear there blurred, inside a small circle among at most two, next to a count. Your name, age, distance and the other films you like are not shown, and only people who pass your matching filters (age range, gender preference, 300 km) mutually can see it. You can turn this off in the app under Profile \u2192 Settings \u2192 Privacy, \u201cMy photo on film pages\u201d; with it off your photo is again shown only to your matches and the people in your rooms, and your matching is unaffected.',
    'If you pass a match or block someone, their access to your photo ends.',
    'Moderators: only what relates to a report under review or to a contested photo check.',
    'Public authorities: only where the law requires it.',
  ]))}

${section('5. Service providers and international transfers',
  p('We rely on the providers below, whose servers may be located outside Türkiye.'),
  list([
    `Supabase: database, authentication, photo storage and realtime infrastructure. Server region: ${CONFIG.region.en}.`,
    'Expo (650 Industries, USA): delivering push notifications and app updates. While doing so, Expo may analyse technical data such as your device’s IP address and crash reports, in aggregate, to improve its own service; for that use Expo is subject to its own privacy policy.',
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
  p('Profil → Hesap bölümündeki “Hesabımı sil” bağlantısını kullan. Profilin, fotoğrafların, eşleşmelerin ve mesajların hemen ve kalıcı olarak silinir.'),
  '<p>Uygulamaya giremiyorsan <a href="hesap-silme.html">hesap silme sayfasındaki</a> adımları izle.</p>')}

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
  p('Use “Delete my account” under Profile → Account. Your profile, your photos, your matches and your messages are deleted immediately and permanently.'),
  '<p>If you cannot get into the app, follow the steps on the <a href="delete-account.html">account deletion page</a>.</p>')}

${section('Why am I not matching with anyone?',
  p('Matching needs a finished profile, location permission, and either agreement with somebody on at least 8 of the same films or 5 of the same films liked. You can swipe 30 films a day; films in common build up over a few days.'))}

${section('Is this an emergency?',
  p('If you feel you are in danger, call your local emergency number straight away.'))}
`,
});

/* ------------------------------------------------------------------ */
/* stylesheet                                                          */
/* ------------------------------------------------------------------ */

fs.writeFileSync(new URL('style.css', import.meta.url), `/* Dark only, like the app: near-black, the app's pink-red, and red light
   behind the headings. No web fonts, so the site calls out to nobody. */
:root {
  --bg: #050506; --surface: #111114; --surface-2: #17171b; --border: rgba(255,255,255,.08);
  --text: #f4f4f7; --muted: #9c9ca6; --primary: #ff375f; --primary-2: #ff7a59;
  --glow: rgba(255,55,95,.16);
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 84px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { margin: 0; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased;
  font: 16px/1.65 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
img { max-width: 100%; }
h1, h2, h3 { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  letter-spacing: -0.025em; }

/* header */
.top { position: sticky; top: 0; z-index: 50; background: rgba(5,5,6,.72);
  -webkit-backdrop-filter: saturate(160%) blur(16px); backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--border); }
.top-in { max-width: 1180px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; gap: 24px; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--text); font-size: 19px; }
.brand:hover { text-decoration: none; }
.brand img { width: 30px; height: 30px; border-radius: 8px; }
.wordmark { font-weight: 800; letter-spacing: -0.02em; }
.for { color: var(--primary); }
.top-links { display: flex; gap: 22px; font-size: 14px; flex: 1; justify-content: center; }
.top-links a { color: var(--muted); }
.top-links a:hover { color: var(--text); text-decoration: none; }
.top-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.lang { color: var(--text); border: 1px solid var(--border); border-radius: 999px; padding: 5px 12px;
  font-size: 13px; font-weight: 600; background: rgba(255,255,255,.03); }
.lang:hover { text-decoration: none; border-color: rgba(255,255,255,.2); }
.get { background: var(--primary); color: #fff; border-radius: 999px; padding: 8px 16px; font-size: 14px;
  font-weight: 700; white-space: nowrap; box-shadow: 0 6px 24px rgba(255,55,95,.35); }
.get:hover { text-decoration: none; filter: brightness(1.08); }
@media (max-width: 980px) { .top-links.sections { display: none; } }
@media (max-width: 640px) {
  .top-in { flex-wrap: wrap; gap: 10px 16px; padding: 10px 16px; }
  .top-links { order: 3; flex-basis: 100%; justify-content: flex-start; gap: 16px; overflow-x: auto; }
  .get { padding: 7px 12px; font-size: 13px; }
}

/* text pages */
main.doc { max-width: 820px; margin: 0 auto; padding: 24px 24px 64px; }
main.doc h1 { font-size: 40px; line-height: 1.12; margin: 32px 0 10px; font-weight: 800; }
main.doc h2 { font-size: 21px; margin: 40px 0 8px; }
h3 { margin: 0 0 6px; font-size: 17px; }
p, li { color: var(--text); }
.muted { color: var(--muted); font-size: 14px; }
ul, ol { padding-left: 22px; }
li { margin: 6px 0; }
mark { background: #ffd60a; color: #000; padding: 0 4px; border-radius: 4px; }
/* The room invitation page. */
.room-code { font-size: 44px; font-weight: 800; letter-spacing: 0.18em; margin: 8px 0 20px; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 8px 0 20px; }
.button { display: inline-block; padding: 14px 22px; border-radius: 999px; font-weight: 700;
  border: 1px solid var(--border); color: var(--text); background: var(--surface); }
.button.primary { background: var(--primary); border-color: var(--primary); color: #fff; }
.button:hover { opacity: .88; text-decoration: none; }

/* footer */
.foot { border-top: 1px solid var(--border); background: #08080a; }
.foot-in { max-width: 1180px; margin: 0 auto; padding: 40px 24px 32px; display: grid; gap: 28px 48px;
  grid-template-columns: 1.1fr 1fr; }
.foot p { color: var(--muted); font-size: 13px; margin: 6px 0; }
.foot-brand p { font-size: 14px; }
.foot-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; align-content: start; font-size: 14px; }
.foot-links a { color: var(--muted); }
.foot-links a:hover { color: var(--text); }
.foot-legal { grid-column: 1 / -1; border-top: 1px solid var(--border); padding-top: 20px; }
/* TMDB's terms: its mark, smaller than MovieForUs's own. */
.tmdb img { height: 14px; width: auto; display: block; margin-bottom: 8px; }
@media (max-width: 640px) { .foot-in { grid-template-columns: 1fr; } }

/* landing page */
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.eyebrow { margin: 0 0 12px; color: var(--primary); font-size: 12px; font-weight: 800; letter-spacing: .16em;
  text-transform: uppercase; }
.eyebrow.pill { display: inline-block; padding: 6px 14px; border-radius: 999px; letter-spacing: .08em;
  border: 1px solid rgba(255,55,95,.35); background: rgba(255,55,95,.08); }
.hero { position: relative; overflow: hidden; padding: 72px 0 88px;
  background: radial-gradient(60% 70% at 78% 30%, rgba(255,55,95,.22), transparent 70%),
              radial-gradient(40% 50% at 10% 0%, rgba(255,122,89,.10), transparent 70%); }
.hero-grid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 40px; align-items: center; }
.hero h1 { font-size: clamp(42px, 6.4vw, 78px); line-height: 1.02; margin: 18px 0 20px; font-weight: 900; letter-spacing: -0.035em; }
.hero h1 em, .section-head h2 em { font-style: normal; background: linear-gradient(90deg, var(--primary), var(--primary-2));
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero-lead { font-size: 19px; color: #c9c9d1; max-width: 560px; margin: 0 0 28px; }
.stores { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
/* Apple asks for clear space around the badge and a minimum height. */
.store-badge { display: inline-block; padding: 4px; }
.store-badge:hover { opacity: .85; }
.store-badge img { height: 52px; width: auto; display: block; }
.pill-button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 20px;
  border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text);
  font: inherit; font-weight: 700; font-size: 15px; cursor: pointer; }
.pill-button:hover { text-decoration: none; border-color: rgba(255,255,255,.2); }
.pill-button.primary { background: var(--primary); border-color: var(--primary); color: #fff; }
.pill-button.soon { color: var(--muted); cursor: default; }
.pill-button.small { min-height: 36px; padding: 0 16px; font-size: 13px; }
.note { color: var(--muted); font-size: 14px; margin: 14px 0 0; }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 40px 0 0; max-width: 600px; }
.stats div { border-left: 2px solid rgba(255,55,95,.5); padding: 2px 0 2px 14px; }
.stats dt { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
.stats dd { margin: 2px 0 0; color: var(--muted); font-size: 13px; line-height: 1.35; }
.hero-art { position: relative; height: 640px; }
.phone { width: 290px; padding: 9px; border-radius: 46px; background: linear-gradient(160deg, #2a2a30, #0d0d10 40%);
  border: 1px solid rgba(255,255,255,.12); box-shadow: 0 40px 100px rgba(0,0,0,.6), 0 0 80px rgba(255,55,95,.18); }
.phone img { display: block; width: 100%; height: auto; border-radius: 38px; }
.hero-art .phone { position: absolute; }
.phone-front { right: 40px; top: 10px; z-index: 2; }
.phone-back { right: 250px; top: 70px; transform: rotate(-8deg) scale(.86); opacity: .55; filter: saturate(.8); }
.float-chip { position: absolute; z-index: 3; left: 30px; bottom: 70px; display: flex; gap: 12px; align-items: center;
  padding: 12px 16px; border-radius: 18px; background: rgba(23,23,27,.86); border: 1px solid var(--border);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); box-shadow: 0 20px 50px rgba(0,0,0,.5); }
.float-chip strong { display: block; font-size: 14px; }
.float-chip small { color: var(--muted); font-size: 12px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 0 5px rgba(255,55,95,.2); }
@media (max-width: 900px) {
  .hero { padding: 40px 0 56px; }
  .hero-grid { grid-template-columns: 1fr; }
  .hero-art { height: 560px; max-width: 420px; width: 100%; margin: 0 auto; }
  .phone-front { right: 0; }
  .phone-back { right: auto; left: -40px; }
  .float-chip { left: 0; bottom: 40px; }
}
@media (max-width: 560px) {
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 12px; }
  .hero-art { height: 500px; }
  .hero-art .phone { width: 240px; }
  .phone-back { display: none; }
  .phone-front { right: 50%; transform: translateX(50%); }
  .float-chip { bottom: 24px; }
}

.band { padding: 96px 0; border-top: 1px solid var(--border); position: relative; }
.band.glow { background: radial-gradient(50% 60% at 50% 0%, var(--glow), transparent 75%); }
.section-head { max-width: 640px; margin-bottom: 44px; }
.section-head.centred { margin-left: auto; margin-right: auto; text-align: center; }
.section-head h2, .cta h2 { font-size: clamp(32px, 4.4vw, 50px); line-height: 1.06; margin: 0 0 16px; font-weight: 800; }
.section-lead { color: #b9b9c3; font-size: 18px; margin: 0; }
.feature-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.feature { background: linear-gradient(180deg, var(--surface-2), var(--surface)); border: 1px solid var(--border);
  border-radius: 24px; padding: 28px; }
.feature h3 { font-size: 21px; margin-bottom: 8px; }
.feature p { color: var(--muted); margin: 0; }
.feature .eyebrow { margin-bottom: 6px; }
.feature-icon { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; margin-bottom: 22px;
  background: rgba(255,55,95,.12); border: 1px solid rgba(255,55,95,.3); color: var(--primary); font-size: 22px; font-weight: 800; }
.icon-0::before { content: "⇄"; }
.icon-1::before { content: "♥"; }
.icon-2::before { content: "★"; }
@media (max-width: 860px) { .feature-grid { grid-template-columns: 1fr; } }

/* the deck */
.demo { display: flex; flex-direction: column; align-items: center; gap: 26px; }
.deck { position: relative; width: min(340px, 100%); height: 480px; outline: none; touch-action: pan-y; }
.deck:focus-visible { outline: 2px solid var(--primary); outline-offset: 8px; border-radius: 28px; }
.film { position: absolute; inset: 0; border-radius: 28px; overflow: hidden; background: var(--surface);
  border: 1px solid rgba(255,255,255,.1); box-shadow: 0 30px 70px rgba(0,0,0,.55); cursor: grab; user-select: none;
  -webkit-user-select: none; display: flex; flex-direction: column; }
.film:active { cursor: grabbing; }
.film .art { flex: 1; }
.film-text { padding: 18px 22px 22px; background: linear-gradient(180deg, rgba(17,17,20,0), var(--surface) 30%); margin-top: -40px; position: relative; }
.film-text h3 { font-size: 24px; margin: 0 0 6px; }
.film-text p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; }
.film-text .film-meta { color: var(--primary); font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 4px; }
.stamp { position: absolute; top: 28px; z-index: 2; padding: 4px 12px; border: 3px solid; border-radius: 10px;
  font-weight: 900; font-size: 22px; letter-spacing: .08em; opacity: 0; transition: opacity .15s; }
.stamp-like { left: 22px; color: var(--primary); transform: rotate(-12deg); }
.stamp-pass { right: 22px; color: #8e8e93; transform: rotate(12deg); }
.stamp-love { left: 50%; top: 40%; transform: translate(-50%, -50%); border: 0; font-size: 90px; color: var(--primary);
  text-shadow: 0 10px 40px rgba(255,55,95,.6); }
.show-like .stamp-like, .show-pass .stamp-pass, .show-love .stamp-love, .show-love .stamp-like { opacity: 1; }
.deck-result { position: absolute; inset: 0; border-radius: 28px; padding: 32px; display: flex; flex-direction: column;
  justify-content: center; text-align: center; background: radial-gradient(80% 60% at 50% 0%, rgba(255,55,95,.25), var(--surface) 70%);
  border: 1px solid rgba(255,55,95,.3); }
.deck-result[hidden] { display: none; }
.deck-result h3 { font-size: 30px; margin-bottom: 10px; }
.deck-result p { color: #c9c9d1; }
.deck-result b { color: var(--primary); }
.deck-result-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 12px; }
.deck-controls { display: flex; gap: 18px; align-items: center; }
.round { width: 62px; height: 62px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface-2);
  color: var(--text); font-size: 24px; cursor: pointer; display: grid; place-items: center; transition: transform .15s; }
.round:hover:not(:disabled) { transform: scale(1.06); }
.round:disabled { opacity: .35; cursor: default; }
.round.love { width: 52px; height: 52px; font-size: 20px; color: var(--primary); }
.round.like { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 10px 30px rgba(255,55,95,.4); }

/* made-up film art, drawn rather than taken from any film */
.art { position: relative; overflow: hidden; }
.art .sun { position: absolute; left: 50%; width: 120px; height: 120px; border-radius: 50%; transform: translateX(-50%); }
.art .hills { position: absolute; left: -10%; right: -10%; bottom: 0; height: 38%; border-radius: 50% 50% 0 0 / 40% 40% 0 0; }
.art-lisbon { background: radial-gradient(1.5px 1.5px at 20% 20%, #fff, transparent), radial-gradient(1px 1px at 70% 12%, #fff, transparent),
  radial-gradient(1.5px 1.5px at 85% 30%, #fff, transparent), radial-gradient(1px 1px at 40% 8%, #fff, transparent),
  linear-gradient(180deg, #141a4a 0%, #4b2c7a 55%, #e0567f 100%); }
.art-lisbon .sun { top: 22%; width: 80px; height: 80px; background: #ffe9c8; box-shadow: 0 0 60px rgba(255,233,200,.6); }
.art-lisbon .hills { background: #1c1430; }
.art-juniper { background: linear-gradient(180deg, #f2b46b 0%, #c96a3c 55%, #5b2a24 100%); }
.art-juniper .sun { top: 30%; background: #fff1cf; box-shadow: 0 0 70px rgba(255,241,207,.7); }
.art-juniper .hills { background: #3a1d1d; height: 32%; }
.art-summer { background: linear-gradient(180deg, #ff9a6b 0%, #ff4f6e 50%, #6b1d4a 100%); }
.art-summer .sun { top: 36%; background: #ffe3a3; box-shadow: 0 0 80px rgba(255,227,163,.8); }
.art-summer .hills { background: #2c0f25; }
.art.mini { width: 64px; height: 84px; border-radius: 12px; flex: none; }
.art.mini .sun { width: 26px; height: 26px; top: 30%; }

/* split sections */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.split.reverse > :first-child { order: 2; }
.split-art { position: relative; display: flex; justify-content: center; }
.split-art .phone { width: 280px; }
.ways { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
.ways li { display: flex; gap: 16px; padding: 18px 20px; margin: 0; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); }
.ways h3 { margin: 0 0 2px; font-size: 17px; }
.ways p { margin: 0; color: var(--muted); font-size: 15px; }
.way-num { flex: none; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255,55,95,.14); color: var(--primary); font-weight: 800; }
.match-card { position: absolute; left: 0; bottom: 40px; width: 230px; padding: 20px; border-radius: 22px; text-align: center;
  background: rgba(23,23,27,.9); border: 1px solid rgba(255,55,95,.35); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  box-shadow: 0 30px 70px rgba(0,0,0,.6), 0 0 60px rgba(255,55,95,.2); }
.match-card .eyebrow { font-size: 10px; margin-bottom: 12px; }
.match-card strong { display: block; font-size: 18px; }
.match-card p { color: var(--muted); font-size: 13px; margin: 2px 0 14px; }
.match-people { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 10px; }
.avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--surface); display: inline-block; }
.a1 { background: radial-gradient(circle at 50% 38%, #2a1a14 22%, transparent 23%), radial-gradient(circle at 50% 100%, #2a1a14 45%, transparent 46%), linear-gradient(160deg, #f0a27a, #b4475a); }
.a2 { background: radial-gradient(circle at 50% 38%, #121a2c 22%, transparent 23%), radial-gradient(circle at 50% 100%, #121a2c 45%, transparent 46%), linear-gradient(160deg, #7fb3d9, #3a4f8f); }
.a3 { background: radial-gradient(circle at 50% 38%, #24132a 22%, transparent 23%), radial-gradient(circle at 50% 100%, #24132a 45%, transparent 46%), linear-gradient(160deg, #c79ae8, #6b3f8f); }
.heart { color: var(--primary); font-size: 20px; }
.count-pill { display: inline-block; margin: 0 0 16px; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;
  background: rgba(255,55,95,.12); color: var(--primary); }
.chips { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li { margin: 0; padding: 7px 14px; border-radius: 999px; font-size: 14px; background: var(--surface); border: 1px solid var(--border); color: #d6d6dd; }
.ticks { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.ticks li { margin: 0; padding-left: 30px; position: relative; color: #d6d6dd; }
.ticks li::before { content: "✓"; position: absolute; left: 0; top: 0; color: var(--primary); font-weight: 800; }
.room-card { width: min(360px, 100%); padding: 28px; border-radius: 28px; background: linear-gradient(180deg, var(--surface-2), var(--surface));
  border: 1px solid var(--border); box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 80px rgba(255,55,95,.15); }
.room-card-code { font-size: 44px; font-weight: 900; letter-spacing: .16em; margin: 0 0 18px; }
.room-people { display: flex; align-items: center; margin-bottom: 22px; }
.room-people .avatar { width: 40px; height: 40px; margin-right: -10px; }
.room-people small { margin-left: 20px; color: var(--muted); }
.room-match { display: flex; gap: 14px; align-items: center; padding: 12px; border-radius: 18px; background: rgba(255,55,95,.08); border: 1px solid rgba(255,55,95,.3); }
.room-match small { display: block; color: var(--primary); font-weight: 700; font-size: 12px; }
.room-match strong { font-size: 17px; }
@media (max-width: 900px) {
  .split { grid-template-columns: 1fr; gap: 40px; }
  .split.reverse > :first-child { order: 0; }
  .match-card { left: 50%; transform: translateX(-130px); bottom: -20px; }
}
@media (max-width: 560px) {
  .band { padding: 72px 0; }
  .split-art .phone { width: 240px; }
  .match-card { position: relative; left: auto; bottom: auto; transform: none; margin: -80px auto 0; }
  .split-art:has(.match-card) { flex-direction: column; align-items: center; }
}

.safety-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.feature.small { padding: 24px; }
.feature.small h3 { font-size: 18px; }
.feature.small p { font-size: 15px; }
.safety-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; margin-bottom: 18px;
  background: rgba(255,255,255,.05); border: 1px solid var(--border); font-weight: 800; font-size: 15px; color: var(--text); }
.centred-link { text-align: center; margin: 32px 0 0; font-weight: 600; }
@media (max-width: 980px) { .safety-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .safety-grid { grid-template-columns: 1fr; } }

.cta { padding: 110px 0; border-top: 1px solid var(--border);
  background: radial-gradient(60% 80% at 50% 100%, rgba(255,55,95,.25), transparent 70%); }
.cta-in { text-align: center; display: flex; flex-direction: column; align-items: center; }
.cta-logo { border-radius: 18px; margin-bottom: 26px; box-shadow: 0 0 60px rgba(255,55,95,.35); }
.cta h2 { max-width: 760px; }
.cta .section-lead { max-width: 560px; margin-bottom: 30px; }
.cta .stores { justify-content: center; }
`);


/* ------------------------------------------------------------------ */
/* room invitation                                                     */
/* ------------------------------------------------------------------ */
// Where a room invitation from the app points (roomInviteUrl in the app's
// constants/legal.ts): katil.html?code=XXXXXX. It opens the room in the app
// through the app's own scheme, and for somebody who does not have the app
// yet shows the code and where to get it. Nothing is sent anywhere: the code
// is read in the browser and only ever put back on this page.

// Room codes are six characters from room_code() (supabase/match-room.sql);
// anything else is not shown, so the page cannot be made to display a
// stranger's text.
const roomScript = `
<script>
(function () {
  var code = (new URLSearchParams(location.search).get('code') || '').toUpperCase();
  if (!/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/.test(code)) code = '';
  var shown = document.getElementById('room-code');
  var open = document.getElementById('open-room');
  if (code) {
    shown.textContent = code;
    open.href = 'movieforus://room/' + code;
  } else {
    document.getElementById('with-code').hidden = true;
    document.getElementById('no-code').hidden = false;
  }
})();
</script>`;

const playTR = CONFIG.playStore
  ? `<a class="button" href="${CONFIG.playStore}">Google Play’den indir</a>`
  : '';
const playEN = CONFIG.playStore
  ? `<a class="button" href="${CONFIG.playStore}">Get it on Google Play</a>`
  : '';

page({
  file: 'katil.html',
  title: 'Odaya katıl — MovieForUs',
  description: 'MovieForUs’ta ortak odaya katıl: aynı filmleri birlikte kaydırın, hepinizin beğendiği film çıksın.',
  body: `
<h1>Bu akşam ne izleyeceğinize birlikte karar verin</h1>
<p>Bir arkadaşın seni MovieForUs’ta ortak odasına çağırdı. Aynı filmleri birlikte kaydırın; hepinizin beğendiği filmler karşınıza çıksın.</p>
<p class="muted"><a href="join.html">English</a></p>

<div id="with-code">
  <p class="muted">Oda kodu</p>
  <p class="room-code" id="room-code">——————</p>
  <div class="actions">
    <a class="button primary" id="open-room" href="#">MovieForUs’ta aç</a>
  </div>
</div>
<p id="no-code" hidden>Bu bağlantıda geçerli bir oda kodu yok. Seni davet eden kişiden kodu tekrar iste.</p>

${section('Uygulama sende yok mu?',
  `<div class="actions"><a class="button" href="${CONFIG.appStore}">App Store’dan indir</a>${playTR}</div>`,
  CONFIG.playStore ? '' : p('Android sürümü yakında Google Play’de.'),
  `<ol><li>${fill('MovieForUs’u indir ve aç.')}</li><li>${fill('Profil sekmesinde “Oda kur veya katıl”a dokun.')}</li><li>${fill('Yukarıdaki kodu yaz ve “Katıl”a dokun.')}</li></ol>`)}
${roomScript}
`,
});

page({
  file: 'join.html',
  lang: 'en',
  title: 'Join a room — MovieForUs',
  description: 'Join a shared room on MovieForUs: swipe the same films together and find the one you all like.',
  body: `
<h1>Decide together what to watch tonight</h1>
<p>A friend has invited you to their shared room on MovieForUs. Swipe the same films together, and the ones you all like come up.</p>
<p class="muted"><a href="katil.html">Türkçe</a></p>

<div id="with-code">
  <p class="muted">Room code</p>
  <p class="room-code" id="room-code">——————</p>
  <div class="actions">
    <a class="button primary" id="open-room" href="#">Open in MovieForUs</a>
  </div>
</div>
<p id="no-code" hidden>This link does not carry a valid room code. Ask the person who invited you for the code again.</p>

${section('Don’t have the app yet?',
  `<div class="actions"><a class="button" href="${CONFIG.appStore}">Download on the App Store</a>${playEN}</div>`,
  CONFIG.playStore ? '' : p('Coming soon to Google Play for Android.'),
  `<ol><li>${fill('Download MovieForUs and open it.')}</li><li>${fill('On the Profile tab, tap “Open or join a room”.')}</li><li>${fill('Type the code above and tap “Join”.')}</li></ol>`)}
${roomScript}
`,
});

/* ------------------------------------------------------------------ */

const unfilled = Object.entries(CONFIG).filter(([, value]) => typeof value === 'string' && /^\[.*\]$/.test(value));
console.log(
  'pages: index.html, gizlilik.html, sartlar.html, destek.html · en.html, privacy.html, terms.html, support.html'
);
if (unfilled.length) {
  console.log(`NOT READY TO PUBLISH — fill in: ${unfilled.map(([key]) => key).join(', ')}`);
}

/* ------------------------------------------------------------------ */
/* account deletion                                                    */
/* ------------------------------------------------------------------ */
// Google Play asks for a page, reachable without the app, that says how to
// delete an account and its data, what is deleted and what is kept. It has
// to match what the app and the privacy policy (section 6) actually do.

page({
  file: 'hesap-silme.html',
  title: 'Hesap silme — MovieForUs',
  description: 'MovieForUs hesabını ve verilerini nasıl silebileceğin.',
  body: `
<h1>Hesabını ve verilerini silme</h1>
<p>Bu sayfa, <strong>MovieForUs</strong> uygulamasındaki hesabını ve ona bağlı verileri nasıl silebileceğini anlatır.</p>
<p class="muted"><a href="delete-account.html">English</a></p>

${section('1. Uygulamanın içinden (en hızlı yol)',
  list([
    'MovieForUs’u aç ve alttaki Profil sekmesine geç.',
    'Aşağı kaydırıp Hesap bölümünde “Hesabımı sil”’e dokun.',
    '“Kalıcı olarak sil” ile onayla. Hesabın ve verilerin hemen silinir.',
  ]))}

${section('2. Uygulamaya giremiyorsan',
  p(`Hesabına bağlı e-posta adresinden ${CONFIG.email} adresine “Hesap silme” konulu bir e-posta gönder. Apple ya da Google ile giriş yaptıysan o hesabın e-posta adresinden yaz. Hesabın sana ait olduğunu doğruladıktan sonra en geç 30 gün içinde siler ve sana haber veririz.`),
  p('Misafir hesaplar bir e-postaya bağlı olmadığı için yalnızca açıldıkları cihazdan, uygulamanın içinden silinebilir.'))}

${section('Neler silinir',
  list([
    'Profilin, fotoğrafların ve fotoğraf kontrol kayıtları',
    'Film zevkin, anket cevapların ve beğendiğin filmler',
    'İzleme listen, film listelerin ve kaydırmaların',
    'Eşleşmelerin, mesajların, ortak odaların ve bildirim anahtarın',
    'Kullanım analizi kayıtların: Amplitude’dan silinmeleri otomatik olarak istenir ve en geç 30 gün içinde silinir.',
  ]))}

${section('Neler bir süre saklanır',
  list([
    'Topluluğun güvenliği için, senin hakkında yapılmış şikayet kayıtları hesabın silindikten sonra en fazla 2 yıl saklanabilir. Senin yaptığın şikayetlerde adın silinir.',
    'Hizmet sağlayıcılarımızın yedeklerinde kalan kopyalar, onların saklama döngüsü sonunda silinir.',
  ]))}

${section('Hesabını silmeden bazı verileri silmek',
  p(`Profil fotoğrafını, profil bilgilerini, beğendiğin filmleri ve listelerini uygulamanın içinden istediğin zaman değiştirebilir ya da kaldırabilirsin. Kullanım verisi paylaşımını Ayarlar → Gizlilik bölümünden kapatabilirsin. Başka bir verinin silinmesini istersen ${CONFIG.email} adresine yaz.`))}

<p class="muted">Ayrıntılar için <a href="gizlilik.html">Gizlilik Politikası</a>’nın 6. bölümüne bakabilirsin.</p>
`,
});

page({
  file: 'delete-account.html',
  lang: 'en',
  title: 'Delete your account — MovieForUs',
  description: 'How to delete your MovieForUs account and data.',
  body: `
<h1>Deleting your account and data</h1>
<p>This page explains how to delete your account and the data linked to it in <strong>MovieForUs</strong>.</p>
<p class="muted"><a href="hesap-silme.html">Türkçe</a></p>

${section('1. In the app (the quickest way)',
  list([
    'Open MovieForUs and go to the Profile tab.',
    'Scroll down to Account and tap “Delete my account”.',
    'Confirm with “Delete permanently”. Your account and data are deleted immediately.',
  ]))}

${section('2. If you cannot get into the app',
  p(`Send an email with the subject “Delete my account” to ${CONFIG.email} from the email address linked to your account. If you signed in with Apple or Google, write from that account’s address. Once we have confirmed the account is yours, we delete it within 30 days and let you know.`),
  p('Guest accounts are not linked to an email address, so they can only be deleted from inside the app, on the device they were created on.'))}

${section('What is deleted',
  list([
    'Your profile, your photos and their check records',
    'Your taste in films, your survey answers and the films you liked',
    'Your watchlist, your film lists and your swipes',
    'Your matches, your messages, your shared rooms and your notification token',
    'Your usage analytics records: Amplitude is automatically asked to delete them, and does so within 30 days.',
  ]))}

${section('What is kept for a while',
  list([
    'For the safety of the community, reports made about you may be kept for up to 2 years after your account is deleted. Reports you made no longer carry your name.',
    'Copies in our service providers’ backups are deleted at the end of their retention cycle.',
  ]))}

${section('Deleting some data without deleting your account',
  p(`You can change or remove your profile photo, your profile details, the films you liked and your lists in the app at any time. You can turn off usage data sharing under Settings → Privacy. To have any other data deleted, write to ${CONFIG.email}.`))}

<p class="muted">For details, see section 6 of the <a href="privacy.html">Privacy Policy</a>.</p>
`,
});

/* ------------------------------------------------------------------ */
/* child safety standards                                              */
/* ------------------------------------------------------------------ */
// Google Play requires every dating and social app to publish its standards
// against child sexual abuse and exploitation (CSAE), with a contact. Every
// statement here has to be true of the app: the 18+ birth date check
// (MinAge), the photo screening (supabase/functions/moderate-photo), the
// "May be under 18" report reason, and a chat that carries text and films
// only, never pictures.

page({
  file: 'cocuk-guvenligi.html',
  title: 'Çocuk güvenliği standartları — MovieForUs',
  description: 'MovieForUs’un çocukların cinsel istismarına ve sömürüsüne karşı standartları.',
  body: `
<h1>Çocuk güvenliği standartları</h1>
<p><strong>MovieForUs</strong>, yalnızca 18 yaş ve üzerindeki kişiler için bir tanışma uygulamasıdır. Çocukların cinsel istismarına ve sömürüsüne (CSAE) ve çocukların cinsel istismarını içeren materyallere (CSAM) karşı <strong>sıfır tolerans</strong> uygularız.</p>
<p class="muted"><a href="child-safety.html">English</a></p>

${section('Yasak olanlar',
  list([
    'Çocukların cinsel istismarını ya da sömürüsünü gösteren, öven, teşvik eden ya da buna yol açan her türlü içerik ve davranış',
    'Bir çocukla cinsel amaçlı iletişim kurmaya, onu kandırmaya ya da kışkırtmaya çalışmak (grooming)',
    '18 yaşından küçük birinin hesap açması ya da başkası adına hesap açılması',
  ]),
  p('Bu kurallar Kullanım Şartları’nın parçasıdır ve uygulamayı kullanmadan önce kabul edilir.'))}

${section('Nasıl önlüyoruz',
  list([
    'Yaş sınırı: Eşleşme profili açarken doğum tarihi istenir; 18 yaşından küçük bir tarih kabul edilmez.',
    'Fotoğraf denetimi: Her profil fotoğrafı, kimse görmeden önce otomatik olarak denetlenir; cinsel içerikli fotoğraflar reddedilir ve silinir.',
    'Sohbette fotoğraf yok: Eşleşmeler arasında yalnızca yazı ve film gönderilebilir; fotoğraf, video ya da dosya gönderilemez.',
    'Şikayet: Her profil ve her mesaj uygulamanın içinden tek dokunuşla şikayet edilebilir; “18 yaşından küçük olabilir” ayrı bir şikayet sebebidir. Kişiler engellenebilir.',
  ]))}

${section('Bir şikayet geldiğinde',
  list([
    'Şikayetler bize anında bildirilir ve en geç 24 saat içinde incelenir.',
    'Çocuk güvenliğiyle ilgili bir şikayette içerik derhal kaldırılır ve hesap kalıcı olarak kapatılır.',
    'Çocukların cinsel istismarını içeren materyal ya da bir çocuğun tehlikede olduğuna dair bir bilgi, ilgili yasalara uygun olarak yetkili makamlara bildirilir: Türkiye’de kolluk kuvvetlerine ve savcılığa, uluslararası alanda NCMEC’e (CyberTipline). Kayıtlar, yetkililerin talebi için yasaların öngördüğü süre boyunca saklanır.',
  ]))}

${section('İletişim',
  p(`Çocuk güvenliğiyle ilgili her türlü bildirim ve soru için: ${CONFIG.email}. Bu adres, MovieForUs’un çocuk güvenliği uygulamalarından sorumlu kişiye ulaşır.`),
  p('Bir çocuk hemen tehlikedeyse önce bulunduğun ülkenin acil durum numarasını ara (Türkiye’de 112).'))}
`,
});

page({
  file: 'child-safety.html',
  lang: 'en',
  title: 'Child safety standards — MovieForUs',
  description: 'MovieForUs’s standards against child sexual abuse and exploitation.',
  body: `
<h1>Child safety standards</h1>
<p><strong>MovieForUs</strong> is a dating app for people aged 18 and over only. We have <strong>zero tolerance</strong> for child sexual abuse and exploitation (CSAE) and for child sexual abuse material (CSAM).</p>
<p class="muted"><a href="cocuk-guvenligi.html">Türkçe</a></p>

${section('What is prohibited',
  list([
    'Any content or behaviour that depicts, praises, encourages or leads to the sexual abuse or exploitation of children',
    'Contacting, deceiving or enticing a child for sexual purposes (grooming)',
    'Anyone under 18 opening an account, or an account opened on their behalf',
  ]),
  p('These rules are part of the Terms of Use, which are accepted before the app can be used.'))}

${section('How we prevent it',
  list([
    'Age limit: a date of birth is required to set up a matching profile, and a date under 18 is not accepted.',
    'Photo screening: every profile photo is checked automatically before anyone sees it; sexual photos are refused and deleted.',
    'No pictures in chat: matches can send each other text and films only, never photos, videos or files.',
    'Reporting: every profile and every message can be reported from inside the app with one tap, and “May be under 18” is a reason of its own. People can be blocked.',
  ]))}

${section('When something is reported',
  list([
    'Reports reach us immediately and are reviewed within 24 hours.',
    'For a report concerning child safety, the content is removed at once and the account is closed for good.',
    'Child sexual abuse material, or information that a child is in danger, is reported to the competent authorities as the law requires: law enforcement and prosecutors in Türkiye, and NCMEC (CyberTipline) internationally. Records are kept for as long as the law provides, for the authorities to request.',
  ]))}

${section('Contact',
  p(`For any report or question about child safety: ${CONFIG.email}. This address reaches the person responsible for MovieForUs’s child safety practices.`),
  p('If a child is in immediate danger, call your local emergency number first.'))}
`,
});
