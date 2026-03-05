/**
 * 命运塔·首登者 V1.0 - 设备适配框架 + 道具效果系统
 * Device Adaptive Framework + Item Effects System
 * 
 * 重点适配机型：
 * - iPhone SE/8: 375px (0.85x)
 * - iPhone 14/15/16: 390-402px (0.90x)
 * - iPhone Pro Max: 430px (1.00x 基准)
 * - 华为 Mate X6 折叠屏: 700-800px+ (1.20x)
 * - Samsung Galaxy/Pixel: 360-390px (0.88x)
 * - Android大屏: 412px (0.95x)
 */

// ============================================
// 设备检测与适配
// ============================================
class DeviceAdapter {
    constructor() {
        this.deviceInfo = this.detectDevice();
        this.applyDeviceStyles();
        this.setupResizeListener();
    }

    detectDevice() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ua = navigator.userAgent;
        const platform = /iPhone|iPad|iPod/.test(ua) ? 'ios' : 
                        /Android/.test(ua) ? 'android' : 'other';
        
        // 检测设备类型
        let type, scale, name;
        
        // 折叠屏检测 (华为Mate X6, Galaxy Z Fold等)
        if (width >= 700 && width <= 900) {
            type = 'fold';
            scale = 1.20;
            name = '折叠屏展开态';
        }
        // iPhone SE/8 (最小屏幕)
        else if (width <= 380) {
            type = 'small';
            scale = 0.85;
            name = 'iPhone SE/8';
        }
        // iPhone 14/15/16 标准版
        else if (width <= 410) {
            type = 'standard';
            scale = 0.90;
            name = 'iPhone 14/15/16';
        }
        // Android标准屏
        else if (width <= 420) {
            type = 'android';
            scale = 0.88;
            name = 'Android标准';
        }
        // iPhone Pro Max (基准)
        else if (width <= 450) {
            type = 'large';
            scale = 1.00;
            name = 'iPhone Pro Max';
        }
        // Android大屏/Pixel XL
        else if (width <= 500) {
            type = 'xlarge';
            scale = 1.05;
            name = 'Android大屏';
        }
        // 平板
        else {
            type = 'tablet';
            scale = 1.30;
            name = '平板设备';
        }

        return { width, height, platform, type, scale, name };
    }

    applyDeviceStyles() {
        const { scale, type, platform } = this.deviceInfo;
        const root = document.documentElement;
        
        // 设置CSS变量
        root.style.setProperty('--device-scale', scale);
        root.style.setProperty('--card-width', `${scale * 48}px`);
        root.style.setProperty('--card-height', `${scale * 68}px`);
        root.style.setProperty('--card-font-size', `${scale * 16}px`);
        root.style.setProperty('--btn-height', `${scale * 44}px`);
        root.style.setProperty('--space-sm', `${scale * 8}px`);
        root.style.setProperty('--space-md', `${scale * 16}px`);
        root.style.setProperty('--space-lg', `${scale * 24}px`);
        
        // 设置设备类名
        document.body.className = `device-${type} platform-${platform}`;
        
        // 华为Mate X6特殊处理
        if (type === 'fold' && /Huawei|Mate/.test(navigator.userAgent)) {
            document.body.classList.add('huawei-mate-fold');
        }
        
        console.log(`📱 设备适配: ${this.deviceInfo.name}, 缩放: ${scale}x`);
    }

    setupResizeListener() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.deviceInfo = this.detectDevice();
                this.applyDeviceStyles();
            }, 250);
        });
    }
}

// ============================================
// 道具效果系统
// ============================================
class ItemEffectsSystem {
    constructor() {
        this.equipped = this.loadEquippedItems();
        this.activeEffects = new Map();
    }

    loadEquippedItems() {
        const saved = localStorage.getItem('tof_equipped');
        return saved ? JSON.parse(saved) : {
            skin: null,
            effect: null,
            card_back: null,
            avatar: null
        };
    }

