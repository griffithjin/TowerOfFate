/**
 * 命运塔 - 新手引导系统
 * 5步引导流程，帮助新用户快速上手
 */

const Guide = {
  steps: [
    {
      id: 1,
      title: "欢迎来到命运塔！🏰",
      content: "你的目标是登顶第13层(A层)，成为首登者！每层都有守卫把守，击败他们才能上升。",
      highlight: ".tower-section",
      position: "center",
      btnText: "下一步"
    },
    {
      id: 2,
      title: "这是你的手牌 🎴",
      content: "你有52张完整牌组。点击选择一张牌出牌，需要匹配守卫牌的花色或数字。",
      highlight: "#handContainer",
      position: "bottom",
      btnText: "下一步"
    },
    {
      id: 3,
      title: "出牌规则 📋",
      content: "比如守卫是♥️7，你可以出任意红心牌，或者任意数字7。匹配成功即可上升一层！",
      highlight: ".guard-section",
      position: "top",
      btnText: "下一步"
    },
    {
      id: 4,
      title: "避开激怒牌！⚠️",
      content: "红色激怒牌是陷阱！如果匹配了激怒牌，你会受到惩罚，回到更低的楼层。",
      highlight: ".guard-section",
      position: "top",
      warning: true,
      btnText: "下一步"
    },
    {
      id: 5,
      title: "开始挑战！🚀",
      content: "准备好成为首登者了吗？点击开始你的第一局！完成引导将获得💎100钻石奖励！",
      highlight: "#btnSinglePlayer",
      position: "center",
      btnText: "开始游戏",
      action: "start"
    }
  ],
  
  currentStep: 0,
  isActive: false,
  
  // 初始化引导
  init() {
    // 检查是否已完成引导
    if (localStorage.getItem('towerGuideCompleted')) {
      console.log('🎯 新手引导已完成，跳过');
      return false;
    }
    
    // 检查是否是新用户（游戏次数<2）
    const userData = JSON.parse(localStorage.getItem('towerUser') || '{}');
    if (userData.totalGames >= 2) {
      localStorage.setItem('towerGuideCompleted', 'true');
      return false;
    }
    
    console.log('🎯 启动新手引导...');
    this.isActive = true;
    this.showStep(0);
    return true;
  },
  
  // 显示指定步骤
  showStep(index) {
    this.currentStep = index;
    const step = this.steps[index];
    
    // 移除之前的引导元素
    this.removeOverlay();
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'guide-overlay';
    overlay.id = 'guideOverlay';
    overlay.innerHTML = `
      <div class="guide-backdrop"></div>
      <div class="guide-highlight-box" id="guideHighlight"></div>
      <div class="guide-box guide-${step.position}" id="guideBox">
        <div class="guide-title" style="${step.warning ? 'color: #ff6b6b;' : ''}">${step.title}</div>
        <div class="guide-content">${step.content}</div>
        <div class="guide-progress">
          ${this.steps.map((_, i) => `
            <span class="guide-dot ${i === index ? 'active' : ''}"></span>
          `).join('')}
        </div>
        <button class="guide-btn ${step.warning ? 'warning' : ''}" onclick="Guide.next()">
          ${step.btnText}
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 高亮目标元素
    this.highlightElement(step.highlight);
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
  },
  
  // 高亮元素
  highlightElement(selector) {
    const target = document.querySelector(selector);
    const highlight = document.getElementById('guideHighlight');
    
    if (target && highlight) {
      const rect = target.getBoundingClientRect();
      const padding = 10;
      
      highlight.style.cssText = `
        position: absolute;
        top: ${rect.top - padding}px;
        left: ${rect.left - padding}px;
        width: ${rect.width + padding * 2}px;
        height: ${rect.height + padding * 2}px;
        border: 3px solid #FFD700;
        border-radius: 12px;
        box-shadow: 0 0 30px rgba(255,215,0,0.5), inset 0 0 30px rgba(255,215,0,0.2);
        z-index: 10001;
        animation: guidePulse 2s infinite;
        pointer-events: none;
      `;
      
      // 滚动到元素
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  
  // 下一步
  next() {
    const step = this.steps[this.currentStep];
    
    // 执行步骤动作
    if (step.action === 'start') {
      this.complete();
      return;
    }
    
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.complete();
    }
  },
  
  // 跳过引导
  skip() {
    this.removeOverlay();
    this.isActive = false;
    localStorage.setItem('towerGuideCompleted', 'true');
    document.body.style.overflow = '';
  },
  
  // 完成引导
  complete() {
    console.log('🎉 新手引导完成！');
    
    // 发放奖励
    const userData = JSON.parse(localStorage.getItem('towerUser') || '{}');
    userData.diamond = (userData.diamond || 0) + 100;
    userData.coins = (userData.coins || 0) + 500;
    localStorage.setItem('towerUser', JSON.stringify(userData));
    
    // 标记完成
    localStorage.setItem('towerGuideCompleted', 'true');
    
    // 移除引导
    this.removeOverlay();
    this.isActive = false;
    document.body.style.overflow = '';
    
    // 显示完成提示
    this.showCompleteModal();
    
    // 触发游戏开始（如果在登录页）
    const btnSingle = document.getElementById('btnSinglePlayer');
    if (btnSingle && this.currentStep === 4) {
      setTimeout(() => btnSingle.click(), 500);
    }
  },
  
  // 显示完成弹窗
  showCompleteModal() {
    const modal = document.createElement('div');
    modal.className = 'guide-complete-modal';
    modal.innerHTML = `
      <div class="guide-complete-content">
        <div class="guide-complete-icon">🎉</div>
        <div class="guide-complete-title">引导完成！</div>
        <div class="guide-complete-rewards">
          <div class="reward-item">
            <span class="reward-icon">💎</span>
            <span class="reward-text">+100 钻石</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">💰</span>
            <span class="reward-text">+500 金币</span>
          </div>
        </div>
        <button class="guide-complete-btn" onclick="this.closest('.guide-complete-modal').remove()">
          开始游戏
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  // 移除引导元素
  removeOverlay() {
    const overlay = document.getElementById('guideOverlay');
    if (overlay) overlay.remove();
    document.querySelectorAll('.guide-target').forEach(el => {
      el.classList.remove('guide-target');
    });
  },
  
  // 重置引导（用于测试）
  reset() {
    localStorage.removeItem('towerGuideCompleted');
    console.log('🔄 新手引导已重置');
  }
};

// 添加CSS样式
const guideStyles = document.createElement('style');
guideStyles.textContent = `
  @keyframes guidePulse {
    0%, 100% { box-shadow: 0 0 30px rgba(255,215,0,0.5), inset 0 0 30px rgba(255,215,0,0.2); }
    50% { box-shadow: 0 0 50px rgba(255,215,0,0.8), inset 0 0 40px rgba(255,215,0,0.3); }
  }
  
  .guide-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  }
  
  .guide-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
  }
  
  .guide-box {
    position: absolute;
    background: linear-gradient(135deg, #1a1a3e, #0d1b2a);
    border: 2px solid #FFD700;
    border-radius: 16px;
    padding: 25px;
    max-width: 320px;
    color: #fff;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    z-index: 10002;
  }
  
  .guide-box.guide-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .guide-box.guide-top {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .guide-box.guide-bottom {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .guide-title {
    font-size: 20px;
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .guide-content {
    font-size: 14px;
    line-height: 1.6;
    color: #ccc;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .guide-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .guide-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transition: all 0.3s;
  }
  
  .guide-dot.active {
    background: #FFD700;
    transform: scale(1.2);
  }
  
  .guide-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border: none;
    border-radius: 25px;
    color: #000;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .guide-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 20px rgba(255,215,0,0.4);
  }
  
  .guide-btn.warning {
    background: linear-gradient(135deg, #ff6b6b, #ff4444);
    color: #fff;
  }
  
  /* 完成弹窗 */
  .guide-complete-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10003;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .guide-complete-content {
    background: linear-gradient(135deg, #1a1a3e, #0d1b2a);
    border: 2px solid #FFD700;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    max-width: 300px;
    animation: guideSlideUp 0.5s ease;
  }
  
  @keyframes guideSlideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .guide-complete-icon {
    font-size: 60px;
    margin-bottom: 15px;
  }
  
  .guide-complete-title {
    font-size: 24px;
    color: #FFD700;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .guide-complete-rewards {
    margin-bottom: 25px;
  }
  
  .reward-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    margin-bottom: 10px;
  }
  
  .reward-icon {
    font-size: 24px;
  }
  
  .reward-text {
    font-size: 18px;
    color: #FFD700;
    font-weight: bold;
  }
  
  .guide-complete-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border: none;
    border-radius: 25px;
    color: #000;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
  }
`;
document.head.appendChild(guideStyles);

// 页面加载后自动启动引导（如果在登录页面）
if (document.getElementById('loginScreen')) {
  window.addEventListener('load', () => {
    setTimeout(() => Guide.init(), 1000);
  });
}

console.log('🎯 新手引导系统已加载');
