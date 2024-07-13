document.addEventListener('DOMContentLoaded', (event) => {
    const progressText = document.getElementById('progress-text');
    progressText.innerText = `${Math.floor(progress)}%`;
});

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

const propTypes = ['cactus', 'rock'];
const propImages = [];

const loadProps = () => {
    for (const type of propTypes) {
        for (let i = 1; i <= 5; i++) {
            const img = new Image();
            img.src = `textures/Props/${type}${i}.png`;
            img.onload = () => {
                propImages.push({ type, img });
            };
        }
    }
};

loadProps();

let frameIndex = 0;
const camelWidth = 400;
const camelHeight = 400 * (157 / 278);
const coinSize = 75;

const trackTextureWidth = 508;
const trackTextureHeight = 508;
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
const props = [];

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
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 15;
    ctx.drawImage(camelFrames[frameIndex], lanes[currentLane] - camelWidth / 2, camelY, camelWidth, camelHeight);
    ctx.shadowBlur = 0; // Убираем тень после рисования верблюда
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

function drawProps() {
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (prop.img.complete && prop.img.naturalHeight !== 0) {
            prop.y += speed;
            ctx.save();
            ctx.translate(prop.x, prop.y);
            if (prop.rotation) {
                const angle = (prop.rotation * Math.PI) / 180;
                ctx.rotate(angle);
            }
            if (prop.flipped) {
                ctx.scale(-1, 1); // Горизонтальное отзеркаливание
            }
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 15;
            ctx.drawImage(prop.img, -prop.width / 2, -prop.height / 2, prop.width, prop.height);
            ctx.restore();
        }
    }
    // Изменяем props с помощью метода splice, а не присваивания новой переменной
    for (let i = props.length - 1; i >= 0; i--) {
        if (props[i].y >= canvas.height + 100) {
            props.splice(i, 1); // Удаляем пропсы, вышедшие за экран
        }
    }
}

function spawnProps() {
    const numProps = Math.floor(Math.random() * 2) + 1; // Спавним от 1 до 2 пропсов
    for (let i = 0; i < numProps; i++) {
        const type = propTypes[Math.floor(Math.random() * propTypes.length)];
        const propImage = propImages.find((img) => img.type === type);
        if (propImage) {
            const img = propImage.img;
            const width = 100; // Фиксированная ширина
            const height = 100; // Фиксированная высота
            let x, y;
            let attempts = 0;
            do {
                x = Math.random() * canvas.width;
                y = -height;
                attempts++;
            } while ((x > canvas.width / 3 && x < 2 * canvas.width / 3) && attempts < 10); // Пропускаем центральную линию
            const rotation = type === 'rock' ? Math.random() * 360 : 0; // Рандомный угол поворота только для камней
            const flipped = type === 'cactus' && Math.random() > 0.5; // Рандомное отзеркаливание только для кактусов
            props.push({ type, img, x, y, width, height, rotation, flipped });
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
    drawProps();
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

camelImg.onload = () => {
    resizeCanvas();
    gameLoop();
    setInterval(spawnProps, 1000); // Спавн пропсов каждые 1000 миллисекунд
};
