document.addEventListener('DOMContentLoaded', () =>{

// ---  CONFIGURAÇÕES E CONSTANTES ---

const GAME_WIDTH = 1280; // Sua resolução interna
const GAME_HEIGHT = 720; // Sua resolução interna
const MAP_WIDTH = 3200; // resolução do mapa
const MAP_HEIGHT = 1792; // resolução do mapa

// ---  REFERÊNCIAS AOS ELEMENTOS HTML (agora no topo) ---

const startScreen = document.getElementById('start-screen');
const canvas = document.getElementById('gameCanvas');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext('2d');

// Configuração para manter o pixel art nítido
ctx.imageSmoothingEnabled = false;
canvas.style.imageRendering = 'pixelated';
    
// ---  CONSTANTES QUE DEPENDEM DO CANVAS --

// Constantes para câmera
// Define o tamanho da "dead zone" no centro da tela
const CAMERA_BOX_WIDTH = canvas.width * 0.5; // 50% da largura da tela
const CAMERA_BOX_HEIGHT = canvas.height * 0.5; // 50% da altura da tela

// CARREGAMENTO DE ASSETS (substitua sua lógica de 'mapImage') ---
const assets = {
    map: new Image(),
    player: {
        runRight: new Image(),
        runLeft: new Image(),
        runUp: new Image(),
        runDown: new Image()
        // idleDown: new Image()
    }
};

// Inicia o carregamento de tudo em segundo plano
assets.map.src = 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/d23.png';
assets.player.runRight.src = 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_right.png';
assets.player.runLeft.src = 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_left.png';
assets.player.runUp.src = 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_up.png';
assets.player.runDown.src = 'https://uploads.onecompiler.io/43rztqetx/43zh9k8ba/run_down.png';
// assets.player.idleDown.src = 'caminho/para/idle_down.png';

// ---  OBJETOS E ESTADO DO JOGO ---

// A câmera começa na posição 0,0 do mapa e tem o tamanho da tela do jogo
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 0,
    height: 0,
    speed: 3.5,
    
  // --- Nova Máquina de Estados ---
    state: 'idle', // 'idle', 'runUp', 'runDown', 'runLeft', 'runRight'
    direction: 'down', // 'up', 'down', 'left', 'right' (para saber qual 'idle' usar)
    
// -- PROPRIEDADES DE ANIMAÇÃO --

    currentFrame: 0, // O frame que estamos exibindo no momento

    // Controle de velocidade da animação
    animationSpeed: 6, // Mude este número para animar mais rápido ou mais lento (menor = mais rápido)
    frameCount: 0,     // Um contador para ajudar a controlar a velocidade
    
    // Metadados de cada animação (quantos frames tem cada sprite sheet)
    animations: {
        runRight: { totalFrames: 8 },
        runLeft:  { totalFrames: 8 },
        runUp:    { totalFrames: 8 }, // Este sprite sheet tem 8 frames
        runDown:  { totalFrames: 8 },
        idle:     { totalFrames: 1 } // Por enquanto, o idle é 1 frame (quando tiver, mude)
    }
};


//Estado do teclado
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Adciona os "ouvintes" de eventos
document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        event.preventDefault();
        keys[event.key] = true;
    
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
        
    }
});

// --- 6. FUNÇÕES PRINCIPAIS DO JOGO ---

function resizeCanvas() {
  
    const aspectRatio = 16/9 
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calcula a proporção da janela e do jogo
    const windowRatio = windowWidth / windowHeight;

    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    // Se a janela for mais "larga" que o jogo, a altura é o fator limitante
    if (windowRatio > aspectRatio) {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
    } 
    // Se a janela for mais "alta" que o jogo, a largura é o fator limitante
    else {
        newWidth = window.innerWidth;
        newHeight = newWidth / aspectRatio;
    }

    // Aplica o novo tamanho ao estilo do canvas
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}
window.addEventListener('resize', resizeCanvas);
// Chama a função uma vez no início
resizeCanvas();

