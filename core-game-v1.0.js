/**
 * 命运塔·首登者 V1.0 - 核心游戏逻辑
 * First Ascender - Core Game Logic
 * 
 * 基于金先生 2026-03-05 定义的主逻辑:
 * - 4副牌 208张
 * - 13守卫 × (13张守卫牌 + 3张激怒牌)
 * - 首登者系统
 * - 团队战/个人战/连胜模式
 */

// ============================================
// 常量定义
// ============================================
const CONSTANTS = {
    // 牌组
    SUITS: ['♥', '♦', '♣', '♠'],
    RANKS: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
    DECKS_PER_GAME: 4,           // 4副牌
    TOTAL_CARDS: 208,            // 208张牌
    
    // 守卫
    GUARD_COUNT: 13,             // 13名守卫
    GUARD_CARDS: 13,             // 每名守卫13张牌
    PROVOCATION_CARDS: 3,        // 每名守卫3张激怒牌
    
    // 层级
    LEVELS: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    MAX_LEVEL: 13,               // 最高层A层
    
    // 激怒牌使用层
    ACTIVE_PROVOCATION_LEVELS: [3, 6, 9],
    
    // 游戏模式
    MODES: {
        SOLO: 'solo',            // 个人赛
        TEAM: 'team',            // 团队赛
        STREAK: 'streak'         // 连胜模式
    },
    
    // 积分
    BASE_SCORE_WIN: 200,
    BASE_SCORE_LOSE: -200,
    TOTAL_SCORE_POOL: 800
};

// ============================================
// 卡牌工具类
// ============================================
class CardUtils {
    // 生成卡牌唯一标识
    static getCardId(suit, rank) {
        return `${suit}${rank}`;
    }
    
    // 获取卡牌颜色
    static getCardColor(suit) {
        return (suit === '♥' || suit === '♦') ? 'red' : 'black';
    }
    
    // 生成单副牌
    static generateDeck() {
        const deck = [];
        for (const suit of CONSTANTS.SUITS) {
            for (const rank of CONSTANTS.RANKS) {
                deck.push({
                    suit,
                    rank,
                    id: this.getCardId(suit, rank),
                    color: this.getCardColor(suit)
                });
            }
        }
        return deck;
    }
    
    // 生成4副牌并洗牌
    static generateGameDeck() {
        let deck = [];
        for (let i = 0; i < CONSTANTS.DECKS_PER_GAME; i++) {
            deck = deck.concat(this.generateDeck());
        }
        return this.shuffle(deck);
    }
    
    // 洗牌算法 (Fisher-Yates)
    static shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    // 比对卡牌：点数相同或花色相同
    static isMatch(card1, card2) {
        return card1.suit === card2.suit || card1.rank === card2.rank;
    }
    
    // 完全匹配：点数和花色都相同
    static isExactMatch(card1, card2) {
        return card1.suit === card2.suit && card1.rank === card2.rank;
    }
    
    // 获取层名
    static getLevelName(level) {
        if (level >= 1 && level <= CONSTANTS.MAX_LEVEL) {
            return CONSTANTS.LEVELS[level - 1];
        }
        return '?';
    }
}

// ============================================
// 守卫类
// ============================================
class Guard {
    constructor(level, allCards) {
        this.level = level;
        this.levelName = CardUtils.getLevelName(level);
        
        // 从总牌库中抽取
        this.guardCards = allCards.splice(0, CONSTANTS.GUARD_CARDS);
        this.provocationCards = allCards.splice(0, CONSTANTS.PROVOCATION_CARDS);
        
        // 明牌展示激怒牌
        this.revealedProvocation = [...this.provocationCards];
        
        // 已使用的牌
        this.usedGuardCards = [];
        this.usedProvocationCards = [];
        
        // 守卫状态
        this.isDefeated = false;
    }
    
    // 获取下一张守卫牌
    drawGuardCard() {
        if (this.guardCards.length === 0) return null;
        const card = this.guardCards.shift();
        this.usedGuardCards.push(card);
        return card;
    }
    
