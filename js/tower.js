/**
 * 命运塔·首登者 - 塔楼渲染系统
 * V1.0 - 2026-03-05
 */

class TowerRenderer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.options = {
            layers: 13,
            baseWidth: 300,
            topWidth: 80,
            height: 600,
            colors: {
                base: ['#2c1810', '#3d2418', '#4a2c1d'],
                highlight: '#ffd700',
                player: '#4CAF50',
                guard: '#f44336',
                anger: '#ff5722',
                text: '#ffffff'
            },
            ...options
        };
        
        this.players = [];
        this.guards = [];
        this.currentLayer = 1;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        }
        this.draw();
    }

    /**
     * 设置游戏数据
     */
    setData(players, guards, currentLayer) {
        this.players = players;
        this.guards = guards;
        this.currentLayer = currentLayer;
        this.draw();
    }

    /**
     * 绘制塔楼
     */
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 计算塔楼参数
        const centerX = width / 2;
        const startY = height - 50;
        const layerHeight = (height - 100) / this.options.layers;
        
        // 绘制背景星空
        this.drawStarfield(ctx, width, height);
        
        // 绘制塔楼层
        for (let i = 1; i <= this.options.layers; i++) {
            this.drawLayer(ctx, i, centerX, startY, layerHeight);
        }
        
        // 绘制玩家位置
        this.drawPlayers(ctx, centerX, startY, layerHeight);
        
        // 绘制守卫位置
        this.drawGuards(ctx, centerX, startY, layerHeight);
        
        // 绘制激怒牌区域
        this.drawAngerCards(ctx, centerX, startY, layerHeight);
    }

    /**
     * 绘制单层
     */
    drawLayer(ctx, layer, centerX, startY, layerHeight) {
        const y = startY - (layer - 1) * layerHeight;
        const progress = (layer - 1) / (this.options.layers - 1);
        
        // 计算该层宽度（三角形金字塔）
        const layerWidth = this.options.baseWidth - 
            (this.options.baseWidth - this.options.topWidth) * progress;
        
        // 层颜色
        const isCurrent = layer === this.currentLayer;
        const isDefeated = this.guards[layer - 1]?.isDefeated;
        
        let colorIndex = layer % 3;
        if (isCurrent) colorIndex = 0;
        if (isDefeated) colorIndex = 2;
        
        // 绘制层主体
        ctx.fillStyle = this.options.colors.base[colorIndex];
        if (isCurrent) {
            ctx.fillStyle = this.addAlpha(this.options.colors.highlight, 0.3);
        }
        
        // 层矩形
        const layerY = y - layerHeight + 5;
        ctx.fillRect(centerX - layerWidth / 2, layerY, layerWidth, layerHeight - 10);
        
        // 层边框
        ctx.strokeStyle = isCurrent ? this.options.colors.highlight : '#5d4037';
        ctx.lineWidth = isCurrent ? 3 : 1;
        ctx.strokeRect(centerX - layerWidth / 2, layerY, layerWidth, layerHeight - 10);
        
        // 绘制层标记（扑克牌样式）
        this.drawLayerLabel(ctx, layer, centerX, layerY + layerHeight / 2 - 5);
    }

    /**
     * 绘制层标记
     */
    drawLayerLabel(ctx, layer, x, y) {
        const labels = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const label = labels[layer - 1];
        
        ctx.fillStyle = this.options.colors.text;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
        
        // 顶部A层特殊标记
        if (layer === 13) {
            ctx.font = '20px Arial';
            ctx.fillText('👑', x, y - 25);
        }
    }

    /**
     * 绘制玩家
     */
    drawPlayers(ctx, centerX, startY, layerHeight) {
        this.players.forEach((player, index) => {
            const layer = player.currentLayer;
            const y = startY - (layer - 1) * layerHeight;
            const progress = (layer - 1) / (this.options.layers - 1);
            const layerWidth = this.options.baseWidth - 
                (this.options.baseWidth - this.options.topWidth) * progress;
            
            // 玩家位置偏移
            const offsetX = (index - this.players.length / 2) * 30;
            const x = centerX + offsetX;
            
            // 绘制玩家头像
            this.drawPlayerAvatar(ctx, player, x, y - 20);
        });
    }

    /**
     * 绘制玩家头像
     */
    drawPlayerAvatar(ctx, player, x, y) {
        const radius = 18;
        
        // 背景圆
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = player.isFirstAscender ? this.options.colors.highlight : this.options.colors.player;
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 首登者标记
        if (player.isFirstAscender) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText('首', x, y + 4);
        } else {
            ctx.font = '10px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(player.id + 1, x, y + 3);
        }
        
        // 剩余手牌数
        const remaining = player.hand.filter(c => !c.played).length;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`${remaining}`, x, y + radius + 12);
    }

    /**
     * 绘制守卫
     */
    drawGuards(ctx, centerX, startY, layerHeight) {
        this.guards.forEach((guard, index) => {
            const layer = guard.layer;
            const y = startY - (layer - 1) * layerHeight;
            const progress = (layer - 1) / (this.options.layers - 1);
            const layerWidth = this.options.baseWidth - 
                (this.options.baseWidth - this.options.topWidth) * progress;
            
            // 守卫位置（层右侧）
            const x = centerX + layerWidth / 2 + 25;
            
            // 绘制守卫
            this.drawGuardAvatar(ctx, guard, x, y - layerHeight / 2);
        });
    }

    /**
     * 绘制守卫头像
     */
    drawGuardAvatar(ctx, guard, x, y) {
        const radius = 15;
        
        // 背景
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = guard.isDefeated ? '#666' : this.options.colors.guard;
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = guard.controller !== null ? this.options.colors.highlight : '#fff';
        ctx.lineWidth = guard.controller !== null ? 3 : 1;
        ctx.stroke();
        
        // 守卫标记
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('守', x, y + 4);
        
        // 剩余牌数
        ctx.font = '9px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(`${guard.cards.length}`, x, y + radius + 10);
    }

    /**
     * 绘制激怒牌
     */
    drawAngerCards(ctx, centerX, startY, layerHeight) {
        this.guards.forEach((guard, index) => {
            if (guard.angerCardsRevealed.length === 0) return;
            
            const layer = guard.layer;
            const y = startY - (layer - 1) * layerHeight;
            const progress = (layer - 1) / (this.options.layers - 1);
            const layerWidth = this.options.baseWidth - 
                (this.options.baseWidth - this.options.topWidth) * progress;
            
            // 激怒牌位置（层左侧）
            const startX = centerX - layerWidth / 2 - 60;
            
            guard.angerCardsRevealed.forEach((card, i) => {
                const x = startX + i * 22;
                this.drawMiniCard(ctx, card, x, y - layerHeight / 2, guard.angerCardsUsed.includes(card));
            });
        });
    }

    /**
     * 绘制小卡片（激怒牌）
     */
    drawMiniCard(ctx, card, x, y, isUsed) {
        const width = 20;
        const height = 28;
        
        // 背景
        ctx.fillStyle = isUsed ? '#444' : this.options.colors.anger;
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
        
        // 边框
        ctx.strokeStyle = isUsed ? '#222' : '#ff8a65';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - width / 2, y - height / 2, width, height);
        
        // 文字
        ctx.font = '8px Arial';
        ctx.fillStyle = isUsed ? '#666' : '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(card.suit, x, y - 2);
        ctx.fillText(card.rank, x, y + 8);
    }

    /**
     * 绘制星空背景
     */
    drawStarfield(ctx, width, height) {
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 星星
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 73) % width;
            const y = (i * 37) % height;
            const size = (i % 3) + 1;
            const alpha = 0.3 + (i % 5) / 10;
            
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    /**
     * 添加透明度
     */
    addAlpha(color, alpha) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * 高亮某层
     */
    highlightLayer(layer) {
        this.currentLayer = layer;
        this.draw();
    }

    /**
     * 动画效果：玩家爬升
     */
    animatePlayerClimb(playerId, fromLayer, toLayer, callback) {
        const steps = 10;
        let currentStep = 0;
        
        const animate = () => {
            currentStep++;
            const progress = currentStep / steps;
            const currentLayer = fromLayer + (toLayer - fromLayer) * progress;
            
            this.currentLayer = Math.floor(currentLayer);
            this.draw();
            
            if (currentStep < steps) {
                requestAnimationFrame(animate);
            } else {
                this.currentLayer = toLayer;
                this.draw();
                if (callback) callback();
            }
        };
        
        animate();
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TowerRenderer;
}
