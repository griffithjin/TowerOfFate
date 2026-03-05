"""
Tower of Fate - 团队赛游戏系统 (共享手牌模式)
支持 2v2 / 3v3 / 4v4 / 5v5 团队对战
游戏逻辑：团队成员共享手牌，每人选一张
"""
import asyncio
import time
import random
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

class TeamMode(Enum):
    TEAM_2V2 = "2v2"  # 2队各2人，共享4张牌，每人选1张
    TEAM_3V3 = "3v3"  # 2队各3人，共享6张牌，每人选1张
    TEAM_4V4 = "4v4"  # 2队各4人，共享8张牌，每人选1张
    TEAM_5V5 = "5v5"  # 2队各5人，共享10张牌，每人选1张

@dataclass
class TeamPlayer:
    player_id: str
    nickname: str
    level: int = 1
    rank: str = "青铜"
    is_captain: bool = False
    is_ready: bool = False
    join_time: int = 0
    is_system: bool = False  # 标记是否为系统AI玩家
    
@dataclass
class Team:
    team_id: str
    name: str
    captain_id: str
    players: Dict[str, TeamPlayer] = field(default_factory=dict)
    created_time: int = 0
    wins: int = 0
    losses: int = 0
    points: int = 0
    logo: str = "default"
    
@dataclass
class TeamRoom:
    room_id: str
    room_code: str
    mode: TeamMode
    team_a: Team
    team_b: Optional[Team] = None
    status: str = "waiting"  # waiting, ready, playing, ended
    created_time: int = 0
    game_settings: Dict = field(default_factory=dict)
    
@dataclass
class TeamGameState:
    """团队游戏状态"""
    room_id: str
    mode: TeamMode
    team_a_id: str
    team_b_id: str
    team_a_level: int = 1  # 团队A当前层数
    team_b_level: int = 1  # 团队B当前层数
    team_a_score: int = 0
    team_b_score: int = 0
    shared_hands: Dict[str, List[Dict]] = field(default_factory=dict)  # 团队共享手牌
    selected_cards: Dict[str, Optional[Dict]] = field(default_factory=dict)  # 玩家选择的牌
    guard_card: Optional[Dict] = None
    current_round: int = 1
    status: str = "waiting"  # waiting, playing, ended

