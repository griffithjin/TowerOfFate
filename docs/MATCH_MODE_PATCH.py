"""
命运塔·首登者 - 匹配模式切换补丁
添加到 index.html 的 JavaScript 部分
"""

# 添加匹配模式配置（在 script 标签内添加）
MATCH_MODE_CONFIG = '''
// 匹配模式配置 - 支持AI/真人切换
const MATCH_MODE = {
    AI_ONLY: 'ai_only',      // 1vs3AI - 测试模式
    PVP: 'pvp',              // 1vs3真人 - 在线模式
    PVP_RANKED: 'pvp_ranked' // 排位赛
};

let currentMatchMode = MATCH_MODE.AI_ONLY; // 默认AI模式
let matchStatus = null;

// 匹配系统API
const MatchAPI = {
    // 获取可用模式
    getAvailableModes: async () => {
        try {
            const response = await fetch('/api/match/modes');
            return await response.json();
        } catch (e) {
            // 如果服务器不可用，返回默认模式
            return {
                success: true,
                modes: [
                    { mode: 'ai_only', name: '人机对战', description: '1名玩家 vs 3个AI', enabled: true },
                    { mode: 'pvp', name: '快速匹配', description: '4名真人玩家', enabled: false },
                    { mode: 'pvp_ranked', name: '排位赛', description: '段位匹配', enabled: false }
                ]
            };
        }
    },
    
    // 开始匹配
    startMatchmaking: async (mode, playerId, nickname) => {
        try {
            const response = await fetch('/api/match/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode, player_id: playerId, nickname })
            });
            return await response.json();
        } catch (e) {
            // 离线模式 - 直接开始AI对战
            if (mode === MATCH_MODE.AI_ONLY) {
                return {
                    success: true,
                    message: '开始人机对战',
                    match_id: 'offline_' + Date.now(),
                    is_ai_match: true,
                    players: [
                        { player_id: playerId, nickname: nickname, is_ai: false },
                        { player_id: 'ai_1', nickname: 'AI战士', is_ai: true },
                        { player_id: 'ai_2', nickname: 'AI法师', is_ai: true },
                        { player_id: 'ai_3', nickname: 'AI刺客', is_ai: true }
                    ]
                };
            }
            return { success: false, error: '服务器连接失败' };
        }
    },
    
    // 取消匹配
    cancelMatchmaking: async (playerId) => {
        try {
            const response = await fetch('/api/match/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: playerId })
            });
            return await response.json();
        } catch (e) {
            return { success: true };
        }
    },
    
    // 切换模式（管理员/开发用）
    switchMode: async (fromMode, toMode) => {
        try {
            const response = await fetch('/api/match/switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: fromMode, to: toMode })
            });
            const result = await response.json();
            if (result.success) {
                currentMatchMode = toMode;
            }
            return result;
        } catch (e) {
            return { success: false, error: '切换失败' };
        }
    }
};

// 显示模式选择器
function showModeSelector() {
    const selector = document.createElement('div');
    selector.id = 'modeSelector';
    selector.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;">
            <div style="background:linear-gradient(135deg,#1a1a3e,#0d1b2a);padding:30px;border-radius:15px;max-width:400px;width:90%;border:2px solid #ffd700;">
                <h2 style="color:#ffd700;text-align:center;margin-bottom:20px;">🎮 选择匹配模式</h2>
                <div id="modeOptions" style="display:flex;flex-direction:column;gap:15px;">
                    <!-- 动态生成 -->
                </div>
                <div style="margin-top:20px;text-align:center;color:#888;font-size:12px;">
                    当前模式: <span id="currentModeDisplay" style="color:#0ff;">人机对战</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(selector);
    
    // 加载可用模式
    loadModeOptions();
}

// 加载模式选项
async function loadModeOptions() {
    const result = await MatchAPI.getAvailableModes();
    const container = document.getElementById('modeOptions');
    
    if (result.success) {
        container.innerHTML = result.modes.map(mode => `
            <div onclick="selectMatchMode('${mode.mode}')" 
                 style="padding:15px;background:${mode.enabled ? 'rgba(255,215,0,0.1)' : 'rgba(100,100,100,0.2)'};border:2px solid ${mode.enabled ? '#ffd700' : '#666'};border-radius:10px;cursor:${mode.enabled ? 'pointer' : 'not-allowed'};opacity:${mode.enabled ? 1 : 0.5};">
                <div style="font-size:18px;color:#ffd700;font-weight:bold;">${mode.name}</div>
                <div style="font-size:13px;color:#888;margin-top:5px;">${mode.description}</div>
                ${!mode.enabled ? '<div style="font-size:12px;color:#f00;margin-top:5px;">⏳ 即将开放</div>' : ''}
            </div>
        `).join('');
    }
}

// 选择匹配模式
async function selectMatchMode(mode) {
    const modeNames = {
        'ai_only': '人机对战',
        'pvp': '快速匹配',
        'pvp_ranked': '排位赛'
    };
    
    currentMatchMode = mode;
    
    // 更新显示
    const display = document.getElementById('currentModeDisplay');
    if (display) display.textContent = modeNames[mode] || mode;
    
    // 关闭选择器
    const selector = document.getElementById('modeSelector');
    if (selector) selector.remove();
    
    // 提示
    if (mode === 'ai_only') {
        showNotification('✅ 已切换到人机对战模式', 'success');
    } else {
        showNotification('✅ 已切换到' + modeNames[mode] + '模式', 'success');
    }
    
    // 保存到本地存储
    localStorage.setItem('matchMode', mode);
}

// 修改原有的 startGame 函数
async function startGameWithMode() {
    const playerId = localStorage.getItem('playerId') || 'guest_' + Date.now();
    const nickname = localStorage.getItem('nickname') || '游客';
    
    // 显示加载
    showLoading('正在匹配...');
    
    // 开始匹配
    const result = await MatchAPI.startMatchmaking(currentMatchMode, playerId, nickname);
    
    hideLoading();
    
    if (result.success) {
        matchStatus = result;
        
        if (result.is_ai_match) {
            // AI对战 - 直接进入游戏
            showNotification('🎮 人机对战开始！', 'success');
            initGame(result.players);
        } else {
            // 真人匹配 - 显示等待界面
            showMatchWaiting(result);
        }
    } else {
        showNotification('❌ ' + result.error, 'error');
    }
}

// 显示匹配等待界面
function showMatchWaiting(matchInfo) {
    const waiting = document.createElement('div');
    waiting.id = 'matchWaiting';
    waiting.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:flex;align-items:center;justify-content:center;">
            <div style="text-align:center;">
                <div style="font-size:48px;margin-bottom:20px;">⏳</div>
                <h2 style="color:#ffd700;margin-bottom:10px;">正在匹配对手...</h2>
                <p style="color:#888;">预计等待时间: ${matchInfo.estimated_wait || 30}秒</p>
                <p style="color:#888;">当前排队位置: ${matchInfo.queue_position || 1}</p>
                <button onclick="cancelMatching()" style="margin-top:30px;padding:10px 30px;background:#f00;color:#fff;border:none;border-radius:5px;cursor:pointer;">取消匹配</button>
            </div>
        </div>
    `;
    document.body.appendChild(waiting);
    
    // 模拟匹配成功（实际应该轮询服务器）
    setTimeout(() => {
        if (document.getElementById('matchWaiting')) {
            waiting.remove();
            showNotification('✅ 匹配成功！', 'success');
            initGame(matchInfo.players);
        }
    }, 5000);
}

// 取消匹配
async function cancelMatching() {
    const playerId = localStorage.getItem('playerId') || 'guest';
    await MatchAPI.cancelMatchmaking(playerId);
    
    const waiting = document.getElementById('matchWaiting');
    if (waiting) waiting.remove();
    
    showNotification('已取消匹配', 'info');
}

// 初始化时加载保存的模式
function initMatchMode() {
    const savedMode = localStorage.getItem('matchMode');
    if (savedMode) {
        currentMatchMode = savedMode;
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatchMode);
} else {
    initMatchMode();
}
'''

# UI元素添加 - 在合适的位置添加模式切换按钮
MODE_SWITCHER_UI = '''
<!-- 匹配模式切换按钮 - 添加到主菜单 -->
<div class="mode-switcher" style="position:fixed;top:10px;right:10px;z-index:100;">
    <button onclick="showModeSelector()" 
            style="padding:8px 16px;background:linear-gradient(135deg,#ffd700,#ff6b6b);border:none;border-radius:20px;color:#000;font-weight:bold;cursor:pointer;display:flex;align-items:center;gap:5px;">
        <span>🎮</span>
        <span id="currentModeBtn">人机对战</span>
    </button>
</div>
'''

# 修改游戏开始按钮的处理
MODIFIED_START_HANDLER = '''
// 修改原有的立即游戏按钮处理
// 将原有的 onclick="startGame()" 改为:
document.getElementById('startGameBtn').onclick = startGameWithMode;
'''

print("匹配模式切换补丁代码已生成")
print("需要添加到 index.html 的以下位置:")
print("1. 在 <script> 标签内添加 MATCH_MODE_CONFIG")
print("2. 在 body 内添加 MODE_SWITCHER_UI")
print("3. 修改 startGame 按钮的处理函数")
