from PIL import Image, ImageDraw, ImageFont
import math

# 图片尺寸
WIDTH = 800
HEIGHT = 1200

def create_gradient_background():
    """创建天蓝色渐变背景"""
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # 渐变从 #87CEEB 到 #98D8E8
    start_color = (135, 206, 235)  # #87CEEB
    end_color = (152, 216, 232)    # #98D8E8
    
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
        g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
        b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    
    return img

def add_text(img, text):
    """在底部添加白色文字"""
    draw = ImageDraw.Draw(img)
    
    # 尝试使用系统字体
    try:
        font = ImageFont.truetype("/System/Library/Fonts/STHeiti Light.ttc", 60)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 60)
        except:
            font = ImageFont.load_default()
    
    # 获取文字尺寸
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (WIDTH - text_width) // 2
    y = HEIGHT - 120
    
    # 绘制文字阴影
    draw.text((x+2, y+2), text, fill=(0, 0, 0, 100), font=font)
    # 绘制白色文字
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    return img

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    """绘制圆角矩形"""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_angry_bird_face(draw, cx, cy, size, eye_color=(255, 255, 255), pupil_color=(0, 0, 0)):
    """绘制愤怒的小鸟风格的可爱表情"""
    # 大眼睛
    eye_radius = size // 3
    left_eye_x = cx - size // 2
    right_eye_x = cx + size // 2
    eye_y = cy - size // 4
    
    # 眼白
    draw.ellipse([left_eye_x - eye_radius, eye_y - eye_radius, 
                  left_eye_x + eye_radius, eye_y + eye_radius], 
                 fill=eye_color, outline=(0, 0, 0), width=2)
    draw.ellipse([right_eye_x - eye_radius, eye_y - eye_radius, 
                  right_eye_x + eye_radius, eye_y + eye_radius], 
                 fill=eye_color, outline=(0, 0, 0), width=2)
    
    # 瞳孔
    pupil_radius = eye_radius // 2
    draw.ellipse([left_eye_x - pupil_radius - 3, eye_y - pupil_radius + 2, 
                  left_eye_x + pupil_radius - 3, eye_y + pupil_radius + 2], 
                 fill=pupil_color)
    draw.ellipse([right_eye_x - pupil_radius - 3, eye_y - pupil_radius + 2, 
                  right_eye_x + pupil_radius - 3, eye_y + pupil_radius + 2], 
                 fill=pupil_color)
    
    # 小嘴巴（可爱的微笑）
    beak_y = cy + size // 4
    beak_points = [
        (cx - 8, beak_y - 5),
        (cx + 8, beak_y - 5),
        (cx, beak_y + 10)
    ]
    draw.polygon(beak_points, fill=(255, 200, 50), outline=(0, 0, 0), width=2)
    
    # 腮红
    cheek_radius = size // 4
    draw.ellipse([left_eye_x - cheek_radius - 15, eye_y + cheek_radius,
                  left_eye_x + cheek_radius - 15, eye_y + cheek_radius * 3], 
                 fill=(255, 180, 180, 128))
    draw.ellipse([right_eye_x - cheek_radius + 15, eye_y + cheek_radius,
                  right_eye_x + cheek_radius + 15, eye_y + cheek_radius * 3], 
                 fill=(255, 180, 180, 128))

