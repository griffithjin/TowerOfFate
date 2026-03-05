"""
Tower of Fate: 首登者 - 连胜模式
Streak Mode - 连续13次登顶挑战
"""
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field

@dataclass
class StreakGame:
    game_id: str
    player_id: str
    mode: str  # 'solo' 或 'team'
    streak_count: int = 0  # 当前连胜次数
    max_streak: int = 13   # 需要13次登顶
    current_level: int = 1
    is_active: bool = True
    attempts: int = 0      # 尝试次数
    start_time: int = 0
    best_streak: int = 0   # 最佳记录
    rewards_earned: List[Dict] = field(default_factory=list)

class StreakModeSystem:
    """连胜模式系统 - 连续13次登顶挑战"""
    
    def __init__(self):
        self.active_games: Dict[str, StreakGame] = {}
        self.player_records: Dict[str, Dict] = {}  # 玩家连胜记录
        self.leaderboard: List[Dict] = []
        
        # 连胜奖励配置
        self.STREAK_REWARDS = {
            3: {'name': '初露锋芒', 'diamonds': 30, 'coins': 300, 'title': '连胜新手'},
            5: {'name': '五连绝世', 'diamonds': 50, 'coins': 500, 'title': '连胜高手'},
            7: {'name': '七连王者', 'diamonds': 100, 'coins': 1000, 'title': '连胜专家'},
            10: {'name': '十连传说', 'diamonds': 200, 'coins': 2000, 'title': '连胜大师'},
            13: {'name': '完美登顶', 'diamonds': 500, 'coins': 5000, 'title': '首登者', 'exclusive_reward': True}
        }
    
    def start_streak_game(self, player_id: str, mode: str = 'solo') -> Dict:
        """开始连胜挑战"""
        game_id = f"streak_{player_id}_{int(time.time())}"
        
        game = StreakGame(
            game_id=game_id,
            player_id=player_id,
            mode=mode,
            start_time=int(time.time())
        )
        
        self.active_games[game_id] = game
        
        # 初始化玩家记录
        if player_id not in self.player_records:
            self.player_records[player_id] = {
                'best_streak': 0,
                'total_attempts': 0,
                'completed_13': 0,
                'current_streak': 0
            }
        
        self.player_records[player_id]['total_attempts'] += 1
        
        return {
            'success': True,
            'game_id': game_id,
            'message': '🎯 连胜模式开始！连续13次登顶即为胜利！',
            'rules': {
                'target': '连续13次登顶13层塔',
                'current_streak': 0,
                'max_streak': 13,
                'rewards': self._get_rewards_preview()
            }
        }
    
    def record_climb(self, game_id: str, success: bool) -> Dict:
        """记录一次登顶尝试"""
        if game_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[game_id]
        
        if not game.is_active:
            return {'success': False, 'error': '游戏已结束'}
        
        result = {
            'success': True,
            'streak_maintained': False,
            'rewards': [],
            'game_over': False
        }
        
        if success:
            # 登顶成功
            game.streak_count += 1
            game.best_streak = max(game.best_streak, game.streak_count)
            result['streak_maintained'] = True
            
            # 检查是否达成奖励
            if game.streak_count in self.STREAK_REWARDS:
                reward = self.STREAK_REWARDS[game.streak_count]
                result['rewards'].append(reward)
                game.rewards_earned.append(reward)
                
                # 发送奖励通知
                result['reward_message'] = f'🎉 达成{game.streak_count}连！获得「{reward["title"]}」称号！'
            
            # 检查是否完成13连
            if game.streak_count >= 13:
                result['victory'] = True
                result['message'] = '🏆 恭喜！完美13连登顶！你获得了「首登者」称号！'
                game.is_active = False
                
                # 更新记录
                player_id = game.player_id
                self.player_records[player_id]['completed_13'] += 1
                self.player_records[player_id]['best_streak'] = max(
                    self.player_records[player_id]['best_streak'],
                    13
                )
                
                # 发放终极奖励
                final_reward = self.STREAK_REWARDS[13]
                result['final_reward'] = final_reward
                
        else:
            # 登顶失败，连胜中断
            game.attempts += 1
            
            # 记录最佳成绩
            player_id = game.player_id
            self.player_records[player_id]['best_streak'] = max(
                self.player_records[player_id]['best_streak'],
                game.streak_count
            )
            
            result['streak_broken'] = True
            result['final_streak'] = game.streak_count
            result['message'] = f'💔 连胜中断！最终成绩: {game.streak_count}连'
            
            # 如果已经有一些连胜，保留进度可以重新开始
            if game.streak_count >= 3:
                result['tip'] = f'已经很不错了！再试一次，争取突破{game.streak_count}连！'
            
            # 结束游戏
            game.is_active = False
        
        return result
    
    def get_streak_status(self, game_id: str) -> Dict:
        """获取连胜状态"""
        if game_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[game_id]
        
        return {
            'success': True,
            'streak_count': game.streak_count,
            'max_streak': game.max_streak,
            'progress_percent': (game.streak_count / game.max_streak) * 100,
            'is_active': game.is_active,
            'attempts': game.attempts,
            'time_elapsed': int(time.time()) - game.start_time,
            'next_reward': self._get_next_reward(game.streak_count),
            'rewards_so_far': game.rewards_earned
        }
    
    def _get_next_reward(self, current_streak: int) -> Optional[Dict]:
        """获取下一个奖励"""
        for streak, reward in sorted(self.STREAK_REWARDS.items()):
            if streak > current_streak:
                return {'streak_required': streak, **reward}
        return None
    
    def _get_rewards_preview(self) -> List[Dict]:
        """获取奖励预览"""
        return [
            {'streak': k, **v} for k, v in sorted(self.STREAK_REWARDS.items())
        ]
    
    def get_player_stats(self, player_id: str) -> Dict:
        """获取玩家连胜统计"""
        record = self.player_records.get(player_id, {
            'best_streak': 0,
            'total_attempts': 0,
            'completed_13': 0
        })
        
        # 计算称号
        title = '连胜新手'
        if record['completed_13'] >= 10:
            title = '传奇首登者'
        elif record['completed_13'] >= 5:
            title = '资深首登者'
        elif record['completed_13'] >= 1:
            title = '首登者'
        elif record['best_streak'] >= 10:
            title = '连胜大师'
        elif record['best_streak'] >= 7:
            title = '连胜专家'
        elif record['best_streak'] >= 5:
            title = '连胜高手'
        
        return {
            **record,
            'title': title,
            'completion_rate': f"{record['completed_13'] / max(record['total_attempts'], 1) * 100:.1f}%"
        }
    
    def get_leaderboard(self, limit: int = 100) -> List[Dict]:
        """获取连胜排行榜"""
        rankings = []
        
        for player_id, record in self.player_records.items():
            rankings.append({
                'player_id': player_id,
                'best_streak': record['best_streak'],
                'completed_13': record['completed_13'],
                'total_attempts': record['total_attempts'],
                'score': record['best_streak'] * 10 + record['completed_13'] * 100
            })
        
        return sorted(rankings, key=lambda x: x['score'], reverse=True)[:limit]
    
    def get_difficulty_multiplier(self, streak: int) -> float:
        """根据连胜次数增加难度"""
        # 连胜越高，AI越强
        if streak >= 10:
            return 1.5  # AI强度150%
        elif streak >= 7:
            return 1.3  # AI强度130%
        elif streak >= 5:
            return 1.2  # AI强度120%
        elif streak >= 3:
            return 1.1  # AI强度110%
        return 1.0

# 全局实例
streak_system = StreakModeSystem()

print("✅ 连胜模式系统初始化完成")
print("🎯 连续13次登顶挑战")
print("🏆 5档连胜奖励")
print("⚡ 难度递增机制")
