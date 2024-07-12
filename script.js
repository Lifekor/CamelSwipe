const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 414; // Размер канваса
canvas.height = 896;

const camelImg = new Image();
camelImg.src = 'textures/camel.png';

const trackImg = new Image();
trackImg.src = 'textures/track.png';

const coinImg = new Image();
coinImg.src = 'textures/coin.png';

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
const trackTextureWidth = 533; // Ширина текстуры дороги
const trackTextureHeight = 232; // Длина текстуры дороги

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
        coins.push({ x: x, y: -coinSize, lane: lane });
        coinSpawnTimer = 100; // Спавн монетки каждые 100 кадров
    }
    coinSpawnTimer--;
}

function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;

        ctx.drawImage(coinImg, coin.x, coin.y, coinSize, coinSize);

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

window.addEventListener('keydown', handleKeyPress);

camelImg.onload = () => {
    gameLoop();
};
