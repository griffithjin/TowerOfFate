import re
import os

def scan_file(filepath):
    """扫描CSS/HTML文件中的硬编码像素值"""
    issues = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
            
            # 查找硬编码的像素值
            patterns = [
                (r'width:\s*(\d+)px', '固定宽度'),
                (r'height:\s*(\d+)px', '固定高度'),
                (r'max-width:\s*(\d+)px', '固定最大宽度'),
                (r'min-width:\s*(\d+)px', '固定最小宽度'),
                (r'font-size:\s*(\d+)px', '固定字体'),
                (r'margin:\s*(\d+)px', '固定外边距'),
                (r'padding:\s*(\d+)px', '固定内边距'),
            ]
            
            for line_num, line in enumerate(lines, 1):
                for pattern, desc in patterns:
                    matches = re.findall(pattern, line)
                    for match in matches:
                        value = int(match)
                        # 忽略小值(边框等)
                        if value > 15:
                            issues.append({
                                'line': line_num,
                                'desc': desc,
                                'value': value,
                                'code': line.strip()[:80]
                            })
    except Exception as e:
        issues.append({'error': str(e)})
    
    return issues

# 扫描所有文件
files_to_scan = [
    'solo_game.html',
    'streak_challenge.html',
    'shop_v2.html',
    'tournament.html',
    'new_index.html',
    'season_honors.html',
    'device_adaptive.css',
    'ui_global_responsive.css',
    'global_responsive.css'
]

print("=" * 70)
print("命运塔·首登者 - CSS诊断分析报告")
print("=" * 70)

total_issues = 0
file_count = 0

for filepath in files_to_scan:
    if os.path.exists(filepath):
        issues = scan_file(filepath)
        if issues:
            print(f"\n📄 {filepath}")
            print("-" * 50)
            # 按类型统计
            by_type = {}
            for issue in issues:
                if 'desc' in issue:
                    desc = issue['desc']
                    by_type[desc] = by_type.get(desc, 0) + 1
            
            for desc, count in sorted(by_type.items(), key=lambda x: -x[1]):
                print(f"  ⚠️  {desc}: {count}处")
            
            total_issues += len(issues)
            file_count += 1

print(f"\n" + "=" * 70)
print(f"诊断总结:")
print(f"  - 扫描文件数: {len(files_to_scan)}")
print(f"  - 有问题文件: {file_count}")
print(f"  - 总问题数: {total_issues}")
print("=" * 70)
