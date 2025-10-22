document.addEventListener('DOMContentLoaded', () =>{

// --- MODO DE DEBUG ---
// Defina como 'true' para ver as caixas de colisão e coordenadas
const DEBUG_MODE = true;
// -------------------------

// ---  CONFIGURAÇÕES E CONSTANTES ---
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const LIBRARY_PLAYER_SCALE = 1.5;

// ---  REFERÊNCIAS AOS ELEMENTOS HTML ---
const startScreen = document.getElementById('start-screen');
const canvas = document.getElementById('gameCanvas');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext('2d');

const joystickContainer = document.getElementById('joystick-container');
const joystickStick = document.getElementById('joystick-stick');
const actionButton = document.getElementById('action-button');

ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = 'pixelated';
    
// ---  CONSTANTES QUE DEPENDEM DO CANVAS --
const CAMERA_BOX_WIDTH = canvas.width * 0.5;
const CAMERA_BOX_HEIGHT = canvas.height * 0.5;

// --- "Banco de Dados" dos Níveis ---
const levels = {
    'library': {
        mapSrc: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/biblioteca_map.png',
        mapWidth: 1280,
        mapHeight: 717,
        startPos: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
        collisions: [
            { x: 0, y: 255, width: 590, height: 295 },// Esquerda
            { x: 0, y: 550, width: 1600, height: 170 },// Baixo
            { x: 1060, y: 255, width: 230, height: 295 },// Direita
            { x: 900, y: 255, width: 160, height: 80 },// Mesa S.D
            { x: 700, y: 255, width: 0, height: 25 },//
            { x: 590, y: 430, width: 470, height: 120 },// Mesa
            { x: 0, y: 0, width: 1600, height: 255 },// Cima
        ]
    },
    'egypt': {
        mapSrc: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/megaegit_map.png',
        mapWidth: 1600, mapHeight: 896,
        startPos: { x: 944, y: 668 },
        hotspots: [
            { id: 'pyramid_main', x: 800, y: 350, name: 'Pirâmide Principal' },
            { id: 'statue_left', x: 250, y: 750, name: 'Estátua Antiga' },
            { id: 'statue_right', x: 1350, y: 750, name: 'Estátua Guardiã' }
        ],
        collisions: [
            { x: 367, y: 124, width: 175, height: 230 },// Lago foguete
            { x: 730, y: 115, width: 160, height: 165 },// Piramide
            { x: 1200, y: 0, width: 400, height: 260 }, { x: 1370, y: 260, width: 240, height: 80 }, // Monte SD
            { x: 1425, y: 540, width: 70, height: 147 }, { x: 1400, y: 570, width: 240, height: 100 }, { x: 1370, y: 590, width: 70, height: 52 }, { x: 1356, y: 609, width: 70, height: 22 }, { x: 1391, y: 642, width: 70, height: 22 },//
            { x: 1508, y: 670, width: 210, height: 230 },// estatua antiga
            { x: 1238, y: 680, width: 45, height: 150 },{ x: 1220, y: 700, width: 80, height: 100 },{ x: 1196, y: 717, width: 130, height: 80  },{ x: 1160, y: 736, width: 180, height: 25 },{ x: 1173, y: 761, width: 170, height: 20 },{ x: 1185, y: 778, width: 151, height: 20 },{ x: 1491, y: 812, width: 70, height: 110 },{ x: 1473, y: 827, width: 50, height: 100 },{ x: 1463, y: 841, width: 50, height: 100 },{ x: 1446, y: 856, width: 50, height: 100 },{ x: 1430, y: 868, width: 50, height: 100 },// Montes ED
            { x: 594, y: 600, width: 155, height: 300 }, { x: 749, y: 732, width: 120, height: 500 },{ x: 869, y: 767, width: 20, height: 150 },{ x: 888, y: 816, width: 26, height: 150 },{ x: 914, y: 835, width: 26, height: 150 },// IM
            { x: 0, y: 682, width: 594, height: 230 },{ x: 0, y: 622, width: 281, height: 60 },{ x: 466, y: 644, width: 150, height: 38 },{ x: 490, y: 516, width: 280, height: 84 },{ x: 0, y: 494, width: 50, height: 140 },{ x: 0, y: 340, width: 61, height: 65 },{ x: 50, y: 548, width: 65, height: 100 },{ x: 115, y: 569, width: 15, height: 65 },{ x: 130, y: 591, width: 39, height: 35 },
            { x: 0, y: 0, width: 182, height: 190 }, { x: 182, y: 0, width: 60, height: 117 }, { x: 0, y: 190, width: 134, height: 140 }, { x: 0, y: 330, width: 90, height: 40 },  { x: 398, y: 479, width: 70, height: 10 }, { x: 398, y: 418, width: 70, height: 5 },// SP
            { x: 1093, y: 0, width: 109, height: 120 }, { x: 1120, y: 120, width: 100, height: 200 }, { x: 1085, y: 270, width: 100, height: 70 },  { x: 1020, y: 310, width: 165, height: 60 },  { x: 986, y: 344, width: 150, height: 60 },  { x: 952, y: 380, width: 144, height: 60 }, { x: 910, y: 410, width: 140, height: 60 }, { x: 851, y: 438, width: 170, height: 60 }, { x: 851, y: 497, width: 140, height: 90 }, { x: 707, y: 457, width: 63, height: 59 }, { x: 687, y: 477, width: 20, height: 39 }, { x: 662, y: 494, width: 25, height: 22 },  { x: 398, y: 489, width: 92, height: 80 }, { x: 451, y: 569, width: 39, height: 20 },// Rio
            { x: 1187, y: 485, width: 22, height: 25 }, { x: 1077, y: 622, width: 10, height: 20 }, { x: 1043, y: 194, width: 77, height: 17 }, //Pedras
            { x: 986, y: 128, width: 134, height: 50 },  { x: 1125, y: 598, width: 18, height: 45 }, { x: 1313, y: 512, width: 22, height: 52 }, { x: 1235, y: 427, width: 1, height: 30 }, { x: 1290, y: 608, width: 1, height: 30 }, { x: 841, y: 642, width: 1, height: 30 },{ x: 900, y: 186, width: 10, height: 30 }, { x: 690, y: 259, width: 20, height: 30 },  { x: 295, y: 415, width: 1, height: 30 }, { x: 240, y: 445, width: 1, height: 30 }, { x: 100, y: 472, width: 1, height: 29 },  { x: 382, y: 82, width: 1, height: 30 },// Árvores
        ]

    },
    'japan': {
        mapSrc: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/mapajapan%20(1).png',
        mapWidth: 1600, mapHeight: 896,
        startPos: { x: 100, y: 200 },
        collisions: [
            { x: 0, y: 0, width: 0, height: 0 },
        ]
    }
};

// --- Estado Global do Jogo ---
let currentLevelId = 'library';
let isGameLoopRunning = false;
let isLoadingLevel = false;

// --- CARREGAMENTO DE ASSETS ---
const assets = {
    maps:{},
    player: {
        runRight: new Image(), runLeft: new Image(), runUp: new Image(), runDown: new Image(),
        idleDown: new Image(), idleUp: new Image(), idleLeft: new Image(), idleRight: new Image()
    }
};
const playerAssetUrls = {
    runRight: 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_right.png',
    runLeft: 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_left.png',
    runUp: 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_up.png',
    runDown: 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_down.png',
    idleDown: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/idle_down.png',
    idleUp: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/idle_up.png',
    idleLeft: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/idle_left.png',
    idleRight: 'https://uploads.onecompiler.io/43rzumf93/44293xhug/idle_right.png'
};

// ---  OBJETOS E ESTADO DO JOGO ---
const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };
const player = {
    x: 0, y: 0, width: 0, height: 0, drawWidth: 0, drawHeight: 0,
    hitbox: { offsetX: 0, offsetY: 0, width: 0, height: 0 },
    speed: 5, state: 'idleDown', direction: 'down',
    currentFrame: 0, animationSpeed: 6, frameCount: 0,
    animations: {
        runRight: { totalFrames: 8 }, runLeft:  { totalFrames: 8 }, runUp: { totalFrames: 8 },
        runDown:  { totalFrames: 8 }, idleDown: { totalFrames: 8 }, idleUp:   { totalFrames: 8 },
        idleLeft: { totalFrames: 8 }, idleRight:{ totalFrames: 8 }
    },
    targetX: null, targetY: null
};
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const mouse = { worldX: 0, worldY: 0 };
const joystick = { active: false, touchId: null, baseX: 0, baseY: 0, radius: 0, deadzone: 0 };

// --- FUNÇÕES DE CONTROLO E INPUT ---
function updateJoystickPosition() {
    const rect = joystickContainer.getBoundingClientRect();
    joystick.baseX = rect.left + rect.width / 2;
    joystick.baseY = rect.top + rect.height / 2;
    joystick.radius = rect.width / 2;
    joystick.deadzone = joystick.radius * 0.2;
}

function initJoystick() {
    const isMobile = 'ontouchstart' in window;
    if (!isMobile) {
        joystickContainer.style.display = 'none';
        actionButton.style.display = 'none';
        return;
    }
    joystickContainer.style.display = 'block';
    actionButton.style.display = 'flex';
    updateJoystickPosition();
    joystickContainer.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('touchcancel', onTouchEnd, { passive: false });
    actionButton.addEventListener('touchstart', (e) => { e.preventDefault(); actionButton.classList.add('pressed'); handleInteraction(); }, { passive: false });
    actionButton.addEventListener('touchend', (e) => { e.preventDefault(); actionButton.classList.remove('pressed'); }, { passive: false });
}

function onTouchStart(event) {
    event.preventDefault();
    if (joystick.active) return;
    const touch = event.changedTouches[0];
    joystick.active = true;
    joystick.touchId = touch.identifier;
    onTouchMove(event);
}

function onTouchMove(event) {
    if (!joystick.active) return;
    let touch;
    for (let i = 0; i < event.changedTouches.length; i++) {
        if (event.changedTouches[i].identifier === joystick.touchId) {
            touch = event.changedTouches[i];
            break;
        }
    }
    if (!touch) return;
    event.preventDefault();
    let dx = touch.clientX - joystick.baseX;
    let dy = touch.clientY - joystick.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > joystick.radius) {
        dx = (dx / distance) * joystick.radius;
        dy = (dy / distance) * joystick.radius;
    }
    joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
    keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
    if (distance < joystick.deadzone) return;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx > absDy) {
        if (dx > 0) keys.ArrowRight = true; else keys.ArrowLeft = true;
    } else {
        if (dy > 0) keys.ArrowDown = true; else keys.ArrowUp = true;
    }
}

