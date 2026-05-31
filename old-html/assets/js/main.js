// ===== MAIN.JS - Kelurahan Kedamin Hilir =====

document.addEventListener('DOMContentLoaded', function () {

  // --- Tanggal Hari Ini (Bahasa Indonesia) ---
  const hariList = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const bulanList = ['Januari','Februari','Maret','April','Mei','Juni',
                     'Juli','Agustus','September','Oktober','November','Desember'];
  const now = new Date();
  const tgl = `${hariList[now.getDay()]}, ${now.getDate()} ${bulanList[now.getMonth()]} ${now.getFullYear()}`;
  const elTgl = document.getElementById('tanggal-hari');
  if (elTgl) elTgl.textContent = tgl;

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // --- Scroll to Top Button ---
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active Nav Link (highlight current page) ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) {
      link.classList.add('text-green-700');
      link.classList.add('border-b-2');
      link.classList.add('border-green-600');
    }
  });

  // --- Lightbox for Gallery ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (src) {
          lightboxImg.src = src;
          lightbox.classList.add('active');
        }
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightbox-close') {
        lightbox.classList.remove('active');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }

  // --- Pengaduan Form Submission ---
  const pengaduanForm = document.getElementById('form-pengaduan');
  if (pengaduanForm) {
    pengaduanForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama  = document.getElementById('nama')?.value.trim();
      const pesan = document.getElementById('pesan')?.value.trim();
      if (!nama || !pesan) {
        showAlert('Harap isi semua kolom yang wajib diisi.', 'error');
        return;
      }
      showAlert('Pengaduan Anda berhasil dikirim. Terima kasih!', 'success');
      pengaduanForm.reset();
    });
  }

  // --- Simple Alert Helper ---
  function showAlert(message, type) {
    const alertEl = document.createElement('div');
    alertEl.className = `fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-semibold text-white transition-all
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    alertEl.textContent = message;
    document.body.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 4000);
  }

  // --- Counter Animation for Stats ---
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start).toLocaleString('id-ID');
    }, 16);
  }

  // Intersection Observer for stat counters
  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => observer.observe(el));
  }

  // --- Smooth reveal on scroll ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

});
