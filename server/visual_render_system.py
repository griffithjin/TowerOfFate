"""
命运塔·首登者 - 游戏渲染效果系统
Visual Rendering System for Items & Skins
"""

# 道具渲染效果定义
ITEM_RENDER_EFFECTS = {
    # ========== 扑克牌皮肤效果 ==========
    'skins': {
        'classic': {
            'name': '经典款',
            'card_css': '''
                border: 2px solid #333;
                background: linear-gradient(135deg, #fff, #f8f8f8);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ''',
            'suit_colors': {
                'hearts': '#d00',
                'diamonds': '#d00',
                'clubs': '#000',
                'spades': '#000'
            },
            'animation': 'none'
        },
        
        'skin_kawaii_pink': {
            'name': '粉色萌猫',
            'card_css': '''
                border: 3px solid #ff69b4;
                background: linear-gradient(135deg, #fff0f5, #ffe4e1);
                box-shadow: 0 0 20px #ff69b4, 0 0 40px rgba(255,105,180,0.4);
                animation: pinkGlow 2s ease-in-out infinite;
            ''',
            'suit_icons': {'hearts': '🐱', 'diamonds': '🐾', 'clubs': '🎀', 'spades': '💕'},
            'suit_colors': {
                'hearts': '#ff69b4',
                'diamonds': '#ffb6c1',
                'clubs': '#ff1493',
                'spades': '#db7093'
            },
            'animation': 'pinkGlow',
            'particle_effect': 'heart_float'
        },
        
        'skin_magic_crystal': {
            'name': '水晶魔法',
            'card_css': '''
                border: 3px solid transparent;
                background: linear-gradient(135deg, #fff, #f0f8ff) padding-box,
                            linear-gradient(45deg, #ff1493, #00ffff, #9400d3) border-box;
                box-shadow: 0 0 30px rgba(255,20,147,0.6), inset 0 0 20px rgba(255,255,255,0.5);
                animation: crystalShine 3s ease-in-out infinite;
            ''',
            'suit_icons': {'hearts': '💎', 'diamonds': '🔮', 'clubs': '✨', 'spades': '🌟'},
            'suit_colors': {
                'hearts': '#ff1493',
                'diamonds': '#00ffff',
                'clubs': '#ff00ff',
                'spades': '#9400d3'
            },
            'animation': 'crystalShine',
            'particle_effect': 'sparkle_burst'
        },
        
        'skin_magic_dragon': {
            'name': '东方神龙',
            'card_css': '''
                border: 3px solid #ff4500;
                background: linear-gradient(135deg, #fff5f0, #ffe4e1);
                box-shadow: 0 0 25px #ff4500, 0 0 50px rgba(255,69,0,0.4);
                animation: fireFlicker 0.5s ease-in-out infinite alternate;
            ''',
            'suit_icons': {'hearts': '🐲', 'diamonds': '🔥', 'clubs': '⚡', 'spades': '🐉'},
            'suit_colors': {
                'hearts': '#ff4500',
                'diamonds': '#ffd700',
                'clubs': '#ff0000',
                'spades': '#8b0000'
            },
            'animation': 'fireFlicker',
            'particle_effect': 'fire_trail'
        },
        
        'skin_nature_sakura': {
            'name': '樱花飞舞',
            'card_css': '''
                border: 3px solid #ffb7c5;
                background: linear-gradient(135deg, #fff, #fff0f5);
                box-shadow: 0 0 20px #ffb7c5, 0 0 40px rgba(255,183,197,0.4);
                animation: sakuraFall 3s ease-in-out infinite;
            ''',
            'suit_icons': {'hearts': '🌸', 'diamonds': '🌺', 'clubs': '🌷', 'spades': '🌹'},
            'suit_colors': {
                'hearts': '#ffb7c5',
                'diamonds': '#ffc0cb',
                'clubs': '#ff69b4',
                'spades': '#db7093'
            },
            'animation': 'sakuraFall',
            'particle_effect': 'petal_drift'
        },
        
        'skin_tech_cyber': {
            'name': '赛博朋克',
            'card_css': '''
                border: 3px solid #0ff;
                background: linear-gradient(135deg, #f0ffff, #e0ffff);
                box-shadow: 0 0 20px #0ff, 0 0 40px rgba(0,255,255,0.6);
                animation: neonPulse 1.5s ease-in-out infinite;
            ''',
            'suit_icons': {'hearts': '🔴', 'diamonds': '💠', 'clubs': '⚡', 'spades': '🤖'},
            'suit_colors': {
                'hearts': '#ff0080',
                'diamonds': '#00ffff',
                'clubs': '#ffff00',
                'spades': '#ff00ff'
            },
            'animation': 'neonPulse',
            'particle_effect': 'glitch_lines'
        }
    },
    
    # ========== 头像框效果 ==========
    'frames': {
        'default': {
            'name': '默认',
            'avatar_css': '''
                border: 2px solid #888;
            ''',
            'name_color': '#fff',
            'badge_icon': ''
        },
        'frame_gold': {
            'name': '黄金框',
            'avatar_css': '''
                border: 3px solid #ffd700;
                box-shadow: 0 0 15px #ffd700;
                animation: goldShimmer 2s linear infinite;
            ''',
            'name_color': '#ffd700',
            'badge_icon': '👑'
        },
        'frame_diamond': {
            'name': '钻石框',
            'avatar_css': '''
                border: 3px solid #0ff;
                box-shadow: 0 0 20px #0ff;
                animation: diamondSparkle 2s ease-in-out infinite;
            ''',
            'name_color': '#0ff',
            'badge_icon': '💎'
        },
        'frame_legend': {
            'name': '传说框',
            'avatar_css': '''
                border: 3px solid #ff6b6b;
                box-shadow: 0 0 25px #ff6b6b, 0 0 50px rgba(255,107,107,0.4);
                animation: legendFlame 1s ease-in-out infinite;
            ''',
            'name_color': '#ff6b6b',
            'badge_icon': '🔥'
        }
    },
    
    # ========== 称号效果 ==========
    'titles': {
        'title_warrior': {
            'name': '战士',
            'display': '⚔️ 战士',
            'title_css': '''
                color: #95a5a6;
                font-weight: bold;
            '''
        },
        'title_master': {
            'name': '大师',
            'display': '🏆 大师',
            'title_css': '''
                color: #f39c12;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(243,156,18,0.5);
            '''
        },
        'title_legend': {
            'name': '传说',
            'display': '👑 传说',
            'title_css': '''
                color: #e74c3c;
                font-weight: bold;
                text-shadow: 0 0 15px rgba(231,76,60,0.6);
                animation: legendGlow 2s ease-in-out infinite;
            '''
        }
    },
    
    # ========== VIP标识 ==========
    'vip': {
        0: {'badge': '', 'color': '#fff'},
        1: {'badge': 'VIP1', 'color': '#95a5a6'},
        2: {'badge': 'VIP2', 'color': '#3498db'},
        3: {'badge': 'VIP3', 'color': '#9b59b6'},
        4: {'badge': 'VIP4', 'color': '#f39c12'},
        5: {'badge': 'VIP5', 'color': '#e74c3c'},
        6: {'badge': 'VIP6', 'color': '#ff6b6b'},
        7: {'badge': 'VIP7', 'color': '#ffd700'},
        8: {'badge': 'VIP8', 'color': '#ffd700', 'special': 'gold_frame'},
        9: {'badge': 'VIP9', 'color': '#ff00ff'},
        10: {'badge': 'VIP10', 'color': '#ff00ff', 'special': 'rainbow_name'}
    }
}

