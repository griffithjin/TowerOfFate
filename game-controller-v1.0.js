/**
 * 命运塔·首登者 V1.0 - 游戏控制器
 * First Ascender V1.0 - Game Controller
 * 连接UI与核心逻辑，处理用户交互
 */

// ============================================
// 游戏状态管理
// ============================================
const GameState = {
    currentScreen: 'home',
    game: null,
    mode: null,
    players: [],
    currentPlayer: null,
    selectedCardIndex: null,
    timer: null,
    countdown: 15,
    isAITurn: false,
    
    // 用户数据
    user: {
        name: '玩家',
        coins: 10000,
        diamonds: 100,
        level: 1,
        exp: 0
    },
    
    // 设备和效果系统
    deviceAdapter: null,
    effectsSystem: null
};

// ============================================
// 屏幕切换
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId + '-screen').classList.add('active');
    GameState.currentScreen = screenId;
}

// ============================================
// 首页功能
// ============================================
function startGame(mode) {
    GameState.mode = mode;
    showScreen('loading');
    
    // 模拟匹配
    setTimeout(() => {
        initGame(mode);
        showScreen('game');
    }, 1500);
}

function quickMatch() {
    // 随机选择模式
    const modes = ['solo', 'team', 'streak'];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    startGame(mode);
}

function showShop() {
    window.location.href = 'shop.html';
}

function showTournament() {
    window.location.href = 'tournament.html';
}

function showTasks() {
    alert('任务功能开发中...');
}

function showRank() {
    alert('排行榜功能开发中...');
}

function showUserCenter() {
    alert('用户中心功能开发中...');
}

// ============================================
// 游戏初始化
// ============================================
function initGame(mode) {
    // 创建玩家
    const players = [];
    
    // 当前玩家
    const self = new Player('p1', GameState.user.name, false);
    players.push(self);
    GameState.currentPlayer = self;
    
    if (mode === 'solo') {
        // 个人赛：1v3 AI
        for (let i = 2; i <= 4; i++) {
            players.push(new Player(`p${i}`, `AI${i-1}`, true));
        }
        GameState.game = new FirstAscenderGame(CONSTANTS.MODES.SOLO, players);
    } else if (mode === 'team') {
        // 团队赛：2v2
        players.push(new Player('p2', '队友', false));
        players.push(new Player('p3', '敌方1', true));
        players.push(new Player('p4', '敌方2', true));
        GameState.game = new FirstAscenderGame(CONSTANTS.MODES.TEAM, players);
    } else if (mode === 'streak') {
        // 连胜模式
        GameState.game = new StreakModeGame();
        GameState.game.init();
        renderStreakMode();
        return;
    }
    
    // 初始化游戏
    GameState.game.init();
    
    // 渲染游戏界面
    renderGame();
    
    // 开始倒计时
    startCountdown();
    
    // 如果AI先开始
    if (GameState.game.players[GameState.game.currentPlayerIndex]?.isAI) {
        setTimeout(playAITurn, 1000);
    }
}

// ============================================
// 渲染游戏界面
// ============================================
function renderGame() {
    const game = GameState.game;
    const currentPlayer = GameState.currentPlayer;
    
    // 更新玩家信息
    document.getElementById('current-round').textContent = game.currentRound;
    document.getElementById('hand-count').textContent = currentPlayer.handCards.length;
    document.getElementById('current-level').textContent = `第 ${CardUtils.getLevelName(currentPlayer.level)} 层`;
    
    // 渲染塔
    renderTower();
    
    // 渲染守卫信息
    renderGuardInfo();
    
    // 渲染激怒牌
    renderProvocationCards();
    
    // 渲染其他玩家
    renderOtherPlayers();
    
    // 渲染手牌
    renderHandCards();
}

// 渲染塔
function renderTower() {
    const towerLayers = document.getElementById('tower-layers');
    towerLayers.innerHTML = '';
    
    for (let i = CONSTANTS.MAX_LEVEL; i >= 1; i--) {
        const layer = document.createElement('div');
        layer.className = 'tower-layer';
        layer.dataset.level = i;
        layer.textContent = CardUtils.getLevelName(i);
        
        // 当前层高亮
        if (i === GameState.currentPlayer.level) {
            layer.classList.add('current');
        }
        
        // 失守层标记
        const guard = GameState.game.getGuardAtLevel(i);
        if (guard && guard.isDefeated) {
            layer.classList.add('defeated');
        }
        
        towerLayers.appendChild(layer);
    }
    
    // 渲染玩家位置
    renderPlayerMarkers();
}

