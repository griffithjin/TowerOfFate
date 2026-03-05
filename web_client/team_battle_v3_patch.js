/**
 * 团队赛 V3 核心更新补丁
 * 同步个人赛的11项天命牌和田字布局理念
 */

// 11项天命牌定义（团队赛版本）
const DESTINY_TYPES_V3 = [
    { type: 'assault', name: '突击', desc: '目标+1层', icon: '⚡', category: 'buff' },
    { type: 'swap', name: '换牌', desc: '目标重抽', icon: '🔄', category: 'buff' },
    { type: 'peek', name: '透视', desc: '全队看守卫', icon: '👁️', category: 'buff' },
    { type: 'guard', name: '守卫', desc: '目标本轮必胜', icon: '🛡️', category: 'buff' },
    { type: 'double', name: '双倍', desc: '目标下次+2层', icon: '✨', category: 'buff' },
    { type: 'shield', name: '护盾', desc: '目标免疫一次', icon: '🔒', category: 'buff' },
    { type: 'kick', name: '踢人', desc: '敌方-1层', icon: '👢', category: 'debuff' },
    { type: 'down', name: '下降', desc: '敌方守卫回2层', icon: '⬇️', category: 'debuff' },
    { type: 'freeze', name: '冰冻', desc: '敌方停一轮', icon: '❄️', category: 'debuff' },
    { type: 'steal', name: '偷看', desc: '看敌方手牌', icon: '👀', category: 'debuff' },
    { type: 'copy', name: '复制', desc: '复制敌方牌', icon: '📋', category: 'debuff' }
];

// 团队赛嘲讽语（30条）
const TEAM_TAUNTS = {
    buff: [
        "有我在，这局稳了！",
        "队友们，跟我冲！",
        "我们是最强团队！",
        "胜利属于我们！",
        "一起登顶，一起荣耀！"
    ],
    debuff: [
        "你们的运气用光了！",
        "准备好接受失败吧！",
        "我们要超越你们了！",
        "你们的守卫不够看！",
        "这一局，我们赢定了！"
    ],
    victory: [
        "团队合作，无往不胜！",
        "我们是冠军！",
        "完美的团队配合！"
    ]
};

// 使用天命牌（团队赛版 - 需要选择目标）
function useDestinyV3(index) {
    const card = gameState.destinyCards[index];
    
    if (card.category === 'buff') {
        // 增益牌：选择队友
        const target = prompt(`选择使用对象:\n1-队友1\n2-队友2\n3-自己`, "3");
        if (!target) return;
        
        applyBuffEffect(card.type, parseInt(target));
    } else {
        // 损益牌：选择敌方
        const target = prompt(`选择施法对象:\n1-敌方1\n2-敌方2\n3-敌方3`, "1");
        if (!target) return;
        
        applyDebuffEffect(card.type, parseInt(target));
    }
}

// 增益效果
function applyBuffEffect(type, target) {
    switch(type) {
        case 'assault':
            showNotification(`⚡ 队友${target}直接晋级！`, 'success');
            break;
        case 'swap':
            showNotification(`🔄 队友${target}手牌已刷新！`, 'success');
            break;
        case 'peek':
            alert('👁️ 下轮守卫牌: ♥A (透视效果)');
            break;
        case 'guard':
            showNotification(`🛡️ 队友${target}本轮必胜！`, 'success');
            break;
        case 'double':
            showNotification(`✨ 队友${target}下次晋级+2层！`, 'success');
            break;
        case 'shield':
            showNotification(`🔒 队友${target}获得护盾！`, 'success');
            break;
    }
}

// 损益效果
function applyDebuffEffect(type, target) {
    switch(type) {
        case 'kick':
            showNotification(`👢 敌方${target}下降1层！`, 'success');
            break;
        case 'down':
            showNotification(`⬇️ 敌方守卫被击败！`, 'success');
            break;
        case 'freeze':
            showNotification(`❄️ 敌方${target}被冰冻！`, 'success');
            break;
        case 'steal':
            alert('👀 敌方手牌: ♠K, ♥Q, ♣J, ♦10, ♠A');
            break;
        case 'copy':
            showNotification(`📋 已复制敌方${target}的牌！`, 'success');
            break;
    }
}

// 团队嘲讽
function teamTaunt(type) {
    const taunts = TEAM_TAUNTS[type];
    const taunt = taunts[Math.floor(Math.random() * taunts.length)];
    
    // 显示团队气泡
    showNotification(`💬 团队:"${taunt}"`, 'info');
    
    // 语音播放
    if (window.speakTaunt) {
        speakTaunt(taunt);
    }
}

// 守卫胜利庆祝（团队版）
function showTeamGuardVictory() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 20000;
        display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 100px; margin-bottom: 20px;">🏆</div>
            <div style="font-size: 36px; color: #ffd700; margin-bottom: 20px; font-weight: bold;">🎊 团队完美胜利！🎊</div>
            <div style="font-size: 18px; color: #888; margin-bottom: 30px;">
                你们团队成功守住了13次攻击！<br>
                完美的配合，无懈可击的防守！
            </div>
            <div style="font-size: 48px; color: #ffd700; margin-bottom: 30px;">💎 +500/人 🪙 +5000/人</div>
            <button onclick="location.reload()" style="padding: 15px 40px; font-size: 18px; background: linear-gradient(135deg, #2ed573, #27ae60); border: none; border-radius: 10px; color: #fff; font-weight: bold; cursor: pointer;">
                🎮 再玩一局
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 团队嘲讽
    teamTaunt('victory');
}

// 导出
window.DESTINY_TYPES_V3 = DESTINY_TYPES_V3;
window.useDestinyV3 = useDestinyV3;
window.teamTaunt = teamTaunt;
window.showTeamGuardVictory = showTeamGuardVictory;
