"""
命运塔·首登者 - 充值系统 V2
9档套餐 + 多币种支持 + 直接购买金币/钻石
"""
import time
from typing import Dict, List, Optional
from dataclasses import dataclass

# ============================================
# 9档充值套餐 - 人民币定价
# ============================================
RECHARGE_PACKAGES = {
    'package_29': {
        'id': 'package_29',
        'cny_price': 29,
        'name': '新手礼包',
        'diamonds': 300,
        'bonus_diamonds': 30,
        'total_diamonds': 330,
        'first_purchase_bonus': 300,  # 首充额外赠送
        'icon': '💎',
        'tag': 'hot',
        'description': '超值新手礼包，首充双倍',
        'gift_items': [
            {'item': 'exp_card', 'count': 3},
            {'item': 'lucky_charm', 'count': 1}
        ]
    },
    
    'package_39': {
        'id': 'package_39',
        'cny_price': 39,
        'name': '小额特惠',
        'diamonds': 400,
        'bonus_diamonds': 50,
        'total_diamonds': 450,
        'first_purchase_bonus': 400,
        'icon': '💎',
        'tag': 'value',
        'description': '小额特惠，性价比之选',
        'gift_items': [
            {'item': 'exp_card', 'count': 5},
            {'item': 'lucky_charm', 'count': 2}
        ]
    },
    
    'package_88': {
        'id': 'package_88',
        'cny_price': 88,
        'name': '周卡礼包',
        'diamonds': 900,
        'bonus_diamonds': 150,
        'total_diamonds': 1050,
        'first_purchase_bonus': 900,
        'icon': '💎💎',
        'tag': 'popular',
        'description': '最受欢迎，周卡优惠',
        'gift_items': [
            {'item': 'exp_card', 'count': 10},
            {'item': 'lucky_charm', 'count': 5},
            {'item': 'taunt_pack_1', 'count': 1}
        ],
        'weekly_card': True,  # 包含周卡特权
        'weekly_diamonds': 100  # 每日领取100钻石，持续7天
    },
    
    'package_99': {
        'id': 'package_99',
        'cny_price': 99,
        'name': '月卡入门',
        'diamonds': 1000,
        'bonus_diamonds': 200,
        'total_diamonds': 1200,
        'first_purchase_bonus': 1000,
        'icon': '💎💎',
        'tag': 'monthly',
        'description': '月卡入门，每日收益',
        'gift_items': [
            {'item': 'exp_card', 'count': 15},
            {'item': 'lucky_charm', 'count': 8},
            {'item': 'taunt_pack_1', 'count': 1}
        ],
        'monthly_card': True,
        'monthly_diamonds': 150  # 每日领取150钻石，持续30天
    },
    
    'package_128': {
        'id': 'package_128',
        'cny_price': 128,
        'name': '进阶礼包',
        'diamonds': 1280,
        'bonus_diamonds': 320,
        'total_diamonds': 1600,
        'first_purchase_bonus': 1280,
        'icon': '💎💎💎',
        'tag': 'recommend',
        'description': '强烈推荐，进阶必备',
        'gift_items': [
            {'item': 'exp_card', 'count': 20},
            {'item': 'lucky_charm', 'count': 10},
            {'item': 'taunt_pack_2', 'count': 1},
            {'item': 'card_skin_random', 'count': 1}
        ]
    },
    
    'package_288': {
        'id': 'package_288',
        'cny_price': 288,
        'name': '豪华至尊',
        'diamonds': 2880,
        'bonus_diamonds': 864,
        'total_diamonds': 3744,
        'first_purchase_bonus': 2880,
        'icon': '💎💎💎💎',
        'tag': 'luxury',
        'description': '豪华至尊，尊享特权',
        'gift_items': [
            {'item': 'exp_card', 'count': 50},
            {'item': 'lucky_charm', 'count': 25},
            {'item': 'taunt_pack_2', 'count': 1},
            {'item': 'card_skin_epic', 'count': 1},
            {'item': 'avatar_frame', 'count': 1}
        ],
        'vip_exp': 288  # VIP经验值
    },
    
    'package_599': {
        'id': 'package_599',
        'cny_price': 599,
        'name': '富豪礼包',
        'diamonds': 5990,
        'bonus_diamonds': 2396,
        'total_diamonds': 8386,
        'first_purchase_bonus': 5990,
        'icon': '👑',
        'tag': 'vip',
        'description': '富豪专属，尊贵标识',
        'gift_items': [
            {'item': 'exp_card', 'count': 100},
            {'item': 'lucky_charm', 'count': 50},
            {'item': 'taunt_pack_3', 'count': 1},
            {'item': 'card_skin_legendary', 'count': 1},
            {'item': 'avatar_frame_vip', 'count': 1},
            {'item': 'title_rich', 'count': 1}
        ],
        'vip_exp': 599,
        'exclusive_badge': '富豪徽章'
    },
    
    'package_999': {
        'id': 'package_999',
        'cny_price': 999,
        'name': '传奇礼包',
        'diamonds': 9990,
        'bonus_diamonds': 4995,
        'total_diamonds': 14985,
        'first_purchase_bonus': 9990,
        'icon': '👑👑',
        'tag': 'legend',
        'description': '传奇玩家，永恒荣耀',
        'gift_items': [
            {'item': 'exp_card', 'count': 200},
            {'item': 'lucky_charm', 'count': 100},
            {'item': 'taunt_pack_3', 'count': 1},
            {'item': 'card_skin_legendary_2', 'count': 1},
            {'item': 'avatar_frame_legend', 'count': 1},
            {'item': 'title_legend', 'count': 1},
            {'item': 'exclusive_pet', 'count': 1}
        ],
        'vip_exp': 999,
        'exclusive_badge': '传奇徽章',
        'special_privilege': '专属客服'
    },
    
    'package_2999': {
        'id': 'package_2999',
        'cny_price': 2999,
        'name': '至尊神话',
        'diamonds': 29990,
        'bonus_diamonds': 17994,
        'total_diamonds': 47984,
        'first_purchase_bonus': 29990,
        'icon': '👑👑👑',
        'tag': 'mythical',
        'description': '至尊神话，统治全场',
        'gift_items': [
            {'item': 'exp_card', 'count': 500},
            {'item': 'lucky_charm', 'count': 300},
            {'item': 'taunt_pack_all', 'count': 1},
            {'item': 'card_skin_mythical', 'count': 1},
            {'item': 'avatar_frame_mythical', 'count': 1},
            {'item': 'title_mythical', 'count': 1},
            {'item': 'exclusive_pet_2', 'count': 1},
            {'item': 'custom_card_back', 'count': 1}
        ],
        'vip_exp': 2999,
        'exclusive_badge': '神话徽章',
        'special_privilege': '专属客服+定制服务',
        'permanent_buff': {
            'exp_bonus': 0.5,  # 50%经验加成
            'coin_bonus': 0.3  # 30%金币加成
        }
    }
}

