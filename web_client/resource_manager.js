/**
 * Tower of Fate - 图片资源管理器
 * 管理游戏所有图片资源的加载和显示
 */

class ResourceManager {
    constructor() {
        this.resources = {};
        this.manifest = null;
        this.placeholderEnabled = true;
    }
    
    // 加载资源清单
    async loadManifest() {
        try {
            const response = await fetch('/assets/resources_manifest.json');
            this.manifest = await response.json();
            console.log('✅ 资源清单加载完成');
            return true;
        } catch (e) {
            console.warn('⚠️ 资源清单加载失败，使用默认配置');
            return false;
        }
    }
    
    // 生成CSS渐变背景（占位符）
    generatePlaceholderBackground(type = 'default') {
        const gradients = {
            'default': 'linear-gradient(135deg, #1a1a3e 0%, #0d1b2a 100%)',
            'login': 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 50%, #2d1b4e 100%)',
            'game': 'linear-gradient(135deg, #0d1b2a 0%, #1a1a3e 50%, #0d1b2a 100%)',
            'shop': 'linear-gradient(135deg, #2a1f1f 0%, #1a1a3e 100%)',
            'vip': 'linear-gradient(135deg, #3d2817 0%, #1a1a3e 100%)',
            'fire': 'linear-gradient(180deg, #ff6b6b 0%, #ffd93d 100%)',
            'ice': 'linear-gradient(180deg, #74b9ff 0%, #0984e3 100%)',
            'nature': 'linear-gradient(180deg, #00b894 0%, #00cec9 100%)'
        };
        
        return gradients[type] || gradients['default'];
    }
    
    // 生成头像占位符
    generateAvatarPlaceholder(name = '玩家', style = 'default') {
        const colors = {
            'warrior': '#e74c3c',
            'mage': '#9b59b6',
            'rogue': '#34495e',
            'priest': '#f1c40f',
            'default': '#3498db'
        };
        
        const color = colors[style] || colors['default'];
        const initial = name.charAt(0).toUpperCase();
        
        return `
            data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <rect width="100" height="100" rx="50" fill="${color}"/>
                    <text x="50" y="65" font-size="45" fill="white" text-anchor="middle" font-family="Arial">${initial}</text>
                </svg>
            `)}
        `;
    }
    
    // 应用背景到元素
    applyBackground(elementId, bgType = 'default') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // 检查是否有真实图片
        const realImage = this.getResourcePath(bgType);
        if (realImage && !this.placeholderEnabled) {
            element.style.backgroundImage = `url(${realImage})`;
            element.style.backgroundSize = 'cover';
        } else {
            // 使用占位符渐变
            element.style.background = this.generatePlaceholderBackground(bgType);
        }
    }
    
    // 应用头像
    applyAvatar(element, name, style) {
        if (!element) return;
        
        const placeholder = this.generateAvatarPlaceholder(name, style);
        element.src = placeholder;
        element.style.borderRadius = '50%';
        element.style.border = '3px solid rgba(255,215,0,0.5)';
    }
    
    // 获取资源路径
    getResourcePath(resourceId) {
        if (!this.manifest) return null;
        
        // 遍历所有类别查找资源
        for (const [category, data] of Object.entries(this.manifest.resource_categories)) {
            const item = data.items.find(i => i.id === resourceId);
            if (item) {
                return `${data.path}${resourceId}.png`;
            }
        }
        
        return null;
    }
    
    // 预加载图片
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // 批量预加载
    async preloadResources(resourceIds) {
        const promises = resourceIds.map(id => {
            const path = this.getResourcePath(id);
            if (path) {
                return this.preloadImage(path).catch(() => null);
            }
            return Promise.resolve(null);
        });
        
        return Promise.all(promises);
    }
    
    // 切换占位符模式
    setPlaceholderMode(enabled) {
        this.placeholderEnabled = enabled;
    }
    
    // 获取资源统计
    getResourceStats() {
        if (!this.manifest) return null;
        
        const stats = {
            total: 0,
            by_category: {},
            placeholders: 0,
            loaded: 0
        };
        
        for (const [category, data] of Object.entries(this.manifest.resource_categories)) {
            const count = data.items.length;
            stats.total += count;
            stats.by_category[category] = count;
            
            // 统计占位符和已加载
            data.items.forEach(item => {
                if (item.status === 'placeholder') {
                    stats.placeholders++;
                } else {
                    stats.loaded++;
                }
            });
        }
        
        return stats;
    }
}

// 导出
window.ResourceManager = ResourceManager;
window.resourceManager = new ResourceManager();

// 页面加载完成后初始化
window.addEventListener('load', async () => {
    await resourceManager.loadManifest();
    
    // 应用背景
    resourceManager.applyBackground('loginScreen', 'login');
    resourceManager.applyBackground('gameScreen', 'game');
    
    console.log('🎨 资源管理器初始化完成');
    console.log('📊 资源统计:', resourceManager.getResourceStats());
});
