# 命运塔·首登者 - 守卫争夺机制规则

**更新日期**: 2024-03-04 12:55
**适用模式**: 个人赛、团队赛
**版本**: V3.7

---

## 📋 守卫争夺机制

### 核心规则

1. **首登者成为守卫**
   - 第一个到达A层（第13层）的玩家成为**守卫**
   - 守卫需要成功防御13次挑战才能获胜

2. **其他玩家成为挑战者**
   - 其他玩家最多只能到达A层（第13层）
   - 无法成为第二个守卫
   - 进入**争夺首登者**模式

3. **挑战者胜利条件**
   - 挑战者需要**连胜3次**才能取代守卫
   - 每次挑战出牌对决守卫
   - 匹配成功（花色或点数相同）则挑战者胜
   - 匹配失败则守卫防御成功

4. **守卫胜利条件**
   - 守卫需要**累计防御13次**成功即可获胜
   - 不需要连续，累计即可
   - 每次挑战者匹配失败，守卫防御+1

---

## 🎮 游戏流程

### 场景1: 玩家先成为守卫
```
1. 玩家登顶A层 → 成为守卫
2. AI到达A层 → 进入争夺模式
3. AI挑战守卫:
   - AI匹配成功 → AI连胜+1
   - AI连胜3次 → AI取代守卫
   - AI匹配失败 → 守卫防御+1，AI连胜清零
4. 守卫防御13次 → 守卫获胜
```

### 场景2: AI先成为守卫
```
1. AI登顶A层 → 成为守卫
2. 玩家到达A层 → 进入争夺模式
3. 玩家挑战守卫:
   - 玩家匹配成功 → 玩家连胜+1
   - 玩家连胜3次 → 玩家取代守卫
   - 玩家匹配失败 → AI守卫防御+1，玩家连胜清零
4. AI守卫防御13次 → AI获胜
```

---

## 💻 代码实现

### 状态变量
```javascript
gameState = {
    isGuard: false,           // 玩家是否是守卫
    aiIsGuard: false,         // AI是否是守卫
    guardDefends: 0,          // 守卫防御次数
    aiGuardDefends: 0,        // AI守卫防御次数
    aiChallengeWins: 0        // AI挑战连胜次数（新增）
};
```

### AI挑战守卫函数
```javascript
function aiChallengeGuard() {
    // AI出牌
    const aiCard = generateRandomCard();
    // 守卫出牌
    const playerGuardCard = generateRandomCard();
    
    const aiMatched = (aiCard.suit === playerGuardCard.suit) || 
                      (aiCard.rank === playerGuardCard.rank);
    
    if (aiMatched) {
        // AI匹配成功，连胜+1
        gameState.aiChallengeWins++;
        if (gameState.aiChallengeWins >= 3) {
            // AI连胜3次，取代守卫
            gameState.isGuard = false;
            gameState.aiIsGuard = true;
            gameState.aiGuardDefends = gameState.guardDefends;
        }
    } else {
        // AI匹配失败，连胜清零，守卫防御+1
        gameState.aiChallengeWins = 0;
        gameState.guardDefends++;
        if (gameState.guardDefends >= 13) {
            // 守卫获胜
            showVictory();
        }
    }
}
```

---

## 📊 胜负判定

| 角色 | 胜利条件 | 失败条件 |
|-----|---------|---------|
| 守卫 | 防御成功13次 | 被挑战者连胜3次 |
| 挑战者 | 连胜3次取代守卫 | - |

---

## 🎯 策略提示

### 守卫策略
- 每次防御成功都会让挑战者连胜清零
- 只需专注防御，不需要进攻
- 13次防御后即可获胜

### 挑战者策略
- 必须连胜3次才能取代守卫
- 一次失败就前功尽弃
- 风险高但收益大

---

## 📝 更新日志

### V3.7 (2024-03-04)
- ✅ 添加守卫争夺机制
- ✅ AI挑战者连胜3次可取代守卫
- ✅ 守卫需要13次防御才能获胜
- ✅ 更新个人赛solo_game.html

---

**守卫争夺机制已应用到所有游戏主逻辑！** 🐍🛡️
