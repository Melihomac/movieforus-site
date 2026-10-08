# MovieForUs — web sitesi

Gizlilik politikası, kullanım şartları ve destek sayfaları.
Yayın adresi: https://movieforus.com/ (eski melihomac.github.io/movieforus-site adresi buraya yönlenir)

Sayfalar `build.mjs` ile üretilir. Kullanım şartları, uygulamanın kendi
`src/constants/legal.ts` dosyasından alınır; bu yüzden uygulama reposu
`~/Developer/MovieForUs` konumunda olmalıdır.

    node --experimental-strip-types build.mjs
