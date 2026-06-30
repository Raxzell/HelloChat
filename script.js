/* HelloChat — script.js
   Logika kartu obrolan: shuffle, navigasi maju/mundur, progress, swipe, keyboard. */


/* 1. DATA
   Semua pertanyaan ada di sini. Untuk menambah pertanyaan, cukup tambahkan
   string baru ke dalam array ini. Lihat README.md untuk panduan lengkapnya. */
const questions = [
  // Throwback — nostalgia & masa lalu
  "Apa momen paling absurd atau lucu yang paling lu inget pas jaman sekolah dulu?",
  "Siapa guru atau kejadian di sekolah dulu yang menurut lu paling membekas sampai sekarang?",
  "Kalau lu bisa balik ke masa jaman awal masuk sekolah dulu, ada ga satu hal yang pengen lu ubah?",
  "Dulu pas jaman sekolah, lu tipe murid yang kalau gabut di kelas ngapain?",
  "Apa lagu jaman sekolah dulu yang kalau lu dengerin sekarang, langsung bikin lu nostalgia?",
  "Ada ga jajanan jaman sekolah yang kalau liat sekarang langsung bikin lu kangen masa itu?",
  "Apa hal paling nekat atau bandel yang pernah lu lakuin pas masih sekolah?",
  "Dulu kesan pertama lu ke gw pas awal kenal tuh kayak gimana sih? Jujur ya wkwk.",
  "Ada ga satu spot di tempat sekolah/kuliah dulu yang jadi tempat favorit lu buat menyendiri atau nongkrong?",
  "Kalau jaman sekolah dulu ada 'penghargaan' paling gak penting buat murid, kira-kira lu dapet gelar apa?",

  // Mind Unfolded — logika & cara pandang
  "Menurut lu, apakah manusia itu bener-bener bisa mengenal dirinya sendiri secara utuh?",
  "Kalau lu dikasih kesempatan buat dapet jawaban jujur dari satu misteri di hidup lu, lu mau nanya tentang apa?",
  "Apa definisi 'hari yang sempurna' atau perfect day versi lu saat ini?",
  "Lebih mending punya banyak temen tapi biasa aja, atau punya 1-2 temen tapi tahu luar dalemnya kita?",
  "Apa satu pelajaran hidup paling berharga yang lu dapet dari hal yang awalnya lu benci?",
  "Menurut lu, apa yang bikin seseorang bisa dibilang 'dewasa'? Apakah umur atau pengalaman?",
  "Kalau nanti lu udah tua, cerita kayak gimana yang pengen lu ceritain ke anak/cucu lu?",
  "Apa hal yang paling sering bikin lu overthinking sebelum tidur belakangan ini?",
  "Lebih takut gagal atau takut ga pernah mencoba sama sekali?",
  "Apa satu prinsip hidup yang lu pegang teguh banget dan ga mau lu langgar?",

  // Connection & Future — kedekatan & support
  "Apa hal pertama yang terlintas di pikiran lu pas awal-awal kita kenal dulu dibandingin sekarang?",
  "Sebelum nanti kita masuk ke kesibukan baru masing-masing, apa hal yang paling lu tunggu-tunggu ke depannya?",
  "Bagi lu, apa sih hal paling krusial yang bisa bikin lu ngerasa 'aman' dan nyaman pas cerita sama orang lain?",
  "Apa satu pencapaian kecil belakangan ini yang bikin lu bangga sama diri sendiri, tapi jarang lu ceritain ke orang?",
  "Kalau lu lagi ngerasa jenuh banget sama rutinitas, comfort place atau kegiatan apa yang paling ampuh buat recharge energi lu?",
  "Menurut lu, seberapa penting peran orang lain dalam membantu kita melewati masa-masa sulit?",
  "Kalau nanti kita udah sama-sama sibuk dengan urusan masing-masing, apa hal yang pengen tetep kita jaga supaya tetep nyambung?",
  "Apa satu kualitas diri lu yang menurut lu paling sering disalahpahami sama orang lain?",
  "Apa satu hal yang paling lu hargai dari orang yang berusaha tulus buat nemenin lu?",
  "Music that reminds me of you: Apa lagu yang akhir-akhir ini bikin lu langsung kepikiran tentang gw pas lagi dengerin?"
];


/* 2. DOM REFERENCES
   Ambil semua elemen DOM yang dipakai berulang kali. */
const activeCard      = document.getElementById('activeCard');
const cardQuestion    = document.getElementById('cardQuestion');
const cardHint        = document.getElementById('cardHint');
const emptyState      = document.getElementById('emptyState');
const cardStage       = document.querySelector('.card-stage');
const ghost1          = document.querySelector('.ghost-1');
const ghost2          = document.querySelector('.ghost-2');

