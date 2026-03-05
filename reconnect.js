// reconnect.js - 断线重连机制
// 提供网络状态监测和自动重连功能

class ConnectionManager {
    constructor(options = {}) {
        this.options = {
            maxReconnectAttempts: 5,
            reconnectInterval: 3000,
            heartbeatInterval: 30000,
            ...options
        };
        
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.heartbeatTimer = null;
        this.gameState = null; // 保存游戏状态
        this.messageQueue = []; // 断网期间的消息队列
        
        this.init();
    }

    init() {
        // 监听网络状态
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isConnected) {
                this.reconnect();
            }
        });
        
        // 初始化连接
        this.connect();
    }

    connect() {
        try {
            // WebSocket连接
            const wsUrl = this.options.wsUrl || 'wss://api.toweroffate.com/ws';
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => this.onOpen();
            this.ws.onclose = () => this.onClose();
            this.ws.onerror = (error) => this.onError(error);
            this.ws.onmessage = (event) => this.onMessage(event);
            
        } catch (error) {
            console.error('WebSocket连接失败:', error);
            this.scheduleReconnect();
        }
    }

    onOpen() {
        console.log('WebSocket连接成功');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // 恢复游戏状态
        if (this.gameState) {
            this.restoreGameState();
        }
        
        // 发送队列中的消息
        this.flushMessageQueue();
        
        // 启动心跳
        this.startHeartbeat();
        
        // 触发连接成功事件
        this.emit('connected');
    }

    onClose() {
        console.log('WebSocket连接关闭');
        this.isConnected = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
        this.emit('disconnected');
    }

    onError(error) {
        console.error('WebSocket错误:', error);
        this.emit('error', error);
    }

    onMessage(event) {
        try {
            const data = JSON.parse(event.data);
            this.emit('message', data);
        } catch (error) {
            console.error('消息解析错误:', error);
        }
    }

    onOnline() {
        console.log('网络已恢复');
        this.showNotification('🌐 网络已恢复', 'success');
        if (!this.isConnected) {
            this.reconnect();
        }
    }

    onOffline() {
        console.log('网络已断开');
        this.showNotification('⚠️ 网络已断开，正在保存游戏状态...', 'warning');
        this.saveGameState();
        this.isConnected = false;
    }

    reconnect() {
        if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            this.showNotification('❌ 连接失败，请刷新页面重试', 'error');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`第${this.reconnectAttempts}次重连...`);
        
        this.showNotification(`🔄 正在重新连接(${this.reconnectAttempts}/${this.options.maxReconnectAttempts})...`, 'info');
        
        setTimeout(() => {
            this.connect();
        }, this.options.reconnectInterval);
    }

    scheduleReconnect() {
        if (navigator.onLine) {
            this.reconnect();
        }
    }

    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send({ type: 'heartbeat', time: Date.now() });
            }
        }, this.options.heartbeatInterval);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    send(data) {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            // 离线时加入队列
            this.messageQueue.push(data);
            console.log('消息已加入队列:', data);
        }
    }

    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            this.send(msg);
        }
    }

    // 保存游戏状态到本地
    saveGameState() {
        const state = {
            timestamp: Date.now(),
            gameId: window.gameId,
            playerState: window.playerState,
            handCards: window.handCards,
            currentLevel: window.currentLevel,
            round: window.round
        };
        
        localStorage.setItem('gameState_backup', JSON.stringify(state));
        this.gameState = state;
        console.log('游戏状态已保存');
    }

    // 恢复游戏状态
    restoreGameState() {
        const saved = localStorage.getItem('gameState_backup');
        if (saved) {
            const state = JSON.parse(saved);
            
            // 向服务器请求恢复
            this.send({
                type: 'restore_game',
                gameId: state.gameId,
                timestamp: state.timestamp
            });
            
            console.log('正在恢复游戏状态...');
            this.showNotification('🎮 正在恢复游戏...', 'info');
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 100000;
            animation: slideDown 0.3s ease;
            ${type === 'success' ? 'background: #2ed573; color: #000;' : ''}
            ${type === 'warning' ? 'background: #f39c12; color: #000;' : ''}
            ${type === 'error' ? 'background: #e74c3c; color: #fff;' : ''}
            ${type === 'info' ? 'background: #3498db; color: #fff;' : ''}
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 事件系统
    emit(eventName, data) {
        const event = new CustomEvent(`connection:${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }

    on(eventName, callback) {
        window.addEventListener(`connection:${eventName}`, (e) => callback(e.detail));
    }

    // 断开连接
    disconnect() {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
        }
    }
}

// 网络状态监测
class NetworkMonitor {
    constructor() {
        this.latency = 0;
        this.isStable = true;
        this.init();
    }

    init() {
        // 定期检测网络延迟
        setInterval(() => this.checkLatency(), 10000);
        
        // 监听网络变化
        window.addEventListener('online', () => {
            console.log('网络已连接');
            this.isStable = true;
        });
        
        window.addEventListener('offline', () => {
            console.log('网络已断开');
            this.isStable = false;
        });
    }

    async checkLatency() {
        const start = Date.now();
        try {
            // 发送ping请求
            await fetch('/api/ping', { method: 'HEAD', cache: 'no-cache' });
            this.latency = Date.now() - start;
            
            // 根据延迟判断网络质量
            if (this.latency > 500) {
                this.isStable = false;
                this.showNetworkWarning('网络延迟较高，请检查网络');
            } else {
                this.isStable = true;
            }
        } catch (error) {
            this.isStable = false;
        }
    }

    showNetworkWarning(message) {
        // 如果已经有警告则不重复显示
        if (document.querySelector('.network-warning')) return;
        
        const warning = document.createElement('div');
        warning.className = 'network-warning';
        warning.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 193, 7, 0.9);
            color: #000;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 99999;
        `;
        warning.textContent = `⚠️ ${message}`;
        
        document.body.appendChild(warning);
        
        setTimeout(() => warning.remove(), 5000);
    }
}

// 初始化
window.ConnectionManager = ConnectionManager;
window.NetworkMonitor = NetworkMonitor;

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.connManager = new ConnectionManager();
    window.networkMonitor = new NetworkMonitor();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
