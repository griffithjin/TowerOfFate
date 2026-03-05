/**
 * 命运塔·首登者 V1.0 - 商城数据
 */

// 商品列表
const SHOP_ITEMS = [
    // ========== 卡牌皮肤 ==========
    {
        id: 'skin_gold',
        name: '黄金卡牌',
        description: '尊贵黄金卡牌外观，出牌时闪耀金光',
        price: 5000,
        currency: 'coins',
        type: 'skin',
        icon: '🟨',
        rarity: 'legendary',
        effect: 'gold_shimmer'
    },
    {
        id: 'skin_crystal',
        name: '水晶卡牌',
        description: '晶莹剔透的水晶卡牌，带有蓝色光晕',
        price: 3000,
        currency: 'coins',
        type: 'skin',
        icon: '💎',
        rarity: 'epic',
        effect: 'crystal_glow'
    },
    {
        id: 'skin_wood',
        name: '木质卡牌',
        description: '复古木质纹理，经典怀旧风格',
        price: 1000,
        currency: 'coins',
        type: 'skin',
        icon: '🟫',
        rarity: 'common',
        effect: 'none'
    },
    {
        id: 'skin_forest',
        name: '森林卡牌',
        description: '翠绿森林主题，生机勃勃',
        price: 1500,
        currency: 'coins',
        type: 'skin',
        icon: '🌲',
        rarity: 'rare',
        effect: 'leaf_particles'
    },
    {
        id: 'skin_magma',
        name: '熔岩卡牌',
        description: '炽热熔岩纹理，滚烫动感',
        price: 3500,
        currency: 'coins',
        type: 'skin',
        icon: '🌋',
        rarity: 'epic',
        effect: 'magma_flow'
    },
    {
        id: 'skin_neon',
        name: '霓虹卡牌',
        description: '赛博朋克霓虹风格，炫酷未来感',
        price: 4000,
        currency: 'coins',
        type: 'skin',
        icon: '💠',
        rarity: 'epic',
        effect: 'neon_pulse'
    },

    // ========== 出牌特效 ==========
    {
        id: 'effect_fire',
        name: '火焰特效',
        description: '出牌时伴随熊熊烈火',
        price: 2000,
        currency: 'coins',
        type: 'effect',
        icon: '🔥',
        rarity: 'epic',
        effect: 'fire_burst'
    },
    {
        id: 'effect_ice',
        name: '冰霜特效',
        description: '出牌时伴随冰霜结晶',
        price: 2000,
        currency: 'coins',
        type: 'effect',
        icon: '❄️',
        rarity: 'epic',
        effect: 'ice_shatter'
    },
    {
        id: 'effect_lightning',
        name: '闪电特效',
        description: '出牌时伴随闪电霹雳',
        price: 3500,
        currency: 'coins',
        type: 'effect',
        icon: '⚡',
        rarity: 'legendary',
        effect: 'lightning_strike'
    },
    {
        id: 'effect_heart',
        name: '爱心特效',
        description: '出牌时飘出爱心泡泡',
        price: 1500,
        currency: 'coins',
        type: 'effect',
        icon: '💖',
        rarity: 'rare',
        effect: 'heart_float'
    },
    {
        id: 'effect_star',
        name: '星辰特效',
        description: '出牌时星光闪烁',
        price: 2500,
        currency: 'coins',
        type: 'effect',
        icon: '✨',
        rarity: 'epic',
        effect: 'star_sparkle'
    },
    {
        id: 'effect_money',
        name: '金币特效',
        description: '出牌时金币飞溅',
        price: 3000,
        currency: 'coins',
        type: 'effect',
        icon: '💰',
        rarity: 'epic',
        effect: 'coin_burst'
    },

    // ========== 卡背 ==========
    {
        id: 'back_dragon',
        name: '龙纹卡背',
        description: '霸气龙纹图案，威严庄重',
        price: 2500,
        currency: 'coins',
        type: 'card_back',
        icon: '🐉',
        rarity: 'epic',
        effect: 'dragon_animation'
    },
    {
        id: 'back_phoenix',
        name: '凤凰卡背',
        description: '华丽凤凰图案，浴火重生',
        price: 2500,
        currency: 'coins',
        type: 'card_back',
        icon: '🦅',
        rarity: 'epic',
        effect: 'phoenix_animation'
    },
    {
        id: 'back_moon',
        name: '月影卡背',
        description: '静谧月夜图案，神秘优雅',
        price: 1500,
        currency: 'coins',
        type: 'card_back',
        icon: '🌙',
        rarity: 'rare',
        effect: 'moon_glow'
    },
    {
        id: 'back_stars',
        name: '星空卡背',
        description: '璀璨星空图案，浩瀚深邃',
        price: 1800,
        currency: 'coins',
        type: 'card_back',
        icon: '🌌',
        rarity: 'rare',
        effect: 'star_twinkle'
    },
    {
        id: 'back_flower',
        name: '樱花卡背',
        description: '浪漫樱花图案，唯美清新',
        price: 1200,
        currency: 'coins',
        type: 'card_back',
        icon: '🌸',
        rarity: 'rare',
        effect: 'petal_fall'
    },
    {
        id: 'back_skull',
        name: '骷髅卡背',
        description: '酷炫骷髅图案，叛逆张扬',
        price: 2000,
        currency: 'coins',
        type: 'card_back',
        icon: '💀',
        rarity: 'epic',
        effect: 'skull_flash'
    },

    // ========== 头像框 ==========
    {
        id: 'frame_king',
        name: '王者边框',
        description: '尊贵金色皇冠边框',
        price: 5000,
        currency: 'coins',
        type: 'avatar',
        icon: '👑',
        rarity: 'legendary',
        effect: 'crown_shine'
    },
    {
        id: 'frame_star',
        name: '星辰边框',
        description: '闪耀星光环绕边框',
        price: 1500,
        currency: 'coins',
        type: 'avatar',
        icon: '⭐',
        rarity: 'rare',
        effect: 'star_rotate'
    },
    {
        id: 'frame_fire',
        name: '烈焰边框',
        description: '火焰燃烧动态边框',
        price: 3000,
        currency: 'coins',
        type: 'avatar',
        icon: '🔥',
        rarity: 'epic',
        effect: 'fire_loop'
    },
    {
        id: 'frame_ice',
        name: '冰霜边框',
        description: '冰晶凝结动态边框',
        price: 3000,
        currency: 'coins',
        type: 'avatar',
        icon: '🧊',
        rarity: 'epic',
        effect: 'ice_shimmer'
    },
    {
        id: 'frame_angel',
        name: '天使边框',
        description: '圣洁羽翼光环边框',
        price: 3500,
        currency: 'diamonds',
        type: 'avatar',
        icon: '😇',
        rarity: 'legendary',
        effect: 'wing_flutter'
    },
    {
        id: 'frame_devil',
        name: '恶魔边框',
        description: '邪魅魔角暗影边框',
        price: 3500,
        currency: 'diamonds',
        type: 'avatar',
        icon: '😈',
        rarity: 'legendary',
        effect: 'shadow_pulse'
    },

    // ========== 表情包 ==========
    {
        id: 'emote_laugh',
        name: '大笑表情',
        description: '嘲讽必备：哈哈哈！',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '😂',
        rarity: 'common',
        effect: 'laugh_animation'
    },
    {
        id: 'emote_cry',
        name: '哭泣表情',
        description: '假装可怜：呜呜呜...',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '😭',
        rarity: 'common',
        effect: 'tear_drop'
    },
    {
        id: 'emote_angry',
        name: '愤怒表情',
        description: '表达不满：气死我了！',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '😡',
        rarity: 'common',
        effect: 'steam_blow'
    },
    {
        id: 'emote_think',
        name: '思考表情',
        description: '深思熟虑：让我想想...',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '🤔',
        rarity: 'common',
        effect: 'thought_bubble'
    },
    {
        id: 'emote_clap',
        name: '鼓掌表情',
        description: '表示赞赏：好牌！',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '👏',
        rarity: 'common',
        effect: 'clap_animation'
    },
    {
        id: 'emote_shock',
        name: '震惊表情',
        description: '表示惊讶：不会吧！',
        price: 500,
        currency: 'coins',
        type: 'emote',
        icon: '😱',
        rarity: 'common',
        effect: 'shake_effect'
    },

    // ========== 钻石商品（高级） ==========
    {
        id: 'vip_pass',
        name: 'VIP通行证',
        description: '30天VIP特权：额外+1激怒牌槽、开局第3层',
        price: 980,
        currency: 'diamonds',
        type: 'vip',
        icon: '💎',
        rarity: 'legendary',
        effect: 'vip_badge'
    },
    {
        id: 'exp_boost',
        name: '经验加速器',
        description: '24小时内获得双倍经验',
        price: 200,
        currency: 'diamonds',
        type: 'boost',
        icon: '⚡',
        rarity: 'epic',
        effect: 'exp_multiplier'
    },
    {
        id: 'coin_boost',
        name: '金币加速器',
        description: '24小时内获得双倍金币',
        price: 150,
        currency: 'diamonds',
        type: 'boost',
        icon: '💰',
        rarity: 'epic',
        effect: 'coin_multiplier'
    },
    {
        id: 'lucky_charm',
        name: '幸运护符',
        description: '下一局激怒牌免疫50%',
        price: 100,
        currency: 'diamonds',
        type: 'consumable',
        icon: '🍀',
        rarity: 'rare',
        effect: 'provocation_resist'
    }
];

