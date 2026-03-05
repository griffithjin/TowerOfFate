/**
 * 命运塔·首登者 - 移动端适配
 * V1.0 - 2026-03-05
 */

class MobileAdapter {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouch = 'ontouchstart' in window;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.deviceType = this.detectDeviceType();
        
        this.init();
    }

    init() {
        this.setupViewport();
        this.setupTouchEvents();
        this.setupOrientation();
        this.setupSafeArea();
        this.setupResponsive();
    }

    /**
     * 检测是否为移动设备
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || window.innerWidth <= 1024;
    }

    /**
     * 检测设备类型
     */
    detectDeviceType() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const minSide = Math.min(width, height);
        
        if (minSide < 375) return 'small-phone'; // iPhone SE
        if (minSide < 414) return 'phone'; // iPhone 12/13/14
        if (minSide < 768) return 'large-phone'; // iPhone Pro Max
        if (minSide < 1024) return 'tablet'; // iPad
        return 'desktop';
    }

    /**
     * 设置 viewport
     */
    setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // 禁止缩放，确保触摸体验
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }

    /**
     * 设置触摸事件
     */
    setupTouchEvents() {
        if (!this.isTouch) return;
        
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // 防止橡皮筋效果（iOS）
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.scrollable')) return;
            e.preventDefault();
        }, { passive: false });
        
        // 添加触摸反馈
        this.addTouchFeedback();
    }

    /**
     * 添加触摸反馈
     */
    addTouchFeedback() {
        const style = document.createElement('style');
        style.textContent = `
            .touchable {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            .touchable:active {
                transform: scale(0.95);
                opacity: 0.8;
            }
            .touch-feedback {
                position: relative;
                overflow: hidden;
            }
            .touch-feedback::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s;
            }
            .touch-feedback:active::after {
                width: 200%;
                height: 200%;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 设置方向监听
     */
    setupOrientation() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;
                this.deviceType = this.detectDeviceType();
                this.emit('orientationchange', {
                    width: this.screenWidth,
                    height: this.screenHeight,
                    type: this.deviceType
                });
            }, 300);
        });
    }

    /**
     * 设置安全区（iOS刘海屏、灵动岛）
     */
    setupSafeArea() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --sat: env(safe-area-inset-top);
                --sar: env(safe-area-inset-right);
                --sab: env(safe-area-inset-bottom);
                --sal: env(safe-area-inset-left);
            }
            
            .safe-area-top {
                padding-top: max(20px, env(safe-area-inset-top));
            }
            .safe-area-bottom {
                padding-bottom: max(20px, env(safe-area-inset-bottom));
            }
            .safe-area-left {
                padding-left: max(16px, env(safe-area-inset-left));
            }
            .safe-area-right {
                padding-right: max(16px, env(safe-area-inset-right));
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 设置响应式
     */
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            this.deviceType = this.detectDeviceType();
            this.emit('resize', {
                width: this.screenWidth,
                height: this.screenHeight,
                type: this.deviceType
            });
        });
    }

    /**
     * 获取触摸坐标
     */
    getTouchPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if (e.changedTouches && e.changedTouches.length > 0) {
            return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    /**
     * 长按检测
     */
    onLongPress(element, callback, duration = 500) {
        let timer;
        let startX, startY;
        
        const start = (e) => {
            const pos = this.getTouchPos(e);
            startX = pos.x;
            startY = pos.y;
            timer = setTimeout(() => {
                callback(e);
            }, duration);
        };
        
        const end = (e) => {
            clearTimeout(timer);
        };
        
        const move = (e) => {
            const pos = this.getTouchPos(e);
            const dist = Math.sqrt(
                Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2)
            );
            if (dist > 10) {
                clearTimeout(timer);
            }
        };
        
        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchend', end, { passive: true });
        element.addEventListener('touchmove', move, { passive: true });
        
        // 鼠标支持
        element.addEventListener('mousedown', start);
        element.addEventListener('mouseup', end);
        element.addEventListener('mousemove', move);
    }

    /**
     * 滑动检测
     */
    onSwipe(element, callbacks) {
        let startX, startY, startTime;
        
        const start = (e) => {
            const pos = this.getTouchPos(e);
            startX = pos.x;
            startY = pos.y;
            startTime = Date.now();
        };
        
        const end = (e) => {
            const pos = this.getTouchPos(e);
            const endX = pos.x;
            const endY = pos.y;
            const endTime = Date.now();
            
            const distX = endX - startX;
            const distY = endY - startY;
            const duration = endTime - startTime;
            
            // 滑动速度阈值
            const velocity = Math.sqrt(distX * distX + distY * distY) / duration;
            if (velocity < 0.5) return;
            
            // 判断方向
            if (Math.abs(distX) > Math.abs(distY)) {
                if (distX > 50 && callbacks.onSwipeRight) {
                    callbacks.onSwipeRight();
                } else if (distX < -50 && callbacks.onSwipeLeft) {
                    callbacks.onSwipeLeft();
                }
            } else {
                if (distY > 50 && callbacks.onSwipeDown) {
                    callbacks.onSwipeDown();
                } else if (distY < -50 && callbacks.onSwipeUp) {
                    callbacks.onSwipeUp();
                }
            }
        };
        
        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchend', end, { passive: true });
        
        // 鼠标支持
        element.addEventListener('mousedown', start);
        element.addEventListener('mouseup', end);
    }

    /**
     * 事件发射器
     */
    emit(event, data) {
        const e = new CustomEvent(`mobile:${event}`, { detail: data });
        window.dispatchEvent(e);
    }

    /**
     * 监听事件
     */
    on(event, callback) {
        window.addEventListener(`mobile:${event}`, (e) => callback(e.detail));
    }

    /**
     * 获取触摸热区大小
     */
    getTouchTargetSize() {
        // 44px 是 iOS 人机界面指南推荐的最小触摸目标
        return Math.max(44, this.screenWidth * 0.1);
    }

    /**
     * 横屏检测
     */
    isLandscape() {
        return this.screenWidth > this.screenHeight;
    }

    /**
     * 折叠屏检测（华为 Mate X6 等）
     */
    isFoldable() {
        return window.screen.width >= 1700 || 
               (window.screen.width >= 1100 && window.devicePixelRatio >= 2.5);
    }
}

// 初始化
const mobileAdapter = new MobileAdapter();