# CSS动画定义
CSS_ANIMATIONS = '''
/* 粉色光晕 */
@keyframes pinkGlow {
    0%, 100% { box-shadow: 0 0 20px #ff69b4, 0 0 40px rgba(255,105,180,0.4); }
    50% { box-shadow: 0 0 30px #ff69b4, 0 0 60px rgba(255,105,180,0.8); }
}

/* 水晶闪光 */
@keyframes crystalShine {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* 火焰闪烁 */
@keyframes fireFlicker {
    0% { box-shadow: 0 0 25px #ff4500; }
    100% { box-shadow: 0 0 35px #ff6347, 0 0 60px rgba(255,99,71,0.8); }
}

/* 樱花飘落 */
@keyframes sakuraFall {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(5px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0deg); }
}

/* 霓虹脉冲 */
@keyframes neonPulse {
    0%, 100% { box-shadow: 0 0 20px #0ff; }
    50% { box-shadow: 0 0 40px #0ff, 0 0 60px rgba(0,255,255,0.6); }
}

/* 金色闪光 */
@keyframes goldShimmer {
    0% { box-shadow: 0 0 15px #ffd700; }
    50% { box-shadow: 0 0 30px #ffd700, 0 0 50px rgba(255,215,0,0.8); }
    100% { box-shadow: 0 0 15px #ffd700; }
}

/* 钻石闪烁 */
@keyframes diamondSparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* 传说光晕 */
@keyframes legendFlame {
    0%, 100% { box-shadow: 0 0 25px #ff6b6b; }
    50% { box-shadow: 0 0 40px #ff6b6b, 0 0 60px rgba(255,107,107,0.6); }
}

/* 传说称号发光 */
@keyframes legendGlow {
    0%, 100% { text-shadow: 0 0 10px rgba(231,76,60,0.5); }
    50% { text-shadow: 0 0 20px rgba(231,76,60,0.8); }
}

/* 粒子效果 */
@keyframes floatHeart {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
}

@keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
}
'''

