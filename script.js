document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil Nama Tamu dari URL (?to=Bapak+Budi)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to");
    if (guestParam) {
        document.getElementById("guest-name").textContent = guestParam;
    }

    // 2. Buka Sampul Undangan & Putar Musik
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("main-content");
    const openBtn = document.getElementById("open-invitation");
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    let isPlaying = false;

    openBtn.addEventListener("click", () => {
        cover.classList.add("opened");
        mainContent.classList.remove("hidden");
        musicToggle.classList.remove("hidden");

        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add("playing");
        }).catch(() => {
            // Autoplay diblokir browser hingga user klik tombol musik
            isPlaying = false;
        });

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

    // 3. Hitung Mundur (Countdown) ke 24 Desember 2026
    const weddingDate = new Date("December 24, 2026 08:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<p>Acara Sedang Berlangsung</p>";
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

    // 4. Form RSVP & Ucapan
    const rsvpForm = document.getElementById("rsvp-form");
    const wishesList = document.getElementById("wishes-list");

    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("sender-name").value.trim();
        const status = document.getElementById("attendance").value;
        const message = document.getElementById("wish-message").value.trim();

        if (!name || !status || !message) return;

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

    // 5. Salin Nomor Rekening
    const copyBtns = document.querySelectorAll(".copy-btn");
    copyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const textToCopy = btn.getAttribute("data-copy");
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast("Nomor rekening berhasil disalin!");
            });
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

    // 6. Scroll Reveal Animation
    const reveals = document.querySelectorAll(".reveal");
    function triggerReveal() {
        const windowHeight = window.innerHeight;
        reveals.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                el.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", triggerReveal);

    // 7. Efek Partikel Cahaya Ethereal di Canvas
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
        constructor() {
            this.reset();
        }
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

    for (let i = 0; i < 45; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});
