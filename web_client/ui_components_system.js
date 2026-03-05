/**
 * 命运塔·首登者 - UI组件响应式系统
 * 所有界面元素使用CSS变量，适配所有机型
 */

// UI组件尺寸配置 (基于1rem = 16px)
const UI_COMPONENTS = {
    // 天命牌
    destinyCard: {
        width: { base: 5, unit: 'rem' },      // 80px
        height: { base: 6.25, unit: 'rem' },  // 100px
        iconSize: { base: 1.5, unit: 'rem' }, // 24px
        fontSize: { base: 0.75, unit: 'rem' },// 12px
        gap: { base: 0.5, unit: 'rem' }       // 8px
    },
    
    // 用户手牌
    handCard: {
        width: { base: 4.375, unit: 'rem' },   // 70px
        height: { base: 5.9375, unit: 'rem' }, // 95px
        suitSize: { base: 1.75, unit: 'rem' }, // 28px
        rankSize: { base: 1.125, unit: 'rem' },// 18px
        gap: { base: 0.5, unit: 'rem' }        // 8px
    },
    
    // 守卫牌
    guardCard: {
        width: { base: 4.375, unit: 'rem' },   // 70px
        height: { base: 5.9375, unit: 'rem' }, // 95px
        shieldSize: { base: 2.5, unit: 'rem' }// 40px
    },
    
    // 塔
    tower: {
        containerWidth: { base: 70, unit: '%' },
        levelHeight: { base: 1, unit: 'rem' }, // 16px
        levelGap: { base: 0.125, unit: 'rem' },// 2px
        fontSize: { base: 0.625, unit: 'rem' } // 10px
    },
    
    // 对手嘲讽浮窗
    tauntBubble: {
        maxWidth: { base: 11.25, unit: 'rem' }, // 180px
        padding: { base: 0.625, unit: 'rem' },  // 10px
        fontSize: { base: 0.75, unit: 'rem' },  // 12px
        borderRadius: { base: 0.75, unit: 'rem' }// 12px
    },
    
    // 倒计时浮窗
    countdown: {
        width: { base: 5, unit: 'rem' },      // 80px
        height: { base: 2.5, unit: 'rem' },   // 40px
        fontSize: { base: 1.25, unit: 'rem' },// 20px
        padding: { base: 0.5, unit: 'rem' }   // 8px
    },
    
    // 音乐开关浮窗
    musicControl: {
        width: { base: 12.5, unit: 'rem' },   // 200px
        height: { base: 2.75, unit: 'rem' },  // 44px
        iconSize: { base: 1.5, unit: 'rem' }, // 24px
        fontSize: { base: 0.75, unit: 'rem' } // 12px
    },
    
    // 金币钻石栏
    currencyBar: {
        height: { base: 2.5, unit: 'rem' },   // 40px
        padding: { base: 0.5, unit: 'rem' },  // 8px 12px
        iconSize: { base: 1.125, unit: 'rem' },// 18px
        fontSize: { base: 0.875, unit: 'rem' },// 14px
        gap: { base: 0.75, unit: 'rem' }      // 12px
    },
    
    // 按钮
    button: {
        height: { base: 2.75, unit: 'rem' },   // 44px (触控标准)
        paddingX: { base: 1.5, unit: 'rem' },  // 24px
        paddingY: { base: 0.75, unit: 'rem' }, // 12px
        fontSize: { base: 0.875, unit: 'rem' },// 14px
        borderRadius: { base: 0.5, unit: 'rem' }// 8px
    },
    
    // 头部
    header: {
        height: { base: 3.5, unit: 'rem' },    // 56px
        logoSize: { base: 1.5, unit: 'rem' },  // 24px
        padding: { base: 0.75, unit: 'rem' }   // 12px
    },
    
    // 间距系统
    spacing: {
        xs: { base: 0.25, unit: 'rem' },  // 4px
        sm: { base: 0.5, unit: 'rem' },   // 8px
        md: { base: 1, unit: 'rem' },     // 16px
        lg: { base: 1.5, unit: 'rem' },   // 24px
        xl: { base: 2, unit: 'rem' }      // 32px
    }
};

// 设备缩放配置
const DEVICE_SCALES = {
    // iOS
    'ios-small': 0.85,      // 375px iPhone SE
    'ios-standard': 0.92,   // 390-402px iPhone 14/15/16
    'ios-large': 1.0,       // 430px Pro Max
    'ios-fold': 0.95,       // 420-480px Fold
    
    // Android
    'android-standard': 0.88, // 360-390px
    'android-large': 0.95,    // 412px
    'android-fold': 1.2,      // 700-800px+
    
    // 桌面
    'desktop': 1.0,
    'desktop-lg': 1.1
};

// 生成CSS变量
function generateUICSS() {
    const root = document.documentElement;
    const deviceType = detectDeviceType();
    const scale = DEVICE_SCALES[deviceType] || 1.0;
    
    // 设置缩放因子
    root.style.setProperty('--ui-scale', scale);
    root.style.setProperty('--device-type', deviceType);
    
    // 生成所有UI组件变量
    for (const [component, props] of Object.entries(UI_COMPONENTS)) {
        for (const [prop, config] of Object.entries(props)) {
            const value = config.base * scale;
            const varName = `--${component}-${prop}`;
            root.style.setProperty(varName, `${value}${config.unit}`);
        }
    }
}

// 检测设备类型
function detectDeviceType() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    
    // 折叠屏检测
    if (width >= 700 && width <= 850) {
        return isIOS ? 'ios-fold' : 'android-fold';
    }
    
    if (isIOS) {
        if (width <= 380) return 'ios-small';
        if (width <= 415) return 'ios-standard';
        return 'ios-large';
    }
    
    if (isAndroid) {
        if (width <= 400) return 'android-standard';
        if (width <= 440) return 'android-large';
        return 'android-large';
    }
    
    return width >= 1400 ? 'desktop-lg' : 'desktop';
}

// 导出
window.UIComponents = {
    config: UI_COMPONENTS,
    scales: DEVICE_SCALES,
    generateCSS: generateUICSS,
    detectDevice: detectDeviceType
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    generateUICSS();
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(generateUICSS, 250);
    });
});
