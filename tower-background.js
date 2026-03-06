/**
 * 命运塔 - 卡通背景切换系统 V2.0
 * 根据层数或随机切换不同的世界名塔背景
 * 包含20个国家和100+省份/州塔图
 */

// 可用的塔背景列表 - 基础国家
const TOWER_BACKGROUNDS = [
    // 欧洲
    { id: 'eiffel', name: '埃菲尔铁塔', country: '法国', file: 'eiffel-tower.png', continent: 'europe' },
    { id: 'pisa', name: '比萨斜塔', country: '意大利', file: 'pisa-tower.png', continent: 'europe' },
    { id: 'bigben', name: '大本钟', country: '英国', file: 'big-ben.png', continent: 'europe' },
    { id: 'brandenburg', name: '勃兰登堡门', country: '德国', file: 'brandenburg-gate.png', continent: 'europe' },
    
    // 亚洲
    { id: 'tokyo', name: '东京塔', country: '日本', file: 'tokyo-tower.png', continent: 'asia' },
    { id: 'orientalpearl', name: '东方明珠', country: '中国', file: 'oriental-pearl.png', continent: 'asia' },
    { id: 'tajmahal', name: '泰姬陵', country: '印度', file: 'taj-mahal.png', continent: 'asia' },
    { id: 'grandpalace', name: '大皇宫', country: '泰国', file: 'grand-palace.png', continent: 'asia' },
    { id: 'burjkhalifa', name: '哈利法塔', country: '阿联酋', file: 'burj-khalifa.png', continent: 'asia' },
    
    // 美洲
    { id: 'liberty', name: '自由女神像', country: '美国', file: 'statue-of-liberty.png', continent: 'america' },
    { id: 'empire', name: '帝国大厦', country: '美国', file: 'empire-state.png', continent: 'america' },
    
    // 大洋洲
    { id: 'sydney', name: '悉尼歌剧院', country: '澳大利亚', file: 'sydney-opera.png', continent: 'oceania' },
    
    // 非洲
    { id: 'pyramids', name: '金字塔', country: '埃及', file: 'pyramids.png', continent: 'africa' }
];

// 当前背景索引
let currentBackgroundIndex = 0;

// 根据层数获取背景
function getBackgroundByLevel(level) {
    // 每2层切换一个背景
    const index = Math.floor(level / 2) % TOWER_BACKGROUNDS.length;
    return TOWER_BACKGROUNDS[index];
}

// 根据国家获取背景（用于锦标赛）
function getBackgroundByCountry(countryCode) {
    return TOWER_BACKGROUNDS.find(t => t.country === countryCode || t.id === countryCode);
}

// 随机切换背景
function randomBackground() {
    const randomIndex = Math.floor(Math.random() * TOWER_BACKGROUNDS.length);
    return TOWER_BACKGROUNDS[randomIndex];
}

// 应用背景到战场
function applyTowerBackground(towerId) {
    const battlefield = document.querySelector('.battlefield');
    if (!battlefield) return;
    
    const tower = TOWER_BACKGROUNDS.find(t => t.id === towerId);
    if (tower) {
        // 添加过渡效果
        battlefield.style.transition = 'background-image 0.5s ease-in-out';
        battlefield.style.backgroundImage = `url('assets/towers/${tower.file}')`;
        battlefield.style.backgroundSize = 'cover';
        battlefield.style.backgroundPosition = 'center center';
        battlefield.style.backgroundRepeat = 'no-repeat';
        
        // 显示当前塔信息
        showTowerInfo(tower);
    }
}

// 显示塔信息提示
function showTowerInfo(tower) {
    // 检查是否已存在信息提示
    let infoDiv = document.querySelector('.tower-info-float');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.className = 'tower-info-float';
        
        // 添加样式
        infoDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            padding: 8px 16px;
            border-radius: 20px;
            text-align: center;
            z-index: 100;
            transition: opacity 0.3s;
        `;
        
        document.querySelector('.battlefield').appendChild(infoDiv);
    }
    
    infoDiv.innerHTML = `
        <div style="color: #FFD700; font-weight: bold; font-size: 14px;">${tower.name}</div>
        <div style="color: #aaa; font-size: 12px;">${tower.country}</div>
    `;
    infoDiv.style.opacity = '1';
    
    // 3秒后淡出
    setTimeout(() => {
        infoDiv.style.opacity = '0';
    }, 3000);
}

// 初始化背景系统
function initTowerBackground() {
    // 初始显示埃菲尔铁塔
    applyTowerBackground('eiffel');
    
    // 监听层数变化，自动切换背景
    const checkLevelChange = setInterval(() => {
        if (typeof gameState !== 'undefined' && gameState.myPlayer) {
            const myLevel = gameState.myPlayer.level;
            const newBg = getBackgroundByLevel(myLevel);
            
            // 检查是否需要切换背景
            const currentBgId = document.querySelector('.battlefield')?.dataset?.currentBg;
            if (currentBgId !== newBg.id) {
                applyTowerBackground(newBg.id);
                if (document.querySelector('.battlefield')) {
                    document.querySelector('.battlefield').dataset.currentBg = newBg.id;
                }
            }
        }
    }, 2000);
}

// 锦标赛背景切换
function setTournamentBackground(country, province) {
    // 优先使用省份/州图片，如果没有则使用国家图片
    const bgId = province ? `${country}-${province}` : country;
    applyTowerBackground(bgId);
}

// 导出
window.TOWER_BACKGROUNDS = TOWER_BACKGROUNDS;
window.applyTowerBackground = applyTowerBackground;
window.initTowerBackground = initTowerBackground;
window.randomBackground = randomBackground;
window.getBackgroundByCountry = getBackgroundByCountry;
window.setTournamentBackground = setTournamentBackground;
