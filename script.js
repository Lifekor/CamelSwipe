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
let speed = 5;

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
    canvas.width / 4,
    canvas.width / 2,
    3 * canvas.width / 4
];
let currentLane = 1;
let coinSpawnTimer = 0;
const coins = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lanes[0] = canvas.width / 4;
    lanes[1] = canvas.width / 2;
    lanes[2] = 3 * canvas.width / 4;
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
            const x = Math.random() * canvas.width; // Случайная позиция по оси X
            const y = -coinSize - Math.random() * canvas.height; // Спавн за пределами экрана сверху, на случайной высоте
            coins.push({ x: x, y: y, frameIndex: 0 });
        }
        coinSpawnTimer = 50; // Спавн монеток каждые 50 кадров
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
    ctx.font = "2vh 'LilitaOne-Regular'"; // Устанавливаем шрифт и размер текста
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

    const progressHeight = (progress / 100) * progressBarHeight;

    // Сначала обновляем положение и размер фона
    progressBackground.style.bottom = `${progressHeight}px`;
    progressBackground.style.width = '200%'; // Убедитесь, что это соответствует вашим требованиям
    progressBackground.style.height = '5%'; // Убедитесь, что это соответствует вашим требованиям
    progressBackground.style.transform = 'translateY(100%)';
    progressBackground.style.left = '50%'; // Центрируем фон по горизонтали
    progressBackground.style.transform = 'translate(-50%, 100%)'; // Центрируем фон по горизонтали и вертикали

    // Затем обновляем положение текста и иконки
    playerIcon.style.bottom = `${progressHeight}px`;
    progressText.style.bottom = `${progressHeight}px`;
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
        if (tapX > coin.x && tapX < coin.x + coinSize && tapY > coin.y && tapY < coin.y + coinSize) {
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