    // ========== 卡牌皮肤效果 ==========
    applyCardSkin(cardElement, skinId) {
        if (!skinId) return;
        
        const skinEffects = {
            'skin_gold': {
                className: 'skin-gold',
                style: 'background: linear-gradient(135deg, #FFD700, #FFA500); box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);'
            },
            'skin_crystal': {
                className: 'skin-crystal',
                style: 'background: linear-gradient(135deg, #E0F7FA, #B2EBF2); box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);'
            },
            'skin_wood': {
                className: 'skin-wood',
                style: 'background: linear-gradient(135deg, #8B4513, #D2691E);'
            },
            'skin_forest': {
                className: 'skin-forest',
                style: 'background: linear-gradient(135deg, #228B22, #90EE90);'
            },
            'skin_magma': {
                className: 'skin-magma',
                style: 'background: linear-gradient(135deg, #FF4500, #FF6347); box-shadow: 0 0 15px rgba(255, 69, 0, 0.5);'
            },
            'skin_neon': {
                className: 'skin-neon',
                style: 'background: linear-gradient(135deg, #FF00FF, #00FFFF); box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);'
            }
        };

        const effect = skinEffects[skinId];
        if (effect) {
            cardElement.classList.add(effect.className);
            cardElement.style.cssText += effect.style;
        }
    }

    // ========== 出牌特效 ==========
    async playCardEffect(effectId, targetElement) {
        if (!effectId) return;
        
        const effects = {
            'effect_fire': this.fireEffect.bind(this),
            'effect_ice': this.iceEffect.bind(this),
            'effect_lightning': this.lightningEffect.bind(this),
            'effect_heart': this.heartEffect.bind(this),
            'effect_star': this.starEffect.bind(this),
            'effect_money': this.moneyEffect.bind(this)
        };

        const effectFn = effects[effectId];
        if (effectFn) {
            await effectFn(targetElement);
        }
    }

