"""
命运塔·首登者 - 精美扑克牌皮肤设计
商城售卖 - 特效边框系统
"""

# 扑克牌皮肤设计集合
CARD_SKINS = {
    # ============================================
    # 基础皮肤 (免费/默认)
    # ============================================
    'classic': {
        'id': 'classic',
        'name': '经典款',
        'description': '传统扑克牌设计，简洁大方',
        'price': {'coins': 0, 'diamonds': 0},
        'rarity': 'common',
        'border_effect': 'none',
        'back_design': 'classic_blue',
        'colors': {
            'hearts': '#d00',
            'diamonds': '#d00',
            'clubs': '#000',
            'spades': '#000'
        },
        'font_family': 'serif',
        'corner_style': 'rounded',
        'animation': 'none'
    },
    
    # ============================================
    # 可爱萌系系列
    # ============================================
    'kawaii_pink': {
        'id': 'kawaii_pink',
        'name': '粉色萌猫',
        'description': '软萌粉色猫咪主题，少女心爆棚',
        'price': {'diamonds': 188},
        'rarity': 'rare',
        'border_effect': 'glow_pink',
        'border_color': '#ff69b4',
        'glow_animation': 'pulse',
        'back_design': 'kawaii_cat_paw',
        'suit_icons': {
            'hearts': '🐱',
            'diamonds': '🐾',
            'clubs': '🎀',
            'spades': '💕'
        },
        'colors': {
            'hearts': '#ff69b4',
            'diamonds': '#ffb6c1',
            'clubs': '#ff1493',
            'spades': '#db7093'
        },
        'background_pattern': 'cat_paws',
        'corner_decorations': 'hearts',
        'font_family': 'kawaii',
        'special_effects': ['meow_on_play', 'sparkle_trail']
    },
    
    'kawaii_bear': {
        'id': 'kawaii_bear',
        'name': '软萌小熊',
        'description': '温暖治愈的小熊家族',
        'price': {'diamonds': 188},
        'rarity': 'rare',
        'border_effect': 'glow_brown',
        'border_color': '#8b4513',
        'glow_animation': 'breathe',
        'back_design': 'bear_face',
        'suit_icons': {
            'hearts': '🐻',
            'diamonds': '🍯',
            'clubs': '🌸',
            'spades': '🎈'
        },
        'colors': {
            'hearts': '#8b4513',
            'diamonds': '#daa520',
            'clubs': '#228b22',
            'spades': '#4682b4'
        },
        'background_pattern': 'honeycomb',
        'corner_decorations': 'honey_drops',
        'special_effects': ['bear_hug_animation', 'honey_drip']
    },
    
    'kawaii_rabbit': {
        'id': 'kawaii_rabbit',
        'name': '月兔幻想',
        'description': '梦幻月兔与星空',
        'price': {'diamonds': 288},
        'rarity': 'epic',
        'border_effect': 'glow_silver',
        'border_color': '#c0c0c0',
        'glow_animation': 'shimmer',
        'back_design': 'moon_rabbit',
        'suit_icons': {
            'hearts': '🐰',
            'diamonds': '🌙',
            'clubs': '⭐',
            'spades': '🥕'
        },
        'colors': {
            'hearts': '#ff69b4',
            'diamonds': '#ffd700',
            'clubs': '#c0c0c0',
            'spades': '#dda0dd'
        },
        'background_pattern': 'stars_moon',
        'special_effects': ['moon_glow', 'star_fall', 'rabbit_jump']
    },
    
    # ============================================
    # 魔法幻想系列
    # ============================================
    'magic_crystal': {
        'id': 'magic_crystal',
        'name': '水晶魔法',
        'description': '璀璨水晶，流光溢彩',
        'price': {'diamonds': 388},
        'rarity': 'epic',
        'border_effect': 'prismatic',
        'border_color': 'rainbow',
        'glow_animation': 'rainbow_cycle',
        'back_design': 'crystal_prism',
        'suit_icons': {
            'hearts': '💎',
            'diamonds': '🔮',
            'clubs': '✨',
            'spades': '🌟'
        },
        'colors': {
            'hearts': '#ff1493',
            'diamonds': '#00ffff',
            'clubs': '#ff00ff',
            'spades': '#9400d3'
        },
        'background_pattern': 'crystal_facets',
        'special_effects': ['crystal_reflection', 'prismatic_burst', 'gem_sparkle'],
        'card_material': 'crystal'
    },
    
    'magic_dragon': {
        'id': 'magic_dragon',
        'name': '东方神龙',
        'description': '威严霸气的东方龙主题',
        'price': {'diamonds': 588},
        'rarity': 'legendary',
        'border_effect': 'flame_aura',
        'border_color': '#ff4500',
        'glow_animation': 'fire_dance',
        'back_design': 'dragon_emblem',
        'suit_icons': {
            'hearts': '🐲',
            'diamonds': '🔥',
            'clubs': '⚡',
            'spades': '🐉'
        },
        'colors': {
            'hearts': '#ff4500',
            'diamonds': '#ffd700',
            'clubs': '#ff0000',
            'spades': '#8b0000'
        },
        'background_pattern': 'dragon_scales',
        'special_effects': ['dragon_roar', 'fire_breath', 'lightning_strike', 'scale_shimmer'],
        'card_material': 'golden_dragon'
    },
    
    'magic_phoenix': {
        'id': 'magic_phoenix',
        'name': '涅槃凤凰',
        'description': '浴火重生的不死鸟',
        'price': {'diamonds': 588},
        'rarity': 'legendary',
        'border_effect': 'phoenix_fire',
        'border_color': '#ff6347',
        'glow_animation': 'flame_rise',
        'back_design': 'phoenix_wings',
        'suit_icons': {
            'hearts': '🔥',
            'diamonds': '🪶',
            'clubs': '🌅',
            'spades': '💫'
        },
        'colors': {
            'hearts': '#ff4500',
            'diamonds': '#ff8c00',
            'clubs': '#ffa500',
            'spades': '#ff6347'
        },
        'background_pattern': 'feathers_flames',
        'special_effects': ['phoenix_rise', 'ash_to_fire', 'wing_spread', 'fire_trail'],
        'card_material': 'phoenix_feather'
    },
    
    # ============================================
    # 自然系列
    # ============================================
    'nature_sakura': {
        'id': 'nature_sakura',
        'name': '樱花飞舞',
        'description': '春日樱花，浪漫唯美',
        'price': {'diamonds': 288},
        'rarity': 'epic',
        'border_effect': 'petal_fall',
        'border_color': '#ffb7c5',
        'glow_animation': 'petal_drift',
        'back_design': 'sakura_branch',
        'suit_icons': {
            'hearts': '🌸',
            'diamonds': '🌺',
            'clubs': '🌷',
            'spades': '🌹'
        },
        'colors': {
            'hearts': '#ffb7c5',
            'diamonds': '#ffc0cb',
            'clubs': '#ff69b4',
            'spades': '#db7093'
        },
        'background_pattern': 'sakura_petals',
        'special_effects': ['petal_fall', 'bloom_glow', 'cherry_blossom_rain']
    },
    
    'nature_ocean': {
        'id': 'nature_ocean',
        'name': '深海秘境',
        'description': '神秘海洋，波光粼粼',
        'price': {'diamonds': 288},
        'rarity': 'epic',
        'border_effect': 'water_ripple',
        'border_color': '#00bfff',
        'glow_animation': 'wave_motion',
        'back_design': 'ocean_waves',
        'suit_icons': {
            'hearts': '🐙',
            'diamonds': '🐚',
            'clubs': '🐠',
            'spades': '🦈'
        },
        'colors': {
            'hearts': '#ff6b6b',
            'diamonds': '#4ecdc4',
            'clubs': '#45b7d1',
            'spades': '#2c3e50'
        },
        'background_pattern': 'ocean_waves',
        'special_effects': ['wave_crest', 'bubble_rise', 'deep_sea_glow', 'jellyfish_float']
    },
    
    'nature_forest': {
        'id': 'nature_forest',
        'name': '精灵森林',
        'description': '神秘森林，精灵魔法',
        'price': {'diamonds': 388},
        'rarity': 'epic',
        'border_effect': 'leaf_glow',
        'border_color': '#228b22',
        'glow_animation': 'firefly_dance',
        'back_design': 'ancient_tree',
        'suit_icons': {
            'hearts': '🦌',
            'diamonds': '🦋',
            'clubs': '🍄',
            'spades': '🌲'
        },
        'colors': {
            'hearts': '#e74c3c',
            'diamonds': '#f1c40f',
            'clubs': '#27ae60',
            'spades': '#2c3e50'
        },
        'background_pattern': 'forest_leaves',
        'special_effects': ['firefly_glow', 'leaf_fall', 'magic_spores', 'deer_appear']
    },
    
    # ============================================
    # 科技未来系列
    # ============================================
    'tech_cyber': {
        'id': 'tech_cyber',
        'name': '赛博朋克',
        'description': '霓虹灯光，未来科技',
        'price': {'diamonds': 488},
        'rarity': 'legendary',
        'border_effect': 'neon_pulse',
        'border_color': '#0ff',
        'glow_animation': 'neon_flicker',
        'back_design': 'circuit_board',
        'suit_icons': {
            'hearts': '🔴',
            'diamonds': '💠',
            'clubs': '⚡',
            'spades': '🤖'
        },
        'colors': {
            'hearts': '#ff0080',
            'diamonds': '#00ffff',
            'clubs': '#ffff00',
            'spades': '#ff00ff'
        },
        'background_pattern': 'digital_grid',
        'special_effects': ['glitch_effect', 'scan_line', 'data_stream', 'neon_burst'],
        'card_material': 'holographic'
    },
    
    'tech_space': {
        'id': 'tech_space',
        'name': '星际穿越',
        'description': '浩瀚宇宙，星辰大海',
        'price': {'diamonds': 388},
        'rarity': 'epic',
        'border_effect': 'star_field',
        'border_color': '#4169e1',
        'glow_animation': 'star_twinkle',
        'back_design': 'galaxy_spiral',
        'suit_icons': {
            'hearts': '🚀',
            'diamonds': '🪐',
            'clubs': '👽',
            'spades': '🌌'
        },
        'colors': {
            'hearts': '#ff6347',
            'diamonds': '#4169e1',
            'clubs': '#9932cc',
            'spades': '#00ced1'
        },
        'background_pattern': 'starry_sky',
        'special_effects': ['warp_speed', 'planet_orbit', 'alien_beam', 'nebula_cloud']
    },
    
    # ============================================
    # 节日限定系列
    # ============================================
    'festival_christmas': {
        'id': 'festival_christmas',
        'name': '圣诞奇迹',
        'description': '冬日圣诞，温馨浪漫（限定）',
        'price': {'diamonds': 888},
        'rarity': 'legendary',
        'border_effect': 'snow_glow',
        'border_color': '#ff0000',
        'glow_animation': 'snow_fall',
        'back_design': 'christmas_tree',
        'suit_icons': {
            'hearts': '🎅',
            'diamonds': '🎁',
            'clubs': '🎄',
            'spades': '❄️'
        },
        'colors': {
            'hearts': '#ff0000',
            'diamonds': '#ffd700',
            'clubs': '#008000',
            'spades': '#ffffff'
        },
        'background_pattern': 'snowflakes',
        'special_effects': ['snow_fall', 'gift_open', 'sleigh_ride', 'jingle_bells'],
        'limited': True,
        'available_until': '2026-12-31'
    },
    
    'festival_halloween': {
        'id': 'festival_halloween',
        'name': '万圣惊魂',
        'description': '鬼怪派对，惊悚刺激（限定）',
        'price': {'diamonds': 888},
        'rarity': 'legendary',
        'border_effect': 'pumpkin_glow',
        'border_color': '#ff6600',
        'glow_animation': 'flicker',
        'back_design': 'haunted_house',
        'suit_icons': {
            'hearts': '🎃',
            'diamonds': '👻',
            'clubs': '🦇',
            'spades': '🕷️'
        },
        'colors': {
            'hearts': '#ff6600',
            'diamonds': '#800080',
            'clubs': '#000000',
            'spades': '#4b0082'
        },
        'background_pattern': 'spider_webs',
        'special_effects': ['ghost_float', 'pumpkin_laugh', 'bat_fly', 'spider_crawl'],
        'limited': True,
        'available_until': '2026-10-31'
    },
    
    # ============================================
    # 至尊VIP系列
    # ============================================
    'vip_golden': {
        'id': 'vip_golden',
        'name': '至尊黄金',
        'description': '纯金打造，尊贵典雅（VIP专属）',
        'price': {'vip_level': 8},
        'rarity': 'mythical',
        'border_effect': 'golden_aura',
        'border_color': '#ffd700',
        'glow_animation': 'gold_shimmer',
        'back_design': 'golden_dragon_pattern',
        'suit_icons': {
            'hearts': '👑',
            'diamonds': '💎',
            'clubs': '⚜️',
            'spades': '🦁'
        },
        'colors': {
            'hearts': '#ffd700',
            'diamonds': '#ffffff',
            'clubs': '#daa520',
            'spades': '#b8860b'
        },
        'background_pattern': 'gold_leaf',
        'special_effects': ['crown_appear', 'diamond_shower', 'royal_trumpet', 'golden_explosion'],
        'card_material': 'pure_gold',
        'vip_exclusive': True
    }
}