// Adiciona um "ouvinte" para chamar a função sempre que a janela mudar de tamanho


function update() {
    let isMoving = false;
    
    // Atualiza a variação de movimento com base nas teclas pressionadas
    if (keys.ArrowUp) {
        player.y -= player.speed;
        player.state = 'runUp';
        player.direction = 'up';
        isMoving = true;
    }
    else if (keys.ArrowDown) {
        player.y += player.speed;
        player.state = 'runDown';
        player.direction = 'down';
        isMoving = true;
    }
    else if (keys.ArrowLeft) {
        player.x -= player.speed;
        player.state = 'runLeft';
        player.direction = 'left';
        isMoving = true;
    }
    else if (keys.ArrowRight) {
        player.x += player.speed;
        player.state = 'runRight';
        player.direction = 'right';
        isMoving = true;
    } else {
        // Se nenhuma tecla de movimento está pressionada, fica 'idle'
        player.state = 'idle';
        isMoving = false;
    }
    
    // --- LÓGICA DE ANIMAÇÃO ---
    player.frameCount++;
    if (player.frameCount >= player.animationSpeed) {
        player.frameCount = 0;
        
        // Pega os metadados da animação ATUAL
        let animData = player.animations[player.state];
        
        // Se o estado for 'idle', não animamos por enquanto
        if (player.state === 'idle') {
            // (Quando você tiver o sprite de 'idle' animado, mudamos aqui)
            player.currentFrame = 0;
        } else {
            // Avança o frame da animação e dá a volta
            player.currentFrame = (player.currentFrame + 1) % animData.totalFrames;
        }
    }
    
    // --- 2. Limitar o Jogador aos Limites do MAPA ---
    player.x = Math.max(0, Math.min(player.x, MAP_WIDTH - player.width));
    player.y = Math.max(0, Math.min(player.y, MAP_HEIGHT - player.height));
    
    // --- 3. LÓGICA DA CÂMERA COM "CAIXA INVISÍVEL" ---

    // Calcula as coordenadas das bordas da caixa invisível.
    // A caixa está sempre centralizada na CÂMERA.
    const boxLeft = camera.x + (camera.width - CAMERA_BOX_WIDTH) / 2;
    const boxRight = boxLeft + CAMERA_BOX_WIDTH;
    const boxTop = camera.y + (camera.height - CAMERA_BOX_HEIGHT) / 2;
    const boxBottom = boxTop + CAMERA_BOX_HEIGHT;

    // Verifica se o jogador saiu da caixa e move a câmera de acordo

    // Se o jogador está muito para a esquerda
    if (player.x < boxLeft) {
        camera.x = player.x - (camera.width - CAMERA_BOX_WIDTH) / 2;
    }
    // Se o jogador está muito para a direita
    else if (player.x + player.width > boxRight) {
        camera.x = player.x + player.width - CAMERA_BOX_WIDTH - (camera.width - CAMERA_BOX_WIDTH) / 2;
    }
    // Se o jogador está muito para cima
    if (player.y < boxTop) {
        camera.y = player.y - (camera.height - CAMERA_BOX_HEIGHT) / 2;
    }
    // Se o jogador está muito para baixo
    else if (player.y + player.height > boxBottom) {
        camera.y = player.y + player.height - CAMERA_BOX_HEIGHT - (camera.height - CAMERA_BOX_HEIGHT) / 2;
    }
    
    // --- 4. Limitar a CÂMERA aos Limites do MAPA ---
    // (Esta lógica final garante que a câmera nunca mostre fora do mapa)
    camera.x = Math.max(0, Math.min(camera.x, MAP_WIDTH - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, MAP_HEIGHT - camera.height));
}