# ============================================
# 多币种汇率配置
# ============================================
CURRENCY_RATES = {
    'CNY': {'rate': 1.0, 'symbol': '¥', 'name': '人民币'},
    'USD': {'rate': 0.14, 'symbol': '$', 'name': '美元'},
    'EUR': {'rate': 0.13, 'symbol': '€', 'name': '欧元'},
    'GBP': {'rate': 0.11, 'symbol': '£', 'name': '英镑'},
    'JPY': {'rate': 21.0, 'symbol': '¥', 'name': '日元'},
    'KRW': {'rate': 190.0, 'symbol': '₩', 'name': '韩元'},
    'HKD': {'rate': 1.1, 'symbol': 'HK$', 'name': '港币'},
    'TWD': {'rate': 4.4, 'symbol': 'NT$', 'name': '新台币'},
    'SGD': {'rate': 0.19, 'symbol': 'S$', 'name': '新加坡元'},
    'AUD': {'rate': 0.21, 'symbol': 'A$', 'name': '澳元'},
    'CAD': {'rate': 0.19, 'symbol': 'C$', 'name': '加元'},
    'INR': {'rate': 11.5, 'symbol': '₹', 'name': '印度卢比'},
    'RUB': {'rate': 12.5, 'symbol': '₽', 'name': '俄罗斯卢布'},
    'THB': {'rate': 4.9, 'symbol': '฿', 'name': '泰铢'},
    'MYR': {'rate': 0.65, 'symbol': 'RM', 'name': '马来西亚林吉特'},
    'IDR': {'rate': 2200, 'symbol': 'Rp', 'name': '印尼盾'},
    'VND': {'rate': 3500, 'symbol': '₫', 'name': '越南盾'},
    'PHP': {'rate': 7.8, 'symbol': '₱', 'name': '菲律宾比索'}
}

