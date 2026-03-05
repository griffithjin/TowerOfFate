"""
Tower of Fate - 团队赛游戏系统 (更新版)
共享手牌: 2v2=10张, 3v3=15张, 4v4=20张, 5v5=50张
天命牌: 开局3张, 登顶后队友晋级获得额外天命牌
守卫模式: 登顶后变成守卫, 守住13轮获胜
"""
import asyncio
import time
import random
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

class TeamMode(Enum):
    TEAM_2V2 = "2v2"  # 10张共享手牌
    TEAM_3V3 = "3v3"  # 15张共享手牌
    TEAM_4V4 = "4v4"  # 20张共享手牌
    TEAM_5V5 = "5v5"  # 50张共享手牌

class DestinyCardType(Enum):
    ASSAULT = "assault"      # 全军突击 - 全队晋级
    SWAP = "swap"            # 换牌 - 重新抽牌
    PEEK = "peek"            # 看牌 - 查看守卫牌
    BRING = "bring"          # 带人 - 带队友一起晋级
    KICK = "kick"            # 踢人 - 让对手下降一层
    DOWN = "down"            # 下降 - 让守卫下降一层(淘汰守卫)

@dataclass
class TeamPlayer:
    player_id: str
    nickname: str
    level: int = 1
    rank: str = "青铜"
    is_captain: bool = False
    is_ready: bool = False
    join_time: int = 0
    is_system: bool = False
    selected_card: Optional[Dict] = None  # 玩家选择的牌
    
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
class TeamGameState:
    """团队游戏状态 - 更新版"""
    room_id: str
    mode: TeamMode
    team_a_id: str
    team_b_id: str
    team_a_level: int = 1  # 团队A当前层数
    team_b_level: int = 1  # 团队B当前层数
    team_a_score: int = 0
    team_b_score: int = 0
    
    # 共享手牌
    shared_hands: Dict[str, List[Dict]] = field(default_factory=dict)
    
    # 天命牌系统 - 每人3张, 团队共享池
    destiny_cards: Dict[str, List[Dict]] = field(default_factory=dict)
    
    # 守卫模式
    guard_team: Optional[str] = None  # 哪个团队成为守卫
    guard_rounds: int = 0  # 守卫守了多少轮
    
    # 守卫牌
    guard_card: Optional[Dict] = None
    current_round: int = 1
    status: str = "waiting"  # waiting, playing, ended

