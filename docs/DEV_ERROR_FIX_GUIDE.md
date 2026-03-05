# 开发错误记录与修正指南

**日期:** 2026年3月4日  
**记录人:** 小金蛇

---

## ❌ 已发生的错误

### 1. Edit 失败
**错误:** `Could not find the exact text` / `Missing required parameter`

**原因:**
- 内存文件文本不匹配（空格/换行差异）
- 参数名错误（oldText vs old_string）

**修正:**
- ✅ 使用 `old_string` 参数（不是 oldText）
- ✅ 先读取文件确认内容再编辑
- ✅ 确保文本完全匹配（包括空格和换行）

---

### 2. Browser 404 错误
**错误:** `Error: HTTP 404`

**原因:**
- 服务器未启动
- 文件路径错误
- 端口未监听

**修正:**
- ✅ 启动服务器后再打开浏览器
- ✅ 使用正确的本地地址 `http://localhost:8082/`
- ✅ 确认文件存在于 `Desktop/TowerOfFate/web_client/`

---

### 3. Exec 超时
**错误:** `Command timed out after 5 seconds`

**原因:**
- 命令执行时间过长
- 服务器启动阻塞

**修正:**
- ✅ 使用 `background=True` 启动服务器
- ✅ 增加 timeout 参数
- ✅ 使用 nohup 后台运行

---

### 4. 命令不存在
**错误:** `command not found: lsof`

**原因:**
- 系统没有 lsof 命令
- 使用 Mac 不支持的参数

**修正:**
- ✅ 使用 `netstat` 或 `ss` 代替
- ✅ 使用 `curl` 测试端口
- ✅ 避免使用系统特定命令

---

## ✅ 未来任务执行规范

### 文件操作
```python
# 正确 - 使用 old_string
edit(file_path="...", old_string="...", new_string="...")

# 错误 - 使用 oldText
edit(file_path="...", oldText="...", newText="...")  ❌
```

### 服务器启动
```bash
# 正确 - 后台启动
cd /Users/moutai/Desktop/TowerOfFate/web_client && nohup python3 -m http.server 8082 > /tmp/http.log 2>&1 &

# 错误 - 阻塞启动
python3 start_game.py  ❌
```

### 浏览器打开
```python
# 正确 - 使用 open 命令
exec(command="open http://localhost:8082/xxx.html")

# 错误 - 使用 browser 工具访问本地
browser(action="open", url="http://localhost:8082/xxx.html")  ❌
```

### 端口检查
```bash
# 正确 - 使用 curl
curl -I http://localhost:8082/xxx.html

# 错误 - 使用 lsof
lsof -ti:8082  ❌
```

---

## 📁 唯一工作目录

**禁止:** ❌ 在 workspace 修改游戏代码  
**必须:** ✅ 所有操作在 `Desktop/TowerOfFate`

### 正确路径
```
/Users/moutai/Desktop/TowerOfFate/
├── server/          # Python后端
├── web_client/      # HTML前端
├── admin/           # 管理后台
└── docs/            # 文档
```

---

## 🔧 标准启动流程

```bash
# 1. 停止旧进程
pkill -f "http.server 8082"
pkill -f "game_server.py"

# 2. 启动HTTP服务器
cd /Users/moutai/Desktop/TowerOfFate/web_client
nohup python3 -m http.server 8082 > /tmp/http.log 2>&1 &

# 3. 启动WebSocket服务器
cd /Users/moutai/Desktop/TowerOfFate/server
nohup python3 game_server.py > /tmp/ws.log 2>&1 &

# 4. 验证
sleep 2
curl -I http://localhost:8082/new_index.html

# 5. 打开页面
open http://localhost:8082/new_index.html
```

---

**已牢记！未来严格按照此规范执行！** 🐍
