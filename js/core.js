/**
 * 命运塔·首登者 - 核心游戏逻辑
 * V1.0 - 2026-03-05
 */

class FateTowerGame {
    constructor(mode = 'solo') {
        this.mode = mode; // 'solo', 'team', 'streak'
        this.maxLayers = 13;
        this.currentLayer = 1; // 从第1层开始
        
        // 牌组配置
        this.deckConfig = mode === 'streak' ? 
            { decks: 2, cardsPerGuard: 4, guards: 13 } : // 连胜模式
            { decks: 4, cardsPerGuard: 13, guards: 13 };  // 主游戏
        
        this.totalCards = this.deckConfig.decks * 52;
        
        // 游戏状态
        this.gameState = 'waiting'; // waiting, playing, ended
        this.round = 1;
        this.players = [];
        this.guards = [];
        this.firstAscender = null;
        this.highestFallenLayer = 0;
        
        // 历史记录（用于记牌）
        this.history = {
            playedCards: [], // 已出牌
            revealedGuardCards: {}, // 每层守卫已亮出的牌
            angerCardsUsed: {} // 已使用的激怒牌
        };
    }

    /**
     * 初始化游戏
     */
    initGame(playerCount = 4) {
        this.createDeck();
        this.createGuards();
        this.createPlayers(playerCount);
        this.gameState = 'playing';
        return this;
    }

    /**
     * 创建牌组
     */
    createDeck() {
        const suits = ['♥️', '♠️', '♦️', '♣️'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        for (let d = 0; d < this.deckConfig.decks; d++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    this.deck.push({
                        suit: suit,
                        rank: rank,
                        id: `${suit}${rank}_${d}`,
                        value: this.getCardValue(rank)
                    });
                }
            }
        }
        
