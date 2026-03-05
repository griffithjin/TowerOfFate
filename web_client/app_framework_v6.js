/**
 * 命运塔·首登者 - 移动端APP核心框架 V6.0
 * 
 * 设计原则：
 * 1. 一屏式布局 - 所有核心内容在一个屏幕内完成
 * 2. 移动优先 - 针对iPhone和触摸屏优化
 * 3. 营收导向 - 优先展示付费点、VIP、商城入口
 * 4. 触摸热区 - 最小44px（iOS标准）
 * 5. 手势操作 - 滑动、点击、长按支持
 */

// ==================== 核心配置 ====================
const AppConfig = {
    // 触摸配置
    touch: {
        minTapSize: 44,           // iOS最小点击区域
        minComfortSize: 48,       // Android推荐点击区域
        longPressDelay: 500,      // 长按延迟毫秒
        swipeThreshold: 50        // 滑动阈值
    },
    
    // 一屏布局配置
    layout: {
        headerHeight: 56,         // 头部高度px
        bottomNavHeight: 64,      // 底部导航高度px
        safeAreaTop: 'env(safe-area-inset-top)',
        safeAreaBottom: 'env(safe-area-inset-bottom)'
    },
    
    // 营收配置
    monetization: {
        vipLevels: [1,2,3,4,5,6,7,8],
        diamondPacks: [60, 300, 980, 1980, 6480],
        subscriptionPrice: 9.99
    }
};

// ==================== 移动端触摸框架 ====================
class MobileTouchFramework {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isLongPress = false;
        this.longPressTimer = null;
        
        this.init();
    }
    
    init() {
        // 禁用双击缩放
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 禁用手势缩放
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        // 初始化触摸事件
        this.bindTouchEvents();
    }
    
    bindTouchEvents() {
        document.querySelectorAll('[data-touchable]').forEach(el => {
            el.addEventListener('touchstart', (e) => this.handleTouchStart(e, el), { passive: true });
            el.addEventListener('touchmove', (e) => this.handleTouchMove(e, el), { passive: true });
            el.addEventListener('touchend', (e) => this.handleTouchEnd(e, el), { passive: true });
            el.addEventListener('touchcancel', (e) => this.handleTouchCancel(e, el), { passive: true });
        });
    }
    
    handleTouchStart(e, el) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
        this.isLongPress = false;
        
        // 添加按下效果
        el.classList.add('touch-active');
        
        // 长按检测
        this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
            el.dispatchEvent(new CustomEvent('longpress'));
        }, AppConfig.touch.longPressDelay);
    }
    
    handleTouchMove(e, el) {
        if (!this.touchStartX) return;
        
        const deltaX = e.touches[0].clientX - this.touchStartX;
        const deltaY = e.touches[0].clientY - this.touchStartY;
        
        // 如果移动超过阈值，取消长按
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            clearTimeout(this.longPressTimer);
            el.classList.remove('touch-active');
        }
    }
    
    handleTouchEnd(e, el) {
        clearTimeout(this.longPressTimer);
        el.classList.remove('touch-active');
        
        const deltaX = e.changedTouches[0].clientX - this.touchStartX;
        const deltaY = e.changedTouches[0].clientY - this.touchStartY;
        const deltaTime = Date.now() - this.touchStartTime;
        
        // 点击检测（快速轻触）
        if (Math.abs(deltaX) < AppConfig.touch.swipeThreshold && 
            Math.abs(deltaY) < AppConfig.touch.swipeThreshold &&
            deltaTime < 300 && !this.isLongPress) {
            el.click();
        }
        
        // 滑动检测
        if (Math.abs(deltaX) > AppConfig.touch.swipeThreshold) {
            if (deltaX > 0) {
                el.dispatchEvent(new CustomEvent('swiperight'));
            } else {
                el.dispatchEvent(new CustomEvent('swipeleft'));
            }
        }
        
        this.touchStartX = 0;
        this.touchStartY = 0;
    }
    
    handleTouchCancel(e, el) {
        clearTimeout(this.longPressTimer);
        el.classList.remove('touch-active');
    }
}

// ==================== 一屏式布局管理器 ====================
class OneScreenLayout {
    constructor() {
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        this.init();
    }
    
