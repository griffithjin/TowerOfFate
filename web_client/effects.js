/**
 * Tower of Fate - 愤怒的小鸟风格特效系统
 * 粒子效果、物理碰撞、弹射轨迹
 */

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.gravity = 0.5;
        this.friction = 0.99;
    }
    
    // 创建爆炸粒子效果
    createExplosion(x, y, color, count = 30) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 5 + Math.random() * 10;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                color: color,
                size: 3 + Math.random() * 5,
                type: 'explosion'
            });
        }
    }
    
    // 创建飞羽效果（像愤怒的小鸟碰撞后）
    createFeathers(x, y, count = 10) {
        const colors = ['#ffffff', '#f0f0f0', '#e0e0e0'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.02,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 6,
                type: 'feather'
            });
        }
    }
    
    // 创建卡片飞行轨迹
    createCardTrail(startX, startY, endX, endY, cardSuit) {
        const steps = 20;
        const dx = (endX - startX) / steps;
        const dy = (endY - startY) / steps;
        
        // 抛物线轨迹
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = startX + dx * i;
            const y = startY + dy * i - Math.sin(t * Math.PI) * 50; // 抛物线高度
            
            setTimeout(() => {
                this.particles.push({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    life: 0.5,
                    decay: 0.05,
                    color: this.getSuitColor(cardSuit),
                    size: 4,
                    type: 'trail'
                });
            }, i * 20);
        }
    }
    
    // 创建晋级光环效果
    createLevelUpEffect(x, y) {
        // 外圈光环
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.particles.push({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    life: 1.0,
                    decay: 0.02,
                    color: '#ffd700',
                    size: 50 + i * 30,
                    type: 'ring',
                    ringWidth: 5
                });
            }, i * 200);
        }
        
        // 星星粒子
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3 - 2,
                life: 1.0,
                decay: 0.015,
                color: '#ffed4e',
                size: 6,
                type: 'star'
            });
        }
    }
    
    // 创建完美匹配特效
    createPerfectMatchEffect(x, y) {
        // 金色爆发
        this.createExplosion(x, y, '#ffd700', 50);
        
        // 文字浮动
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -2,
            life: 2.0,
            decay: 0.01,
            color: '#ffd700',
            size: 30,
            type: 'text',
            text: '完美!'
        });
        
        // 闪电效果
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
                vx: 0,
                vy: 0,
                life: 0.3,
                decay: 0.1,
                color: '#fff',
                size: 100,
                type: 'lightning'
            });
        }
    }
    
    // 创建失败震动效果
    createFailShake(x, y) {
        this.createExplosion(x, y, '#666', 20);
        
        // 碎片效果
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 0.8,
                decay: 0.03,
                color: '#999',
                size: 4 + Math.random() * 6,
                type: 'debris'
            });
        }
    }
    
    // 获取花色颜色
    getSuitColor(suit) {
        const colors = {
            '♥': '#ff4444',
            '♦': '#ff8800',
            '♣': '#4444ff',
            '♠': '#444444'
        };
        return colors[suit] || '#ffffff';
    }
    
    // 更新所有粒子
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 物理更新
            p.x += p.vx;
            p.y += p.vy;
            
            // 重力影响
            if (p.type !== 'ring' && p.type !== 'trail') {
                p.vy += this.gravity;
            }
            
            // 摩擦力
            p.vx *= this.friction;
            p.vy *= this.friction;
            
            // 旋转
            if (p.rotationSpeed) {
                p.rotation += p.rotationSpeed;
            }
            
            // 生命值衰减
            p.life -= p.decay;
            
            // 移除死亡粒子
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    // 绘制所有粒子
    draw() {
        this.ctx.save();
        
        for (const p of this.particles) {
            this.ctx.globalAlpha = p.life;
            
            switch (p.type) {
                case 'feather':
                    this.drawFeather(p);
                    break;
                case 'star':
                    this.drawStar(p);
                    break;
                case 'ring':
                    this.drawRing(p);
                    break;
                case 'text':
                    this.drawText(p);
                    break;
                case 'lightning':
                    this.drawLightning(p);
                    break;
                default:
                    this.drawCircle(p);
            }
        }
        
        this.ctx.restore();
    }
    
    // 绘制羽毛
    drawFeather(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size / 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 羽毛纹理
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-p.size + 5, 0);
        this.ctx.lineTo(p.size - 5, 0);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // 绘制星星
    drawStar(p) {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = p.x + Math.cos(angle) * p.size;
            const y = p.y + Math.sin(angle) * p.size;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
            
            const innerAngle = (Math.PI * 2 * (i + 0.5)) / 5 - Math.PI / 2;
            const innerX = p.x + Math.cos(innerAngle) * (p.size / 2);
            const innerY = p.y + Math.sin(innerAngle) * (p.size / 2);
            this.ctx.lineTo(innerX, innerY);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    // 绘制光环
    drawRing(p) {
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = p.ringWidth;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    // 绘制文字
    drawText(p) {
        this.ctx.fillStyle = p.color;
        this.ctx.font = `bold ${p.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(p.text, p.x, p.y);
    }
    
    // 绘制闪电
    drawLightning(p) {
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#fff';
        
        this.ctx.beginPath();
        let lx = p.x;
        let ly = p.y;
        this.ctx.moveTo(lx, ly);
        
        for (let i = 0; i < 5; i++) {
            lx += (Math.random() - 0.5) * 50;
            ly += (Math.random() - 0.5) * 50;
            this.ctx.lineTo(lx, ly);
        }
        
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
    
    // 绘制圆形粒子
    drawCircle(p) {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // 主动画循环
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 物理引擎 - 愤怒的小鸟风格弹射
class PhysicsEngine {
    constructor() {
        this.objects = [];
        this.gravity = 0.5;
        this.bounce = 0.7;
    }
    
    // 创建弹射物体
    createProjectile(x, y, vx, vy) {
        return {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            radius: 20,
            rotation: 0,
            angularVelocity: 0
        };
    }
    
    // 更新物理
    update(obj) {
        // 重力
        obj.vy += this.gravity;
        
        // 位置更新
        obj.x += obj.vx;
        obj.y += obj.vy;
        
        // 旋转
        obj.rotation += obj.angularVelocity;
        obj.angularVelocity *= 0.98;
        
        // 地面碰撞
        if (obj.y + obj.radius > canvas.height) {
            obj.y = canvas.height - obj.radius;
            obj.vy *= -this.bounce;
            obj.vx *= 0.9; // 摩擦力
        }
        
        // 墙壁碰撞
        if (obj.x - obj.radius < 0 || obj.x + obj.radius > canvas.width) {
            obj.vx *= -this.bounce;
            obj.x = obj.x < canvas.width / 2 ? obj.radius : canvas.width - obj.radius;
        }
        
        return obj;
    }
    
    // 计算弹射轨迹
    calculateTrajectory(startX, startY, targetX, targetY, power) {
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算初速度
        const vx = (dx / distance) * power;
        const vy = (dy / distance) * power - 5; // 稍微向上抛
        
        // 模拟轨迹点
        const trajectory = [];
        let x = startX;
        let y = startY;
        let vx_sim = vx;
        let vy_sim = vy;
        
        for (let i = 0; i < 30; i++) {
            x += vx_sim;
            y += vy_sim;
            vy_sim += this.gravity;
            trajectory.push({x, y});
        }
        
        return {vx, vy, trajectory};
    }
}

// 震动效果
class ScreenShake {
    constructor() {
        this.intensity = 0;
        this.duration = 0;
    }
    
    shake(intensity, duration) {
        this.intensity = intensity;
        this.duration = duration;
    }
    
    update() {
        if (this.duration > 0) {
            const dx = (Math.random() - 0.5) * this.intensity;
            const dy = (Math.random() - 0.5) * this.intensity;
            document.body.style.transform = `translate(${dx}px, ${dy}px)`;
            this.duration--;
            this.intensity *= 0.9;
        } else {
            document.body.style.transform = '';
        }
    }
}

// 导出
window.ParticleSystem = ParticleSystem;
window.PhysicsEngine = PhysicsEngine;
window.ScreenShake = ScreenShake;
console.log('✅ 愤怒的小鸟风格特效系统已加载');
