#!/usr/bin/env python3
"""
自动将HTML中的固定像素转换为CSS变量
"""

import re

def convert_px_to_rem(filepath):
    """将文件中的px值转换为rem/css变量"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 转换映射 (px -> rem, 基于16px=1rem)
    conversions = {
        # 宽度
        r'width:\s*70px': 'width: var(--hand-width)',
        r'width:\s*60px': 'width: var(--hand-width)', 
        r'width:\s*80px': 'width: var(--destiny-width)',
        r'width:\s*45px': 'width: var(--btn-height)',
        r'width:\s*55px': 'width: calc(var(--btn-height) * 1.2)',
        
        # 高度
        r'height:\s*95px': 'height: var(--hand-height)',
        r'height:\s*82px': 'height: var(--hand-height)',
        r'height:\s*75px': 'height: calc(var(--hand-height) * 0.8)',
        r'height:\s*45px': 'height: var(--btn-height)',
        
        # 字体
        r'font-size:\s*28px': 'font-size: var(--hand-suit)',
        r'font-size:\s*18px': 'font-size: var(--hand-rank)',
        r'font-size:\s*24px': 'font-size: var(--destiny-icon)',
        r'font-size:\s*20px': 'font-size: var(--title-font)',
        r'font-size:\s*14px': 'font-size: var(--font-sm)',
        r'font-size:\s*12px': 'font-size: var(--font-xs)',
        r'font-size:\s*16px': 'font-size: var(--font-md)',
        
        # 间距
        r'padding:\s*10px': 'padding: var(--sp-sm)',
        r'padding:\s*15px': 'padding: var(--sp-md)',
        r'padding:\s*20px': 'padding: var(--sp-lg)',
        r'gap:\s*10px': 'gap: var(--sp-sm)',
        r'gap:\s*15px': 'gap: var(--sp-md)',
        
        # 圆角
        r'border-radius:\s*8px': 'border-radius: var(--rd-md)',
        r'border-radius:\s*6px': 'border-radius: var(--rd-sm)',
        r'border-radius:\s*12px': 'border-radius: var(--rd-lg)',
    }
    
    changes = 0
    for pattern, replacement in conversions.items():
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = re.sub(pattern, replacement, content)
            changes += matches
    
    # 转换max-width: 1200px/1400px/768px为百分比
    content = re.sub(r'max-width:\s*1200px', 'max-width: 75rem', content)
    content = re.sub(r'max-width:\s*1400px', 'max-width: 87.5rem', content)
    content = re.sub(r'max-width:\s*1024px', 'max-width: 64rem', content)
    content = re.sub(r'max-width:\s*768px', 'max-width: 48rem', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return changes

if __name__ == '__main__':
    import sys
    
    files = [
        'solo_game.html',
        'streak_challenge.html',
        'shop_v2.html',
        'tournament.html',
        'new_index.html'
    ]
    
    print("开始转换固定像素为CSS变量...")
    print("=" * 50)
    
    for filepath in files:
        try:
            changes = convert_px_to_rem(filepath)
            print(f"✅ {filepath}: 转换了 {changes} 处")
        except Exception as e:
            print(f"❌ {filepath}: 错误 - {e}")
    
    print("=" * 50)
    print("转换完成！")
