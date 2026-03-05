/**
 * 命运塔·首登者 - 嘲讽语音系统
 * 100条互动语音
 */

const TAUNT_MESSAGES = {
    // 自信类 (20条)
    confidence: [
        "我的运气就是很好！",
        "今天的幸运女神站在我这边！",
        "我就是天命之子！",
        "运气也是一种实力！",
        "这牌我闭着眼睛都能赢！",
        "命运的安排，我必须登顶！",
        "我的直觉从来不会错！",
        "这就是强者的自信！",
        "运气来了挡都挡不住！",
        "我感受到了胜利的召唤！",
        "这一把，稳了！",
        "我的牌运正在爆发！",
        "幸运星照耀着我！",
        "这就是实力与运气的结合！",
        "我感觉自己要无敌了！",
        "运气这种东西，我从来不缺！",
        "我的卡牌在发光！",
        "这一刻，我就是传奇！",
        "胜利已经在向我招手！",
        "我的运气值MAX了！"
    ],
    
    // 读心类 (15条)
    mind_reading: [
        "我就是守卫肚子里的宝贝，他想什么我都知道！",
        "你的牌，我已经看透了！",
        "我知道你在想什么牌！",
        "你的心思，瞒不过我的眼睛！",
        "我已经预判了你的预判！",
        "你的牌，在我面前无所遁形！",
        "我能读懂守卫的心跳！",
        "你的下一步，我早就知道了！",
        "守卫牌的秘密，我了如指掌！",
        "你的出牌习惯，我研究透了！",
        "我能感受到卡牌的波动！",
        "你的内心，卡牌已经告诉我了！",
        "我就是读心大师！",
        "你的牌意，逃不过我的法眼！",
        "我能听见卡牌的声音！"
    ],
    
    // 运气相关 (20条)
    luck: [
        "遇见你可真是我的好运气！",
        "运气也是实力的一部分！",
        "今天宜登顶，不宜输牌！",
        "我的幸运数字是13！",
        "天时地利人和，我占全了！",
        "运气好的时候，怎么打都能赢！",
        "我今天的运势是：大吉！",
        "幸运女神亲吻了我的牌！",
        "我的运气正在疯狂输出！",
        "这运气，不赢都难！",
        "命运之轮为我转动！",
        "我抽到了命运的馈赠！",
        "运气这东西，可遇不可求，但我有！",
        "我的牌运亨通！",
        "今日运势：宜打牌，忌认输！",
        "我的运气值爆表了！",
        "幸运光环加持中！",
        "我就是行走的锦鲤！",
        "运气来了，连塔都要为我让路！",
        "我的好运气，你羡慕不来！"
    ],
    
    // 夸奖对手 (15条)
    compliment: [
        "你是个很棒的对手！",
        "能和你对决是我的荣幸！",
        "你的牌技让我佩服！",
        "不愧是高手，值得尊敬！",
        "你的策略很精彩！",
        "和你对战让我学到了很多！",
        "你是个值得尊敬的对手！",
        "你的运气也不错嘛！",
        "能和强者对决，是我的幸运！",
        "你的每一步都走得很好！",
        "你让这场对决变得精彩！",
        "有你在，登顶才有意义！",
        "你的实力让我不敢大意！",
        "你是个很厉害的对手！",
        "和你对战是一种享受！"
    ],
    
    // 挑衅类 (15条)
    taunt: [
        "准备好被我超越了吗？",
        "我要开始加速了！",
        "你还在原地踏步吗？",
        "我要登顶了，你呢？",
        "看来我要先走一步了！",
        "你的速度有点慢哦！",
        "我要冲顶了，跟得上吗？",
        "塔顶的风景真不错，你要不要来看看？",
        "我要成为守卫了，你加油！",
        "我的进度条快满了！",
        "你落后了哦，要加把劲了！",
        "我要开始表演了！",
        "准备好见证奇迹了吗？",
        "我要起飞了！",
        "你追上我需要加点运气了！"
    ],
    
    // 幽默类 (15条)
    humor: [
        "我的卡牌昨晚喝了红牛！",
        "这不是运气，是卡牌的自觉！",
        "我的牌可能偷看了答案！",
        "我觉得守卫牌暗恋我！",
        "我的卡牌开了挂！",
        "这可能是卡牌界的奇迹！",
        "我的运气今天吃了兴奋剂！",
        "这局我要让守卫牌怀疑人生！",
        "我的卡牌可能是天选之牌！",
        "我觉得我今天被幸运陨石砸中了！",
        "我的运气可能充了VIP！",
        "这牌好得让我怀疑人生！",
        "我的卡牌可能上了补习班！",
        "我觉得守卫牌在向我抛媚眼！",
        "今天我的运气值可能是999+！"
    ]
};

// 获取随机嘲讽语
function getRandomTaunt(category = null) {
    if (category && TAUNT_MESSAGES[category]) {
        const messages = TAUNT_MESSAGES[category];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // 随机从所有类别中选择
    const categories = Object.keys(TAUNT_MESSAGES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const messages = TAUNT_MESSAGES[randomCategory];
    return messages[Math.floor(Math.random() * messages.length)];
}

// 获取特定场景的嘲讽语
function getContextualTaunt(context) {
    switch(context) {
        case 'level_up':
            return getRandomTaunt('confidence');
        case 'guard_mode':
            return getRandomTaunt('mind_reading');
        case 'match_success':
            return getRandomTaunt('luck');
        case 'near_victory':
            return getRandomTaunt('taunt');
        case 'compliment':
            return getRandomTaunt('compliment');
        case 'funny':
            return getRandomTaunt('humor');
        default:
            return getRandomTaunt();
    }
}

// 语音播放功能
function speakTaunt(message, lang = 'zh-CN') {
    if ('speechSynthesis' in window) {
        // 取消之前的语音
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = lang;
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        
        // 尝试选择中文语音
        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        return true;
    }
    return false;
}

// 显示嘲讽气泡
function showTauntBubble(element, message, isOpponent = false) {
    const bubble = document.createElement('div');
    bubble.className = 'taunt-bubble';
    bubble.style.cssText = `
        position: absolute;
        background: ${isOpponent ? 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' : 'linear-gradient(135deg, #ffd700, #ffaa00)'};
        color: ${isOpponent ? '#fff' : '#000'};
        padding: 10px 15px;
        border-radius: 15px;
        font-size: 14px;
        max-width: 200px;
        z-index: 1000;
        animation: bubblePop 3s ease-out forwards;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    bubble.textContent = message;
    
    // 定位
    const rect = element.getBoundingClientRect();
    bubble.style.left = rect.left + 'px';
    bubble.style.top = (rect.top - 50) + 'px';
    
    document.body.appendChild(bubble);
    
    // 播放语音
    speakTaunt(message);
    
    // 3秒后移除
    setTimeout(() => {
        bubble.remove();
    }, 3000);
}

// CSS动画
const tauntStyle = document.createElement('style');
tauntStyle.textContent = `
    @keyframes bubblePop {
        0% { opacity: 0; transform: translateY(10px) scale(0.8); }
        20% { opacity: 1; transform: translateY(0) scale(1); }
        80% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
    }
`;
document.head.appendChild(tauntStyle);

// 导出
window.TAUNT_MESSAGES = TAUNT_MESSAGES;
window.getRandomTaunt = getRandomTaunt;
window.getContextualTaunt = getContextualTaunt;
window.speakTaunt = speakTaunt;
window.showTauntBubble = showTauntBubble;