class TeamBattleSystem:
    """团队赛系统 - 共享手牌模式"""
    
    # 团队大小配置
    TEAM_SIZES = {
        TeamMode.TEAM_2V2: 2,
        TeamMode.TEAM_3V3: 3,
        TeamMode.TEAM_4V4: 4,
        TeamMode.TEAM_5V5: 5
    }
    
    # 共享手牌数量 = 团队人数 * 2
    SHARED_HAND_SIZES = {
        TeamMode.TEAM_2V2: 4,   # 2人团队，共享4张牌
        TeamMode.TEAM_3V3: 6,   # 3人团队，共享6张牌
        TeamMode.TEAM_4V4: 8,   # 4人团队，共享8张牌
        TeamMode.TEAM_5V5: 10   # 5人团队，共享10张牌
    }
    
    def __init__(self):
        self.teams: Dict[str, Team] = {}  # team_id -> Team
        self.player_team: Dict[str, str] = {}  # player_id -> team_id
        self.rooms: Dict[str, TeamRoom] = {}  # room_id -> TeamRoom
        self.room_codes: Dict[str, str] = {}  # room_code -> room_id
        self.pending_matches: Dict[TeamMode, List[str]] = {  # 匹配队列
            TeamMode.TEAM_2V2: [],
            TeamMode.TEAM_3V3: [],
            TeamMode.TEAM_4V4: [],
            TeamMode.TEAM_5V5: []
        }
        self.active_games: Dict[str, TeamGameState] = {}  # room_id -> TeamGameState
        self.system_players: List[Dict] = []  # 系统AI玩家列表
        
    # ========== 系统玩家管理 ==========
    
    def create_system_players(self, count: int = 80):
        """创建系统AI玩家"""
        print(f"🏗️ 创建 {count} 个系统AI玩家...")
        
        ranks = ["青铜", "白银", "黄金", "铂金", "钻石"]
        titles = ["战士", "法师", "射手", "刺客", "辅助", "坦克"]
        
        for i in range(count):
            player_id = f"system_player_{i+1:03d}"
            title = random.choice(titles)
            number = random.randint(1000, 9999)
            nickname = f"{title}{number}"
            
            self.system_players.append({
                'player_id': player_id,
                'nickname': nickname,
                'level': random.randint(1, 50),
                'rank': random.choice(ranks),
                'status': 'online',
                'is_system': True,
                'created_time': int(time.time())
            })
        
        print(f"✅ 已创建 {len(self.system_players)} 个系统玩家")
        return self.system_players
    
    def get_system_players(self, count: int, exclude_ids: List[str] = None) -> List[Dict]:
        """获取指定数量的系统玩家"""
        if exclude_ids is None:
            exclude_ids = []
        
        available = [p for p in self.system_players if p['player_id'] not in exclude_ids]
        
        if len(available) < count:
            # 如果不够，创建新的
            needed = count - len(available)
            start_idx = len(self.system_players)
            for i in range(needed):
                player_id = f"system_player_{start_idx + i + 1:03d}"
                nickname = f"AI玩家{random.randint(1000, 9999)}"
                self.system_players.append({
                    'player_id': player_id,
                    'nickname': nickname,
                    'level': random.randint(1, 50),
                    'rank': random.choice(["青铜", "白银", "黄金", "铂金", "钻石"]),
                    'status': 'online',
                    'is_system': True,
                    'created_time': int(time.time())
                })
                available.append(self.system_players[-1])
        
        return random.sample(available, count)
    
    # ========== 团队管理 ==========
    
    def create_team(self, captain_id: str, captain_name: str, team_name: str) -> Dict:
        """创建团队"""
        if captain_id in self.player_team:
            return {'success': False, 'error': '你已经在一个团队中了'}
        
        team_id = f"team_{int(time.time())}_{random.randint(1000, 9999)}"
        
        captain = TeamPlayer(
            player_id=captain_id,
            nickname=captain_name,
            is_captain=True,
            join_time=int(time.time())
        )
        
        team = Team(
            team_id=team_id,
            name=team_name,
            captain_id=captain_id,
            players={captain_id: captain},
            created_time=int(time.time())
        )
        
        self.teams[team_id] = team
        self.player_team[captain_id] = team_id
        
        return {
            'success': True,
            'team': self._format_team_info(team),
            'message': '团队创建成功！'
        }
    
    def join_team(self, player_id: str, player_name: str, team_id: str) -> Dict:
        """加入团队"""
        if player_id in self.player_team:
            return {'success': False, 'error': '你已经在一个团队中了'}
        
        if team_id not in self.teams:
            return {'success': False, 'error': '团队不存在'}
        
        team = self.teams[team_id]
        
        # 检查团队人数限制
        team_size_limit = 10
        if len(team.players) >= team_size_limit:
            return {'success': False, 'error': '团队人数已满'}
        
        player = TeamPlayer(
            player_id=player_id,
            nickname=player_name,
            join_time=int(time.time())
        )
        team.players[player_id] = player
        self.player_team[player_id] = team_id
        
        return {
            'success': True,
            'team': self._format_team_info(team),
            'message': f'成功加入团队 {team.name}'
        }
    
    def leave_team(self, player_id: str) -> Dict:
        """离开团队"""
        if player_id not in self.player_team:
            return {'success': False, 'error': '你不在任何团队中'}
        
        team_id = self.player_team[player_id]
        team = self.teams[team_id]
        
        # 队长离开需要转让或解散
        if team.captain_id == player_id:
            if len(team.players) > 1:
                return {'success': False, 'error': '请先转让队长职位或解散团队'}
            else:
                del self.teams[team_id]
                del self.player_team[player_id]
                return {'success': True, 'message': '团队已解散'}
        
        del team.players[player_id]
        del self.player_team[player_id]
        
        return {
            'success': True,
            'message': f'已离开团队 {team.name}'
        }
    
    def transfer_captain(self, captain_id: str, new_captain_id: str) -> Dict:
        """转让队长"""
        if captain_id not in self.player_team:
            return {'success': False, 'error': '你不是团队成员'}
        
        team_id = self.player_team[captain_id]
        team = self.teams[team_id]
        
        if team.captain_id != captain_id:
            return {'success': False, 'error': '你不是队长'}
        
        if new_captain_id not in team.players:
            return {'success': False, 'error': '该玩家不在团队中'}
        
        team.players[captain_id].is_captain = False
        team.players[new_captain_id].is_captain = True
        team.captain_id = new_captain_id
        
        return {
            'success': True,
            'message': '队长转让成功',
            'new_captain': team.players[new_captain_id].nickname
        }
    
    def _format_team_info(self, team: Team) -> Dict:
        """格式化团队信息"""
        return {
            'team_id': team.team_id,
            'name': team.name,
            'captain_id': team.captain_id,
            'captain_name': team.players.get(team.captain_id, {}).nickname if team.captain_id in team.players else "未知",
            'player_count': len(team.players),
            'players': [
                {
                    'player_id': p.player_id,
                    'nickname': p.nickname,
                    'is_captain': p.is_captain,
                    'level': p.level,
                    'rank': p.rank
                }
                for p in team.players.values()
            ],
            'stats': {
                'wins': team.wins,
                'losses': team.losses,
                'points': team.points,
                'win_rate': f"{team.wins/(team.wins+team.losses)*100:.1f}%" if (team.wins+team.losses) > 0 else "0%"
            },
            'created_time': team.created_time
        }
    
    # ========== 快速匹配（自动填充系统玩家） ==========
    
    def quick_match(self, player_id: str, mode: str) -> Dict:
        """快速匹配 - 自动分配系统玩家作为队友和对手"""
        try:
            team_mode = TeamMode(mode)
        except:
            return {'success': False, 'error': '无效的游戏模式'}
        
        team_size = self.TEAM_SIZES[team_mode]
        
        # 获取系统玩家
        total_needed = team_size * 2  # 两队总人数
        system_players = self.get_system_players(total_needed, [player_id])
        
        # 创建临时团队
        team_a_players = [player_id] + [p['player_id'] for p in system_players[:team_size-1]]
        team_b_players = [p['player_id'] for p in system_players[team_size:team_size*2]]
        
        return {
            'success': True,
            'message': '匹配成功！',
            'mode': mode,
            'team_a': team_a_players,
            'team_b': team_b_players,
            'team_size': team_size,
            'shared_hand_size': self.SHARED_HAND_SIZES[team_mode]
        }
    
    # ========== 游戏逻辑（共享手牌） ==========
    
    def create_deck(self) -> List[Dict]:
        """创建一副牌"""
        suits = ['♥', '♦', '♣', '♠']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        deck = [{'suit': s, 'rank': r} for s in suits for r in ranks]
        random.shuffle(deck)
        return deck
    
    def start_team_game(self, room_id: str) -> Dict:
        """开始团队游戏"""
        if room_id not in self.rooms:
            return {'success': False, 'error': '房间不存在'}
        
        room = self.rooms[room_id]
        
        if not room.team_b:
            return {'success': False, 'error': '对手团队尚未加入'}
        
        mode = room.mode
        team_size = self.TEAM_SIZES[mode]
        shared_hand_size = self.SHARED_HAND_SIZES[mode]
        
        # 创建游戏状态
        game_state = TeamGameState(
            room_id=room_id,
            mode=mode,
            team_a_id=room.team_a.team_id,
            team_b_id=room.team_b.team_id,
            shared_hands={},
            selected_cards={},
            guard_card=None,
            current_round=1,
            status='playing'
        )
        
        # 为每个团队发放共享手牌
        deck = self.create_deck()
        
        # 团队A共享手牌
        game_state.shared_hands[room.team_a.team_id] = [deck.pop() for _ in range(shared_hand_size)]
        
        # 团队B共享手牌
        game_state.shared_hands[room.team_b.team_id] = [deck.pop() for _ in range(shared_hand_size)]
        
        # 守卫牌
        game_state.guard_card = deck.pop()
        
        # 初始化玩家选择
        for player_id in room.team_a.players:
            game_state.selected_cards[player_id] = None
        for player_id in room.team_b.players:
            game_state.selected_cards[player_id] = None
        
        self.active_games[room_id] = game_state
        room.status = 'playing'
        
        return {
            'success': True,
            'message': '游戏开始！',
            'game_state': {
                'room_id': room_id,
                'mode': mode.value,
                'team_a': {
                    'team_id': room.team_a.team_id,
                    'name': room.team_a.name,
                    'players': list(room.team_a.players.keys()),
                    'shared_hand': game_state.shared_hands[room.team_a.team_id]
                },
                'team_b': {
                    'team_id': room.team_b.team_id,
                    'name': room.team_b.name,
                    'players': list(room.team_b.players.keys()),
                    'shared_hand': game_state.shared_hands[room.team_b.team_id]
                },
                'guard_card': {'suit': '?', 'rank': '?'},  # 隐藏守卫牌
                'current_round': 1
            }
        }
    
    def play_card(self, room_id: str, player_id: str, card_index: int) -> Dict:
        """玩家出牌（从共享手牌中选择）"""
        if room_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[room_id]
        
        # 找到玩家所属团队
        team_id = None
        if player_id in self.teams.get(game.team_a_id, Team).players:
            team_id = game.team_a_id
        elif player_id in self.teams.get(game.team_b_id, Team).players:
            team_id = game.team_b_id
        
        if not team_id:
            return {'success': False, 'error': '玩家不在游戏中'}
        
        # 检查手牌索引
        shared_hand = game.shared_hands.get(team_id, [])
        if card_index >= len(shared_hand):
            return {'success': False, 'error': '无效的手牌索引'}
        
        # 记录玩家选择的牌
        selected_card = shared_hand[card_index]
        game.selected_cards[player_id] = selected_card
        
        return {
            'success': True,
            'message': '出牌成功',
            'player_id': player_id,
            'card': selected_card
        }
    
    def resolve_round(self, room_id: str) -> Dict:
        """结算一轮"""
        if room_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[room_id]
        guard = game.guard_card
        
        results = {
            'team_a': {'advances': 0, 'perfect_matches': 0},
            'team_b': {'advances': 0, 'perfect_matches': 0}
        }
        
        # 结算团队A
        for player_id, card in game.selected_cards.items():
            if card and player_id in self.teams.get(game.team_a_id, Team).players:
                if card['suit'] == guard['suit'] and card['rank'] == guard['rank']:
                    results['team_a']['perfect_matches'] += 1
                    results['team_a']['advances'] += 1
                elif card['suit'] == guard['suit'] or card['rank'] == guard['rank']:
                    results['team_a']['advances'] += 1
        
        # 结算团队B
        for player_id, card in game.selected_cards.items():
            if card and player_id in self.teams.get(game.team_b_id, Team).players:
                if card['suit'] == guard['suit'] and card['rank'] == guard['rank']:
                    results['team_b']['perfect_matches'] += 1
                    results['team_b']['advances'] += 1
                elif card['suit'] == guard['suit'] or card['rank'] == guard['rank']:
                    results['team_b']['advances'] += 1
        
        # 更新团队层数
        if results['team_a']['advances'] > 0:
            game.team_a_level += 1
        if results['team_b']['advances'] > 0:
            game.team_b_level += 1
        
        # 检查获胜
        winner = None
        if game.team_a_level >= 13:
            winner = game.team_a_id
            game.status = 'ended'
        elif game.team_b_level >= 13:
            winner = game.team_b_id
            game.status = 'ended'
        
        return {
            'success': True,
            'results': results,
            'guard_card': guard,
            'team_a_level': game.team_a_level,
            'team_b_level': game.team_b_level,
            'winner': winner
        }

