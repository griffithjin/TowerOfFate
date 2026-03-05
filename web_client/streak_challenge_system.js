/**
 * 命运塔·首登者 - 连胜挑战核心逻辑系统 V5.0
 * 
 * 核心逻辑：
 * 1. 普通连胜模式：玩家连续比对守卫牌成功13次
 * 2. 守卫连胜模式：玩家成为守卫后连续成功防御13次
 * 
 * 胜利条件：
 * - 普通模式：连胜13次（与守卫牌比对成功）
 * - 守卫模式：成为守卫后，成功防御13次挑战
 * 
 * 失败条件：
 * - 任何时候比对失败，连胜立即清零
 */

class StreakChallengeSystem {
    constructor() {
        this.gameState = {
            mode: 'normal',           // 'normal' | 'guard'
            streak: 0,                // 当前连胜次数
            isGuard: false,           // 是否已成为守卫
            guardDefends: 0,          // 守卫防御次数（守卫模式用）
            bestRecord: 0,            // 最高连胜记录
            gameActive: true,         // 游戏是否进行中
            currentTower: null,       // 当前塔
            
            // 玩家状态
            playerLevel: 1,           // 当前层数（1-13）
            handCards: [],            // 手牌
            selectedCard: null,       // 选中的手牌索引
            
            // 对手状态
            aiLevel: 1,               // AI层数
            aiIsGuard: false,         // AI是否守卫
            aiStreak: 0,              // AI连胜
            
            // 游戏配置
            countdown: 15,
            gameLog: []
        };
        
        this.CONFIG = {
            TARGET_STREAK: 13,        // 目标连胜次数
            INITIAL_CARDS: 5,         // 初始手牌数
            MAX_CARDS: 18,            // 最大手牌数
            COUNTDOWN_TIME: 15        // 倒计时秒数
        };
        
        this.GAME_MODES = {
            normal: {
                name: '普通连胜',
                desc: '连续与守卫牌比对成功13次，失败即清零',
                type: 'climb',
                target: 13
            },
            guard: {
                name: '守卫连胜',
                desc: '成为守卫后连续成功防御13次挑战',
                type: 'defend',
                target: 13
            }
        };
    }
    
    // ==================== 初始化 ====================
    
    init() {
        this.loadBestRecord();
        this.selectRandomTower();
        this.generateInitialCards();
        this.initUI();
        this.startGame();
    }
    
    loadBestRecord() {
        const saved = localStorage.getItem('streakBestRecord');
        this.gameState.bestRecord = saved ? parseInt(saved) : 0;
    }
    
    saveBestRecord() {
        if (this.gameState.streak > this.gameState.bestRecord) {
            this.gameState.bestRecord = this.gameState.streak;
            localStorage.setItem('streakBestRecord', this.gameState.bestRecord);
        }
    }
    
    selectRandomTower() {
        const allTowers = [
            ...PixelTowerSystem.library.basic,
            ...PixelTowerSystem.library.rare,
            ...PixelTowerSystem.library.epic
        ];
        this.gameState.currentTower = allTowers[
            Math.floor(Math.random() * allTowers.length)
        ];
    }
    
    generateInitialCards() {
        this.gameState.handCards = this.generateUniqueCards(
            this.CONFIG.INITIAL_CARDS
        );
    }
    
