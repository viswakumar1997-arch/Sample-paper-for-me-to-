document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Audio Playback & User Interaction Handler
    // Modern browsers block autoplay audio until the user interacts with the page (clicks or scrolls).
    const bgMusic = document.getElementById("bgMusic");
    let hasInteracted = false;

    function playAudio() {
        if (!hasInteracted && bgMusic) {
            bgMusic.play().then(() => {
                hasInteracted = true;
            }).catch(e => {
                console.log("Audio autoplay restricted by browser policy:", e);
            });
        }
    }

    // Listen for first interaction anywhere on the document
    document.addEventListener("click", playAudio, { once: true });
    document.addEventListener("scroll", playAudio, { once: true });
    document.addEventListener("touchstart", playAudio, { once: true });


    // 2. Scratch-Off Card Effect Implementation
    const canvas = document.getElementById("scratchCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const container = canvas.parentElement;

        // Set canvas resolution to match container size
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Fill the scratchable surface (silver/gold or dark overlay)
        ctx.fillStyle = "#c5a059"; // Matching theme accent color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some texture or instruction text on the scratch cover
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "#1a1a1a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Scratch to reveal ✨", canvas.width / 2, canvas.height / 2);

        let isDrawing = false;

        function scratch(e) {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            let x, y;

            if (e.type.includes("touch")) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }

            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2, false);
            ctx.fill();

            checkScratchPercentage();
        }

        // Event listeners for mouse scratching
        canvas.addEventListener("mousedown", (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener("mousemove", scratch);
        window.addEventListener("mouseup", () => { isDrawing = false; });

        // Event listeners for touch scratching (mobile phones)
        canvas.addEventListener("touchstart", (e) => { isDrawing = true; scratch(e); e.preventDefault(); });
        canvas.addEventListener("touchmove", (e) => { scratch(e); e.preventDefault(); });
        canvas.addEventListener("touchend", () => { isDrawing = false; });

        // Optional: Automatically clear the overlay if a lot of it is scratched
        function checkScratchPercentage() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let pixels = imageData.data;
            let transparentPixels = 0;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) {
                    transparentPixels++;
                }
            }

            let percentage = (transparentPixels / (pixels.length / 4)) * 100;
            if (percentage > 40) {
                // Fade out canvas completely once 40% is cleared
                canvas.style.transition = "opacity 0.5s ease";
                canvas.style.opacity = "0";
                setTimeout(() => { canvas.style.display = "none"; }, 500);
            }
        }
    }


    // 3. Countdown Timer to the Wedding Date (27 November 2026)
    const weddingDate = new Date('November 27, 2026 18:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const timerElements = document.querySelectorAll('#countdown strong');
            if (timerElements.length >= 4) {
                timerElements[0].innerText = String(days).padStart(2, '0');
                timerElements[1].innerText = String(hours).padStart(2, '0');
                timerElements[2].innerText = String(minutes).padStart(2, '0');
                timerElements[3].innerText = String(seconds).padStart(2, '0');
            }
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

});
