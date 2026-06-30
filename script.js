/**
 * =====================================================
 * HELLOCHAT — script.js
 * Logika Kartu Obrolan: Shuffle, Navigasi, Progress
 * =====================================================
 */

/* =====================================================
   1. DATA — Daftar Pertanyaan
   Semua pertanyaan dikumpulkan di satu tempat.
   Nambah pertanyaan? Cukup tambahkan di array ini.
   ===================================================== */
const questions = [
  // Kategori 1: Throwback (Nostalgia & Masa Lalu)
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

  // Kategori 2: Mind Unfolded (Logika & Cara Pandang)
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

  // Kategori 3: Connection & Future (Kedekatan & Support)
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

/* =====================================================
   2. DOM REFERENCES
   Ambil semua elemen DOM yang akan sering dipakai.
   ===================================================== */
const activeCard     = document.getElementById('activeCard');
const cardQuestion   = document.getElementById('cardQuestion');
const cardHint       = document.getElementById('cardHint');
const emptyState     = document.getElementById('emptyState');
const cardStage      = document.querySelector('.card-stage');
const ghost1         = document.querySelector('.ghost-1');
const ghost2         = document.querySelector('.ghost-2');

const btnNext        = document.getElementById('btnNext');
const btnPrev        = document.getElementById('btnPrev');
const btnReset       = document.getElementById('btnReset');

const progressBarFill = document.getElementById('progressBarFill');
const progressBarTrack = document.getElementById('progressBarTrack');
const currentNumEl    = document.getElementById('currentNum');
const totalNumEl      = document.getElementById('totalNum');
const progressPercent = document.getElementById('progressPercent');

/* =====================================================
   3. STATE — Status Aplikasi
   ===================================================== */
let deck         = [];   // Kartu yang sudah di-shuffle dan belum ditampilkan
let currentIndex = -1;   // -1 = belum mulai, >= 0 = index kartu yang sedang aktif
let isAnimating  = false; // Flag untuk mencegah spam klik saat animasi berjalan
let hasStarted   = false; // Apakah tombol pertama sudah ditekan

/* =====================================================
   4. FISHER-YATES SHUFFLE
   Algoritma shuffle yang merata dan tidak bias.
   Setiap permutasi memiliki probabilitas yang sama.
   ===================================================== */
function shuffleArray(arr) {
  const shuffled = [...arr]; // Buat salinan, jangan mutasi array asli
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  return shuffled;
}

/* =====================================================
   5. STAR BACKGROUND GENERATOR
   Membuat titik-titik bintang secara acak di background.
   ===================================================== */
function generateStars() {
  const container = document.getElementById('starsContainer');
  const totalStars = 120; // Jumlah bintang

  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Ukuran acak: 1px - 3px
    const size = Math.random() * 2 + 0.8;
    // Posisi acak di seluruh layar
    const top  = Math.random() * 100;
    const left = Math.random() * 100;
    // Kecepatan kedip acak: 2s - 6s
    const duration = Math.random() * 4 + 2;
    const delay    = Math.random() * 5;
    // Opacity dasar acak: 0.3 - 0.9
    const opacity  = Math.random() * 0.6 + 0.3;

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

/* =====================================================
   6. UPDATE PROGRESS
   Perbarui tampilan progress bar dan teks info.
   ===================================================== */
function updateProgress() {
  const total   = questions.length;
  const shown   = hasStarted ? currentIndex + 1 : 0;
  const percent = hasStarted ? Math.round((shown / total) * 100) : 0;

  // Update teks angka
  currentNumEl.textContent = shown;
  totalNumEl.textContent   = total;
  progressPercent.textContent = `${percent}%`;

  // Update progress bar fill
  progressBarFill.style.width = `${percent}%`;
  progressBarTrack.setAttribute('aria-valuenow', percent);
}

/* =====================================================
   7. SHOW CARD
   Tampilkan kartu pertanyaan sesuai index.
   Argumen `animate` mengontrol apakah ada animasi masuk.
   ===================================================== */
function showCard(index, animate = true, direction = 'forward') {
  const question = deck[index];

  // Update teks kartu
  cardQuestion.textContent = question;

  // Sembunyikan hint saat kartu sudah mulai
  if (cardHint) cardHint.style.display = 'none';

  // Update state tombol prev
  btnPrev.disabled = (index <= 0);

  // Animasi masuk: dari bawah (forward) atau dari atas (backward)
  if (animate) {
    activeCard.classList.remove('card-enter', 'card-enter-reverse');
    void activeCard.offsetWidth;
    activeCard.classList.add(direction === 'backward' ? 'card-enter-reverse' : 'card-enter');
  }

  // Update ghost visibility berdasarkan sisa kartu
  updateGhosts(index);
  // Update progress
  updateProgress();
}

/* =====================================================
   8. UPDATE GHOSTS
   Kartu ghost (tumpukan) di belakang: hilang jika sisa sedikit.
   ===================================================== */
function updateGhosts(currentIdx) {
  const remaining = deck.length - 1 - currentIdx; // Sisa kartu setelah kartu ini

  // Ghost 1 (langsung di belakang): tampil jika sisa >= 1
  ghost1.style.opacity    = remaining >= 1 ? '' : '0';
  ghost1.style.transform  = remaining >= 1 ? '' : 'translateY(0) scale(1)';

  // Ghost 2 (paling belakang): tampil jika sisa >= 2
  ghost2.style.opacity    = remaining >= 2 ? '' : '0';
  ghost2.style.transform  = remaining >= 2 ? '' : 'translateY(0) scale(1)';
}

/* =====================================================
   9. SHOW EMPTY STATE
   Tampilkan state saat semua pertanyaan sudah ditampilkan.
   ===================================================== */
function showEmptyState() {
  // Animasi exit kartu aktif
  activeCard.classList.add('card-exit');

  setTimeout(() => {
    // Sembunyikan kartu aktif dan ghost
    activeCard.style.visibility  = 'hidden';
    ghost1.style.opacity         = '0';
    ghost2.style.opacity         = '0';
    cardStage.classList.add('is-empty');

    // Tampilkan empty state
    emptyState.classList.add('is-visible');
    emptyState.removeAttribute('aria-hidden');

    // Nonaktifkan tombol Berikutnya
    btnNext.disabled = true;
  }, 350);
}

/* =====================================================
   10. NEXT CARD
   Logika utama: tampilkan kartu berikutnya atau
   empty state jika semua sudah ditampilkan.
   ===================================================== */
function nextCard() {
  // Cegah klik ganda saat animasi
  if (isAnimating) return;

  const nextIndex = currentIndex + 1;

  // Cek apakah masih ada kartu
  if (nextIndex >= deck.length) {
    showEmptyState();
    return;
  }

  isAnimating = true;

  if (!hasStarted) {
    // === PERTAMA KALI: Tidak ada animasi exit, langsung masuk ===
    hasStarted   = true;
    currentIndex = nextIndex;
    showCard(currentIndex, true, 'forward');

    isAnimating = false;

  } else {
    // === KARTU BERIKUTNYA: Animasi exit dulu, lalu masuk ===
    activeCard.classList.add('card-exit');

    setTimeout(() => {
      activeCard.classList.remove('card-exit');
      currentIndex = nextIndex;

      // Jika ini kartu terakhir, update teks tombol
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

/* =====================================================
   11. PREV CARD
   Kembali ke kartu sebelumnya.
   ===================================================== */
function prevCard() {
  if (isAnimating) return;
  if (currentIndex <= 0) return;

  isAnimating = true;

  // Animasi exit ke bawah
  activeCard.classList.add('card-exit-reverse');

  setTimeout(() => {
    activeCard.classList.remove('card-exit-reverse');
    currentIndex--;

    // Pastikan tombol Next normal kembali
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

/* =====================================================
   11. RESET
   Kocok ulang kartu dan mulai dari awal.
   ===================================================== */
function resetDeck() {
  isAnimating  = false;
  hasStarted   = false;
  currentIndex = -1;

  // Shuffle ulang deck
  deck = shuffleArray(questions);

  // Reset UI kartu aktif
  activeCard.classList.remove('card-exit', 'card-exit-reverse', 'card-enter', 'card-enter-reverse');
  activeCard.style.visibility = 'visible';

  // Reset teks kartu ke layar awal
  cardQuestion.textContent = 'Siap membuka obrolan yang lebih dalam?';
  if (cardHint) cardHint.style.display = 'block';

  // Reset tombol
  btnNext.disabled  = false;
  btnNext.innerHTML = `
    <span>Berikutnya</span>
    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`;
  btnPrev.disabled = true;

  // Sembunyikan empty state
  emptyState.classList.remove('is-visible');
  emptyState.setAttribute('aria-hidden', 'true');
  cardStage.classList.remove('is-empty');

  // Tampilkan kembali ghost
  ghost1.style.opacity   = '';
  ghost1.style.transform = '';
  ghost2.style.opacity   = '';
  ghost2.style.transform = '';

  // Reset progress bar
  updateProgress();

  // Animasi spin pada icon reset
  btnReset.classList.add('is-spinning');
  setTimeout(() => btnReset.classList.remove('is-spinning'), 500);

  // Animasi masuk untuk kartu welcome
  void activeCard.offsetWidth;
  activeCard.classList.add('card-enter');
  setTimeout(() => activeCard.classList.remove('card-enter'), 500);
}

/* =====================================================
   12. SWIPE SUPPORT (Touch Gesture)
   Pengguna bisa swipe ke atas untuk kartu berikutnya.
   Membuat UX lebih natural di mobile.
   ===================================================== */
let touchStartY = 0;
let touchStartX = 0;

activeCard.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

activeCard.addEventListener('touchend', (e) => {
  const deltaY = touchStartY - e.changedTouches[0].clientY;
  const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);

  // Hanya trigger jika swipe vertikal dominan dan cukup jauh (>50px)
  if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > deltaX) {
    if (deltaY > 0) {
      // Swipe ke atas → kartu berikutnya
      nextCard();
    }
  }
}, { passive: true });

/* =====================================================
   13. KEYBOARD SHORTCUT
   Space/Enter/ArrowRight → Kartu Berikutnya
   R → Reset
   ===================================================== */
document.addEventListener('keydown', (e) => {
  const isButtonFocused = document.activeElement === btnNext || document.activeElement === btnReset || document.activeElement === btnPrev;

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

/* =====================================================
   14. EVENT LISTENERS — Tombol
   ===================================================== */
btnNext.addEventListener('click', nextCard);
btnPrev.addEventListener('click', prevCard);
btnReset.addEventListener('click', resetDeck);

/* =====================================================
   15. INIT — Inisialisasi Aplikasi
   Jalankan saat halaman pertama kali dimuat.
   ===================================================== */
function init() {
  // Generate bintang background
  generateStars();

  // Shuffle kartu pertama kali
  deck = shuffleArray(questions);

  // Tampilkan hint di kartu welcome, sembunyikan card number
  if (cardHint) cardHint.style.display = 'block';
  cardQuestion.textContent = 'Siap membuka obrolan yang lebih dalam?';

  // Inisialisasi state tombol
  btnPrev.disabled = true;

  // Inisialisasi progress bar
  totalNumEl.textContent = questions.length;
  updateProgress();

  // Animasi masuk kartu welcome
  void activeCard.offsetWidth;
  activeCard.classList.add('card-enter');
  setTimeout(() => activeCard.classList.remove('card-enter'), 500);

  console.log(`[HelloChat] ${questions.length} pertanyaan siap, sudah di-shuffle! ✦`);
}

// Jalankan!
init();
