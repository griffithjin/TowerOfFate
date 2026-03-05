/**
 * 命运塔·首登者 - 统一塔渲染系统 V6.1
 * 
 * 核心规则：
 * 1. 塔结构：第2层(底部) -> A层(顶部)
 * 2. 所有玩家从第2层开始攀登
 * 3. 支持多玩家icon显示
 * 4. 支持嘲讽/鼓励动画
 */

const UnifiedTowerSystem = {
    // 层名定义（从下到上）
    LEVEL_NAMES: ['2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', 'J', 'Q', 'K', 'A'],
    
    /**
     * 渲染塔（统一接口）
     * @param {string} containerId - 容器ID
     * @param {Object} options - 配置选项
     * @param {Object} options.tower - 塔数据
     * @param {Array} options.players - 玩家数组 [{id, level, avatar, team, isMe}]
     * @param {Object} options.config - 其他配置
     */
    renderTower(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const { tower, players = [], config = {} } = options;
        
        // 获取塔数据
        let towerData = tower;
        if (!towerData || !towerData.pixels) {
            towerData = PixelTowerSystem?.library?.basic?.[0] || {
                name: '连胜之塔',
                country: '',
                color: '#FFD700',
                pixels: []
            };
        }
        
        let html = '';
        
        // 从下到上渲染：第1层=2️⃣(底部)，第13层=A(顶部)
        for (let i = 1; i <= 13; i++) {
            const levelName = this.LEVEL_NAMES[i - 1];
            
            // 获取该层上的玩家
            const playersOnLevel = players.filter(p => p.level === i);
            
            // 获取像素行
            let pixelLine = '';
            if (towerData.pixels && towerData.pixels.length >= (14 - i)) {
                pixelLine = towerData.pixels[13 - (i - 1)];
            }
            
            // 判断是否有玩家在该层
            const hasPlayer = playersOnLevel.length > 0;
            const isCurrentLevel = playersOnLevel.some(p => p.isMe);
            
            // 背景色
            let bgColor = 'rgba(255,255,255,0.1)';
            let textColor = '#888';
            
            if (hasPlayer) {
                // 如果有玩家，使用玩家团队颜色或塔颜色
                const player = playersOnLevel[0];
                bgColor = player.team === 'enemy' ? 'rgba(231,76,60,0.5)' : 
                         player.team === 'me' ? towerData.color :
                         'rgba(52,152,219,0.5)';
                textColor = '#fff';
            }
            
            // 霓虹效果（如果有我在这一层且塔支持霓虹）
            const glowStyle = towerData.neon && isCurrentLevel ? 
                `box-shadow: 0 0 10px ${towerData.color}; animation: neonPulse 1.5s infinite;` : '';
            
            // 生成玩家avatars
            let avatarsHtml = '';
            playersOnLevel.forEach((player, idx) => {
                const offsetX = playersOnLevel.length > 1 ? (idx - (playersOnLevel.length - 1) / 2) * 18 : 0;
                avatarsHtml += `
                    <div class="tower-player-avatar ${player.team}" 
                         style="transform: translateX(${offsetX}px);"
                         data-player-id="${player.id}"
                         onclick="UnifiedTowerSystem.showPlayerMenu('${player.id}')"
                    >
                        ${player.avatar}
                        ${player.isTaunting ? '<div class="taunt-indicator">💬</div>' : ''}
                    </div>
                `;
            });
            
            html += `
                <div class="tower-level-unified ${isCurrentLevel ? 'current' : ''} ${hasPlayer ? 'has-player' : ''}" 
                     style="background: ${bgColor}; color: ${textColor}; ${glowStyle}"
                     data-level="${i}"
                >
                    <span class="level-name">${levelName}</span>
                    ${pixelLine ? `
                        <span class="pixel-line">${pixelLine}</span>
                    ` : ''}
                    ${avatarsHtml}
                </div>
            `;
        }
        
        container.innerHTML = html;
        container.classList.add('tower-container-unified');
        
        // 更新塔名
        if (config.showName !== false) {
            this.updateTowerName(containerId, towerData);
        }
    },
    
    /**
     * 更新塔名显示
     */
    updateTowerName(containerId, tower) {
        // 查找相邻的塔名元素
        const container = document.getElementById(containerId);
        const parent = container?.parentElement;
        if (parent) {
            const nameEl = parent.querySelector('.tower-name, .tower-header');
            if (nameEl && tower) {
                nameEl.innerHTML = `🏰 ${tower.name} ${tower.country ? `<span style="font-size:10px;color:#888">${tower.country}</span>` : ''}`;
            }
        }
    },
    
    /**
     * 显示玩家菜单（嘲讽/鼓励）
     */
    showPlayerMenu(playerId) {
        const player = this.findPlayerById(playerId);
        if (!player) return;
        
        // 如果是自己，不显示菜单
        if (player.isMe) return;
        
        const actions = [
            { icon: '😤', text: '嘲讽', type: 'taunt' },
            { icon: '👏', text: '鼓励', type: 'encourage' },
            { icon: '👀', text: '查看', type: 'view' }
        ];
        
        // 创建菜单
        const menu = document.createElement('div');
        menu.className = 'player-action-menu';
        menu.innerHTML = actions.map(a => `
            <div class="menu-item" onclick="UnifiedTowerSystem.playerAction('${playerId}', '${a.type}')"
            >
                <span>${a.icon}</span>
                <span>${a.text}</span>
            </div>
        `).join('');
        
        // 显示菜单
        document.body.appendChild(menu);
        
        // 定位菜单
        const avatar = document.querySelector(`[data-player-id="${playerId}"]`);
        if (avatar) {
            const rect = avatar.getBoundingClientRect();
            menu.style.left = `${rect.left}px`;
            menu.style.top = `${rect.top - menu.offsetHeight - 10}px`;
        }
        
        // 点击其他地方关闭
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    },
    
    /**
     * 执行玩家动作
     */
    playerAction(playerId, actionType) {
        const player = this.findPlayerById(playerId);
        if (!player) return;
        
        const messages = {
            taunt: ['你太慢了！', '追不上我！', '认输吧！', '我才是王者！'],
            encourage: ['加油！', '不错！', '一起冲！', '你可以的！']
        };
        
        const msgList = messages[actionType] || messages.taunt;
        const message = msgList[Math.floor(Math.random() * msgList.length)];
        
        // 语音播放
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'zh-CN';
            utterance.rate = 1.2;
            speechSynthesis.speak(utterance);
        }
        
        // 显示气泡
        this.showBubble(playerId, message);
        
        // 触发回调
        if (this.onPlayerAction) {
            this.onPlayerAction(playerId, actionType, message);
        }
    },
    
    /**
     * 显示气泡
     */
    showBubble(playerId, message) {
        const avatar = document.querySelector(`[data-player-id="${playerId}"]`);
        if (!avatar) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'player-bubble';
        bubble.textContent = message;
        avatar.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 3000);
    },
    
    /**
     * 查找玩家
     */
    findPlayerById(playerId) {
        return this.currentPlayers?.find(p => p.id === playerId);
    },
    
    /**
     * 更新玩家位置（带动画）
     */
    updatePlayerPosition(playerId, newLevel) {
        const player = this.findPlayerById(playerId);
        if (!player) return;
        
        const oldLevel = player.level;
        player.level = newLevel;
        
        // 重新渲染塔
        this.renderTower(this.currentContainerId, {
            tower: this.currentTower,
            players: this.currentPlayers,
            config: this.currentConfig
        });
        
        // 播放升级音效/动画
        if (newLevel > oldLevel) {
            this.playLevelUpAnimation(playerId);
        }
    },
    
    /**
     * 播放升级动画
     */
    playLevelUpAnimation(playerId) {
        const avatar = document.querySelector(`[data-player-id="${playerId}"]`);
        if (avatar) {
            avatar.classList.add('level-up-animation');
            setTimeout(() => avatar.classList.remove('level-up-animation'), 1000);
        }
    },
    
    // 当前状态
    currentContainerId: null,
    currentTower: null,
    currentPlayers: [],
    currentConfig: {},
    onPlayerAction: null
};

