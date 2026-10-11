document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Audio Auto-play on user touch/click
    const bgMusic = document.getElementById("bgMusic");
    let hasInteracted = false;

    function playAudio() {
        if (!hasInteracted && bgMusic) {
            bgMusic.play().then(() => {
                hasInteracted = true;
            }).catch(e => console.log("Audio play deferred"));
        }
    }

    document.addEventListener("click", playAudio, { once: true });
    document.addEventListener("scroll", playAudio, { once: true });
    document.addEventListener("touchstart", playAudio, { once: true });

    // 2. Scratch Card Effect
    const canvas = document.getElementById("scratchCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        function initScratch() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;

            ctx.fillStyle = "#c5a059";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "bold 14px sans-serif";
            ctx.fillStyle = "#1a1a1a";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Scratch to reveal ✨", canvas.width / 2, canvas.height / 2);
        }

        initScratch();

        let isDrawing = false;

        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            let x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            let y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2, false);
            ctx.fill();
        }

        canvas.addEventListener("mousedown", (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener("mousemove", scratch);
        window.addEventListener("mouseup", () => { isDrawing = false; });

        canvas.addEventListener("touchstart", (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener("touchmove", scratch);
        window.addEventListener("touchend", () => { isDrawing = false; });
    }

    // 3. Countdown Timer (27 Nov 2026)
    const weddingDate = new Date('November 27, 2026 18:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('mins').innerText = String(minutes).padStart(2, '0');
            document.getElementById('secs').innerText = String(seconds).padStart(2, '0');
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