// 商品特效定义
const SHOP_EFFECTS = {
    // 皮肤特效
    gold_shimmer: {
        name: '金光闪烁',
        css: 'animation: goldShimmer 2s infinite;',
        keyframes: `
            @keyframes goldShimmer {
                0%, 100% { box-shadow: 0 0 10px #FFD700; }
                50% { box-shadow: 0 0 30px #FFD700, 0 0 60px #FFA500; }
            }
        `
    },
    crystal_glow: {
        name: '水晶辉光',
        css: 'animation: crystalGlow 2s infinite;',
        keyframes: `
            @keyframes crystalGlow {
                0%, 100% { box-shadow: 0 0 10px #00d4ff; }
                50% { box-shadow: 0 0 30px #00d4ff, 0 0 60px #0088ff; }
            }
        `
    },

    // 出牌特效
    fire_burst: {
        name: '火焰爆发',
        animation: 'fireBurst',
        duration: 1000,
        particleCount: 20
    },
    ice_shatter: {
        name: '冰霜碎裂',
        animation: 'iceShatter',
        duration: 800,
        particleCount: 15
    },
    lightning_strike: {
        name: '闪电打击',
        animation: 'lightningStrike',
        duration: 500,
        particleCount: 5
    },
    heart_float: {
        name: '爱心飘浮',
        animation: 'heartFloat',
        duration: 2000,
        particleCount: 8
    },
    star_sparkle: {
        name: '星光闪烁',
        animation: 'starSparkle',
        duration: 1500,
        particleCount: 12
    },
    coin_burst: {
        name: '金币爆发',
        animation: 'coinBurst',
        duration: 1200,
        particleCount: 15
    }
};

