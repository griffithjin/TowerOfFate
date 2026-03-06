/**
 * 命运塔·首登者 - 管理后台数据模型
 * 用于数据统计、用户管理、运营分析
 */

const AdminDataModel = {
    // 用户数据
    users: {
        totalUsers: 0,          // 总用户数
        dailyActive: 0,         // 日活跃用户
        weeklyActive: 0,        // 周活跃用户
        monthlyActive: 0,       // 月活跃用户
        newUsersToday: 0,       // 今日新增
        retentionRate: 0,       // 留存率
        
        // 用户分层
        vipUsers: 0,            // VIP用户数
        payingUsers: 0,         // 付费用户数
        whaleUsers: 0,          // 大R用户数
        
        // 地域分布
        regions: {}
    },
    
    // 收入数据
    revenue: {
        totalRevenue: 0,        // 总收入
        todayRevenue: 0,        // 今日收入
        yesterdayRevenue: 0,    // 昨日收入
        weeklyRevenue: 0,       // 本周收入
        monthlyRevenue: 0,      // 本月收入
        
        // 收入来源
        bySource: {
            diamonds: 0,        // 钻石充值
            vip: 0,             // VIP购买
            skins: 0,           // 皮肤销售
            battlePass: 0,      // 战令
            tournament: 0       // 锦标赛
        },
        
        // ARPU
        arpu: 0,                // 每用户平均收入
        arppu: 0                // 每付费用户平均收入
    },
    
    // 游戏数据
    gameStats: {
        totalGames: 0,          // 总游戏场次
        todayGames: 0,          // 今日游戏场次
        
        // 模式分布
        byMode: {
            solo: 0,            // 个人赛
            team: 0,            // 团队战
            streak: 0,          // 连胜模式
            tournament: 0       // 锦标赛
        },
        
        // 胜率统计
        winRate: 0,             // 平均胜率
        averageLevel: 0,        // 平均到达层数
        firstClimberRate: 0     // 首登率
    },
    
    // 道具数据
    items: {
        totalSkins: 0,          // 皮肤总数
        totalEffects: 0,        // 特效总数
        
        // 热销商品
        topSelling: [],
        
        // 库存
        inventory: {}
    },
    
    // 锦标赛数据
    tournaments: {
        totalTournaments: 0,    // 总锦标赛数
        activeTournaments: 0,   // 进行中锦标赛
        
        // 参与人数
        participants: 0,
        
        // 奖池
        totalPrizePool: 0
    },
    
    // 实时监控
    realtime: {
        onlineUsers: 0,         // 当前在线
        gamesInProgress: 0,     // 进行中的游戏
        queueLength: 0          // 匹配队列长度
    }
};

// 数据埋点事件
const TrackingEvents = {
    // 用户行为
    USER_LOGIN: 'user_login',
    USER_REGISTER: 'user_register',
    USER_LOGOUT: 'user_logout',
    
    // 游戏行为
    GAME_START: 'game_start',
    GAME_END: 'game_end',
    LEVEL_UP: 'level_up',
    PROVOKE_TRIGGER: 'provoke_trigger',
    FIRST_CLIMBER: 'first_climber',
    
    // 付费行为
    PURCHASE_START: 'purchase_start',
    PURCHASE_SUCCESS: 'purchase_success',
    PURCHASE_FAIL: 'purchase_fail',
    
    // 社交行为
    FRIEND_ADD: 'friend_add',
    TEAM_FORM: 'team_form',
    CHAT_SEND: 'chat_send',
    
    // 锦标赛
    TOURNAMENT_REGISTER: 'tournament_register',
    TOURNAMENT_MATCH: 'tournament_match',
    TOURNAMENT_WIN: 'tournament_win'
};

// 数据上报
function trackEvent(eventName, params = {}) {
    const data = {
        event: eventName,
        timestamp: Date.now(),
        userId: getCurrentUserId(),
        sessionId: getSessionId(),
        params: params
    };
    
    // 发送到分析服务器
    sendToAnalytics(data);
    
    // 本地日志
    console.log('[Analytics]', eventName, params);
}

// 获取当前用户ID
function getCurrentUserId() {
    const user = localStorage.getItem('towerUser');
    return user ? JSON.parse(user).id : 'anonymous';
}

// 获取会话ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// 发送到分析服务器
function sendToAnalytics(data) {
    // 批量发送，每10条发送一次
    let queue = JSON.parse(localStorage.getItem('analyticsQueue') || '[]');
    queue.push(data);
    
    if (queue.length >= 10) {
        // 发送到服务器
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queue)
        }).catch(() => {
            // 发送失败，保留在队列中
        });
        
        queue = [];
    }
    
    localStorage.setItem('analyticsQueue', JSON.stringify(queue));
}

console.log('📊 管理后台数据模型已加载');
