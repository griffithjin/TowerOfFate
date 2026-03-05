"""
命运塔·首登者 - 赛季系统与荣誉系统
Season System & Honor System
"""
import time
import random
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum

class SeasonTheme(Enum):
    """赛季主题"""
    BLITZ = "blitz"                    # 闪电战
    GUARD_CODEX = "guard_codex"        # 守卫密令
    COMMONER_CROWN = "commoner_crown"  # 平民英雄
    TWIN_DUEL = "twin_duel"            # 双生对决
    FORBIDDEN_SUIT = "forbidden_suit"  # 禁忌之牌
    MASTER_PATH = "master_path"        # 大师之路
    STANDARD = "standard"              # 标准模式

@dataclass
class SeasonThemeConfig:
    """赛季主题配置"""
    theme_id: str
    name: str
    name_en: str
    description: str
    duration_days: int
    core_rules: Dict
    special_mechanics: Dict
    rewards: Dict

# ============================================
# 6大赛季主题配置
# ============================================
SEASON_THEMES = {
    SeasonTheme.BLITZ: SeasonThemeConfig(
        theme_id="blitz",
        name="闪电战",
        name_en="Blitz",
        description="游戏节奏加快，10秒内必须完成选牌",
        duration_days=30,
        core_rules={
            'turn_time_limit': 10,           # 10秒选牌限制
            'auto_select_on_timeout': True,  # 超时自动选牌
            'speed_bonus_enabled': True,     # 快速选牌奖励
            'speed_bonus_time': 5,           # 5秒内选牌有奖励
            'speed_bonus_reward': 'destiny_card'  # 奖励天命牌
        },
        special_mechanics={
            'fast_play_tracking': True,      # 追踪快速选牌
            'combo_system': True,            # 连续快速选牌连击
            'adrenaline_mode': {             # 肾上腺素模式
                'trigger': '3_fast_plays',
                'effect': 'double_points_for_3_turns'
            }
        },
        rewards={
            'season_frame': 'lightning_border',  # 赛季头像框
            'title': '闪电之影',
            'card_skin': 'thunder_speed'
        }
    ),
    
    SeasonTheme.GUARD_CODEX: SeasonThemeConfig(
        theme_id="guard_codex",
        name="守卫密令",
        name_en="Guard's Codex",
        description="守卫牌变成两张，匹配一张晋升一层，匹配两张晋升两层",
        duration_days=30,
        core_rules={
            'guard_cards_count': 2,          # 两张守卫牌
            'match_one_promote': 1,          # 匹配一张晋升1层
            'match_two_promote': 2,          # 匹配两张晋升2层
            'guard_reveal_order': 'sequential'  # 依次揭示
        },
        special_mechanics={
            'dual_guard_tracking': True,     # 追踪双守卫匹配
            'guard_prediction': True,        # 可以预测守卫牌
            'synergy_bonus': {               # 协同奖励
                'team_mode': True,
                'both_teammates_match': 'extra_destiny'
            }
        },
        rewards={
            'season_frame': 'dual_guardian_border',
            'title': '双面守护者',
            'card_skin': 'codex_mystery'
        }
    ),
    
    SeasonTheme.COMMONER_CROWN: SeasonThemeConfig(
        theme_id="commoner_crown",
        name="平民英雄",
        name_en="Commoner's Crown",
        description="只有2-10的普通牌可以晋升，A/J/Q/K无效",
        duration_days=30,
        core_rules={
            'valid_ranks': ['2','3','4','5','6','7','8','9','10'],  # 有效牌
            'invalid_ranks': ['A','J','Q','K'],                      # 无效牌
            'invalid_penalty': False,      # 无效牌不惩罚，只是不晋升
            'commoner_bonus': True,        # 平民牌额外奖励
            'commoner_bonus_points': 20    # 每张平民牌+20分
        },
        special_mechanics={
            'grassroots_mode': True,       # 草根模式
            'underdog_bonus': {            # 逆袭奖励
                'last_place_promote': 'double_points'
            }
        },
        rewards={
            'season_frame': 'commoner_border',
            'title': '平民逆袭',
            'card_back': 'grassroot_king',
            'title_rare': '草根之王'
        }
    ),
    
    SeasonTheme.TWIN_DUEL: SeasonThemeConfig(
        theme_id="twin_duel",
        name="双生对决",
        name_en="Twin Duel",
        description="每回合可选两张牌，匹配一张晋升一层，匹配两张晋升两层",
        duration_days=30,
        core_rules={
            'cards_per_turn': 2,           # 每回合两张牌
            'match_one_promote': 1,
            'match_two_promote': 2,
            'dual_select_time': 20,        # 双选时间20秒
            'combo_system': True
        },
        special_mechanics={
            'dual_match_tracking': True,   # 追踪双匹配
            'gamble_system': True,         # 赌博系统
            'all_in_option': {             # 全押选项
                'match_both': 'promote_3',
                'match_one': 'stay',
                'match_none': 'down_1'
            }
        },
        rewards={
            'season_frame': 'rainbow_split_border',
            'title': '双倍豪赌',
            'card_skin': 'dual_wield'
        }
    ),
    
    SeasonTheme.FORBIDDEN_SUIT: SeasonThemeConfig(
        theme_id="forbidden_suit",
        name="禁忌之牌",
        name_en="Forbidden Suit",
        description="每回合宣布禁忌花色，打出禁忌花色无法晋升并可能受罚",
        duration_days=30,
        core_rules={
            'forbidden_suit_enabled': True,    # 启用禁忌花色
            'forbidden_penalty': -1,            # 打出禁忌牌惩罚-1层
            'announcement_delay': 3,            # 出牌前3秒公布
            'immunity_cards': ['destiny_peek'], # 可以查看的免疫牌
            'avoid_bonus': 50                   # 避开禁忌牌奖励50分
        },
        special_mechanics={
            'fate_reversal_tracking': True,     # 追踪逆天改命
            'risk_reward_system': True,         # 风险奖励系统
            'legendary_avoid': {                 # 传奇闪避
                'avoid_3_times': 'immune_next_forbidden'
            }
        },
        rewards={
            'season_frame': 'forbidden_border',
            'title': '逆天改命',
            'title_rarity': 'legendary',
            'card_skin': 'forbidden_power'
        }
    ),
    
    SeasonTheme.MASTER_PATH: SeasonThemeConfig(
        theme_id="master_path",
        name="大师之路",
        name_en="Master's Path",
        description="只有完美匹配（花色+数值都相同）才能晋升",
        duration_days=30,
        core_rules={
            'perfect_match_only': True,      # 只有完美匹配能晋升
            'partial_match_penalty': False,  # 部分匹配不惩罚
            'perfect_match_bonus': 100,      # 完美匹配+100分
            'destiny_on_perfect': True       # 完美匹配给天命牌
        },
        special_mechanics={
            'master_tracking': True,         # 追踪大师之路
            'perfection_streak': {           # 完美连击
                '3_perfect': 'destiny_card',
                '5_perfect': 'guard_skip'
            }
        },
        rewards={
            'season_frame': 'master_border',
            'title': '完美主义',
            'title_rarity': 'rare',
            'card_skin': 'perfection_glow'
        }
    ),
    
    SeasonTheme.STANDARD: SeasonThemeConfig(
        theme_id="standard",
        name="标准模式",
        name_en="Standard",
        description="经典游戏规则，标准匹配机制",
        duration_days=30,
        core_rules={
            'standard_rules': True
        },
        special_mechanics={},
        rewards={}
    )
}