function onTouchEnd(event) {
    if (!joystick.active) return;
    let isOurTouch = false;
    for (let i = 0; i < event.changedTouches.length; i++) {
        if (event.changedTouches[i].identifier === joystick.touchId) {
            isOurTouch = true;
            break;
        }
    }
    if (!isOurTouch) return;
    joystick.active = false;
    joystick.touchId = null;
    joystickStick.style.transform = 'translate(0px, 0px)';
    keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
}

function initClickToMove() {
    canvas.addEventListener('click', handleWorldPointer);
    canvas.addEventListener('touchstart', handleWorldPointer, { passive: false });
}

function handleWorldPointer(event) {
    let targetId = event.target ? event.target.id : '';
    if (targetId === 'joystick-container' || targetId === 'joystick-stick' || targetId === 'action-button') return;
    event.preventDefault();
    let clientX, clientY;
    if (event.type === 'touchstart') {
        if (event.touches.length > 1) return;
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const screenX = (clientX - rect.left) * scaleX;
    const screenY = (clientY - rect.top) * scaleY;
    const worldX = screenX + camera.x;
    const worldY = screenY + camera.y;
    findNearestHotspot(worldX, worldY);
}

function findNearestHotspot(worldX, worldY) {
    const levelData = levels[currentLevelId];
    if (!levelData.hotspots || isLoadingLevel) return;
    let nearestHotspot = null;
    let minDistance = Infinity;
    const clickRadius = 150;
    for (const hotspot of levelData.hotspots) {
        const dx = hotspot.x - worldX;
        const dy = hotspot.y - worldY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance && distance < clickRadius) {
            minDistance = distance;
            nearestHotspot = hotspot;
        }
    }
    if (nearestHotspot) {
        player.targetX = nearestHotspot.x;
        player.targetY = nearestHotspot.y;
        keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
    }
}

