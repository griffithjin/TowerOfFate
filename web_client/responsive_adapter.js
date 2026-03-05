/**
 * 命运塔·首登者 - 响应式适配系统
 * 以iPad Mini (768px) 为基准，向下兼容手机，向上适配桌面
 */

class ResponsiveAdapter {
    constructor() {
        this.breakpoints = {
            mobile: 480,
            tablet: 768,    // iPad Mini基准
            desktop: 1024,
            large: 1440
        };
        this.init();
    }
    
    init() {
        this.setupViewport();
        this.addResponsiveStyles();
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupViewport() {
        // 确保viewport正确设置
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
    
    addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 基础响应式样式 */
            :root {
                --card-size: 80px;
                --card-height: 110px;
                --font-base: 14px;
                --spacing: 15px;
            }
            
            /* 超小屏手机 (iPhone SE等) */
            @media (max-width: 375px) {
                :root {
                    --card-size: 55px;
                    --card-height: 80px;
                    --font-base: 12px;
                    --spacing: 8px;
                }
                .container { padding: 10px !important; }
                .header { padding: 10px 0 !important; }
                .header h1, .logo { font-size: 18px !important; }
                .game-info { gap: 8px !important; }
                .info-item { padding: 5px 10px !important; font-size: 12px !important; }
            }
            
            /* 小屏手机 */
            @media (min-width: 376px) and (max-width: 480px) {
                :root {
                    --card-size: 60px;
                    --card-height: 85px;
                    --font-base: 13px;
                    --spacing: 10px;
                }
                .container { padding: 12px !important; }
                .logo { font-size: 20px !important; }
            }
            
            /* 中屏手机/大手机 */
            @media (min-width: 481px) and (max-width: 767px) {
                :root {
                    --card-size: 70px;
                    --card-height: 95px;
                    --font-base: 14px;
                    --spacing: 12px;
                }
            }
            
            /* iPad Mini基准 (768px) - 黄金标准 */
            @media (min-width: 768px) and (max-width: 1023px) {
                :root {
                    --card-size: 85px;
                    --card-height: 115px;
                    --font-base: 15px;
                    --spacing: 18px;
                }
                .container { max-width: 750px !important; }
            }
            
            /* 桌面端最小化适配 */
            @media (min-width: 1024px) {
                :root {
                    --card-size: 90px;
                    --card-height: 125px;
                    --font-base: 16px;
                    --spacing: 20px;
                }
                .container { 
                    max-width: 900px !important; 
                    margin: 0 auto;
                }
            }
            
            /* 大屏桌面 */
            @media (min-width: 1440px) {
                :root {
                    --card-size: 100px;
                    --card-height: 135px;
                }
                .container { max-width: 1000px !important; }
            }
            
            /* 通用适配规则 */
            .hand-card, .shared-card, .destiny-card {
                width: var(--card-size) !important;
                height: var(--card-height) !important;
            }
            
            .card-suit { font-size: calc(var(--card-size) * 0.4) !important; }
            .card-rank { font-size: calc(var(--card-size) * 0.25) !important; }
            
            /* 游戏区域响应式 */
            .game-area {
                display: grid;
                gap: var(--spacing);
            }
            
            @media (max-width: 767px) {
                .game-area { grid-template-columns: 1fr !important; }
                .center-section { order: -1; }
            }
            
            @media (min-width: 768px) {
                .game-area { grid-template-columns: 1fr 200px 1fr !important; }
            }
            
            /* 按钮响应式 */
            .btn-confirm, .btn-primary, .btn-success {
                padding: 12px 30px !important;
                font-size: max(14px, calc(var(--font-base) * 1.1)) !important;
            }
            
            @media (max-width: 480px) {
                .btn-confirm, .btn-primary, .btn-success {
                    padding: 10px 20px !important;
                    font-size: 14px !important;
                }
            }
            
            /* 手牌区域滚动 */
            .hand-cards, .shared-cards, .destiny-cards {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                max-height: 40vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                padding: 5px;
            }
            
            /* 减少小屏上的元素 */
            @media (max-width: 480px) {
                .panel-title { font-size: 16px !important; }
                .stat-value { font-size: 24px !important; }
                .vs-text { font-size: 32px !important; }
            }
            
            /* 触摸优化 */
            @media (pointer: coarse) {
                .hand-card, .shared-card, .destiny-card, button {
                    min-height: 44px;
                    min-width: 44px;
                }
            }
            
            /* 防止横屏问题 */
            @media (max-height: 500px) and (orientation: landscape) {
                .header { padding: 5px 0 !important; }
                .game-area { gap: 8px !important; }
                .hand-cards { max-height: 25vh !important; }
            }
            
            /* 音乐控制响应式 */
            #musicControl {
                bottom: 10px !important;
                right: 10px !important;
                padding: 8px 12px !important;
            }
            
            @media (max-width: 480px) {
                #musicControl {
                    transform: scale(0.85);
                    transform-origin: bottom right;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const deviceType = this.getDeviceType(width);
        
        document.body.setAttribute('data-device', deviceType);
        
        // 根据设备类型调整特定元素
        this.adjustForDevice(deviceType, width, height);
    }
    
    getDeviceType(width) {
        if (width < 376) return 'mobile-xs';
        if (width < 481) return 'mobile';
        if (width < 768) return 'mobile-lg';
        if (width < 1024) return 'tablet';  // iPad Mini等
        if (width < 1440) return 'desktop';
        return 'desktop-lg';
    }
    
    adjustForDevice(type, width, height) {
        // 特别处理iPad Mini
        if (width === 768 || (width >= 768 && width < 1024)) {
            document.body.classList.add('ipad-mini');
        } else {
            document.body.classList.remove('ipad-mini');
        }
        
        // 小屏设备简化动画
        if (type.includes('mobile')) {
            document.body.classList.add('reduce-animation');
        } else {
            document.body.classList.remove('reduce-animation');
        }
    }
}

// 初始化响应式适配
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveAdapter = new ResponsiveAdapter();
});

// 导出
window.ResponsiveAdapter = ResponsiveAdapter;