# 全局实例
team_battle_system = TeamBattleSystem()

# 初始化系统玩家
team_battle_system.create_system_players(80)

# 初始化10个预设团队
def initialize_teams():
    """初始化10个预设团队"""
    print("🏗️ 初始化10个预设团队...")
    
    team_names = [
        "🐉 龙之队", "⚔️ 荣耀军团", "🔥 烈焰战队",
        "❄️ 冰霜联盟", "⚡ 雷霆之怒", "🌙 暗影军团",
        "🛡️ 钢铁防线", "🏹 猎鹰小队", "🌟 星辰大海", "👑 王者之师"
    ]
    
    for i, name in enumerate(team_names):
        captain_id = f"team_{i+1}_captain"
        captain_name = f"队长{i+1}号"
        
        result = team_battle_system.create_team(captain_id, captain_name, name)
        if result['success']:
            team_id = result['team']['team_id']
            
            # 添加2-4名队员（系统玩家）
            team_size = random.randint(2, 4)
            system_players = team_battle_system.get_system_players(team_size)
            
            for sp in system_players:
                team_battle_system.join_team(
                    sp['player_id'],
                    sp['nickname'],
                    team_id
                )
            
            # 设置战绩
            team = team_battle_system.teams[team_id]
            team.wins = random.randint(10, 100)
            team.losses = random.randint(5, 50)
            team.points = team.wins * 10
            
            print(f"  ✅ {name} - 队长:{captain_name} - 队员:{len(team.players)}人")
    
    print(f"\n📊 团队初始化完成")

initialize_teams()
