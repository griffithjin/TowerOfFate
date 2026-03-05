// announcement.js - 系统公告栏组件
// 使用方法：在页面中引入 <script src="announcement.js"></script>

(function() {
    'use strict';

    // 公告数据
    const announcements = [
        {
            id: 1,
            type: 'event',
            icon: '🎉',
            title: '新用户福利',
            content: '注册即送188钻石+新手大礼包！',
            link: 'register-v2.html',
            startTime: '2025-03-01',
            endTime: '2025-12-31',
            priority: 1
        },
        {
            id: 2,
            type: 'update',
            icon: '📢',
            title: '版本更新',
            content: 'v1.0.0正式上线！新增4种游戏模式',
            link: null,
            startTime: '2025-03-05',
            endTime: '2025-03-12',
            priority: 2
        },
        {
            id: 3,
            type: 'maintenance',
            icon: '🔧',
            title: '维护通知',
            content: '3月10日凌晨2:00-4:00系统维护',
            link: null,
            startTime: '2025-03-08',
            endTime: '2025-03-10',
            priority: 3
        }
    ];

    // 创建公告栏样式
    const style = document.createElement('style');
    style.textContent = `
        .announcement-bar {
            background: linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05));
            border-bottom: 1px solid rgba(255,215,0,0.3);
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            position: relative;
            overflow: hidden;
        }
        .announcement-bar.event { background: linear-gradient(90deg, rgba(255,107,107,0.15), rgba(255,107,107,0.05)); border-color: rgba(255,107,107,0.3); }
        .announcement-bar.update { background: linear-gradient(90deg, rgba(78,205,196,0.15), rgba(78,205,196,0.05)); border-color: rgba(78,205,196,0.3); }
        .announcement-bar.maintenance { background: linear-gradient(90deg, rgba(255,193,7,0.15), rgba(255,193,7,0.05)); border-color: rgba(255,193,7,0.3); }
        
        .announcement-icon { font-size: 18px; flex-shrink: 0; }
        .announcement-content { flex: 1; overflow: hidden; }
        .announcement-title { font-weight: bold; color: #FFD700; margin-bottom: 2px; }
        .announcement-bar.event .announcement-title { color: #ff6b6b; }
        .announcement-bar.update .announcement-title { color: #4ecdc4; }
        .announcement-bar.maintenance .announcement-title { color: #ffc107; }
        
        .announcement-text { color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .announcement-close { 
            background: none; 
            border: none; 
            color: #888; 
            font-size: 18px; 
            cursor: pointer;
            padding: 0 5px;
        }
        .announcement-close:hover { color: #fff; }
        .announcement-link { 
            color: #FFD700; 
            text-decoration: none; 
            margin-left: 5px;
            white-space: nowrap;
        }
        
        /* 公告列表弹窗 */
        .announcement-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
        }
        .announcement-modal.active { display: block; }
        .announcement-list {
            background: linear-gradient(135deg, #1a1a3e, #0d1b2a);
            border: 2px solid #FFD700;
            border-radius: 16px;
            max-width: 400px;
            margin: 20px auto;
            overflow: hidden;
        }
        .announcement-list-header {
            background: rgba(255,215,0,0.2);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .announcement-list-title { font-size: 18px; font-weight: bold; color: #FFD700; }
        .announcement-list-close { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }
        .announcement-list-content { padding: 15px; }
        .announcement-item {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 3px solid #FFD700;
        }
        .announcement-item.event { border-color: #ff6b6b; }
        .announcement-item.update { border-color: #4ecdc4; }
        .announcement-item.maintenance { border-color: #ffc107; }
        .announcement-item-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .announcement-item-icon { font-size: 20px; }
        .announcement-item-title { font-weight: bold; font-size: 14px; }
        .announcement-item-content { font-size: 13px; color: #aaa; line-height: 1.5; }
        .announcement-item-time { font-size: 11px; color: #666; margin-top: 8px; }
        .announcement-item-link {
            display: inline-block;
            margin-top: 8px;
            padding: 5px 12px;
            background: rgba(255,215,0,0.2);
            border-radius: 15px;
            font-size: 12px;
            color: #FFD700;
            text-decoration: none;
        }
        
        /* 底部公告按钮 */
        .announcement-btn {
            position: fixed;
            bottom: 80px;
            right: 15px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255,215,0,0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .announcement-btn.has-new::after {
            content: '';
            position: absolute;
            top: 5px;
            right: 5px;
            width: 10px;
            height: 10px;
            background: #ff4757;
            border-radius: 50%;
            border: 2px solid #FFD700;
        }
    `;
    document.head.appendChild(style);

    // 获取有效的公告
    function getValidAnnouncements() {
        const now = new Date().toISOString().split('T')[0];
        return announcements.filter(a => {
            const closed = JSON.parse(localStorage.getItem('closedAnnouncements') || '[]');
            if (closed.includes(a.id)) return false;
            return a.startTime <= now && a.endTime >= now;
        }).sort((a, b) => a.priority - b.priority);
    }

    // 创建顶部公告栏
    function createTopBar() {
        const valid = getValidAnnouncements();
        if (valid.length === 0) return;

        const top = valid[0];
        const bar = document.createElement('div');
        bar.className = `announcement-bar ${top.type}`;
        bar.id = `announcement-${top.id}`;
        bar.innerHTML = `
            <span class="announcement-icon">${top.icon}</span>
            <div class="announcement-content">
                <div class="announcement-title">${top.title}</div>
                <div class="announcement-text">${top.content}${top.link ? `<a href="${top.link}" class="announcement-link">查看详情 →</a>` : ''}</div>
            </div>
            <button class="announcement-close" onclick="Announcement.close(${top.id})">×</button>
        `;

        // 插入到body顶部
        document.body.insertBefore(bar, document.body.firstChild);
    }

    // 创建公告列表弹窗
    function createModal() {
        const valid = getValidAnnouncements();
        
        const modal = document.createElement('div');
        modal.className = 'announcement-modal';
        modal.id = 'announcementModal';
        
        let itemsHtml = '';
        valid.forEach(item => {
            itemsHtml += `
                <div class="announcement-item ${item.type}">
                    <div class="announcement-item-header">
                        <span class="announcement-item-icon">${item.icon}</span>
                        <span class="announcement-item-title">${item.title}</span>
                    </div>
                    <div class="announcement-item-content">${item.content}</div>
                    <div class="announcement-item-time">${item.startTime} ~ ${item.endTime}</div>
                    ${item.link ? `<a href="${item.link}" class="announcement-item-link" onclick="Announcement.hideModal()">查看详情</a>` : ''}
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="announcement-list">
                <div class="announcement-list-header">
                    <span class="announcement-list-title">📢 系统公告</span>
                    <button class="announcement-list-close" onclick="Announcement.hideModal()">×</button>
                </div>
                <div class="announcement-list-content">
                    ${itemsHtml || '<div style="text-align:center;color:#888;padding:20px;">暂无公告</div>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 创建浮动按钮
    function createFloatButton() {
        const valid = getValidAnnouncements();
        const hasNew = valid.length > 0;
        
        const btn = document.createElement('button');
        btn.className = `announcement-btn ${hasNew ? 'has-new' : ''}`;
        btn.innerHTML = '📢';
        btn.onclick = () => Announcement.showModal();
        
        document.body.appendChild(btn);
    }

    // 公告系统API
    window.Announcement = {
        init: function() {
            createTopBar();
            createModal();
            createFloatButton();
        },
        
        close: function(id) {
            const bar = document.getElementById(`announcement-${id}`);
            if (bar) bar.remove();
            
            let closed = JSON.parse(localStorage.getItem('closedAnnouncements') || '[]');
            closed.push(id);
            localStorage.setItem('closedAnnouncements', JSON.stringify(closed));
        },
        
        showModal: function() {
            document.getElementById('announcementModal').classList.add('active');
            // 清除新消息标记
            const btn = document.querySelector('.announcement-btn');
            if (btn) btn.classList.remove('has-new');
        },
        
        hideModal: function() {
            document.getElementById('announcementModal').classList.remove('active');
        },
        
        // 添加新公告
        add: function(announcement) {
            announcements.push({
                id: Date.now(),
                ...announcement
            });
            // 刷新显示
            location.reload();
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Announcement.init);
    } else {
        Announcement.init();
    }
})();
