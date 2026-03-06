// solo_game_fix.js - 修复守卫牌明牌问题
// 在solo_game.html中引入此脚本覆盖原有函数

// 覆盖confirmPlay函数，修复守卫牌逻辑
function confirmPlay() {
    if (gameState.selectedCard === -1) {
        addLog('⚠️ 请先选择一张手牌！', 'warning');
        return;
    }
    
    if (gameState.animating) return;
    gameState.animating = true;
    
    clearInterval(gameState.countdownTimer);
    
    const myCard = gameState.handCards[gameState.selectedCard];
    
    // 守卫模式
    if (gameState.isGuard) {
        gameState.guardCard = myCard;
        showGuardComparison(myCard);
    } else {
        // 普通模式
        let guardCard;
        const suits = ['♥', '♦', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // 检查是否使用了透视
        if (gameState.peekUsed && gameState.nextGuardRevealed) {
            guardCard = gameState.nextGuardRevealed;
            gameState.peekUsed = false;
            addLog('👁️ 透视生效！你提前知道了守卫牌！', 'destiny');
        } else {
            guardCard = {
                suit: suits[Math.floor(Math.random() * suits.length)],
                rank: ranks[Math.floor(Math.random() * ranks.length)]
            };
            // 提示玩家可以使用透视
            if (hasDestinyCard('透视')) {
                addLog('💡 提示：使用"透视"天命牌可以提前看到守卫牌', 'tip');
            }
        }
        
        // 保存守卫牌到状态
        gameState.currentGuardCard = guardCard;
        
        // 揭晓守卫牌
        revealGuardCard(guardCard);
        
        // 判定结果
        const isMatch = (myCard.suit === guardCard.suit) || (myCard.rank === guardCard.rank);
        
        setTimeout(() => {
            if (isMatch) {
                handleSuccess();
            } else {
                handleFail(guardCard);
            }
            nextRound();
        }, 1500);
    }
}

// 揭晓守卫牌函数
function revealGuardCard(guardCard) {
    const guardDisplay = document.getElementById('guardCard');
    guardDisplay.classList.add('revealed');
    guardDisplay.innerHTML = `
        <div style="font-size: var(--hand-suit); color: ${(guardCard.suit === '♥' || guardCard.suit === '♦') ? '#d00' : '#000'};">${guardCard.suit}</div>
        <div style="font-size: var(--font-md); font-weight: bold; color: ${(guardCard.suit === '♥' || guardCard.suit === '♦') ? '#d00' : '#000'};">${guardCard.rank}</div>
    `;
    
    // 添加揭晓动画效果
    guardDisplay.style.animation = 'guardReveal 0.5s ease';
    setTimeout(() => {
        guardDisplay.style.animation = '';
    }, 500);
}

// 检查是否拥有某张天命牌
function hasDestinyCard(cardName) {
    return gameState.destinyCards.some(card => card.name === cardName);
}

// 重置守卫牌显示（每轮开始）
function resetGuardCard() {
    const guardDisplay = document.getElementById('guardCard');
    guardDisplay.classList.remove('revealed');
    guardDisplay.innerHTML = `
        <div class="guard-shield">🛡️</div>
        <div class="guard-text">?</div>
    `;
    gameState.currentGuardCard = null;
}

// 覆盖nextRound函数，添加重置守卫牌逻辑
const originalNextRound = nextRound;
nextRound = function() {
    // 重置守卫牌显示
    resetGuardCard();
    
    // 调用原始函数
    originalNextRound.apply(this, arguments);
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes guardReveal {
        0% { transform: scale(0.8) rotateY(0deg); }
        50% { transform: scale(1.1) rotateY(90deg); }
        100% { transform: scale(1) rotateY(180deg); }
    }
    
    .guard-card-display {
        transition: all 0.3s ease;
    }
    
    .guard-card-display.revealed {
        background: linear-gradient(135deg, #fff, #f8f8f8) !important;
        box-shadow: 0 0 20px rgba(255,215,0,0.5);
    }
`;
document.head.appendChild(style);

console.log('✅ 守卫牌修复脚本已加载 - 守卫牌现在默认隐藏，出牌后才揭晓');