def draw_cn_tower():
    """绘制加拿大CN塔 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2 - 50
    
    # 塔基
    draw.polygon([(cx-80, cy+250), (cx+80, cy+250), (cx+60, cy+150), (cx-60, cy+150)], 
                 fill=(200, 100, 100), outline=(0, 0, 0), width=3)
    
    # 塔身 - 红色混凝土
    draw.rectangle([cx-40, cy-100, cx+40, cy+150], 
                   fill=(220, 80, 80), outline=(0, 0, 0), width=3)
    
    # 观景台 - 圆形
    draw.ellipse([cx-70, cy-130, cx+70, cy-30], 
                 fill=(180, 180, 180), outline=(0, 0, 0), width=3)
    draw.ellipse([cx-60, cy-120, cx+60, cy-40], 
                 fill=(150, 150, 150), outline=(0, 0, 0), width=2)
    
    # 天线
    draw.rectangle([cx-8, cy-280, cx+8, cy-100], 
                   fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    draw.rectangle([cx-15, cy-100, cx+15, cy-90], 
                   fill=(180, 180, 180), outline=(0, 0, 0), width=2)
    
    # 天线尖端
    draw.polygon([(cx, cy-300), (cx-10, cy-280), (cx+10, cy-280)], 
                 fill=(255, 200, 50), outline=(0, 0, 0), width=2)
    
    # 窗户细节
    for i in range(5):
        y = cy - 80 + i * 50
        draw.rectangle([cx-25, y, cx-10, y+25], fill=(135, 206, 235), outline=(0, 0, 0), width=1)
        draw.rectangle([cx+10, y, cx+25, y+25], fill=(135, 206, 235), outline=(0, 0, 0), width=1)
    
    # 给观景台加上可爱表情
    draw_angry_bird_face(draw, cx, cy-80, 35)
    
    # 底部平台
    draw.rounded_rectangle([cx-100, cy+230, cx+100, cy+260], radius=10,
                          fill=(150, 150, 150), outline=(0, 0, 0), width=3)
    
    return add_text(img, "CN塔 · 多伦多")

def draw_christ_redeemer():
    """绘制巴西基督像 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2 - 80
    
    # 山丘背景
    draw.polygon([(0, HEIGHT), (0, cy+180), (cx-150, cy+100), 
                  (cx, cy+80), (cx+150, cy+100), (WIDTH, cy+180), (WIDTH, HEIGHT)], 
                 fill=(34, 139, 34), outline=(0, 0, 0), width=3)
    
    # 山丘纹理
    for i in range(10):
        x = 50 + i * 70
        y = cy + 120 + (i % 3) * 30
        draw.ellipse([x-20, y-15, x+20, y+15], fill=(28, 120, 28), outline=(0, 0, 0), width=1)
    
    # 身体 - 长袍
    body_points = [(cx-60, cy+120), (cx-40, cy-80), (cx+40, cy-80), (cx+60, cy+120)]
    draw.polygon(body_points, fill=(200, 200, 200), outline=(0, 0, 0), width=3)
    
    # 头
    head_y = cy - 100
    draw.ellipse([cx-45, head_y-50, cx+45, head_y+40], 
                 fill=(255, 220, 177), outline=(0, 0, 0), width=3)
    
    # 头冠/光环
    draw.ellipse([cx-60, head_y-70, cx+60, head_y+10], 
                 outline=(255, 215, 0), width=8)
    
    # 面部 - 愤怒的小鸟表情
    draw_angry_bird_face(draw, cx, head_y, 30)
    
    # 胡须
    draw.polygon([(cx-40, head_y+20), (cx-20, head_y+50), (cx-35, head_y+55)], 
                 fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    draw.polygon([(cx+40, head_y+20), (cx+20, head_y+50), (cx+35, head_y+55)], 
                 fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    draw.polygon([(cx-15, head_y+35), (cx+15, head_y+35), (cx, head_y+60)], 
                 fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    
    # 手臂 - 张开
    # 左臂
    arm_left = [(cx-40, cy-40), (cx-140, cy-20), (cx-140, cy+10), (cx-50, cy-10)]
    draw.polygon(arm_left, fill=(200, 200, 200), outline=(0, 0, 0), width=3)
    # 右臂
    arm_right = [(cx+40, cy-40), (cx+140, cy-20), (cx+140, cy+10), (cx+50, cy-10)]
    draw.polygon(arm_right, fill=(200, 200, 200), outline=(0, 0, 0), width=3)
    
    # 手掌 - 圆形可爱风格
    draw.ellipse([cx-160, cy-25, cx-130, cy+15], fill=(255, 220, 177), outline=(0, 0, 0), width=3)
    draw.ellipse([cx+130, cy-25, cx+160, cy+15], fill=(255, 220, 177), outline=(0, 0, 0), width=3)
    
    # 腰带
    draw.rectangle([cx-50, cy-20, cx+50, cy], fill=(139, 90, 43), outline=(0, 0, 0), width=2)
    
    return add_text(img, "基督像 · 里约")

def draw_sky_tower():
    """绘制新西兰天空塔 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2 - 50
    
    # 塔基
    draw.rounded_rectangle([cx-70, cy+200, cx+70, cy+280], radius=15,
                          fill=(150, 150, 150), outline=(0, 0, 0), width=3)
    
    # 主塔身 - 逐渐变细
    tower_points = [(cx-50, cy+200), (cx-25, cy-150), (cx+25, cy-150), (cx+50, cy+200)]
    draw.polygon(tower_points, fill=(200, 200, 200), outline=(0, 0, 0), width=3)
    
    # 塔身条纹
    for i in range(8):
        y = cy + 180 - i * 45
        w = 45 - i * 4
        draw.rectangle([cx-w, y, cx+w, y+15], fill=(100, 100, 100), outline=(0, 0, 0), width=1)
    
    # 观景台 - 多层
    draw.ellipse([cx-90, cy-180, cx+90, cy-60], fill=(180, 180, 180), outline=(0, 0, 0), width=3)
    draw.ellipse([cx-80, cy-165, cx+80, cy-75], fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    draw.ellipse([cx-70, cy-150, cx+70, cy-90], fill=(150, 150, 150), outline=(0, 0, 0), width=2)
    
    # 天线
    draw.rectangle([cx-6, cy-280, cx+6, cy-165], fill=(200, 200, 200), outline=(0, 0, 0), width=2)
    draw.polygon([(cx, cy-300), (cx-8, cy-280), (cx+8, cy-280)], 
                 fill=(255, 100, 100), outline=(0, 0, 0), width=2)
    
    # 观景台窗户
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        x1 = cx + 60 * math.cos(rad)
        y1 = cy - 120 + 30 * math.sin(rad)
        draw.ellipse([x1-8, y1-12, x1+8, y1+12], fill=(135, 206, 235), outline=(0, 0, 0), width=1)
    
    # 观景台表情
    draw_angry_bird_face(draw, cx, cy-120, 30)
    
    return add_text(img, "天空塔 · 奥克兰")

def draw_table_mountain():
    """绘制南非桌山 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2 + 50
    
    # 桌山主体 - 平顶
    table_top = 180
    mountain_points = [
        (0, HEIGHT),
        (0, cy+150),
        (cx-200, cy-table_top),
        (cx-200, cy-table_top-50),  # 平顶
        (cx+200, cy-table_top-50),  # 平顶
        (cx+200, cy-table_top),
        (WIDTH, cy+150),
        (WIDTH, HEIGHT)
    ]
    draw.polygon(mountain_points, fill=(139, 125, 107), outline=(0, 0, 0), width=3)
    
    # 山体纹理
    for i in range(15):
        x = 30 + i * 50
        y = cy + 50 + (i % 4) * 40
        draw.polygon([(x, y), (x+20, y-30), (x+40, y)], fill=(120, 110, 95), outline=(0, 0, 0), width=1)
    
    # 山顶积雪/岩石细节
    draw.rectangle([cx-180, cy-table_top-50, cx+180, cy-table_top], 
                   fill=(160, 150, 140), outline=(0, 0, 0), width=2)
    
    # 山顶植被
    for i in range(12):
        x = cx - 150 + i * 25
        y = cy - table_top - 55
        draw.ellipse([x-8, y-8, x+8, y+8], fill=(34, 139, 34), outline=(0, 0, 0), width=1)
    
    # 桌山表情 - 在山顶侧面
    draw_angry_bird_face(draw, cx, cy-table_top+40, 35)
    
    # 云朵围绕着山
    cloud_color = (255, 255, 255)
    # 左侧云
    draw.ellipse([cx-250, cy-table_top-20, cx-150, cy-table_top+30], fill=cloud_color, outline=(0, 0, 0), width=2)
    draw.ellipse([cx-220, cy-table_top-40, cx-120, cy-table_top+10], fill=cloud_color, outline=(0, 0, 0), width=2)
    # 右侧云
    draw.ellipse([cx+150, cy-table_top-20, cx+250, cy-table_top+30], fill=cloud_color, outline=(0, 0, 0), width=2)
    draw.ellipse([cx+120, cy-table_top-40, cx+220, cy-table_top+10], fill=cloud_color, outline=(0, 0, 0), width=2)
    
    # 缆车
    cable_y = cy - table_top - 150
    draw.line([(cx-200, cable_y), (cx+200, cable_y-100)], fill=(100, 100, 100), width=3)
    # 缆车车厢
    car_x, car_y = cx, cable_y - 25
    draw.rectangle([car_x-15, car_y, car_x+15, car_y+30], fill=(255, 100, 100), outline=(0, 0, 0), width=2)
    draw.ellipse([car_x-10, car_y+5, car_x+10, car_y+25], fill=(135, 206, 235), outline=(0, 0, 0), width=1)
    # 缆车表情
    draw_angry_bird_face(draw, car_x, car_y+15, 10)
    
    return add_text(img, "桌山 · 开普敦")

def draw_parthenon():
    """绘制希腊帕特农神庙 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2 + 50
    
    # 基座 - 台阶
    for i in range(4):
        w = 250 - i * 15
        h = 20
        y = cy + 150 - i * h
        draw.rounded_rectangle([cx-w, y, cx+w, y+h], radius=3,
                              fill=(220, 200, 150), outline=(0, 0, 0), width=2)
    
    # 柱子底座
    draw.rounded_rectangle([cx-230, cy+80, cx+230, cy+100], radius=5,
                          fill=(230, 210, 160), outline=(0, 0, 0), width=2)
    
    # 柱子
    columns = 8
    col_width = 30
    col_spacing = 55
    start_x = cx - (columns - 1) * col_spacing // 2
    
    for i in range(columns):
        x = start_x + i * col_spacing
        # 柱身
        draw.rounded_rectangle([x-col_width//2, cy-50, x+col_width//2, cy+80], radius=5,
                              fill=(240, 230, 180), outline=(0, 0, 0), width=2)
        # 柱顶
        draw.rounded_rectangle([x-col_width//2-5, cy-60, x+col_width//2+5, cy-50], radius=3,
                              fill=(230, 210, 160), outline=(0, 0, 0), width=2)
        # 柱底
        draw.rounded_rectangle([x-col_width//2-5, cy+75, x+col_width//2+5, cy+85], radius=3,
                              fill=(230, 210, 160), outline=(0, 0, 0), width=2)
        
        # 柱子上的表情（每隔一根柱子）
        if i % 2 == 1:
            draw_angry_bird_face(draw, x, cy+15, 12)
    
    # 横梁
    draw.rounded_rectangle([cx-240, cy-80, cx+240, cy-60], radius=5,
                          fill=(230, 210, 160), outline=(0, 0, 0), width=2)
    
    # 三角楣饰
    pediment_points = [(cx-260, cy-80), (cx, cy-200), (cx+260, cy-80)]
    draw.polygon(pediment_points, fill=(240, 230, 180), outline=(0, 0, 0), width=3)
    
    # 三角楣饰内部细节
    inner_points = [(cx-220, cy-85), (cx, cy-180), (cx+220, cy-85)]
    draw.polygon(inner_points, fill=(220, 200, 150), outline=(0, 0, 0), width=2)
    
    # 三角楣饰表情
    draw_angry_bird_face(draw, cx, cy-130, 25)
    
    # 屋顶
    draw.polygon([(cx-270, cy-200), (cx, cy-230), (cx+270, cy-200)], 
                 fill=(180, 160, 120), outline=(0, 0, 0), width=3)
    
    # 旗帜
    flag_points = [(cx, cy-230), (cx, cy-280), (cx+60, cy-265), (cx, cy-250)]
    draw.polygon(flag_points, fill=(0, 100, 200), outline=(0, 0, 0), width=2)
    
    return add_text(img, "帕特农神庙 · 雅典")

def draw_fjord():
    """绘制挪威峡湾 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2
    
    # 背景山脉
    draw.polygon([(0, HEIGHT), (0, cy-50), (cx-200, cy-150), (cx-100, cy-100), 
                  (cx, cy-180), (cx+100, cy-100), (cx+200, cy-150), (WIDTH, cy-50), (WIDTH, HEIGHT)], 
                 fill=(100, 120, 140), outline=(0, 0, 0), width=2)
    
    # 山顶积雪
    snow_points = [(cx-200, cy-150), (cx-170, cy-180), (cx-140, cy-155),
                   (cx-100, cy-100), (cx-60, cy-140), (cx, cy-180),
                   (cx+60, cy-140), (cx+100, cy-100), (cx+140, cy-155), (cx+170, cy-180), (cx+200, cy-150)]
    for i in range(0, len(snow_points)-1, 2):
        if i+1 < len(snow_points):
            draw.polygon([snow_points[i], snow_points[i+1], 
                         ((snow_points[i][0] + snow_points[i+1][0])//2 + 20, (snow_points[i][1] + snow_points[i+1][1])//2 - 10)], 
                        fill=(255, 255, 255), outline=(0, 0, 0), width=1)
    
    # 峡湾水面 - 深蓝色
    water_points = [(0, HEIGHT), (0, cy+100), (cx-150, cy+50), (cx, cy+150), (cx+150, cy+50), (WIDTH, cy+100), (WIDTH, HEIGHT)]
    draw.polygon(water_points, fill=(50, 100, 150), outline=(0, 0, 0), width=2)
    
    # 水面波纹
    for i in range(10):
        x = 50 + i * 70
        y = cy + 150 + (i % 3) * 40
        draw.arc([x, y, x+40, y+20], start=0, end=180, fill=(100, 150, 200), width=2)
    
    # 瀑布
    waterfall_x = cx
    # 瀑布水流
    for i in range(20):
        offset = i * 15
        draw.line([(waterfall_x-30, cy+50+offset), (waterfall_x-20, cy+65+offset)], 
                  fill=(135, 206, 235), width=3)
        draw.line([(waterfall_x+20, cy+50+offset), (waterfall_x+30, cy+65+offset)], 
                  fill=(135, 206, 235), width=3)
        draw.line([(waterfall_x, cy+50+offset), (waterfall_x, cy+70+offset)], 
                  fill=(150, 220, 255), width=4)
    
    # 水花
    draw.ellipse([waterfall_x-50, cy+350, waterfall_x+50, cy+400], 
                 fill=(200, 230, 255), outline=(0, 0, 0), width=2)
    
    # 小木屋
    house_x, house_y = cx - 180, cy + 80
    # 屋身
    draw.rounded_rectangle([house_x-30, house_y, house_x+30, house_y+40], radius=3,
                          fill=(139, 90, 43), outline=(0, 0, 0), width=2)
    # 屋顶
    draw.polygon([(house_x-40, house_y), (house_x, house_y-35), (house_x+40, house_y)], 
                 fill=(200, 50, 50), outline=(0, 0, 0), width=2)
    # 窗户
    draw.rectangle([house_x-15, house_y+10, house_x+5, house_y+25], fill=(255, 255, 200), outline=(0, 0, 0), width=1)
    # 烟囱
    draw.rectangle([house_x+15, house_y-25, house_x+25, house_y-10], fill=(100, 100, 100), outline=(0, 0, 0), width=1)
    
    # 给小木屋加表情
    draw_angry_bird_face(draw, house_x, house_y+20, 12)
    
    # 小船
    boat_x, boat_y = cx + 120, cy + 200
    draw.polygon([(boat_x-40, boat_y), (boat_x+40, boat_y), (boat_x+30, boat_y+20), (boat_x-30, boat_y+20)], 
                 fill=(139, 90, 43), outline=(0, 0, 0), width=2)
    # 桅杆
    draw.line([(boat_x, boat_y), (boat_x, boat_y-50)], fill=(139, 90, 43), width=3)
    # 帆
    draw.polygon([(boat_x+2, boat_y-45), (boat_x+2, boat_y-10), (boat_x+35, boat_y-25)], 
                 fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    
    # 给小船加表情
    draw_angry_bird_face(draw, boat_x, boat_y-30, 8)
    
    return add_text(img, "峡湾 · 挪威")

def draw_aurora_volcano():
    """绘制冰岛极光+火山 - 愤怒的小鸟风格"""
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)
    
    cx, cy = WIDTH // 2, HEIGHT // 2
    
    # 地面/雪地
    draw.polygon([(0, HEIGHT), (0, cy+150), (cx-200, cy+100), 
                  (cx, cy+120), (cx+200, cy+100), (WIDTH, cy+150), (WIDTH, HEIGHT)], 
                 fill=(240, 248, 255), outline=(0, 0, 0), width=2)
    
    # 火山
    volcano_points = [(cx-120, cy+150), (cx-60, cy-100), (cx+60, cy-100), (cx+120, cy+150)]
    draw.polygon(volcano_points, fill=(80, 60, 50), outline=(0, 0, 0), width=3)
    
    # 火山纹理
    for i in range(8):
        y = cy + 120 - i * 30
        w = 110 - i * 10
        draw.line([(cx-w, y), (cx+w, y)], fill=(100, 80, 70), width=2)
    
    # 火山口
    draw.ellipse([cx-50, cy-120, cx+50, cy-80], fill=(60, 40, 30), outline=(0, 0, 0), width=3)
    # 岩浆
    draw.ellipse([cx-35, cy-110, cx+35, cy-90], fill=(255, 80, 0), outline=(0, 0, 0), width=2)
    
    # 火山表情
    draw_angry_bird_face(draw, cx, cy-50, 30)
    
    # 喷发的岩浆块
    lava_particles = [(cx-20, cy-140), (cx+10, cy-160), (cx+30, cy-145), (cx-10, cy-170)]
    for i, (px, py) in enumerate(lava_particles):
        size = 8 + i * 2
        draw.ellipse([px-size, py-size, px+size, py+size], 
                     fill=(255, 100 + i*20, 0), outline=(0, 0, 0), width=1)
    
    # 烟雾
    smoke_color = (150, 150, 150)
    for i in range(5):
        offset = i * 20
        size = 25 + i * 5
        draw.ellipse([cx-30-offset, cy-180-offset, cx+30+offset, cy-130-offset], 
                     fill=(200-i*20, 200-i*20, 200-i*20), outline=(0, 0, 0), width=1)
    
    # 极光 - 绿色光带
    aurora_colors = [(50, 255, 100), (100, 255, 150), (150, 255, 200)]
    for i, color in enumerate(aurora_colors):
        y_offset = i * 30
        points = []
        for x in range(0, WIDTH, 40):
            wave = math.sin((x + i * 50) * 0.02) * 30
            points.append((x, 100 + y_offset + wave))
        points.append((WIDTH, 150 + y_offset))
        points.append((WIDTH, 200 + y_offset))
        points.append((0, 200 + y_offset))
        draw.polygon(points, fill=color, outline=(0, 0, 0), width=1)
    
    # 星星
    for i in range(20):
        x = 50 + (i * 37) % (WIDTH - 100)
        y = 30 + (i * 23) % 150
        draw.polygon([(x, y-4), (x+3, y), (x, y+4), (x-3, y)], fill=(255, 255, 200), outline=(0, 0, 0), width=1)
    
    # 温泉/地热
    hot_spring_x = cx - 150
    draw.ellipse([hot_spring_x-40, cy+180, hot_spring_x+40, cy+220], 
                 fill=(100, 150, 200), outline=(0, 0, 0), width=2)
    # 蒸汽
    for i in range(3):
        draw.ellipse([hot_spring_x-20+i*15, cy+150-i*20, hot_spring_x+10+i*15, cy+170-i*20], 
                     fill=(200, 200, 255), outline=(0, 0, 0), width=1)
    
    # 温泉表情
    draw_angry_bird_face(draw, hot_spring_x, cy+200, 12)
    
    return add_text(img, "极光火山 · 冰岛")

# 主程序
def main():
    towers = [
        ("cn-tower.png", draw_cn_tower, "加拿大CN塔"),
        ("christ-redeemer.png", draw_christ_redeemer, "巴西基督像"),
        ("sky-tower.png", draw_sky_tower, "新西兰天空塔"),
        ("table-mountain.png", draw_table_mountain, "南非桌山"),
        ("parthenon.png", draw_parthenon, "希腊帕特农神庙"),
        ("fjord.png", draw_fjord, "挪威峡湾"),
        ("aurora.png", draw_aurora_volcano, "冰岛极光火山")
    ]
    
    output_dir = "/Users/moutai/Desktop/toweroffate_v1.0/assets/towers/"
    
    for filename, draw_func, name in towers:
        print(f"正在生成: {name}...")
        img = draw_func()
        filepath = output_dir + filename
        img.save(filepath, "PNG")
        print(f"  ✓ 已保存: {filepath}")
    
    print("\n所有图片生成完成！")

if __name__ == "__main__":
    main()
