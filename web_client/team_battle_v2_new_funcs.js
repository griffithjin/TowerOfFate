// 结算回合 - 调用比对动画
        function resolveRound() {
            const myCard = gameState.sharedHand[gameState.selectedCard];
            
            // 生成守卫牌
            const suits = ['♥', '♦', '♣', '♠'];
            const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            const guardCard = {
                suit: suits[Math.floor(Math.random() * suits.length)],
                rank: ranks[Math.floor(Math.random() * ranks.length)],
                color: '#000'
            };
            guardCard.color = (guardCard.suit === '♥' || guardCard.suit === '♦') ? '#d00' : '#000';
            
            // 显示比对弹窗动画
            showCardComparison(myCard, guardCard);
        }
        
        // 显示牌比对弹窗动画
        function showCardComparison(playerCard, guardCard) {
            // 创建比对弹窗
            const modal = document.createElement('div');
            modal.id = 'comparisonModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div id="comparisonContent" style="
                    background: linear-gradient(135deg, #1a1a3e, #0d1b2a);
                    border: 4px solid #ffd700;
                    border-radius: 25px;
                    padding: 50px;
                    text-align: center;
                    box-shadow: 0 0 80px rgba(255,215,0,0.6);
                    transform: scale(0.8);
                    opacity: 0;
                    transition: all 0.5s ease-out;
                ">
                    <h2 style="color: #ffd700; margin-bottom: 40px; font-size: 32px; text-shadow: 0 0 20px rgba(255,215,0,0.5);">⚔️ 牌面比对</h2>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 50px; margin: 40px 0;">
                        <!-- 玩家牌 -->
                        <div style="text-align: center;">
                            <div style="font-size: 16px; color: #3498db; margin-bottom: 15px; font-weight: bold;">你的牌</div>
                            <div id="playerCardAnim" style="
                                width: 120px;
                                height: 160px;
                                background: linear-gradient(135deg, #fff, #f8f8f8);
                                border: 4px solid #3498db;
                                border-radius: 15px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                color: ${playerCard.color};
                                box-shadow: 0 0 40px rgba(52,152,219,0.6);
                                transform: rotateY(90deg);
                                animation: cardFlipIn 0.6s ease-out forwards;
                            ">
                                <div style="font-size: 48px;">${playerCard.suit}</div>
                                <div style="font-size: 32px; font-weight: bold;">${playerCard.rank}</div>
                            </div>
                        </div>
                        
                        <!-- VS -->
                        <div id="vsText" style="font-size: 48px; color: #ffd700; font-weight: bold; opacity: 0; animation: fadeIn 0.3s ease-out 0.5s forwards;">VS</div>
                        
                        <!-- 守卫牌 -->
                        <div style="text-align: center;">
                            <div style="font-size: 16px; color: #ffd700; margin-bottom: 15px; font-weight: bold;">守卫牌</div>
                            <div id="guardCardAnim" style="
                                width: 120px;
                                height: 160px;
                                background: linear-gradient(135deg, #1a1a2e, #16213e);
                                border: 4px solid #ffd700;
                                border-radius: 15px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 0 40px rgba(255,215,0,0.6);
                                transform: rotateY(90deg);
                            ">
                                <div id="guardSuitAnim" style="font-size: 48px; opacity: 0;">🛡️</div>
                                <div id="guardRankAnim" style="font-size: 32px; font-weight: bold; opacity: 0;">?</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="comparisonResult" style="
                        margin-top: 30px;
                        font-size: 28px;
                        font-weight: bold;
                        opacity: 0;
                        transform: translateY(20px);
                    "></div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 动画：弹窗进入
            setTimeout(() => {
                const content = document.getElementById('comparisonContent');
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            }, 100);
            
            // 动画：守卫牌揭示
            setTimeout(() => {
                const guardCardAnim = document.getElementById('guardCardAnim');
                const guardSuitAnim = document.getElementById('guardSuitAnim');
                const guardRankAnim = document.getElementById('guardRankAnim');
                
                guardCardAnim.style.animation = 'cardFlipIn 0.6s ease-out forwards';
                guardCardAnim.style.background = 'linear-gradient(135deg, #fff, #f8f8f8)';
                
                setTimeout(() => {
                    guardSuitAnim.textContent = guardCard.suit;
                    guardSuitAnim.style.color = guardCard.color;
                    guardSuitAnim.style.opacity = '1';
                    guardSuitAnim.style.animation = 'flipReveal 0.4s ease-out';
                    
                    guardRankAnim.textContent = guardCard.rank;
                    guardRankAnim.style.color = guardCard.color;
                    guardRankAnim.style.opacity = '1';
                    guardRankAnim.style.animation = 'flipReveal 0.4s ease-out';
                }, 300);
            }, 1200);
            
            // 判定结果
            setTimeout(() => {
                const isMatch = (playerCard.suit === guardCard.suit) || (playerCard.rank === guardCard.rank);
                const resultDiv = document.getElementById('comparisonResult');
                
                if (isMatch) {
                    resultDiv.innerHTML = `
                        <div style="color: #2ed573; animation: successPulse 0.5s ease-out;">✅ 匹配成功！</div>
                        <div style="font-size: 18px; color: #888; margin-top: 15px;">
                            ${playerCard.suit}${playerCard.rank} ↔ ${guardCard.suit}${guardCard.rank}
                        </div>
                        <div style="font-size: 24px; color: #ffd700; margin-top: 15px; animation: shine 1s ease-in-out infinite;">🎉 晋级成功！</div>
                    `;
                    
                    // 晋级
                    const myLevel = parseInt(document.getElementById('teamALevel').textContent);
                    const newLevel = myLevel + 1;
                    document.getElementById('teamALevel').textContent = newLevel + '/A';
                    
                    // 检查是否成为守卫
                    if (newLevel >= 13 && !gameState.isGuard) {
                        setTimeout(() => becomeGuard(), 2000);
                    }
                } else {
                    resultDiv.innerHTML = `
                        <div style="color: #ff4757; animation: shake 0.5s ease-out;">❌ 匹配失败</div>
                        <div style="font-size: 18px; color: #888; margin-top: 15px;">
                            ${playerCard.suit}${playerCard.rank} ≠ ${guardCard.suit}${guardCard.rank}
                        </div>
                        <div style="font-size: 20px; color: #888; margin-top: 15px;">未能晋级</div>
                    `;
                }
                
                resultDiv.style.opacity = '1';
                resultDiv.style.transform = 'translateY(0)';
                resultDiv.style.transition = 'all 0.5s ease-out';
            }, 2000);
            
            // 4秒后关闭弹窗并进入下一轮
            setTimeout(() => {
                const content = document.getElementById('comparisonContent');
                content.style.transform = 'scale(0.8)';
                content.style.opacity = '0';
                
                setTimeout(() => {
                    modal.remove();
                    resetRound();
                }, 500);
            }, 4500);
        }
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cardFlipIn {
                0% { transform: rotateY(90deg); }
                100% { transform: rotateY(0deg); }
            }
            @keyframes flipReveal {
                0% { transform: scale(0) rotateY(180deg); opacity: 0; }
                50% { transform: scale(1.2) rotateY(90deg); }
                100% { transform: scale(1) rotateY(0deg); opacity: 1; }
            }
            @keyframes fadeIn {
                0% { opacity: 0; transform: scale(0.5); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes successPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes shine {
                0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.5); }
                50% { text-shadow: 0 0 30px rgba(255,215,0,1), 0 0 50px rgba(255,215,0,0.8); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);