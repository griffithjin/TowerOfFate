/**
 * 命运塔·首登者 - 设备精确适配框架
 * 针对特定iOS/Android机型的精确适配
 */

class DeviceAdaptiveFramework {
    constructor() {
        // 精确设备定义
        this.devices = {
            // iOS阵营
            ios: {
                small: {      // iPhone SE/8
                    width: 375,
                    height: 667,
                    scale: 0.85,
                    name: 'iPhone SE/8'
                },
                standard: {   // iPhone 14/15/16 标准版
                    width: 390, // 390-402px范围
                    height: 844,
                    scale: 0.9,
                    name: 'iPhone 14/15/16'
                },
                large: {      // iPhone Pro Max
                    width: 430,
                    height: 932,
                    scale: 1.0,
                    name: 'iPhone Pro Max'
                },
                fold: {       // 折叠态
                    width: 450, // 420-480px
                    height: 900,
                    scale: 0.95,
                    name: 'iPhone Fold'
                }
            },
            // Android阵营
            android: {
                standard: {   // Samsung S, Pixel
                    width: 375, // 360-390px
                    height: 812,
                    scale: 0.88,
                    name: 'Android Standard'
                },
                large: {      // Pixel XL, OnePlus
                    width: 412,
                    height: 915,
                    scale: 0.95,
                    name: 'Android Large'
                },
                foldOpen: {   // Galaxy Z Fold展开
                    width: 750, // 700-800px+
                    height: 1200,
                    scale: 1.2,
                    name: 'Galaxy Z Fold'
                }
            }
        };
        
        this.currentDevice = this.detectDevice();
        this.init();
    }
    
    // 检测设备
    detectDevice() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ua = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/.test(ua);
        const isAndroid = /Android/.test(ua);
        
        // 检测折叠屏展开
        if (width >= 700 && width <= 850) {
            return { type: 'fold', platform: 'android', ...this.devices.android.foldOpen };
        }
        
        if (isIOS) {
            if (width <= 380) return { type: 'small', platform: 'ios', ...this.devices.ios.small };
            if (width <= 410) return { type: 'standard', platform: 'ios', ...this.devices.ios.standard };
            if (width <= 450) return { type: 'large', platform: 'ios', ...this.devices.ios.large };
            if (width <= 500) return { type: 'fold', platform: 'ios', ...this.devices.ios.fold };
        }
        
        if (isAndroid) {
            if (width <= 400) return { type: 'standard', platform: 'android', ...this.devices.android.standard };
            if (width <= 440) return { type: 'large', platform: 'android', ...this.devices.android.large };
        }
        
        // 默认
        return { type: 'standard', platform: 'unknown', scale: 1.0, name: 'Desktop' };
    }
    
    init() {
        this.applyAdaptiveCSS();
        this.addDeviceClasses();
        console.log(`[DeviceAdaptive] Detected: ${this.currentDevice.name} (${this.currentDevice.platform})`);
    }
    
    // 应用自适应CSS变量
    applyAdaptiveCSS() {
        const scale = this.currentDevice.scale;
        const root = document.documentElement;
        
        // 基础单位
        const baseUnit = 16 * scale; // 基准字体大小
        
        // 设置CSS变量 - 使用rem代替固定像素
        root.style.setProperty('--du-base', `${baseUnit}px`);           // 基础单位
        root.style.setProperty('--du-xs', `${baseUnit * 0.5}px`);       // 超小
        root.style.setProperty('--du-sm', `${baseUnit * 0.75}px`);      // 小
        root.style.setProperty('--du-md', `${baseUnit}px`);             // 中
        root.style.setProperty('--du-lg', `${baseUnit * 1.25}px`);      // 大
        root.style.setProperty('--du-xl', `${baseUnit * 1.5}px`);       // 超大
        root.style.setProperty('--du-xxl', `${baseUnit * 2}px`);        // 特大
        
        // 组件尺寸 - 使用rem
        root.style.setProperty('--card-width', `${scale * 4.375}rem`);  // 70px基准
        root.style.setProperty('--card-height', `${scale * 5.9375}rem`); // 95px基准
        root.style.setProperty('--card-suit', `${scale * 1.75}rem`);    // 28px
        root.style.setProperty('--card-rank', `${scale * 1.125}rem`);   // 18px
        
        root.style.setProperty('--btn-height', `${scale * 2.75}rem`);   // 44px
        root.style.setProperty('--btn-padding-x', `${scale * 1.5}rem`); // 24px
        root.style.setProperty('--btn-padding-y', `${scale * 0.75}rem`); // 12px
        
        root.style.setProperty('--spacing-xs', `${scale * 0.5}rem`);    // 8px
        root.style.setProperty('--spacing-sm', `${scale * 0.75}rem`);   // 12px
        root.style.setProperty('--spacing-md', `${scale * 1rem`);       // 16px
        root.style.setProperty('--spacing-lg', `${scale * 1.5}rem`);    // 24px
        root.style.setProperty('--spacing-xl', `${scale * 2rem`);       // 32px
        
        // 字体大小
        root.style.setProperty('--font-xs', `${scale * 0.75}rem`);      // 12px
        root.style.setProperty('--font-sm', `${scale * 0.875}rem`);     // 14px
        root.style.setProperty('--font-md', `${scale * 1rem`);          // 16px
        root.style.setProperty('--font-lg', `${scale * 1.125}rem`);     // 18px
        root.style.setProperty('--font-xl', `${scale * 1.25}rem`);      // 20px
        root.style.setProperty('--font-xxl', `${scale * 1.5}rem`);      // 24px
        
        // 当前缩放因子
        root.style.setProperty('--device-scale', scale);
        root.style.setProperty('--device-type', this.currentDevice.type);
        root.style.setProperty('--device-platform', this.currentDevice.platform);
    }
    
    // 添加设备类名到body
    addDeviceClasses() {
        const body = document.body;
        const { type, platform } = this.currentDevice;
        
        body.classList.add(`device-${type}`);
        body.classList.add(`platform-${platform}`);
        
        // 方向
        if (window.innerWidth > window.innerHeight) {
            body.classList.add('landscape');
        } else {
            body.classList.add('portrait');
        }
    }
    
    // 监听窗口变化
    watchResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.currentDevice = this.detectDevice();
                this.applyAdaptiveCSS();
                this.addDeviceClasses();
            }, 250);
        });
    }
    
    // 获取适配后的尺寸
    getSize(basePx) {
        return basePx * this.currentDevice.scale;
    }
    
    // 获取当前设备信息
    getCurrentDevice() {
        return this.currentDevice;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.deviceAdaptive = new DeviceAdaptiveFramework();
    window.deviceAdaptive.watchResize();
});

// 导出
window.DeviceAdaptiveFramework = DeviceAdaptiveFramework;
