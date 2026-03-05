/**
 * 命运塔·首登者 - 统一塔系统模块
 * Tower System Module - 所有游戏模式共享
 * 
 * 功能：
 * 1. 塔形状渲染（8种世界名塔）
 * 2. 塔层命名（2️⃣-3️⃣-...-J-Q-K-A）
 * 3. 塔解锁系统（绑定积分/货币）
 * 4. 商城购买接口
 */

// ==========================================
// 塔层命名系统
// ==========================================
const TOWER_LEVEL_NAMES = [
    '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', 'J', 'Q', 'K', 'A'
];

// 获取层名显示
function getTowerLevelName(level) {
    // level: 1-13 对应 第2️⃣层-第A层
    if (level >= 1 && level <= 13) {
        const name = TOWER_LEVEL_NAMES[level - 1];
        return `第${name}层`;
    }
    return `第?层`;
}

// 获取层名（不带"第"和"层"）
function getTowerLevelSymbol(level) {
    if (level >= 1 && level <= 13) {
        return TOWER_LEVEL_NAMES[level - 1];
    }
    return '?';
}

// ==========================================
// 世界名塔库（可扩展）
// ==========================================
const TOWER_LIBRARY = {
    // 基础塔（默认解锁）
    basic: [
        {
            id: 'tower_eiffel',
            name: '埃菲尔铁塔',
            country: '法国',
            color: '#8B4513',
            shape: 'taper',
            desc: '下宽上窄的锥形',
            rarity: 'common',
            unlockType: 'free',
            price: 0
        },
        {
            id: 'tower_tokyo',
            name: '东京塔',
            country: '日本',
            color: '#FF6347',
            shape: 'taper',
            desc: '红色铁塔',
            rarity: 'common',
            unlockType: 'free',
            price: 0
        }
    ],
    
    // 稀有塔（积分解锁）
    rare: [
        {
            id: 'tower_empire',
            name: '帝国大厦',
            country: '美国',
            color: '#4682B4',
            shape: 'rectangle',
            desc: '方正摩天楼',
            rarity: 'rare',
            unlockType: 'points',
            price: 1000,  // 积分
            requiredRank: '白银'
        },
        {
            id: 'tower_pisa',
            name: '比萨斜塔',
            country: '意大利',
            color: '#DEB887',
            shape: 'lean',
            desc: '倾斜圆柱',
            rarity: 'rare',
            unlockType: 'points',
            price: 1500,
            requiredRank: '黄金'
        }
    ],
    
    // 史诗塔（钻石购买）
    epic: [
        {
            id: 'tower_burj',
            name: '哈利法塔',
            country: '阿联酋',
            color: '#FFD700',
            shape: 'spire',
            desc: '尖顶摩天楼',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 388,  // 钻石
            effects: {
                goldBonus: 0.1  // 金币加成10%
            }
        },
        {
            id: 'tower_petronas',
            name: '双子塔',
            country: '马来西亚',
            color: '#C0C0C0',
            shape: 'twin',
            desc: '双塔造型',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 488,
            effects: {
                expBonus: 0.15  // 经验加成15%
            }
        },
        {
            id: 'tower_oriental',
            name: '东方明珠',
            country: '中国',
            color: '#FF69B4',
            shape: 'sphere',
            desc: '球体串联',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 588,
            effects: {
                streakBonus: 1  // 连胜初始+1
            }
        }
    ],
    
    // 传说塔（限定/活动）
    legendary: [
        {
            id: 'tower_bridge',
            name: '伦敦塔桥',
            country: '英国',
            color: '#4169E1',
            shape: 'bridge',
            desc: '双塔桥梁',
            rarity: 'legendary',
            unlockType: 'event',
            price: 1288,
            limited: true,
            effects: {
                goldBonus: 0.2,
                expBonus: 0.2,
                specialEffect: 'golden_sparkle'
            }
        }
    ]
};

// 获取所有可用塔
function getAllTowers() {
    return [
        ...TOWER_LIBRARY.basic,
        ...TOWER_LIBRARY.rare,
        ...TOWER_LIBRARY.epic,
        ...TOWER_LIBRARY.legendary
    ];
}

// 获取玩家已解锁的塔
function getUnlockedTowers() {
    const unlocked = JSON.parse(localStorage.getItem('unlockedTowers') || '["tower_eiffel", "tower_tokyo"]');
    return getAllTowers().filter(t => unlocked.includes(t.id));
}

// 检查塔是否已解锁
function isTowerUnlocked(towerId) {
    const unlocked = JSON.parse(localStorage.getItem('unlockedTowers') || '["tower_eiffel", "tower_tokyo"]');
    return unlocked.includes(towerId);
}

// 解锁塔（购买）
function unlockTower(towerId, currency, price) {
    // 检查货币是否足够
    const currentAmount = getCurrency(currency);
    if (currentAmount < price) {
        return { success: false, message: `${currency}不足！需要${price}` };
    }
    
    // 扣除货币
    const result = deductCurrency(currency, price);
    if (!result.success) {
        return result;
    }
    
    // 添加到已解锁
    const unlocked = JSON.parse(localStorage.getItem('unlockedTowers') || '["tower_eiffel", "tower_tokyo"]');
    if (!unlocked.includes(towerId)) {
        unlocked.push(towerId);
        localStorage.setItem('unlockedTowers', JSON.stringify(unlocked));
    }
    
    // 记录购买
    recordTowerPurchase(towerId, price);
    
    return { success: true, message: '解锁成功！' };
}

