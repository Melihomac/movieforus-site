// Builds the MovieForUs website: a landing page, the privacy policy (Turkish
// and English), the terms of use and a support page.
//
//   node --experimental-strip-types build.mjs
//
// The terms page is generated from the app's own src/constants/legal.ts, so
// the text people accept in the app and the text published here cannot drift.
//
// Everything that has to be filled in by a person lives in CONFIG. A value
// still in square brackets is shown highlighted on the page and makes this
// script say so, so an unfinished page cannot be published without noticing.

import fs from 'node:fs';
import path from 'node:path';

const CONFIG = {
  // Who is responsible for the data (KVKK "veri sorumlusu").
  controller: 'Dursun Melih Omaç',
  email: 'movieforus.destek@gmail.com',
  // Where the Supabase project runs. Established from the database host's
  // address against AWS's published ranges: eu-central-1.
  region: { tr: 'Frankfurt, Almanya (Avrupa Birliği)', en: 'Frankfurt, Germany (European Union)' },
  // Effective date of the privacy policy.
  effective: '2026-09-13',
};

const app = path.join(process.env.HOME, 'Developer/MovieForUs');
const { TermsSections, TermsVersion } = await import(path.join(app, 'src/constants/legal.ts'));

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

function page({ file, lang = 'tr', title, description, body }) {
  const nav =
    lang === 'tr'
      ? `<a href="./">Ana sayfa</a><a href="gizlilik.html">Gizlilik</a><a href="sartlar.html">Şartlar</a><a href="destek.html">Destek</a>`
      : `<a href="./">Home</a><a href="privacy.html">Privacy</a><a href="destek.html">Support</a>`;
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
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
</section>
<section class="cards">
  <div class="card"><h3>Film kaydır</h3><p>Herkesin gördüğü ortak filmler ve sana özel öneriler. Günde 30 kart.</p></div>
  <div class="card"><h3>Eşleş</h3><p>En az 8 ortak filmde anlaştığın kişiler sana önerilir.</p></div>
  <div class="card"><h3>Birlikte seç</h3><p>Eşleştiğin kişiyle aynı filmleri kaydırın, ikinizin de beğendiği film ortaya çıksın.</p></div>
</section>
<section class="links">
  <a href="gizlilik.html">Gizlilik Politikası</a> · <a href="privacy.html">Privacy Policy</a> · <a href="sartlar.html">Kullanım Şartları</a> · <a href="destek.html">Destek</a>
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
  p(`Veri sorumlusu: ${CONFIG.controller}. Bize ${CONFIG.email} adresinden ulaşabilirsin.`))}

${section('2. Hangi verileri işliyoruz',
  list([
    'Hesap bilgileri: e-posta adresin ve şifren (şifren kimlik doğrulama sağlayıcımızda şifrelenmiş olarak saklanır; biz göremeyiz). Misafir olarak devam edersen yalnızca bir hesap kimliği oluşturulur.',
    'Profil bilgileri: görünen adın, profil fotoğrafın, doğum tarihin, boyun, sigara ve alkol kullanımın, favori bir filmden alıntın, cinsiyetin ve eşleşme tercihlerin (ilgilendiğin cinsiyetler ve yaş aralığı).',
    'Film zevkin: ilk açılış anketindeki cevapların, kaydırdığın filmler (beğendin ya da geçtin), izleme listen, verdiğin puanlar ve oluşturduğun film listeleri (adları ve içindeki filmler).',
    'Konum: izin verirsen cihazının hassas konumu ve bu konumdan bulunan şehir adı.',
    'Eşleşmeler ve mesajlar: kimlerle eşleştiğin, eşleşmelerinin durumu, gönderdiğin ve aldığın mesajlar, ortak odalar ve odalarda kaydırdığın filmler.',
    'Güvenlik kayıtları: yaptığın ve hakkında yapılan şikayetler, engellediğin kişiler, kullanım şartlarını kabul kayıtların ve profil fotoğraflarının otomatik kontrol sonuçları.',
    'Cihaz bilgisi: bildirim gönderebilmek için cihazına özel bildirim anahtarı.',
    'Teknik kayıtlar: sunucularımıza bağlandığında IP adresin ve istek bilgileri, servis sağlayıcılarımızın kayıtlarında tutulabilir.',
  ]),
  p('Reklam göstermiyoruz, analitik ya da izleme araçları kullanmıyoruz ve kişisel verilerini satmıyoruz.'))}