function initDebugTools() {
    if (!DEBUG_MODE) return;
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouse.worldX = Math.floor((event.clientX - rect.left) * scaleX + camera.x);
        mouse.worldY = Math.floor((event.clientY - rect.top) * scaleY + camera.y);
    });
}

// --- "Ouvintes" de Teclado ---
window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const canvasStyle = window.getComputedStyle(canvas);
    if (canvasStyle.display === 'none') {
        if (event.key === 'Enter') {
            event.preventDefault();
            startGame();
        }
        return;
    }
    if (event.key in keys) {
        event.preventDefault();
        keys[event.key] = true;
    }
    if (event.key === 'Enter' || event.key === 'e' || event.key === 'E') {
        event.preventDefault();
        handleInteraction();
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        event.preventDefault();
        keys[event.key] = false;
    }
});

window.addEventListener('blur', () => {
    keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
});

// --- FUNÇÕES PRINCIPAIS DO JOGO ---
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function handleInteraction() {
    if (isLoadingLevel) return;
    if (currentLevelId === 'library') loadLevel('egypt');
    else if (currentLevelId === 'egypt') loadLevel('japan');
    else if (currentLevelId === 'japan') loadLevel('library');
}

function resizeCanvas() {
    const aspectRatio = GAME_WIDTH / GAME_HEIGHT;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    let newWidth, newHeight;
    if (windowRatio > aspectRatio) {
        newHeight = windowHeight;
        newWidth = newHeight * aspectRatio;
    } else {
        newWidth = windowWidth;
        newHeight = newWidth / aspectRatio;
    }
    canvas.style.width = `${Math.floor(newWidth)}px`;
    canvas.style.height = `${Math.floor(newHeight)}px`;
    if ('ontouchstart' in window) {
        updateJoystickPosition();
    }
}

