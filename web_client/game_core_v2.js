/**
 * 命运塔·首登者 - 新核心逻辑 (2026-03-06)
 * 基于金先生最新定义的游戏规则
 * 
 * 【重要】此版本已移除所有天命牌系统
 * 
 * 核心规则：
 * 1. 4副扑克牌（208张）
 * 2. 13名守卫，每人13张守卫牌 + 3张激怒牌
 * 3. 激怒牌机制：守卫主动亮出，玩家匹配则回退
 * 4. 首登者机制：登顶后变成守卫控制其他层
 * 5. 团队战和个人战不同规则
 * 6. 积分系统（1000分分配）
 */

const GameCore = {
    // 游戏配置
    config: {
        totalDecks: 4,           // 4副牌
        cardsPerDeck: 52,        // 每副52张
        totalCards: 208,         // 总计208张
        totalGuards: 13,         // 13名守卫
        cardsPerGuard: 13,       // 每名守卫13张牌
        provokeCardsPerGuard: 3, // 每名守卫3张激怒牌
        totalLevels: 13,         // 13层
        cardsPerPlayer: 52,      // 每名玩家52张牌
    },
    
    // 牌组生成
    generateDecks() {
        const suits = ['♥', '♠', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const decks = [];
        
        for (let d = 0; d < this.config.totalDecks; d++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    decks.push({ suit, rank, deck: d + 1 });
                }
            }
        }
        
        return this.shuffle(decks);
    },
    
    // 洗牌算法
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },
    
    // 初始化守卫
    initGuards() {
        const allCards = this.generateDecks();
        const guards = [];
        
        for (let i = 0; i < this.config.totalGuards; i++) {
            // 每名守卫抽取13张守卫牌
            const guardCards = allCards.splice(0, this.config.cardsPerGuard);
            // 抽取3张激怒牌
            const provokeCards = allCards.splice(0, this.config.provokeCardsPerGuard);
            
            guards.push({
                level: i + 1,
                guardCards: guardCards,      // 13张守卫牌（隐藏）
                provokeCards: provokeCards,  // 3张激怒牌（明牌）
                defeated: false,
                currentGuardIndex: 0
            });
        }
        
        return { guards, remainingCards: allCards };
    },
    
    // 初始化玩家
    initPlayer(name, isHuman = false) {
        const suits = ['♥', '♠', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const hand = [];
        
        // 玩家获得一副完整的52张牌
        for (const suit of suits) {
            for (const rank of ranks) {
                hand.push({ suit, rank, used: false });
            }
        }
        
        return {
            name,
            isHuman,
            hand,
            currentLevel: 1,
            isFirstClimber: false,
            isEliminated: false,
            score: 0
        };
    },
    
    // 检查激怒牌触发
    checkProvokeCard(player, guard, playedCard) {
        // 守卫亮出激怒牌
        const provokeCard = guard.provokeCards[Math.floor(Math.random() * guard.provokeCards.length)];
        
        // 检查是否匹配
        const suitMatch = playedCard.suit === provokeCard.suit;
        const rankMatch = playedCard.rank === provokeCard.rank;
        
        if (suitMatch && rankMatch) {
            // 完全一致 - 回退2层
            return { 
                triggered: true, 
                retreat: 2, 
                message: `❌ 激怒牌完全匹配！回退2层！`,
                provokeCard
            };
        } else if (suitMatch || rankMatch) {
            // 部分匹配 - 回退1层
            return { 
                triggered: true, 
                retreat: 1, 
                message: `⚠️ 激怒牌部分匹配！回退1层！`,
                provokeCard
            };
        }
        
        return { triggered: false, provokeCard };
    },
    
    // 检查守卫牌匹配
    checkGuardCard(player, guard, playedCard) {
        // 守卫亮出一张牌
        const guardCard = guard.guardCards[guard.currentGuardIndex];
        guard.currentGuardIndex++;
        
        // 检查是否匹配
        const suitMatch = playedCard.suit === guardCard.suit;
        const rankMatch = playedCard.rank === guardCard.rank;
        
        if (suitMatch || rankMatch) {
            // 匹配成功 - 晋级
            return {
                success: true,
                guardCard,
                message: `✅ 匹配成功！晋级到第${player.currentLevel + 1}层！`
            };
        } else {
            // 匹配失败
            return {
                success: false,
                guardCard,
                message: `❌ 匹配失败！留在第${player.currentLevel}层。`
            };
        }
    },
    
    // 计算积分 (基于新规则)
    calculateScore(gameResult) {
        const { players, winner, totalRounds, firstClimberRounds } = gameResult;
        const scores = {};
        
        // 基础分
        const baseWinPoints = 200;
        const baseLosePoints = -200;
        const remainingPoints = 800;
        
        players.forEach(player => {
            let score = 0;
            const isWinner = player.name === winner;
            
            // 基础分
            score += isWinner ? baseWinPoints : baseLosePoints;
            
            // 贡献分计算
            if (isWinner) {
                // 闯关成功率贡献
                const climbRate = player.currentLevel / 13;
                const climbPoints = remainingPoints * 0.4 * climbRate;
                
                // 队友贡献 (给牌数量)
                const teammateContribution = (player.cardsGiven || 0) / 52;
                const teammatePoints = remainingPoints * 0.3 * teammateContribution;
                
                // 守层贡献
                const defendContribution = player.defendRounds || 0;
                const defendPoints = remainingPoints * 0.3 * (defendContribution / totalRounds);
                
                score += climbPoints + teammatePoints + defendPoints;
            } else {
                // 失败方扣分 (根据表现扣更少)
                const performance = (player.currentLevel / 13) * 0.5 + 
                                   (player.remainingCards / 52) * 0.3 +
                                   (player.cardsGivenToTeammates / 17) * 0.2;
                score += remainingPoints * performance * 0.5; // 减少扣分
            }
            
            scores[player.name] = Math.round(score);
        });
        
        return scores;
    },
    
    // 连胜模式计分
    calculateStreakScore(levelsClimbed) {
        if (levelsClimbed < 3) return 0;
        
        let score = 50; // 基础分
        
        // 从第4层开始加分
        for (let i = 4; i <= levelsClimbed; i++) {
            score += 50 + i * 10;
        }
        
        // 系统当日激励
        const dailyBonus = Math.floor(Math.random() * 901) + 100; // 100-1000分
        
        return {
            baseScore: score,
            dailyBonus,
            totalScore: score + dailyBonus
        };
    }
};

