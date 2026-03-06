/**
 * 命运塔 - 游戏动画效果系统
 * 增强游戏视觉体验
 */

// 出牌动画
function animateCardPlay(cardElement, fromRect, toRect) {
    const clone = cardElement.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = fromRect.left + 'px';
    clone.style.top = fromRect.top + 'px';
    clone.style.width = fromRect.width + 'px';
    clone.style.height = fromRect.height + 'px';
    clone.style.zIndex = '1000';
    clone.style.transition = 'all 0.5s ease-out';
    document.body.appendChild(clone);
    
    // 触发动画
    requestAnimationFrame(() => {
        clone.style.left = toRect.left + 'px';
        clone.style.top = toRect.top + 'px';
        clone.style.transform = 'scale(0.8)';
        clone.style.opacity = '0';
    });
    
    // 清理
    setTimeout(() => {
        clone.remove();
    }, 500);
}

// 激怒牌触发特效
function animateProvokeTrigger(level, fallBack) {
    const battlefield = document.querySelector('.battlefield');
    
    // 创建警告遮罩
    const warning = document.createElement('div');
    warning.className = 'provoke-warning';
    warning.innerHTML = `
        <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">激怒牌触发！</div>
            <div class="warning-sub">退回 ${fallBack} 层</div>
        </div>
    `;
    warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: provokePulse 0.5s ease-in-out 3;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes provokePulse {
            0%, 100% { background: rgba(255, 0, 0, 0.3); }
            50% { background: rgba(255, 0, 0, 0.6); }
        }
        .warning-content {
            background: linear-gradient(135deg, #ff4757, #c0392b);
            padding: 30px 50px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(255, 0, 0, 0.5);
            animation: warningShake 0.5s ease-in-out;
        }
        @keyframes warningShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .warning-icon { font-size: 60px; margin-bottom: 10px; }
        .warning-text { font-size: 28px; font-weight: bold; color: #fff; }
        .warning-sub { font-size: 20px; color: #ffcccc; margin-top: 10px; }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.remove();
        style.remove();
    }, 1500);
}

// 层数晋升庆祝效果
function animateLevelUp(oldLevel, newLevel) {
    const battlefield = document.querySelector('.battlefield');
    
    // 创建庆祝粒子
    for (let i = 0; i < 20; i++) {
        createConfetti(battlefield);
    }
    
    // 显示晋升提示
    const levelUpMsg = document.createElement('div');
    levelUpMsg.className = 'level-up-message';
    levelUpMsg.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">🎉</div>
            <div class="level-up-text">晋升！</div>
            <div class="level-up-from-to">${oldLevel} → ${newLevel}</div>
        </div>
    `;
    levelUpMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        animation: levelUpPop 1s ease-out forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes levelUpPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        .level-up-content {
            background: linear-gradient(135deg, #ffd700, #ff6b35);
            padding: 30px 50px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5);
        }
        .level-up-icon { font-size: 60px; margin-bottom: 10px; }
        .level-up-text { font-size: 32px; font-weight: bold; color: #000; }
        .level-up-from-to { font-size: 24px; color: #333; margin-top: 10px; }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(levelUpMsg);
    
    setTimeout(() => {
        levelUpMsg.remove();
        style.remove();
    }, 1500);
}

// 创建彩纸效果
function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#ffd700', '#ff6b35', '#4ecdc4', '#a8e6cf'][Math.floor(Math.random() * 4)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
        style.remove();
    }, 4000);
}

// 守卫被击败动画
function animateGuardDefeated(level) {
    const levelCell = document.querySelector(`.level-cell[data-level="${level}"]`);
    if (!levelCell) return;
    
    levelCell.style.animation = 'guardDefeated 1s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes guardDefeated {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5) sepia(1) hue-rotate(-50deg) saturate(2); }
            100% { transform: scale(1); filter: brightness(0.7) grayscale(0.5); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        levelCell.style.animation = '';
        style.remove();
    }, 1000);
}

// 导出
window.animateCardPlay = animateCardPlay;
window.animateProvokeTrigger = animateProvokeTrigger;
window.animateLevelUp = animateLevelUp;
window.animateGuardDefeated = animateGuardDefeated;