function update() {
    if (isLoadingLevel) return;
    const levelData = levels[currentLevelId];
    const oldX = player.x;
    const oldY = player.y;
    let dx = 0, dy = 0;
    let wantsToMove = false;

    if (keys.ArrowUp) { dy -= player.speed; }
    if (keys.ArrowDown) { dy += player.speed; }
    if (keys.ArrowLeft) { dx -= player.speed; }
    if (keys.ArrowRight) { dx += player.speed; }

    if (dx !== 0 || dy !== 0) {
        wantsToMove = true;
        player.targetX = player.targetY = null;
    } else if (player.targetX !== null && player.targetY !== null) {
        const targetX_centered = player.targetX - (player.drawWidth / 2);
        const targetY_centered = player.targetY - (player.drawHeight / 2);
        const vecX = targetX_centered - player.x;
        const vecY = targetY_centered - player.y;
        const distance = Math.sqrt(vecX * vecX + vecY * vecY);
        if (distance < player.speed) {
            player.x = targetX_centered;
            player.y = targetY_centered;
            player.targetX = player.targetY = null;
            wantsToMove = false;
        } else {
            dx = (vecX / distance) * player.speed;
            dy = (vecY / distance) * player.speed;
            wantsToMove = true;
        }
    }

    if (wantsToMove) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) { player.state = 'runRight'; player.direction = 'right'; } 
            else { player.state = 'runLeft'; player.direction = 'left'; }
        } else if (dy !== 0) {
            if (dy > 0) { player.state = 'runDown'; player.direction = 'down'; } 
            else { player.state = 'runUp'; player.direction = 'up'; }
        }
    } else {
        if (player.direction === 'up') player.state = 'idleUp';
        else if (player.direction === 'left') player.state = 'idleLeft';
        else if (player.direction === 'right') player.state = 'idleRight';
        else player.state = 'idleDown';
    }

    if (dx !== 0) {
        player.x += dx;
        const playerHitbox = { x: player.x + player.hitbox.offsetX, y: oldY + player.hitbox.offsetY, width: player.hitbox.width, height: player.hitbox.height };
        if (levelData.collisions) {
            for (const collisionBox of levelData.collisions) { if (checkCollision(playerHitbox, collisionBox)) { player.x = oldX; break; } }
        }
    }
    if (dy !== 0) {
        player.y += dy;
        const playerHitbox = { x: player.x + player.hitbox.offsetX, y: player.y + player.hitbox.offsetY, width: player.hitbox.width, height: player.hitbox.height };
        if (levelData.collisions) {
            for (const collisionBox of levelData.collisions) { if (checkCollision(playerHitbox, collisionBox)) { player.y = oldY; break; } }
        }
    }

    player.frameCount++;
    if (player.frameCount >= player.animationSpeed) {
        player.frameCount = 0;
        player.currentFrame = (player.currentFrame + 1) % player.animations[player.state].totalFrames;
    }

    player.x = Math.max(0, Math.min(player.x, levelData.mapWidth - player.drawWidth));
    player.y = Math.max(0, Math.min(player.y, levelData.mapHeight - player.drawHeight));
    
    const boxLeft = camera.x + (camera.width - CAMERA_BOX_WIDTH) / 2;
    const boxRight = boxLeft + CAMERA_BOX_WIDTH;
    const boxTop = camera.y + (camera.height - CAMERA_BOX_HEIGHT) / 2;
    const boxBottom = boxTop + CAMERA_BOX_HEIGHT;
    if (player.x < boxLeft) camera.x = player.x - (camera.width - CAMERA_BOX_WIDTH) / 2;
    else if (player.x + player.drawWidth > boxRight) camera.x = player.x + player.drawWidth - CAMERA_BOX_WIDTH - (camera.width - CAMERA_BOX_WIDTH) / 2;
    if (player.y < boxTop) camera.y = player.y - (camera.height - CAMERA_BOX_HEIGHT) / 2;
    else if (player.y + player.drawHeight > boxBottom) camera.y = player.y + player.drawHeight - CAMERA_BOX_HEIGHT - (camera.height - CAMERA_BOX_HEIGHT) / 2;
    camera.x = Math.max(0, Math.min(camera.x, levelData.mapWidth - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, levelData.mapHeight - camera.height));
}

