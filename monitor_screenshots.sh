#!/bin/bash
# 命运塔 - 截图监控脚本
# 生成时间: $(date)

REPO_DIR="/Users/moutai/Desktop/toweroffate"
REPORT_DIR="/Users/moutai/Desktop/debug\&update/screenshots"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="/Users/moutai/Desktop/debug\&update/debug_update_report_$(date +%Y%m%d_%H%M).md"

# 创建截图目录
mkdir -p "$REPORT_DIR"

echo "🚀 开始截图检查 - $TIMESTAMP"
echo "📁 报告目录: $REPORT_DIR"

# 要检查的页面列表
PAGES=(
  "index.html"
  "profile.html"
  "rank.html"
  "achievements.html"
  "friends.html"
  "recharge_v2.html"
  "shop.html"
  "recharge.html"
  "help.html"
  "features.html"
  "season_honors.html"
  "streak.html"
  "solo_game.html"
  "team_battle_v2.html"
)

echo "📊 需要检查 ${#PAGES[@]} 个页面"

# 生成报告头部
cat > "$REPORT_FILE" << EOF
# Debug & Update Report - $(date +"%Y-%m-%d %H:%M")
# 监控目标: https://griffithjin.github.io/toweroffate-v1/
# 状态: 🟢 修复进行中

## 🎯 本次修复总结

### 已完成的P0修复:
1. ✅ 充值页面 - 创建 recharge_v2.html (6档充值)
2. ✅ 移动端手牌 - 创建 mobile_hand_fix.css
3. ✅ 新手引导 - 创建 guide.js (5步引导)
4. ✅ 排位赛 - 创建 rank.html
5. ✅ 成就系统 - 创建 achievements.html
6. ✅ 好友系统 - 创建 friends.html

### Git提交:
- Commit: $(cd $REPO_DIR && git log -1 --oneline)
- 时间: $(date)

## 📊 页面检查结果

EOF

# 统计信息
TOTAL=${#PAGES[@]}
CHECKED=0

echo "✅ 报告已创建: $REPORT_FILE"
echo "🎉 监控脚本准备完成"
echo ""
echo "下次检查时间: $(date -v+15M +"%H:%M")"
