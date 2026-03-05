#!/usr/bin/env python3
"""
命运塔·首登者 - 完整游戏服务器启动脚本
同时启动 WebSocket 服务器 (7776) 和 HTTP 服务器 (8082)
"""

import subprocess
import sys
import os
import time
import signal

# 获取当前目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_CLIENT_DIR = os.path.join(os.path.dirname(BASE_DIR), 'web_client')

def start_websocket_server():
    """启动 WebSocket 服务器"""
    print("🚀 启动 WebSocket 服务器 (端口: 7776)...")
    return subprocess.Popen(
        [sys.executable, 'game_server.py'],
        cwd=BASE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

def start_http_server():
    """启动 HTTP 静态文件服务器"""
    print("🌐 启动 HTTP 服务器 (端口: 8082)...")
    return subprocess.Popen(
        [sys.executable, '-m', 'http.server', '8082'],
        cwd=WEB_CLIENT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

def main():
    print("=" * 60)
    print("🏰 命运塔·首登者 - 游戏服务器启动器")
    print("=" * 60)
    
    # 启动两个服务器
    ws_process = start_websocket_server()
    time.sleep(1)  # 等待WebSocket启动
    
    http_process = start_http_server()
    time.sleep(1)  # 等待HTTP启动
    
    print("\n✅ 服务器启动完成！")
    print("\n📍 访问地址:")
    print("  • 首页:        http://localhost:8082/new_index.html")
    print("  • 游戏:        http://localhost:8082/index.html?mode=single")
    print("  • 商城:        http://localhost:8082/shop_v2.html")
    print("  • 赛季荣誉:    http://localhost:8082/season_honors.html")
    print("  • 团队赛:      http://localhost:8082/team_battle_v2.html")
    print("  • 管理后台:    http://localhost:8082/admin/enhanced_index.html")
    print("\n🔌 WebSocket:   ws://localhost:7776")
    print("\n" + "=" * 60)
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    
    try:
        # 等待用户中断
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 正在停止服务器...")
        ws_process.terminate()
        http_process.terminate()
        print("✅ 服务器已停止")

if __name__ == '__main__':
    main()