// 获取商品
function getShopItem(itemId) {
    return SHOP_ITEMS.find(item => item.id === itemId);
}

// 获取分类商品
function getShopItemsByCategory(category) {
    return category === 'all' 
        ? SHOP_ITEMS 
        : SHOP_ITEMS.filter(item => item.type === category);
}

// 获取用户库存
function getUserInventory() {
    const saved = localStorage.getItem('tof_inventory');
    return saved ? JSON.parse(saved) : [];
}

// 检查是否拥有商品
function ownsItem(itemId) {
    return getUserInventory().includes(itemId);
}

// 获取已装备的皮肤/特效
function getEquippedItems() {
    const saved = localStorage.getItem('tof_equipped');
    return saved ? JSON.parse(saved) : {
        skin: null,
        effect: null,
        card_back: null,
        avatar: null
    };
}

// 装备商品
function equipItem(itemId) {
    const item = getShopItem(itemId);
    if (!item) return false;
    
    const equipped = getEquippedItems();
    equipped[item.type] = itemId;
    localStorage.setItem('tof_equipped', JSON.stringify(equipped));
    return true;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SHOP_ITEMS,
        SHOP_EFFECTS,
        getShopItem,
        getShopItemsByCategory,
        getUserInventory,
        ownsItem,
        getEquippedItems,
        equipItem
    };
}
