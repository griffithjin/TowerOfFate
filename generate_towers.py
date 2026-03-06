from PIL import Image, ImageDraw, ImageFont
import math
import os

# 输出目录
output_dir = "/Users/moutai/Desktop/toweroffate_v1.0/assets/towers"
os.makedirs(output_dir, exist_ok=True)

# 图片规格
WIDTH, HEIGHT = 800, 1200

# 颜色定义
SKY_TOP = "#87CEEB"
SKY_BOTTOM = "#E0F6FF"
WHITE = "#FFFFFF"
BLACK = "#000000"
RED = "#FF4444"
PINK = "#FFB6C1"
GOLD = "#FFD700"
BROWN = "#8B4513"
GRAY = "#808080"
PURPLE = "#9370DB"
SILVER = "#C0C0C0"
YELLOW = "#FFD700"
SAND = "#F4A460"

# 画卡通脸（通用函数）
def draw_cartoon_face(draw, cx, cy, size=1.0):
    """在指定位置画卡通脸"""
    # 左眼（白色椭圆）
    left_eye_x, left_eye_y = cx - 25*size, cy - 10*size
    draw.ellipse([left_eye_x-20*size, left_eye_y-25*size, left_eye_x+20*size, left_eye_y+25*size], fill=WHITE, outline=BLACK, width=2)
    # 左眼珠
    draw.ellipse([left_eye_x-8*size, left_eye_y-5*size, left_eye_x+8*size, left_eye_y+15*size], fill=BLACK)
    
    # 右眼（白色椭圆）
    right_eye_x, right_eye_y = cx + 25*size, cy - 10*size
    draw.ellipse([right_eye_x-20*size, right_eye_y-25*size, right_eye_x+20*size, right_eye_y+25*size], fill=WHITE, outline=BLACK, width=2)
    # 右眼珠
    draw.ellipse([right_eye_x-8*size, right_eye_y-5*size, right_eye_x+8*size, right_eye_y+15*size], fill=BLACK)
    
    # 微笑嘴巴（红色弧线）
    mouth_y = cy + 25*size
    draw.arc([cx-30*size, mouth_y-15*size, cx+30*size, mouth_y+25*size], start=0, end=180, fill=RED, width=4)
    
    # 粉色腮红
    draw.ellipse([cx-55*size, cy+5*size, cx-35*size, cy+25*size], fill=PINK)
    draw.ellipse([cx+35*size, cy+5*size, cx+55*size, cy+25*size], fill=PINK)

# 画渐变背景
def draw_gradient_background(draw):
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        # 从SKY_TOP到SKY_BOTTOM的渐变
        r = int(135 + (224-135) * ratio)
        g = int(206 + (246-206) * ratio)
        b = int(235 + (255-235) * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# 画云朵
def draw_clouds(draw):
    clouds = [
        (100, 100, 80, 50),
        (300, 150, 100, 60),
        (600, 80, 90, 55),
        (150, 300, 70, 40),
        (550, 280, 85, 45),
        (400, 350, 75, 40)
    ]
    for cx, cy, w, h in clouds:
        draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=WHITE)