${section('3. Verilerini neden işliyoruz',
  list([
    'Hizmeti sunmak (KVKK md. 5/2-c, sözleşmenin kurulması ve ifası): hesabını yönetmek, profilini göstermek, film zevkine göre eşleşme önermek, mesajlaşmayı ve ortak odaları çalıştırmak.',
    'Konuma dayalı eşleşme (açık rıza): yalnızca 100 km içindeki kişilerle eşleşebilmen için mesafe hesaplamak. Konum iznini cihaz ayarlarından istediğin zaman geri alabilirsin; bu durumda eşleşme özelliği çalışmaz.',
    'Özel nitelikli veriler (açık rıza): cinsiyetin ve ilgilendiğin cinsiyetler, cinsel hayatına ilişkin bilgi ortaya koyabilir. Bu bilgileri yalnızca eşleşme önerisi için ve açık rızanla işleriz.',
    'Bildirimler (açık rıza): yeni eşleşme ve mesajları haber vermek. Bildirim iznini cihaz ayarlarından kapatabilirsin.',
    'Topluluğun güvenliği (meşru menfaat ve hukuki yükümlülük): profil fotoğraflarını başkalarına gösterilmeden önce otomatik olarak kontrol etmek, şikayetleri incelemek, kurallara aykırı içeriği kaldırmak, kötüye kullanımı önlemek ve yasal taleplere yanıt vermek. Otomatik kontrol, fotoğrafında çıplaklık, cinsel içerik, şiddet ya da kendine zarar verme olup olmadığına bakar; uygun bulunmayan fotoğraf silinir ve profilinde kullanılamaz. Bu karara itiraz etmek için bize yazabilirsin; itirazları bir kişi inceler.',
  ]))}

${section('4. Bilgilerini kimler görebilir',
  list([
    'Eşleştiğin kişiler: görünen adın, fotoğrafın, yaşın, boyun, sigara ve alkol bilgin, film alıntın, cinsiyetin, aranızdaki yuvarlanmış yaklaşık mesafe, ortak beğendiğiniz filmler ve uyum oranınız. Doğum tarihin ve tam konumun kimseye gösterilmez.',
    'Aynı odadaki kişiler: görünen adın ve emojin. Fotoğrafın yalnızca eşleştiğin kişilere gösterilir. Bir eşleşmeyi geçer ya da kişiyi engellersen fotoğrafına erişimi kapanır.',
    'Moderatörler: yalnızca incelenen bir şikayetle ya da fotoğraf kontrolüne yapılan bir itirazla ilgili bilgiler.',
    'Yetkili kamu kurumları: yalnızca yasal bir zorunluluk olduğunda.',
  ]))}

${section('5. Hizmet sağlayıcılar ve yurt dışına aktarım',
  p('Uygulamayı çalıştırmak için aşağıdaki hizmet sağlayıcılardan yararlanıyoruz. Bu sağlayıcıların sunucuları Türkiye dışında bulunabilir; verilerin KVKK md. 9 kapsamında açık rızana dayanarak ya da Kanun’un öngördüğü diğer güvencelerle aktarılır.'),
  list([
    `Supabase: veritabanı, kimlik doğrulama, fotoğraf depolama ve anlık iletişim altyapısı. Sunucu bölgesi: ${CONFIG.region.tr}.`,
    'Expo (650 Industries, ABD): bildirimlerin cihazına iletilmesi.',
    'OpenAI (ABD): profil fotoğraflarının otomatik kontrolü. Yüklediğin fotoğraf yalnızca bu kontrol için gönderilir. OpenAI, API üzerinden gelen verileri model eğitiminde kullanmaz; kötüye kullanımı izlemek için en fazla 30 gün saklayabilir.',
    'Apple: bildirimlerin iOS cihazına ulaştırılması ve konumdan şehir adının bulunması.',
    'TMDB (The Movie Database): film bilgileri ve görselleri. Cihazın bu bilgileri doğrudan TMDB’den ister; TMDB bu sırada IP adresini ve film aramalarını görebilir.',
    'YouTube: bir fragmanı açtığında fragman YouTube’da açılır ve YouTube’un kendi gizlilik kuralları geçerli olur.',
  ]))}

