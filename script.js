document.addEventListener("DOMContentLoaded", () => {
    // Elemen Utama
    const builderSection = document.getElementById("builder-section");
    const invitationApp = document.getElementById("invitation-app");
    const builderForm = document.getElementById("builder-form");
    const backToEditorBtn = document.getElementById("back-to-editor");
    const resetBuilderBtn = document.getElementById("reset-builder");

    // Elemen Sampul & Konten
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("main-content");
    const openBtn = document.getElementById("open-invitation");
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");

    let targetCountdownDate = new Date("2026-12-24T08:00:00").getTime();
    let isPlaying = false;

    // Default Foto
    const defaultGroomImg = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80";
    const defaultBrideImg = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";
    const defaultGalleryImgs = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80"
    ];

    let customGroomPhoto = defaultGroomImg;
    let customBridePhoto = defaultBrideImg;
    let customGalleryPhotos = [...defaultGalleryImgs];

    // 1. Cek Parameter URL (?to=Nama+Tamu & ?mode=view)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to");
    const modeParam = urlParams.get("mode");

    if (guestParam) {
        document.getElementById("guest-name").textContent = guestParam;
    }

    // Jika dibuka langsung oleh tamu dengan ?mode=view atau ?to=..., langsung tampilkan undangan
    if (modeParam === "view" || guestParam) {
        builderSection.classList.add("hidden");
        invitationApp.classList.remove("hidden");
    }

    // 2. Preview Upload Foto Instan (FileReader)
    document.getElementById("in-groom-photo").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => { customGroomPhoto = ev.target.result; };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById("in-bride-photo").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => { customBridePhoto = ev.target.result; };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById("in-gallery-photos").addEventListener("change", (e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        if (files.length > 0) {
            customGalleryPhotos = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (ev) => { customGalleryPhotos.push(ev.target.result); };
                reader.readAsDataURL(file);
            });
        }
    });

    // 3. Submit Form Builder -> Terapkan ke Template Undangan
    builderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Ambil nilai input
        const groomNick = document.getElementById("in-groom-nick").value.trim();
        const groomFull = document.getElementById("in-groom-full").value.trim();
        const groomParents = document.getElementById("in-groom-parents").value.trim();
        const groomIg = document.getElementById("in-groom-ig").value.trim();

        const brideNick = document.getElementById("in-bride-nick").value.trim();
        const brideFull = document.getElementById("in-bride-full").value.trim();
        const brideParents = document.getElementById("in-bride-parents").value.trim();
        const brideIg = document.getElementById("in-bride-ig").value.trim();

        const rawDate = document.getElementById("in-countdown-date").value;
        const dateText = document.getElementById("in-date-text").value.trim();
        const akadTime = document.getElementById("in-akad-time").value.trim();
        const resepsiTime = document.getElementById("in-resepsi-time").value.trim();
        const venueName = document.getElementById("in-venue-name").value.trim();
        const venueAddress = document.getElementById("in-venue-address").value.trim();
        const mapsUrl = document.getElementById("in-maps-url").value.trim();

        const verse = document.getElementById("in-verse").value.trim();
        const verseSource = document.getElementById("in-verse-source").value.trim();
        const bankName = document.getElementById("in-bank-name").value.trim();
        const bankNumber = document.getElementById("in-bank-number").value.trim();
        const bankHolder = document.getElementById("in-bank-holder").value.trim();

        // Update Judul Halaman & Sampul
        document.title = `The Wedding of ${groomNick} & ${brideNick}`;
        document.getElementById("out-cover-couple").textContent = `${groomNick} & ${brideNick}`;
        document.getElementById("out-footer-couple").textContent = `${groomNick} & ${brideNick}`;

        if (rawDate) {
            const d = new Date(rawDate);
            targetCountdownDate = d.getTime();
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            document.getElementById("out-cover-date").textContent = `${day} . ${month} . ${year}`;
        }

        // Update Hero & Kutipan
        document.getElementById("out-hero-groom").textContent = groomFull.split(",")[0];
        document.getElementById("out-hero-bride").textContent = brideFull.split(",")[0];
        document.getElementById("out-verse").textContent = verse;
        document.getElementById("out-verse-source").textContent = verseSource;

        // Update Profil Mempelai
        document.getElementById("out-groom-full").textContent = groomFull;
        document.getElementById("out-groom-parents").textContent = groomParents;
        document.getElementById("out-groom-ig").textContent = groomIg;
        document.getElementById("out-groom-photo").src = customGroomPhoto;

        document.getElementById("out-bride-full").textContent = brideFull;
        document.getElementById("out-bride-parents").textContent = brideParents;
        document.getElementById("out-bride-ig").textContent = brideIg;
        document.getElementById("out-bride-photo").src = customBridePhoto;

        // Update Detail Acara
        document.querySelectorAll(".out-date-text").forEach(el => el.textContent = dateText);
        document.getElementById("out-akad-time").textContent = akadTime;
        document.getElementById("out-resepsi-time").textContent = resepsiTime;
        document.querySelectorAll(".out-venue-name").forEach(el => el.textContent = venueName);
        document.querySelectorAll(".out-venue-address").forEach(el => el.textContent = venueAddress);
        document.querySelectorAll(".out-maps-url").forEach(el => el.href = mapsUrl || "https://maps.google.com");

        // Update Galeri
        const galleryGrid = document.getElementById("out-gallery-grid");
        galleryGrid.innerHTML = "";
        customGalleryPhotos.forEach((src, index) => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            item.innerHTML = `<img src="${src}" alt="Galeri ${index + 1}">`;
            galleryGrid.appendChild(item);
        });

        // Update Amplop Digital
        document.getElementById("out-bank-name").textContent = bankName;
        document.getElementById("out-bank-number").textContent = bankNumber;
        document.getElementById("out-bank-holder").textContent = bankHolder;
        document.getElementById("copy-rek-btn").setAttribute("data-copy", bankNumber);

        // Beralih ke Tampilan Undangan (Reset Cover agar bisa dibuka dari awal)
        builderSection.classList.add("hidden");
        invitationApp.classList.remove("hidden");
        cover.style.display = "flex";
        cover.classList.remove("opened");
        mainContent.classList.add("hidden");
        window.scrollTo(0, 0);

        showToast("Undangan berhasil diperbarui!");
    });

    // Tombol Kembali ke Editor
    backToEditorBtn.addEventListener("click", () => {
        invitationApp.classList.add("hidden");
        builderSection.classList.remove("hidden");
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove("playing");
        window.scrollTo(0, 0);
    });

    // Tombol Reset Form
    resetBuilderBtn.addEventListener("click", () => {
        builderForm.reset();
        customGroomPhoto = defaultGroomImg;
        customBridePhoto = defaultBrideImg;
        customGalleryPhotos = [...defaultGalleryImgs];
        showToast("Form dikembalikan ke pengaturan awal.");
    });

    // 4. Buka Sampul Undangan
    openBtn.addEventListener("click", () => {
        cover.classList.add("opened");
        mainContent.classList.remove("hidden");
        musicToggle.classList.remove("hidden");

        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add("playing");
        }).catch(() => { isPlaying = false; });

        setTimeout(() => {
            cover.style.display = "none";
            triggerReveal();
        }, 850);
    });

    musicToggle.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove("playing");
        } else {
            bgMusic.play();
            musicToggle.classList.add("playing");
        }
        isPlaying = !isPlaying;
    });

    // 5. Countdown Timer
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetCountdownDate - now;

        if (distance < 0) {
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. RSVP & Ucapan
    const rsvpForm = document.getElementById("rsvp-form");
    const wishesList = document.getElementById("wishes-list");

    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("sender-name").value.trim();
        const status = document.getElementById("attendance").value;
        const message = document.getElementById("wish-message").value.trim();

        const wishItem = document.createElement("div");
        wishItem.className = "wish-item";
        wishItem.innerHTML = `
            <div class="wish-header">
                <span>${escapeHTML(name)}</span>
                <span class="wish-badge">${escapeHTML(status)}</span>
            </div>
            <p>${escapeHTML(message)}</p>
        `;
        wishesList.prepend(wishItem);
        rsvpForm.reset();
        showToast("Terima kasih atas doa dan konfirmasi Anda!");
    });

    // 7. Salin Nomor Rekening & Modal Link Tamu
    document.getElementById("copy-rek-btn").addEventListener("click", function () {
        const rek = this.getAttribute("data-copy");
        navigator.clipboard.writeText(rek).then(() => showToast("Nomor rekening berhasil disalin!"));
    });

    const guestModal = document.getElementById("guest-modal");
    document.getElementById("share-guest-btn").addEventListener("click", () => {
        guestModal.classList.remove("hidden");
    });
    document.getElementById("close-guest-modal").addEventListener("click", () => {
        guestModal.classList.add("hidden");
    });
    document.getElementById("copy-guest-link").addEventListener("click", () => {
        const guestName = document.getElementById("custom-guest-input").value.trim() || "Tamu Undangan";
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?mode=view&to=${encodeURIComponent(guestName)}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Link untuk "${guestName}" berhasil disalin!`);
            guestModal.classList.add("hidden");
        });
    });

    function showToast(msg) {
        const toast = document.getElementById("toast");
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, (m) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[m]));
    }

    // 8. Scroll Reveal
    const reveals = document.querySelectorAll(".reveal");
    function triggerReveal() {
        const windowHeight = window.innerHeight;
        reveals.forEach((el) => {
            if (el.getBoundingClientRect().top < windowHeight - 80) {
                el.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", triggerReveal);

    // 9. Partikel Cahaya Ethereal Canvas
    const canvas = document.getElementById("ethereal-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(181, 154, 109, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 45; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});
