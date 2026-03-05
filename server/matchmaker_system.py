"""
Tower of Fate: 首登者 - 智能匹配系统
支持 1vs3AI(测试) / 1vs3真人(在线) 模式切换
"""
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum

class MatchMode(Enum):
    """匹配模式"""
    AI_ONLY = "ai_only"           # 1vs3AI - 测试模式
    PVP = "pvp"                   # 1vs3真人 - 在线模式
    PVP_RANKED = "pvp_ranked"     # 排位赛匹配
    TEAM = "team"                 # 团队赛

class GameMatchmaker:
    """游戏匹配系统 - 支持AI/真人切换"""
    
    def __init__(self):
        self.online_players: Dict[str, Dict] = {}  # 在线玩家池
        self.matching_queue: List[str] = []        # 匹配队列
        self.active_matches: Dict[str, Dict] = {}  # 进行中的比赛
        self.ai_players = self._generate_ai_players()  # 80个系统AI
        self.mode_config = {
            MatchMode.AI_ONLY: {
                'name': '人机对战',
                'description': '1名玩家 vs 3个AI',
                'min_players': 1,
                'max_players': 1,
                'ai_count': 3,
                'wait_time': 0,  # 立即开始
                'enabled': True
            },
            MatchMode.PVP: {
                'name': '快速匹配',
                'description': '4名真人玩家对战',
                'min_players': 4,
                'max_players': 4,
                'ai_count': 0,
                'wait_time': 30,  # 30秒匹配时间
                'enabled': True
            },
            MatchMode.PVP_RANKED: {
                'name': '排位赛',
                'description': '段位相近的玩家匹配',
                'min_players': 4,
                'max_players': 4,
                'ai_count': 0,
                'wait_time': 60,  # 60秒匹配时间
                'rank_range': 2,  # 段位差不超过2
                'enabled': True
            }
        }
    
    def _generate_ai_players(self) -> List[Dict]:
        """生成80个系统AI玩家"""
        ai_names = [
            '龙魂战士', '雷霆法师', '暗影刺客', '圣光骑士',
            '烈焰巫师', '冰霜射手', '自然德鲁伊', '暗影牧师',
            '狂风剑客', '大地守护', '海洋先知', '天空游侠',
            '钢铁战神', '火焰法师', '雷电狂战', '暗影猎手',
        ] * 5  # 16 * 5 = 80个AI
        
        return [
            {
                'player_id': f'system_{i+1:03d}',
                'nickname': f'{ai_names[i]}_{i+1}',
                'is_ai': True,
                'level': random.randint(10, 50),
                'rank': random.choice(['bronze', 'silver', 'gold', 'platinum']),
                'win_rate': random.uniform(0.4, 0.7)
            }
            for i in range(80)
        ]
    
    def get_available_modes(self) -> List[Dict]:
        """获取可用的匹配模式"""
        modes = []
        for mode, config in self.mode_config.items():
            if config['enabled']:
                modes.append({
                    'mode': mode.value,
                    'name': config['name'],
                    'description': config['description'],
                    'players_needed': config['max_players'],
                    'current_queue': len(self.matching_queue) if mode != MatchMode.AI_ONLY else 0
                })
        return modes
    
    def start_matchmaking(self, player_id: str, nickname: str, 
                         mode: MatchMode, player_rank: str = None) -> Dict:
        """开始匹配"""
        config = self.mode_config.get(mode)
        if not config:
            return {'success': False, 'error': '未知的匹配模式'}
        
        if not config['enabled']:
            return {'success': False, 'error': '该模式当前不可用'}
        
        # AI模式 - 立即开始
        if mode == MatchMode.AI_ONLY:
            return self._start_ai_match(player_id, nickname)
        
        # PVP模式 - 加入匹配队列
        if player_id in self.online_players:
            return {'success': False, 'error': '已在匹配中'}
        
        self.online_players[player_id] = {
            'player_id': player_id,
            'nickname': nickname,
            'rank': player_rank or 'bronze',
            'joined_at': int(time.time()),
            'mode': mode
        }
        
        self.matching_queue.append(player_id)
        
        return {
            'success': True,
            'message': f'⏳ 正在匹配{config["name"]}...',
            'mode': mode.value,
            'estimated_wait': config['wait_time'],
            'queue_position': len(self.matching_queue)
        }
    
    def _start_ai_match(self, player_id: str, nickname: str) -> Dict:
        """开始AI对战"""
        # 随机选择3个AI
        selected_ai = random.sample(self.ai_players, 3)
        
        match_id = f'match_ai_{int(time.time())}_{player_id}'
        
        match = {
            'match_id': match_id,
            'mode': MatchMode.AI_ONLY.value,
            'players': [
                {'player_id': player_id, 'nickname': nickname, 'is_ai': False}
            ] + [
                {'player_id': ai['player_id'], 'nickname': ai['nickname'], 'is_ai': True}
                for ai in selected_ai
            ],
            'start_time': int(time.time()),
            'status': 'playing'
        }
        
        self.active_matches[match_id] = match
        
        return {
            'success': True,
            'message': '✅ 匹配成功！1vs3AI对战开始！',
            'match_id': match_id,
            'mode': 'ai_only',
            'players': match['players'],
            'is_ai_match': True
        }
    
    def _try_match_pvp(self) -> Optional[Dict]:
        """尝试匹配PVP玩家"""
        config = self.mode_config[MatchMode.PVP]
        
        if len(self.matching_queue) < config['min_players']:
            return None
        
        # 取出前4个玩家
        matched_ids = self.matching_queue[:4]
        self.matching_queue = self.matching_queue[4:]
        
        match_id = f'match_pvp_{int(time.time())}'
        
        match = {
            'match_id': match_id,
            'mode': MatchMode.PVP.value,
            'players': [
                {
                    'player_id': pid,
                    'nickname': self.online_players[pid]['nickname'],
                    'is_ai': False
                }
                for pid in matched_ids
            ],
            'start_time': int(time.time()),
            'status': 'playing'
        }
        
        self.active_matches[match_id] = match
        
        # 清理已匹配玩家
        for pid in matched_ids:
            del self.online_players[pid]
        
        return match
    
    def cancel_matchmaking(self, player_id: str) -> Dict:
        """取消匹配"""
        if player_id in self.matching_queue:
            self.matching_queue.remove(player_id)
        
        if player_id in self.online_players:
            del self.online_players[player_id]
        
        return {'success': True, 'message': '✅ 已取消匹配'}
    
    def get_match_status(self, match_id: str) -> Optional[Dict]:
        """获取比赛状态"""
        return self.active_matches.get(match_id)
    
    def end_match(self, match_id: str, winner_id: str, results: List[Dict]) -> Dict:
        """结束比赛"""
        if match_id not in self.active_matches:
            return {'success': False, 'error': '比赛不存在'}
        
        match = self.active_matches[match_id]
        match['status'] = 'ended'
        match['winner'] = winner_id
        match['results'] = results
        match['end_time'] = int(time.time())
        
        return {
            'success': True,
            'message': '比赛已结束',
            'winner': winner_id,
            'duration': match['end_time'] - match['start_time']
        }
    
    def switch_mode(self, current_mode: MatchMode, target_mode: MatchMode) -> Dict:
        """切换匹配模式配置 - 用于测试/生产环境切换"""
        if target_mode not in self.mode_config:
            return {'success': False, 'error': '目标模式不存在'}
        
        # 清空当前队列
        for pid in self.matching_queue[:]:
            if pid in self.online_players:
                del self.online_players[pid]
        self.matching_queue.clear()
        
        return {
            'success': True,
            'message': f'✅ 已切换到{self.mode_config[target_mode]["name"]}模式',
            'from': current_mode.value,
            'to': target_mode.value
        }
    
    def get_system_status(self) -> Dict:
        """获取系统状态"""
        return {
            'online_players': len(self.online_players),
            'matching_queue': len(self.matching_queue),
            'active_matches': len(self.active_matches),
            'ai_players_available': len(self.ai_players),
            'modes': {
                mode.value: {
                    'enabled': config['enabled'],
                    'players_needed': config['max_players']
                }
                for mode, config in self.mode_config.items()
            }
        }

# 全局实例
matchmaker = GameMatchmaker()

print("✅ 智能匹配系统初始化完成")
print("🎮 支持模式:")
print("   - 1vs3AI (测试模式)")
print("   - 1vs3真人 (在线模式)")
print("   - 排位赛匹配")
print(f"🤖 系统AI: 80个")
print("⚡ 一键切换AI/真人")
