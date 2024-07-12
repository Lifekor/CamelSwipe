const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let camelY;

// Функция для изменения размера канваса в зависимости от размера окна
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camelY = canvas.height * 0.75;

    // Пересчитываем полосы для спавна монеток и перемещения верблюда
    lanes[0] = canvas.width / 4;
    lanes[1] = canvas.width / 2;
    lanes[2] = 3 * canvas.width / 4;

    // Пересчитываем количество текстур для покрытия экрана
    numTrackTilesX = Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1;
    numTrackTilesY = Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 1;

    console.log(`Canvas resized: width=${canvas.width}, height=${canvas.height}`);
}

window.addEventListener('resize', resizeCanvas);

const camelImg = new Image();
camelImg.src = 'textures/camel.png';
camelImg.onload = () => console.log('Camel image loaded');
camelImg.onerror = () => console.error('Error loading camel image');

const trackImg = new Image();
trackImg.src = 'textures/track.png';
trackImg.onload = () => console.log('Track image loaded');
trackImg.onerror = () => console.error('Error loading track image');

// Загрузка анимационных кадров монеток
const coinFrames = [];
const loadCoinFrame = (i) => {
    const img = new Image();
    img.src = `textures/Coins/${String(i).padStart(4, '0')}.png`;
    img.onload = () => console.log(`Coin frame ${i} loaded`);
    img.onerror = () => console.error(`Error loading coin frame ${i}`);
    coinFrames.push(img);
};

for (let i = 1; i <= 50; i++) {
    loadCoinFrame(i);
}

// Загрузка кадров анимации верблюда
const camelFrames = [];
const loadCamelFrame = (i) => {
    const img = new Image();
    img.src = `textures/camel_run_${i}.png`;
    img.onload = () => console.log(`Camel frame ${i} loaded`);
    img.onerror = () => console.error(`Error loading camel frame ${i}`);
    camelFrames.push(img);
};

for (let i = 1; i <= 36; i++) {
    loadCamelFrame(i);
}

let frameIndex = 0;
const camelWidth = 400; // Ширина верблюда (задается по требованию)
const camelHeight = 400 * (157 / 278); // Высота верблюда, пропорциональная ширине
const coinSize = 75; // Размер монетки (пропорциональный)

// Настройки текстуры дороги
const trackTextureWidth = 2132; // Ширина текстуры дороги
const trackTextureHeight = 930; // Длина текстуры дороги

// Масштабирование текстуры дороги для удаления эффекта "слишком близко"
const trackScale = 0.32; // Уменьшение текстуры дороги до 32%

// Полосы для спавна монеток и перемещения верблюда
let lanes = [
    canvas.width / 4,
    canvas.width / 2,
    3 * canvas.width / 4
];
let currentLane = 1; // Центр
trackY = 0;
let coinSpawnTimer = 0;
const speed = 5;
const coins = [];

// Пересчитываем количество текстур для покрытия экрана
let numTrackTilesX = Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1;
let numTrackTilesY = Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 1;

function drawTrack() {
    console.log('Drawing track');
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
    console.log('Drawing camel');
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
    console.log('Game loop running');
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
    console.log('Starting game loop');
    resizeCanvas(); // Изменение размера канваса при загрузке изображения
    gameLoop();
};