// 渲染玩家位置标记
function renderPlayerMarkers() {
    const markersContainer = document.getElementById('player-markers');
    markersContainer.innerHTML = '';
    
    GameState.game.players.forEach((player, index) => {
        const marker = document.createElement('div');
        marker.className = 'player-marker';
        marker.textContent = index + 1;
        
        // 设置类型
        if (player === GameState.currentPlayer) {
            marker.classList.add('self');
        } else if (GameState.game.mode === CONSTANTS.MODES.TEAM) {
            // 团队赛：简化版，前2个是队友
            marker.classList.add(index < 2 ? 'teammate' : 'enemy');
        } else {
            marker.classList.add('ai');
        }
        
        // 计算位置
        const layerIndex = CONSTANTS.MAX_LEVEL - player.level;
        const layerElement = document.querySelector(`.tower-layer[data-level="${player.level}"]`);
        if (layerElement) {
            const offset = (index % 4) * 32 - 48;
            marker.style.bottom = `${layerIndex * 36 + 2}px`;
            marker.style.left = `calc(50% + ${offset}px)`;
        }
        
        markersContainer.appendChild(marker);
    });
}

// 渲染守卫信息
function renderGuardInfo() {
    const guard = GameState.game.getGuardAtLevel(GameState.currentPlayer.level);
    if (guard) {
        document.getElementById('guard-remaining').textContent = guard.guardCards.length;
        document.getElementById('provocation-remaining').textContent = guard.provocationCards.length;
    }
}

// 渲染激怒牌
function renderProvocationCards() {
    const container = document.getElementById('provocation-cards');
    container.innerHTML = '';
    
    const guard = GameState.game.getGuardAtLevel(GameState.currentPlayer.level);
    if (guard && guard.revealedProvocation) {
        guard.revealedProvocation.forEach(card => {
            const cardEl = createCardElement(card, false);
            container.appendChild(cardEl);
        });
    }
}

// 渲染其他玩家
function renderOtherPlayers() {
    const container = document.getElementById('other-players');
    container.innerHTML = '';
    
    GameState.game.players.forEach((player, index) => {
        if (player === GameState.currentPlayer) return;
        
        const playerEl = document.createElement('div');
        playerEl.className = 'other-player';
        playerEl.innerHTML = `
            <div class="avatar ${player.isAI ? 'ai' : 'player'}">${index + 1}</div>
            <span class="name">${player.name}</span>
            <span class="cards">${player.handCards.length}张</span>
        `;
        container.appendChild(playerEl);
    });
}

// 渲染手牌
function renderHandCards() {
    const container = document.getElementById('hand-cards');
    container.innerHTML = '';
    
    GameState.currentPlayer.handCards.forEach((card, index) => {
        const cardEl = createCardElement(card, true);
        cardEl.onclick = () => selectCard(index);
        
        if (index === GameState.selectedCardIndex) {
            cardEl.classList.add('selected');
        }
        
        container.appendChild(cardEl);
    });
    
    // 更新确认按钮状态
    updateConfirmButton();
}