# ============================================
# 荣誉系统
# ============================================

@dataclass
class Honor:
    """荣誉定义"""
    honor_id: str
    name: str
    description: str
    category: str  # 'season' 或 'eternal'
    rarity: str    # 'basic', 'rare', 'epic', 'legendary'
    condition_type: str
    condition_value: Dict
    reward_type: str
    reward_value: str
    season_theme: Optional[str] = None  # 仅赛季荣誉

# I. 赛季荣誉
SEASON_HONORS = {
    # 闪电战赛季
    'shadow_of_blitz': Honor(
        honor_id='shadow_of_blitz',
        name='闪电之影',
        description='在闪电战赛季中，单局至少5次在5秒内完成选牌',
        category='season',
        rarity='rare',
        condition_type='fast_play_count',
        condition_value={'count': 5, 'time_limit': 5},
        reward_type='frame',
        reward_value='lightning_border',
        season_theme='blitz'
    ),
    
    # 守卫密令赛季
    'twin_guardian': Honor(
        honor_id='twin_guardian',
        name='双面守护者',
        description='在守卫密令赛季中，单局至少3次同时匹配两张守卫牌',
        category='season',
        rarity='epic',
        condition_type='dual_match_count',
        condition_value={'count': 3},
        reward_type='title',
        reward_value='双面守护者',
        season_theme='guard_codex'
    ),
    
    # 平民英雄赛季
    'commoner_triumph': Honor(
        honor_id='commoner_triumph',
        name='平民逆袭',
        description='在平民英雄赛季中，作为第一名登顶',
        category='season',
        rarity='epic',
        condition_type='first_place',
        condition_value={'rank': 1},
        reward_type='title_cardback',
        reward_value='草根之王',
        season_theme='commoner_crown'
    ),
    
    # 双生对决赛季
    'double_gambler': Honor(
        honor_id='double_gambler',
        name='双倍豪赌',
        description='在双生对决赛季中，单局至少4次选择两张牌且成功率超75%',
        category='season',
        rarity='rare',
        condition_type='dual_select_success_rate',
        condition_value={'count': 4, 'rate': 0.75},
        reward_type='frame',
        reward_value='rainbow_split_border',
        season_theme='twin_duel'
    ),
    
    # 禁忌之牌赛季
    'fate_reverser': Honor(
        honor_id='fate_reverser',
        name='逆天改命',
        description='在禁忌之牌赛季中，单局至少3次在禁忌花色宣布后仍能登顶',
        category='season',
        rarity='legendary',
        condition_type='avoid_forbidden_and_win',
        condition_value={'count': 3},
        reward_type='title_legendary',
        reward_value='逆天改命',
        season_theme='forbidden_suit'
    ),
    
    # 大师之路赛季
    'perfectionist': Honor(
        honor_id='perfectionist',
        name='完美主义',
        description='在大师之路赛季中，单局至少一半的晋升都是完美匹配',
        category='season',
        rarity='rare',
        condition_type='perfect_match_ratio',
        condition_value={'ratio': 0.5},
        reward_type='title',
        reward_value='完美主义者',
        season_theme='master_path'
    ),
    
    # 通用赛季荣誉
    'season_champion': Honor(
        honor_id='season_champion',
        name='赛季冠军',
        description='在任意赛季中，成为该赛季第一个达到13层的玩家',
        category='season',
        rarity='legendary',
        condition_type='first_to_reach_13',
        condition_value={'level': 13},
        reward_type='title_hall_of_fame',
        reward_value='赛季冠军',
        season_theme=None
    )
}

