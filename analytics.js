/**
 * 命运塔 - 数据埋点系统
 * 追踪用户行为，优化游戏体验
 */

class DataTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.userId = localStorage.getItem('userId') || this.generateUserId();
        
        this.init();
    }
    
    init() {
        // 保存用户ID
        localStorage.setItem('userId', this.userId);
        
        // 追踪页面加载
        this.trackEvent('page_load', {
            url: window.location.href,
            referrer: document.referrer,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
        
        // 追踪页面离开
        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_exit', {
                duration: Date.now() - this.startTime
            });
            this.sendEvents();
        });
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    trackEvent(eventName, properties = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            properties: properties
        };
        
        this.events.push(event);
        
        // 每10个事件发送一次
        if (this.events.length >= 10) {
            this.sendEvents();
        }
    }
    
    // 游戏相关追踪
    trackGameStart(mode) {
        this.trackEvent('game_start', { mode });
    }
    
    trackCardPlay(card, level) {
        this.trackEvent('card_play', {
            suit: card.suit,
            rank: card.rank,
            level: level
        });
    }
    
    trackProvokeTrigger(fallBack) {
        this.trackEvent('provoke_trigger', { fallBack });
    }
    
    trackLevelUp(fromLevel, toLevel) {
        this.trackEvent('level_up', { fromLevel, toLevel });
    }
    
    trackGameEnd(result, finalLevel) {
        this.trackEvent('game_end', { result, finalLevel });
    }
    
    // 商店相关追踪
    trackShopView(category) {
        this.trackEvent('shop_view', { category });
    }
    
    trackPurchase(itemId, itemName, price, currency) {
        this.trackEvent('purchase', {
            itemId,
            itemName,
            price,
            currency
        });
    }
    
    // 锦标赛相关追踪
    trackTournamentJoin(tournamentId, country) {
        this.trackEvent('tournament_join', { tournamentId, country });
    }
    
    trackTournamentResult(rank, score) {
        this.trackEvent('tournament_result', { rank, score });
    }
    
    // 发送事件到服务器
    sendEvents() {
        if (this.events.length === 0) return;
        
        const eventsToSend = [...this.events];
        this.events = [];
        
        // 发送到分析服务器
        fetch('https://analytics.toweroffate.com/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: eventsToSend }),
            keepalive: true
        }).catch(err => {
            // 如果发送失败，保存到localStorage稍后重试
            const failed = JSON.parse(localStorage.getItem('failedEvents') || '[]');
            failed.push(...eventsToSend);
            localStorage.setItem('failedEvents', JSON.stringify(failed));
        });
    }
}

// 创建全局实例
const tracker = new DataTracker();

// 导出
window.DataTracker = DataTracker;
window.tracker = tracker;