# ============================================
# 直接购买金币/钻石
# ============================================
DIRECT_PURCHASE = {
    # 金币购买 (用钻石购买)
    'coins': {
        'small': {
            'diamond_cost': 10,
            'coins': 1000,
            'bonus_coins': 0,
            'icon': '🪙'
        },
        'medium': {
            'diamond_cost': 50,
            'coins': 5500,
            'bonus_coins': 500,
            'icon': '🪙🪙'
        },
        'large': {
            'diamond_cost': 100,
            'coins': 12000,
            'bonus_coins': 2000,
            'icon': '🪙🪙🪙'
        },
        'xlarge': {
            'diamond_cost': 500,
            'coins': 65000,
            'bonus_coins': 15000,
            'icon': '💰'
        },
        'mega': {
            'diamond_cost': 1000,
            'coins': 140000,
            'bonus_coins': 40000,
            'icon': '💰💰'
        }
    },
    
    # 钻石补充 (紧急情况)
    'diamonds_small': {
        'cny_price': 6,
        'diamonds': 60,
        'limit_per_day': 10,
        'description': '小额补充，应急使用'
    }
}

# ============================================
# 嘲讽包
# ============================================
TAUNT_PACKAGES = {
    'taunt_pack_1': {
        'id': 'taunt_pack_1',
        'name': '初级嘲讽包',
        'diamond_cost': 188,
        'items': [
            {'type': 'emoji', 'content': '😏', 'name': '得意'},
            {'type': 'emoji', 'content': '🤭', 'name': '偷笑'},
            {'type': 'emoji', 'content': '👏', 'name': '鼓掌'},
            {'type': 'phrase', 'content': '运气不错嘛~', 'name': '夸奖'},
            {'type': 'phrase', 'content': '下一把加油哦', 'name': '鼓励'}
        ],
        'icon': '🎭'
    },
    
    'taunt_pack_2': {
        'id': 'taunt_pack_2',
        'name': '进阶嘲讽包',
        'diamond_cost': 388,
        'items': [
            {'type': 'emoji', 'content': '😎', 'name': '酷'},
            {'type': 'emoji', 'content': '🤣', 'name': '大笑'},
            {'type': 'emoji', 'content': '🎯', 'name': '命中'},
            {'type': 'emoji', 'content': '🔥', 'name': '火热'},
            {'type': 'phrase', 'content': '这波操作666', 'name': '666'},
            {'type': 'phrase', 'content': '守卫？不存在的', 'name': '自信'},
            {'type': 'phrase', 'content': '天命在我！', 'name': '天命'},
            {'type': 'animation', 'content': 'drop_mic', 'name': '扔麦'}
        ],
        'icon': '🎭🎭'
    },
    
    'taunt_pack_3': {
        'id': 'taunt_pack_3',
        'name': '大师嘲讽包',
        'diamond_cost': 688,
        'items': [
            {'type': 'emoji', 'content': '👑', 'name': '王者'},
            {'type': 'emoji', 'content': '🏆', 'name': '冠军'},
            {'type': 'emoji', 'content': '💯', 'name': '满分'},
            {'type': 'emoji', 'content': '⚡', 'name': '闪电'},
            {'type': 'emoji', 'content': '🌟', 'name': '闪耀'},
            {'type': 'phrase', 'content': '首登者在此！', 'name': '首登'},
            {'type': 'phrase', 'content': '这就是实力的差距', 'name': '实力'},
            {'type': 'phrase', 'content': '认输吧，凡人', 'name': '霸气'},
            {'type': 'phrase', 'content': '命运眷顾着我', 'name': '命运'},
            {'type': 'animation', 'content': 'victory_dance', 'name': '胜利舞'},
            {'type': 'animation', 'content': 'laugh_roll', 'name': '笑滚'}
        ],
        'icon': '👑🎭'
    },
    
    'taunt_pack_all': {
        'id': 'taunt_pack_all',
        'name': '嘲讽大师全集',
        'diamond_cost': 1288,
        'items': 'all_packs',  # 包含所有嘲讽包
        'bonus_items': [
            {'type': 'exclusive', 'content': '专属嘲讽框', 'name': '嘲讽大师'},
            {'type': 'animation', 'content': 'legendary_taunt', 'name': '传说嘲讽'}
        ],
        'icon': '🎭👑',
        'exclusive_frame': True
    }
}