    generateUniqueCards(count) {
        const suits = ['♥', '♦', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const cards = [];
        const used = new Set();
        
        while (cards.length < count && cards.length < 52) {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            const rank = ranks[Math.floor(Math.random() * ranks.length)];
            const key = suit + rank;
            
            if (!used.has(key)) {
                used.add(key);
                const color = (suit === '♥' || suit === '♦') ? '#d00' : '#000';
                cards.push({ suit, rank, color, id: cards.length });
            }
        }
        return cards;
    }
    
    // ==================== 游戏逻辑 ====================
    
    /**
     * 核心玩法：玩家出牌
     * @param {number} cardIndex - 手牌索引
     */
    playCard(cardIndex) {
        if (!this.gameState.gameActive) return { success: false, error: '游戏未开始' };
        if (cardIndex === null || cardIndex >= this.gameState.handCards.length) {
            return { success: false, error: '请选择手牌' };
        }
        
        const playerCard = this.gameState.handCards[cardIndex];
        
        // 根据模式执行不同逻辑
        if (this.gameState.mode === 'normal') {
            return this.playNormalMode(playerCard, cardIndex);
        } else {
            return this.playGuardMode(playerCard, cardIndex);
        }
    }
    
    /**
     * 普通连胜模式核心逻辑
     * 玩家与守卫牌比对，匹配成功则连胜+1
     */
    playNormalMode(playerCard, cardIndex) {
        // 生成守卫牌
        const guardCard = this.generateGuardCard();
        
        // 比对结果
        const isMatch = (playerCard.suit === guardCard.suit) || 
                       (playerCard.rank === guardCard.rank);
        
        // 移除使用的手牌
        this.gameState.handCards.splice(cardIndex, 1);
        
        if (isMatch) {
            // 匹配成功，连胜+1
            this.gameState.streak++;
            this.gameState.playerLevel = Math.min(this.gameState.streak + 1, 13);
            
            // 奖励新牌
            this.rewardNewCard();
            
            // 检查是否达成13连胜
            if (this.gameState.streak >= this.CONFIG.TARGET_STREAK) {
                this.handleVictory();
                return {
                    success: true,
                    match: true,
                    guardCard,
                    playerCard,
                    streak: this.gameState.streak,
                    victory: true,
                    message: `🎉 恭喜达成${this.CONFIG.TARGET_STREAK}连胜！`
                };
            }
            
            return {
                success: true,
                match: true,
                guardCard,
                playerCard,
                streak: this.gameState.streak,
                message: `✅ 匹配成功！连胜 ${this.gameState.streak}/${this.CONFIG.TARGET_STREAK}`
            };
        } else {
            // 匹配失败，连胜清零
            const oldStreak = this.gameState.streak;
            this.saveBestRecord();
            this.handleStreakBreak();
            
            return {
                success: true,
                match: false,
                guardCard,
                playerCard,
                streak: 0,
                oldStreak,
                gameOver: true,
                message: `❌ 匹配失败！连胜清零（之前${oldStreak}连胜）`
            };
        }
    }
    
    /**
     * 守卫连胜模式核心逻辑
     * 玩家先登顶成为守卫，然后防御13次挑战
     */
    playGuardMode(playerCard, cardIndex) {
        // 如果还不是守卫，先执行登顶逻辑
        if (!this.gameState.isGuard) {
            return this.playClimbToGuard(playerCard, cardIndex);
        }
        
        // 已经是守卫，执行防御逻辑
        return this.playGuardDefend(playerCard, cardIndex);
    }
    
    /**
     * 登顶成为守卫
     */
    playClimbToGuard(playerCard, cardIndex) {
        const guardCard = this.generateGuardCard();
        const isMatch = (playerCard.suit === guardCard.suit) || 
                       (playerCard.rank === guardCard.rank);
        
        this.gameState.handCards.splice(cardIndex, 1);
        
        if (isMatch) {
            this.gameState.streak++;
            this.gameState.playerLevel = Math.min(this.gameState.streak + 1, 13);
            this.rewardNewCard();
            
            // 检查是否登顶（13层）
            if (this.gameState.playerLevel >= 13) {
                this.gameState.isGuard = true;
                this.gameState.guardDefends = 0;
                
                return {
                    success: true,
                    match: true,
                    guardCard,
                    playerCard,
                    becomeGuard: true,
                    message: '🏰 你已登顶成为守卫！现在开始防御13次挑战！'
                };
            }
            
            return {
                success: true,
                match: true,
                guardCard,
                playerCard,
                streak: this.gameState.streak,
                message: `✅ 晋级！还需 ${13 - this.gameState.playerLevel} 层成为守卫`
            };
        } else {
            const oldStreak = this.gameState.streak;
            this.saveBestRecord();
            this.handleStreakBreak();
            
            return {
                success: true,
                match: false,
                guardCard,
                playerCard,
                streak: 0,
                oldStreak,
                gameOver: true,
                message: `❌ 晋级失败！连胜清零`
            };
        }
    }
    
    /**
     * 守卫防御逻辑
     */
    playGuardDefend(playerCard, cardIndex) {
        // AI随机出牌挑战
        const aiCard = this.generateGuardCard();
        
        // 比对结果（AI是否匹配玩家的守卫牌）
        const aiMatched = (aiCard.suit === playerCard.suit) || 
                         (aiCard.rank === playerCard.rank);
        
        this.gameState.handCards.splice(cardIndex, 1);
        
        if (!aiMatched) {
            // 防御成功
            this.gameState.guardDefends++;
            this.rewardNewCard();
            
            // 检查是否完成13次防御
            if (this.gameState.guardDefends >= this.CONFIG.TARGET_STREAK) {
                this.handleVictory();
                return {
                    success: true,
                    defend: true,
                    playerCard,
                    aiCard,
                    guardDefends: this.gameState.guardDefends,
                    victory: true,
                    message: `🎉 守卫成功！完成${this.CONFIG.TARGET_STREAK}次防御！`
                };
            }
            
            return {
                success: true,
                defend: true,
                playerCard,
                aiCard,
                guardDefends: this.gameState.guardDefends,
                message: `🛡️ 防御成功！${this.gameState.guardDefends}/${this.CONFIG.TARGET_STREAK}`
            };
        } else {
            // 防御失败，AI突破
            const oldDefends = this.gameState.guardDefends;
            this.handleStreakBreak();
            
            return {
                success: true,
                defend: false,
                playerCard,
                aiCard,
                guardDefends: 0,
                oldDefends,
                gameOver: true,
                message: `💀 防御失败！AI突破防线（之前防御${oldDefends}次）`
            };
        }
    }
    
    /**
     * 生成守卫牌
     */
    generateGuardCard() {
        const suits = ['♥', '♦', '♣', '♠'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return {
            suit: suits[Math.floor(Math.random() * suits.length)],
            rank: ranks[Math.floor(Math.random() * ranks.length)]
        };
    }
    
    /**
     * 奖励新牌
     */
    rewardNewCard() {
        if (this.gameState.handCards.length < this.CONFIG.MAX_CARDS) {
            const newCards = this.generateUniqueCards(1);
            const exists = this.gameState.handCards.some(c => 
                c.suit === newCards[0].suit && c.rank === newCards[0].rank
            );
            if (!exists) {
                this.gameState.handCards.push(newCards[0]);
                return true;
            }
        }
        return false;
    }
    
    // ==================== 游戏状态处理 ====================
    
    handleVictory() {
        this.saveBestRecord();
        this.gameState.gameActive = false;
    }
    
    handleStreakBreak() {
        this.gameState.streak = 0;
        this.gameState.guardDefends = 0;
        this.gameState.playerLevel = 1;
        this.gameState.isGuard = false;
        this.gameState.gameActive = false;
    }
    
    resetGame() {
        this.gameState.streak = 0;
        this.gameState.guardDefends = 0;
        this.gameState.playerLevel = 1;
        this.gameState.isGuard = false;
        this.gameState.gameActive = true;
        this.gameState.handCards = this.generateUniqueCards(
            this.CONFIG.INITIAL_CARDS
        );
        this.selectRandomTower();
    }
    
    // ==================== UI 更新 ====================
    
    initUI() {
        // 由具体页面实现
    }
    
    startGame() {
        // 由具体页面实现
    }
}

// 导出
window.StreakChallengeSystem = StreakChallengeSystem;
