"""
命运塔·首登者 - 80 AI玩家测试系统
AI Simulation & Testing System
"""
import random
import json
import time
from typing import Dict, List, Optional
from dataclasses import dataclass, field

@dataclass
class AIPlayer:
    """AI玩家数据"""
    player_id: str
    nickname: str
    level: int = 1
    exp: int = 0
    coins: int = 0
    diamonds: int = 0
    vip_level: int = 0
    
    # 拥有的道具
    inventory: Dict[str, int] = field(default_factory=dict)
    
    # 装扮
    equipped_skin: str = "classic"  # 当前使用的扑克牌皮肤
    equipped_frame: str = "default"  # 头像框
    equipped_title: str = ""  # 称号
    equipped_avatar: str = "default"  # 头像
    
    # 统计数据
    games_played: int = 0
    wins: int = 0
    total_spent_coins: int = 0
    total_spent_diamonds: int = 0
    
    # AI行为模式
    behavior_type: str = "normal"  # normal/aggressive/conservative
    

class AIPlayerManager:
    """80 AI玩家管理系统"""
    
    def __init__(self):
        self.players: Dict[str, AIPlayer] = {}
        self.chinese_names = self._generate_chinese_names()
        self._init_80_players()
    
    def _generate_chinese_names(self) -> List[str]:
        """生成中文名字"""
        surnames = ["李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴", 
                    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗"]
        names = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋",
                 "勇", "艳", "杰", "娟", "涛", "明", "超", "秀英", "华", "鹏"]
        
        generated = []
        for i in range(80):
            name = random.choice(surnames) + random.choice(names)
            if name not in generated:
                generated.append(name)
            else:
                generated.append(f"{name}{i}")
        return generated
    
    def _init_80_players(self):
        """初始化80个AI玩家"""
        behavior_types = ["normal"] * 40 + ["aggressive"] * 25 + ["conservative"] * 15
        random.shuffle(behavior_types)
        
        for i in range(80):
            player_id = f"system_{i+1:03d}"
            
            # 分配初始资源（随机分配，模拟不同玩家类型）
            initial_coins = random.choice([1000, 5000, 10000, 50000, 100000])
            initial_diamonds = random.choice([100, 500, 1000, 5000, 10000])
            
            player = AIPlayer(
                player_id=player_id,
                nickname=self.chinese_names[i],
                level=random.randint(5, 50),
                coins=initial_coins,
                diamonds=initial_diamonds,
                vip_level=random.randint(0, 10),
                behavior_type=behavior_types[i],
                games_played=random.randint(10, 500),
                wins=random.randint(5, 200)
            )
            
            self.players[player_id] = player
        
        print(f"✅ 初始化完成: {len(self.players)} 个AI玩家")
    
    def assign_random_items(self, player_id: str) -> Dict:
        """为AI玩家随机分配道具"""
        if player_id not in self.players:
            return {"error": "玩家不存在"}
        
        player = self.players[player_id]
        
        # 可分配的道具池
        items_pool = {
            # 扑克牌皮肤
            'skin_kawaii_pink': {'type': 'skin', 'price_diamonds': 188},
            'skin_magic_crystal': {'type': 'skin', 'price_diamonds': 388},
            'skin_magic_dragon': {'type': 'skin', 'price_diamonds': 588},
            'skin_nature_sakura': {'type': 'skin', 'price_diamonds': 288},
            'skin_tech_cyber': {'type': 'skin', 'price_diamonds': 488},
            
            # 头像框
            'frame_gold': {'type': 'frame', 'price_diamonds': 100},
            'frame_diamond': {'type': 'frame', 'price_diamonds': 200},
            'frame_legend': {'type': 'frame', 'price_diamonds': 500},
            
            # 称号
            'title_warrior': {'type': 'title', 'price_coins': 10000},
            'title_master': {'type': 'title', 'price_coins': 50000},
            'title_legend': {'type': 'title', 'price_diamonds': 1000},
            
            # 嘲讽包
            'taunt_pack_1': {'type': 'taunt', 'price_diamonds': 188},
            'taunt_pack_2': {'type': 'taunt', 'price_diamonds': 388},
            
            # 经验卡
            'exp_card_x2': {'type': 'exp', 'price_coins': 5000},
            'exp_card_x3': {'type': 'exp', 'price_coins': 10000},
            
            # 幸运符
            'lucky_charm': {'type': 'charm', 'price_diamonds': 50},
        }
        
        # 随机选择3-8个道具
        num_items = random.randint(3, 8)
        assigned_items = random.sample(list(items_pool.keys()), min(num_items, len(items_pool)))
        
        purchased = []
        for item_id in assigned_items:
            item = items_pool[item_id]
            
            # 检查货币是否足够
            can_afford = False
            if 'price_diamonds' in item and player.diamonds >= item['price_diamonds']:
                can_afford = True
                player.diamonds -= item['price_diamonds']
                player.total_spent_diamonds += item['price_diamonds']
            elif 'price_coins' in item and player.coins >= item['price_coins']:
                can_afford = True
                player.coins -= item['price_coins']
                player.total_spent_coins += item['price_coins']
            
            if can_afford:
                player.inventory[item_id] = player.inventory.get(item_id, 0) + 1
                purchased.append({
                    'item_id': item_id,
                    'type': item['type'],
                    'price': item.get('price_diamonds', item.get('price_coins', 0))
                })
        
        return {
            "player_id": player_id,
            "purchased": purchased,
            "remaining_coins": player.coins,
            "remaining_diamonds": player.diamonds
        }
    
    def equip_items(self, player_id: str) -> Dict:
        """AI玩家装备道具"""
        if player_id not in self.players:
            return {"error": "玩家不存在"}
        
        player = self.players[player_id]
        equipped = []
        
        # 装备皮肤
        skins = [k for k in player.inventory.keys() if k.startswith('skin_')]
        if skins:
            player.equipped_skin = random.choice(skins)
            equipped.append(f"皮肤: {player.equipped_skin}")
        
        # 装备头像框
        frames = [k for k in player.inventory.keys() if k.startswith('frame_')]
        if frames:
            player.equipped_frame = random.choice(frames)
            equipped.append(f"头像框: {player.equipped_frame}")
        
        # 装备称号
        titles = [k for k in player.inventory.keys() if k.startswith('title_')]
        if titles:
            player.equipped_title = random.choice(titles)
            equipped.append(f"称号: {player.equipped_title}")
        
        return {
            "player_id": player_id,
            "equipped": equipped,
            "current_skin": player.equipped_skin,
            "current_frame": player.equipped_frame,
            "current_title": player.equipped_title
        }
    
    def get_player_visual_data(self, player_id: str) -> Dict:
        """获取玩家视觉数据（用于渲染）"""
        if player_id not in self.players:
            return {"error": "玩家不存在"}
        
        player = self.players[player_id]
        
        # 皮肤效果映射
        skin_effects = {
            'classic': {'border': 'none', 'animation': 'none'},
            'skin_kawaii_pink': {'border': 'glow_pink', 'animation': 'pulse'},
            'skin_magic_crystal': {'border': 'prismatic', 'animation': 'shimmer'},
            'skin_magic_dragon': {'border': 'flame', 'animation': 'flicker'},
            'skin_nature_sakura': {'border': 'sakura', 'animation': 'fall'},
            'skin_tech_cyber': {'border': 'neon', 'animation': 'pulse'}
        }
        
        # 头像框效果映射
        frame_effects = {
            'default': {'color': '#888', 'icon': ''},
            'frame_gold': {'color': '#ffd700', 'icon': '👑'},
            'frame_diamond': {'color': '#0ff', 'icon': '💎'},
            'frame_legend': {'color': '#ff6b6b', 'icon': '🔥'}
        }
        
        skin_effect = skin_effects.get(player.equipped_skin, skin_effects['classic'])
        frame_effect = frame_effects.get(player.equipped_frame, frame_effects['default'])
        
        return {
            "player_id": player_id,
            "nickname": player.nickname,
            "level": player.level,
            "vip_level": player.vip_level,
            
            # 视觉装扮
            "skin": {
                "id": player.equipped_skin,
                "border_effect": skin_effect['border'],
                "animation": skin_effect['animation']
            },
            "frame": {
                "id": player.equipped_frame,
                "color": frame_effect['color'],
                "icon": frame_effect['icon']
            },
            "title": player.equipped_title,
            
            # 渲染样式
            "render_style": {
                "card_border": f"3px solid {skin_effect['border'] != 'none' and '#ffd700' or '#333'}",
                "card_animation": skin_effect['animation'],
                "name_color": frame_effect['color'],
                "vip_badge": player.vip_level > 0,
                "title_display": player.equipped_title != ""
            }
        }
    
    def simulate_all_players(self) -> List[Dict]:
        """模拟所有80个AI玩家的消费和装备"""
        results = []
        
        for player_id, player in self.players.items():
            # 1. 分配道具
            purchase_result = self.assign_random_items(player_id)
            
            # 2. 装备道具
            equip_result = self.equip_items(player_id)
            
            # 3. 获取视觉数据
            visual_data = self.get_player_visual_data(player_id)
            
            results.append({
                "player_id": player_id,
                "nickname": player.nickname,
                "purchases": purchase_result.get("purchased", []),
                "equipped": equip_result.get("equipped", []),
                "visual": visual_data
            })
        
        return results
    
    def get_team_battle_visuals(self, team_a_ids: List[str], team_b_ids: List[str]) -> Dict:
        """获取团战双方视觉数据"""
        team_a = [self.get_player_visual_data(pid) for pid in team_a_ids if pid in self.players]
        team_b = [self.get_player_visual_data(pid) for pid in team_b_ids if pid in self.players]
        
        return {
            "team_a": {
                "players": team_a,
                "average_level": sum(p.get('level', 0) for p in team_a) // max(len(team_a), 1)
            },
            "team_b": {
                "players": team_b,
                "average_level": sum(p.get('level', 0) for p in team_b) // max(len(team_b), 1)
            }
        }

