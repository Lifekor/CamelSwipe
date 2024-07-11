const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camelY = canvas.height * 0.75;

    // Пересчитать полосы для спавна монеток и перемещения верблюда
    lanes[0] = canvas.width / 4;
    lanes[1] = canvas.width / 2;
    lanes[2] = 3 * canvas.width / 4;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
const camelWidth = 400;
const camelHeight = 400 * (157 / 278);
const coinSize = 75;

const trackTextureWidth = 533;
const trackTextureHeight = 232;

const trackScale = 0.32;

const lanes = [
    canvas.width / 4,
    canvas.width / 2,
    3 * canvas.width / 4
];
let currentLane = 1;
let camelY = canvas.height * 0.75;
let trackY = 0;
let coinSpawnTimer = 0;
const speed = 5;
const coins = [];

function getNumTrackTiles() {
    return {
        numTrackTilesX: Math.ceil(canvas.width / (trackTextureWidth * trackScale)) + 1,
        numTrackTilesY: Math.ceil(canvas.height / (trackTextureHeight * trackScale)) + 1
    };
}

function drawTrack() {
    const offsetX = (canvas.width - trackTextureWidth * trackScale) / 2;
    const { numTrackTilesX, numTrackTilesY } = getNumTrackTiles();

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
        coinSpawnTimer = 100;
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

        if (coin.y + coinSize > camelY && coin.y < camelY + camelHeight &&
            coin.lane === currentLane) {
            coins.splice(i, 1);
            i--;
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
