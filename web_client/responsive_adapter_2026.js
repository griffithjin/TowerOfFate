/**
 * 命运塔·首登者 - 2026年标准响应式适配系统
 * 基于Bootstrap/Tailwind断点标准 + 移动优先策略
 */

class ResponsiveAdapter2026 {
    constructor() {
        // 2026年标准断点 (Bootstrap/Tailwind)
        this.breakpoints = {
            xs: 0,      // 超小屏 (手机)
            sm: 576,    // 小屏 (大手机)
            md: 768,    // 中屏 (平板)
            lg: 992,    // 大屏 (横屏平板/小笔记本)
            xl: 1200,   // 超大屏 (桌面)
            xxl: 1400   // 特大屏 (大桌面)
        };
        
        // 物理分辨率锚点 (2025-2026主流机型)
        this.physicalAnchors = {
            ios: {
                small: 375,      // iPhone SE/8
                standard: 390,   // iPhone 14/15/16 标准版
                large: 430,      // iPhone 14/15/16 Pro Max
                fold: 450        // 折叠态
            },
            android: {
                standard: 360,   // Samsung S系列, Pixel
                large: 412,      // Pixel XL, OnePlus
                foldOpen: 750    // Galaxy Z Fold 展开
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupViewport();
        this.addResponsiveCSS();
        this.addSafeAreaSupport();
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // 设置viewport (关键！)
    setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        // 关键配置：适配刘海屏和底部安全区
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // 添加响应式CSS (移动优先)
    addResponsiveCSS() {
        const css = `
            /* ==========================================
               2026年标准响应式适配系统
               基于Bootstrap/Tailwind断点
               ========================================== */
            
            /* CSS变量定义 */
            :root {
                /* 断点变量 */
                --bp-xs: 0px;
                --bp-sm: 576px;
                --bp-md: 768px;
                --bp-lg: 992px;
                --bp-xl: 1200px;
                --bp-xxl: 1400px;
                
                /* 安全区变量 */
                --safe-top: env(safe-area-inset-top, 0px);
                --safe-bottom: env(safe-area-inset-bottom, 0px);
                --safe-left: env(safe-area-inset-left, 0px);
                --safe-right: env(safe-area-inset-right, 0px);
                
                /* 卡片尺寸变量 (移动优先) */
                --card-width: 55px;
                --card-height: 75px;
                --card-suit-size: 22px;
                --card-rank-size: 14px;
                
                /* 间距变量 */
                --spacing-xs: 8px;
                --spacing-sm: 12px;
                --spacing-md: 16px;
                --spacing-lg: 24px;
                
                /* 字体变量 */
                --font-base: 14px;
                --font-small: 12px;
                --font-large: 16px;
            }
            
            /* ==========================================
               基础样式 (移动优先：超小屏 xs)
               针对：iPhone SE (375px), Galaxy S (竖屏)
               ========================================== */
            * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                font-size: var(--font-base);
                line-height: 1.5;
                /* 适配刘海屏和底部Home条 */
                padding-top: var(--safe-top);
                padding-bottom: var(--safe-bottom);
                padding-left: var(--safe-left);
                padding-right: var(--safe-right);
            }
            
            /* 容器 (移动优先) */
            .game-container {
                width: 100%;
                max-width: 100%;
                padding: var(--spacing-xs);
                margin: 0 auto;
            }
            
            /* 卡牌基础样式 (超小屏) */
            .game-card {
                width: var(--card-width);
                height: var(--card-height);
                border-radius: 6px;
            }
            
            .game-card .suit {
                font-size: var(--card-suit-size);
            }
            
            .game-card .rank {
                font-size: var(--card-rank-size);
            }
            
            /* 头部样式 (超小屏) */
            .game-header {
                padding: 8px 0;
                font-size: 12px;
            }
            
            .game-header .logo {
                font-size: 18px;
            }
            
            /* 田字布局 (超小屏：单列) */
            .main-grid {
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: auto;
                gap: var(--spacing-xs);
            }
            
            /* 塔层样式 (超小屏) */
            .tower-level {
                height: 14px;
                font-size: 9px;
            }
            
            /* 按钮样式 (超小屏 - 44px最小触控区) */
            .game-btn {
                min-height: 44px;
                min-width: 44px;
                padding: 10px 16px;
                font-size: 14px;
            }
            
            /* 进度条 (超小屏) */
            .progress-node {
                width: 24px;
                height: 24px;
                font-size: 10px;
            }
            
            /* ==========================================
               小屏 (sm: 576px+)
               针对：iPhone 14/15/16 Pro Max (430px)
               ========================================== */
            @media (min-width: 576px) {
                :root {
                    --card-width: 60px;
                    --card-height: 82px;
                    --card-suit-size: 24px;
                    --card-rank-size: 16px;
                    --font-base: 15px;
                }
                
                .game-container {
                    padding: var(--spacing-sm);
                }
                
                .game-header .logo {
                    font-size: 20px;
                }
                
                .tower-level {
                    height: 15px;
                    font-size: 10px;
                }
                
                .progress-node {
                    width: 28px;
                    height: 28px;
                    font-size: 11px;
                }
            }
            
            /* ==========================================
               中屏 (md: 768px+)
               针对：iPad Mini, Galaxy Tab (竖屏)
               iPad Mini基准设计
               ========================================== */
            @media (min-width: 768px) {
                :root {
                    --card-width: 70px;
                    --card-height: 95px;
                    --card-suit-size: 28px;
                    --card-rank-size: 18px;
                    --font-base: 16px;
                }
                
                .game-container {
                    max-width: 750px;
                    padding: var(--spacing-md);
                }
                
                /* 田字布局 (平板：双列) */
                .main-grid {
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: var(--spacing-md);
                }
                
                .game-header .logo {
                    font-size: 24px;
                }
                
                .tower-level {
                    height: 16px;
                    font-size: 11px;
                }
                
                .progress-node {
                    width: 32px;
                    height: 32px;
                    font-size: 12px;
                }
            }
            
            /* ==========================================
               大屏 (lg: 992px+)
               针对：iPad Pro (竖屏), Surface Go
               ========================================== */
            @media (min-width: 992px) {
                :root {
                    --card-width: 80px;
                    --card-height: 110px;
                    --card-suit-size: 32px;
                    --card-rank-size: 20px;
                }
                
                .game-container {
                    max-width: 970px;
                    padding: var(--spacing-lg);
                }
                
                .tower-level {
                    height: 18px;
                    font-size: 12px;
                }
            }
            
            /* ==========================================
               超大屏 (xl: 1200px+)
               针对：标准笔记本, 台式机
               ========================================== */
            @media (min-width: 1200px) {
                :root {
                    --card-width: 85px;
                    --card-height: 115px;
                }
                
                .game-container {
                    max-width: 1140px;
                }
            }
            
            /* ==========================================
               特大屏 (xxl: 1400px+)
               针对：2K/4K显示器, 大屏iMac
               ========================================== */
            @media (min-width: 1400px) {
                :root {
                    --card-width: 90px;
                    --card-height: 125px;
                    --card-suit-size: 36px;
                    --card-rank-size: 22px;
                }
                
                .game-container {
                    max-width: 1320px;
                }
            }
            
            /* ==========================================
               特殊适配
               ========================================== */
            
            /* 横屏模式优化 */
            @media (orientation: landscape) and (max-height: 500px) {
                .game-header {
                    padding: 5px 0;
                }
                
                .main-grid {
                    gap: 8px;
                }
                
                .tower-level {
                    height: 12px;
                    font-size: 8px;
                }
            }
            
            /* 折叠屏适配 */
            @media (min-width: 700px) and (max-width: 800px) {
                .main-grid {
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
            }
            
            /* 暗黑模式支持 */
            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #0a0a1a;
                    color: #ffffff;
                }
            }
            
            /* 减少动画 (用户偏好) */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
            
            /* iOS底部Home条适配 */
            @supports (padding-bottom: env(safe-area-inset-bottom)) {
                .game-footer {
                    padding-bottom: calc(20px + env(safe-area-inset-bottom));
                }
            }
            
            /* 触摸设备优化 */
            @media (pointer: coarse) {
                .game-card, .game-btn {
                    cursor: pointer;
                }
                
                /* 增大触摸热区 */
                .touch-target {
                    position: relative;
                }
                
                .touch-target::after {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // 添加安全区支持 (iPhone刘海屏/底部Home条)
    addSafeAreaSupport() {
        // 添加CSS变量polyfill
        const safeAreaCSS = `
            /* iOS安全区适配 */
            .safe-area-top {
                padding-top: max(20px, env(safe-area-inset-top));
            }
            
            .safe-area-bottom {
                padding-bottom: max(20px, env(safe-area-inset-bottom));
            }
            
            /* 避开刘海屏 */
            .notch-safe {
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = safeAreaCSS;
        document.head.appendChild(style);
    }
    
    // 处理窗口变化
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const deviceType = this.getDeviceType(width);
        
        document.body.setAttribute('data-device', deviceType);
        
        // 根据设备类型添加特定类
        this.applyDeviceClasses(deviceType, width, height);
        
        console.log(`[ResponsiveAdapter2026] Device: ${deviceType}, Size: ${width}x${height}`);
    }
    
    // 获取设备类型
    getDeviceType(width) {
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        if (width < 1400) return 'xl';
        return 'xxl';
    }
    
    // 应用设备特定类
    applyDeviceClasses(type, width, height) {
        const classes = ['device-xs', 'device-sm', 'device-md', 'device-lg', 'device-xl', 'device-xxl'];
        classes.forEach(c => document.body.classList.remove(c));
        document.body.classList.add(`device-${type}`);
        
        // 特定机型检测
        if (width === 375) document.body.classList.add('iphone-se');
        if (width === 390 || width === 402) document.body.classList.add('iphone-standard');
        if (width === 430) document.body.classList.add('iphone-pro-max');
        if (width === 768) document.body.classList.add('ipad-mini');
        
        // 横屏检测
        if (width > height) {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        } else {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        }
    }
    
    // 获取物理分辨率锚点
    getPhysicalAnchor() {
        const width = window.innerWidth;
        const ua = navigator.userAgent;
        
        // iOS检测
        if (/iPhone|iPad|iPod/.test(ua)) {
            if (width <= 375) return 'ios-small';
            if (width <= 402) return 'ios-standard';
            return 'ios-large';
        }
        
        // Android检测
        if (/Android/.test(ua)) {
            if (width <= 390) return 'android-standard';
            return 'android-large';
        }
        
        return 'unknown';
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveAdapter2026 = new ResponsiveAdapter2026();
});

// 导出
window.ResponsiveAdapter2026 = ResponsiveAdapter2026;