# 添加底部文字
def add_text(draw, tower_name):
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    text1 = f"Cartoon {tower_name}"
    text2 = "Angry Birds Style / Game Background"
    
    # 简单的居中文本（估算）
    draw.text((WIDTH//2-150, HEIGHT-100), text1, fill=BLACK, font=font)
    draw.text((WIDTH//2-180, HEIGHT-60), text2, fill=BLACK, font=font_small)

# 1. 大本钟
def create_big_ben():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    # 塔身（棕色矩形）
    tower_x, tower_y = WIDTH//2 - 80, 300
    tower_w, tower_h = 160, 600
    draw.rectangle([tower_x, tower_y, tower_x+tower_w, tower_y+tower_h], fill=BROWN, outline=BLACK, width=3)
    
    # 装饰线条
    for i in range(6):
        y = tower_y + 100 + i * 80
        draw.line([(tower_x, y), (tower_x+tower_w, y)], fill="#654321", width=3)
    
    # 顶部钟面（金色圆形）
    clock_y = tower_y - 60
    draw.ellipse([tower_x-20, clock_y-60, tower_x+tower_w+20, clock_y+60], fill=GOLD, outline=BLACK, width=3)
    # 钟面细节
    draw.ellipse([tower_x+20, clock_y-40, tower_x+tower_w-20, clock_y+40], fill="#FFFACD", outline=BROWN, width=2)
    # 指针
    draw.line([(WIDTH//2, clock_y), (WIDTH//2, clock_y-30)], fill=BLACK, width=4)
    draw.line([(WIDTH//2, clock_y), (WIDTH//2+20, clock_y+10)], fill=BLACK, width=3)
    
    # 两侧小尖顶
    # 左尖顶
    left_spire_x = tower_x - 40
    draw.polygon([(left_spire_x, tower_y), (left_spire_x-15, tower_y-60), (left_spire_x+15, tower_y-60)], fill=BROWN, outline=BLACK, width=2)
    # 右尖顶
    right_spire_x = tower_x + tower_w + 40
    draw.polygon([(right_spire_x, tower_y), (right_spire_x-15, tower_y-60), (right_spire_x+15, tower_y-60)], fill=BROWN, outline=BLACK, width=2)
    
    # 主尖顶
    draw.polygon([(WIDTH//2, tower_y-100), (WIDTH//2-20, tower_y-60), (WIDTH//2+20, tower_y-60)], fill=BROWN, outline=BLACK, width=2)
    
    # 卡通脸
    draw_cartoon_face(draw, WIDTH//2, tower_y + 200)
    
    add_text(draw, "Big Ben")
    img.save(os.path.join(output_dir, "big-ben.png"))
    print("Generated: big-ben.png")

# 2. 东方明珠
def create_oriental_pearl():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    # 三根灰色立柱
    base_y = 900
    for x in [WIDTH//2-80, WIDTH//2, WIDTH//2+80]:
        draw.rectangle([x-15, 200, x+15, base_y], fill=GRAY, outline=BLACK, width=2)
    
    # 三个紫色球体
    # 下球
    lower_y = 750
    draw.ellipse([WIDTH//2-100, lower_y-60, WIDTH//2+100, lower_y+60], fill=PURPLE, outline=BLACK, width=3)
    draw_cartoon_face(draw, WIDTH//2, lower_y, size=1.2)
    
    # 中球
    middle_y = 450
    draw.ellipse([WIDTH//2-70, middle_y-50, WIDTH//2+70, middle_y+50], fill=PURPLE, outline=BLACK, width=3)
    draw_cartoon_face(draw, WIDTH//2, middle_y, size=0.9)
    
    # 上球
    upper_y = 220
    draw.ellipse([WIDTH//2-50, upper_y-40, WIDTH//2+50, upper_y+40], fill=PURPLE, outline=BLACK, width=3)
    draw_cartoon_face(draw, WIDTH//2, upper_y, size=0.7)
    
    # 最顶端尖
    draw.polygon([(WIDTH//2, 120), (WIDTH//2-10, 180), (WIDTH//2+10, 180)], fill=GRAY, outline=BLACK, width=2)
    draw.line([(WIDTH//2, 120), (WIDTH//2, 100)], fill=GRAY, width=4)
    
    add_text(draw, "Oriental Pearl")
    img.save(os.path.join(output_dir, "oriental-pearl.png"))
    print("Generated: oriental-pearl.png")

# 3. 泰姬陵
def create_taj_mahal():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    # 主体平台
    platform_y = 850
    draw.rectangle([100, platform_y, 700, platform_y+100], fill="#E8E8E8", outline=BLACK, width=3)
    
    # 白色圆顶建筑主体
    base_x, base_y = WIDTH//2, 500
    # 主体建筑
    draw.rectangle([base_x-200, base_y, base_x+200, platform_y], fill="#F5F5F5", outline=BLACK, width=3)
    
    # 中央大圆顶
    dome_y = base_y - 50
    draw.ellipse([base_x-120, dome_y-100, base_x+120, dome_y+100], fill="#FFFFFF", outline=BLACK, width=3)
    # 圆顶尖
    draw.polygon([(base_x, dome_y-130), (base_x-10, dome_y-100), (base_x+10, dome_y-100)], fill=GOLD, outline=BLACK, width=2)
    
    # 四个小尖塔
    for dx in [-160, 160]:
        # 左/右小圆顶
        small_dome_y = base_y - 20
        draw.ellipse([base_x+dx-30, small_dome_y-40, base_x+dx+30, small_dome_y+40], fill="#F8F8F8", outline=BLACK, width=2)
        # 尖塔
        draw.polygon([(base_x+dx, small_dome_y-70), (base_x+dx-8, small_dome_y-40), (base_x+dx+8, small_dome_y-40)], fill="#F5F5F5", outline=BLACK, width=2)
    
    # 中央大门（拱门）
    arch_x, arch_y = base_x, platform_y - 80
    draw.ellipse([arch_x-60, arch_y-80, arch_x+60, arch_y+80], fill="#2F4F4F", outline=BLACK, width=2)
    draw.rectangle([arch_x-60, arch_y, arch_x+60, arch_y+80], fill="#2F4F4F", outline=BLACK, width=2)
    
    # 卡通脸
    draw_cartoon_face(draw, base_x, base_y + 150, size=1.1)
    
    add_text(draw, "Taj Mahal")
    img.save(os.path.join(output_dir, "taj-mahal.png"))
    print("Generated: taj-mahal.png")

# 4. 勃兰登堡门
def create_brandenburg_gate():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    base_y = 900
    # 底座
    draw.rectangle([100, base_y, 700, base_y+80], fill="#D2B48C", outline=BLACK, width=3)
    
    # 六根黄色石柱
    pillar_w, pillar_h = 60, 500
    for i in range(6):
        x = 150 + i * 100
        draw.rectangle([x, base_y-pillar_h, x+pillar_w, base_y], fill="#F0E68C", outline=BLACK, width=3)
        # 柱顶装饰
        draw.rectangle([x-10, base_y-pillar_h-20, x+pillar_w+10, base_y-pillar_h], fill="#DAA520", outline=BLACK, width=2)
    
    # 顶部横梁
    draw.rectangle([130, base_y-pillar_h-60, 670, base_y-pillar_h-20], fill="#F0E68C", outline=BLACK, width=3)
    
    # 四驾马车雕塑（简化）
    top_y = base_y - pillar_h - 100
    # 基座
    draw.rectangle([200, top_y+30, 600, top_y+60], fill="#DAA520", outline=BLACK, width=2)
    # 马车简化形状
    draw.polygon([(400, top_y-50), (250, top_y+30), (550, top_y+30)], fill=GOLD, outline=BLACK, width=2)
    # 马匹简化（四个三角形）
    for dx in [-120, -40, 40, 120]:
        horse_x = 400 + dx
        draw.polygon([(horse_x, top_y+10), (horse_x-20, top_y+30), (horse_x+20, top_y+30)], fill="#F0E68C", outline=BLACK, width=1)
    
    # 拱门（中央两根柱子之间的空隙）
    draw.ellipse([250, base_y-200, 550, base_y+50], fill="#FFF8DC", outline=BLACK, width=3)
    # 填充拱门下半部分
    draw.rectangle([250, base_y-75, 550, base_y+50], fill="#FFF8DC", outline=BLACK, width=3)
    
    # 卡通脸（在横梁上）
    draw_cartoon_face(draw, WIDTH//2, base_y - pillar_h - 90, size=1.0)
    
    add_text(draw, "Brandenburg Gate")
    img.save(os.path.join(output_dir, "brandenburg-gate.png"))
    print("Generated: brandenburg-gate.png")

# 5. 大皇宫
def create_grand_palace():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    base_x, base_y = WIDTH//2, 900
    
    # 多层屋顶（从下往上，越来越小）
    # 第一层（最大）
    roof1_w, roof1_h = 500, 150
    draw.polygon([
        (base_x-roof1_w//2, base_y-300),
        (base_x+roof1_w//2, base_y-300),
        (base_x+roof1_w//2+50, base_y-200),
        (base_x-roof1_w//2-50, base_y-200)
    ], fill="#228B22", outline=BLACK, width=3)
    # 金色边缘
    draw.line([(base_x-roof1_w//2-50, base_y-200), (base_x+roof1_w//2+50, base_y-200)], fill=GOLD, width=8)
    
    # 第二层
    roof2_w, roof2_h = 350, 120
    draw.polygon([
        (base_x-roof2_w//2, base_y-420),
        (base_x+roof2_w//2, base_y-420),
        (base_x+roof2_w//2+40, base_y-330),
        (base_x-roof2_w//2-40, base_y-330)
    ], fill="#2E8B57", outline=BLACK, width=3)
    draw.line([(base_x-roof2_w//2-40, base_y-330), (base_x+roof2_w//2+40, base_y-330)], fill=GOLD, width=6)
    
    # 第三层
    roof3_w, roof3_h = 220, 100
    draw.polygon([
        (base_x-roof3_w//2, base_y-520),
        (base_x+roof3_w//2, base_y-520),
        (base_x+roof3_w//2+30, base_y-440),
        (base_x-roof3_w//2-30, base_y-440)
    ], fill="#228B22", outline=BLACK, width=3)
    draw.line([(base_x-roof3_w//2-30, base_y-440), (base_x+roof3_w//2+30, base_y-440)], fill=GOLD, width=5)
    
    # 中央尖顶
    draw.polygon([
        (base_x, base_y-620),
        (base_x-25, base_y-520),
        (base_x+25, base_y-520)
    ], fill=GOLD, outline=BLACK, width=3)
    
    # 建筑主体
    draw.rectangle([base_x-250, base_y-200, base_x+250, base_y], fill="#F5F5DC", outline=BLACK, width=3)
    
    # 柱子
    for dx in [-150, -50, 50, 150]:
        draw.rectangle([base_x+dx-15, base_y-180, base_x+dx+15, base_y], fill="#DEB887", outline=BLACK, width=2)
    
    # 中央门
    draw.ellipse([base_x-60, base_y-100, base_x+60, base_y+20], fill="#8B4513", outline=BLACK, width=2)
    draw.rectangle([base_x-60, base_y-40, base_x+60, base_y+20], fill="#8B4513", outline=BLACK, width=2)
    
    # 卡通脸
    draw_cartoon_face(draw, base_x, base_y - 250, size=1.2)
    
    add_text(draw, "Grand Palace")
    img.save(os.path.join(output_dir, "grand-palace.png"))
    print("Generated: grand-palace.png")

# 6. 哈利法塔
def create_burj_khalifa():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    draw_gradient_background(draw)
    draw_clouds(draw)
    
    center_x = WIDTH//2
    base_y = 900
    
    # Y字形截面塔（从底部到顶部渐变变细）
    # 使用多边形创建Y形
    # 底部（宽）
    bottom_w = 200
    # 中间
    middle_w = 120
    # 顶部（细）
    top_w = 40
    top_y = 150
    
    # Y字形的三臂
    # 左臂
    draw.polygon([
        (center_x - bottom_w//3, base_y),
        (center_x - bottom_w//2, base_y),
        (center_x - middle_w//3, base_y - 250),
        (center_x - middle_w//2, base_y - 250),
        (center_x - top_w//3, top_y + 100),
        (center_x, top_y)
    ], fill=SILVER, outline=BLACK, width=2)
    
    # 右臂
    draw.polygon([
        (center_x + bottom_w//3, base_y),
        (center_x + bottom_w//2, base_y),
        (center_x + middle_w//3, base_y - 250),
        (center_x + middle_w//2, base_y - 250),
        (center_x + top_w//3, top_y + 100),
        (center_x, top_y)
    ], fill=SILVER, outline=BLACK, width=2)
    
    # 中心臂（主塔身）
    draw.polygon([
        (center_x - bottom_w//6, base_y),
        (center_x + bottom_w//6, base_y),
        (center_x + middle_w//6, base_y - 350),
        (center_x, top_y),
        (center_x - middle_w//6, base_y - 350)
    ], fill="#D3D3D3", outline=BLACK, width=2)
    
    # 尖顶
    draw.polygon([
        (center_x, top_y - 80),
        (center_x-10, top_y),
        (center_x+10, top_y)
    ], fill=SILVER, outline=BLACK, width=2)
    
    # 横向装饰线
    for y in [base_y-100, base_y-200, base_y-300, base_y-400, base_y-500]:
        if y > top_y + 50:
            line_w = bottom_w * (base_y - y) / (base_y - top_y)
            draw.line([(center_x-line_w//2, y), (center_x+line_w//2, y)], fill="#A9A9A9", width=3)
    
    # 卡通脸
    draw_cartoon_face(draw, center_x, base_y - 400, size=1.0)
    
    add_text(draw, "Burj Khalifa")
    img.save(os.path.join(output_dir, "burj-khalifa.png"))
    print("Generated: burj-khalifa.png")

# 7. 金字塔
def create_pyramids():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # 沙漠背景（黄色渐变）
    for y in range(HEIGHT):
        if y < HEIGHT * 0.6:
            ratio = y / (HEIGHT * 0.6)
            r = int(135 + (255-135) * ratio)
            g = int(206 + (223-206) * ratio)
            b = int(235 + (0-235) * ratio)
        else:
            ratio = (y - HEIGHT * 0.6) / (HEIGHT * 0.4)
            r = int(255 - 20 * ratio)
            g = int(223 - 50 * ratio)
            b = int(0 + 20 * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    # 云朵（少一些）
    clouds = [(150, 80, 80, 40), (450, 120, 90, 45), (650, 60, 70, 35)]
    for cx, cy, w, h in clouds:
        draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=WHITE)
    
    base_y = 900
    
    # 三个金字塔（棕色三角形）
    # 大金字塔（右侧）
    big_points = [(550, base_y), (350, base_y), (450, 400)]
    draw.polygon(big_points, fill="#CD853F", outline=BLACK, width=3)
    # 面区分
    draw.polygon([(550, base_y), (450, base_y), (450, 400)], fill="#D2691E", outline=BLACK, width=2)
    
    # 中金字塔（左侧）
    mid_points = [(300, base_y), (100, base_y), (200, 500)]
    draw.polygon(mid_points, fill="#CD853F", outline=BLACK, width=3)
    draw.polygon([(300, base_y), (200, base_y), (200, 500)], fill="#D2691E", outline=BLACK, width=2)
    
    # 小金字塔（中间远处）
    small_points = [(420, base_y), (320, base_y), (370, 600)]
    draw.polygon(small_points, fill="#DEB887", outline=BLACK, width=2)
    
    # 狮身人面像（简化）
    sphinx_x, sphinx_y = 180, base_y
    # 身体（趴着的形状）
    draw.polygon([
        (sphinx_x-60, sphinx_y),
        (sphinx_x+80, sphinx_y),
        (sphinx_x+70, sphinx_y-50),
        (sphinx_x-50, sphinx_y-50)
    ], fill="#D2B48C", outline=BLACK, width=2)
    
    # 头部
    head_y = sphinx_y - 50
    draw.ellipse([sphinx_x-40, head_y-50, sphinx_x+10, head_y+20], fill="#D2B48C", outline=BLACK, width=2)
    
    # 狮身人面像的脸部特征（简化）
    # 眼睛
    draw.ellipse([sphinx_x-25, head_y-30, sphinx_x-15, head_y-20], fill=WHITE, outline=BLACK, width=1)
    draw.ellipse([sphinx_x-5, head_y-30, sphinx_x+5, head_y-20], fill=WHITE, outline=BLACK, width=1)
    draw.ellipse([sphinx_x-22, head_y-28, sphinx_x-18, head_y-22], fill=BLACK)
    draw.ellipse([sphinx_x-2, head_y-28, sphinx_x+2, head_y-22], fill=BLACK)
    
    # 鼻子
    draw.line([(sphinx_x-10, head_y-15), (sphinx_x-10, head_y-5)], fill=BROWN, width=2)
    
    # 大金字塔的脸（在中间位置）
    draw_cartoon_face(draw, 450, 550, size=1.2)
    
    add_text(draw, "Pyramids")
    img.save(os.path.join(output_dir, "pyramids.png"))
    print("Generated: pyramids.png")

# 主程序
if __name__ == "__main__":
    print("开始生成卡通塔图片...")
    print(f"输出目录: {output_dir}")
    print()
    
    create_big_ben()
    create_oriental_pearl()
    create_taj_mahal()
    create_brandenburg_gate()
    create_grand_palace()
    create_burj_khalifa()
    create_pyramids()
    
    print()
    print("所有图片生成完成！")
    print(f"文件保存在: {output_dir}")
    
    # 列出生成的文件
    files = os.listdir(output_dir)
    print("\n生成的文件列表:")
    for f in sorted(files):
        filepath = os.path.join(output_dir, f)
        size = os.path.getsize(filepath)
        print(f"  - {f} ({size/1024:.1f} KB)")
