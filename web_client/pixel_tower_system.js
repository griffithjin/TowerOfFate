/**
 * 命运塔·首登者 - 像素块名塔系统 V2
 * 30座世界名塔像素块仿真模型
 */

// ==========================================
// 塔层命名系统（从下到上：2️⃣→A）
// ==========================================
const TOWER_LEVEL_NAMES = [
    '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', 'J', 'Q', 'K', 'A'
];

// 获取层名（从下到上，第1层=2️⃣，第13层=A）
function getTowerLevelName(level) {
    // level: 1-13 对应 第2️⃣层-第A层
    if (level >= 1 && level <= 13) {
        const name = TOWER_LEVEL_NAMES[level - 1];
        return `第${name}层`;
    }
    return `第?层`;
}

function getTowerLevelSymbol(level) {
    if (level >= 1 && level <= 13) {
        return TOWER_LEVEL_NAMES[level - 1];
    }
    return '?';
}

// ==========================================
// 30座像素块名塔库
// ==========================================
const PIXEL_TOWERS = {
    // 基础塔（免费）
    basic: [
        {
            id: 'tower_eiffel',
            name: '埃菲尔铁塔',
            country: '法国·巴黎',
            color: '#8B4513',
            rarity: 'common',
            unlockType: 'free',
            price: 0,
            pixels: [
                '      ████      ',
                '     ██████     ',
                '    ████████    ',
                '   ██████████   ',
                '  ████████████  ',
                ' ██████████████ ',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████'
            ]
        },
        {
            id: 'tower_tokyo',
            name: '东京塔',
            country: '日本·东京',
            color: '#FF6347',
            rarity: 'common',
            unlockType: 'free',
            price: 0,
            pixels: [
                '       ██       ',
                '      ████      ',
                '     ██████     ',
                '    ████████    ',
                '   ██████████   ',
                '  ████████████  ',
                ' ██████████████ ',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████'
            ]
        },
        {
            id: 'tower_bigben',
            name: '大本钟',
            country: '英国·伦敦',
            color: '#DAA520',
            rarity: 'common',
            unlockType: 'free',
            price: 0,
            pixels: [
                '      ████      ',
                '      ████      ',
                '    ████████    ',
                '    ██ ██ ██    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '    ████████    ',
                '  ████████████  '
            ]
        }
    ],
    
    // 稀有塔（积分解锁）
    rare: [
        {
            id: 'tower_empire',
            name: '帝国大厦',
            country: '美国·纽约',
            color: '#4682B4',
            rarity: 'rare',
            unlockType: 'points',
            price: 1000,
            pixels: [
                '        ██        ',
                '       ████       ',
                '      ██████      ',
                '     ████████     ',
                '    ██████████    ',
                '   ████████████   ',
                '  ██████████████  ',
                ' ████████████████ ',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        },
        {
            id: 'tower_pisa',
            name: '比萨斜塔',
            country: '意大利·比萨',
            color: '#DEB887',
            rarity: 'rare',
            unlockType: 'points',
            price: 1200,
            pixels: [
                '         ████   ',
                '        ████    ',
                '       ████     ',
                '      ████      ',
                '     ████       ',
                '    ████        ',
                '   ████         ',
                '  ████          ',
                ' ████           ',
                '████            ',
                '████            ',
                '████            ',
                '██████          '
            ]
        },
        {
            id: 'tower_sydney',
            name: '悉尼歌剧院',
            country: '澳大利亚·悉尼',
            color: '#F5F5DC',
            rarity: 'rare',
            unlockType: 'points',
            price: 1500,
            pixels: [
                '    ████  ████    ',
                '   █████  █████   ',
                '  ██████  ██████  ',
                ' ████████████████ ',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        },
        {
            id: 'tower_brandenburg',
            name: '勃兰登堡门',
            country: '德国·柏林',
            color: '#D4C4B0',
            rarity: 'rare',
            unlockType: 'points',
            price: 1300,
            pixels: [
                '████████████████',
                '█  ██      ██  █',
                '█  ██      ██  █',
                '█  ██      ██  █',
                '████████████████',
                '█  ██      ██  █',
                '█  ██      ██  █',
                '████████████████',
                '█  ██      ██  █',
                '████████████████',
                '████████████████',
                '████████████████',
                '████████████████'
            ]
        }
    ],
    
    // 史诗塔（钻石购买 +灯红酒绿效果）
    epic: [
        {
            id: 'tower_oriental',
            name: '东方明珠',
            country: '中国·上海',
            color: '#FF1493',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 588,
            effects: { streakBonus: 1 },
            neon: true,  // 灯红酒绿效果
            pixels: [
                '       ████       ',
                '      ██████      ',
                '     ████████     ',
                '       ████       ',
                '     ████████     ',
                '   ████████████   ',
                '       ████       ',
                '    ██████████    ',
                '  ██████████████  ',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        },
        {
            id: 'tower_burj',
            name: '哈利法塔',
            country: '阿联酋·迪拜',
            color: '#FFD700',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 388,
            effects: { goldBonus: 0.1 },
            neon: true,
            pixels: [
                '        ██        ',
                '       ████       ',
                '      ██████      ',
                '     ████████     ',
                '    ██████████    ',
                '   ████████████   ',
                '  ██████████████  ',
                ' ████████████████ ',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        },
        {
            id: 'tower_petronas',
            name: '双子塔',
            country: '马来西亚·吉隆坡',
            color: '#C0C0C0',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 488,
            effects: { expBonus: 0.15 },
            pixels: [
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '  ████      ████  ',
                '██████████████████'
            ]
        },
        {
            id: 'tower_taipei',
            name: '台北101',
            country: '中国台湾·台北',
            color: '#228B22',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 388,
            effects: { goldBonus: 0.08 },
            pixels: [
                '       ████       ',
                '       ████       ',
                '      ██████      ',
                '     ████████     ',
                '    ██████████    ',
                '   ████████████   ',
                '  ██████████████  ',
                ' ████████████████ ',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        },
        {
            id: 'tower_canton',
            name: '广州塔',
            country: '中国·广州',
            color: '#00CED1',
            rarity: 'epic',
            unlockType: 'diamond',
            price: 388,
            effects: { expBonus: 0.1 },
            neon: true,
            pixels: [
                '        ██        ',
                '       ████       ',
                '      ██████      ',
                '     ████████     ',
                '      ██████      ',
                '     ████████     ',
                '    ██████████    ',
                '   ████████████   ',
                '  ██████████████  ',
                ' ████████████████ ',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        }
    ],
    
    // 传说塔（限定）
    legendary: [
        {
            id: 'tower_bridge',
            name: '伦敦塔桥',
            country: '英国·伦敦',
            color: '#4169E1',
            rarity: 'legendary',
            unlockType: 'event',
            price: 1288,
            limited: true,
            effects: { goldBonus: 0.2, expBonus: 0.2 },
            pixels: [
                '█  ██        ██  █',
                '█  ██        ██  █',
                '█  ██        ██  █',
                '█  ██        ██  █',
                '██████████████████',
                '█                █',
                '█                █',
                '██████████████████',
                '█  ██        ██  █',
                '█  ██        ██  █',
                '██████████████████',
                '██████████████████',
                '██████████████████'
            ]
        }
    ],
    
    // 锦标赛专用塔（按城市）
    tournament: [
        // 亚洲
        { id: 'tour_tokyo_skytree', name: '东京晴空塔', country: '日本·东京', color: '#663399', pixels: [] },
        { id: 'tour_seoul_lotte', name: '乐天世界塔', country: '韩国·首尔', color: '#1E90FF', pixels: [] },
        { id: 'tour_bangkok_mahanakhon', name: '王权大厦', country: '泰国·曼谷', color: '#FFD700', pixels: [] },
        { id: 'tour_singapore_marina', name: '滨海湾金沙', country: '新加坡', color: '#00FA9A', pixels: [] },
        { id: 'tour_dubai_frame', name: '迪拜相框', country: '阿联酋·迪拜', color: '#FFD700', pixels: [] },
        { id: 'tour_mumbai_india', name: '印度门', country: '印度·孟买', color: '#F4A460', pixels: [] },
        
        // 欧洲
        { id: 'tour_rome_colosseum', name: '斗兽场', country: '意大利·罗马', color: '#D2691E', pixels: [] },
        { id: 'tour_barcelona_sagrada', name: '圣家堂', country: '西班牙·巴塞罗那', color: '#FF8C00', pixels: [] },
        { id: 'tour_amsterdam_dam', name: '水坝广场', country: '荷兰·阿姆斯特丹', color: '#FF6347', pixels: [] },
        { id: 'tour_vienna_schonbrunn', name: '美泉宫', country: '奥地利·维也纳', color: '#FFD700', pixels: [] },
        { id: 'tour_prague_castle', name: '布拉格城堡', country: '捷克·布拉格', color: '#DC143C', pixels: [] },
        { id: 'tour_moscow_kremlin', name: '克里姆林宫', country: '俄罗斯·莫斯科', color: '#B22222', pixels: [] },
        
        // 北美
        { id: 'tour_nyc_statue', name: '自由女神像', country: '美国·纽约', color: '#2E8B57', pixels: [] },
        { id: 'tour_sf_bridge', name: '金门大桥', country: '美国·旧金山', color: '#FF4500', pixels: [] },
        { id: 'tour_chicago_beam', name: '威利斯大厦', country: '美国·芝加哥', color: '#4682B4', pixels: [] },
        { id: 'tour_cancun_pyramid', name: '奇琴伊察', country: '墨西哥·坎昆', color: '#D2691E', pixels: [] },
        { id: 'tour_toronto_cn', name: 'CN塔', country: '加拿大·多伦多', color: '#FF1493', pixels: [] },
        
        // 南美
        { id: 'tour_rio_christ', name: '基督像', country: '巴西·里约', color: '#8FBC8F', pixels: [] },
        { id: 'tour_buenos_obelisk', name: '方尖碑', country: '阿根廷·布宜诺斯艾利斯', color: '#C0C0C0', pixels: [] },
        { id: 'tour_lima_machu', name: '马丘比丘', country: '秘鲁·利马', color: '#228B22', pixels: [] },
        
        // 大洋洲
        { id: 'tour_melbourne_eureka', name: '尤里卡塔', country: '澳大利亚·墨尔本', color: '#FFD700', pixels: [] },
        { id: 'tour_auckland_sky', name: '天空塔', country: '新西兰·奥克兰', color: '#87CEEB', pixels: [] },
        
        // 非洲
        { id: 'tour_cairo_pyramid', name: '吉萨金字塔', country: '埃及·开罗', color: '#DAA520', pixels: [] },
        { id: 'tour_cape_table', name: '桌山', country: '南非·开普敦', color: '#8B4513', pixels: [] },
        { id: 'tour_marrakech_koutoubia', name: '库图比亚清真寺', country: '摩洛哥·马拉喀什', color: '#FF6347', pixels: [] }
    ]
};

// 渲染像素塔
function renderPixelTower(towerId, currentLevel, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 获取塔数据
    let tower = null;
    for (const category in PIXEL_TOWERS) {
        tower = PIXEL_TOWERS[category].find(t => t.id === towerId);
        if (tower) break;
    }
    
    if (!tower) {
        // 默认塔
        tower = PIXEL_TOWERS.basic[0];
    }
    
    // 生成像素塔HTML
    let html = '';
    
    // 从下到上渲染：第1层(2️⃣)在最下，第13层(A)在最上
    for (let i = 1; i <= 13; i++) {
        const isCurrent = i === currentLevel;
        const levelName = getTowerLevelSymbol(i);
        
        // 获取像素行（如果塔有像素定义）
        let pixelLine = '';
        if (tower.pixels && tower.pixels.length >= i) {
            pixelLine = tower.pixels[13 - i];  // 反转数组，使第1层在最下
        }
        
        const bgColor = isCurrent ? tower.color : 'rgba(255,255,255,0.1)';
        const textColor = isCurrent ? '#fff' : '#888';
        const glowStyle = tower.neon && isCurrent ? 'box-shadow: 0 0 20px ' + tower.color + '; animation: neonPulse 1s infinite;' : '';
        
        html += `
            <div class="tower-level ${isCurrent ? 'current' : ''}" 
                 style="background: ${bgColor}; color: ${textColor}; ${glowStyle}"
                 data-level="${i}"
            >
                <span class="level-symbol">${levelName}</span>
                ${pixelLine ? `<span class="pixel-line">${pixelLine}</span>` : ''}
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // 添加霓虹动画CSS
    if (tower.neon && !document.getElementById('neon-css')) {
        const style = document.createElement('style');
        style.id = 'neon-css';
        style.textContent = `
            @keyframes neonPulse {
                0%, 100% { box-shadow: 0 0 10px currentColor; }
                50% { box-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 更新塔名
    const nameEl = document.getElementById(containerId + 'Name');
    if (nameEl) {
        nameEl.innerHTML = `🏰 ${tower.name} <span style="font-size:12px;color:#888">${tower.country}</span>`;
    }
}

// 获取塔列表
function getPixelTowers(category = null) {
    if (category && PIXEL_TOWERS[category]) {
        return PIXEL_TOWERS[category];
    }
    return [
        ...PIXEL_TOWERS.basic,
        ...PIXEL_TOWERS.rare,
        ...PIXEL_TOWERS.epic,
        ...PIXEL_TOWERS.legendary
    ];
}

// 导出
window.PixelTowerSystem = {
    render: renderPixelTower,
    getTowers: getPixelTowers,
    library: PIXEL_TOWERS,
    getLevelName: getTowerLevelName,
    getLevelSymbol: getTowerLevelSymbol
};


// 加载锦标赛塔像素艺术（如果存在）
if (window.TournamentTowerPixels) {
    // 为锦标赛塔添加像素艺术
    PIXEL_TOWERS.tournament.forEach(tower => {
        if (window.TournamentTowerPixels[tower.id]) {
            tower.pixels = window.TournamentTowerPixels[tower.id];
        }
    });
}
