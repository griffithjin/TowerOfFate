"""
Tower of Fate - 首充系统
首充双倍 + 累充奖励 + 限时礼包
"""
import time
from typing import Dict, List, Optional

class FirstRechargeSystem:
    """首充系统"""
    
    # 首充配置
    FIRST_RECHARGE = {
        'id': 'first_recharge',
        'name': '首充礼包',
        'price': 6,  # 6元
        'diamonds': 60,  # 基础60钻石
        'bonus_diamonds': 60,  # 赠送60钻石（双倍）
        'total_diamonds': 120,  # 总共120钻石
        'extra_rewards': {
            'coins': 600,
            'skin': 'first_recharge_skin',
            'avatar_frame': 'first_recharge_frame',
            'title': '尊贵玩家'
        }
    }
    
    # 累充奖励档位
    CUMULATIVE_REWARDS = {
        100: {
            'diamonds': 100,
            'coins': 1000,
            'title': '小有成就'
        },
        300: {
            'diamonds': 300,
            'coins': 3000,
            'skin': 'vip_frame_blue',
            'title': '投资达人'
        },
        500: {
            'diamonds': 500,
            'coins': 5000,
            'avatar': 'cumulative_500',
            'title': '消费高手'
        },
        1000: {
            'diamonds': 1000,
            'coins': 10000,
            'skin': 'legendary_card_back',
            'effect': 'special_win',
            'title': '氪金大佬'
        },
        2000: {
            'diamonds': 2000,
            'coins': 20000,
            'exclusive_skin': 'dragon_slayer',
            'title': '龙裔贵族'
        },
        5000: {
            'diamonds': 5000,
            'coins': 50000,
            'legendary_avatar': 'god_of_cards',
            'exclusive_effect': 'divine_aura',
            'title': '卡牌之神'
        }
    }
    
    def __init__(self):
        self.player_recharge: Dict[str, Dict] = {}  # player_id -> recharge_data
        self.player_claimed: Dict[str, List] = {}  # player_id -> claimed_rewards
    
    def get_first_recharge_status(self, player_id: str) -> Dict:
        """获取首充状态"""
        if player_id not in self.player_recharge:
            self.player_recharge[player_id] = {
                'first_recharge_done': False,
                'total_recharged': 0,
                'first_recharge_time': None
            }
        
        data = self.player_recharge[player_id]
        
        return {
            'has_recharged': data['first_recharge_done'],
            'can_recharge': not data['first_recharge_done'],
            'total_recharged': data['total_recharged'],
            'config': self.FIRST_RECHARGE if not data['first_recharge_done'] else None
        }
    
    def do_first_recharge(self, player_id: str) -> Dict:
        """执行首充"""
        status = self.get_first_recharge_status(player_id)
        
        if status['has_recharged']:
            return {'success': False, 'error': '已经完成首充'}
        
        data = self.player_recharge[player_id]
        data['first_recharge_done'] = True
        data['first_recharge_time'] = int(time.time())
        data['total_recharged'] += self.FIRST_RECHARGE['price']
        
        return {
            'success': True,
            'message': '首充成功！获得双倍钻石！',
            'rewards': {
                'diamonds': self.FIRST_RECHARGE['total_diamonds'],
                'extra': self.FIRST_RECHARGE['extra_rewards']
            },
            'is_double': True
        }
    
    def get_cumulative_status(self, player_id: str) -> Dict:
        """获取累充状态"""
        if player_id not in self.player_recharge:
            self.get_first_recharge_status(player_id)  # 初始化
        
        data = self.player_recharge[player_id]
        total = data['total_recharged']
        
        claimed = self.player_claimed.get(player_id, [])
        
        # 找出可领取的奖励
        claimable = []
        for amount, reward in self.CUMULATIVE_REWARDS.items():
            if total >= amount and amount not in claimed:
                claimable.append({
                    'amount': amount,
                    'reward': reward
                })
        
        # 找出下一档
        next_reward = None
        for amount in sorted(self.CUMULATIVE_REWARDS.keys()):
            if amount > total:
                next_reward = {
                    'amount': amount,
                    'need_more': amount - total,
                    'reward': self.CUMULATIVE_REWARDS[amount]
                }
                break
        
        return {
            'total_recharged': total,
            'claimable_rewards': claimable,
            'claimed_count': len(claimed),
            'next_reward': next_reward,
            'all_rewards': [
                {
                    'amount': amount,
                    'reward': reward,
                    'claimed': amount in claimed,
                    'can_claim': total >= amount and amount not in claimed
                }
                for amount, reward in self.CUMULATIVE_REWARDS.items()
            ]
        }
    
    def claim_cumulative_reward(self, player_id: str, amount: int) -> Dict:
        """领取累充奖励"""
        status = self.get_cumulative_status(player_id)
        
        if amount not in self.CUMULATIVE_REWARDS:
            return {'success': False, 'error': '无效的奖励档位'}
        
        if status['total_recharged'] < amount:
            return {'success': False, 'error': '充值金额不足'}
        
        if player_id not in self.player_claimed:
            self.player_claimed[player_id] = []
        
        if amount in self.player_claimed[player_id]:
            return {'success': False, 'error': '已经领取过该奖励'}
        
        self.player_claimed[player_id].append(amount)
        reward = self.CUMULATIVE_REWARDS[amount]
        
        return {
            'success': True,
            'message': f'成功领取累充{amount}元奖励！',
            'reward': reward
        }
    
    def on_recharge(self, player_id: str, amount: float) -> Dict:
        """充值回调"""
        if player_id not in self.player_recharge:
            self.get_first_recharge_status(player_id)
        
        self.player_recharge[player_id]['total_recharged'] += amount
        
        # 检查是否触发累充奖励
        status = self.get_cumulative_status(player_id)
        triggered = []
        
        for reward_info in status['claimable_rewards']:
            triggered.append(reward_info['amount'])
        
        return {
            'success': True,
            'amount': amount,
            'total': status['total_recharged'],
            'triggered_rewards': triggered
        }


