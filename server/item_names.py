"""
命运塔·首登者 - 道具命名系统
Attractive Item Names for Shop
"""

# 扑克牌皮肤命名
CARD_SKIN_NAMES = {
    # 稀有品质 (188钻石)
    'skin_kawaii_pink': {
        'name': '萌猫甜心',
        'subtitle': '粉爪印记',
        'story': '传说中被猫神祝福的纸牌，出牌时会有猫咪轻吻你的指尖',
        'rarity': '稀有',
        'price': 188
    },
    'skin_cute_bear': {
        'name': '蜂蜜小熊',
        'subtitle': '温暖拥抱',
        'story': '森林深处最温柔的守护者，给你最治愈的出牌体验',
        'rarity': '稀有',
        'price': 188
    },
    'skin_moon_rabbit': {
        'name': '月宫玉兔',
        'subtitle': '嫦娥赐福',
        'story': '月宫中的捣药玉兔，为每张牌注入月之精华',
        'rarity': '稀有',
        'price': 288
    },
    
    # 史诗品质 (288-388钻石)
    'skin_magic_crystal': {
        'name': '永恒水晶',
        'subtitle': '七彩棱镜',
        'story': '远古法师用生命凝聚的水晶，折射出命运的七种可能',
        'rarity': '史诗',
        'price': 388
    },
    'skin_nature_sakura': {
        'name': '落樱缤纷',
        'subtitle': '春日恋歌',
        'story': '千年樱花树下的誓言，让每一次出牌都如花瓣般唯美',
        'rarity': '史诗',
        'price': 288
    },
    'skin_ocean_deep': {
        'name': '深海秘境',
        'subtitle': '亚特兰蒂斯',
        'story': '来自沉没古城的神秘力量，深海之光指引你的命运',
        'rarity': '史诗',
        'price': 288
    },
    'skin_forest_spirit': {
        'name': '精灵密语',
        'subtitle': '德鲁伊之赐',
        'story': '森林精灵低声吟唱，自然之力流淌于牌间',
        'rarity': '史诗',
        'price': 388
    },
    'skin_space_galaxy': {
        'name': '星河漫游',
        'subtitle': '星际穿越',
        'story': '穿越亿万光年的星光，此刻在你手中闪耀',
        'rarity': '史诗',
        'price': 388
    },
    
    # 传说品质 (488-588钻石)
    'skin_magic_dragon': {
        'name': '至尊龙魂',
        'subtitle': '东方神龙',
        'story': '九龙汇聚，天地共鸣。唯有真正的王者才配拥有',
        'rarity': '传说',
        'price': 588
    },
    'skin_phoenix_nirvana': {
        'name': '涅槃凤凰',
        'subtitle': '不死之翼',
        'story': '浴火重生，羽化登仙。凤凰于飞，翙翙其羽',
        'rarity': '传说',
        'price': 588
    },
    'skin_tech_cyber': {
        'name': '赛博纪元',
        'subtitle': '未来已来',
        'story': '2077年的数字灵魂，霓虹灯光下的命运博弈',
        'rarity': '传说',
        'price': 488
    },
    'skin_ice_frost': {
        'name': '绝对零度',
        'subtitle': '冰封王座',
        'story': '极北之地的永恒寒冰，冻结时间的王者之选',
        'rarity': '传说',
        'price': 588
    },
    'skin_fire_inferno': {
        'name': '炼狱业火',
        'subtitle': '烈焰焚天',
        'story': '来自地狱深处的业火，燃烧一切阻挡你的命运',
        'rarity': '传说',
        'price': 588
    },
    'skin_thunder_storm': {
        'name': '雷霆万钧',
        'subtitle': '天罚降临',
        'story': '宙斯之怒，雷霆之力。掌控雷电，主宰命运',
        'rarity': '传说',
        'price': 588
    },
    
    # 神话/VIP专属 (VIP8+/888钻石)
    'skin_vip_golden': {
        'name': '黄金圣衣',
        'subtitle': '诸神黄昏',
        'story': '只有达到VIP8的至尊玩家才有资格拥有的神圣之物',
        'rarity': '神话',
        'price': 888,
        'vip_required': 8
    },
    'skin_dark_void': {
        'name': '虚空行者',
        'subtitle': '次元裂缝',
        'story': '来自异次元的神秘力量，普通人无法承受的黑暗美学',
        'rarity': '神话',
        'price': 888,
        'vip_required': 9
    },
    'skin_rainbow_unicorn': {
        'name': '彩虹独角兽',
        'subtitle': '梦幻泡影',
        'story': '传说中最稀有的存在，只有被命运眷顾的人才能获得',
        'rarity': '神话',
        'price': 888
    },
    
    # 限定皮肤 (季节性)
    'skin_christmas_miracle': {
        'name': '圣诞奇迹',
        'subtitle': '冬日恋歌',
        'story': '每年圣诞限时发售，错过再等一年',
        'rarity': '限定',
        'price': 888,
        'limited': True,
        'season': 'christmas'
    },
    'skin_halloween_ghost': {
        'name': '万圣惊魂',
        'subtitle': '百鬼夜行',
        'story': '万圣节限定，诡异与美丽的完美结合',
        'rarity': '限定',
        'price': 888,
        'limited': True,
        'season': 'halloween'
    },
    'skin_spring_festival': {
        'name': '锦绣中华',
        'subtitle': '龙腾盛世',
        'story': '春节限定，浓浓中国风的华丽皮肤',
        'rarity': '限定',
        'price': 888,
        'limited': True,
        'season': 'spring_festival'
    }
}