function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    // Aplica a lógica da câmera
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // 1. Desenha o mapa
    if (assets.map.complete) {
      ctx.drawImage(assets.map, 0, 0, MAP_WIDTH, MAP_HEIGHT);
    }
    
    // --- DESENHA O JOGADOR ANIMADO ---
    let currentSpriteSheet;
    
    // Seleciona qual sprite sheet usar baseado no estado
    switch (player.state) {
        case 'runUp':
            currentSpriteSheet = assets.player.runUp;
            break;
        case 'runLeft':
            currentSpriteSheet = assets.player.runLeft;
            break;
        case 'runRight':
            currentSpriteSheet = assets.player.runRight;
            break;
        case 'runDown':
            currentSpriteSheet = assets.player.runDown;
            break;
        case 'idle':
        default:
            // Se está 'idle', usa o sprite da última direção, parado
            // (Quando tiver 'idleDown', 'idleUp', etc., mudamos aqui)
            switch (player.direction) {
                case 'up': currentSpriteSheet = assets.player.runUp; break;
                case 'left': currentSpriteSheet = assets.player.runLeft; break;
                case 'right': currentSpriteSheet = assets.player.runRight; break;
                default: currentSpriteSheet = assets.player.runDown; break;
            }
            break;
    }
    
    // 3. Calcula e desenha o frame
    if (currentSpriteSheet && currentSpriteSheet.complete) {
        // sx: A posição X do frame que queremos RECORTAR
        const sx = player.currentFrame * player.width;
        const sy = 0; // sy é 0 porque todos os sprites estão na mesma linha

        ctx.drawImage(
            currentSpriteSheet,
            sx, sy, player.width, player.height, // Recorte da imagem original
            player.x, player.y, player.width, player.height // Posição no canvas
        );
    }
    
    ctx.restore(); // Restaura o estado do canvas (remove o espelhamento)
}



function gameLoop() {

    // 2. Atualizar a lógica do jogo
    update();

    // 3. Renderizar os elementos
    draw();

    // Solicita o próximo quadro de animação
    requestAnimationFrame(gameLoop);
}

function startGame() {
        // 1. Esconde a tela de início
        startScreen.style.display = 'none';
        
        // 2. Mostra o canvas do jogo
        canvas.style.display = 'block';

        // 3. VERIFICA O ESTADO DA IMAGEM E INICIA O JOGO
        resizeCanvas();
        
        // Função que realmente começa o jogo
        
        const runGame = () => {
            // Define o tamanho do jogador com base em um dos sprites
            // (Assumindo que todos têm o mesmo tamanho de frame)
            const frameData = assets.player.runDown;
            player.width = frameData.width / player.animations.runDown.totalFrames;
            player.height = frameData.height;
            gameLoop();
      };
       // Verifica se TUDO está carregado
        const allAssetsReady = assets.map.complete &&
                         assets.player.runRight.complete &&
                         assets.player.runLeft.complete &&
                         assets.player.runUp.complete &&
                         assets.player.runDown.complete;
                         // && assets.player.idleDown.complete (quando tiver)

        if (allAssetsReady) {
            runGame();
        } else {
            let assetsLoaded = 0;
            const totalAssets = 5;
            const onAssetLoad = () => {
                assetsLoaded++;
                if (assetsLoaded === totalAssets) {
                    runGame();
                }
            };
            
            assets.map.onload = onAssetLoad;
            assets.player.runRight.onload = onAssetLoad;
            assets.player.runLeft.onload = onAssetLoad;
            assets.player.runUp.onload = onAssetLoad;
            assets.player.runDown.onload = onAssetLoad;
    }
}

    
    // Adiciona um "ouvinte" que espera o jogador apertar Enter
    window.addEventListener('keydown', (event) => {
      const canvasStyle = window.getComputedStyle(canvas);
        // Verifica se a tecla pressionada foi "Enter" E se o jogo ainda não começou
        if (event.key === 'Enter' && canvasStyle.display === 'none') {
            startGame();
        }
    });
  
});
