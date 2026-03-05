"""
守卫模式补丁 - 添加到 index.html
包含: 守卫模式, 天命牌开局3张, 淘汰守卫机制
"""

# 在 gameState 变量后添加守卫模式状态
GAMESTATE_PATCH = '''
        // 守卫模式状态
        let guardMode = {
            isGuard: false,        // 是否成为守卫
            guardRounds: 0,        // 守卫守了多少轮
            isEliminated: false,   // 是否被淘汰
            eliminatedBy: null     // 被谁淘汰
        };
        
        // 天命牌系统 - 开局3张
        let destinyCards = [];
        
        const DESTINY_TYPES = [
            { type: 'assault', name: '全军突击', desc: '全队晋级', icon: '⚡' },
            { type: 'swap', name: '换牌', desc: '重新抽牌', icon: '🔄' },
            { type: 'peek', name: '看牌', desc: '查看守卫', icon: '👁️' },
            { type: 'bring', name: '带人', desc: '带队友晋级', icon: '🚀' },
            { type: 'kick', name: '踢人', desc: '对手降一层', icon: '❌' },
            { type: 'down', name: '下降', desc: '淘汰守卫!', icon: '⬇️' }
        ];
'''

# 在 initGame 函数中添加初始化代码
INITGAME_PATCH = '''
            // 初始化守卫模式
            guardMode = {
                isGuard: false,
                guardRounds: 0,
                isEliminated: false,
                eliminatedBy: null
            };
            
            // 初始化天命牌 - 开局3张
            destinyCards = [];
            for (let i = 0; i < 3; i++) {
                const card = DESTINY_TYPES[Math.floor(Math.random() * DESTINY_TYPES.length)];
                destinyCards.push({...card, used: false});
            }
            renderDestinyCards();
            
            // 显示天命牌区域
            document.getElementById('destinySection').classList.remove('hidden');
'''

# 添加到 handleRoundResult 函数中
ROUNDRESULT_PATCH = '''
            // 检查是否登顶成为守卫
            const myState = gameState.players[playerId];
            if (myState.level >= 13 && !guardMode.isGuard && !guardMode.isEliminated) {
                becomeGuard();
            }
            
            // 如果是守卫,增加守塔积分
            if (guardMode.isGuard) {
                guardMode.guardRounds++;
                myState.score += 50; // 守卫每轮+50分
                
                // 检查是否守住13轮
                if (guardMode.guardRounds >= 13) {
                    winAsGuard();
                    return;
                }
            }
'''

# 新函数: 成为守卫
BECOME_GUARD_FUNCTION = '''
        // 成为守卫
        function becomeGuard() {
            guardMode.isGuard = true;
            guardMode.guardRounds = 0;
            
            // 显示守卫状态
            document.getElementById('guardStatus').classList.remove('hidden');
            document.getElementById('guardBadge').classList.remove('hidden');
            
            // 改变外观
            document.body.classList.add('guard-mode');
            
            // 提示
            showNotification('🏰 你已成为守卫！守住13轮获得胜利！每轮+50分！', 'success');
            
            // 播放特效
            if (typeof levelUpEffect === 'function') {
                levelUpEffect(window.innerWidth / 2, window.innerHeight / 2);
            }
        }
'''

# 新函数: 作为守卫获胜
WIN_AS_GUARD_FUNCTION = '''
        // 守卫获胜
        function winAsGuard() {
            const myState = gameState.players[playerId];
            myState.score += 500; // 守卫胜利额外奖励
            
            showGameOver({
                winner_id: playerId,
                winner_name: playerName,
                message: '🏰 守卫胜利！成功守住13轮！'
            });
        }
'''

# 新函数: 被淘汰后重生
RESPAWN_FUNCTION = '''
        // 被淘汰后从2层重生
        function respawn() {
            guardMode.isGuard = false;
            guardMode.isEliminated = false;
            guardMode.guardRounds = 0;
            
            const myState = gameState.players[playerId];
            myState.level = 2; // 从2层开始
            
            // 隐藏守卫状态
            document.getElementById('guardStatus').classList.add('hidden');
            document.getElementById('guardBadge').classList.add('hidden');
            document.body.classList.remove('guard-mode');
            
            showNotification('🔄 从2层重新开始！继续挑战！', 'info');
        }
'''

# 新函数: 使用天命牌
USE_DESTINY_FUNCTION = '''
        // 使用天命牌
        function useDestinyCard(index) {
            if (index >= destinyCards.length) return;
            
            const card = destinyCards[index];
            if (card.used) return;
            
            // 检查是否可以使用下降牌
            if (card.type === 'down' && !guardMode.isGuard) {
                // 查找是否有守卫玩家
                let hasGuard = false;
                Object.values(gameState.players).forEach(p => {
                    if (p.id !== playerId && p.level >= 13) {
                        hasGuard = true;
                    }
                });
                
                if (!hasGuard) {
                    alert('❌ 只有当有玩家成为守卫时才能使用"下降"牌！');
                    return;
                }
            }
            
            if (confirm(`使用天命牌「${card.name}」？\n${card.desc}`)) {
                card.used = true;
                
                // 应用效果
                applyDestinyEffect(card.type);
                
                // 更新显示
                renderDestinyCards();
            }
        }
        
        // 应用天命牌效果
        function applyDestinyEffect(type) {
            const myState = gameState.players[playerId];
            
            switch(type) {
                case 'assault':
                    myState.level += 1;
                    showNotification('⚡ 全军突击！晋级一层！', 'success');
                    break;
                case 'swap':
                    // 重新发牌
                    myState.hand = generateHand(5);
                    showNotification('🔄 换牌成功！', 'success');
                    break;
                case 'peek':
                    // 显示下轮守卫牌
                    alert('👁️ 下轮守卫牌: ♥A (示例)');
                    break;
                case 'bring':
                    myState.level += 1;
                    showNotification('🚀 带人晋级！', 'success');
                    break;
                case 'kick':
                    // 让随机对手降一层
                    Object.values(gameState.players).forEach(p => {
                        if (p.id !== playerId && p.level > 1) {
                            p.level -= 1;
                        }
                    });
                    showNotification('❌ 踢人成功！对手下降一层！', 'success');
                    break;
                case 'down':
                    // 淘汰守卫
                    if (guardMode.isGuard) {
                        // 自己被淘汰
                        respawn();
                    } else {
                        // 淘汰其他守卫
                        Object.values(gameState.players).forEach(p => {
                            if (p.id !== playerId && p.level >= 13) {
                                p.level = 2; // 守卫被淘汰，从2层开始
                            }
                        });
                        showNotification('⬇️ 守卫被淘汰！', 'success');
                    }
                    break;
            }
            
            updateDisplay();
        }
        
        // 渲染天命牌
        function renderDestinyCards() {
            const container = document.getElementById('destinyCards');
            if (!container) return;
            
            container.innerHTML = destinyCards.map((card, index) => `
                <div class="destiny-card ${card.used ? 'used' : ''}" 
                     onclick="${card.used ? '' : `useDestinyCard(${index})`}">
                    <div class="destiny-icon">${card.icon}</div>
                    <div class="destiny-name">${card.name}</div>
                    <div class="destiny-desc">${card.desc}</div>
                    ${card.used ? '<div class="destiny-used">已使用</div>' : ''}
                </div>
            `).join('');
        }
'''

print("守卫模式补丁代码已生成")
print("需要将这些代码片段插入到 index.html 的对应位置")
