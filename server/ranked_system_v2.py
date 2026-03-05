"""
Tower of Fate: 首登者 - 排位赛系统
命运塔·首登者 - Ranked System

段位结构:
- 青铜: 13级 (2-A)
- 白银: 13级 (13-1)  
- 黄金: 13级
- 铂金: 13级
- 钻石: 13级
- 星耀: 13级
- 王者: 13级
- 首位好运: 1级 (最高荣誉)

晋级规则: 连续13次通关13层塔
"""
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field

# 段位配置
RANKS = {
    'bronze': {'name': '青铜', 'levels': 13, 'points_per_win': 10, 'icon': '🥉'},
    'silver': {'name': '白银', 'levels': 13, 'points_per_win': 15, 'icon': '🥈'},
    'gold': {'name': '黄金', 'levels': 13, 'points_per_win': 20, 'icon': '🥇'},
    'platinum': {'name': '铂金', 'levels': 13, 'points_per_win': 25, 'icon': '💎'},
    'diamond': {'name': '钻石', 'levels': 13, 'points_per_win': 30, 'icon': '💠'},
    'star': {'name': '星耀', 'levels': 13, 'points_per_win': 35, 'icon': '⭐'},
    'king': {'name': '王者', 'levels': 13, 'points_per_win': 40, 'icon': '👑'},
    'first_lucky': {'name': '首位好运', 'levels': 1, 'points_per_win': 50, 'icon': '🍀'}
}

RANK_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'star', 'king', 'first_lucky']

@dataclass
class RankedPlayer:
    player_id: str
    nickname: str
    current_rank: str = 'bronze'  # 当前大段位
    current_level: int = 1  # 当前小等级 (1-13)
    points: int = 0  # 当前积分
    total_wins: int = 0
    total_losses: int = 0
    consecutive_wins: int = 0  # 连胜次数（关键）
    highest_rank: str = 'bronze'
    rank_history: List[Dict] = field(default_factory=list)
    season_rewards_claimed: List[str] = field(default_factory=list)

