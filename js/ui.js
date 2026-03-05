/**
 * 命运塔·首登者 - UI控制系统
 * V1.0 - 2026-03-05
 */

class GameUI {
    constructor(game, towerRenderer) {
        this.game = game;
        this.tower = towerRenderer;
        this.mobile = window.mobileAdapter;
        
        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupMobileUI();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements = {
            // 主区域
            gameArea: document.getElementById('game-area'),
            towerCanvas: document.getElementById('tower-canvas'),
            handArea: document.getElementById('hand-area'),
            infoPanel: document.getElementById('info-panel'),
            
            // 玩家信息
            playerLayer: document.getElementById('player-layer'),
            playerRound: document.getElementById('player-round'),
            playerScore: document.getElementById('player-score'),
            playerCards: document.getElementById('player-cards'),
            
            // 按钮
            btnPlay: document.getElementById('btn-play'),
            btnPass: document.getElementById('btn-pass'),
            btnAnger: document.getElementById('btn-anger'),
            
            // 弹窗
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalContent: document.getElementById('modal-content'),
            modalClose: document.getElementById('modal-close'),
            
            // 提示
            toast: document.getElementById('toast')
        };
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 出牌按钮
        if (this.elements.btnPlay) {
            this.elements.btnPlay.addEventListener('click', () => this.onPlayCard());
        }
        
        // 跳过按钮
        if (this.elements.btnPass) {
            this.elements.btnPass.addEventListener('click', () => this.onPass());
        }
        
        // 激怒牌按钮
        if (this.elements.btnAnger) {
            this.elements.btnAnger.addEventListener('click', () => this.onUseAnger());
        }
        
        // 关闭弹窗
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => this.hideModal());
        }
        
        // 触摸支持
        if (this.mobile && this.mobile.isTouch) {
            this.setupTouchControls();
        }
    }

    /**
     * 设置移动端UI
     */
    setupMobileUI() {
        if (!this.mobile || !this.mobile.isMobile) return;
        
        // 添加触摸类
        document.body.classList.add('mobile');
        
        // 调整布局
        const gameArea = this.elements.gameArea;
        if (gameArea) {
            gameArea.classList.add('mobile-layout');
        }
        
        // 调整手牌区域
        const handArea = this.elements.handArea;
        if (handArea) {
            handArea.classList.add('mobile-hand');
        }
    }

    /**
     * 设置触摸控制
     */
    setupTouchControls() {
        // 手牌滑动选择
        const handArea = this.elements.handArea;
        if (handArea) {
            this.mobile.onSwipe(handArea, {
                onSwipeLeft: () => this.scrollHand('left'),
                onSwipeRight: () => this.scrollHand('right')
            });
        }
        
        // 长按显示卡牌详情
        const cards = handArea?.querySelectorAll('.card');
        cards?.forEach(card => {
            this.mobile.onLongPress(card, () => {
                this.showCardDetail(card.dataset.card);
            });
        });
    }

    /**
     * 渲染手牌
     */
    renderHand(playerId = 0) {
        const player = this.game.players[playerId];
        if (!player) return;
        
        const handArea = this.elements.handArea;
        if (!handArea) return;
        
        handArea.innerHTML = '';
        
        player.hand.forEach((card, index) => {
            if (card.played) return;
            
            const cardEl = document.createElement('div');
            cardEl.className = 'card touchable';
            cardEl.dataset.card = JSON.stringify(card);
            cardEl.dataset.index = index;
            
            // 卡牌内容
            cardEl.innerHTML = `
                <div class="card-suit">${card.suit}</div>
                <div class="card-rank">${card.rank}</div>
            `;
            
            // 点击选择
            cardEl.addEventListener('click', () => this.selectCard(index, cardEl));
            
            handArea.appendChild(cardEl);
        });
        
        // 更新手牌计数
        this.updateHandCount(player);
    }

    /**
     * 选择卡牌
     */
    selectCard(index, element) {
        // 移除其他选中
        document.querySelectorAll('.card.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // 选中当前
        element.classList.add('selected');
        this.selectedCardIndex = index;
        
        // 高亮可匹配的守卫牌
        this.highlightMatchableGuards();
    }

    /**
     * 高亮可匹配的守卫
     */
    highlightMatchableGuards() {
        if (this.selectedCardIndex === undefined) return;
        
        const player = this.game.players[0];
        const card = player.hand[this.selectedCardIndex];
        const guard = this.game.guards[player.currentLayer - 1];
        
        if (!guard || !guard.angerCardsRevealed) return;
        
        // 检查激怒牌匹配
        guard.angerCardsRevealed.forEach((angerCard, i) => {
            const angerEl = document.querySelector(`.anger-card[data-index="${i}"]`);
            if (!angerEl) return;
            
            const rankMatch = angerCard.rank === card.rank;
            const suitMatch = angerCard.suit === card.suit;
            
            if (rankMatch || suitMatch) {
                angerEl.classList.add('match-warning');
            } else {
                angerEl.classList.remove('match-warning');
            }
        });
    }

    /**
     * 出牌
     */
    onPlayCard() {
        if (this.selectedCardIndex === undefined) {
            this.showToast('请选择一张牌');
            return;
        }
        
        const result = this.game.playCard(0, this.selectedCardIndex);
        
        if (!result.success) {
            this.showToast(result.error);
            return;
        }
        
        // 显示结果
        this.showPlayResult(result);
        
        // 更新UI
        this.renderHand();
        this.updateInfo();
        this.tower.setData(
            this.game.players,
            this.game.guards,
            this.game.players[0].currentLayer
        );
        
        // 清除选择
        this.selectedCardIndex = undefined;
        
        // 检查游戏结束
        if (result.gameEndResult.ended) {
            this.showGameEnd(result.gameEndResult);
        }
    }

    /**
     * 显示出牌结果
     */
    showPlayResult(result) {
        let message = '';
        
        // 出的牌
        message += `你出了: ${result.playedCard.suit}${result.playedCard.rank}\n`;
        
        // 守卫牌
        if (result.guardCard) {
            message += `守卫出: ${result.guardCard.suit}${result.guardCard.rank}\n`;
        }
        
        // 激怒牌结果
        if (result.angerResult.triggered) {
            message += `⚠️ 触发激怒牌！退${result.angerResult.layersLost}层\n`;
        }
        
        // 层数变化
        if (result.layerResult.changed) {
            message += `✅ 成功！上升到第${result.layerResult.direction === 'up' ? result.player.currentLayer : ''}层`;
        }
        
        // 登顶
        if (result.ascensionResult.ascended) {
            message += `\n🎉 ${result.ascensionResult.message}`;
        }
        
        this.showModal('出牌结果', message.replace(/\n/g, '<br>'));
    }

    /**
     * 跳过
     */
    onPass() {
        this.showToast('跳过本轮');
        // 实现跳过逻辑
    }

    /**
     * 使用激怒牌（首登者功能）
     */
    onUseAnger() {
        const player = this.game.players[0];
        if (!player.isFirstAscender) {
            this.showToast('只有首登者可以使用激怒牌');
            return;
        }
        
        // 显示激怒牌选择界面
        this.showAngerCardSelector();
    }

    /**
     * 显示激怒牌选择器
     */
    showAngerCardSelector() {
        // 找到控制的守卫
        const guard = this.game.guards.find(g => g.controller === 0);
        if (!guard || guard.angerCards.length === 0) {
            this.showToast('没有可用的激怒牌');
            return;
        }
        
        let html = '<div class="anger-selector">';
        guard.angerCards.forEach((card, i) => {
            html += `
                <div class="anger-card-option" data-index="${i}">
                    <div class="card-suit">${card.suit}</div>
                    <div class="card-rank">${card.rank}</div>
                </div>
            `;
        });
        html += '</div>';
        
        this.showModal('选择激怒牌', html);
        
        // 绑定选择事件
        document.querySelectorAll('.anger-card-option').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                this.activateAngerCard(index);
            });
        });
    }

    /**
     * 激活激怒牌
     */
    activateAngerCard(index) {
        // 实现激怒牌激活逻辑
        this.showToast('激怒牌已激活！');
        this.hideModal();
    }

    /**
     * 更新信息显示
     */
    updateInfo() {
        const player = this.game.players[0];
        
        if (this.elements.playerLayer) {
            this.elements.playerLayer.textContent = player.currentLayer;
        }
        if (this.elements.playerRound) {
            this.elements.playerRound.textContent = this.game.round;
        }
        if (this.elements.playerScore) {
            this.elements.playerScore.textContent = player.score;
        }
    }

    /**
     * 更新手牌计数
     */
    updateHandCount(player) {
        if (this.elements.playerCards) {
            const remaining = player.hand.filter(c => !c.played).length;
            this.elements.playerCards.textContent = remaining;
        }
    }

    /**
     * 滚动手牌
     */
    scrollHand(direction) {
        const handArea = this.elements.handArea;
        if (!handArea) return;
        
        const scrollAmount = 100;
        if (direction === 'left') {
            handArea.scrollLeft -= scrollAmount;
        } else {
            handArea.scrollLeft += scrollAmount;
        }
    }

    /**
     * 显示卡牌详情
     */
    showCardDetail(cardJson) {
        const card = JSON.parse(cardJson);
        this.showModal('卡牌详情', `
            <div class="card-detail">
                <div class="big-card">
                    <div class="card-suit">${card.suit}</div>
                    <div class="card-rank">${card.rank}</div>
                </div>
                <p>花色: ${this.getSuitName(card.suit)}</p>
                <p>点数: ${card.rank}</p>
            </div>
        `);
    }

    /**
     * 获取花色名称
     */
    getSuitName(suit) {
        const names = {
            '♥️': '红桃',
            '♠️': '黑桃',
            '♦️': '方块',
            '♣️': '梅花'
        };
        return names[suit] || suit;
    }

    /**
     * 显示Toast提示
     */
    showToast(message, duration = 2000) {
        const toast = this.elements.toast;
        if (!toast) {
            alert(message);
            return;
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    /**
     * 显示弹窗
     */
    showModal(title, content) {
        if (this.elements.modalTitle) {
            this.elements.modalTitle.textContent = title;
        }
        if (this.elements.modalContent) {
            this.elements.modalContent.innerHTML = content;
        }
        if (this.elements.modal) {
            this.elements.modal.classList.add('show');
        }
    }

    /**
     * 隐藏弹窗
     */
    hideModal() {
        if (this.elements.modal) {
            this.elements.modal.classList.remove('show');
        }
    }

    /**
     * 显示游戏结束
     */
    showGameEnd(result) {
        let content = '';
        
        if (result.winner) {
            content = `
                <div class="game-end">
                    <h2>🎉 ${typeof result.winner === 'object' ? result.winner.name : `队伍${result.winner}`} 获胜！</h2>
                    <p>胜利原因: ${this.getWinReason(result.reason)}</p>
                    <button onclick="location.reload()">再来一局</button>
                </div>
            `;
        }
        
        this.showModal('游戏结束', content);
    }

    /**
     * 获取胜利原因
     */
    getWinReason(reason) {
        const reasons = {
            'last_survivor': '最后幸存者',
            'all_ascended': '全员登顶',
            'opponent_exhausted': '对手手牌耗尽'
        };
        return reasons[reason] || reason;
    }

    /**
     * AI玩家回合
     */
    async aiTurn(playerId) {
        // 延迟模拟思考
        await this.delay(1000);
        
        // AI选择牌
        const player = this.game.players[playerId];
        const availableCards = player.hand
            .map((c, i) => ({ card: c, index: i }))
            .filter(c => !c.card.played);
        
        if (availableCards.length === 0) return;
        
        // 简单AI：随机选择
        const choice = availableCards[Math.floor(Math.random() * availableCards.length)];
        
        // 出牌
        const result = this.game.playCard(playerId, choice.index);
        
        // 更新UI
        this.tower.setData(
            this.game.players,
            this.game.guards,
            this.game.players[0].currentLayer
        );
        
        return result;
    }

    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUI;
}
