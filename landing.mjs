// The landing pages (index.html, en.html): a long page in sections, laid out
// after the look the site was asked to have -- dark, red light behind the
// headings, a phone beside the hero and a deck of film cards that can be
// swiped right on the page (home.js).
//
// Every figure here is one the app enforces (src/constants/matching.ts,
// supabase/*.sql); the films in the deck are made up, drawn in CSS, so no
// poster or studio art appears on the site. The screenshots in img/ are the
// app with sample people, from the marketing set in ~/Developer/mfu-reels.

const T = {
  tr: {
    home: './',
    anchors: [
      ['nasil', 'Nasıl çalışır'],
      ['dene', 'Sitede dene'],
      ['eslesme', 'Eşleşme'],
      ['kulupler', 'Hayran kulüpleri'],
      ['oda', 'Ortak oda'],
      ['guven', 'Güvenlik'],
    ],
    get: 'İndir',
    eyebrow: 'Film zevkine göre tanışma uygulaması',
    title: 'Aynı filmleri seven <em>biriyle tanış.</em>',
    lead: 'İnsanları değil, filmleri kaydır. Aynı filmlerde seninle anlaşan, 300 km içindeki kişilerle eşleş; sohbet edin ve bu akşamın filmini birlikte seçin.',
    badge: { src: 'app-store-badge-tr.svg', alt: 'App Store’dan İndirin', width: 151 },
    play: 'Google Play · Yakında',
    note: 'iPhone için ücretsiz · 18 yaş ve üzeri',
    stats: [
      ['8 film', 'Ortak zevk eşiği'],
      ['300 km', 'Eşleşme mesafesi'],
      ['Günde 3', 'Yeni eşleşme'],
      ['Ücretsiz', 'Abonelik yok'],
    ],
    shots: { front: 'img/chat-tr.jpg', back: 'img/profile-tr.jpg', matches: 'img/matches-tr.jpg', clubs: 'img/clubs-tr.jpg' },
    shotAlt: {
      front: 'MovieForUs’ta bir sohbet: Elif ile altı ortak beğeni',
      back: 'MovieForUs’ta bir profil',
      matches: 'Eşleşmelerin listesi: Elif, Zeynep ve Ece',
      clubs: 'Hayran kulüpleri listesi',
    },
    heroChip: ['Yeni eşleşme', 'Elif, 27 · 6 ortak beğeni'],

    featuresEyebrow: 'Nasıl çalışır',
    featuresTitle: 'İnsanları değil, filmleri kaydır',
    featuresLead: 'Önce fotoğrafa bakıp karar vermek yok. Film kararların zevkini ortaya çıkarır, MovieForUs da seninle gerçekten uyuşan kişileri bulur.',
    features: [
      ['Keşfet', 'Kaydır ve keşfet', 'Beğendiysen sağa, beğenmediysen sola. Günde 30 kart: üçte biri herkesin gördüğü ortak desteden, gerisi sana özel önerilerden.'],
      ['Kalp', 'Sevdiğin filmlere kalp at', 'Biriyle aynı 5 filme kalp attıysanız, kaydırmaya gerek kalmadan eşleşirsiniz.'],
      ['Oyuncular', 'Favori oyuncuların', 'En sevdiğin 3 oyuncuyu seç. Ortak favori oyuncusu olan kişiler sana önce önerilir.'],
    ],

    demoEyebrow: 'Sitede dene',
    demoTitle: 'Birkaç film kaydır, nasıl olduğunu gör',
    demoLead: 'Kartı sağa sürükleyerek beğen, sola sürükleyerek geç ya da alttaki düğmeleri kullan. Buradaki filmler örnek; uygulamada gerçek filmleri kaydırırsın.',
    deckLabel: 'Örnek film destesi',
    like: 'Beğen',
    pass: 'Geç',
    love: 'Kalp at',
    stampLike: 'BEĞENDİM',
    stampPass: 'GEÇ',
    films: [
      { title: 'Lizbon’da Gece Yarısı', meta: 'Romantik · Dram', text: 'İki yabancı son tramvayı kaçırır ve güneş doğana kadar konuşur.', art: 'lisbon' },
      { title: 'Juniper’a Mektuplar', meta: 'Dram', text: 'Bir kutu eski mektup onu, bir daha dönmem dediği kasabaya götürür.', art: 'juniper' },
      { title: 'Son Yaz Işığı', meta: 'Romantik · Komedi', text: 'Bir yaz, çatıda bir projeksiyon ve ikisinin de unutmayacağı bir film.', art: 'summer' },
    ],
    resultTitle: 'İşte bu kadar.',
    result: (n) => `${n} filmden <b data-liked>0</b> tanesini beğendin. Uygulamada, aynı filmlerde seninle anlaşan biri çıktığında eşleşirsiniz.`,
    again: 'Baştan başla',
    resultGet: 'Uygulamayı indir',

    matchEyebrow: 'Eşleşme',
    matchTitle: 'Eşleşmeye giden iki yol',
    matchLead: 'MovieForUs seni fotoğrafa göre değil, film kararlarına göre önerir. İki yoldan biri yeter:',
    matchWays: [
      ['Ortak zevk', 'En az 8 ortak filmde karar verdiniz ve çoğunda anlaştınız.'],
      ['Ortak kalpler', 'Aynı 5 filme kalp attınız. Ortak bir favori oyuncunuz varsa 3 film yeter.'],
      ['Hep yakınında', 'Herkes en fazla 300 km uzakta. Mesafe 5 km’ye yuvarlanarak gösterilir.'],
    ],
    matchCard: { label: 'Yeni bir eşleşmen var', name: 'Elif, 27', facts: ['6 ortak beğeni', '5 km’den yakın'], open: 'Sohbeti aç' },

    clubsEyebrow: 'Hayran kulüpleri',
    clubsTitle: 'Aynı serinin hayranlarıyla eşleş',
    clubsLead: 'Sevdiğin serinin kulübüne katıl, 5 kısa soruyu cevapla; 1000 km’ye kadar aynı serinin hayranlarıyla eşleş. Her kulüpte günde 3 eşleşme.',
    clubsCount: (n) => `${n} kulüp`,

    roomEyebrow: 'Ortak oda',
    roomTitle: 'Bu akşamın filmini birlikte seçin',
    roomLead: 'Bir oda aç, kodu arkadaşlarına ya da eşleştiğin kişiye gönder. En fazla 4 kişi aynı filmleri kaydırır; hepinizin beğendiği filmler ekrana gelir.',
    roomPoints: ['Davet bağlantısıyla tek dokunuşla katılım', 'Sohbetten “Birlikte film seçelim” ile hemen başla', 'Türe göre süz, aynı desteyi birlikte kaydırın'],
    roomCard: { code: 'Oda kodu', people: '3 kişi odada', match: 'Hepiniz beğendiniz', film: 'Son Yaz Işığı' },

    safetyEyebrow: 'Güvenlik ve gizlilik',
    safetyTitle: 'Rahat hissetmen için',
    safety: [
      ['18+', 'Yalnızca yetişkinler', 'MovieForUs 18 yaş ve üzeri içindir. Eşleşmek için fotoğraflı, tam bir profil gerekir.'],
      ['!', 'Engelle ve şikayet et', 'Bir kişiyi tek dokunuşla engelle ya da şikayet et. Şikayetler moderatörlerimize anında ulaşır.'],
      ['◐', 'Bulanık yüzler', 'Film sayfalarında seni yalnızca bulanık bir fotoğrafla görürler. İstersen tamamen kapatabilirsin.'],
      ['⊘', 'Reklam yok, veri satışı yok', 'Reklam göstermiyoruz, verilerini satmıyoruz. Veriler Avrupa Birliği’nde (Frankfurt) saklanır.'],
    ],
    safetyMore: ['gizlilik.html', 'Gizlilik politikasını oku'],

    ctaTitle: 'Zevkini paylaşan biri, sandığından yakın.',
    ctaLead: 'MovieForUs’u indir, birkaç film kaydır ve seninle aynı filmleri seven kişilerle tanış. Tamamen ücretsiz.',
  },

  en: {
    home: 'en.html',
    anchors: [
      ['how', 'How it works'],
      ['try', 'Try it'],
      ['matching', 'Matching'],
      ['clubs', 'Fan clubs'],
      ['rooms', 'Rooms'],
      ['safety', 'Safety'],
    ],
    get: 'Get the app',
    eyebrow: 'A dating app built on taste in films',
    title: 'Meet someone who <em>loves your films.</em>',
    lead: 'Swipe films, not people. Match with people within 300 km who agree with you on the same films, then talk and pick tonight’s film together.',
    badge: { src: 'app-store-badge-en.svg', alt: 'Download on the App Store', width: 120 },
    play: 'Google Play · Coming soon',
    note: 'Free for iPhone · 18 and over',
    stats: [
      ['8 films', 'to tell your taste'],
      ['300 km', 'matching radius'],
      ['3 a day', 'new matches'],
      ['Free', 'no subscription'],
    ],
    shots: { front: 'img/chat-en.jpg', back: 'img/profile-en.jpg', matches: 'img/matches-en.jpg', clubs: 'img/clubs-en.jpg' },
    shotAlt: {
      front: 'A chat on MovieForUs: six shared likes with Emma',
      back: 'A profile on MovieForUs',
      matches: 'Your matches: Emma, Sofia and Ava',
      clubs: 'The list of fan clubs',
    },
    heroChip: ['New match', 'Emma, 27 · 6 shared likes'],

    featuresEyebrow: 'How it works',
    featuresTitle: 'Swipe films, not people',
    featuresLead: 'No judging a face first. Your film choices show your taste, and MovieForUs finds the people who really share it.',
    features: [
      ['Discover', 'Swipe and discover', 'Right if you like it, left if you don’t. 30 cards a day: a third from a deck everybody sees, the rest picked for you.'],
      ['Hearts', 'Heart the films you love', 'Heart the same 5 films as someone and you match, even without swiping.'],
      ['Actors', 'Your favourite actors', 'Pick up to 3 favourite actors. People who share one with you are proposed first.'],
    ],

    demoEyebrow: 'Try it here',
    demoTitle: 'Swipe a few films and see how it feels',
    demoLead: 'Drag a card right to like it, left to pass, or use the buttons below. These films are made up; in the app you swipe real ones.',
    deckLabel: 'A sample deck of films',
    like: 'Like',
    pass: 'Pass',
    love: 'Heart',
    stampLike: 'LIKED',
    stampPass: 'PASS',
    films: [
      { title: 'Midnight in Lisbon', meta: 'Romance · Drama', text: 'Two strangers miss the last tram and talk until the sun comes up.', art: 'lisbon' },
      { title: 'Letters to Juniper', meta: 'Drama', text: 'A box of old letters leads her back to the town she swore she’d leave.', art: 'juniper' },
      { title: 'The Last Summer Light', meta: 'Romance · Comedy', text: 'One summer, one projector on a rooftop, and a film they’ll both remember.', art: 'summer' },
    ],
    resultTitle: 'That’s it.',
    result: (n) => `You liked <b data-liked>0</b> of ${n} films. In the app, you match when somebody agrees with you on the same films.`,
    again: 'Start again',
    resultGet: 'Get the app',

    matchEyebrow: 'Matching',
    matchTitle: 'Two ways to a match',
    matchLead: 'MovieForUs proposes people on their film choices, not their photos. Either way is enough:',
    matchWays: [
      ['Shared taste', 'You have both decided on at least 8 of the same films and agree on most of them.'],
      ['Shared hearts', 'You have hearted the same 5 films. With a favourite actor in common, 3 are enough.'],
      ['Always nearby', 'Everyone is within 300 km. Distances are shown rounded to 5 km.'],
    ],
    matchCard: { label: 'You have a new match', name: 'Emma, 27', facts: ['6 shared likes', 'Less than 5 km away'], open: 'Open the chat' },

    clubsEyebrow: 'Fan clubs',
    clubsTitle: 'Match with fans of the same series',
    clubsLead: 'Join the club of a series you love and answer 5 quick questions to match with its fans up to 1000 km away. 3 matches a day in each club.',
    clubsCount: (n) => `${n} clubs`,

    roomEyebrow: 'Shared rooms',
    roomTitle: 'Pick tonight’s film together',
    roomLead: 'Open a room and send the code to your friends or your match. Up to 4 people swipe the same films, and the ones you all like come up.',
    roomPoints: ['Join in one tap from an invitation link', 'Start straight from a chat with “Let’s pick a film together”', 'Filter by genre and swipe the same deck together'],
    roomCard: { code: 'Room code', people: '3 people in the room', match: 'You all liked', film: 'The Last Summer Light' },

    safetyEyebrow: 'Safety and privacy',
    safetyTitle: 'So you can feel at ease',
    safety: [
      ['18+', 'Adults only', 'MovieForUs is for people 18 and over. Matching needs a complete profile with a photo.'],
      ['!', 'Block and report', 'Block or report someone in one tap. Reports reach our moderators straight away.'],
      ['◐', 'Blurred faces', 'On film pages people only see you as a blurred photo, and you can turn even that off.'],
      ['⊘', 'No ads, no data sales', 'We show no ads and sell no data. Data is kept in the European Union (Frankfurt).'],
    ],
    safetyMore: ['privacy.html', 'Read the privacy policy'],

    ctaTitle: 'Someone who shares your taste is closer than you think.',
    ctaLead: 'Download MovieForUs, swipe a few films and meet people who love the same ones. Completely free.',
  },
};

