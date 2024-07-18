document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let progress = 0;
    let tapText = [];
    let tapTimer = 0;
    let coinCount = 0;
    let taps = 1000;
    let speed = 2;
    let isTapping = false;
    let frameCounter = 0;
    let frameIndex = 0;

    const coinSize = 100;
    const camelWidth = 1080 / 1.8;
    const camelHeight = 1920 / 1.8;

    const trackImg = new Image();
    trackImg.src = 'textures/track.png';

    const coinFrames = [];
    const loadCoinFrame = (i) => {
        const img = new Image();
        img.src = `textures/Coins/coin_${String(i).padStart(4, '0')}.png`;
        coinFrames.push(img);
    };
    for (let i = 1; i <= 25; i++) {
        loadCoinFrame(i);
    }

    const camelFrames = [];
    const loadCamelFrame = (i) => {
        const img = new Image();
        img.src = `textures/camel/camel_run_${i}.png`;
        camelFrames.push(img);
    };
    for (let i = 1; i <= 14; i++) {
        loadCamelFrame(i);
    }

    let lanes = [
        canvas.width * 0.5,
        canvas.width * 0.5,
        canvas.width * 0.5,
        canvas.width * 0.5,
        canvas.width * 0.5
    ];
    let currentLane = 1;
    let coinSpawnTimer = 0;
    const coins = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        lanes = [
            canvas.width * 0.40,
            canvas.width * 0.45,
            canvas.width * 0.50,
            canvas.width * 0.55,
            canvas.width * 0.60
        ];
    }
    window.addEventListener('resize', resizeCanvas);

    function drawTrack() {
        ctx.drawImage(trackImg, 0, 0, canvas.width, canvas.height);
    }

    function drawCamel() {
        const camelScale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
        const scaledCamelWidth = camelWidth * camelScale;
        const scaledCamelHeight = camelHeight * camelScale;
        ctx.drawImage(camelFrames[frameIndex], lanes[currentLane] - scaledCamelWidth / 2.5, canvas.height - scaledCamelHeight - 5, scaledCamelWidth, scaledCamelHeight);
    }

    function spawnCoin() {
        if (coinSpawnTimer <= 0) {
            const numCoins = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numCoins; i++) {
                const startX = canvas.width / 2;
                const startY = canvas.height / 1.6;
                const laneIndex = Math.floor(Math.random() * lanes.length);
                coins.push({ startX: startX, startY: startY, endX: lanes[laneIndex], laneIndex: laneIndex, y: startY, frameIndex: 0, scale: 0.2 });
            }
            coinSpawnTimer = 60;
        }
        coinSpawnTimer--;
    }

    function drawCoins() {
        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            coin.y += speed;
            coin.scale = Math.min(1, coin.scale + 0.01);

            const t = (coin.y - coin.startY) / (canvas.height - coin.startY);
            const endX = lanes[coin.laneIndex];
            const x = coin.startX + t * (endX - coin.startX) * (4 + t);

            const coinSizeScaled = coinSize * coin.scale;
            coin.x = x;
            ctx.drawImage(coinFrames[coin.frameIndex], x - coinSizeScaled / 2, coin.y - coinSizeScaled / 2, coinSizeScaled, coinSizeScaled);
            coin.frameIndex++;
            if (coin.frameIndex >= coinFrames.length) coin.frameIndex = 0;
            if (coin.y > canvas.height) {
                coins.splice(i, 1);
                i--;
            }
        }
    }

    function drawTapText() {
        ctx.font = "3vh 'LilitaOne-Regular'";
        ctx.fillStyle = "white";
        for (let i = 0; i < tapText.length; i++) {
            const tap = tapText[i];
            ctx.globalAlpha = tap.opacity;
            ctx.fillText(tap.text, tap.x, tap.y);
            ctx.globalAlpha = 1;
            tap.y -= 2;
            tap.opacity -= 0.02;
            if (tap.opacity <= 0) {
                tapText.splice(i, 1);
                i--;
            }
        }
    }

    function updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const playerIcon = document.getElementById('player-icon');
        const progressText = document.getElementById('progress-text');
        const progressBackground = document.querySelector('.progress-background');
        const progressBarHeight = progressBar.clientHeight;

        progressText.style.color = 'white';
        progressText.style.fontFamily = 'LilitaOne-Regular';

        const progressHeight = (progress / 100) * progressBarHeight;
        if (playerIcon) {
            playerIcon.style.bottom = `${progressHeight}px`;
        }
        if (progressText) {
            progressText.style.bottom = `${progressHeight}px`;
        }
        if (progressBackground) {
            progressBackground.style.bottom = `${progressHeight}px`;
        }
        if (progressText) {
            progressText.innerText = `${Math.floor(progress)}%`;
        }

        console.log(`Progress: ${progress}, Progress Height: ${progressHeight}`);
        if (progress >= 100) {
            progress = 100;
        }
    }

    function updateTapBar() {
        const tapFill = document.getElementById('tap-fill');
        const remainingTaps = document.getElementById('remaining-taps');
        if (tapTimer <= 0) {
            taps = Math.min(taps + 1, 1000);
            tapTimer = 600;
        }
        tapTimer--;
        if (remainingTaps) {
            remainingTaps.innerText = taps;
        }
        const fillPercentage = taps / 1000;
        if (tapFill) {
            tapFill.style.transform = `scaleX(${fillPercentage})`;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrack();
        if (isTapping) {
            frameCounter++;
            if (frameCounter % 2 === 0) {
                frameIndex++;
                if (frameIndex >= camelFrames.length) frameIndex = 0;
            }
        }
        drawCamel();
        spawnCoin();
        drawCoins();
        drawTapText();
        updateProgress();
        updateTapBar();
        requestAnimationFrame(gameLoop);
    }

    function handleTap(event) {
        isTapping = true;
        const tapX = event.clientX;
        const tapY = event.clientY;
        let tapTextContent = 'x1';
        let tapOnCoin = false;

        frameCounter = 0;

        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            const coinSizeScaled = coinSize * coin.scale;
            const coinX = coin.x - coinSizeScaled / 2;
            const coinY = coin.y - coinSizeScaled / 2;
            if (tapX > coinX && tapX < coinX + coinSizeScaled && tapY > coinY && tapY < coinY + coinSizeScaled) {
                tapTextContent = 'x2';
                coins.splice(i, 1);
                coinCount += 2;
                const coinCountText = document.getElementById('coin-count-text');
                if (coinCountText) {
                    coinCountText.innerText = coinCount.toLocaleString();
                }
                tapOnCoin = true;
                progress += 0.08;
                break;
            }
        }
        if (!tapOnCoin) {
            coinCount++;
            const coinCountText = document.getElementById('coin-count-text');
            if (coinCountText) {
                coinCountText.innerText = coinCount.toLocaleString();
            }
            progress += 0.08;
        }
        tapText.push({ text: tapTextContent, x: tapX, y: tapY, opacity: 1 });
        if (taps > 0) {
            taps--;
            const remainingTaps = document.getElementById('remaining-taps');
            if (remainingTaps) {
                remainingTaps.innerText = taps;
            }
            const tapBar = document.getElementById('tap-bar');
            if (tapBar) {
                tapBar.style.width = `${(taps / 1000) * 100}%`;
            }
            updateTapFill();
        }
        if (progress > 100) progress = 100;
        updateProgress();
    }

    function handleTouch(event) {
        isTapping = true;
        event.preventDefault();
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            handleTap({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    function handleTapEnd() {
        isTapping = false;
    }

    window.addEventListener('click', handleTap);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mouseup', handleTapEnd);
    window.addEventListener('touchend', handleTapEnd);

    trackImg.onload = () => {
        resizeCanvas();
    };

    resizeCanvas();
    gameLoop();
});
