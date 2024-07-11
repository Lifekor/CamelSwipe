const { createCanvas, loadImage } = require('canvas');

// Создаем холст и его контекст
const canvas = createCanvas(414, 896);
const ctx = canvas.getContext('2d');

// Пути к изображениям
const camelPaths = [];
for (let i = 1; i <= 8; i++) {
    camelPaths.push(`textures/camel_run_${i}.png`);
}
const camelImgPath = 'textures/camel.png';
const trackImgPath = 'textures/track.png';
const coinImgPath = 'textures/coin.png';

// Загружаем изображения
const loadImages = paths => Promise.all(paths.map(path => loadImage(path)));

let camelFrames = [];
let camelImg, trackImg, coinImg;

Promise.all([
    loadImages(camelPaths).then(images => {
        camelFrames = images;
        console.log('Camel frames loaded');
    }),
    loadImage(camelImgPath).then(image => {
        camelImg = image;
        console.log('Camel image loaded');
    }),
    loadImage(trackImgPath).then(image => {
        trackImg = image;
        console.log('Track image loaded');
    }),
    loadImage(coinImgPath).then(image => {
        coinImg = image;
        console.log('Coin image loaded');
    })
]).then(() => {
    console.log('All images loaded, starting game');
    startGame();
}).catch(error => {
    console.error('Error loading images:', error);
});

let frameIndex = 0;
const camelWidth = 300; // Ширина верблюда (задается по требованию)
const camelHeight = 300 * (157 / 278); // Высота верблюда, пропорциональная ширине
const coinSize = 50; // Размер монетки (пропорциональный)

// Настройки текстуры дороги
const trackTextureWidth = 2132; // Ширина текстуры дороги
const trackTextureHeight = 930; // Длина текстуры дороги

// Масштабирование текстуры дороги для удаления эффекта "слишком близко"
const trackScale = 0.5; // Уменьшение текстуры дороги до 50%

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
                          offsetX + i * trackTextureWidth * trackScale - (trackTextureWidth * trackScale) / 2, 
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

function startGame() {
    console.log('Game started');
    function gameLoop() {
        console.log('Game loop');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawTrack();
        drawCamel();
        spawnCoin();
        drawCoins();

        setTimeout(gameLoop, 1000 / 60); // Запускать 60 кадров в секунду
    }

    gameLoop();
}

// Обработчик для нажатий клавиш
function handleKeyPress(event) {
    if (event.key === 'ArrowLeft' && currentLane > 0) {
        currentLane--;
    } else if (event.key === 'ArrowRight' && currentLane < 2) {
        currentLane++;
    }
}

// Устанавливаем обработчик клавиш
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', handleKeyPress);
