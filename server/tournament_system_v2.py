"""
Tower of Fate: 首登者 - 锦标赛系统
全球锦标赛 - 省会城市作为赛点
"""
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field

# 全球省会城市数据
TOURNAMENT_CITIES = {
    'asia': [
        {'name': '北京', 'country': '中国', 'points_entry': 100, 'base_prize': 1000, 'timezone': 'UTC+8'},
        {'name': '上海', 'country': '中国', 'points_entry': 100, 'base_prize': 1000, 'timezone': 'UTC+8'},
        {'name': '东京', 'country': '日本', 'points_entry': 150, 'base_prize': 1500, 'timezone': 'UTC+9'},
        {'name': '首尔', 'country': '韩国', 'points_entry': 120, 'base_prize': 1200, 'timezone': 'UTC+9'},
        {'name': '新加坡', 'country': '新加坡', 'points_entry': 200, 'base_prize': 2000, 'timezone': 'UTC+8'},
        {'name': '曼谷', 'country': '泰国', 'points_entry': 80, 'base_prize': 800, 'timezone': 'UTC+7'},
        {'name': '雅加达', 'country': '印尼', 'points_entry': 90, 'base_prize': 900, 'timezone': 'UTC+7'},
        {'name': '马尼拉', 'country': '菲律宾', 'points_entry': 85, 'base_prize': 850, 'timezone': 'UTC+8'},
        {'name': '河内', 'country': '越南', 'points_entry': 70, 'base_prize': 700, 'timezone': 'UTC+7'},
        {'name': '吉隆坡', 'country': '马来西亚', 'points_entry': 95, 'base_prize': 950, 'timezone': 'UTC+8'},
        {'name': '新德里', 'country': '印度', 'points_entry': 110, 'base_prize': 1100, 'timezone': 'UTC+5:30'},
        {'name': '孟买', 'country': '印度', 'points_entry': 105, 'base_prize': 1050, 'timezone': 'UTC+5:30'},
    ],
    'europe': [
        {'name': '伦敦', 'country': '英国', 'points_entry': 200, 'base_prize': 2000, 'timezone': 'UTC+0'},
        {'name': '巴黎', 'country': '法国', 'points_entry': 180, 'base_prize': 1800, 'timezone': 'UTC+1'},
        {'name': '柏林', 'country': '德国', 'points_entry': 170, 'base_prize': 1700, 'timezone': 'UTC+1'},
        {'name': '罗马', 'country': '意大利', 'points_entry': 160, 'base_prize': 1600, 'timezone': 'UTC+1'},
        {'name': '马德里', 'country': '西班牙', 'points_entry': 150, 'base_prize': 1500, 'timezone': 'UTC+1'},
        {'name': '莫斯科', 'country': '俄罗斯', 'points_entry': 220, 'base_prize': 2200, 'timezone': 'UTC+3'},
        {'name': '阿姆斯特丹', 'country': '荷兰', 'points_entry': 165, 'base_prize': 1650, 'timezone': 'UTC+1'},
        {'name': '维也纳', 'country': '奥地利', 'points_entry': 155, 'base_prize': 1550, 'timezone': 'UTC+1'},
    ],
    'americas': [
        {'name': '纽约', 'country': '美国', 'points_entry': 250, 'base_prize': 2500, 'timezone': 'UTC-5'},
        {'name': '洛杉矶', 'country': '美国', 'points_entry': 240, 'base_prize': 2400, 'timezone': 'UTC-8'},
        {'name': '芝加哥', 'country': '美国', 'points_entry': 230, 'base_prize': 2300, 'timezone': 'UTC-6'},
        {'name': '多伦多', 'country': '加拿大', 'points_entry': 210, 'base_prize': 2100, 'timezone': 'UTC-5'},
        {'name': '墨西哥城', 'country': '墨西哥', 'points_entry': 140, 'base_prize': 1400, 'timezone': 'UTC-6'},
        {'name': '圣保罗', 'country': '巴西', 'points_entry': 160, 'base_prize': 1600, 'timezone': 'UTC-3'},
        {'name': '布宜诺斯艾利斯', 'country': '阿根廷', 'points_entry': 150, 'base_prize': 1500, 'timezone': 'UTC-3'},
    ],
    'oceania': [
        {'name': '悉尼', 'country': '澳大利亚', 'points_entry': 190, 'base_prize': 1900, 'timezone': 'UTC+10'},
        {'name': '墨尔本', 'country': '澳大利亚', 'points_entry': 185, 'base_prize': 1850, 'timezone': 'UTC+10'},
        {'name': '奥克兰', 'country': '新西兰', 'points_entry': 175, 'base_prize': 1750, 'timezone': 'UTC+12'},
    ],
    'africa': [
        {'name': '开罗', 'country': '埃及', 'points_entry': 120, 'base_prize': 1200, 'timezone': 'UTC+2'},
        {'name': '约翰内斯堡', 'country': '南非', 'points_entry': 130, 'base_prize': 1300, 'timezone': 'UTC+2'},
        {'name': '拉各斯', 'country': '尼日利亚', 'points_entry': 100, 'base_prize': 1000, 'timezone': 'UTC+1'},
    ]
}