${section('6. Ne kadar süre saklıyoruz',
  list([
    'Hesabın açık olduğu sürece verilerini saklarız.',
    'Hesabını uygulama içinden (Profil → Hesap → Hesabımı sil) sildiğinde profilin, fotoğrafların ve kontrol kayıtları, film zevkin, izleme listen, film listelerin, kaydırmaların, eşleşmelerin, mesajların ve bildirim anahtarın hemen ve kalıcı olarak silinir.',
    'Topluluğun güvenliği için, bir kişi hakkında yapılan şikayet kayıtları o kişinin hesabı silindikten sonra en fazla 2 yıl saklanabilir.',
    'Servis sağlayıcılarımızın yedeklerinde ve teknik kayıtlarında kalan kopyalar, onların saklama döngüsü sonunda silinir.',
  ]))}

${section('7. Verilerini nasıl koruyoruz',
  p('Uygulama ile sunucular arasındaki tüm bağlantılar şifrelidir. Her veri, satır bazlı erişim kurallarıyla yalnızca görmesi gereken kişiye açılır. Fotoğrafların herkese açık olmayan bir depoda tutulur ve kısa süreli, imzalı bağlantılarla gösterilir.'))}

${section('8. Hakların',
  p('KVKK md. 11 uyarınca verilerinin işlenip işlenmediğini öğrenme, bilgi talep etme, işlenme amacını öğrenme, aktarıldığı kişileri bilme, düzeltilmesini, silinmesini ya da yok edilmesini isteme, bunların aktarıldığı kişilere bildirilmesini isteme, otomatik sistemlerle yapılan bir analiz sonucuna itiraz etme ve zarara uğradıysan zararın giderilmesini talep etme hakların vardır.'),
  p(`Hesabını ve verilerini istediğin zaman uygulama içinden silebilirsin. Diğer talepler için ${CONFIG.email} adresine yazabilirsin; başvurunu en geç 30 gün içinde yanıtlarız.`))}

${section('9. Çocuklar',
  p('MovieForUs 18 yaşın altındaki kişiler için değildir. 18 yaşından küçük birine ait olduğunu fark ettiğimiz hesapları kapatırız.'))}

${section('10. Değişiklikler',
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
  p(`Data controller: ${CONFIG.controller}. Contact: ${CONFIG.email}.`))}

${section('2. What we collect',
  list([
    'Account: your email address and password (stored hashed by our authentication provider; we cannot see it). Continuing as a guest creates only an account identifier.',
    'Profile: display name, profile photo, date of birth, height, smoking and drinking habits, a quote from a favourite film, your gender and matching preferences (genders you are interested in and an age range).',
    'Film taste: your first-run survey answers, the films you swipe (liked or passed), your watchlist and ratings, and the film lists you create (their names and the films in them).',
    'Location: if you allow it, your device’s precise location and the city derived from it.',
    'Matches and messages: who you matched with, the state of each match, messages you send and receive, shared rooms and the films swiped in them.',
    'Safety records: reports you file and reports about you, people you block, your acceptances of the terms of use, and the results of the automatic checks on your profile photos.',
    'Device: a push notification token for your device.',
    'Technical logs: your IP address and request details may be recorded in our service providers’ logs when you connect.',
  ]),
  p('We show no ads, use no analytics or tracking tools, and do not sell personal data.'))}

${section('3. Why we process it',
  list([
    'To provide the service: managing your account, showing your profile, suggesting matches based on film taste, and running messaging and shared rooms.',
    'Location-based matching (consent): to calculate distance so that you are matched only with people within 100 km. You can withdraw location permission in your device settings at any time; matching then stops working.',
    'Special category data (explicit consent): your gender and the genders you are interested in may reveal information about your sex life or orientation. We use them only to suggest matches.',
    'Notifications (consent): to tell you about new matches and messages. You can turn them off in your device settings.',
    'Community safety (legitimate interest and legal obligation): checking profile photos automatically before anyone else can see them, reviewing reports, removing content that breaks the rules, preventing abuse and responding to lawful requests. The automatic check looks for nudity, sexual content, violence and self-harm; a photo that fails it is deleted and cannot be used on your profile. You can contest the decision by writing to us, and a person will review it.',
  ]))}