    // 使用激怒牌 (由玩家/首登者选择)
    useProvocationCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.provocationCards.length) return null;
        const card = this.provocationCards.splice(cardIndex, 1)[0];
        this.usedProvocationCards.push(card);
        return card;
    }
    
    // 随机使用激怒牌
    useRandomProvocation() {
        if (this.provocationCards.length === 0) return null;
        const index = Math.floor(Math.random() * this.provocationCards.length);
        return this.useProvocationCard(index);
    }
    
    // 检查是否失守
    checkDefeated() {
        if (this.guardCards.length === 0 && this.provocationCards.length === 0) {
            this.isDefeated = true;
        }
        return this.isDefeated;
    }
    
    // 重新激活守卫 (作为出发层)
    reactivate() {
        this.guardCards = [...this.usedGuardCards];
        this.provocationCards = [...this.usedProvocationCards];
        this.usedGuardCards = [];
        this.usedProvocationCards = [];
        this.isDefeated = false;
    }
    
    // 获取剩余牌数
    getRemainingCount() {
        return this.guardCards.length + this.provocationCards.length;
    }
}

// ============================================
// 玩家类
// ============================================
class Player {
    constructor(id, name, isAI = false) {
        this.id = id;
        this.name = name;
        this.isAI = isAI;
        
        // 游戏状态
        this.level = 1;                    // 当前所在层
        this.startLevel = 1;               // 出发层
        this.handCards = [];               // 手牌
        this.playedCards = [];             // 已出牌
        
        // 首登者状态
        this.isFirstAscender = false;      // 是否是首登者
        this.controlledGuard = null;       // 控制的守卫层
        
        // 游戏结果
        this.hasReachedTop = false;        // 是否登顶
        this.isEliminated = false;         // 是否被淘汰
        
        // 统计
        this.roundsPlayed = 0;             // 出过的轮数
        this.provocationHits = 0;          // 被激怒牌击中次数
        this.cardsGifted = 0;              // 赠予队友的牌数
    }
    
    // 初始化手牌 (完整52张)
    initHandCards() {
        this.handCards = CardUtils.generateDeck();
        this.playedCards = [];
    }
    
    // 出牌
    playCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.handCards.length) return null;
        const card = this.handCards.splice(cardIndex, 1)[0];
        this.playedCards.push(card);
        this.roundsPlayed++;
        return card;
    }
    
    // 被激怒牌影响
    applyProvocationEffect(provocationCard, playerCard) {
        // 完全匹配退2层
        if (CardUtils.isExactMatch(provocationCard, playerCard)) {
            return { retreat: 2, type: 'exact' };
        }
        // 点数或花色匹配退1层
        if (CardUtils.isMatch(provocationCard, playerCard)) {
            return { retreat: 1, type: 'partial' };
        }
        return { retreat: 0, type: 'none' };
    }
    
    // 回退层数
    retreatLayers(count) {
        const newLevel = Math.max(this.startLevel, this.level - count);
        const actualRetreat = this.level - newLevel;
        this.level = newLevel;
        return actualRetreat;
    }
    
    // 前进层数
    advanceLayer() {
        if (this.level < CONSTANTS.MAX_LEVEL) {
            this.level++;
            return true;
        }
        this.hasReachedTop = true;
        return false;
    }
    
    // 设置出发层
    setStartLevel(level) {
        this.startLevel = level;
        if (this.level < level) {
            this.level = level;
        }
    }
    
    // 赠牌给队友
    giftCardsToTeammate(count) {
        const giftCount = Math.min(count, this.handCards.length);
        const gifted = this.handCards.splice(0, giftCount);
        this.cardsGifted += giftCount;
        return gifted;
    }
    
    // 接收赠牌
    receiveCards(cards) {
        this.handCards = this.handCards.concat(cards);
    }
    
    // 检查手牌是否耗尽
    isOutOfCards() {
        return this.handCards.length === 0;
    }
    
    // 成为首登者
    becomeFirstAscender(guard) {
        this.isFirstAscender = true;
        this.controlledGuard = guard;
        guard.reactivate();
        return true;
    }
    
    // 放弃首登者身份
    relinquishFirstAscender() {
        this.isFirstAscender = false;
        this.controlledGuard = null;
    }
}

// ============================================
// 游戏主类
// ============================================
class FirstAscenderGame {
    constructor(mode = CONSTANTS.MODES.SOLO, players = []) {
        this.mode = mode;
        this.players = players;
        this.guards = [];
        
        // 游戏状态
        this.state = 'waiting';            // waiting, playing, ended
        this.currentRound = 0;
        this.firstAscender = null;         // 首登者
        this.highestDefeatedLevel = 0;     // 最高失守层
        
        // 牌库
        this.gameDeck = [];
        
        // 回合控制
        this.currentPlayerIndex = 0;
        this.roundStartTime = null;
    }
    