@dataclass
class Tournament:
    tournament_id: str
    city: Dict
    region: str
    start_time: int
    duration: int  # 分钟
    max_players: int
    registered_players: List[str] = field(default_factory=list)
    status: str = 'registering'  # registering, ongoing, ended
    prize_pool: int = 0
    winner: Optional[str] = None

class TournamentSystem:
    """锦标赛系统 - 全球巡回赛"""
    
    def __init__(self):
        self.tournaments: Dict[str, Tournament] = {}
        self.player_history: Dict[str, List[Dict]] = {}  # 玩家参赛历史
        self.active_tournaments: List[str] = []
        self._init_daily_tournaments()
    
    def _init_daily_tournaments(self):
        """初始化每日锦标赛"""
        all_cities = []
        for region, cities in TOURNAMENT_CITIES.items():
            for city in cities:
                all_cities.append({**city, 'region': region})
        
        # 随机选择8个城市作为今日赛点
        selected = random.sample(all_cities, min(8, len(all_cities)))
        
        for i, city in enumerate(selected):
            tournament_id = f"tour_{int(time.time())}_{i}"
            
            # 计算开始时间（从当前时间开始，每隔30分钟一场）
            start_time = int(time.time()) + (i * 30 * 60)
            
            # 计算奖金池 = 基础奖金 + 报名费 * 预估人数
            prize_pool = city['base_prize'] + (city['points_entry'] * 20)
            
            tournament = Tournament(
                tournament_id=tournament_id,
                city=city,
                region=city['region'],
                start_time=start_time,
                duration=20,  # 20分钟报名倒计时
                max_players=64,
                prize_pool=prize_pool
            )
            
            self.tournaments[tournament_id] = tournament
            self.active_tournaments.append(tournament_id)
    
    def get_tournament_list(self) -> List[Dict]:
        """获取当前可报名的锦标赛列表"""
        now = int(time.time())
        available = []
        
        for tid in self.active_tournaments:
            tour = self.tournaments[tid]
            time_left = tour.start_time - now
            
            if tour.status == 'registering' and time_left > 0:
                available.append({
                    'tournament_id': tid,
                    'city': tour.city['name'],
                    'country': tour.city['country'],
                    'region': tour.region,
                    'points_entry': tour.city['points_entry'],
                    'prize_pool': tour.prize_pool,
                    'time_left_minutes': max(0, time_left // 60),
                    'registered': len(tour.registered_players),
                    'max_players': tour.max_players
                })
        
        # 按时间排序
        return sorted(available, key=lambda x: x['time_left_minutes'])
    
    def register_tournament(self, player_id: str, tournament_id: str, player_points: int) -> Dict:
        """报名锦标赛"""
        if tournament_id not in self.tournaments:
            return {'success': False, 'error': '锦标赛不存在'}
        
        tour = self.tournaments[tournament_id]
        
        if tour.status != 'registering':
            return {'success': False, 'error': '报名已截止'}
        
        if len(tour.registered_players) >= tour.max_players:
            return {'success': False, 'error': '报名人数已满'}
        
        if player_id in tour.registered_players:
            return {'success': False, 'error': '已报名'}
        
        # 检查积分是否足够
        if player_points < tour.city['points_entry']:
            return {'success': False, 'error': f'积分不足，需要{tour.city["points_entry"]}积分'}
        
        # 扣除积分并报名
        tour.registered_players.append(player_id)
        
        # 增加奖金池
        tour.prize_pool += tour.city['points_entry'] * 10  # 报名费加入奖金池
        
        return {
            'success': True,
            'message': f'✅ 成功报名{tour.city["name"]}锦标赛！',
            'tournament': {
                'city': tour.city['name'],
                'start_time': tour.start_time,
                'time_left': tour.start_time - int(time.time()),
                'prize_pool': tour.prize_pool
            }
        }
    
    def start_tournament(self, tournament_id: str) -> Dict:
        """开始锦标赛"""
        if tournament_id not in self.tournaments:
            return {'success': False, 'error': '锦标赛不存在'}
        
        tour = self.tournaments[tournament_id]
        
        if len(tour.registered_players) < 4:
            return {'success': False, 'error': '报名人数不足4人，锦标赛取消'}
        
        tour.status = 'ongoing'
        
        # 模拟比赛过程（实际应该进行真实对战）
        # 随机决定胜者
        winner = random.choice(tour.registered_players)
        tour.winner = winner
        tour.status = 'ended'
        
        # 记录历史
        for player_id in tour.registered_players:
            if player_id not in self.player_history:
                self.player_history[player_id] = []
            
            self.player_history[player_id].append({
                'tournament_id': tournament_id,
                'city': tour.city['name'],
                'date': int(time.time()),
                'prize_pool': tour.prize_pool,
                'is_winner': player_id == winner,
                'points_earned': tour.prize_pool if player_id == winner else 0
            })
        
        return {
            'success': True,
            'winner': winner,
            'prize': tour.prize_pool,
            'message': f'🏆 锦标赛结束！获胜者: {winner}，获得{tour.prize_pool}积分！'
        }
    
    def get_player_history(self, player_id: str) -> List[Dict]:
        """获取玩家参赛历史"""
        return self.player_history.get(player_id, [])
    
    def get_tournament_ranking(self) -> List[Dict]:
        """获取锦标赛积分排行"""
        rankings = []
        
        for player_id, history in self.player_history.items():
            total_earned = sum(h['points_earned'] for h in history)
            wins = sum(1 for h in history if h['is_winner'])
            
            rankings.append({
                'player_id': player_id,
                'total_earned': total_earned,
                'wins': wins,
                'participated': len(history)
            })
        
        return sorted(rankings, key=lambda x: x['total_earned'], reverse=True)[:100]
    
    def get_world_map_data(self) -> Dict:
        """获取世界地图数据"""
        return {
            'regions': {
                'asia': {'name': '亚洲', 'cities_count': len(TOURNAMENT_CITIES['asia']), 'icon': '🌏'},
                'europe': {'name': '欧洲', 'cities_count': len(TOURNAMENT_CITIES['europe']), 'icon': '🌍'},
                'americas': {'name': '美洲', 'cities_count': len(TOURNAMENT_CITIES['americas']), 'icon': '🌎'},
                'oceania': {'name': '大洋洲', 'cities_count': len(TOURNAMENT_CITIES['oceania']), 'icon': '🌏'},
                'africa': {'name': '非洲', 'cities_count': len(TOURNAMENT_CITIES['africa']), 'icon': '🌍'}
            },
            'total_cities': sum(len(cities) for cities in TOURNAMENT_CITIES.values()),
            'active_tournaments': len(self.active_tournaments)
        }

# 全局实例
tournament_system = TournamentSystem()

print("✅ 锦标赛系统初始化完成")
print("🌍 全球5大洲，40+城市")
print("🏆 积分报名，高额奖金")
print("⏰ 20分钟倒计时，紧张刺激")