class RankedSystem:
    """排位赛系统 - 命运塔·首登者"""
    
    def __init__(self):
        self.players: Dict[str, RankedPlayer] = {}
        self.leaderboard: List[Dict] = []
        self.season_start = int(time.time())
        self.season_duration = 30 * 24 * 3600  # 30天赛季
        
    def get_player_rank(self, player_id: str) -> Optional[RankedPlayer]:
        """获取玩家排位信息"""
        return self.players.get(player_id)
    
    def init_player(self, player_id: str, nickname: str) -> RankedPlayer:
        """初始化玩家排位数据"""
        if player_id not in self.players:
            self.players[player_id] = RankedPlayer(
                player_id=player_id,
                nickname=nickname
            )
        return self.players[player_id]
    
    def record_match(self, player_id: str, is_win: bool, is_perfect: bool = False, 
                     reached_top: bool = False, guard_rounds: int = 0) -> Dict:
        """记录比赛结果并计算积分"""
        player = self.players.get(player_id)
        if not player:
            return {'success': False, 'error': '玩家不存在'}
        
        result = {
            'success': True,
            'player_id': player_id,
            'is_win': is_win,
            'points_earned': 0,
            'rank_changed': False,
            'promotion': False,
            'messages': []
        }
        
        if is_win:
            # 基础胜利积分
            rank_config = RANKS[player.current_rank]
            base_points = rank_config['points_per_win']
            
            # 连胜加成
            player.consecutive_wins += 1
            consecutive_bonus = min(player.consecutive_wins * 2, 20)  # 最高20分连胜加成
            
            # 完美匹配加成
            perfect_bonus = 10 if is_perfect else 0
            
            # 登顶加成
            top_bonus = 50 if reached_top else 0
            
            # 守卫轮数加成
            guard_bonus = guard_rounds * 10 if guard_rounds > 0 else 0
            
            total_points = base_points + consecutive_bonus + perfect_bonus + top_bonus + guard_bonus
            player.points += total_points
            player.total_wins += 1
            
            result['points_earned'] = total_points
            result['messages'].append(f'+{base_points} 基础胜利')
            if consecutive_bonus > 0:
                result['messages'].append(f'+{consecutive_bonus} 连胜奖励 (x{player.consecutive_wins})')
            if perfect_bonus > 0:
                result['messages'].append(f'+{perfect_bonus} 完美匹配')
            if top_bonus > 0:
                result['messages'].append(f'+{top_bonus} 登顶奖励')
            if guard_bonus > 0:
                result['messages'].append(f'+{guard_bonus} 守卫奖励')
            
            # 检查晋级（关键逻辑：连续13次通关才能晋级）
            if player.consecutive_wins >= 13:
                promo_result = self._check_promotion(player)
                if promo_result['promoted']:
                    result['rank_changed'] = True
                    result['promotion'] = True
                    result['messages'].append(f'🎉 恭喜晋级！{promo_result["message"]}')
                    player.consecutive_wins = 0  # 重置连胜
                
        else:
            # 失败
            player.consecutive_wins = 0  # 重置连胜
            player.total_losses += 1
            # 扣分保护（不会掉大段）
            if player.points > 0:
                points_lost = min(5, player.points)
                player.points -= points_lost
                result['points_earned'] = -points_lost
                result['messages'].append(f'-{points_lost} 失败扣除')
        
        # 更新最高段位记录
        current_rank_index = RANK_ORDER.index(player.current_rank)
        highest_rank_index = RANK_ORDER.index(player.highest_rank)
        if current_rank_index > highest_rank_index:
            player.highest_rank = player.current_rank
        
        return result
    
    def _check_promotion(self, player: RankedPlayer) -> Dict:
        """检查晋级条件 - 连续13次通关才能晋级"""
        result = {'promoted': False, 'message': ''}
        
        current_rank_config = RANKS[player.current_rank]
        
        # 检查是否达到小等级上限
        if player.current_level < current_rank_config['levels']:
            # 小等级提升
            player.current_level += 1
            result['promoted'] = True
            result['message'] = f'{current_rank_config["name"]} {player.current_level}级'
        else:
            # 大段位提升
            current_index = RANK_ORDER.index(player.current_rank)
            if current_index < len(RANK_ORDER) - 1:
                next_rank = RANK_ORDER[current_index + 1]
                player.current_rank = next_rank
                player.current_level = 1
                
                # 记录历史
                player.rank_history.append({
                    'rank': next_rank,
                    'time': int(time.time()),
                    'season': self.get_current_season()
                })
                
                result['promoted'] = True
                result['message'] = f'🎊 {RANKS[next_rank]["name"]}！'
        
        return result
    
    def get_rank_title(self, player_id: str) -> str:
        """获取完整段位称号"""
        player = self.players.get(player_id)
        if not player:
            return '青铜 1级'
        
        rank_config = RANKS[player.current_rank]
        
        if player.current_rank == 'first_lucky':
            return f'{rank_config["icon"]} 首位好运 - 命运的眷顾者'
        
        level_display = player.current_level
        if player.current_rank == 'silver':
            # 白银显示 13-1
            level_display = 14 - player.current_level
        
        return f'{rank_config["icon"]} {rank_config["name"]} {level_display}级'
    
    def get_leaderboard(self, limit: int = 100) -> List[Dict]:
        """获取排行榜"""
        sorted_players = sorted(
            self.players.values(),
            key=lambda p: (
                RANK_ORDER.index(p.current_rank),
                p.current_level,
                p.points
            ),
            reverse=True
        )[:limit]
        
        return [
            {
                'rank': i + 1,
                'player_id': p.player_id,
                'nickname': p.nickname,
                'title': self.get_rank_title(p.player_id),
                'points': p.points,
                'wins': p.total_wins,
                'win_rate': f"{p.total_wins/(p.total_wins+p.total_losses)*100:.1f}%" if (p.total_wins+p.total_losses) > 0 else '0%',
                'consecutive': p.consecutive_wins
            }
            for i, p in enumerate(sorted_players)
        ]
    
    def get_current_season(self) -> str:
        """获取当前赛季"""
        season_num = (int(time.time()) - self.season_start) // self.season_duration + 1
        return f'S{season_num}'
    
    def get_season_rewards(self, player_id: str) -> List[Dict]:
        """获取赛季奖励"""
        player = self.players.get(player_id)
        if not player:
            return []
        
        rewards = []
        current_rank_index = RANK_ORDER.index(player.current_rank)
        
        # 根据最高段位发放奖励
        for i, rank_key in enumerate(RANK_ORDER[:current_rank_index + 1]):
            if rank_key not in player.season_rewards_claimed:
                rank_config = RANKS[rank_key]
                rewards.append({
                    'rank': rank_key,
                    'name': rank_config['name'],
                    'reward': self._get_rank_reward(rank_key),
                    'claimed': False
                })
        
        return rewards
    
    def _get_rank_reward(self, rank_key: str) -> Dict:
        """获取段位奖励"""
        rewards = {
            'bronze': {'diamonds': 100, 'coins': 1000, 'title': '青铜勇士'},
            'silver': {'diamonds': 200, 'coins': 2000, 'title': '白银先锋'},
            'gold': {'diamonds': 300, 'coins': 3000, 'title': '黄金强者'},
            'platinum': {'diamonds': 500, 'coins': 5000, 'title': '铂金大师'},
            'diamond': {'diamonds': 800, 'coins': 8000, 'title': '钻石王者'},
            'star': {'diamonds': 1200, 'coins': 12000, 'title': '星耀传说'},
            'king': {'diamonds': 2000, 'coins': 20000, 'title': '最强王者'},
            'first_lucky': {'diamonds': 5000, 'coins': 50000, 'title': '命运之子', 'exclusive_skin': '首登者专属'}
        }
        return rewards.get(rank_key, {})
    
    def claim_season_reward(self, player_id: str, rank_key: str) -> Dict:
        """领取赛季奖励"""
        player = self.players.get(player_id)
        if not player:
            return {'success': False, 'error': '玩家不存在'}
        
        if rank_key in player.season_rewards_claimed:
            return {'success': False, 'error': '奖励已领取'}
        
        player.season_rewards_claimed.append(rank_key)
        reward = self._get_rank_reward(rank_key)
        
        return {
            'success': True,
            'reward': reward,
            'message': f'✅ 成功领取{RANKS[rank_key]["name"]}段位奖励！'
        }
    
    def get_rank_matchmaking(self, player_id: str) -> List[str]:
        """获取相近段位玩家进行匹配"""
        player = self.players.get(player_id)
        if not player:
            return []
        
        current_index = RANK_ORDER.index(player.current_rank)
        
        # 匹配相近段位的玩家（前后2个段位）
        match_ranks = RANK_ORDER[max(0, current_index-2):min(len(RANK_ORDER), current_index+3)]
        
        matched = []
        for pid, p in self.players.items():
            if pid != player_id and p.current_rank in match_ranks:
                matched.append(pid)
        
        return matched[:3]  # 返回最多3个匹配玩家

# 全局实例
ranked_system = RankedSystem()

print("✅ 排位赛系统初始化完成")
print("📊 命运塔·首登者排位系统")
print("📈 8大段位，每段13级")
print("🎯 连续13次通关晋级")