// 游戏状态管理
const GameState = {
    players: [],
    guards: [],
    currentRound: 1,
    firstClimber: null,
    gamePhase: 'climbing', // climbing, defending, ended
    
    // 初始化游戏
    init(playerNames, isTeamMode = false) {
        // 初始化守卫
        const { guards } = GameCore.initGuards();
        this.guards = guards;
        
        // 初始化玩家
        this.players = playerNames.map((name, i) => 
            GameCore.initPlayer(name, i === 0)
        );
        
        this.currentRound = 1;
        this.firstClimber = null;
        this.gamePhase = 'climbing';
        this.isTeamMode = isTeamMode;
        
        return this;
    },
    
    // 玩家出牌
    playCard(playerIndex, cardIndex) {
        const player = this.players[playerIndex];
        const card = player.hand[cardIndex];
        
        if (card.used) {
            return { error: '这张牌已经使用过了！' };
        }
        
        card.used = true;
        
        const currentGuard = this.guards[player.currentLevel - 1];
        
        // 检查激怒牌 (只在特定层触发)
        let provokeResult = { triggered: false };
        if (this.shouldTriggerProvoke(player)) {
            provokeResult = GameCore.checkProvokeCard(player, currentGuard, card);
            if (provokeResult.triggered) {
                player.currentLevel = Math.max(1, player.currentLevel - provokeResult.retreat);
                return {
                    success: false,
                    provoke: provokeResult,
                    message: provokeResult.message
                };
            }
        }
        
        // 检查守卫牌
        const guardResult = GameCore.checkGuardCard(player, currentGuard, card);
        
        if (guardResult.success) {
            player.currentLevel++;
            
            // 检查是否登顶
            if (player.currentLevel > 13) {
                player.currentLevel = 13;
                if (!this.firstClimber) {
                    this.firstClimber = player;
                    player.isFirstClimber = true;
                    this.gamePhase = 'defending';
                    return {
                        success: true,
                        guard: guardResult,
                        firstClimber: true,
                        message: `🎉 ${player.name} 成为首登者！`
                    };
                }
            }
        }
        
        return {
            success: guardResult.success,
            guard: guardResult,
            message: guardResult.message
        };
    },
    
    // 判断是否触发激怒牌
    shouldTriggerProvoke(player) {
        // 特定层触发：第3层、第6层、第9层
        const provokeLevels = [3, 6, 9];
        return provokeLevels.includes(player.currentLevel);
    },
    
    // 检查守卫是否失守
    checkGuardDefeated(level) {
        const guard = this.guards[level - 1];
        return guard.currentGuardIndex >= guard.guardCards.length;
    },
    
    // 进入下一轮
    nextRound() {
        this.currentRound++;
        
        // 检查游戏结束条件
        const activePlayers = this.players.filter(p => !p.isEliminated);
        const allCardsUsed = activePlayers.every(p => 
            p.hand.every(c => c.used)
        );
        
        if (allCardsUsed) {
            this.gamePhase = 'ended';
            return this.calculateFinalScore();
        }
        
        return { round: this.currentRound };
    },
    
    // 计算最终得分
    calculateFinalScore() {
        const winner = this.firstClimber || this.players[0];
        
        const result = {
            players: this.players,
            winner: winner.name,
            totalRounds: this.currentRound,
            firstClimberRounds: this.firstClimber ? 
                this.players.find(p => p.isFirstClimber)?.currentRound : 0
        };
        
        return GameCore.calculateScore(result);
    }
};

