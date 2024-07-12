const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let camelY;
let tapText = [];
let tapTimer = 0;
let coinCount = 0;
let taps = 1000;
let progress = 0;
let speed = 5;

const camelImg = new Image();
camelImg.src = 'textures/camel.png';

const trackImg = new Image();
trackImg.src = 'textures/track.png';

const tapText1Img = new Image();
tapText1Img.src = 'textures/Numbers/1.png';

const tapText2Img = new Image();
tapText2Img.src = 'textures/Numbers/2.png';

const coinFrames = [];
const loadCoinFrame = (i) => {
    const img = new Image();
    img.src = `textures/Coins/${String(i).padStart(4, '0')}.png`;
    coinFrames.push(img);
};
for (let i = 1; i <= 50; i++) {
    loadCoinFrame(i);
}

const camelFrames = [];
const loadCamelFrame = (i) => {
    const img = new Image();
    img.src = `textures/camel_run_${i}.png`;
    camelFrames.push(img);
};
for (let i = 1; i <= 36; i++) {
    loadCamelFrame(i);
}

let frameIndex = 0;
const camelWidth = 400;
const camelHeight = 400 * (157 / 278);
const coinSize = 75;

const trackTextureWidth = 533;
const trackTextureHeight = 232;
const trackScale = 1;

let lanes = [
    canvas.width / 4,
    canvas.width / 2,
    3 * canvas.width / 4
];
let currentLane = 1;
trackY = 0;
let coinSpawnTimer = 0;
const coins = [];

let numTrackTilesX = Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1;
let numTrackTilesY = Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 1;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camelY = canvas.height * 0.55;
    lanes[0] = canvas.width / 4;
    lanes[1] = canvas.width / 2;
    lanes[2] = 3 * canvas.width / 4;
    numTrackTilesX = Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1;
    numTrackTilesY = Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 2;
}
window.addEventListener('resize', resizeCanvas);

function drawTrack() {
    const offsetX = (canvas.width - trackTextureWidth * trackScale) / 2;
    for (let i = 0; i < numTrackTilesX; i++) {
        for (let j = 0; j < numTrackTilesY; j++) {
            ctx.drawImage(trackImg,
                          offsetX + i * trackTextureWidth * trackScale,
                          trackY + j * trackTextureHeight * trackScale - trackTextureHeight * trackScale,
                          trackTextureWidth * trackScale,
                          trackTextureHeight * trackScale);
        }
    }
    trackY += speed;
    if (trackY >= trackTextureHeight * trackScale) {
        trackY = 0;
    }
}

function drawCamel() {
    frameIndex++;
    if (frameIndex >= camelFrames.length) frameIndex = 0;
    ctx.drawImage(camelFrames[frameIndex], lanes[currentLane] - camelWidth / 2, camelY, camelWidth, camelHeight);
}

function spawnCoin() {
    if (coinSpawnTimer <= 0) {
        const numCoins = Math.floor(Math.random() * 3) + 1; // Спавним от 1 до 3 монеток
        for (let i = 0; i < numCoins; i++) {
            const x = Math.random() * canvas.width; // Случайная позиция по оси X
            const y = -coinSize - Math.random() * canvas.height; // Спавн за пределами экрана сверху, на случайной высоте
            coins.push({ x: x, y: y, frameIndex: 0 });
        }
        coinSpawnTimer = 50; // Спавн монеток каждые 100 кадров
    }
    coinSpawnTimer--;
}


function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;
        ctx.drawImage(coinFrames[coin.frameIndex], coin.x, coin.y, coinSize, coinSize);
        coin.frameIndex++;
        if (coin.frameIndex >= coinFrames.length) coin.frameIndex = 0;
        if (coin.y > canvas.height) {
            coins.splice(i, 1);
            i--;
        }
    }
}

function drawTapText() {
    for (let i = 0; i < tapText.length; i++) {
        const tap = tapText[i];
        ctx.globalAlpha = tap.opacity;
        ctx.drawImage(tap.img, tap.x, tap.y, 25, 25);
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
    const progressBarHeight = progressBar.clientHeight;

    progressText.style.color = 'white'; // Убедимся, что цвет текста белый
    progressText.style.fontFamily = 'LilitaOne-Regular'; // Используем нужный шрифт

    playerIcon.style.bottom = `${(progress / 100) * progressBarHeight}px`;
    progressText.style.bottom = `${(progress / 100) * progressBarHeight}px`;
    progressText.innerText = `${Math.floor(progress)}%`;
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
    remainingTaps.innerText = taps;
    tapFill.style.width = `${(taps / 1000) * 100}%`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCamel();
    spawnCoin();
    drawCoins();
    drawTapText();
    updateProgress();
    updateTapBar();
    requestAnimationFrame(gameLoop);
}

function handleTap(event) {
    const tapX = event.clientX;
    const tapY = event.clientY;
    let img = tapText1Img;
    let tapOnCoin = false;
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (tapX > coin.x && tapX < coin.x + coinSize && tapY > coin.y && tapY < coin.y + coinSize) {
            img = tapText2Img;
            coins.splice(i, 1);
            coinCount++;
            document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
            tapOnCoin = true;
            break;
        }
    }
    if (!tapOnCoin) {
        coinCount++;
        document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
    }
    tapText.push({ img: img, x: tapX - 12.5, y: tapY - 12.5, size: 25, opacity: 1 });
    if (taps > 0) {
        taps--;
        document.getElementById('remaining-taps').innerText = taps;
        const tapBar = document.getElementById('tap-bar');
        tapBar.style.width = `${(taps / 1000) * 100}%`;
    }
    progress += 1; // Увеличиваем прогресс на 1% за каждый тап
    if (progress > 100) progress = 100; // Не позволяем прогрессу превышать 100%
    updateProgress(); // Обновляем прогресс-бар и иконку игрока
}

window.addEventListener('click', handleTap);

camelImg.onload = () => {
    resizeCanvas();
    gameLoop();
};
