#!/usr/bin/env python3
"""
命运塔·首登者 - UI重叠检测脚本
自动分析HTML结构，检测可能的UI重叠问题
"""

import re
import sys

def analyze_html_file(filepath, device_width):
    """分析HTML文件，检测可能的UI重叠问题"""
    issues = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取所有style标签内容
    styles = re.findall(r'\u003cstyle\u003e(.*?)\u003c/style\u003e', content, re.DOTALL)
    css_content = '\n'.join(styles)
    
    # 检查固定像素值（可能导致重叠）
    fixed_px_patterns = [
        (r'width:\s*(\d+)px', '固定宽度'),
        (r'height:\s*(\d+)px', '固定高度'),
        (r'font-size:\s*(\d+)px', '固定字体'),
        (r'padding:\s*(\d+)px', '固定内边距'),
        (r'margin:\s*(\d+)px', '固定外边距'),
    ]
    
    for pattern, desc in fixed_px_patterns:
        matches = re.findall(pattern, css_content)
        if matches:
            # 过滤掉小值（如1px边框）
            large_values = [int(m) for m in matches if int(m) > 20]
            if large_values:
                issues.append(f"⚠️ 发现{desc}: {set(large_values)}px (建议改为CSS变量)")
    
    # 检查flex/grid布局
    has_flex = 'display: flex' in css_content or 'display:flex' in css_content
    has_grid = 'display: grid' in css_content or 'display:grid' in css_content
    
    if not has_flex and not has_grid:
        issues.append("⚠️ 未使用flex/grid布局 (可能导致重叠)")
    
    # 检查min-width/min-height
    has_min_size = 'min-width' in css_content or 'min-height' in css_content
    if not has_min_size:
        issues.append("⚠️ 缺少min-width/min-height (可能导致重叠)")
    
    # 检查CSS变量使用情况
    css_vars = re.findall(r'var\(--[\w-]+\)', css_content)
    if len(css_vars) < 10:
        issues.append(f"⚠️ CSS变量使用较少 ({len(css_vars)}个) (建议更多使用变量)")
    else:
        issues.append(f"✅ CSS变量使用良好 ({len(css_vars)}个)")
    
    return issues

def check_all_pages():
    """检查所有游戏页面"""
    pages = [
        'solo_game.html',
        'streak_challenge.html', 
        'shop_v2.html',
        'tournament.html',
        'new_index.html',
        'adaptation_center.html'
    ]
    
    device_widths = [375, 390, 430, 360, 412, 768]
    device_names = ['iPhone SE', 'iPhone 14/15/16', 'iPhone Pro Max', 
                    'Android标准', 'Android大屏', 'iPad Mini']
    
    print("=" * 60)
    print("命运塔·首登者 - UI重叠检测报告")
    print("=" * 60)
    
    for page in pages:
        print(f"\n📄 {page}")
        print("-" * 40)
        
        try:
            issues = analyze_html_file(page, 375)
            for issue in issues:
                print(f"  {issue}")
            
            if not any('⚠️' in i for i in issues):
                print("  ✅ 无明显重叠风险")
                
        except FileNotFoundError:
            print(f"  ⚠️ 文件不存在")
        except Exception as e:
            print(f"  ❌ 检测错误: {e}")
    
    print("\n" + "=" * 60)
    print("检测完成！建议手动在浏览器中验证各设备尺寸显示效果。")
    print("=" * 60)

if __name__ == '__main__':
    check_all_pages()