// 连胜模式
const StreakMode = {
    config: {
        targetWins: 13,
        cardsPerGuard: 4,
        reusable: true
    },
    
    player: null,
    currentGuard: null,
    wins: 0,
    currentLevel: 1,
    
    init(playerName) {
        this.player = GameCore.initPlayer(playerName, true);
        this.wins = 0;
        this.currentLevel = 1;
        this.currentGuard = this.generateGuard();
        return this;
    },
    
    generateGuard() {
        const suits = ['♥', '♠', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const cards = [];
        
        for (let i = 0; i < this.config.cardsPerGuard; i++) {
            cards.push({
                suit: suits[Math.floor(Math.random() * suits.length)],
                rank: ranks[Math.floor(Math.random() * ranks.length)]
            });
        }
        
        return { cards, revealed: false };
    },
    
    play(cardIndex) {
        const card = this.player.hand[cardIndex];
        if (card.used) return { error: '已使用' };
        
        card.used = true;
        
        // 守卫亮牌
        const guardCard = this.currentGuard.cards[Math.floor(Math.random() * this.currentGuard.cards.length)];
        
        const match = card.suit === guardCard.suit || card.rank === guardCard.rank;
        
        if (match) {
            this.currentLevel++;
            this.wins++;
            
            if (this.currentLevel > 13) {
                const score = GameCore.calculateStreakScore(13);
                return {
                    success: true,
                    completed: true,
                    guardCard,
                    score,
                    message: `🎉 连胜13关！总得分: ${score.totalScore}`
                };
            }
            
            // 守卫牌失效并亮明
            this.currentGuard.revealed = true;
            this.currentGuard = this.generateGuard();
            
            return {
                success: true,
                guardCard,
                currentLevel: this.currentLevel,
                wins: this.wins,
                message: `✅ 闯关成功！第${this.currentLevel}层`
            };
        } else {
            const score = GameCore.calculateStreakScore(this.currentLevel - 1);
            return {
                success: false,
                guardCard,
                finalLevel: this.currentLevel,
                score,
                message: `❌ 闯关失败！到达第${this.currentLevel}层，得分: ${score.totalScore}`
            };
        }
    }
};

console.log('🎮 命运塔·首登者 - 新核心逻辑已加载');
console.log('📋 规则版本: 2026-03-06');
console.log('⚠️ 天命牌系统已移除');