class VisualRenderer:
    """视觉渲染器"""
    
    def __init__(self):
        self.effects = ITEM_RENDER_EFFECTS
    
    def get_player_full_visual(self, skin_id: str, frame_id: str, title_id: str, vip_level: int) -> Dict:
        """获取玩家完整视觉效果"""
        skin = self.effects['skins'].get(skin_id, self.effects['skins']['classic'])
        frame = self.effects['frames'].get(frame_id, self.effects['frames']['default'])
        title = self.effects['titles'].get(title_id, None)
        vip = self.effects['vip'].get(vip_level, self.effects['vip'][0])
        
        return {
            'card_style': skin['card_css'],
            'suit_icons': skin.get('suit_icons', {}),
            'suit_colors': skin['suit_colors'],
            'card_animation': skin.get('animation', 'none'),
            
            'avatar_style': frame['avatar_css'],
            'name_color': frame['name_color'],
            'frame_icon': frame['badge_icon'],
            
            'title_display': title['display'] if title else '',
            'title_style': title['title_css'] if title else '',
            
            'vip_badge': vip['badge'],
            'vip_color': vip['color'],
            'vip_special': vip.get('special', '')
        }
    
    def generate_css_for_player(self, player_data: Dict) -> str:
        """为特定玩家生成CSS样式"""
        visual = self.get_player_full_visual(
            player_data.get('equipped_skin', 'classic'),
            player_data.get('equipped_frame', 'default'),
            player_data.get('equipped_title', ''),
            player_data.get('vip_level', 0)
        )
        
        css = f"""
        /* 玩家 {player_data['player_id']} 的样式 */
        .player-{player_data['player_id']} .game-card {{
            {visual['card_style']}
        }}
        
        .player-{player_data['player_id']} .avatar {{
            {visual['avatar_style']}
        }}
        
        .player-{player_data['player_id']} .player-name {{
            color: {visual['name_color']};
        }}
        
        .player-{player_data['player_id']} .title {{
            {visual['title_style']}
        }}
        
        .player-{player_data['player_id']} .vip-badge {{
            color: {visual['vip_color']};
            border: 1px solid {visual['vip_color']};
        }}
        """
        return css
    
    def render_team_battle_view(self, team_a: List[Dict], team_b: List[Dict]) -> Dict:
        """渲染团战双方视角"""
        return {
            'team_a': [self.get_player_full_visual(
                p.get('equipped_skin', 'classic'),
                p.get('equipped_frame', 'default'),
                p.get('equipped_title', ''),
                p.get('vip_level', 0)
            ) for p in team_a],
            'team_b': [self.get_player_full_visual(
                p.get('equipped_skin', 'classic'),
                p.get('equipped_frame', 'default'),
                p.get('equipped_title', ''),
                p.get('vip_level', 0)
            ) for p in team_b]
        }

# 全局渲染器
visual_renderer = VisualRenderer()

print("✅ 游戏渲染效果系统加载完成")
print(f"🎨 皮肤效果: {len(ITEM_RENDER_EFFECTS['skins'])} 套")
print(f"👤 头像框: {len(ITEM_RENDER_EFFECTS['frames'])} 种")
print(f"🏆 称号: {len(ITEM_RENDER_EFFECTS['titles'])} 个")
print(f"⭐ VIP等级: {len(ITEM_RENDER_EFFECTS['vip'])} 级")