// 随机获取一个已解锁的塔
function getRandomUnlockedTower() {
    const unlocked = getUnlockedTowers();
    return unlocked[Math.floor(Math.random() * unlocked.length)];
}

// ==========================================
// 货币系统接口
// ==========================================

// 获取货币数量
function getCurrency(type) {
    switch(type) {
        case 'points':
            return parseInt(localStorage.getItem('playerPoints') || '0');
        case 'diamond':
            return parseInt(localStorage.getItem('playerDiamonds') || '500');
        case 'gold':
            return parseInt(localStorage.getItem('playerGold') || '5000');
        default:
            return 0;
    }
}

// 扣除货币
function deductCurrency(type, amount) {
    const current = getCurrency(type);
    if (current < amount) {
        return { success: false, message: '余额不足' };
    }
    
    const newAmount = current - amount;
    switch(type) {
        case 'points':
            localStorage.setItem('playerPoints', newAmount);
            break;
        case 'diamond':
            localStorage.setItem('playerDiamonds', newAmount);
            break;
        case 'gold':
            localStorage.setItem('playerGold', newAmount);
            break;
    }
    
    return { success: true, message: '扣除成功' };
}

// 增加货币
function addCurrency(type, amount) {
    const current = getCurrency(type);
    const newAmount = current + amount;
    
    switch(type) {
        case 'points':
            localStorage.setItem('playerPoints', newAmount);
            break;
        case 'diamond':
            localStorage.setItem('playerDiamonds', newAmount);
            break;
        case 'gold':
            localStorage.setItem('playerGold', newAmount);
            break;
    }
    
    return { success: true, newAmount };
}

// 记录塔购买
function recordTowerPurchase(towerId, price) {
    const purchases = JSON.parse(localStorage.getItem('towerPurchases') || '[]');
    purchases.push({
        towerId,
        price,
        date: new Date().toISOString()
    });
    localStorage.setItem('towerPurchases', JSON.stringify(purchases));
}

// ==========================================
// 塔渲染系统
// ==========================================

// 渲染塔（根据形状）
function renderTower(towerId, currentLevel, containerId) {
    const tower = getAllTowers().find(t => t.id === towerId) || TOWER_LIBRARY.basic[0];
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const shape = tower.shape;
    let html = '';
    
    for (let i = 13; i >= 1; i--) {
        const isCurrent = i === currentLevel;
        const levelName = getTowerLevelSymbol(i);
        
        // 根据形状计算宽度
        let width = getTowerWidthByShape(shape, i);
        
        const bgColor = isCurrent ? tower.color : 'rgba(255,255,255,0.1)';
        const textColor = isCurrent ? '#fff' : '#888';
        
        html += `
            <div class="tower-level ${isCurrent ? 'current' : ''}" 
                 style="width: ${width}%; background: ${bgColor}; color: ${textColor};"
                 data-level="${i}"
            >
                ${levelName}
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // 添加塔名显示
    const nameEl = document.getElementById(containerId + 'Name');
    if (nameEl) {
        nameEl.textContent = `🏰 ${tower.name}`;
    }
}

// 根据形状获取宽度
function getTowerWidthByShape(shape, level) {
    switch(shape) {
        case 'taper':  // 锥形
            return 25 + (level * 4);
        case 'rectangle':  // 方形
            return 70;
        case 'twin':  // 双塔
            return 50;
        case 'spire':  // 尖顶
            return 20 + (level * 3);
        case 'sphere':  // 球体
            return level === 6 || level === 9 ? 60 : 40;
        case 'lean':  // 倾斜
            return 45;
        case 'bridge':  // 桥梁
            return level === 7 ? 80 : 40;
        default:
            return 30 + (level * 3);
    }
}

// 获取塔CSS样式（用于动态添加）
function getTowerCSS() {
    return `
        .tower-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }
        
        .tower-name {
            font-size: 14px;
            color: #ffd700;
            text-align: center;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .tower {
            flex: 1;
            width: 70%;
            display: flex;
            flex-direction: column-reverse;
        }
        
        .tower-level {
            height: 16px;
            margin: 1px 0;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .tower-level.current {
            box-shadow: 0 0 10px currentColor;
            animation: towerLevelPulse 1s infinite;
        }
        
        @keyframes towerLevelPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
}

// 初始化塔系统CSS
function initTowerSystemCSS() {
    if (!document.getElementById('tower-system-css')) {
        const style = document.createElement('style');
        style.id = 'tower-system-css';
        style.textContent = getTowerCSS();
        document.head.appendChild(style);
    }
}

// ==========================================
// 导出
// ==========================================
window.TowerSystem = {
    // 命名
    getLevelName: getTowerLevelName,
    getLevelSymbol: getTowerLevelSymbol,
    TOWER_LEVEL_NAMES,
    
    // 塔库
    library: TOWER_LIBRARY,
    getAll: getAllTowers,
    getUnlocked: getUnlockedTowers,
    isUnlocked: isTowerUnlocked,
    unlock: unlockTower,
    getRandom: getRandomUnlockedTower,
    
    // 渲染
    render: renderTower,
    getWidthByShape: getTowerWidthByShape,
    initCSS: initTowerSystemCSS,
    
    // 货币
    getCurrency,
    addCurrency,
    deductCurrency
};

// 自动初始化CSS
document.addEventListener('DOMContentLoaded', initTowerSystemCSS);
