document.addEventListener('DOMContentLoaded', (event) => {
    const progressText = document.getElementById('progress-text');
    progressText.innerText = `${Math.floor(progress)}%`;
    resizeCanvas();
    gameLoop(); 

    const tapFill = document.getElementById('tap-fill');
    const remainingTaps = document.getElementById('remaining-taps');

    let taps = 1000;
    const maxTaps = 1000;

    function updateTapFill() {
        const fillPercentage = taps / maxTaps;
        tapFill.style.transform = `scaleX(${fillPercentage})`;
    }

    
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

let tapText = [];
let tapTimer = 0;
let coinCount = 0;
let taps = 1000;
let progress = 0;
let speed = 2;
let frameCounter = 0;
let stamina = 0;
let regeneration = 0;

const params = new URLSearchParams(window.location.search);
const userId = params.get('id'); 
console.log(userId);

const totalTaps = document.getElementById('total-taps');

const getInformation = async () => {
 try {
    const res = await axios.get(`https://api.camelracing.io/game/?user_id=${userId}`);
    taps = res.data.current_water;
    stamina = res.data.stamina;
    totalTaps.innerText = stamina;
    progress = res.data.current_path;
    regeneration = res.data.regeneration;
    coinCount = res.data.current_coin;
    document.getElementById('coin-count-text').innerText = coinCount;
 }catch (e) {

 }
    
};




const ebuchiyTap = async (claim) => {
    try {
         await axios.post(`https://api.camelracing.io/game/claim?user_id=${userId}&current_path=${progress}&coin=${claim}`);
    }catch(e) {
        console.log(e);
    }
};

getInformation();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');



const frameDelay = 2;

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
const coinSize = 75;
const camelWidth = 1080 / 1.8;
const camelHeight = 1920 / 1.8;

let lanes = [
    canvas.width * 0.40,
    canvas.width * 0.45,
    canvas.width * 0.50,
    canvas.width * 0.55,
    canvas.width * 0.60
];
let currentLane = 1;
let coinSpawnTimer = 0;
const coins = [];

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    canvas.width = screenWidth * ratio;
    canvas.height = screenHeight * ratio;

    // Reset transformation matrix to default
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    lanes = [
        canvas.width * 0.4,
        canvas.width * 0.45,
        canvas.width * 0.5,
        canvas.width * 0.55,
        canvas.width * 0.6
    ];
}

function drawTrack() {
    const imgAspectRatio = trackImg.width / trackImg.height;
    const canvasAspectRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight;
    if (canvasAspectRatio > imgAspectRatio) {
        // Canvas is wider than image
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspectRatio;
    } else {
        // Canvas is taller than image
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspectRatio;
    }

    // Center the image on the canvas
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    ctx.drawImage(trackImg, offsetX / window.devicePixelRatio, offsetY / window.devicePixelRatio, drawWidth / window.devicePixelRatio, drawHeight / window.devicePixelRatio);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();




function drawCamel() {
    const camelScale = Math.min(canvas.width / 1080, canvas.height / 1920);
    const scaledCamelWidth = camelWidth * camelScale;
    const scaledCamelHeight = camelHeight * camelScale;

    if (frameCounter % frameDelay === 0) {
        frameIndex++;
        if (frameIndex >= camelFrames.length) frameIndex = 0;
    }

    // Центрируем верблюда
    const camelX = lanes[currentLane] - scaledCamelWidth / 2.5;
    const camelY = canvas.height - scaledCamelHeight - 100;

    ctx.drawImage(camelFrames[frameIndex], camelX / window.devicePixelRatio, camelY / window.devicePixelRatio, scaledCamelWidth / window.devicePixelRatio, scaledCamelHeight / window.devicePixelRatio);

    frameCounter++;
}



function spawnCoin() {
    if (coinSpawnTimer <= 0) {
        const numCoins = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numCoins; i++) {
            const startX = canvas.width / 2;
            const startY = canvas.height / 1.6 + 50; // Смещение на 50 пикселей вниз
            const laneIndex = Math.floor(Math.random() * lanes.length);
            coins.push({ startX: startX, startY: startY, endX: lanes[laneIndex], laneIndex: laneIndex, y: startY, frameIndex: 0, scale: 0.3 }); // Увеличение начального масштаба
        }
        coinSpawnTimer = 60;
    }
    coinSpawnTimer--;
}

function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.y += speed;
        coin.scale = Math.min(1, coin.scale + 0.01);

        const t = (coin.y - coin.startY) / (canvas.height - coin.startY);
        const endX = lanes[coin.laneIndex];
        const x = coin.startX + t * (endX - coin.startX) * (4 + t);

        coin.x = x; // Сохраняем текущую позицию по X для обработки кликов

        const coinSizeScaled = coinSize * coin.scale * 1.5;

        const drawX = x / window.devicePixelRatio;
        const drawY = coin.y / window.devicePixelRatio;
        const drawCoinSize = coinSizeScaled / window.devicePixelRatio;

        ctx.drawImage(coinFrames[coin.frameIndex], drawX - drawCoinSize / 2, drawY - drawCoinSize / 2, drawCoinSize, drawCoinSize);
        coin.frameIndex++;
        if (coin.frameIndex >= coinFrames.length) coin.frameIndex = 0;

        if (coin.y > canvas.height) {
            coins.splice(i, 1);
            i--;
        }
    }
}