class RechargeSystemV2:
    """充值系统 V2"""
    
    def __init__(self):
        self.packages = RECHARGE_PACKAGES
        self.currency_rates = CURRENCY_RATES
        self.direct_purchase = DIRECT_PURCHASE
        self.taunt_packages = TAUNT_PACKAGES
    
    def get_package_price(self, package_id: str, currency: str = 'CNY') -> Dict:
        """获取套餐价格（支持多币种）"""
        package = self.packages.get(package_id)
        if not package:
            return {'error': '套餐不存在'}
        
        rate_info = self.currency_rates.get(currency, self.currency_rates['CNY'])
        local_price = round(package['cny_price'] * rate_info['rate'])
        
        return {
            'package_id': package_id,
            'package_name': package['name'],
            'cny_price': package['cny_price'],
            'local_price': local_price,
            'currency': currency,
            'currency_symbol': rate_info['symbol'],
            'currency_name': rate_info['name'],
            'diamonds': package['total_diamonds'],
            'first_purchase_bonus': package['first_purchase_bonus']
        }
    
    def get_all_packages(self, currency: str = 'CNY') -> List[Dict]:
        """获取所有套餐"""
        return [self.get_package_price(pid, currency) for pid in self.packages.keys()]
    
    def buy_coins_with_diamonds(self, size: str, player_diamonds: int) -> Dict:
        """用钻石购买金币"""
        purchase = self.direct_purchase['coins'].get(size)
        if not purchase:
            return {'success': False, 'error': '购买规格不存在'}
        
        if player_diamonds < purchase['diamond_cost']:
            return {'success': False, 'error': f'钻石不足，需要{purchase["diamond_cost"]}钻石'}
        
        return {
            'success': True,
            'diamond_cost': purchase['diamond_cost'],
            'coins_get': purchase['coins'] + purchase['bonus_coins'],
            'message': f'✅ 成功购买 {purchase["coins"] + purchase["bonus_coins"]} 金币！'
        }
    
    def buy_taunt_pack(self, pack_id: str, player_diamonds: int) -> Dict:
        """购买嘲讽包"""
        pack = self.taunt_packages.get(pack_id)
        if not pack:
            return {'success': False, 'error': '嘲讽包不存在'}
        
        if player_diamonds < pack['diamond_cost']:
            return {'success': False, 'error': f'钻石不足，需要{pack["diamond_cost"]}钻石'}
        
        return {
            'success': True,
            'pack_id': pack_id,
            'pack_name': pack['name'],
            'diamond_cost': pack['diamond_cost'],
            'items': pack['items'],
            'message': f'✅ 成功购买「{pack["name"]}」！'
        }
    
    def check_first_purchase(self, player_id: str, package_id: str, purchased_packages: List[str]) -> bool:
        """检查是否是首充"""
        return package_id not in purchased_packages

# 全局实例
recharge_system_v2 = RechargeSystemV2()

print("✅ 充值系统 V2 加载完成")
print("💎 9档充值套餐: 29/39/88/99/128/288/599/999/2999")
print("💰 直接购买: 金币/钻石")
print("🎭 嘲讽包: 4种套餐")
print("🌍 支持18种货币")