# 边框特效定义
BORDER_EFFECTS = {
    'none': {'name': '无特效', 'css_class': 'border-none'},
    'glow_pink': {'name': '粉色光晕', 'css_class': 'border-glow-pink', 'animation': 'pulse'},
    'glow_brown': {'name': '棕色光晕', 'css_class': 'border-glow-brown', 'animation': 'breathe'},
    'glow_silver': {'name': '银色闪光', 'css_class': 'border-glow-silver', 'animation': 'shimmer'},
    'prismatic': {'name': '七彩棱镜', 'css_class': 'border-prismatic', 'animation': 'rainbow'},
    'flame_aura': {'name': '火焰光环', 'css_class': 'border-flame', 'animation': 'flicker'},
    'phoenix_fire': {'name': '凤凰之火', 'css_class': 'border-phoenix', 'animation': 'rise'},
    'petal_fall': {'name': '花瓣飘落', 'css_class': 'border-petals', 'animation': 'fall'},
    'water_ripple': {'name': '水波涟漪', 'css_class': 'border-water', 'animation': 'ripple'},
    'leaf_glow': {'name': '绿叶发光', 'css_class': 'border-leaf', 'animation': 'glow'},
    'neon_pulse': {'name': '霓虹脉冲', 'css_class': 'border-neon', 'animation': 'pulse'},
    'star_field': {'name': '星空闪烁', 'css_class': 'border-stars', 'animation': 'twinkle'},
    'snow_glow': {'name': '雪花发光', 'css_class': 'border-snow', 'animation': 'fall'},
    'pumpkin_glow': {'name': '南瓜光芒', 'css_class': 'border-pumpkin', 'animation': 'flicker'},
    'golden_aura': {'name': '金色光环', 'css_class': 'border-golden', 'animation': 'shimmer'}
}

