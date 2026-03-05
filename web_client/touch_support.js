/**
 * 命运塔·首登者 - 触摸支持系统
 * 全面支持触摸屏操作
 */

class TouchSupportSystem {
    constructor() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.init();
    }
    
    init() {
        if (!this.isTouch) {
            console.log('[TouchSupport] 非触摸设备');
            return;
        }
        
        console.log('[TouchSupport] 初始化触摸支持');
        document.body.classList.add('touch-device');
        
        this.addTouchStyles();
        this.bindTouchEvents();
        this.enhanceTouchTargets();
    }
    
    // 添加触摸专用样式
    addTouchStyles() {
        const css = `
            /* 触摸设备专用样式 */
            .touch-device .game-card,
            .touch-device .hand-card {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            /* 增大触摸热区 */
            .touch-device .game-card::after,
            .touch-device .btn::after {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
            }
            
            /* 触摸反馈 */
            .touch-device .game-card:active,
            .touch-device .btn:active {
                transform: scale(0.95);
                opacity: 0.9;
            }
            
            /* 防止双击缩放 */
            .touch-device * {
                touch-action: manipulation;
            }
            
            /* 滚动优化 */
            .touch-device .hand-scroll-container,
            .touch-device .log-section {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            
            /* 长按提示 */
            .touch-device .long-press-hint {
                display: block;
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 5px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // 绑定触摸事件
    bindTouchEvents() {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // 防止弹性滚动问题
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.hand-scroll-container') || 
                e.target.closest('.log-section')) {
                return; // 允许滚动区域正常滚动
            }
        }, { passive: true });
    }
    
    // 增强触摸目标
    enhanceTouchTargets() {
        // 为所有按钮和卡片添加触摸增强
        const touchTargets = document.querySelectorAll(
            'button, .btn, .hand-card, .destiny-card, .action-btn, .feature-item'
        );
        
        touchTargets.forEach(el => {
            // 确保最小触控尺寸
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                el.style.minWidth = '44px';
                el.style.minHeight = '44px';
            }
            
            // 添加触摸反馈
            el.addEventListener('touchstart', () => {
                el.classList.add('touch-active');
            }, { passive: true });
            
            el.addEventListener('touchend', () => {
                el.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    // 检测滑动手势
    detectSwipe(element, callback) {
        let startX, startY;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = endX - startX;
            const diffY = endY - startY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // 水平滑动
                if (Math.abs(diffX) > 50) {
                    callback(diffX > 0 ? 'right' : 'left');
                }
            }
        }, { passive: true });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.TouchSupport = new TouchSupportSystem();
});

// 导出
window.TouchSupportSystem = TouchSupportSystem;
