const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 414; // Размер канваса
canvas.height = 896;

const camelImg = new Image();
camelImg.src = 'textures/camel.png';

const trackImg = new Image();
trackImg.src = 'textures/track.png';

// Загрузка анимационных кадров монеток
const coinFrames = [];
for (let i = 1; i <= 50; i++) {
    const img = new Image();
    img.src = `textures/Coins/${String(i).padStart(4, '0')}.png`;
    coinFrames.push(img);
}

// Загрузка кадров анимации верблюда
const camelFrames = [];
for (let i = 1; i <= 36; i++) {
    const img = new Image();
    img.src = `textures/camel_run_${i}.png`;
    camelFrames.push(img);
}

let frameIndex = 0;
const camelWidth = 400; // Ширина верблюда (задается по требованию)
const camelHeight = 400 * (157 / 278); // Высота верблюда, пропорциональная ширине
const coinSize = 75; // Размер монетки (пропорциональный)

// Настройки текстуры дороги
const trackTextureWidth = 2132; // Ширина текстуры дороги
const trackTextureHeight = 930; // Длина текстуры дороги

// Масштабирование текстуры дороги для удаления эффекта "слишком близко"
const trackScale = 0.32; // Уменьшение текстуры дороги до 50%

// Полосы для спавна монеток и перемещения верблюда
const lanes = [
    canvas.width / 4,
    canvas.width / 2,
    3 * canvas.width / 4
];
let currentLane = 1; // Центр
let camelY = canvas.height * 0.75;
let trackY = 0;
let coinSpawnTimer = 0;
const speed = 5;
const coins = [];

// Вычисляем количество текстур, необходимых для покрытия экрана
const numTrackTilesX = Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1;
const numTrackTilesY = Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 1;

function drawTrack() {
    const offsetX = (canvas.width - trackTextureWidth * trackScale) / 2; // Центрируем текстуру дороги

    for (let i = 0; i < numTrackTilesX; i++) {
        for (let j = 0; j < numTrackTilesY; j++) {
            ctx.drawImage(trackImg, 
                          offsetX + i * trackTextureWidth * trackScale - (trackTextureWidth * trackScale) / 1, 
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
    ctx.drawImage(camelFrames[frameIndex], lanes[currentLane] - camelWidth / 2, camelY, camelWidth, camelHeight);

    frameIndex++;
    if (frameIndex >= camelFrames.length) frameIndex = 0;
}

function spawnCoin() {
    if (coinSpawnTimer <= 0) {
        const lane = Math.floor(Math.random() * 3);
        const x = lanes[lane] - coinSize / 2;
        coins.push({ x: x, y: -coinSize, lane: lane, frameIndex: 0 });
        coinSpawnTimer = 100; // Спавн монетки каждые 100 кадров
    }
    coinSpawnTimer--;
}

function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;

        // Анимация монетки
        ctx.drawImage(coinFrames[coin.frameIndex], coin.x, coin.y, coinSize, coinSize);

        // Обновление кадра анимации монетки
        coin.frameIndex++;
        if (coin.frameIndex >= coinFrames.length) {
            coin.frameIndex = 0;
        }

        if (coin.y > canvas.height) {
            coins.splice(i, 1);
            i--;
        }

        // Проверка на столкновение с верблюдом
        if (coin.y + coinSize > camelY && coin.y < camelY + camelHeight &&
            coin.lane === currentLane) {
            coins.splice(i, 1);
            i--;
            // Добавить логику для начисления очков и т.д.
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTrack();
    drawCamel();
    spawnCoin();
    drawCoins();

    requestAnimationFrame(gameLoop);
}

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft' && currentLane > 0) {
        currentLane--;
    } else if (event.key === 'ArrowRight' && currentLane < 2) {
        currentLane++;
    }
}

// Добавление управления свайпом пальца
let touchStartX = null;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    if (!touchStartX) return;

    let touchEndX = event.touches[0].clientX;
    let diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 30) {
        if (diffX > 0 && currentLane > 0) {
            currentLane--;
        } else if (diffX < 0 && currentLane < 2) {
            currentLane++;
        }
        touchStartX = null;
    }
}

window.addEventListener('keydown', handleKeyPress);
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);

camelImg.onload = () => {
    gameLoop();
};