/* CSS注入 - 确保塔正立显示：底座在下，塔尖在上 */
const towerStyles = document.createElement('style');
towerStyles.textContent = `
    /* 塔容器 - 正立显示 */
    .tower-container-unified {
        display: flex;
        flex-direction: column; /* 从上到下排列，但第1层(2️⃣)在最底部 */
        width: 100%;
        height: 100%;
    }
    
    /* 塔层 - 正立 */
    .tower-level-unified {
        flex: 1;
        min-height: 12px;
        max-height: 22px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        position: relative;
        transition: all 0.3s;
        margin: 1px 0;
    }
    
    /* 第2层（最底层）样式 */
    .tower-level-unified[data-level="1"] {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        margin-bottom: 2px;
    }
    
    /* A层（最顶层）样式 */
    .tower-level-unified[data-level="13"] {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        margin-top: 2px;
    }
    
    .tower-level-unified.has-player {
        z-index: 10;
    }
    
    .tower-level-unified.current {
        box-shadow: 0 0 10px currentColor;
        animation: levelPulse 1s infinite;
        z-index: 20;
    }
    
    .tower-level-unified .level-name {
        z-index: 1;
    }
    
    .tower-level-unified .pixel-line {
        font-family: monospace;
        font-size: 6px;
        letter-spacing: -0.5px;
        margin-left: 4px;
        opacity: 0.7;
    }
    
    .tower-level-unified.has-player {
        z-index: 10;
    }
    
    .tower-level-unified.current {
        box-shadow: 0 0 10px currentColor;
        animation: levelPulse 1s infinite;
    }
    
    .tower-level-unified .level-name {
        z-index: 1;
    }
    
    .tower-level-unified .pixel-line {
        font-family: monospace;
        font-size: 6px;
        letter-spacing: -0.5px;
        margin-left: 4px;
        opacity: 0.7;
    }
    
    .tower-player-avatar {
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: avatarFloat 2s ease-in-out infinite;
        right: -22px;
        z-index: 20;
    }
    
    .tower-player-avatar.team {
        background: linear-gradient(135deg, #3498DB, #2980B9);
        box-shadow: 0 0 5px rgba(52,152,219,0.5);
    }
    
    .tower-player-avatar.enemy {
        background: linear-gradient(135deg, #E74C3C, #C0392B);
        box-shadow: 0 0 5px rgba(231,76,60,0.5);
    }
    
    .tower-player-avatar.me {
        background: linear-gradient(135deg, #FFD700, #FFA502);
        box-shadow: 0 0 8px rgba(255,215,0,0.8);
        border: 2px solid #fff;
    }
    
    .tower-player-avatar:active {
        transform: scale(0.9);
    }
    
    .tower-player-avatar .taunt-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 10px;
        animation: bounce 1s infinite;
    }
    
    @keyframes avatarFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    @keyframes levelPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    .player-bubble {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        color: #333;
        padding: 4px 8px;
        border-radius: 10px;
        font-size: 11px;
        white-space: nowrap;
        z-index: 100;
        animation: bubblePop 3s forwards;
        margin-bottom: 5px;
    }
    
    .player-bubble::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px 5px 0;
        border-style: solid;
        border-color: #fff transparent transparent;
    }
    
    @keyframes bubblePop {
        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .player-action-menu {
        position: fixed;
        background: rgba(30,30,50,0.95);
        border-radius: 12px;
        padding: 8px;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .player-action-menu .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s;
    }
    
    .player-action-menu .menu-item:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .level-up-animation {
        animation: levelUp 1s ease-out;
    }
    
    @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); box-shadow: 0 0 20px #FFD700; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(towerStyles);

// 导出
window.UnifiedTowerSystem = UnifiedTowerSystem;