class LimitedTimePackSystem:
    """限时礼包系统"""
    
    PACKS = {
        'daily_special': {
            'id': 'daily_special',
            'name': '每日特惠',
            'price': 12,
            'original_price': 30,
            'diamonds': 120,
            'coins': 1200,
            'reset': 'daily',
            'tag': '每日'
        },
        'weekly_deal': {
            'id': 'weekly_deal',
            'name': '周末狂欢',
            'price': 68,
            'original_price': 150,
            'diamonds': 680,
            'coins': 6800,
            'destiny_cards': 3,
            'reset': 'weekly',
            'tag': '周末'
        },
        'monthly_pass': {
            'id': 'monthly_pass',
            'name': '超值月卡',
            'price': 30,
            'diamonds': 300,
            'daily_reward': {'diamonds': 30, 'coins': 300},
            'duration': 30,
            'tag': '热销'
        },
        'starter_pack': {
            'id': 'starter_pack',
            'name': '新手超值包',
            'price': 6,
            'original_price': 60,
            'diamonds': 60,
            'coins': 600,
            'skin': 'starter_skin',
            'limit': 1,
            'tag': '新手'
        },
        'holiday_special': {
            'id': 'holiday_special',
            'name': '节日限定',
            'price': 128,
            'original_price': 300,
            'diamonds': 1280,
            'coins': 12800,
            'exclusive_skin': 'holiday_2026',
            'limit': 1,
            'tag': '限定'
        }
    }
    
    def __init__(self):
        self.player_packs: Dict[str, Dict] = {}  # player_id -> {pack_id: count}
        self.player_purchases: Dict[str, List] = {}  # 购买记录
    
    def get_available_packs(self, player_id: str) -> List[Dict]:
        """获取可用礼包"""
        available = []
        
        for pack_id, pack in self.PACKS.items():
            pack_info = {
                **pack,
                'can_purchase': self._can_purchase(player_id, pack_id)
            }
            available.append(pack_info)
        
        return available
    
    def _can_purchase(self, player_id: str, pack_id: str) -> bool:
        """检查是否可以购买"""
        pack = self.PACKS.get(pack_id)
        if not pack:
            return False
        
        if 'limit' in pack:
            purchased = self.player_packs.get(player_id, {}).get(pack_id, 0)
            if purchased >= pack['limit']:
                return False
        
        return True
    
    def purchase_pack(self, player_id: str, pack_id: str) -> Dict:
        """购买礼包"""
        if pack_id not in self.PACKS:
            return {'success': False, 'error': '礼包不存在'}
        
        if not self._can_purchase(player_id, pack_id):
            return {'success': False, 'error': '无法购买该礼包'}
        
        pack = self.PACKS[pack_id]
        
        # 记录购买
        if player_id not in self.player_packs:
            self.player_packs[player_id] = {}
        
        self.player_packs[player_id][pack_id] = self.player_packs[player_id].get(pack_id, 0) + 1
        
        # 构建奖励
        rewards = {
            'diamonds': pack.get('diamonds', 0),
            'coins': pack.get('coins', 0)
        }
        
        if 'destiny_cards' in pack:
            rewards['destiny_cards'] = pack['destiny_cards']
        if 'skin' in pack:
            rewards['skin'] = pack['skin']
        if 'exclusive_skin' in pack:
            rewards['exclusive_skin'] = pack['exclusive_skin']
        
        return {
            'success': True,
            'pack_name': pack['name'],
            'rewards': rewards,
            'saved': pack.get('original_price', 0) - pack['price']
        }

# 全局实例
first_recharge_system = FirstRechargeSystem()
limited_pack_system = LimitedTimePackSystem()
