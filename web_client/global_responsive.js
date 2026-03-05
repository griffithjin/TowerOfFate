/**
 * 命运塔·首登者 - 全局响应式适配配置
 * 所有页面共享的响应式设置
 */

// 全局响应式配置
const GLOBAL_RESPONSIVE_CONFIG = {
    // 断点
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    },
    
    // 触控最小尺寸 (44px苹果标准)
    touch: {
        minSize: 44,
        minHeight: 44,
        minWidth: 44
    },
    
    // 字体缩放比例
    fontScale: {
        xs: 0.875,  // 14px基准
        sm: 0.9375, // 15px
        md: 1,      // 16px基准 (iPad Mini)
        lg: 1.0625, // 17px
        xl: 1.125,  // 18px
        xxl: 1.25   // 20px
    },
    
    // 间距缩放
    spacingScale: {
        xs: 0.75,
        sm: 0.875,
        md: 1,
        lg: 1.125,
        xl: 1.25,
        xxl: 1.5
    }
};

// 获取当前断点
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1400) return 'xxl';
    if (width >= 1200) return 'xl';
    if (width >= 992) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 576) return 'sm';
    return 'xs';
}

// 应用响应式缩放
function applyResponsiveScale() {
    const bp = getCurrentBreakpoint();
    const fontScale = GLOBAL_RESPONSIVE_CONFIG.fontScale[bp];
    const spacingScale = GLOBAL_RESPONSIVE_CONFIG.spacingScale[bp];
    
    document.documentElement.style.setProperty('--font-scale', fontScale);
    document.documentElement.style.setProperty('--spacing-scale', spacingScale);
    document.documentElement.style.setProperty('--current-bp', bp);
}

// 初始化全局响应式
function initGlobalResponsive() {
    applyResponsiveScale();
    window.addEventListener('resize', applyResponsiveScale);
    
    // 添加触控检测
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGlobalResponsive);

// 导出
window.GlobalResponsive = {
    config: GLOBAL_RESPONSIVE_CONFIG,
    getBreakpoint: getCurrentBreakpoint,
    applyScale: applyResponsiveScale
};
