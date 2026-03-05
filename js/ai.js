/**
 * 命运塔·首登者 - AI系统玩家
 * V1.0 - 2026-03-05
 * 
 * AI特点：
 * 1. 记牌能力（知道已出的牌和已亮的守卫牌）
 * 2. 激怒牌预判（避开可能触发激怒的牌）
 * 3. 概率计算（基于剩余牌计算胜率）
 * 4. 出牌延迟（比真实玩家慢2秒或倒计时结束时出牌）
 */

class AIPlayer {
    constructor(id, difficulty = 'normal') {
        this.id = id;
        this.difficulty = difficulty; // easy, normal, hard, expert
        this.memory = {
            playedCards: [], // 已出的牌
            revealedGuardCards: {}, // 每层守卫已亮的牌
            angerCards: {}, // 每层激怒牌
            playerLayers: {} // 玩家当前层数
        };
        
        // 难度配置
        this.difficultyConfig = {
            easy: { memoryAccuracy: 0.3, delay: 3000, mistakeRate: 0.3 },
            normal: { memoryAccuracy: 0.6, delay: 2000, mistakeRate: 0.15 },
            hard: { memoryAccuracy: 0.85, delay: 2000, mistakeRate: 0.05 },
            expert: { memoryAccuracy: 1.0, delay: 2000, mistakeRate: 0 }
        };
        
        this.config = this.difficultyConfig[difficulty];
    }

    /**
     * AI思考并选择牌
     */
    async think(game, playerId) {
        const player = game.players[playerId];
        const currentLayer = player.currentLayer;
        const guard = game.guards[currentLayer - 1];
        
        // 更新记忆
        this.updateMemory(game);
        
        // 延迟模拟思考
        await this.delay(this.config.delay);
        
        // 获取可用牌
        const availableCards = player.hand
            .map((card, index) => ({ card, index }))
            .filter(c => !c.card.played);
        
        if (availableCards.length === 0) return null;
        
        // 根据难度决定是否犯错
        if (Math.random() < this.config.mistakeRate) {
            return this.makeMistake(availableCards);
        }
        
        // 计算每张牌的得分
        const cardScores = availableCards.map(({ card, index }) => {
            const score = this.evaluateCard(card, guard, game);
            return { card, index, score };
        });
        
        // 选择最佳牌
        cardScores.sort((a, b) => b.score - a.score);
        const bestCard = cardScores[0];
        
        return bestCard.index;
    }

    /**
     * 评估卡牌得分
     */
    evaluateCard(card, guard, game) {
        let score = 50; // 基础分
        
        // 1. 激怒牌风险（非常重要）
        const angerRisk = this.calculateAngerRisk(card, guard);
        score -= angerRisk * 40; // 高风险扣分
        
        // 2. 守卫牌匹配概率
        const matchProb = this.calculateMatchProbability(card, guard);
        score += matchProb * 30; // 高匹配加分
        
        // 3. 剩余牌价值（保留强牌）
        const cardValue = this.calculateCardValue(card);
        score -= cardValue * 10; // 高价值牌倾向于保留
        
        // 4. 记牌优势（如果记得守卫有哪些牌）
        const memoryAdvantage = this.calculateMemoryAdvantage(card, guard);
        score += memoryAdvantage * 20;
        
        // 5. 团队配合（如果是团队赛）
        if (game.mode === 'team') {
            const teamScore = this.calculateTeamBonus(card, game);
            score += teamScore;
        }
        
        return score;
    }

    /**
     * 计算激怒牌风险
     */
    calculateAngerRisk(card, guard) {
        if (!guard || !guard.angerCardsRevealed) return 0;
        
        let risk = 0;
        
        for (let angerCard of guard.angerCardsRevealed) {
            // 跳过已使用的激怒牌
            if (guard.angerCardsUsed.includes(angerCard)) continue;
            
            const rankMatch = angerCard.rank === card.rank;
            const suitMatch = angerCard.suit === card.suit;
            
            if (rankMatch && suitMatch) {
                // 完全一致 → 退2层，极高风险
                risk += 1.0;
            } else if (rankMatch || suitMatch) {
                // 部分匹配 → 退1层，中等风险
                risk += 0.5;
            }
        }
        
        return Math.min(risk, 1.0);
    }

    /**
     * 计算与守卫牌匹配概率
     */
    calculateMatchProbability(card, guard) {
        if (!guard) return 0;
        
        // 获取守卫剩余牌的信息
        const remainingCards = guard.cards.length;
        if (remainingCards === 0) return 0;
        
        // 基于记忆计算匹配概率
        let matchingCards = 0;
        
        // 检查已亮出的守卫牌中是否有匹配
        for (let revealedCard of guard.revealedCards) {
            if (revealedCard.rank === card.rank || revealedCard.suit === card.suit) {
                matchingCards++;
            }
        }
        
        // 根据已亮牌的模式推算剩余牌
        // 如果已亮牌中有同点数或同花色，剩余牌中可能有类似模式
        const rankProbability = 1 / 13; // 同点数概率
        const suitProbability = 1 / 4; // 同花色概率
        
        // 综合概率
        const estimatedMatches = remainingCards * (rankProbability + suitProbability);
        const probability = estimatedMatches / remainingCards;
        
        return Math.min(probability, 1.0);
    }

    /**
     * 计算卡牌价值（用于决定保留）
     */
    calculateCardValue(card) {
        const rankValues = {
            'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,
            '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13
        };
        
        const rankValue = rankValues[card.rank] || 0;
        
        // 高牌价值更高（在高层时更有用）
        // A和K是高价值牌，2-5是低价值牌
        return rankValue / 13;
    }

