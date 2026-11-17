document.addEventListener("DOMContentLoaded", () => {
    const builderSection = document.getElementById("builder-section");
    const invitationApp = document.getElementById("invitation-app");
    const builderForm = document.getElementById("builder-form");
    const backToEditorBtn = document.getElementById("back-to-editor");
    const clearBuilderBtn = document.getElementById("clear-builder");

    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("main-content");
    const openBtn = document.getElementById("open-invitation");
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");

    let targetCountdownDate = null;
    let isPlaying = false;

    // Tidak ada foto otomatis; kosong total sampai user mengunggah file
    let uploadedGroomPhoto = "";
    let uploadedBridePhoto = "";
    let uploadedGalleryPhotos = [];

    // Pastikan seluruh form kosong saat halaman dimuat
    builderForm.reset();

    // Cek Parameter URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to");
    if (guestParam) {
        document.getElementById("guest-name").textContent = guestParam;
    }

    // Event Upload Foto Mempelai Pria
    document.getElementById("in-groom-photo").addEventListener("change", (e) => {
        const file = e.target.files[0];
        const statusEl = document.getElementById("status-groom-photo");
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                uploadedGroomPhoto = ev.target.result;
                statusEl.textContent = `Terpilih: ${file.name}`;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedGroomPhoto = "";
            statusEl.textContent = "Belum ada foto diunggah";
        }
    });

    // Event Upload Foto Mempelai Wanita
    document.getElementById("in-bride-photo").addEventListener("change", (e) => {
        const file = e.target.files[0];
        const statusEl = document.getElementById("status-bride-photo");
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                uploadedBridePhoto = ev.target.result;
                statusEl.textContent = `Terpilih: ${file.name}`;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedBridePhoto = "";
            statusEl.textContent = "Belum ada foto diunggah";
        }
    });

    // Event Upload Foto Galeri
    document.getElementById("in-gallery-photos").addEventListener("change", (e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        const statusEl = document.getElementById("status-gallery-photos");
        uploadedGalleryPhotos = [];

        if (files.length > 0) {
            statusEl.textContent = `${files.length} foto galeri dipilih`;
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    uploadedGalleryPhotos.push(ev.target.result);
                };
                reader.readAsDataURL(file);
            });
        } else {
            statusEl.textContent = "Belum ada foto diunggah";
        }
    });

    // Fungsi Render & Tampilkan Hasil Undangan
    function renderAndShowInvitation() {
        const groomNick = document.getElementById("in-groom-nick").value.trim() || "Mempelai Pria";
        const groomFull = document.getElementById("in-groom-full").value.trim() || groomNick;
        const groomParents = document.getElementById("in-groom-parents").value.trim();
        const groomIg = document.getElementById("in-groom-ig").value.trim();

        const brideNick = document.getElementById("in-bride-nick").value.trim() || "Mempelai Wanita";
        const brideFull = document.getElementById("in-bride-full").value.trim() || brideNick;
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

        // Update Sampul & Judul
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
        } else {
            targetCountdownDate = null;
            document.getElementById("out-cover-date").textContent = dateText;
        }

        // Update Hero & Kutipan
        document.getElementById("out-hero-groom").textContent = groomFull.split(",")[0];
        document.getElementById("out-hero-bride").textContent = brideFull.split(",")[0];

        const verseBox = document.getElementById("out-verse-box");
        if (verse) {
            verseBox.classList.remove("hidden");
            document.getElementById("out-verse").textContent = verse;
            const sourceWrap = document.getElementById("out-verse-source-wrap");
            if (verseSource) {
                sourceWrap.classList.remove("hidden");
                document.getElementById("out-verse-source").textContent = verseSource;
            } else {
                sourceWrap.classList.add("hidden");
            }
        } else {
            verseBox.classList.add("hidden");
        }

        // Update Mempelai Pria
        document.getElementById("out-groom-full").textContent = groomFull;
        document.getElementById("out-groom-parents").textContent = groomParents;

        const outGroomIg = document.getElementById("out-groom-ig");
        if (groomIg) {
            outGroomIg.classList.remove("hidden");
            outGroomIg.textContent = groomIg.startsWith("@") ? groomIg : `@${groomIg}`;
            outGroomIg.href = `https://instagram.com/${groomIg.replace("@", "")}`;
        } else {
            outGroomIg.classList.add("hidden");
        }

        const groomPhotoContainer = document.getElementById("groom-photo-container");
        const outGroomImg = document.getElementById("out-groom-photo");
        if (uploadedGroomPhoto) {
            outGroomImg.src = uploadedGroomPhoto;
            groomPhotoContainer.classList.remove("hidden");
        } else {
            outGroomImg.src = "";
            groomPhotoContainer.classList.add("hidden");
        }

        // Update Mempelai Wanita
        document.getElementById("out-bride-full").textContent = brideFull;
        document.getElementById("out-bride-parents").textContent = brideParents;

        const outBrideIg = document.getElementById("out-bride-ig");
        if (brideIg) {
            outBrideIg.classList.remove("hidden");
            outBrideIg.textContent = brideIg.startsWith("@") ? brideIg : `@${brideIg}`;
            outBrideIg.href = `https://instagram.com/${brideIg.replace("@", "")}`;
        } else {
            outBrideIg.classList.add("hidden");
        }

        const bridePhotoContainer = document.getElementById("bride-photo-container");
        const outBrideImg = document.getElementById("out-bride-photo");
        if (uploadedBridePhoto) {
            outBrideImg.src = uploadedBridePhoto;
            bridePhotoContainer.classList.remove("hidden");
        } else {
            outBrideImg.src = "";
            bridePhotoContainer.classList.add("hidden");
        }

        // Update Detail Acara
        document.querySelectorAll(".out-date-text").forEach(el => el.textContent = dateText);
        document.getElementById("out-akad-time").textContent = akadTime;
        document.getElementById("out-resepsi-time").textContent = resepsiTime;
        document.querySelectorAll(".out-venue-name").forEach(el => el.textContent = venueName);
        document.querySelectorAll(".out-venue-address").forEach(el => el.textContent = venueAddress);

        document.querySelectorAll(".out-maps-url").forEach(el => {
            if (mapsUrl) {
                el.href = mapsUrl;
                el.classList.remove("hidden");
            } else {
                el.classList.add("hidden");
            }
        });

        // Update Galeri Foto
        const gallerySection = document.getElementById("gallery-section");
        const galleryGrid = document.getElementById("out-gallery-grid");
        galleryGrid.innerHTML = "";
        if (uploadedGalleryPhotos.length > 0) {
            gallerySection.classList.remove("hidden");
            uploadedGalleryPhotos.forEach((src, index) => {
                const item = document.createElement("div");
                item.className = "gallery-item";
                item.innerHTML = `<img src="${src}" alt="Galeri ${index + 1}">`;
                galleryGrid.appendChild(item);
            });
        } else {
            gallerySection.classList.add("hidden");
        }

        // Update Amplop Digital
        const giftCardBox = document.getElementById("gift-card-box");
        if (bankName && bankNumber) {
            giftCardBox.classList.remove("hidden");
            document.getElementById("out-bank-name").textContent = bankName;
            document.getElementById("out-bank-number").textContent = bankNumber;
            document.getElementById("copy-rek-btn").setAttribute("data-copy", bankNumber);

            const holderWrap = document.getElementById("out-bank-holder-wrap");
            if (bankHolder) {
                holderWrap.classList.remove("hidden");
                document.getElementById("out-bank-holder").textContent = bankHolder;
            } else {
                holderWrap.classList.add("hidden");
            }
        } else {
            giftCardBox.classList.add("hidden");
        }

        // Beralih dari Form ke Hasil Undangan
        builderSection.classList.add("hidden");
        invitationApp.classList.remove("hidden");
        cover.style.display = "flex";
        cover.classList.remove("opened");
        mainContent.classList.add("hidden");
        updateCountdown();
        window.scrollTo(0, 0);

        showToast("Undangan siap ditampilkan!");
    }

    // Submit Form
    builderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        renderAndShowInvitation();
    });

    // Kembali ke Form Editor
    backToEditorBtn.addEventListener("click", () => {
        invitationApp.classList.add("hidden");
        builderSection.classList.remove("hidden");
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove("playing");
        window.scrollTo(0, 0);
    });

    // Kosongkan Semua Form
    clearBuilderBtn.addEventListener("click", () => {
        builderForm.reset();
        uploadedGroomPhoto = "";
        uploadedBridePhoto = "";
        uploadedGalleryPhotos = [];
        document.getElementById("status-groom-photo").textContent = "Belum ada foto diunggah";
        document.getElementById("status-bride-photo").textContent = "Belum ada foto diunggah";
        document.getElementById("status-gallery-photos").textContent = "Belum ada foto diunggah";
        showToast("Semua kolom dan foto telah dikosongkan.");
    });

    // Buka Sampul Undangan
    openBtn.addEventListener("click", () => {
        cover.classList.add("opened");
        mainContent.classList.remove("hidden");
        musicToggle.classList.remove("hidden");

        // Aktifkan langsung semua elemen reveal agar tidak ada yang tersembunyi
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("active"));

        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add("playing");
        }).catch(() => { isPlaying = false; });

        setTimeout(() => {
            cover.style.display = "none";
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

    // Countdown Timer
    const updateCountdown = () => {
        if (!targetCountdownDate) {
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }
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

    // RSVP & Ucapan
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

    // Salin Rekening & Link Tamu
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
        const shareUrl = `${baseUrl}?to=${encodeURIComponent(guestName)}`;
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

    // Partikel Cahaya Ethereal Canvas
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