function drawTapText() {
    ctx.font = "3vh 'LilitaOne-Regular'";
    ctx.fillStyle = "white";
    for (let i = 0; i < tapText.length; i++) {
        const tap = tapText[i];
        ctx.globalAlpha = tap.opacity;
        ctx.fillText(tap.text, tap.x, tap.y);
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
        tapTimer = regeneration * 200;
    }

    tapTimer--;
    remainingTaps.innerText = Math.round(taps);
    const fillPercentage = taps / 1000;
    tapFill.style.transform = `scaleX(${fillPercentage})`;
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

function triggerVibration() {
    if (navigator.vibrate) {
        navigator.vibrate(20);
    } else if (navigator.webkitVibrate) {
        navigator.webkitVibrate(20);
    }
}


function handleTap(event) {
    if (taps <= 0) return;
    const tapX = event.clientX * window.devicePixelRatio;
    const tapY = event.clientY * window.devicePixelRatio;
    let tapTextContent = 'x1';
    let tapOnCoin = false;

    triggerVibration();

    const scaleAdjustment = window.innerWidth < 768 ? 1.5 : 1;  // Увеличиваем зону клика на мобильных

    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        const coinSizeScaled = coinSize * coin.scale * scaleAdjustment;
        const coinX = coin.x - coinSizeScaled / 2;
        const coinY = coin.y - coinSizeScaled / 2;

        if (tapX > coinX && tapX < coinX + coinSizeScaled && tapY > coinY && tapY < coinY + coinSizeScaled) {
            tapTextContent = 'x2';
            coins.splice(i, 1);
            coinCount += 2;
            document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
            tapOnCoin = true;
            progress += 0.08;
            ebuchiyTap(2);
            break;
        }
    }
    
    if (!tapOnCoin) {
        coinCount++;
        document.getElementById('coin-count-text').innerText = coinCount.toLocaleString();
        progress += 0.08;
        ebuchiyTap(1);
    }

    tapText.push({ text: tapTextContent, x: tapX, y: tapY, opacity: 1 });
    if (taps > 0) {
        taps--;
        document.getElementById('remaining-taps').innerText = taps;
        updateTapFill();
    }
    if (progress > 100) progress = 100;
    updateProgress();
}


function handleTouch(event) {
    event.preventDefault();
    triggerVibration();
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        handleTap({ clientX: touch.clientX * window.devicePixelRatio, clientY: touch.clientY * window.devicePixelRatio });
    }
}


window.addEventListener('click', handleTap);
window.addEventListener('touchstart', handleTouch);

trackImg.onload = () => {
    resizeCanvas();
};
