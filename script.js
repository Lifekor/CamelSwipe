document.addEventListener('DOMContentLoaded', (event) => {
    const progressText = document.getElementById('progress-text');
    progressText.innerText = `${Math.floor(progress)}%`;
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let tapText = [];
let tapTimer = 0;
let coinCount = 0;
let taps = 1000;
let progress = 0;
let speed = 4;

const trackFrames = [];
const loadTrackFrame = (i) => {
    const img = new Image();
    img.src = `textures/track/track_${String(i).padStart(4, '0')}.png`;
    trackFrames.push(img);
};
for (let i = 1; i <= 64; i++) {
    loadTrackFrame(i);
}

const coinFrames = [];
const loadCoinFrame = (i) => {
    const img = new Image();
    img.src = `textures/Coins/coin_${String(i).padStart(4, '0')}.png`;
    coinFrames.push(img);
};
for (let i = 1; i <= 50; i++) {
    loadCoinFrame(i);
}

let frameIndex = 0;
let trackFrameIndex = 0;
let frameCount = 0;
const coinSize = 75;

let lanes = [
    canvas.width * 0.5,  // Первая линия (30% от ширины экрана)
    canvas.width * 0.5,  // Вторая линия (40% от ширины экрана)
    canvas.width * 0.5,  // Третья линия (50% от ширины экрана)
    canvas.width * 0.5,  // Четвертая линия (60% от ширины экрана)
    canvas.width * 0.5   // Пятая линия (70% от ширины экрана)
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
    frameCount++;
    if (frameCount % 2 === 0) { // Замедляем скорость прокрутки фона
        trackFrameIndex = (trackFrameIndex + 1) % trackFrames.length;
    }
    ctx.drawImage(trackFrames[trackFrameIndex], 0, 0, canvas.width, canvas.height);
}

function spawnCoin() {
    if (coinSpawnTimer <= 0) {
        const numCoins = Math.floor(Math.random() * 3) + 1; // Спавним от 1 до 3 монеток
        for (let i = 0; i < numCoins; i++) {
            const laneIndex = Math.floor(Math.random() * lanes.length);
            const startX = canvas.width / 2; // Начальная позиция по X - центр экрана
            const y = canvas.height * 0.35; // Начальная позиция по Y ближе к центру
            coins.push({ startX: startX, endX: lanes[laneIndex], laneIndex: laneIndex, y: y, frameIndex: 0, scale: 0.2 });
        }
        coinSpawnTimer = 40; // Спавн монеток каждые 50 кадров
    }
    coinSpawnTimer--;
}


function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;
        coin.scale = Math.min(1, coin.scale + 0.01); // Увеличиваем размер монетки

        // Интерполяция координаты X в зависимости от текущей позиции Y
        const t = (coin.y - canvas.height * 0.1) / (canvas.height - canvas.height * 0.1);
        const endX = lanes[coin.laneIndex];
        const x = coin.startX + t * (endX - coin.startX) * (2.5 + t); // Увеличиваем расстояние между монетами ближе к низу экрана

        const coinSizeScaled = coinSize * coin.scale;
        coin.x = x; // Сохраняем текущую позицию по X для обработки кликов
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
    ctx.font = "3vh 'LilitaOne-Regular'"; // Увеличиваем размер текста
    ctx.fillStyle = "white"; // Устанавливаем цвет текста
    for (let i = 0; i < tapText.length; i++) {
        const tap = tapText[i];
        ctx.globalAlpha = tap.opacity;
        ctx.fillText(tap.text, tap.x, tap.y); // Рисуем текст вместо изображения
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
    playerIcon.style.bottom = `${progressHeight}px`;
    progressText.style.bottom = `${progressHeight}px`;
    progressBackground.style.bottom = `${progressHeight}px`;
    progressText.innerText = `${Math.floor(progress)}%`;

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
    remainingTaps.innerText = taps;
    tapFill.style.width = `${(taps / 1000) * 100}%`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
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
    let tapTextContent = 'x1'; // По умолчанию х1
    let tapOnCoin = false;
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        const coinSizeScaled = coinSize * coin.scale; // Учитываем масштаб монеты
        const coinX = coin.x - coinSizeScaled / 2;
        const coinY = coin.y - coinSizeScaled / 2;
        if (tapX > coinX && tapX < coinX + coinSizeScaled && tapY > coinY && tapY < coinY + coinSizeScaled) {
            tapTextContent = 'x2'; // Если попали по монетке
            coins.splice(i, 1);
            coinCount += 2;
            document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
            tapOnCoin = true;
            progress += 0.08; // Увеличиваем прогресс на 0.08% за клик по монетке
            break;
        }
    }
    if (!tapOnCoin) {
        coinCount++;
        document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
        progress += 0.08; // Увеличиваем прогресс на 0.08% за обычный клик
    }
    tapText.push({ text: tapTextContent, x: tapX, y: tapY, opacity: 1 });
    if (taps > 0) {
        taps--;
        document.getElementById('remaining-taps').innerText = taps;
        const tapBar = document.getElementById('tap-bar');
        tapBar.style.width = `${(taps / 1000) * 100}%`;
    }
    if (progress > 100) progress = 100; // Не позволяем прогрессу превышать 100%
    updateProgress(); // Обновляем прогресс-бар и иконку игрока
}


function handleTouch(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение для тач-событий
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        handleTap({ clientX: touch.clientX, clientY: touch.clientY });
    }
}

window.addEventListener('click', handleTap);
window.addEventListener('touchstart', handleTouch);

trackFrames[0].onload = () => {
    resizeCanvas();
    gameLoop();
};