# 头像框命名
AVATAR_FRAME_NAMES = {
    'frame_bronze': {
        'name': '青铜勇士',
        'subtitle': '初出茅庐',
        'story': '每位勇士的起点，见证你的第一步',
        'rarity': '普通',
        'price': 50
    },
    'frame_silver': {
        'name': '白银先锋',
        'subtitle': '崭露头角',
        'story': '你已不再是新手，银光闪闪证明你的成长',
        'rarity': '稀有',
        'price': 100
    },
    'frame_gold': {
        'name': '黄金霸主',
        'subtitle': '王者之气',
        'story': '金光闪耀，彰显你的尊贵身份',
        'rarity': '史诗',
        'price': 200
    },
    'frame_platinum': {
        'name': '铂金贵族',
        'subtitle': '高贵冷艳',
        'story': '稀有金属打造的尊贵象征，低调中透着奢华',
        'rarity': '史诗',
        'price': 300
    },
    'frame_diamond': {
        'name': '钻石永恒',
        'subtitle': '璀璨夺目',
        'story': '如钻石般永恒闪耀，见证你的不朽传奇',
        'rarity': '传说',
        'price': 500
    },
    'frame_legend': {
        'name': '传说之巅',
        'subtitle': '傲视群雄',
        'story': '只有真正的传说才配拥有的至高荣耀',
        'rarity': '传说',
        'price': 800
    },
    'frame_mythical': {
        'name': '神话降临',
        'subtitle': '诸神黄昏',
        'story': '神话般的存在，让所有人仰望你的光芒',
        'rarity': '神话',
        'price': 1000,
        'vip_required': 8
    },
    'frame_king': {
        'name': '至尊皇冠',
        'subtitle': '天命所归',
        'story': '王者的象征，权力的巅峰，你是真正的命运之主',
        'rarity': '神话',
        'price': 2000,
        'vip_required': 10
    }
}

# 称号命名
TITLE_NAMES = {
    'title_novice': {
        'name': '命运学徒',
        'condition': '完成新手教程'
    },
    'title_warrior': {
        'name': '爬塔勇士',
        'condition': '首次登顶'
    },
    'title_master': {
        'name': '塔之大师',
        'condition': '登顶10次'
    },
    'title_legend': {
        'name': '传说首登者',
        'condition': '登顶100次'
    },
    'title_guardian': {
        'name': '永恒守卫',
        'condition': '作为守卫获胜10次'
    },
    'title_conqueror': {
        'name': '命运征服者',
        'condition': '击败守卫50次'
    },
    'title_champion': {
        'name': '赛季冠军',
        'condition': '获得赛季第一名'
    },
    'title_collector': {
        'name': '收藏家',
        'condition': '收集10款皮肤'
    },
    'title_vip': {
        'name': '尊贵VIP',
        'condition': '达到VIP5'
    },
    'title_god': {
        'name': '命运之神',
        'condition': '全服排名第一'
    }
}

# 嘲讽包命名
TAUNT_PACKAGE_NAMES = {
    'taunt_basic': {
        'name': '初级挑衅',
        'subtitle': '入门嘲讽',
        'items': ['得意', '偷笑', '鼓掌', '加油'],
        'price': 188
    },
    'taunt_advanced': {
        'name': '高级嘲讽',
        'subtitle': '心理战专家',
        'items': ['大笑', '酷', '666', '就这？'],
        'price': 388
    },
    'taunt_master': {
        'name': '嘲讽大师',
        'subtitle': '杀人诛心',
        'items': ['下跪', '嘲讽舞', '菜', '实力碾压'],
        'price': 688
    },
    'taunt_god': {
        'name': '神级嘲讽',
        'subtitle': '气到退游',
        'items': ['全部嘲讽动作', '专属嘲讽框', '传说嘲讽'],
        'price': 1288
    }
}

# 打印所有命名
if __name__ == "__main__":
    print("🎨 命运塔·首登者 - 道具命名系统")
    print("=" * 60)
    
    print("\n🃏 扑克牌皮肤 (20款):")
    for skin_id, info in CARD_SKIN_NAMES.items():
        print(f"  • {info['name']} ({info['subtitle']}) - {info['rarity']} 💎{info['price']}")
    
    print("\n👤 头像框 (8款):")
    for frame_id, info in AVATAR_FRAME_NAMES.items():
        print(f"  • {info['name']} ({info['subtitle']}) - {info['rarity']} 💎{info['price']}")
    
    print("\n🏆 称号 (10款):")
    for title_id, info in TITLE_NAMES.items():
        print(f"  • {info['name']} - {info['condition']}")
    
    print("\n🎭 嘲讽包 (4款):")
    for taunt_id, info in TAUNT_PACKAGE_NAMES.items():
        print(f"  • {info['name']} ({info['subtitle']}) - 💎{info['price']}")
    
    print(f"\n📊 总计: {len(CARD_SKIN_NAMES)}皮肤 + {len(AVATAR_FRAME_NAMES)}头像框 + {len(TITLE_NAMES)}称号 + {len(TAUNT_PACKAGE_NAMES)}嘲讽包")