${section('4. Who can see your information',
  list([
    'People you match with: your display name, photo, age, height, smoking and drinking habits, film quote, gender, a rounded approximate distance between you, films you both liked and your compatibility score. Your date of birth and exact location are never shown.',
    'People in the same room: your display name and emoji. Your photo is shown only to people you are matched with, and access ends if the match is passed or blocked.',
    'Moderators: only what relates to a report under review or to a contested photo check.',
    'Public authorities: only where the law requires it.',
  ]))}

${section('5. Service providers and international transfers',
  p('We rely on the providers below, whose servers may be located outside Türkiye.'),
  list([
    `Supabase: database, authentication, photo storage and realtime infrastructure. Server region: ${CONFIG.region.en}.`,
    'Expo (650 Industries, USA): delivering push notifications.',
    'OpenAI (USA): the automatic check of profile photos. A photo you upload is sent only for that check. OpenAI does not use data sent through its API to train models, and may keep it for up to 30 days to monitor abuse.',
    'Apple: delivering notifications to iOS devices and looking up a city name from a location.',
    'TMDB (The Movie Database): film information and images, requested directly from your device; TMDB can see your IP address and film searches.',
    'YouTube: trailers open on YouTube, where YouTube’s own privacy policy applies.',
  ]))}

${section('6. How long we keep it',
  list([
    'We keep your data for as long as your account exists.',
    'When you delete your account in the app (Profile → Account → Delete my account), your profile, photos and their check records, film taste, watchlist, film lists, swipes, matches, messages and push token are deleted immediately and permanently.',
    'For community safety, reports about a person may be kept for up to 2 years after that person’s account is deleted.',
    'Copies in our providers’ backups and technical logs are removed at the end of their retention cycles.',
  ]))}

${section('7. How we protect it',
  p('All connections between the app and our servers are encrypted. Row-level access rules open each piece of data only to the people who need to see it. Photos are kept in private storage and shown through short-lived signed links.'))}

${section('8. Your rights',
  p('You can access, correct or delete your data, object to processing, and ask who it has been shared with. You can delete your account and data at any time from within the app.'),
  p(`For any other request, write to ${CONFIG.email}; we reply within 30 days.`))}

${section('9. Children',
  p('MovieForUs is not for anyone under 18. We close accounts we find belong to someone under 18.'))}

${section('10. Changes',
  p('We may update this policy. We will let you know in the app about significant changes; the current version is always on this page.'))}
`,
});

/* ------------------------------------------------------------------ */
/* terms of use — from the app's own text                              */
/* ------------------------------------------------------------------ */

page({
  file: 'sartlar.html',
  title: 'Kullanım Şartları — MovieForUs',
  description: 'MovieForUs kullanım şartları.',
  body: `
<h1>Kullanım Şartları</h1>
<p class="muted">Son güncelleme: ${dateTR(TermsVersion)}</p>
${TermsSections.map((s) => {
    const bullets = s.body.filter((line) => line.startsWith('•'));
    const plain = s.body.filter((line) => !line.startsWith('•'));
    return section(s.title, ...plain.map(p), bullets.length ? list(bullets.map((b) => b.replace(/^•\s*/, ''))) : '');
  }).join('\n')}
${section('İletişim', p(`Soruların ve şikayetlerin için bize ${CONFIG.email} adresinden ulaşabilirsin.`))}
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
<p class="muted">Need help? Write to us at ${fill(CONFIG.email)}.</p>

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
.links { margin-top: 24px; }
footer { max-width: 820px; margin: 0 auto; padding: 24px; border-top: 1px solid var(--border); }
footer p { color: var(--muted); margin: 6px 0; }
/* TMDB's terms: its mark, smaller than MovieForUs's own. */
.tmdb img { height: 14px; width: auto; display: block; margin-bottom: 8px; }
`);

/* ------------------------------------------------------------------ */

const unfilled = Object.entries(CONFIG).filter(([, value]) => typeof value === 'string' && /^\[.*\]$/.test(value));
console.log('pages: index.html, gizlilik.html, privacy.html, sartlar.html, destek.html');
if (unfilled.length) {
  console.log(`NOT READY TO PUBLISH — fill in: ${unfilled.map(([key]) => key).join(', ')}`);
}