    // 初始化游戏
    init() {
        // 生成游戏牌库
        this.gameDeck = CardUtils.generateGameDeck();
        
        // 创建守卫
        for (let i = 1; i <= CONSTANTS.GUARD_COUNT; i++) {
            this.guards.push(new Guard(i, this.gameDeck));
        }
        
        // 初始化玩家手牌
        for (const player of this.players) {
            player.initHandCards();
        }
        
        // 设置游戏状态
        this.state = 'playing';
        this.currentRound = 1;
        this.roundStartTime = Date.now();
        
        return true;
    }
    
    // 获取当前层守卫
    getGuardAtLevel(level) {
        return this.guards[level - 1];
    }
    
    // 检查是否触发激怒牌
    shouldTriggerProvocation(player, guard) {
        // 3/6/9层守卫主动防御
        if (CONSTANTS.ACTIVE_PROVOCATION_LEVELS.includes(guard.level)) {
            return true;
        }
        // 其他守卫：玩家低于本层3层时随机触发
        if (player.level < guard.level - 3) {
            return Math.random() < 0.3; // 30%概率
        }
        return false;
    }
    
    // 处理玩家回合
    processPlayerTurn(player, cardIndex) {
        if (this.state !== 'playing') return { error: '游戏未开始' };
        if (player.isEliminated) return { error: '玩家已淘汰' };
        
        // 玩家出牌
        const playedCard = player.playCard(cardIndex);
        if (!playedCard) return { error: '出牌失败' };
        
        // 获取当前层守卫
        const guard = this.getGuardAtLevel(player.level);
        let guardCard = null;
        
        // 首登者控制的情况
        if (this.firstAscender && this.firstAscender.controlledGuard === guard) {
            // 首登者选择守卫牌
            guardCard = this.firstAscenderSelectCard(guard);
        } else {
            // 正常守卫出牌
            guardCard = guard.drawGuardCard();
        }
        
        // 检查守卫是否失守
        if (guard.checkDefeated()) {
            this.highestDefeatedLevel = Math.max(this.highestDefeatedLevel, guard.level);
        }
        
        // 比对结果
        const isMatch = CardUtils.isMatch(playedCard, guardCard);
        let result = {
            player,
            playedCard,
            guardCard,
            isMatch,
            provocationTriggered: false,
            retreatLayers: 0
        };
        
        // 匹配成功则前进
        if (isMatch) {
            player.advanceLayer();
            
            // 检查是否登顶成为首登者
            if (player.hasReachedTop && !this.firstAscender) {
                this.firstAscender = player;
                player.becomeFirstAscender(guard);
                result.becameFirstAscender = true;
            }
        }
        
        // 检查激怒牌
        if (this.shouldTriggerProvocation(player, guard)) {
            const provocationCard = guard.useRandomProvocation();
            if (provocationCard) {
                result.provocationTriggered = true;
                result.provocationCard = provocationCard;
                
                const effect = player.applyProvocationEffect(provocationCard, playedCard);
                if (effect.retreat > 0) {
                    result.retreatLayers = player.retreatLayers(effect.retreat);
                    result.provocationEffect = effect;
                    player.provocationHits++;
                }
            }
        }
        
        // 检查游戏结束条件
        this.checkGameEnd();
        
        return result;
    }
    
    // 首登者选择守卫牌 (AI策略或玩家操作)
    firstAscenderSelectCard(guard) {
        // 简单策略：随机选择
        // 实际游戏中由首登者玩家选择
        if (guard.guardCards.length > 0) {
            const index = Math.floor(Math.random() * guard.guardCards.length);
            const card = guard.guardCards.splice(index, 1)[0];
            guard.usedGuardCards.push(card);
            return card;
        }
        return null;
    }
    
    // 检查游戏结束
    checkGameEnd() {
        const activePlayers = this.players.filter(p => !p.isEliminated);
        
        // 个人赛结束条件
        if (this.mode === CONSTANTS.MODES.SOLO) {
            // 所有人手牌耗尽或有人成为首登者并成功防守
            const allOutOfCards = activePlayers.every(p => p.isOutOfCards());
            if (allOutOfCards) {
                this.state = 'ended';
                return true;
            }
        }
        
        // 团队赛结束条件
        if (this.mode === CONSTANTS.MODES.TEAM) {
            // 一队全员登顶或全员淘汰
            // 简化版：检查是否所有活跃玩家都来自同一队伍
        }
        
        return false;
    }
    
