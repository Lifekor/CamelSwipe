document.addEventListener('DOMContentLoaded', (event) => {
    const progressText = document.getElementById('progress-text');
    progressText.innerText = `${Math.floor(progress)}%`;
    resizeCanvas();
    gameLoop(); // Запуск основного игрового цикла

    const tapFill = document.getElementById('tap-fill');
    const remainingTaps = document.getElementById('remaining-taps');
    const totalTaps = document.getElementById('total-taps');

    let taps = 1000;
    const maxTaps = 1000;

    function updateTapFill() {
        const fillPercentage = taps / maxTaps;
        tapFill.style.transform = `scaleX(${fillPercentage})`; // Масштабируем fill от 0 до 1
    }

    // Пример уменьшения количества тапов
    function decreaseTaps() {
        if (taps > 0) {
            taps -= 25;
            remainingTaps.textContent = taps;
            updateTapFill();
        }
    }

    // Вызовите decreaseTaps() при необходимости, чтобы увидеть эффект
    updateTapFill(); // Изначальное обновление
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let tapText = [];
let tapTimer = 0;
let coinCount = 0;
let taps = 1000;
let progress = 0;
let speed = 2;

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

let frameIndex = 0;
const coinSize = 100;
const camelWidth = 1080 / 1.8;
const camelHeight = 1920 / 1.8;

let lanes = [
    canvas.width * 0.5,  // Первая линия (30% от ширины экрана).
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
    ctx.drawImage(trackImg, 0, 0, canvas.width, canvas.height);
}

function drawCamel() {
    const camelScale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920); // Устанавливаем масштаб верблюда
    const scaledCamelWidth = camelWidth * camelScale;
    const scaledCamelHeight = camelHeight * camelScale;
    ctx.drawImage(camelFrames[frameIndex], lanes[currentLane] - scaledCamelWidth / 2.5, canvas.height - scaledCamelHeight - 45, scaledCamelWidth, scaledCamelHeight);
}

function spawnCoin() {
    if (coinSpawnTimer <= 0) {
        const numCoins = Math.floor(Math.random() * 3) + 1; // Спавним от 1 до 3 монеток
        for (let i = 0; i < numCoins; i++) {
            const startX = canvas.width / 2; // Начальная позиция по X - центр экрана
            const startY = canvas.height / 1.6; // Начальная позиция по Y - центр экрана
            const laneIndex = Math.floor(Math.random() * lanes.length);
            coins.push({ startX: startX, startY: startY, endX: lanes[laneIndex], laneIndex: laneIndex, y: startY, frameIndex: 0, scale: 0.2 });
        }
        coinSpawnTimer = 60; // Спавн монеток каждые 50 кадров
    }
    coinSpawnTimer--;
}

function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;
        coin.scale = Math.min(1, coin.scale + 0.01); // Увеличиваем размер монетки

        // Интерполяция координаты X и Y в зависимости от текущей позиции Y
        const t = (coin.y - coin.startY) / (canvas.height - coin.startY);
        const endX = lanes[coin.laneIndex];
        const x = coin.startX + t * (endX - coin.startX) * (4 + t); // Еще сильнее увеличиваем расстояние между монетами ближе к низу экрана

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
    const fillPercentage = taps / 1000;
    tapFill.style.transform = `scaleX(${fillPercentage})`; // Уменьшаем заполнение с правой стороны
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
    let tapTextContent = 'x1'; // По умолчанию х1
    let tapOnCoin = false;

    // Вибрация устройства
    if (navigator.vibrate) {
        navigator.vibrate(50); // Вибрация на 50 миллисекунд
    }

    // Обновляем кадр верблюда при каждом тапе
    frameIndex++;
    if (frameIndex >= camelFrames.length) frameIndex = 0;

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
        updateTapFill();
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

trackImg.onload = () => {
    resizeCanvas();
};
