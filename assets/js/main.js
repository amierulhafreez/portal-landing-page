/**
 * Ekosistem Pendidikan CikguHafreez.my - Main Interactions
 * Modern, accessible vanilla JavaScript with fluid animations, carousel & modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Navbar Scroll Dynamics (High Refresh Rate 120Hz/ProMotion Throttled)
  const mainNav = document.getElementById('main-nav');
  let isScrolled = false;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 40;
        if (scrolled !== isScrolled) {
          isScrolled = scrolled;
          if (isScrolled) {
            mainNav?.classList.add('shadow-lg', 'bg-white/95');
            mainNav?.classList.remove('bg-white/80');
          } else {
            mainNav?.classList.remove('shadow-lg', 'bg-white/95');
            mainNav?.classList.add('bg-white/80');
          }
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Modal Controller
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    // Focus first input if available
    const firstInput = modal.querySelector('input, textarea, button');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  // Close modals on ESC key and backdrop click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.glass-modal-backdrop:not(.hidden)');
      openModals.forEach(modal => closeModal(modal.id));
    }
  });

  document.querySelectorAll('.glass-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // 5. Toast Notifications
  window.showToast = function(title, message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto max-w-md ${
      type === 'success' 
        ? 'bg-white/95 text-slate-900 border-emerald-200/80 shadow-emerald-500/10' 
        : 'bg-white/95 text-slate-900 border-blue-200/80 shadow-blue-500/10'
    }`;

    const icon = type === 'success' ? 'check-circle-2' : 'info';
    const iconColor = type === 'success' ? 'text-emerald-600' : 'text-apple-blue';

    toast.innerHTML = `
      <div class="flex-shrink-0 ${iconColor}">
        <i data-lucide="${icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 text-sm">
        <p class="font-semibold text-slate-900">${title}</p>
        <p class="text-slate-500 text-xs mt-0.5">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 p-1" aria-label="Tutup notifikasi">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  };

  // 6. Handle Collaboration Form Submission
  const contactForm = document.getElementById('collab-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('collab-nama')?.value || 'Tuan/Puan';
      const institusi = document.getElementById('collab-institusi')?.value || 'Institusi';
      const topik = document.getElementById('collab-topik')?.value || 'Bengkel / Jemputan';
      const emel = document.getElementById('collab-emel')?.value || '';
      const nota = document.getElementById('collab-nota')?.value || '';

      const mailtoUrl = `mailto:amierulhafreez@gmail.com?subject=${encodeURIComponent(`[Jemputan/Kolaborasi] ${topik} - ${institusi}`)}&body=${encodeURIComponent(`Salam hormat Cikgu Hafreez,\n\nNama: ${nama}\nInstitusi: ${institusi}\nEmel: ${emel}\nTopik / Hasrat: ${topik}\n\nButiran:\n${nota}\n\nTerima kasih.`)}`;
      
      closeModal('collab-modal');
      contactForm.reset();

      showToast(
        'Permintaan Diterima!',
        `Terima kasih ${nama}. Anda juga boleh menyemak draf emel terus ke amierulhafreez@gmail.com.`
      );

      setTimeout(() => {
        window.open(mailtoUrl, '_blank');
      }, 900);
    });
  }

  // 7. Handle Feedback Form Submission
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const app = document.getElementById('feedback-app')?.value || 'Aplikasi';
      closeModal('feedback-modal');
      feedbackForm.reset();

      showToast(
        'Maklum Balas Dihantar!',
        `Terima kasih atas pandangan anda untuk ${app}. Kami komited meningkatkan kualiti inovasi ini.`
      );
    });
  }

  // 8. Certificate Viewer Controller
  const certData = {
    'gemini': {
      title: 'Gemini Certified Educator',
      issuer: 'Google for Education',
      validity: 'Sah: 2026 – 2029 (3 Tahun)',
      src: 'assets/certs/cert-gemini.png',
      badge: 'assets/certs/badge-gemini.png',
      verifyUrl: 'https://www.credential.net/50464e62-eff5-4a73-9ef8-582cbc953e3f',
      desc: 'Mengesahkan penguasaan asas kecerdasan buatan (Generative AI) serta keupayaan memanfaatkan model Gemini dalam pedagogi dan persediaan PdP.'
    },
    'google-l1': {
      title: 'Google Certified Educator Level 1',
      issuer: 'Google for Education',
      validity: 'Sah: 2026 – 2029 (36 Bulan)',
      src: 'assets/certs/cert-google-l1.png',
      badge: 'assets/certs/badge-google-l1.png',
      verifyUrl: 'https://www.credential.net/55e08e7c-2a0f-4b68-9b90-51092dc9e1e4',
      desc: 'Pengesahan kemahiran asas dan standard integrasi peralatan Google Workspace for Education dalam bilik darjah moden.'
    },
    'google-l2': {
      title: 'Google Certified Educator Level 2',
      issuer: 'Google for Education',
      validity: 'Sah: 2026 – 2029 (36 Bulan)',
      src: 'assets/certs/cert-google-l2.png',
      badge: 'assets/certs/badge-google-l2.png',
      verifyUrl: 'https://www.credential.net/db8cbb79-ae2a-40a6-b07c-9598ac74a66b',
      desc: 'Pengiktirafan tahap lanjutan (Super User) untuk integrasi teknologi canggih Google dalam pengajaran dan pembelajaran terbeza.'
    },
    'apple': {
      title: 'Apple Teacher',
      issuer: 'Apple Inc.',
      validity: 'Certificate of Recognition',
      src: 'assets/certs/cert-apple-teacher.png',
      badge: 'assets/certs/badge-apple-teacher.svg',
      verifyUrl: 'https://www.apple.com/education/k12/apple-teacher/',
      desc: 'Pengiktirafan profesional oleh Apple bagi kemahiran mengintegrasikan iPad, Mac, dan perisian Apple untuk membina pengalaman pembelajaran kreatif.'
    }
  };

  window.openCertModal = function(certKey) {
    let key = certKey;
    if (key === 'google') key = 'google-l1';

    const cert = certData[key];
    if (!cert) return;

    const imgEl = document.getElementById('cert-modal-img');
    const titleEl = document.getElementById('cert-modal-title');
    const issuerEl = document.getElementById('cert-modal-issuer');
    const validityEl = document.getElementById('cert-modal-validity');
    const descEl = document.getElementById('cert-modal-desc');
    const verifyLink = document.getElementById('cert-modal-verify-link');
    const toggleContainer = document.getElementById('cert-modal-toggle');

    if (imgEl) imgEl.src = cert.src;
    if (titleEl) titleEl.textContent = cert.title;
    if (issuerEl) issuerEl.textContent = cert.issuer;
    if (validityEl) validityEl.textContent = cert.validity;
    if (descEl) descEl.textContent = cert.desc;
    if (verifyLink) {
      verifyLink.href = cert.verifyUrl;
      verifyLink.style.display = cert.verifyUrl ? 'inline-flex' : 'none';
    }

    // Show Google Level 1/2 switcher tabs if viewing google
    if (toggleContainer) {
      if (key === 'google-l1' || key === 'google-l2') {
        toggleContainer.classList.remove('hidden');
        toggleContainer.classList.add('flex');
        updateGoogleToggleUI(key);
      } else {
        toggleContainer.classList.add('hidden');
        toggleContainer.classList.remove('flex');
      }
    }

    openModal('cert-modal');
  };

  window.switchGoogleLevel = function(levelKey) {
    const cert = certData[levelKey];
    if (!cert) return;

    const imgEl = document.getElementById('cert-modal-img');
    const titleEl = document.getElementById('cert-modal-title');
    const descEl = document.getElementById('cert-modal-desc');
    const validityEl = document.getElementById('cert-modal-validity');
    const verifyLink = document.getElementById('cert-modal-verify-link');

    if (imgEl) imgEl.src = cert.src;
    if (titleEl) titleEl.textContent = cert.title;
    if (descEl) descEl.textContent = cert.desc;
    if (validityEl) validityEl.textContent = cert.validity;
    if (verifyLink) verifyLink.href = cert.verifyUrl;

    updateGoogleToggleUI(levelKey);
  };

  function updateGoogleToggleUI(activeKey) {
    const btnL1 = document.getElementById('cert-toggle-l1');
    const btnL2 = document.getElementById('cert-toggle-l2');
    if (!btnL1 || !btnL2) return;

    if (activeKey === 'google-l1') {
      btnL1.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-apple-blue text-white shadow-sm transition-all';
      btnL2.className = 'px-3 py-1 rounded-full text-xs font-semibold text-apple-secondary hover:text-apple-slate transition-all';
    } else {
      btnL2.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-apple-blue text-white shadow-sm transition-all';
      btnL1.className = 'px-3 py-1 rounded-full text-xs font-semibold text-apple-secondary hover:text-apple-slate transition-all';
    }
  }

  // 9. Interactive Gallery Carousel Data & Controller (20 Curated Photos)
  const allGalleryItems = [
    // --- Kategori: Inovasi i-MARATeCH (3 Foto) ---
    {
      src: 'assets/gallery/galeri-imaratech-emas.jpg',
      category: 'imaratech',
      categoryName: 'Inovasi i-MARATeCH',
      title: 'Pingat Emas & Johan i-MARATeCH 2026',
      caption: 'Penyampaian Anugerah Pingat Emas (RM 3,500.00) i-MARATeCH 2026 Kategori Inovasi ABM bagi Simulasi Kimia Cikgu Hafreez, MRSM Bagan Datuk.'
    },
    {
      src: 'assets/gallery/galeri-imaratech-booth.jpg',
      category: 'imaratech',
      categoryName: 'Inovasi i-MARATeCH',
      title: 'Demonstrasi Interaktif Reruai Simulasi Kimia',
      caption: 'Sesi demonstrasi langsung makmal maya Simulasi Kimia kepada panel penilai dan pengunjung di reruai pameran i-MARATeCH 2026.'
    },
    {
      src: 'assets/gallery/galeri-imaratech-vip.jpg',
      category: 'imaratech',
      categoryName: 'Inovasi i-MARATeCH',
      title: 'Penerangan Inovasi kepada Pengerusi MARA',
      caption: 'Taklimat ekosistem inovasi digital Kimia kepada YB Datuk Seri Dr Asyraf Wajdi Dusuki, Pengerusi MARA dan delegasi kepimpinan tertinggi.'
    },

    // --- Kategori: Bengkel & Pendidik (6 Foto) ---
    {
      src: 'assets/gallery/galeri-uitm-puncak-alam.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Jalinan Kerjasama Antara MRSM Bagan Datuk Bersama UiTM Puncak Alam',
      caption: 'Sesi jalinan kerjasama antara MRSM Bagan Datuk bersama Fakulti Pendidikan UiTM Puncak Alam dalam pemerkasaan pedagogi, penyelidikan STEM, dan inovasi pendidikan.'
    },
    {
      src: 'assets/gallery/galeri-bengkel-modul-mara.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Bengkel Pemurnian Modul Kimia SPM MARA',
      caption: 'Sidang meja bulat pembinaan dan pemurnian Modul Kimia SPM MARA (Alchemy Booster) bersama panel guru pakar Kimia MRSM se-Malaysia.'
    },
    {
      src: 'assets/gallery/galeri-stem-quranic.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Panel Penulis Modul STEM Quranic Ulul Albab',
      caption: 'Sidang pakar pembangunan modul integrasi sains dan Al-Quran bagi kurikulum khas MRSM Ulul Albab.'
    },
    {
      src: 'assets/gallery/galeri-plc-kimia.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Komuniti Pembelajaran Profesional (PLC) Kimia',
      caption: 'Sesi perkongsian amalan terbaik PLC berfokuskan bedah siasat dan analisis soalan Kertas 2 Kimia SPM.'
    },
    {
      src: 'assets/gallery/galeri-petronas-inovasi.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Seminar Amalan Inovasi Yayasan PETRONAS',
      caption: 'Perkongsian amalan inovasi digital guru dalam memperkasa pedagogi STEM berimpak tinggi bersama Yayasan PETRONAS.'
    },
    {
      src: 'assets/gallery/galeri-guru-maktab.jpg',
      category: 'bengkel',
      categoryName: 'Bengkel & Pendidik',
      title: 'Jaringan Profesionalisme Pendidik Sains',
      caption: 'Kolaborasi rentas maktab bersama rakan pendidik sains dan kimia bagi memperkukuh standard kurikulum kebangsaan.'
    },

    // --- Kategori: Aktiviti Pelajar & PdP (8 Foto) ---
    {
      src: 'assets/gallery/galeri-sdar-pelajar.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Program Kecemerlangan Kimia SPM di SDAR',
      caption: 'Bengkel pemantapan konsep dan teknik skor Kimia SPM bersama para pelajar Sekolah Dato\' Abdul Razak (SDAR).'
    },
    {
      src: 'assets/gallery/galeri-spark-chemistry.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Spark Chemistry: Kolaborasi MRSM x SBP 2026',
      caption: 'Program bimbingan intensif dan pengukuhan konstruk peperiksaan Kimia SPM menggabungkan pelajar MRSM dan SBP.'
    },
    {
      src: 'assets/gallery/galeri-modul-struktur.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Bengkel Teknik Menjawab Soalan Struktur SPM',
      caption: 'Bimbingan langkah demi langkah menguasai soalan struktur dan kata kunci pemarkahan Kertas 2 Kimia SPM.'
    },
    {
      src: 'assets/gallery/galeri-sesma-kolaborasi.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Kolaborasi Akademik Kimia di Dewan Utama SESMA',
      caption: 'Sesi perkongsian strategi menjawab soalan SPM bersama ratusan calon peperiksaan di Dewan Utama SESMA Terengganu.'
    },
    {
      src: 'assets/gallery/galeri-pusat-sumber.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Literasi Digital Sains di Pusat Sumber Pembelajaran',
      caption: 'Aktiviti penerokaan sumber digital dan makmal maya secara berpandu bersama para pelajar di pusat sumber.'
    },
    {
      src: 'assets/gallery/galeri-modul-albab.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Bengkel Modul Sains & Al-Quran Ulul Albab',
      caption: 'Sesi perbincangan mendalam pembangunan konstruk bahan ajar bertema ubat-ubatan tradisional dan moden berasaskan STEM Quranic.'
    },
    {
      src: 'assets/gallery/galeri-klinik-kimia.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Klinik Bimbingan Berfokus Menjelang SPM',
      caption: 'Sesi bimbingan intensif dalam kumpulan kecil bagi memperkukuh topik-topik kritikal Kimia Tingkatan 4 dan 5.'
    },
    {
      src: 'assets/gallery/galeri-kadet-pelajar.jpg',
      category: 'pdp',
      categoryName: 'Aktiviti Pelajar & PdP',
      title: 'Program Pembangunan Sahsiah & Disiplin Pelajar',
      caption: 'Kebersamaan bersama para pelajar dalam aktiviti kepimpinan dan pembangunan karakter holistik anak maktab.'
    },

    // --- Kategori: Sukan & Komuniti Maktab (3 Foto) ---
    {
      src: 'assets/gallery/galeri-sidang-redaksi.jpg',
      category: 'komuniti',
      categoryName: 'Sukan & Komuniti Maktab',
      title: 'Meraikan Pelajar Sidang Redaksi Yang Terlibat Secara Langsung Dengan Aktiviti Pendigitalan Maktab',
      caption: 'Meraikan pelajar Sidang Redaksi yang terlibat secara langsung dengan aktiviti pendigitalan maktab, dokumentasi media, dan penerbitan kreatif rasmi.'
    },
    {
      src: 'assets/gallery/galeri-bola-tampar-lelaki.jpg',
      category: 'komuniti',
      categoryName: 'Sukan & Komuniti Maktab',
      title: 'Kejohanan Sukan: Pasukan Bola Tampar Mabda Maverick',
      caption: 'Penglibatan aktif dalam sukan bola tampar staf menyemarakkan budaya hidup sihat, kesukanan dan ukhuwah warga maktab.'
    },
    {
      src: 'assets/gallery/galeri-hari-inovasi-mabda.jpg',
      category: 'komuniti',
      categoryName: 'Sukan & Komuniti Maktab',
      title: 'Majlis Anugerah Hari Inovasi MABDA',
      caption: 'Penghargaan peringkat maktab atas usaha menggerakkan transformasi pendidikan digital dan penciptaan alat bantu mengajar.'
    }
  ];

  let currentCategory = 'all';
  let filteredItems = [...allGalleryItems];
  let currentCarouselIndex = 0;
  let autoplayTimer = null;
  let isAutoplayActive = false; // Paused on default per user request

  function renderCarousel() {
    filteredItems = currentCategory === 'all' 
      ? allGalleryItems 
      : allGalleryItems.filter(item => item.category === currentCategory);

    if (currentCarouselIndex >= filteredItems.length) {
      currentCarouselIndex = 0;
    }

    updateSlideContent();
    renderThumbnails();
  }

  function updateSlideContent() {
    const item = filteredItems[currentCarouselIndex];
    if (!item) return;

    const imgEl = document.getElementById('carousel-main-img');
    const catEl = document.getElementById('carousel-tag');
    const titleEl = document.getElementById('carousel-title');
    const captionEl = document.getElementById('carousel-caption');
    const counterEl = document.getElementById('carousel-counter');

    if (imgEl) {
      imgEl.style.opacity = '0.5';
      setTimeout(() => {
        imgEl.src = item.src;
        imgEl.alt = item.title;
        imgEl.style.opacity = '1';
      }, 120);
    }

    if (catEl) catEl.textContent = item.categoryName;
    if (titleEl) titleEl.textContent = item.title;
    if (captionEl) captionEl.textContent = item.caption;
    if (counterEl) counterEl.textContent = `${currentCarouselIndex + 1} / ${filteredItems.length}`;

    // Highlight active thumbnail and scroll into view smoothly
    const allThumbBtns = document.querySelectorAll('.carousel-thumb-btn');
    allThumbBtns.forEach((btn, idx) => {
      if (idx === currentCarouselIndex) {
        btn.classList.add('border-apple-blue', 'scale-105', 'shadow-md');
        btn.classList.remove('border-transparent', 'opacity-60');
        // Auto center active thumbnail on mobile / desktop
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('border-apple-blue', 'scale-105', 'shadow-md');
        btn.classList.add('border-transparent', 'opacity-60');
      }
    });
  }

  function renderThumbnails() {
    const container = document.getElementById('carousel-thumbs-container');
    if (!container) return;

    container.innerHTML = '';
    filteredItems.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = `carousel-thumb-btn flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        index === currentCarouselIndex ? 'border-apple-blue scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
      }`;
      btn.setAttribute('aria-label', `Papar foto: ${item.title}`);
      btn.innerHTML = `<img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" class="w-full h-full object-cover pointer-events-none">`;
      btn.addEventListener('click', () => {
        currentCarouselIndex = index;
        updateSlideContent();
        resetAutoplay();
      });
      container.appendChild(btn);
    });
  }

  window.carouselNext = function() {
    if (filteredItems.length === 0) return;
    currentCarouselIndex = (currentCarouselIndex + 1) % filteredItems.length;
    updateSlideContent();
    resetAutoplay();
  };

  window.carouselPrev = function() {
    if (filteredItems.length === 0) return;
    currentCarouselIndex = (currentCarouselIndex - 1 + filteredItems.length) % filteredItems.length;
    updateSlideContent();
    resetAutoplay();
  };

  window.filterGallery = function(cat) {
    currentCategory = cat;
    currentCarouselIndex = 0;

    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      if (btn.dataset.category === cat) {
        btn.className = 'gallery-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-apple-blue border border-apple-blue text-white shadow-md transition-all cursor-pointer';
      } else {
        btn.className = 'gallery-filter-btn px-4 py-2 rounded-full text-xs font-semibold bg-white/80 border border-white/90 text-apple-secondary hover:text-apple-slate hover:bg-white shadow-sm transition-all cursor-pointer';
      }
    });

    renderCarousel();
    resetAutoplay();
  };

  window.openCarouselLightbox = function() {
    const item = filteredItems[currentCarouselIndex];
    if (!item) return;

    const imgEl = document.getElementById('gallery-modal-img');
    const capEl = document.getElementById('gallery-modal-caption');
    const countEl = document.getElementById('gallery-modal-count');

    if (imgEl) imgEl.src = item.src;
    if (capEl) capEl.textContent = `${item.title} — ${item.caption}`;
    if (countEl) countEl.textContent = `${currentCarouselIndex + 1} / ${filteredItems.length}`;

    openModal('gallery-modal');
  };

  window.openGallery = function(index = 0) {
    if (index >= 0 && index < filteredItems.length) {
      currentCarouselIndex = index;
      updateSlideContent();
    }
    openCarouselLightbox();
  };

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    if (!isAutoplayActive) return;
    autoplayTimer = setInterval(() => {
      if (isAutoplayActive) {
        carouselNext();
      }
    }, 5000);
  }

  function resetAutoplay() {
    if (isAutoplayActive) {
      startAutoplay();
    }
  }

  window.toggleAutoplay = function() {
    isAutoplayActive = !isAutoplayActive;
    if (isAutoplayActive) {
      startAutoplay();
    } else {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
    const btn = document.getElementById('carousel-autoplay-btn');
    if (btn) {
      btn.innerHTML = isAutoplayActive 
        ? '<i data-lucide="pause" class="w-3.5 h-3.5"></i> <span>Jeda</span>' 
        : '<i data-lucide="play" class="w-3.5 h-3.5"></i> <span>Main</span>';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // Keyboard navigation for carousel & modal
  document.addEventListener('keydown', (e) => {
    const galleryModalOpen = !document.getElementById('gallery-modal')?.classList.contains('hidden');
    if (e.key === 'ArrowRight') {
      if (galleryModalOpen) {
        window.nextGalleryItem?.();
      } else {
        carouselNext();
      }
    } else if (e.key === 'ArrowLeft') {
      if (galleryModalOpen) {
        window.prevGalleryItem?.();
      } else {
        carouselPrev();
      }
    }
  });

  // Lightbox previous/next synced with carousel items
  window.nextGalleryItem = function() {
    carouselNext();
    const item = filteredItems[currentCarouselIndex];
    const imgEl = document.getElementById('gallery-modal-img');
    const capEl = document.getElementById('gallery-modal-caption');
    const countEl = document.getElementById('gallery-modal-count');
    if (imgEl && item) imgEl.src = item.src;
    if (capEl && item) capEl.textContent = `${item.title} — ${item.caption}`;
    if (countEl) countEl.textContent = `${currentCarouselIndex + 1} / ${filteredItems.length}`;
  };

  window.prevGalleryItem = function() {
    carouselPrev();
    const item = filteredItems[currentCarouselIndex];
    const imgEl = document.getElementById('gallery-modal-img');
    const capEl = document.getElementById('gallery-modal-caption');
    const countEl = document.getElementById('gallery-modal-count');
    if (imgEl && item) imgEl.src = item.src;
    if (capEl && item) capEl.textContent = `${item.title} — ${item.caption}`;
    if (countEl) countEl.textContent = `${currentCarouselIndex + 1} / ${filteredItems.length}`;
  };

  // Touch Swipe Gesture Handler (iPhone, iPad, Android, Windows Touch)
  function attachTouchSwipe(elementId, onSwipeLeft, onSwipeRight) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let touchStartX = 0;
    let touchStartY = 0;

    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        // Require horizontal swipe of at least 35px with minimal vertical movement
        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          if (deltaX < 0) {
            onSwipeLeft();
          } else {
            onSwipeRight();
          }
        }
      }
    }, { passive: true });
  }

  attachTouchSwipe('carousel-main-frame', () => carouselNext(), () => carouselPrev());
  attachTouchSwipe('gallery-modal', () => window.nextGalleryItem?.(), () => window.prevGalleryItem?.());

  // Initialize carousel on load (paused by default on page load)
  renderCarousel();

  // 10. Hardware-Accelerated 60/120Hz Tilt for Bento Cards
  // Only enabled on precision pointers (desktop/mouse), disabled on touchscreens
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      let rafId = null;
      card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -2;
          const rotateY = ((x - centerX) / centerX) * 2;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      });
    });
  }
});