    // 计算积分
    calculateScores() {
        const scores = [];
        const winner = this.determineWinner();
        
        for (const player of this.players) {
            let score = winner === player ? CONSTANTS.BASE_SCORE_WIN : CONSTANTS.BASE_SCORE_LOSE;
            
            // 计算贡献度
            const contributions = this.calculateContributions(player);
            const contributionScore = contributions * CONSTANTS.TOTAL_SCORE_POOL / 100;
            
            score += winner === player ? contributionScore : -contributionScore;
            
            scores.push({
                player: player.name,
                score: Math.round(score),
                contributions: {
                    climbSuccess: contributions.climbSuccess,
                    teamSupport: contributions.teamSupport,
                    defenseContribution: contributions.defenseContribution
                }
            });
        }
        
        return scores;
    }
    
    // 计算玩家贡献度
    calculateContributions(player) {
        // 闯层成功率
        const climbSuccess = player.hasReachedTop ? 100 : (player.level / CONSTANTS.MAX_LEVEL) * 100;
        
        // 队友贡献 (赠牌数量)
        const teamSupport = Math.min(100, player.cardsGifted * 5);
        
        // 守层贡献 (首登者防守)
        const defenseContribution = player.isFirstAscender ? 100 : 0;
        
        return {
            total: (climbSuccess + teamSupport + defenseContribution) / 3,
            climbSuccess,
            teamSupport,
            defenseContribution
        };
    }
    
    // 确定胜者
    determineWinner() {
        // 首登者且成功防守
        if (this.firstAscender) {
            const activePlayers = this.players.filter(p => !p.isEliminated && p !== this.firstAscender);
            if (activePlayers.every(p => p.isOutOfCards())) {
                return this.firstAscender;
            }
        }
        
        // 唯一存活者
        const activePlayers = this.players.filter(p => !p.isEliminated);
        if (activePlayers.length === 1) {
            return activePlayers[0];
        }
        
        return null;
    }
}

// ============================================
// 连胜模式 (简化版)
// ============================================
class StreakModeGame {
    constructor() {
        this.streakCount = 0;
        this.maxStreak = 13;
        this.currentLevel = 1;
        this.score = 0;
        this.handCards = [];
        this.revealedGuardCards = []; // 已亮明的守卫牌
    }
    
    // 初始化
    init() {
        this.streakCount = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.handCards = CardUtils.generateDeck();
        this.revealedGuardCards = [];
        return true;
    }
    
    // 生成守卫牌 (每层从52张中抽4张，可重复)
    generateGuardCardsForLevel() {
        const deck = CardUtils.generateDeck();
        return CardUtils.shuffle(deck).slice(0, 4);
    }
    
    // 处理回合
    playTurn(cardIndex) {
        if (this.handCards.length === 0) return { error: '手牌耗尽' };
        if (cardIndex < 0 || cardIndex >= this.handCards.length) return { error: '无效牌' };
        
        const playedCard = this.handCards.splice(cardIndex, 1)[0];
        const guardCards = this.generateGuardCardsForLevel();
        const guardCard = guardCards[Math.floor(Math.random() * guardCards.length)];
        
        // 守卫牌亮明并失效
        this.revealedGuardCards.push(...guardCards);
        
        const isMatch = CardUtils.isMatch(playedCard, guardCard);
        
        if (isMatch) {
            this.streakCount++;
            this.currentLevel++;
            this.score += this.calculateLevelScore(this.currentLevel - 1);
            
            if (this.currentLevel > this.maxStreak) {
                return { success: true, victory: true, score: this.score };
            }
            
            return { success: true, streak: this.streakCount, score: this.score };
        } else {
            // 连胜中断
            const finalScore = this.score;
            return { success: false, finalScore, streak: this.streakCount };
        }
    }
    
    // 计算层分数
    calculateLevelScore(level) {
        if (level < 3) return 0;
        if (level === 3) return 50;
        // 50 + (4+5+...+level)*10
        let sum = 0;
        for (let i = 4; i <= level; i++) {
            sum += i;
        }
        return 50 + sum * 10;
    }
    
    // 获取总分数 (包含当日随机激励)
    getFinalScore() {
        const dailyBonus = Math.floor(Math.random() * 901) + 100; // 100-1000
        return this.score + (this.streakCount >= 13 ? dailyBonus : 0);
    }
}

// ============================================
// 导出模块
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONSTANTS,
        CardUtils,
        Guard,
        Player,
        FirstAscenderGame,
        StreakModeGame
    };
}