# 获取皮肤列表
def get_available_skins(player_vip_level: int = 0) -> list:
    """获取玩家可用的皮肤列表"""
    available = []
    for skin_id, skin in CARD_SKINS.items():
        # 检查VIP专属
        if skin.get('vip_exclusive') and player_vip_level < skin.get('vip_level', 999):
            continue
        # 检查限时
        if skin.get('limited'):
            import time
            if time.time() > time.mktime(time.strptime(skin['available_until'], '%Y-%m-%d')):
                continue
        available.append(skin)
    return sorted(available, key=lambda x: ['common', 'rare', 'epic', 'legendary', 'mythical'].index(x['rarity']))

# 获取CSS样式
def get_skin_css(skin_id: str) -> str:
    """获取皮肤的CSS样式"""
    skin = CARD_SKINS.get(skin_id, CARD_SKINS['classic'])
    border_effect = BORDER_EFFECTS.get(skin.get('border_effect', 'none'), {})
    
    css = f"""
    .card-skin-{skin_id} {{
        border: 3px solid {skin.get('border_color', '#000')};
        border-radius: 12px;
        box-shadow: 0 0 20px {skin.get('border_color', 'transparent')}80;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }}
    
    .card-skin-{skin_id}:hover {{
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 40px {skin.get('border_color', '#000')}60;
    }}
    
    .card-skin-{skin_id}::before {{
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, {skin.get('border_color', '#ffd700')}, transparent, {skin.get('border_color', '#ffd700')});
        border-radius: 14px;
        z-index: -1;
        animation: {border_effect.get('animation', 'none')} 2s infinite;
    }}
    
    .card-skin-{skin_id} .suit {{
        color: {skin.get('colors', {}).get('hearts', '#d00')};
        font-size: 28px;
    }}
    
    .card-skin-{skin_id} .rank {{
        font-family: {skin.get('font_family', 'serif')};
        font-weight: bold;
        text-shadow: 0 0 10px {skin.get('border_color', 'transparent')};
    }}
    """
    return css

# CSS动画定义
CSS_ANIMATIONS = """
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 20px currentColor; }
    50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
}

@keyframes breathe {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
}

@keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

@keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
    25%, 75% { opacity: 0.9; }
}

@keyframes fall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
}

@keyframes ripple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

@keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
}
"""

print("✅ 扑克牌皮肤设计系统加载完成")
print(f"🎨 共 {len(CARD_SKINS)} 套精美皮肤")
print("💎 包含: 可爱萌系/魔法幻想/自然风光/科技未来/节日限定")
print("✨ 特效边框: 发光/闪烁/飘落/波纹等多种效果")