    init() {
        this.calculateLayout();
        window.addEventListener('resize', () => this.calculateLayout());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.calculateLayout(), 300);
        });
    }
    
    calculateLayout() {
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const isLandscape = this.viewport.width > this.viewport.height;
        const isTablet = this.viewport.width >= 768;
        
        // 设置CSS变量
        document.documentElement.style.setProperty('--viewport-width', `${this.viewport.width}px`);
        document.documentElement.style.setProperty('--viewport-height', `${this.viewport.height}px`);
        document.documentElement.style.setProperty('--is-landscape', isLandscape ? '1' : '0');
        document.documentElement.style.setProperty('--is-tablet', isTablet ? '1' : '0');
        
        // 计算内容区域高度（减去安全区）
        const safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-top')) || 0;
        const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom')) || 0;
        const contentHeight = this.viewport.height - safeTop - safeBottom;
        
        document.documentElement.style.setProperty('--content-height', `${contentHeight}px`);
    }
    
    // 获取可用游戏区域
    getGameArea() {
        const header = document.querySelector('.app-header');
        const bottomNav = document.querySelector('.app-bottom-nav');
        
        const headerHeight = header ? header.offsetHeight : AppConfig.layout.headerHeight;
        const bottomHeight = bottomNav ? bottomNav.offsetHeight : AppConfig.layout.bottomNavHeight;
        
        return {
            width: this.viewport.width,
            height: this.viewport.height - headerHeight - bottomHeight,
            top: headerHeight,
            bottom: bottomHeight
        };
    }
}

// ==================== 营收优化模块 ====================
class MonetizationOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.highlightVIPAreas();
        this.optimizePurchaseFlow();
        this.setupRetentionHooks();
    }
    
    // 高亮VIP区域
    highlightVIPAreas() {
        document.querySelectorAll('[data-vip]').forEach(el => {
            el.classList.add('vip-highlight');
        });
    }
    
    // 优化购买流程
    optimizePurchaseFlow() {
        // 减少购买步骤到最少
        document.querySelectorAll('[data-purchase]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showQuickPurchaseModal(btn.dataset.purchase);
            });
        });
    }
    
    // 显示快速购买弹窗
    showQuickPurchaseModal(productId) {
        // 简化为一键购买
        const modal = document.createElement('div');
        modal.className = 'quick-purchase-modal';
        modal.innerHTML = `
            <div class="purchase-content">
                <h3>确认购买</h3>
                <p>产品: ${productId}</p>
                <button class="btn-buy-now" onclick="Monetization.processPurchase('${productId}')">
                    立即购买
                </button>
                <button class="btn-cancel" onclick="this.closest('.quick-purchase-modal').remove()">
                    取消
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 设置留存钩子
    setupRetentionHooks() {
        // 每日奖励提醒
        // 连胜奖励
        // 限时优惠
    }
}

// ==================== 游戏状态管理器 ====================
class GameStateManager {
    constructor() {
        this.state = {
            currentGame: null,
            player: {
                diamonds: 0,
                coins: 0,
                vipLevel: 0,
                level: 1
            },
            settings: {
                sound: true,
                vibration: true
            }
        };
        
        this.loadState();
    }
    
    loadState() {
        const saved = localStorage.getItem('gameState');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
    }
    
    saveState() {
        localStorage.setItem('gameState', JSON.stringify(this.state));
    }
    
    updatePlayer(data) {
        this.state.player = { ...this.state.player, ...data };
        this.saveState();
        this.updateUI();
    }
    
    updateUI() {
        // 更新所有显示玩家信息的元素
        document.querySelectorAll('[data-player-diamonds]').forEach(el => {
            el.textContent = this.state.player.diamonds;
        });
        document.querySelectorAll('[data-player-coins]').forEach(el => {
            el.textContent = this.state.player.coins;
        });
    }
}

// ==================== 全局初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化触摸框架
    window.touchFramework = new MobileTouchFramework();
    
    // 初始化一屏布局
    window.oneScreenLayout = new OneScreenLayout();
    
    // 初始化游戏状态
    window.gameState = new GameStateManager();
    
    // 初始化营收优化
    window.monetization = new MonetizationOptimizer();
    
    console.log('[App] 移动端APP框架初始化完成');
});

// 导出
window.AppFramework = {
    config: AppConfig,
    TouchFramework: MobileTouchFramework,
    OneScreenLayout: OneScreenLayout,
    GameState: GameStateManager,
    Monetization: MonetizationOptimizer
};