        // 洗牌
        this.shuffle(this.deck);
    }

    /**
     * 创建守卫
     */
    createGuards() {
        this.guards = [];
        let remainingDeck = [...this.deck];
        
        for (let i = 1; i <= this.deckConfig.guards; i++) {
            // 抽取守卫牌
            const guardCards = remainingDeck.splice(0, this.deckConfig.cardsPerGuard);
            
            // 抽取激怒牌（3张）
            const angerCards = remainingDeck.splice(0, 3);
            
            this.guards.push({
                layer: i,
                cards: guardCards, // 13张（或4张连胜模式）
                angerCards: angerCards, // 3张激怒牌
                angerCardsRevealed: [...angerCards], // 明牌展示
                revealedCards: [], // 已亮出的牌
                angerCardsUsed: [], // 已使用的激怒牌
                isDefeated: false,
                controller: null // 首登者控制
            });
        }
        
        this.remainingDeck = remainingDeck;
    }

    /**
     * 创建玩家
     */
    createPlayers(count) {
        this.players = [];
        for (let i = 0; i < count; i++) {
            this.players.push({
                id: i,
                name: i === 0 ? '金先生' : `玩家${i + 1}`,
                team: i < 2 ? 'A' : 'B', // 团队赛分组
                hand: this.createPlayerHand(),
                currentLayer: 1,
                score: 0,
                isFirstAscender: false,
                isEliminated: false,
                cardsGiven: 0 // 赠予队友的牌数
            });
        }
    }

    /**
     * 创建玩家手牌（完整52张）
     */
    createPlayerHand() {
        const suits = ['♥️', '♠️', '♦️', '♣️'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        const hand = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                hand.push({
                    suit: suit,
                    rank: rank,
                    played: false
                });
            }
        }
        return hand;
    }

    /**
     * 玩家出牌
     */
    playCard(playerId, cardIndex) {
        const player = this.players[playerId];
        if (player.isEliminated) return { success: false, error: '玩家已淘汰' };
        
        const card = player.hand[cardIndex];
        if (card.played) return { success: false, error: '牌已出完' };
        
        // 标记为已出
        card.played = true;
        this.history.playedCards.push(card);
        
        // 守卫响应
        const guard = this.guards[player.currentLayer - 1];
        const guardCard = this.revealGuardCard(guard);
        
        // 检查激怒牌触发
        const angerResult = this.checkAngerCards(player, card, guard);
        
        // 检查层数变化
        const layerResult = this.checkLayerChange(player, card, guardCard);
        
        // 检查是否登顶
        const ascensionResult = this.checkAscension(player);
        
        // 检查游戏结束
        const gameEndResult = this.checkGameEnd();
        
        this.round++;
        
        return {
            success: true,
            player: player,
            playedCard: card,
            guardCard: guardCard,
            angerResult: angerResult,
            layerResult: layerResult,
            ascensionResult: ascensionResult,
            gameEndResult: gameEndResult
        };
    }

    /**
     * 守卫亮牌
     */
    revealGuardCard(guard) {
        if (guard.cards.length === 0) {
            guard.isDefeated = true;
            return null;
        }
        
        // 如果有首登者控制，由首登者选择
        if (guard.controller !== null) {
            // AI选择或玩家选择
            const cardIndex = this.selectGuardCard(guard);
            const card = guard.cards.splice(cardIndex, 1)[0];
            guard.revealedCards.push(card);
            return card;
        }
        
        // 随机亮牌
        const cardIndex = Math.floor(Math.random() * guard.cards.length);
        const card = guard.cards.splice(cardIndex, 1)[0];
        guard.revealedCards.push(card);
        return card;
    }

    /**
     * 首登者选择守卫牌
     */
    selectGuardCard(guard) {
        // AI策略：选择能淘汰玩家的牌
        // 简化版：随机选择
        return Math.floor(Math.random() * guard.cards.length);
    }

    /**
     * 检查激怒牌触发
     */
    checkAngerCards(player, playedCard, guard) {
        const result = {
            triggered: false,
            usedAngerCard: null,
            effect: null,
            layersLost: 0
        };
        
        // 检查守卫是否还有激怒牌
        const availableAnger = guard.angerCards.filter(c => 
            !guard.angerCardsUsed.includes(c)
        );
        
        if (availableAnger.length === 0) return result;
        
        // 触发条件判断
        for (let angerCard of availableAnger) {
            const rankMatch = angerCard.rank === playedCard.rank;
            const suitMatch = angerCard.suit === playedCard.suit;
            
            if (rankMatch && suitMatch) {
                // 完全一致 → 退2层
                result.triggered = true;
                result.usedAngerCard = angerCard;
                result.effect = 'both_match';
                result.layersLost = 2;
                guard.angerCardsUsed.push(angerCard);
                break;
            } else if (rankMatch || suitMatch) {
                // 点数或花色一致 → 退1层
                result.triggered = true;
                result.usedAngerCard = angerCard;
                result.effect = 'partial_match';
                result.layersLost = 1;
                guard.angerCardsUsed.push(angerCard);
                break;
            }
        }
        
        // 应用效果
        if (result.triggered && player.currentLayer > 1) {
            const newLayer = Math.max(1, player.currentLayer - result.layersLost);
            player.currentLayer = newLayer;
        }
        
        return result;
    }

    /**
     * 检查层数变化（普通规则）
     */
    checkLayerChange(player, playedCard, guardCard) {
        if (!guardCard) return { changed: false };
        
        const rankMatch = playedCard.rank === guardCard.rank;
        const suitMatch = playedCard.suit === guardCard.suit;
        
        if (rankMatch || suitMatch) {
            // 成功，可进一层
            if (player.currentLayer < this.maxLayers) {
                player.currentLayer++;
                return { changed: true, direction: 'up', reason: 'match' };
            }
        }
        
        return { changed: false };
    }

    /**
     * 检查是否登顶
     */
    checkAscension(player) {
        if (player.currentLayer === this.maxLayers && !player.isFirstAscender) {
            if (this.firstAscender === null) {
                // 首位登顶
                player.isFirstAscender = true;
                this.firstAscender = player;
                
                // 玩家成为最高失守层守卫的控制者
                this.updateGuardControl();
                
                return { 
                    ascended: true, 
                    isFirst: true,
                    message: '恭喜成为首登者！'
                };
            } else {
                // 后续登顶
                return {
                    ascended: true,
                    isFirst: false,
                    message: '成功登顶！'
                };
            }
        }
        return { ascended: false };
    }

    /**
     * 更新守卫控制
     */
    updateGuardControl() {
        // 找到最高失守层
        for (let i = this.guards.length - 1; i >= 0; i--) {
            if (this.guards[i].isDefeated) {
                this.highestFallenLayer = i + 1;
                this.guards[i].controller = this.firstAscender.id;
                
                // 重新激活守卫牌
                this.guards[i].isDefeated = false;
                this.guards[i].cards = [...this.guards[i].revealedCards];
                this.guards[i].revealedCards = [];
                this.guards[i].angerCardsUsed = [];
                break;
            }
        }
    }

    /**
     * 检查游戏结束
     */
    checkGameEnd() {
        const alivePlayers = this.players.filter(p => !p.isEliminated);
        const exhaustedPlayers = this.players.filter(p => 
            p.hand.every(c => c.played)
        );
        
        // 检查个人战结束
        if (this.mode === 'solo') {
            // 首登后其他玩家登顶
            if (this.firstAscender !== null) {
                const otherAscended = this.players.find(p => 
                    p.id !== this.firstAscender.id && 
                    p.currentLayer === this.maxLayers
                );
                
                if (otherAscended) {
                    // 首登者退回最高失守层
                    this.firstAscender.currentLayer = this.highestFallenLayer || 1;
                    this.firstAscender.isFirstAscender = false;
                    
                    // 移交守卫控制权
                    this.firstAscender = otherAscended;
                    this.firstAscender.isFirstAscender = true;
                    this.updateGuardControl();
                }
            }
            
            // 只剩一名玩家未耗尽手牌
            const notExhausted = this.players.filter(p => 
                !p.hand.every(c => c.played)
            );
            
            if (notExhausted.length === 1) {
                this.gameState = 'ended';
                return { ended: true, winner: notExhausted[0], reason: 'last_survivor' };
            }
        }
        
        // 检查团队战结束
        if (this.mode === 'team') {
            const teamA = this.players.filter(p => p.team === 'A');
            const teamB = this.players.filter(p => p.team === 'B');
            
            // 一队全员登顶
            const teamAAllAscended = teamA.every(p => p.currentLayer === this.maxLayers);
            const teamBAllAscended = teamB.every(p => p.currentLayer === this.maxLayers);
            
            if (teamAAllAscended || teamBAllAscended) {
                this.gameState = 'ended';
                const winner = teamAAllAscended ? 'A' : 'B';
                return { ended: true, winner: winner, reason: 'all_ascended' };
            }
            
            // 一队全员手牌耗尽
            const teamAAllExhausted = teamA.every(p => p.hand.every(c => c.played));
            const teamBAllExhausted = teamB.every(p => p.hand.every(c => c.played));
            
            if (teamAAllExhausted || teamBAllExhausted) {
                this.gameState = 'ended';
                const loser = teamAAllExhausted ? 'A' : 'B';
                const winner = loser === 'A' ? 'B' : 'A';
                return { ended: true, winner: winner, reason: 'opponent_exhausted' };
            }
        }
        
        return { ended: false };
    }

    /**
     * 计算积分
     */
    calculateScores() {
        const scores = [];
        const totalScore = 1000;
        const baseScore = 200;
        const contribScore = 800;
        
        // 计算各项贡献
        const maxLayer = Math.max(...this.players.map(p => p.currentLayer));
        const maxRound = this.round;
        
        for (let player of this.players) {
            let score = 0;
            
            // 基础分
            if (this.gameState === 'ended') {
                const isWinner = this.checkWinner(player);
                score += isWinner ? baseScore : -baseScore;
            }
            
            // 闯层成功率
            const layerSuccess = (player.currentLayer / maxLayer) * (maxRound / this.round);
            score += layerSuccess * contribScore * 0.4;
            
            // 队友贡献
            const teamContrib = player.cardsGiven * 10;
            score += teamContrib;
            
            // 守层贡献（首登者）
            if (player.isFirstAscender) {
                const guardContrib = this.calculateGuardContrib();
                score += guardContrib;
            }
            
            scores.push({
                player: player,
                score: Math.round(score)
            });
        }
        
        return scores;
    }

    /**
     * 检查是否获胜
     */
    checkWinner(player) {
        if (this.mode === 'solo') {
            // 个人战：首登者或最后幸存者
            return player.isFirstAscender || 
                   (this.gameState === 'ended' && !player.hand.every(c => c.played));
        }
        if (this.mode === 'team') {
            const teamResult = this.checkGameEnd();
            return teamResult.ended && teamResult.winner === player.team;
        }
        return false;
    }

    /**
     * 计算守卫贡献
     */
    calculateGuardContrib() {
        // 简化计算
        return 100;
    }

    /**
     * 获取卡牌数值
     */
    getCardValue(rank) {
        const values = {
            'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,
            '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13
        };
        return values[rank] || 0;
    }

    /**
     * 洗牌算法（Fisher-Yates）
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * 获取玩家剩余手牌
     */
    getRemainingHand(playerId) {
        const player = this.players[playerId];
        return player.hand.filter(c => !c.played);
    }

    /**
     * 赠牌给队友
     */
    giveCards(fromId, toId, count) {
        const from = this.players[fromId];
        const to = this.players[toId];
        
        if (from.team !== to.team) return { success: false, error: '不是队友' };
        
        const remaining = this.getRemainingHand(fromId);
        const giveCount = Math.min(count, Math.floor(remaining.length / 3));
        
        if (giveCount === 0) return { success: false, error: '牌不足' };
        
        for (let i = 0; i < giveCount; i++) {
            const card = remaining[i];
            card.played = false; // 重置状态
            to.hand.push(card);
        }
        
        from.cardsGiven += giveCount;
        
        return { 
            success: true, 
            given: giveCount,
            from: from.name,
            to: to.name
        };
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FateTowerGame;
}