    /**
     * 计算记牌优势
     */
    calculateMemoryAdvantage(card, guard) {
        // 如果记忆准确度不够，无法获得优势
        if (Math.random() > this.config.memoryAccuracy) return 0;
        
        // 检查记忆中是否有关于这层守卫的信息
        const memory = this.memory.revealedGuardCards[guard.layer];
        if (!memory || memory.length === 0) return 0;
        
        let advantage = 0;
        
        for (let rememberedCard of memory) {
            if (rememberedCard.rank === card.rank) {
                advantage += 0.5; // 点数匹配
            }
            if (rememberedCard.suit === card.suit) {
                advantage += 0.3; // 花色匹配
            }
        }
        
        return Math.min(advantage, 1.0);
    }

    /**
     * 计算团队配合加分
     */
    calculateTeamBonus(card, game) {
        const player = game.players[this.id];
        const teammates = game.players.filter(p => 
            p.team === player.team && p.id !== player.id
        );
        
        let bonus = 0;
        
        for (let teammate of teammates) {
            // 如果队友在更高层，尽量跟上
            if (teammate.currentLayer > player.currentLayer) {
                bonus += 5;
            }
            
            // 如果队友即将登顶，尝试协助
            if (teammate.currentLayer >= 11 && !teammate.isFirstAscender) {
                bonus += 10;
            }
        }
        
        return bonus;
    }

    /**
     * 故意犯错（低难度AI）
     */
    makeMistake(availableCards) {
        // 随机选择一张非最优牌
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        return availableCards[randomIndex].index;
    }

    /**
     * 更新记忆
     */
    updateMemory(game) {
        // 记录已出的牌
        game.history.playedCards.forEach(card => {
            if (!this.memory.playedCards.includes(card)) {
                this.memory.playedCards.push(card);
            }
        });
        
        // 记录守卫牌
        game.guards.forEach(guard => {
            this.memory.revealedGuardCards[guard.layer] = guard.revealedCards;
            this.memory.angerCards[guard.layer] = guard.angerCardsRevealed;
        });
        
        // 记录玩家层数
        game.players.forEach(player => {
            this.memory.playerLayers[player.id] = player.currentLayer;
        });
        
        // 模拟记忆衰减（难度越高记忆越准确）
        if (this.config.memoryAccuracy < 1.0) {
            this.simulateMemoryDecay();
        }
    }

    /**
     * 模拟记忆衰减
     */
    simulateMemoryDecay() {
        // 简单实现：随机遗忘一些信息
        if (Math.random() > this.config.memoryAccuracy) {
            // 可能遗忘某些已亮出的守卫牌
            const layers = Object.keys(this.memory.revealedGuardCards);
            if (layers.length > 0) {
                const randomLayer = layers[Math.floor(Math.random() * layers.length)];
                // 不完全遗忘，只是降低准确度
            }
        }
    }

    /**
     * 首登者AI：选择守卫牌
     */
    selectGuardCard(guard, opponentCard) {
        // 首登者目标是淘汰其他玩家
        // 选择与对手牌匹配的守卫牌
        
        let bestIndex = 0;
        let bestMatch = 0;
        
        guard.cards.forEach((card, index) => {
            let match = 0;
            
            if (opponentCard) {
                if (card.rank === opponentCard.rank) match += 2;
                if (card.suit === opponentCard.suit) match += 1;
            }
            
            // 优先选择高牌（更有可能匹配）
            const rankValues = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10 };
            match += (rankValues[card.rank] || parseInt(card.rank)) / 14;
            
            if (match > bestMatch) {
                bestMatch = match;
                bestIndex = index;
            }
        });
        
        return bestIndex;
    }

    /**
     * 首登者AI：选择激怒牌时机
     */
    shouldUseAngerCard(guard, opponentCard) {
        if (!guard || guard.angerCards.length === 0) return false;
        
        // 检查是否有激怒牌可以匹配对手
        for (let angerCard of guard.angerCards) {
            if (guard.angerCardsUsed.includes(angerCard)) continue;
            
            const rankMatch = angerCard.rank === opponentCard.rank;
            const suitMatch = angerCard.suit === opponentCard.suit;
            
            if (rankMatch || suitMatch) {
                // 可以触发激怒效果
                return true;
            }
        }
        
        return false;
    }

    /**
     * 延迟函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * AI系统管理器
 * 管理18个系统玩家
 */
class AISystemManager {
    constructor() {
        this.aiPlayers = [];
        this.initAISystem();
    }

    initAISystem() {
        // 创建18个系统AI玩家
        const difficulties = ['easy', 'normal', 'hard', 'expert'];
        
        for (let i = 0; i < 18; i++) {
            // 分配难度：
            // 0-5: easy (新手)
            // 6-11: normal (普通)
            // 12-15: hard (困难)
            // 16-17: expert (专家)
            let difficulty;
            if (i < 6) difficulty = 'easy';
            else if (i < 12) difficulty = 'normal';
            else if (i < 16) difficulty = 'hard';
            else difficulty = 'expert';
            
            this.aiPlayers.push(new AIPlayer(100 + i, difficulty));
        }
    }

    /**
     * 获取AI玩家
     */
    getAIPlayer(index) {
        return this.aiPlayers[index % this.aiPlayers.length];
    }

    /**
     * 为游戏填充AI玩家
     */
    fillWithAI(game, humanCount = 1) {
        const aiNeeded = 4 - humanCount;
        
        for (let i = 0; i < aiNeeded; i++) {
            const ai = this.getAIPlayer(i);
            const playerIndex = humanCount + i;
            
            // 将AI绑定到游戏玩家
            game.players[playerIndex].ai = ai;
            game.players[playerIndex].isAI = true;
            game.players[playerIndex].name = `AI-${ai.difficulty}-${i + 1}`;
        }
        
        return game;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIPlayer, AISystemManager };
}