// 创建卡牌元素
function createCardElement(card, isInteractive) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.color}`;
    cardEl.innerHTML = `
        <span class="suit">${card.suit}</span>
        <span class="rank">${card.rank}</span>
    `;
    return cardEl;
}

// ============================================
// 游戏交互
// ============================================
function selectCard(index) {
    if (GameState.isAITurn) return;
    
    GameState.selectedCardIndex = index;
    renderHandCards();
}

function updateConfirmButton() {
    const btn = document.getElementById('confirm-btn');
    btn.disabled = GameState.selectedCardIndex === null;
}

function confirmPlay() {
    if (GameState.selectedCardIndex === null) return;
    
    clearInterval(GameState.timer);
    
    const result = GameState.game.processPlayerTurn(
        GameState.currentPlayer,
        GameState.selectedCardIndex
    );
    
    if (result.error) {
        alert(result.error);
        return;
    }
    
    // 显示守卫牌
    showGuardCard(result.guardCard);
    
    // 处理结果
    setTimeout(() => {
        handleTurnResult(result);
    }, 1500);
}

// 显示守卫牌
function showGuardCard(card) {
    const slot = document.getElementById('guard-card-slot');
    const front = document.getElementById('guard-card-front') || document.createElement('div');
    
    front.id = 'guard-card-front';
    front.className = `card ${card.color}`;
    front.innerHTML = `
        <span class="suit">${card.suit}</span>
        <span class="rank">${card.rank}</span>
    `;
    
    slot.querySelector('.card-back').classList.add('hidden');
    slot.appendChild(front);
}

// 处理回合结果
function handleTurnResult(result) {
    // 重置守卫牌显示
    const slot = document.getElementById('guard-card-slot');
    slot.querySelector('.card-back').classList.remove('hidden');
    const front = document.getElementById('guard-card-front');
    if (front) front.remove();
    
    // 重置选择
    GameState.selectedCardIndex = null;
    
    // 显示结果提示
    let message = '';
    if (result.becameFirstAscender) {
        message = '🎉 你成为了首登者！';
    } else if (result.retreatLayers > 0) {
        message = `😱 激怒牌！回退 ${result.retreatLayers} 层`;
    } else if (result.isMatch) {
        message = '✅ 匹配成功！前进一层';
    } else {
        message = '❌ 匹配失败，留在本层';
    }
    
    // 简化版：直接显示
    console.log(message);
    
    // 更新界面
    renderGame();
    
    // 检查游戏结束
    if (GameState.game.state === 'ended') {
        showResult();
        return;
    }
    
    // 继续下一回合
    startCountdown();
}

// ============================================
// 倒计时
// ============================================
function startCountdown() {
    GameState.countdown = 15;
    document.getElementById('game-timer').textContent = GameState.countdown;
    document.getElementById('game-timer').classList.remove('warning');
    
    GameState.timer = setInterval(() => {
        GameState.countdown--;
        document.getElementById('game-timer').textContent = GameState.countdown;
        
        if (GameState.countdown <= 5) {
            document.getElementById('game-timer').classList.add('warning');
        }
        
        if (GameState.countdown <= 0) {
            clearInterval(GameState.timer);
            autoPlay();
        }
    }, 1000);
}

// 自动出牌
function autoPlay() {
    if (GameState.currentPlayer.handCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * GameState.currentPlayer.handCards.length);
        selectCard(randomIndex);
        confirmPlay();
    }
}

// AI回合
function playAITurn() {
    GameState.isAITurn = true;
    
    setTimeout(() => {
        const aiPlayer = GameState.game.players[GameState.game.currentPlayerIndex];
        if (aiPlayer && aiPlayer.handCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * aiPlayer.handCards.length);
            GameState.game.processPlayerTurn(aiPlayer, randomIndex);
            
            // 更新界面
            renderGame();
            
            // 检查结束
            if (GameState.game.state === 'ended') {
                showResult();
                return;
            }
        }
        
        GameState.isAITurn = false;
        startCountdown();
    }, 1500);
}

// ============================================
// 连胜模式渲染
// ============================================
function renderStreakMode() {
    const game = GameState.game;
    
    // 连胜模式简化界面
    document.getElementById('current-round').textContent = game.streakCount + 1;
    document.getElementById('hand-count').textContent = game.handCards.length;
    document.getElementById('current-level').textContent = `第 ${game.currentLevel} 关`;
    
    // 渲染手牌
    const container = document.getElementById('hand-cards');
    container.innerHTML = '';
    
    game.handCards.forEach((card, index) => {
        const cardEl = createCardElement(card, true);
        cardEl.onclick = () => {
            GameState.selectedCardIndex = index;
            renderStreakMode();
            playStreakTurn();
        };
        container.appendChild(cardEl);
    });
}

// 连胜模式回合
function playStreakTurn() {
    const result = GameState.game.playTurn(GameState.selectedCardIndex);
    
    if (result.error) {
        alert(result.error);
        return;
    }
    
    if (result.victory) {
        alert(`🏆 连胜${result.streak}次！总分：${result.score}`);
        showResult();
        return;
    }
    
    if (!result.success) {
        alert(`连胜中断！最终得分：${result.finalScore}`);
        showResult();
        return;
    }
    
    GameState.selectedCardIndex = null;
    renderStreakMode();
}

// ============================================
// 结算界面
// ============================================
function showResult() {
    const game = GameState.game;
    const scores = game.calculateScores ? game.calculateScores() : [];
    
    // 设置结果标题
    const winner = game.determineWinner ? game.determineWinner() : null;
    const isWin = winner === GameState.currentPlayer;
    
    document.getElementById('result-title').textContent = isWin ? '胜利!' : '失败';
    document.getElementById('result-icon').textContent = isWin ? '🏆' : '💔';
    document.getElementById('result-header').className = 'result-header ' + (isWin ? 'win' : 'lose');
    
    // 渲染分数板
    const board = document.getElementById('score-board');
    board.innerHTML = '';
    
    if (scores.length > 0) {
        scores.forEach(item => {
            const row = document.createElement('div');
            row.className = 'score-item';
            row.innerHTML = `
                <span class="name">${item.player}</span>
                <span class="score ${item.score > 0 ? 'positive' : 'negative'}">${item.score > 0 ? '+' : ''}${item.score}</span>
            `;
            board.appendChild(row);
        });
    } else {
        board.innerHTML = '<div class="score-item"><span>连胜模式结算</span></div>';
    }
    
    showScreen('result');
}

// ============================================
// 游戏控制
// ============================================
function playAgain() {
    showScreen('loading');
    setTimeout(() => {
        initGame(GameState.mode);
        showScreen('game');
    }, 1000);
}

function backToHome() {
    clearInterval(GameState.timer);
    GameState.game = null;
    GameState.selectedCardIndex = null;
    showScreen('home');
}

function showGameMenu() {
    const options = ['继续游戏', '返回首页'];
    const choice = confirm('返回首页？');
    if (choice) {
        backToHome();
    }
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 从localStorage加载用户数据
    const savedUser = localStorage.getItem('tof_user');
    if (savedUser) {
        GameState.user = JSON.parse(savedUser);
    }
    
    // 更新UI
    document.getElementById('user-coins').textContent = GameState.user.coins;
    document.getElementById('user-diamonds').textContent = GameState.user.diamonds;
    
    // 底部导航切换
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.screen) {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// 保存用户数据
window.addEventListener('beforeunload', () => {
    localStorage.setItem('tof_user', JSON.stringify(GameState.user));
});