# II. 永恒荣誉
ETERNAL_HONORS = {
    'first_steps': Honor(
        honor_id='first_steps',
        name='初出茅庐',
        description='完成第一场游戏',
        category='eternal',
        rarity='basic',
        condition_type='games_played',
        condition_value={'count': 1},
        reward_type='title',
        reward_value='初出茅庐'
    ),
    
    'the_ascended': Honor(
        honor_id='the_ascended',
        name='登顶者',
        description='首次登顶成功',
        category='eternal',
        rarity='basic',
        condition_type='reach_top',
        condition_value={'count': 1},
        reward_type='title',
        reward_value='登顶者'
    ),
    
    'hundred_conqueror': Honor(
        honor_id='hundred_conqueror',
        name='百战百胜',
        description='累计登顶成功100次',
        category='eternal',
        rarity='rare',
        condition_type='total_reach_top',
        condition_value={'count': 100},
        reward_type='title',
        reward_value='百战百胜'
    ),
    
    'thousand_trials': Honor(
        honor_id='thousand_trials',
        name='千锤百炼',
        description='累计参与游戏1000局',
        category='eternal',
        rarity='epic',
        condition_type='games_played',
        condition_value={'count': 1000},
        reward_type='title',
        reward_value='千锤百炼'
    ),
    
    'ai_vanquisher': Honor(
        honor_id='ai_vanquisher',
        name='AI终结者',
        description='累计在单人模式中战胜AI 100次',
        category='eternal',
        rarity='rare',
        condition_type='ai_wins',
        condition_value={'count': 100},
        reward_type='title',
        reward_value='AI终结者'
    ),
    
    'unbeaten_streak': Honor(
        honor_id='unbeaten_streak',
        name='常胜将军',
        description='达成连续10次登顶',
        category='eternal',
        rarity='legendary',
        condition_type='consecutive_wins',
        condition_value={'count': 10},
        reward_type='title',
        reward_value='常胜将军'
    ),
    
    'collection_master': Honor(
        honor_id='collection_master',
        name='全图鉴收藏家',
        description='在双生对决赛季中，使用过所有13种不同数值的牌成功匹配',
        category='eternal',
        rarity='rare',
        condition_type='use_all_ranks',
        condition_value={'ranks': ['A','2','3','4','5','6','7','8','9','10','J','Q','K']},
        reward_type='title',
        reward_value='全图鉴收藏家'
    )
}