/** The landing page's links in the header, to its own sections. */
export const anchors = (lang) =>
  T[lang].anchors.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('');

export const getLabel = (lang) => T[lang].get;
export const homeOf = (lang) => T[lang].home;

/**
 * The page's sections. `clubs` is the list of fan club names in this
 * language, read from the app; `appStore`/`playStore` from CONFIG.
 */
export function landingBody(lang, { appStore, playStore, clubs, escape }) {
  const t = T[lang];
  const ids = Object.fromEntries(t.anchors.map(([id], i) => [i, id]));

  // Apple's own badge, unmodified and at its own proportions, as its
  // marketing guidelines require; served from this site so the page does not
  // call out to Apple for it.
  const stores = `
  <div class="stores">
    <a class="store-badge" href="${appStore}"><img src="${t.badge.src}" alt="${t.badge.alt}" width="${t.badge.width}" height="40"></a>
    ${playStore
      ? `<a class="pill-button" href="${playStore}">Google Play</a>`
      : `<span class="pill-button soon" aria-disabled="true">${t.play}</span>`}
  </div>`;

  // The hero's phones load straight away; the rest when scrolled near.
  const phone = (src, alt, extra = '', eager = false) =>
    `<div class="phone ${extra}"><img src="${src}" alt="${escape(alt)}" width="600" height="1305" ${eager ? '' : 'loading="lazy" '}decoding="async"></div>`;

  const head = (eyebrow, title, lead, centred = true) => `
  <div class="section-head${centred ? ' centred' : ''}">
    <p class="eyebrow">${eyebrow}</p>
    <h2>${title}</h2>
    ${lead ? `<p class="section-lead">${lead}</p>` : ''}
  </div>`;

  const film = (f, i) => `
      <article class="film" data-film aria-hidden="${i === 0 ? 'false' : 'true'}">
        <div class="art art-${f.art}"><span class="sun"></span><span class="hills"></span></div>
        <span class="stamp stamp-like">${t.stampLike}</span>
        <span class="stamp stamp-pass">${t.stampPass}</span>
        <span class="stamp stamp-love">♥</span>
        <div class="film-text">
          <p class="film-meta">${f.meta}</p>
          <h3>${f.title}</h3>
          <p>${f.text}</p>
        </div>
      </article>`;

  return `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow pill">${t.eyebrow}</p>
      <h1>${t.title}</h1>
      <p class="hero-lead">${t.lead}</p>
      ${stores}
      <p class="note">${t.note}</p>
      <dl class="stats">
        ${t.stats.map(([big, small]) => `<div><dt>${big}</dt><dd>${small}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="hero-art">
      ${phone(t.shots.back, t.shotAlt.back, 'phone-back', true)}
      ${phone(t.shots.front, t.shotAlt.front, 'phone-front', true)}
      <div class="float-chip"><span class="dot"></span><div><strong>${t.heroChip[0]}</strong><small>${t.heroChip[1]}</small></div></div>
    </div>
  </div>
</section>

<section class="band" id="${ids[0]}">
  <div class="wrap">
    ${head(t.featuresEyebrow, t.featuresTitle, t.featuresLead)}
    <div class="feature-grid">
      ${t.features.map(([tag, title, text], i) => `
      <article class="feature">
        <span class="feature-icon icon-${i}" aria-hidden="true"></span>
        <p class="eyebrow">${tag}</p>
        <h3>${title}</h3>
        <p>${text}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="band glow" id="${ids[1]}">
  <div class="wrap">
    ${head(t.demoEyebrow, t.demoTitle, t.demoLead)}
    <div class="demo">
      <div class="deck" data-deck role="group" aria-label="${t.deckLabel}">
        ${t.films.map(film).join('')}
        <div class="deck-result" data-deck-result hidden>
          <p class="eyebrow">MovieForUs</p>
          <h3>${t.resultTitle}</h3>
          <p aria-live="polite">${t.result(t.films.length)}</p>
          <div class="deck-result-actions">
            <button type="button" class="pill-button" data-deck-reset>${t.again}</button>
            <a class="pill-button primary" href="${appStore}">${t.resultGet}</a>
          </div>
        </div>
      </div>
      <div class="deck-controls">
        <button type="button" class="round pass" data-deck-act="pass" aria-label="${t.pass}">✕</button>
        <button type="button" class="round love" data-deck-act="love" aria-label="${t.love}">♥</button>
        <button type="button" class="round like" data-deck-act="like" aria-label="${t.like}">✓</button>
      </div>
    </div>
  </div>
</section>

<section class="band" id="${ids[2]}">
  <div class="wrap split">
    <div>
      ${head(t.matchEyebrow, t.matchTitle, t.matchLead, false)}
      <ol class="ways">
        ${t.matchWays.map(([title, text], i) => `<li><span class="way-num">${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}
      </ol>
    </div>
    <div class="split-art">
      ${phone(t.shots.matches, t.shotAlt.matches)}
      <div class="match-card" aria-hidden="true">
        <p class="eyebrow">${t.matchCard.label}</p>
        <div class="match-people"><span class="avatar a1"></span><span class="heart">♥</span><span class="avatar a2"></span></div>
        <strong>${t.matchCard.name}</strong>
        <p>${t.matchCard.facts.join(' · ')}</p>
        <span class="pill-button primary small">${t.matchCard.open}</span>
      </div>
    </div>
  </div>
</section>

<section class="band glow" id="${ids[3]}">
  <div class="wrap split reverse">
    <div>
      ${head(t.clubsEyebrow, t.clubsTitle, t.clubsLead, false)}
      <p class="count-pill">${t.clubsCount(clubs.length)}</p>
      <ul class="chips">${clubs.map((name) => `<li>${escape(name)}</li>`).join('')}</ul>
    </div>
    <div class="split-art">${phone(t.shots.clubs, t.shotAlt.clubs)}</div>
  </div>
</section>

<section class="band" id="${ids[4]}">
  <div class="wrap split">
    <div>
      ${head(t.roomEyebrow, t.roomTitle, t.roomLead, false)}
      <ul class="ticks">${t.roomPoints.map((point) => `<li>${point}</li>`).join('')}</ul>
    </div>
    <div class="split-art">
      <div class="room-card" aria-hidden="true">
        <p class="eyebrow">${t.roomCard.code}</p>
        <p class="room-card-code">K7M2QX</p>
        <div class="room-people"><span class="avatar a1"></span><span class="avatar a2"></span><span class="avatar a3"></span><small>${t.roomCard.people}</small></div>
        <div class="room-match">
          <div class="art art-summer mini"><span class="sun"></span><span class="hills"></span></div>
          <div><small>${t.roomCard.match} ♥</small><strong>${t.roomCard.film}</strong></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band" id="${ids[5]}">
  <div class="wrap">
    ${head(t.safetyEyebrow, t.safetyTitle, '')}
    <div class="safety-grid">
      ${t.safety.map(([icon, title, text]) => `
      <article class="feature small">
        <span class="safety-icon" aria-hidden="true">${icon}</span>
        <h3>${title}</h3>
        <p>${text}</p>
      </article>`).join('')}
    </div>
    <p class="centred-link"><a href="${t.safetyMore[0]}">${t.safetyMore[1]} →</a></p>
  </div>
</section>

<section class="cta">
  <div class="wrap cta-in">
    <img src="logo.png" alt="" width="72" height="72" class="cta-logo">
    <h2>${t.ctaTitle}</h2>
    <p class="section-lead">${t.ctaLead}</p>
    ${stores}
  </div>
</section>
<script src="home.js" defer></script>`;
}