class TeamBattleSystemV2:
    """团队赛系统 V2 - 更新规则"""
    
    # 共享手牌配置 (更新)
    SHARED_HAND_SIZES = {
        TeamMode.TEAM_2V2: 10,   # 2v2 = 10张
        TeamMode.TEAM_3V3: 15,   # 3v3 = 15张
        TeamMode.TEAM_4V4: 20,   # 4v4 = 20张
        TeamMode.TEAM_5V5: 50    # 5v5 = 50张
    }
    
    # 天命牌配置
    DESTINY_CARDS = {
        'assault': {'name': '全军突击', 'desc': '全队成员同时晋级', 'type': 'buff'},
        'swap': {'name': '换牌', 'desc': '重新抽取共享手牌', 'type': 'buff'},
        'peek': {'name': '看牌', 'desc': '提前查看守卫牌', 'type': 'view'},
        'bring': {'name': '带人', 'desc': '带一名队友一起晋级', 'type': 'buff'},
        'kick': {'name': '踢人', 'desc': '让一名对手下降一层', 'type': 'attack'},
        'down': {'name': '下降', 'desc': '让守卫下降一层(淘汰守卫)', 'type': 'attack'}
    }
    
    def __init__(self):
        self.teams: Dict[str, Team] = {}
        self.player_team: Dict[str, str] = {}
        self.active_games: Dict[str, TeamGameState] = {}
        self.system_players: List[Dict] = []
        
    def create_system_players(self, count: int = 80):
        """创建80个系统AI玩家"""
        print(f"🏗️ 创建 {count} 个系统AI玩家...")
        
        ranks = ['青铜', '白银', '黄金', '铂金', '钻石', '星耀', '王者']
        titles = ['战士', '法师', '射手', '刺客', '辅助', '坦克', '猎人', '法师', '骑士', '盗贼']
        
        for i in range(count):
            player_id = f"system_{i+1:03d}"
            title = random.choice(titles)
            number = random.randint(1000, 9999)
            nickname = f"{title}{number}"
            
            self.system_players.append({
                'player_id': player_id,
                'nickname': nickname,
                'level': random.randint(10, 60),
                'rank': random.choice(ranks),
                'status': 'online',
                'is_system': True,
                'created_time': int(time.time())
            })
        
        print(f"✅ 已创建 {len(self.system_players)} 个系统玩家")
        return self.system_players
    
    def start_team_game_v2(self, room_id: str, mode: str) -> Dict:
        """开始团队游戏 V2 - 新规则"""
        try:
            team_mode = TeamMode(mode)
        except:
            return {'success': False, 'error': '无效的游戏模式'}
        
        shared_hand_size = self.SHARED_HAND_SIZES[team_mode]
        
        # 创建游戏状态
        game = TeamGameState(
            room_id=room_id,
            mode=team_mode,
            team_a_id='team_a',
            team_b_id='team_b',
            shared_hands={},
            destiny_cards={},
            guard_team=None,
            guard_rounds=0,
            guard_card=None,
            current_round=1,
            status='playing'
        )
        
        # 发放共享手牌 (新数量)
        deck = self.create_deck()
        game.shared_hands['team_a'] = [deck.pop() for _ in range(shared_hand_size)]
        game.shared_hands['team_b'] = [deck.pop() for _ in range(shared_hand_size)]
        
        # 发放天命牌 - 每人3张, 团队池共 3*人数 张
        team_size = int(mode[0])  # 2v2 -> 2
        for team_id in ['team_a', 'team_b']:
            game.destiny_cards[team_id] = []
            for _ in range(team_size * 3):  # 每人3张
                card_type = random.choice(list(self.DESTINY_CARDS.keys()))
                game.destiny_cards[team_id].append({
                    'type': card_type,
                    'name': self.DESTINY_CARDS[card_type]['name'],
                    'desc': self.DESTINY_CARDS[card_type]['desc']
                })
        
        # 守卫牌
        game.guard_card = deck.pop()
        
        self.active_games[room_id] = game
        
        return {
            'success': True,
            'message': '游戏开始！',
            'game_state': {
                'room_id': room_id,
                'mode': mode,
                'shared_hand_size': shared_hand_size,
                'team_a_hand': game.shared_hands['team_a'],
                'team_b_hand': game.shared_hands['team_b'],
                'team_a_destiny': len(game.destiny_cards['team_a']),
                'team_b_destiny': len(game.destiny_cards['team_b']),
                'guard_card': {'suit': '?', 'rank': '?'},
                'current_round': 1,
                'rules': {
                    'shared_hand': f'{shared_hand_size}张共享手牌',
                    'destiny': '每人3张天命牌,团队共享池',
                    'guard_mode': '登顶后变成守卫,守住13轮获胜'
                }
            }
        }
    
    def use_destiny_card(self, room_id: str, team_id: str, card_index: int, target: str = None) -> Dict:
        """使用天命牌"""
        if room_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[room_id]
        
        if team_id not in game.destiny_cards:
            return {'success': False, 'error': '无效的团队'}
        
        destiny_pool = game.destiny_cards[team_id]
        
        if card_index >= len(destiny_pool):
            return {'success': False, 'error': '无效的天命牌'}
        
        card = destiny_pool.pop(card_index)
        card_type = card['type']
        
        result = {'success': True, 'card': card, 'effects': []}
        
        # 处理天命牌效果
        if card_type == 'assault':
            # 全军突击 - 全队晋级
            if team_id == 'team_a':
                game.team_a_level += 1
            else:
                game.team_b_level += 1
            result['effects'].append(f'全队晋级到{game.team_a_level if team_id == "team_a" else game.team_b_level}层')
            
        elif card_type == 'swap':
            # 换牌 - 重新抽牌
            deck = self.create_deck()
            shared_size = self.SHARED_HAND_SIZES[game.mode]
            game.shared_hands[team_id] = [deck.pop() for _ in range(shared_size)]
            result['effects'].append('重新抽取了共享手牌')
            
        elif card_type == 'peek':
            # 看牌 - 查看守卫牌
            result['effects'].append(f'下轮守卫牌是 {game.guard_card["suit"]}{game.guard_card["rank"]}')
            
        elif card_type == 'bring':
            # 带人 - 带队友晋级
            if team_id == 'team_a':
                game.team_a_level += 1
            else:
                game.team_b_level += 1
            result['effects'].append('带队友一起晋级')
            
        elif card_type == 'kick':
            # 踢人 - 让对手下降一层
            opponent = 'team_b' if team_id == 'team_a' else 'team_a'
            if opponent == 'team_a' and game.team_a_level > 1:
                game.team_a_level -= 1
                result['effects'].append(f'对手下降到{game.team_a_level}层')
            elif opponent == 'team_b' and game.team_b_level > 1:
                game.team_b_level -= 1
                result['effects'].append(f'对手下降到{game.team_b_level}层')
                
        elif card_type == 'down':
            # 下降 - 淘汰守卫
            if game.guard_team and game.guard_team != team_id:
                # 对方是守卫,淘汰他们
                game.guard_team = None
                game.guard_rounds = 0
                if game.guard_team == 'team_a':
                    game.team_a_level = 2  # 从2层重新开始
                else:
                    game.team_b_level = 2
                result['effects'].append('守卫被淘汰!对方从2层重新开始')
        
        # 检查是否登顶成为守卫
        self._check_guard_mode(game, team_id)
        
        return result
    
    def _check_guard_mode(self, game: TeamGameState, team_id: str):
        """检查并进入守卫模式"""
        level = game.team_a_level if team_id == 'team_a' else game.team_b_level
        
        if level >= 13 and not game.guard_team:
            # 首次登顶,成为守卫
            game.guard_team = team_id
            game.guard_rounds = 0
            print(f"🏰 {team_id} 成为守卫!需要守住13轮")
    
    def resolve_round_v2(self, room_id: str, selections: Dict[str, int]) -> Dict:
        """结算一轮 V2"""
        if room_id not in self.active_games:
            return {'success': False, 'error': '游戏不存在'}
        
        game = self.active_games[room_id]
        guard = game.guard_card
        
        results = {
            'team_a': {'advances': 0, 'perfect_matches': 0, 'cards': []},
            'team_b': {'advances': 0, 'perfect_matches': 0, 'cards': []}
        }
        
        # 结算每个玩家的选择
        for player_id, card_index in selections.items():
            team_id = self._get_player_team(game, player_id)
            if not team_id:
                continue
            
            shared_hand = game.shared_hands.get(team_id, [])
            if card_index >= len(shared_hand):
                continue
            
            card = shared_hand[card_index]
            results[team_id]['cards'].append(card)
            
            # 判断匹配
            if card['suit'] == guard['suit'] and card['rank'] == guard['rank']:
                results[team_id]['perfect_matches'] += 1
                results[team_id]['advances'] += 1
                
                # 完美匹配 - 登顶玩家获得额外天命牌
                if team_id == game.guard_team:
                    # 守卫完美匹配,给团队增加天命牌
                    new_card = {
                        'type': random.choice(list(self.DESTINY_CARDS.keys())),
                        'name': self.DESTINY_CARDS[random.choice(list(self.DESTINY_CARDS.keys()))]['name'],
                        'desc': '额外奖励'
                    }
                    game.destiny_cards[team_id].append(new_card)
                    
            elif card['suit'] == guard['suit'] or card['rank'] == guard['rank']:
                results[team_id]['advances'] += 1
        
        # 更新层数
        old_a_level = game.team_a_level
        old_b_level = game.team_b_level
        
        if results['team_a']['advances'] > 0:
            game.team_a_level += 1
        if results['team_b']['advances'] > 0:
            game.team_b_level += 1
        
        # 检查守卫奖励
        if game.guard_team:
            if game.guard_team == 'team_a' and game.team_a_level > old_a_level:
                # 守卫A的队友晋级,守卫获得天命牌
                game.destiny_cards['team_a'].append({
                    'type': 'assault',
                    'name': '全军突击',
                    'desc': '队友晋级奖励'
                })
            elif game.guard_team == 'team_b' and game.team_b_level > old_b_level:
                game.destiny_cards['team_b'].append({
                    'type': 'assault', 
                    'name': '全军突击',
                    'desc': '队友晋级奖励'
                })
            
            game.guard_rounds += 1
        
        # 检查守卫获胜
        winner = None
        if game.guard_team and game.guard_rounds >= 13:
            winner = game.guard_team
            game.status = 'ended'
        
        # 重新发牌 (移除已选的牌)
        for team_id in ['team_a', 'team_b']:
            selected_indices = sorted([i for pid, i in selections.items() 
                                      if self._get_player_team(game, pid) == team_id], reverse=True)
            for idx in selected_indices:
                if idx < len(game.shared_hands[team_id]):
                    game.shared_hands[team_id].pop(idx)
            
            # 补充手牌到满
            deck = self.create_deck()
            target_size = self.SHARED_HAND_SIZES[game.mode]
            while len(game.shared_hands[team_id]) < target_size:
                game.shared_hands[team_id].append(deck.pop())
        
        # 新守卫牌
        deck = self.create_deck()
        game.guard_card = deck.pop()
        game.current_round += 1
        
        return {
            'success': True,
            'results': results,
            'guard_card': guard,
            'team_a_level': game.team_a_level,
            'team_b_level': game.team_b_level,
            'guard_team': game.guard_team,
            'guard_rounds': game.guard_rounds,
            'winner': winner,
            'new_guard_card': {'suit': '?', 'rank': '?'}  # 隐藏
        }
    
    def _get_player_team(self, game: TeamGameState, player_id: str) -> Optional[str]:
        """获取玩家所属团队"""
        # 简化处理,实际应该从房间信息获取
        if 'team_a' in player_id or player_id.startswith('system_'):
            if int(player_id.split('_')[-1]) % 2 == 1:
                return 'team_a'
        return 'team_b'
    
    def create_deck(self) -> List[Dict]:
        """创建一副牌"""
        suits = ['♥', '♦', '♣', '♠']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        deck = [{'suit': s, 'rank': r} for s in suits for r in ranks]
        random.shuffle(deck)
        return deck

# 全局实例
team_battle_v2 = TeamBattleSystemV2()

# 初始化80个系统玩家
team_battle_v2.create_system_players(80)

print("✅ 团队赛系统 V2 初始化完成")
print("📋 新规则:")
print("   - 2v2: 10张共享手牌")
print("   - 3v3: 15张共享手牌")
print("   - 4v4: 20张共享手牌")
print("   - 5v5: 50张共享手牌")
print("   - 天命牌: 开局3张/人, 登顶后队友晋级额外获得")
print("   - 守卫模式: 登顶后守住13轮获胜")