const btnNext         = document.getElementById('btnNext');
const btnPrev         = document.getElementById('btnPrev');
const btnReset        = document.getElementById('btnReset');

const progressBarFill  = document.getElementById('progressBarFill');
const progressBarTrack = document.getElementById('progressBarTrack');
const currentNumEl     = document.getElementById('currentNum');
const totalNumEl       = document.getElementById('totalNum');
const progressPercent  = document.getElementById('progressPercent');


/* 3. STATE
   Variabel yang menyimpan kondisi aplikasi saat ini. */
let deck         = [];    // array pertanyaan yang sudah di-shuffle
let currentIndex = -1;    // -1 berarti belum mulai, >= 0 adalah index kartu aktif
let isAnimating  = false; // mencegah klik ganda saat animasi sedang berjalan
let hasStarted   = false; // apakah tombol pertama sudah ditekan


/* 4. FISHER-YATES SHUFFLE
   Algoritma shuffle yang benar-benar acak dan tidak bias.
   Membuat salinan array agar array asli tidak termutasi. */
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


/* 5. STAR BACKGROUND GENERATOR
   Membuat elemen titik bintang secara acak dan menyisipkannya ke container. */
function generateStars() {
  const container = document.getElementById('starsContainer');
  const totalStars = 120;

  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const size     = Math.random() * 2 + 0.8;  // ukuran: 0.8px – 2.8px
    const top      = Math.random() * 100;
    const left     = Math.random() * 100;
    const duration = Math.random() * 4 + 2;    // durasi kedip: 2s – 6s
    const delay    = Math.random() * 5;
    const opacity  = Math.random() * 0.6 + 0.3; // opacity dasar: 0.3 – 0.9

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${top}%;
      left: ${left}%;
      --twinkle-duration: ${duration}s;
      --twinkle-delay: ${delay}s;
      --star-opacity: ${opacity};
    `;

    container.appendChild(star);
  }
}


/* 6. UPDATE PROGRESS
   Sinkronkan angka dan lebar progress bar dengan state saat ini. */
function updateProgress() {
  const total   = questions.length;
  const shown   = hasStarted ? currentIndex + 1 : 0;
  const percent = hasStarted ? Math.round((shown / total) * 100) : 0;

  currentNumEl.textContent        = shown;
  totalNumEl.textContent          = total;
  progressPercent.textContent     = `${percent}%`;
  progressBarFill.style.width     = `${percent}%`;
  progressBarTrack.setAttribute('aria-valuenow', percent);
}


/* 7. SHOW CARD
   Tampilkan pertanyaan di index tertentu dengan arah animasi yang sesuai.
   direction: 'forward' = animasi dari bawah, 'backward' = dari atas. */
function showCard(index, animate = true, direction = 'forward') {
  cardQuestion.textContent = deck[index];

  if (cardHint) cardHint.style.display = 'none';

  // Tombol Sebelumnya aktif hanya jika bukan kartu pertama
  btnPrev.disabled = (index <= 0);

  if (animate) {
    activeCard.classList.remove('card-enter', 'card-enter-reverse');
    void activeCard.offsetWidth; // paksa reflow agar animasi bisa di-restart
    activeCard.classList.add(direction === 'backward' ? 'card-enter-reverse' : 'card-enter');
  }

  updateGhosts(index);
  updateProgress();
}


/* 8. UPDATE GHOSTS
   Kurangi atau hilangkan ghost card sesuai sisa pertanyaan yang ada. */
function updateGhosts(currentIdx) {
  const remaining = deck.length - 1 - currentIdx;

  // ghost-1 tampil jika masih ada minimal 1 kartu tersisa
  ghost1.style.opacity   = remaining >= 1 ? '' : '0';
  ghost1.style.transform = remaining >= 1 ? '' : 'translateY(0) scale(1)';

  // ghost-2 tampil jika masih ada minimal 2 kartu tersisa
  ghost2.style.opacity   = remaining >= 2 ? '' : '0';
  ghost2.style.transform = remaining >= 2 ? '' : 'translateY(0) scale(1)';
}


/* 9. SHOW EMPTY STATE
   Tampilkan pesan selesai saat semua kartu sudah ditampilkan. */
function showEmptyState() {
  activeCard.classList.add('card-exit');

  setTimeout(() => {
    activeCard.style.visibility = 'hidden';
    ghost1.style.opacity        = '0';
    ghost2.style.opacity        = '0';
    cardStage.classList.add('is-empty');

    emptyState.classList.add('is-visible');
    emptyState.removeAttribute('aria-hidden');

    btnNext.disabled = true;
  }, 350);
}


/* 10. NEXT CARD
   Tampilkan kartu berikutnya. Kartu pertama langsung masuk tanpa animasi exit. */
function nextCard() {
  if (isAnimating) return;

  const nextIndex = currentIndex + 1;

  if (nextIndex >= deck.length) {
    showEmptyState();
    return;
  }

  isAnimating = true;

  if (!hasStarted) {
    hasStarted   = true;
    currentIndex = nextIndex;
    showCard(currentIndex, true, 'forward');
    isAnimating = false;

  } else {
    activeCard.classList.add('card-exit');

    setTimeout(() => {
      activeCard.classList.remove('card-exit');
      currentIndex = nextIndex;

      // Ubah label tombol saat ini adalah kartu terakhir
      if (currentIndex >= deck.length - 1) {
        btnNext.innerHTML = `
          <span>Kartu Terakhir</span>
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>`;
      }

      showCard(currentIndex, true, 'forward');
      isAnimating = false;
    }, 380);
  }
}


/* 11. PREV CARD
   Kembali ke kartu sebelumnya dengan animasi arah berlawanan. */
function prevCard() {
  if (isAnimating) return;
  if (currentIndex <= 0) return;

  isAnimating = true;

  activeCard.classList.add('card-exit-reverse');

  setTimeout(() => {
    activeCard.classList.remove('card-exit-reverse');
    currentIndex--;

    // Kembalikan label tombol Berikutnya jika sebelumnya sudah berubah
    btnNext.disabled = false;
    btnNext.innerHTML = `
      <span>Berikutnya</span>
      <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>`;

    showCard(currentIndex, true, 'backward');
    isAnimating = false;
  }, 380);
}


/* 12. RESET
   Kocok ulang semua kartu dan kembalikan tampilan ke kondisi awal. */
function resetDeck() {
  isAnimating  = false;
  hasStarted   = false;
  currentIndex = -1;

  deck = shuffleArray(questions);

  activeCard.classList.remove('card-exit', 'card-exit-reverse', 'card-enter', 'card-enter-reverse');
  activeCard.style.visibility = 'visible';

  cardQuestion.textContent = 'Siap membuka obrolan yang lebih dalam?';
  if (cardHint) cardHint.style.display = 'block';

  btnNext.disabled = false;
  btnNext.innerHTML = `
    <span>Berikutnya</span>
    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`;
  btnPrev.disabled = true;

  emptyState.classList.remove('is-visible');
  emptyState.setAttribute('aria-hidden', 'true');
  cardStage.classList.remove('is-empty');

  ghost1.style.opacity   = '';
  ghost1.style.transform = '';
  ghost2.style.opacity   = '';
  ghost2.style.transform = '';

  updateProgress();

  // Putar ikon reset sebagai feedback visual
  btnReset.classList.add('is-spinning');
  setTimeout(() => btnReset.classList.remove('is-spinning'), 500);

  void activeCard.offsetWidth;
  activeCard.classList.add('card-enter');
  setTimeout(() => activeCard.classList.remove('card-enter'), 500);
}


/* 13. SWIPE SUPPORT
   Swipe ke atas di area kartu untuk maju ke kartu berikutnya.
   Hanya trigger jika gerakan vertikal lebih dominan dari horizontal. */
let touchStartY = 0;
let touchStartX = 0;

activeCard.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

activeCard.addEventListener('touchend', (e) => {
  const deltaY = touchStartY - e.changedTouches[0].clientY;
  const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);

  if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > deltaX) {
    if (deltaY > 0) nextCard();
  }
}, { passive: true });


/* 14. KEYBOARD SHORTCUTS
   Panah kanan / Space / Enter  → kartu berikutnya
   Panah kiri                   → kartu sebelumnya
   R                            → reset */
document.addEventListener('keydown', (e) => {
  const isButtonFocused =
    document.activeElement === btnNext ||
    document.activeElement === btnPrev ||
    document.activeElement === btnReset;

  if (!isButtonFocused) {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextCard();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevCard();
    }
    if (e.key === 'r' || e.key === 'R') {
      resetDeck();
    }
  }
});


/* 15. EVENT LISTENERS */
btnNext.addEventListener('click', nextCard);
btnPrev.addEventListener('click', prevCard);
btnReset.addEventListener('click', resetDeck);


/* 16. INIT
   Jalankan satu kali saat halaman dimuat. */
function init() {
  generateStars();

  deck = shuffleArray(questions);

  if (cardHint) cardHint.style.display = 'block';
  cardQuestion.textContent = 'Siap membuka obrolan yang lebih dalam?';

  btnPrev.disabled       = true;
  totalNumEl.textContent = questions.length;
  updateProgress();

  void activeCard.offsetWidth;
  activeCard.classList.add('card-enter');
  setTimeout(() => activeCard.classList.remove('card-enter'), 500);

  console.log(`[HelloChat] ${questions.length} pertanyaan siap. ✦`);
}

init();
