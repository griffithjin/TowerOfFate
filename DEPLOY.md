# 公网部署指南

## 当前状态
- ✅ 局域网：可用（同一Wi-Fi）
- ❌ 公网：暂未部署

## 方案一：GitHub Pages（纯前端，立即可用）

最适合快速让朋友体验界面：

```bash
# 1. 创建 gh-pages 分支
cd ~/Desktop/toweroffate_v1.0
git checkout -b gh-pages

# 2. 移动文件到根目录
git mv web_client/* .

# 3. 提交并推送
git add -A
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

然后访问：
`https://griffithjin.github.io/toweroffate-v1`

⚠️ 限制：无后端，无法多人对战

---

## 方案二：云服务器部署（推荐完整体验）

需要购买VPS（阿里云/腾讯云/AWS等）：

### 服务器要求
- 1核CPU / 1GB内存
- 1Mbps带宽
- 系统：Ubuntu 20.04

### 部署步骤

```bash
# 1. 购买服务器后，SSH登录
ssh root@你的公网IP

# 2. 安装Python
apt update && apt install -y python3 python3-pip git

# 3. 克隆代码
git clone https://github.com/griffithjin/toweroffate-v1.git
cd toweroffate-v1

# 4. 启动游戏服务器（前端）
cd web_client
python3 -m http.server 80 &

# 5. 启动WebSocket服务器（后端）
cd ../server
pip3 install websockets
python3 websocket_server.py &

# 6. 开放防火墙
ufw allow 80/tcp
ufw allow 7777/tcp
```

### 访问地址
- 游戏：`http://你的公网IP`
- 后台：`http://你的公网IP:8081`

---

## 方案三：内网穿透（免费，适合测试）

### 使用 ngrok（免费版）

```bash
# 1. 下载 ngrok
brew install ngrok  # Mac
# 或访问 https://ngrok.com/download

# 2. 注册并获取 authtoken
ngrok config add-authtoken 你的token

# 3. 启动穿透（游戏客户端）
cd ~/Desktop/toweroffate_v1.0/web_client
git checkout main
python3 -m http.server 8080 &
ngrok http 8080

# 会得到类似：https://xxxx.ngrok.io
```

### 使用花生壳/FRP（国内推荐）

需要注册账号，配置隧道。

---

## 方案对比

| 方案 | 成本 | 难度 | 效果 | 推荐度 |
|------|------|------|------|--------|
| GitHub Pages | 免费 | ⭐⭐ | 纯前端，无多人 | ⭐⭐⭐ |
| 云服务器 | ~50元/月 | ⭐⭐⭐ | 完整功能 | ⭐⭐⭐⭐⭐ |
| ngrok | 免费/付费 | ⭐⭐ | 临时测试 | ⭐⭐⭐ |

---

## 快速公网体验（推荐先用GitHub Pages）

要不要我现在部署到 GitHub Pages，让朋友能立刻体验界面？

完整多人对战需要购买云服务器。