    // 火焰特效
    async fireEffect(target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 创建火焰粒子
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'effect-particle fire-particle';
                particle.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: ${Math.random() * 20 + 10}px;
                    height: ${Math.random() * 20 + 10}px;
                    background: radial-gradient(circle, #FF6B35, #FF4500, transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: fireBurst ${Math.random() * 0.5 + 0.5}s ease-out forwards;
                `;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }, i * 50);
        }
        
        // 添加火焰动画样式
        this.addEffectStyles('fire', `
            @keyframes fireBurst {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { 
                    transform: translate(
                        ${(Math.random() - 0.5) * 200}px, 
                        ${-Math.random() * 200 - 100}px
                    ) scale(0); 
                    opacity: 0; 
                }
            }
        `);
    }

    // 冰霜特效
    async iceEffect(target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 冰霜结晶效果
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const crystal = document.createElement('div');
                const size = Math.random() * 30 + 20;
                const angle = (i / 15) * Math.PI * 2;
                const distance = Math.random() * 100 + 50;
                
                crystal.className = 'effect-particle ice-crystal';
                crystal.style.cssText = `
                    position: fixed;
                    left: ${centerX + Math.cos(angle) * distance}px;
                    top: ${centerY + Math.sin(angle) * distance}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: linear-gradient(135deg, rgba(200, 240, 255, 0.9), rgba(100, 200, 255, 0.6));
                    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                    pointer-events: none;
                    z-index: 9999;
                    animation: iceShatter 0.8s ease-out forwards;
                `;
                document.body.appendChild(crystal);
                setTimeout(() => crystal.remove(), 800);
            }, i * 40);
        }
        
        this.addEffectStyles('ice', `
            @keyframes iceShatter {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
        `);
    }

    // 闪电特效
    async lightningEffect(target) {
        const rect = target.getBoundingClientRect();
        
        // 闪电闪烁
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    left: ${rect.left - 50}px;
                    top: ${rect.top - 50}px;
                    width: ${rect.width + 100}px;
                    height: ${rect.height + 100}px;
                    background: radial-gradient(ellipse, rgba(255, 255, 0, 0.8), transparent 70%);
                    pointer-events: none;
                    z-index: 9999;
                    animation: lightningFlash 0.2s ease-out;
                `;
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 200);
            }, i * 150);
        }
        
        // 闪电路径
        const bolt = document.createElement('div');
        bolt.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top - 100}px;
            width: 4px;
            height: 200px;
            background: linear-gradient(to bottom, #FFFF00, #FFA500);
            filter: blur(2px);
            pointer-events: none;
            z-index: 9999;
            animation: lightningStrike 0.3s ease-out;
            transform-origin: top center;
        `;
        document.body.appendChild(bolt);
        setTimeout(() => bolt.remove(), 300);
        
        this.addEffectStyles('lightning', `
            @keyframes lightningFlash {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
            @keyframes lightningStrike {
                0% { transform: scaleY(0); opacity: 1; }
                100% { transform: scaleY(1); opacity: 0; }
            }
        `);
    }

    // 爱心特效
    async heartEffect(target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💖';
                heart.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    font-size: ${Math.random() * 20 + 20}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: heartFloat ${Math.random() * 1 + 1}s ease-out forwards;
                `;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 2000);
            }, i * 100);
        }
        
        this.addEffectStyles('heart', `
            @keyframes heartFloat {
                0% { transform: translate(0, 0) scale(0); opacity: 1; }
                50% { transform: translate(${(Math.random()-0.5)*100}px, -50px) scale(1.2); opacity: 0.8; }
                100% { transform: translate(${(Math.random()-0.5)*150}px, -150px) scale(0); opacity: 0; }
            }
        `);
    }

    // 星辰特效
    async starEffect(target) {
        const rect = target.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.textContent = '✨';
                const angle = (i / 12) * Math.PI * 2;
                const distance = 80;
                
                star.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width/2 + Math.cos(angle) * 20}px;
                    top: ${rect.top + rect.height/2 + Math.sin(angle) * 20}px;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: starSparkle 1s ease-out forwards;
                `;
                document.body.appendChild(star);
                setTimeout(() => star.remove(), 1000);
            }, i * 80);
        }
        
        this.addEffectStyles('star', `
            @keyframes starSparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
            }
        `);
    }

    // 金币特效
    async moneyEffect(target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.textContent = '🪙';
                coin.style.cssText = `
                    position: fixed;
                    left: ${centerX + (Math.random() - 0.5) * 100}px;
                    top: ${centerY}px;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: coinBurst ${Math.random() * 0.5 + 0.5}s ease-out forwards;
                `;
                document.body.appendChild(coin);
                setTimeout(() => coin.remove(), 1000);
            }, i * 50);
        }
        
        this.addEffectStyles('money', `
            @keyframes coinBurst {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
        `);
    }

    // 添加特效样式
    addEffectStyles(id, css) {
        if (!document.getElementById(`effect-style-${id}`)) {
            const style = document.createElement('style');
            style.id = `effect-style-${id}`;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // ========== 卡背效果 ==========
    applyCardBack(cardBackId) {
        const cardBacks = {
            'back_dragon': '🐉',
            'back_phoenix': '🦅',
            'back_moon': '🌙',
            'back_stars': '🌌',
            'back_flower': '🌸',
            'back_skull': '💀'
        };
        return cardBacks[cardBackId] || '?';
    }

    // ========== 头像框效果 ==========
    applyAvatarFrame(avatarElement, frameId) {
        if (!frameId) return;
        
        const frameEffects = {
            'frame_king': { border: '3px solid #FFD700', boxShadow: '0 0 20px #FFD700' },
            'frame_star': { border: '3px solid #4169E1', boxShadow: '0 0 15px #4169E1' },
            'frame_fire': { border: '3px solid #FF4500', boxShadow: '0 0 15px #FF4500' },
            'frame_ice': { border: '3px solid #00CED1', boxShadow: '0 0 15px #00CED1' },
            'frame_angel': { border: '3px solid #FFF', boxShadow: '0 0 20px #FFF, 0 0 40px #FFD700' },
            'frame_devil': { border: '3px solid #8B0000', boxShadow: '0 0 20px #8B0000' }
        };

        const effect = frameEffects[frameId];
        if (effect) {
            Object.assign(avatarElement.style, effect);
            avatarElement.style.borderRadius = '50%';
        }
    }
}

// ============================================
// 导出
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DeviceAdapter, ItemEffectsSystem };
}