function draw() {
    if (isLoadingLevel) return;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    const levelData = levels[currentLevelId];
    const currentMapImage = assets.maps[currentLevelId];

    if (currentMapImage && currentMapImage.complete) {
        ctx.drawImage(currentMapImage, 0, 0, levelData.mapWidth, levelData.mapHeight);
    }

    if (levelData.hotspots) {
        ctx.save();
        for (const hotspot of levelData.hotspots) {
            const pulse = Math.abs(Math.sin(Date.now() / 300));
            const radius = 15 + pulse * 5;
            ctx.beginPath();
            ctx.arc(hotspot.x, hotspot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 220, 0, 0.4)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.fillText(hotspot.name, hotspot.x, hotspot.y - (radius + 10));
        }
        ctx.restore();
    }
    
    let currentSpriteSheet;
    switch (player.state) {
        case 'runUp': currentSpriteSheet = assets.player.runUp; break;
        case 'runLeft': currentSpriteSheet = assets.player.runLeft; break;
        case 'runRight': currentSpriteSheet = assets.player.runRight; break;
        case 'runDown': currentSpriteSheet = assets.player.runDown; break;
        case 'idleUp': currentSpriteSheet = assets.player.idleUp; break;
        case 'idleLeft': currentSpriteSheet = assets.player.idleLeft; break;
        case 'idleRight': currentSpriteSheet = assets.player.idleRight; break;
        case 'idleDown': default: currentSpriteSheet = assets.player.idleDown; break;
    }
    if (currentSpriteSheet && currentSpriteSheet.complete && player.width > 0) {
        const sx = player.currentFrame * player.width;
        const sy = 0; 
        ctx.drawImage(currentSpriteSheet, sx, sy, player.width, player.height, player.x, player.y, player.drawWidth, player.drawHeight);
    }
    
    if (DEBUG_MODE) {
        if (levelData.collisions) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            for (const collisionBox of levelData.collisions) {
                ctx.fillRect(collisionBox.x, collisionBox.y, collisionBox.width, collisionBox.height);
            }
        }
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x + player.hitbox.offsetX, player.y + player.hitbox.offsetY, player.hitbox.width, player.hitbox.height);
    }

    ctx.restore();

    if (DEBUG_MODE) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, 10, 250, 30);
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = 'lime';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        const coordsText = `X: ${mouse.worldX}, Y: ${mouse.worldY}`;
        ctx.fillText(coordsText, 15, 32);
    }
}