# 全局实例
ai_manager = AIPlayerManager()

# 测试
if __name__ == "__main__":
    print("🤖 80 AI玩家测试系统")
    print("=" * 60)
    
    # 模拟所有玩家
    results = ai_manager.simulate_all_players()
    
    # 统计
    total_purchases = sum(len(r['purchases']) for r in results)
    total_equipped = sum(len(r['equipped']) for r in results)
    
    print(f"\n📊 模拟结果:")
    print(f"   - 总购买次数: {total_purchases}")
    print(f"   - 总装备数: {total_equipped}")
    print(f"   - 平均每玩家购买: {total_purchases / 80:.1f} 件")
    
    # 示例玩家
    print(f"\n🎮 示例玩家 (system_001):")
    sample = results[0]
    print(f"   昵称: {sample['nickname']}")
    print(f"   购买: {len(sample['purchases'])} 件")
    print(f"   装备: {sample['equipped']}")
    print(f"   当前皮肤: {sample['visual']['skin']['id']}")
    print(f"   边框效果: {sample['visual']['skin']['border_effect']}")
    
    # 团战视觉测试
    print(f"\n⚔️ 团战视觉测试 (2v2):")
    team_battle = ai_manager.get_team_battle_visuals(
        ['system_001', 'system_002'],
        ['system_003', 'system_004']
    )
    print(f"   队伍A平均等级: {team_battle['team_a']['average_level']}")
    print(f"   队伍B平均等级: {team_battle['team_b']['average_level']}")
    print(f"   可见装扮: 皮肤边框、头像框、VIP标识、称号")
