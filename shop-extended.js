/**
 * 命运塔 - 商店商品扩展 (30+商品)
 * 添加到 shop.html 的 script 标签中
 */

// 扩展商品数据 (30个商品)
const extendedProducts = [
    // 特效类 (5个)
    { id: 'effect_ice', name: '冰霜特效', icon: '❄️', desc: '出牌冰冻效果', price: 128, currency: 'diamond', category: 'effect' },
    { id: 'effect_lightning', name: '雷电特效', icon: '⚡', desc: '出牌雷电效果', price: 138, currency: 'diamond', category: 'effect' },
    { id: 'effect_rainbow', name: '彩虹特效', icon: '🌈', desc: '出牌彩虹效果', price: 158, currency: 'diamond', category: 'effect' },
    { id: 'effect_star', name: '星空特效', icon: '✨', desc: '出牌星空效果', price: 168, currency: 'diamond', category: 'effect' },
    { id: 'effect_dark', name: '暗黑特效', icon: '🌑', desc: '出牌暗黑效果', price: 188, currency: 'diamond', category: 'effect' },
    
    // 皮肤类 (8个)
    { id: 'skin_ocean', name: '海洋皮肤', icon: '🌊', desc: '蔚蓝海洋风格', price: 168, currency: 'diamond', category: 'skin' },
    { id: 'skin_lava', name: '熔岩皮肤', icon: '🌋', desc: '炽热熔岩风格', price: 178, currency: 'diamond', category: 'skin' },
    { id: 'skin_ice', name: '冰川皮肤', icon: '🧊', desc: '寒冷冰川风格', price: 168, currency: 'diamond', category: 'skin' },
    { id: 'skin_neon', name: '霓虹皮肤', icon: '💡', desc: '赛博朋克霓虹', price: 198, currency: 'diamond', category: 'skin' },
    { id: 'skin_paper', name: '剪纸皮肤', icon: '✂️', desc: '中国传统剪纸', price: 158, currency: 'diamond', category: 'skin' },
    { id: 'skin_metal', name: '金属皮肤', icon: '🔩', desc: '重金属质感', price: 188, currency: 'diamond', category: 'skin' },
    { id: 'skin_marble', name: '大理石皮肤', icon: '🏛️', desc: '古罗马大理石', price: 208, currency: 'diamond', category: 'skin' },
    { id: 'skin_magic', name: '魔法皮肤', icon: '🔮', desc: '神秘魔法风格', price: 218, currency: 'diamond', category: 'skin' },
    
    // 卡背类 (5个)
    { id: 'back_royal', name: '皇家卡背', icon: '🏰', desc: '欧式皇家风格', price: 88, currency: 'diamond', category: 'cardback' },
    { id: 'back_ninja', name: '忍者卡背', icon: '🥷', desc: '日本忍者风格', price: 78, currency: 'diamond', category: 'cardback' },
    { id: 'back_space', name: '太空卡背', icon: '🚀', desc: '宇宙太空风格', price: 98, currency: 'diamond', category: 'cardback' },
    { id: 'back_flower', name: '花卉卡背', icon: '🌸', desc: '日式樱花风格', price: 68, currency: 'diamond', category: 'cardback' },
    { id: 'back_chess', name: '棋皮卡背', icon: '♟️', desc: '国际象棋风格', price: 58, currency: 'diamond', category: 'cardback' },
    
    // 头像框类 (5个)
    { id: 'frame_god', name: '神框框', icon: '⚡', desc: '天神下凡', price: 128, currency: 'diamond', category: 'frame' },
    { id: 'frame_devil', name: '恶魔框', icon: '😈', desc: '恶魔降临', price: 118, currency: 'diamond', category: 'frame' },
    { id: 'frame_angel', name: '天使框', icon: '👼', desc: '天使光环', price: 118, currency: 'diamond', category: 'frame' },
    { id: 'frame_ninja', name: '忍者框', icon: '🥷', desc: '暗影忍者', price: 98, currency: 'diamond', category: 'frame' },
    { id: 'frame_samurai', name: '武士框', icon: '⚔️', desc: '日本武士', price: 108, currency: 'diamond', category: 'frame' },
    
    // 道具类 (5个)
    { id: 'item_hint', name: '提示卡', icon: '💡', desc: '显示守卫一张牌', price: 50, currency: 'diamond', category: 'item' },
    { id: 'item_shield', name: '护盾', icon: '🛡️', desc: '抵挡一次激怒', price: 80, currency: 'diamond', category: 'item' },
    { id: 'item_double', name: '双倍卡', icon: '2️⃣', desc: '本局积分双倍', price: 100, currency: 'diamond', category: 'item' },
    { id: 'item_revive', name: '复活卡', icon: '🔄', desc: '失败后复活一次', price: 150, currency: 'diamond', category: 'item' },
    { id: 'item_peek', name: '透视卡', icon: '👁️', desc: '查看守卫所有牌', price: 200, currency: 'diamond', category: 'item' },
    
    // 金币购买 (2个)
    { id: 'gold_1000', name: '1000金币', icon: '💰', desc: '购买1000金币', price: 10, currency: 'diamond', category: 'currency' },
    { id: 'gold_10000', name: '10000金币', icon: '💰', desc: '购买10000金币', price: 88, currency: 'diamond', category: 'currency' },
];

// 渲染扩展商品
function renderExtendedProducts() {
    const container = document.querySelector('.products-container') || document.body;
    
    extendedProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.dataset.category = product.category;
        div.dataset.id = product.id;
        
        const priceHtml = product.currency === 'diamond' 
            ? `<span class="price-diamond">💎 ${product.price}</span>`
            : `<span class="price-gold">💰 ${product.price}</span>`;
        
        div.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.desc}</div>
            <div class="product-price">${priceHtml}</div>
            <button class="buy-btn" onclick="buyItem('${product.id}', '${product.name}', ${product.price}, '${product.currency}')">购买</button>
        `;
        
        container.appendChild(div);
    });
}

// 页面加载后渲染
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', renderExtendedProducts);
}