# 合并所有荣誉
ALL_HONORS = {**SEASON_HONORS, **ETERNAL_HONORS}

# ============================================
# 赛季管理器
# ============================================

class SeasonManager:
    """赛季管理器"""
    
    def __init__(self):
        self.current_season: Optional[SeasonThemeConfig] = None
        self.season_start_time: int = 0
        self.season_number: int = 1
        self.player_season_stats: Dict[str, Dict] = {}
        self.player_honors: Dict[str, List[str]] = {}
        self._init_first_season()
    
    def _init_first_season(self):
        """初始化第一个赛季"""
        self.current_season = SEASON_THEMES[SeasonTheme.BLITZ]
        self.season_start_time = int(time.time())
    
    def get_current_season(self) -> Dict:
        """获取当前赛季信息"""
        if not self.current_season:
            return {'error': '无活跃赛季'}
        
        elapsed = int(time.time()) - self.season_start_time
        remaining = self.current_season.duration_days * 86400 - elapsed
        
        return {
            'season_number': self.season_number,
            'theme': self.current_season.theme_id,
            'name': self.current_season.name,
            'name_en': self.current_season.name_en,
            'description': self.current_season.description,
            'started_at': self.season_start_time,
            'ends_at': self.season_start_time + self.current_season.duration_days * 86400,
            'remaining_days': max(0, remaining // 86400),
            'remaining_hours': max(0, remaining // 3600),
            'core_rules': self.current_season.core_rules
        }
    
    def rotate_season(self) -> Dict:
        """轮换到下一个赛季"""
        # 赛季顺序
        season_order = [
            SeasonTheme.BLITZ,
            SeasonTheme.GUARD_CODEX,
            SeasonTheme.COMMONER_CROWN,
            SeasonTheme.TWIN_DUEL,
            SeasonTheme.FORBIDDEN_SUIT,
            SeasonTheme.MASTER_PATH
        ]
        
        current_idx = season_order.index(
            next(s for s, c in SEASON_THEMES.items() if c == self.current_season)
        )
        next_idx = (current_idx + 1) % len(season_order)
        
        # 保存上个赛季数据
        self._archive_season()
        
        # 开启新赛季
        self.current_season = SEASON_THEMES[season_order[next_idx]]
        self.season_start_time = int(time.time())
        self.season_number += 1
        
        return {
            'success': True,
            'message': f'新赛季开始: {self.current_season.name}',
            'season_number': self.season_number,
            'theme': self.current_season.theme_id
        }
    
    def _archive_season(self):
        """存档赛季数据"""
        # 实际应该保存到数据库
        pass
    
    def check_honor_eligible(self, player_id: str, honor_id: str, game_stats: Dict) -> bool:
        """检查玩家是否满足荣誉条件"""
        honor = ALL_HONORS.get(honor_id)
        if not honor:
            return False
        
        # 检查是否已获得
        if player_id in self.player_honors and honor_id in self.player_honors[player_id]:
            return False
        
        # 检查赛季条件
        if honor.season_theme:
            current_theme = self.current_season.theme_id if self.current_season else None
            if honor.season_theme != current_theme:
                return False
        
        # 检查具体条件
        condition = honor.condition_value
        
        if honor.condition_type == 'fast_play_count':
            return game_stats.get('fast_plays', 0) >= condition['count']
        
        elif honor.condition_type == 'dual_match_count':
            return game_stats.get('dual_matches', 0) >= condition['count']
        
        elif honor.condition_type == 'first_place':
            return game_stats.get('rank') == 1
        
        elif honor.condition_type == 'reach_top':
            return game_stats.get('reached_top', False)
        
        elif honor.condition_type == 'consecutive_wins':
            return game_stats.get('consecutive_wins', 0) >= condition['count']
        
        return False
    
    def award_honor(self, player_id: str, honor_id: str) -> Dict:
        """授予荣誉"""
        honor = ALL_HONORS.get(honor_id)
        if not honor:
            return {'success': False, 'error': '荣誉不存在'}
        
        if player_id not in self.player_honors:
            self.player_honors[player_id] = []
        
        if honor_id in self.player_honors[player_id]:
            return {'success': False, 'error': '已拥有该荣誉'}
        
        self.player_honors[player_id].append(honor_id)
        
        return {
            'success': True,
            'honor': {
                'id': honor_id,
                'name': honor.name,
                'description': honor.description,
                'rarity': honor.rarity,
                'reward': honor.reward_value
            },
            'message': f'🎉 恭喜获得荣誉: {honor.name}!'
        }
    
    def get_player_honors(self, player_id: str) -> List[Dict]:
        """获取玩家所有荣誉"""
        honor_ids = self.player_honors.get(player_id, [])
        return [
            {
                'id': h_id,
                'name': ALL_HONORS[h_id].name,
                'description': ALL_HONORS[h_id].description,
                'rarity': ALL_HONORS[h_id].rarity,
                'category': ALL_HONORS[h_id].category,
                'reward': ALL_HONORS[h_id].reward_value
            }
            for h_id in honor_ids if h_id in ALL_HONORS
        ]
    
    def get_season_leaderboard(self) -> List[Dict]:
        """获取赛季排行榜"""
        # 按赛季积分排序
        sorted_players = sorted(
            self.player_season_stats.items(),
            key=lambda x: x[1].get('season_points', 0),
            reverse=True
        )[:100]
        
        return [
            {
                'rank': i + 1,
                'player_id': pid,
                'season_points': stats.get('season_points', 0),
                'games_played': stats.get('games_played', 0),
                'times_reached_top': stats.get('times_reached_top', 0)
            }
            for i, (pid, stats) in enumerate(sorted_players)
        ]

# 全局实例
season_manager = SeasonManager()

print("✅ 赛季系统与荣誉系统加载完成")
print("🎮 6大赛季主题:")
for theme in [SeasonTheme.BLITZ, SeasonTheme.GUARD_CODEX, SeasonTheme.COMMONER_CROWN, 
              SeasonTheme.TWIN_DUEL, SeasonTheme.FORBIDDEN_SUIT, SeasonTheme.MASTER_PATH]:
    config = SEASON_THEMES[theme]
    print(f"   - {config.name} ({config.name_en}): {config.description}")
print(f"🏆 赛季荣誉: {len(SEASON_HONORS)} 个")
print(f"👑 永恒荣誉: {len(ETERNAL_HONORS)} 个")
print(f"📊 总计荣誉: {len(ALL_HONORS)} 个")