function gameLoop() {
    if (!isGameLoopRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function loadLevel(levelId) {
    if (isLoadingLevel) return;
    isLoadingLevel = true;
    startScreen.style.display = 'flex';
    startScreen.innerText = 'Carregando...';
    const levelData = levels[levelId];
    const onMapReady = () => {
        currentLevelId = levelId;
        if (currentLevelId === 'library') {
            player.drawWidth = player.width * LIBRARY_PLAYER_SCALE;
            player.drawHeight = player.height * LIBRARY_PLAYER_SCALE;
        } else {
            player.drawWidth = player.width;
            player.drawHeight = player.height;
        }
        player.hitbox.width = player.drawWidth * 0.5;
        player.hitbox.height = player.drawHeight * 0.3;
        player.hitbox.offsetX = (player.drawWidth - player.hitbox.width) / 2;
        player.hitbox.offsetY = player.drawHeight * 0.7;
        player.x = levelData.startPos.x - (player.drawWidth / 2);
        player.y = levelData.startPos.y - (player.drawHeight / 2);
        player.targetX = player.targetY = null;
        camera.x = player.x - (camera.width / 2) + (player.drawWidth / 2);
        camera.y = player.y - (camera.height / 2) + (player.drawHeight / 2);
        camera.x = Math.max(0, Math.min(camera.x, levelData.mapWidth - camera.width));
        camera.y = Math.max(0, Math.min(camera.y, levelData.mapHeight - camera.height));
        startScreen.style.display = 'none';
        isLoadingLevel = false;
        if (!isGameLoopRunning) {
            isGameLoopRunning = true;
            gameLoop();
        }
    };
    if (assets.maps[levelId] && assets.maps[levelId].complete) {
        onMapReady();
    } else {
        assets.maps[levelId] = new Image();
        assets.maps[levelId].onload = onMapReady;
        assets.maps[levelId].onerror = () => console.error(`Erro ao carregar o mapa: ${levelData.mapSrc}`);
        assets.maps[levelId].src = levelData.mapSrc;
    }
}

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    resizeCanvas();
    startScreen.style.display = 'flex';
    startScreen.innerText = 'Carregando Jogo...';
    let playerAssetsLoaded = 0;
    const totalPlayerAssets = Object.keys(playerAssetUrls).length;
    
    const onPlayerAssetLoad = () => {
        playerAssetsLoaded++;
        if (playerAssetsLoaded === totalPlayerAssets) {
            runFinalSetupAndLoadFirstLevel();
        }
    };

    const runFinalSetupAndLoadFirstLevel = () => {
        const frameData = assets.player.idleDown;
        if (frameData.complete && frameData.naturalWidth > 0) {
             player.width = frameData.naturalWidth / player.animations.idleDown.totalFrames;
             player.height = frameData.naturalHeight;
        } else {
             player.width = 64; player.height = 64;
        }
        player.drawWidth = player.width;
        player.drawHeight = player.height;
        loadLevel('japan');
    };

    let allReady = true;
    for(const key in assets.player){
        const img = assets.player[key];
        if(!img.complete || img.naturalWidth === 0){
            allReady = false;
            break;
        }
    }

    if(allReady){
        runFinalSetupAndLoadFirstLevel();
    } else {
        const onError = (assetName, e) => console.error(`ERRO AO CARREGAR ASSET: ${assetName}`, e);
        for(const key in playerAssetUrls){
            assets.player[key].onload = onPlayerAssetLoad;
            assets.player[key].onerror = (e) => onError(key, e);
            assets.player[key].src = playerAssetUrls[key];
        }
    }
}

// --- PONTO DE ENTRADA ---
resizeCanvas();
initJoystick();
initClickToMove();
initDebugTools();
startGame();

// Preenchimento das funções de input para garantir que existem
// (O seu ficheiro já deve ter estas definições completas, isto é uma salvaguarda)
if (typeof onTouchStart !== 'function') {
    window.onTouchStart = function(event) { event.preventDefault(); if (joystick.active) return; const touch = event.changedTouches[0]; joystick.active = true; joystick.touchId = touch.identifier; onTouchMove(event); };
    window.onTouchMove = function(event) { if (!joystick.active) return; let touch; for (let i = 0; i < event.changedTouches.length; i++) { if (event.changedTouches[i].identifier === joystick.touchId) { touch = event.changedTouches[i]; break; } } if (!touch) return; event.preventDefault(); let dx = touch.clientX - joystick.baseX; let dy = touch.clientY - joystick.baseY; const distance = Math.sqrt(dx * dx + dy * dy); if (distance > joystick.radius) { dx = (dx / distance) * joystick.radius; dy = (dy / distance) * joystick.radius; } joystickStick.style.transform = `translate(${dx}px, ${dy}px)`; keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false; if (distance < joystick.deadzone) return; const absDx = Math.abs(dx); const absDy = Math.abs(dy); if (absDx > absDy) { if (dx > 0) keys.ArrowRight = true; else keys.ArrowLeft = true; } else { if (dy > 0) keys.ArrowDown = true; else keys.ArrowUp = true; }};
    window.onTouchEnd = function(event) { if (!joystick.active) return; let isOurTouch = false; for (let i = 0; i < event.changedTouches.length; i++) { if (event.changedTouches[i].identifier === joystick.touchId) { isOurTouch = true; break; } } if (!isOurTouch) return; joystick.active = false; joystick.touchId = null; joystickStick.style.transform = 'translate(0px, 0px)'; keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false; };
}

});
