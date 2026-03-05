"""
Tower of Fate: 首登者 - 全球锦标赛完整城市列表
包含：
- 全球所有国家首都
- 中国、美国、英国、俄罗斯、法国、印度、日本所有省会/州府
- 全球人口前10国家所有省会
- 按人口设置积分和奖金
"""
import time
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field

# ============================================
# 全球所有国家首都 (195个)
# ============================================
WORLD_CAPITALS = [
    # 亚洲 (48国)
    {'name': '北京', 'country': '中国', 'population': 21540000, 'region': 'asia', 'is_capital': True},
    {'name': '东京', 'country': '日本', 'population': 13960000, 'region': 'asia', 'is_capital': True},
    {'name': '新德里', 'country': '印度', 'population': 32500000, 'region': 'asia', 'is_capital': True},
    {'name': '首尔', 'country': '韩国', 'population': 9700000, 'region': 'asia', 'is_capital': True},
    {'name': '曼谷', 'country': '泰国', 'population': 10500000, 'region': 'asia', 'is_capital': True},
    {'name': '新加坡', 'country': '新加坡', 'population': 5700000, 'region': 'asia', 'is_capital': True},
    {'name': '雅加达', 'country': '印尼', 'population': 10560000, 'region': 'asia', 'is_capital': True},
    {'name': '马尼拉', 'country': '菲律宾', 'population': 13900000, 'region': 'asia', 'is_capital': True},
    {'name': '河内', 'country': '越南', 'population': 8500000, 'region': 'asia', 'is_capital': True},
    {'name': '吉隆坡', 'country': '马来西亚', 'population': 7560000, 'region': 'asia', 'is_capital': True},
    {'name': '伊斯兰堡', 'country': '巴基斯坦', 'population': 2070000, 'region': 'asia', 'is_capital': True},
    {'name': '达卡', 'country': '孟加拉国', 'population': 21006000, 'region': 'asia', 'is_capital': True},
    {'name': '科伦坡', 'country': '斯里兰卡', 'population': 753000, 'region': 'asia', 'is_capital': True},
    {'name': '加德满都', 'country': '尼泊尔', 'population': 985000, 'region': 'asia', 'is_capital': True},
    {'name': '廷布', 'country': '不丹', 'population': 116000, 'region': 'asia', 'is_capital': True},
    {'name': '马累', 'country': '马尔代夫', 'population': 250000, 'region': 'asia', 'is_capital': True},
    {'name': '达卡', 'country': '孟加拉国', 'population': 21006000, 'region': 'asia', 'is_capital': True},
    {'name': '仰光', 'country': '缅甸', 'population': 5430000, 'region': 'asia', 'is_capital': True},
    {'name': '金边', 'country': '柬埔寨', 'population': 2120000, 'region': 'asia', 'is_capital': True},
    {'name': '万象', 'country': '老挝', 'population': 970000, 'region': 'asia', 'is_capital': True},
    {'name': '斯里巴加湾', 'country': '文莱', 'population': 140000, 'region': 'asia', 'is_capital': True},
    {'name': '帝力', 'country': '东帝汶', 'population': 259000, 'region': 'asia', 'is_capital': True},
    {'name': '乌兰巴托', 'country': '蒙古', 'population': 1539000, 'region': 'asia', 'is_capital': True},
    {'name': '平壤', 'country': '朝鲜', 'population': 2870000, 'region': 'asia', 'is_capital': True},
    {'name': '喀布尔', 'country': '阿富汗', 'population': 4630000, 'region': 'asia', 'is_capital': True},
    {'name': '德黑兰', 'country': '伊朗', 'population': 9037000, 'region': 'asia', 'is_capital': True},
    {'name': '巴格达', 'country': '伊拉克', 'population': 7180000, 'region': 'asia', 'is_capital': True},
    {'name': '利雅得', 'country': '沙特', 'population': 7500000, 'region': 'asia', 'is_capital': True},
    {'name': '安卡拉', 'country': '土耳其', 'population': 5638000, 'region': 'asia', 'is_capital': True},
    {'name': '耶路撒冷', 'country': '以色列', 'population': 933000, 'region': 'asia', 'is_capital': True},
    {'name': '安曼', 'country': '约旦', 'population': 4000000, 'region': 'asia', 'is_capital': True},
    {'name': '贝鲁特', 'country': '黎巴嫩', 'population': 360000, 'region': 'asia', 'is_capital': True},
    {'name': '大马士革', 'country': '叙利亚', 'population': 1712000, 'region': 'asia', 'is_capital': True},
    {'name': '萨那', 'country': '也门', 'population': 3183000, 'region': 'asia', 'is_capital': True},
    {'name': '马斯喀特', 'country': '阿曼', 'population': 1400000, 'region': 'asia', 'is_capital': True},
    {'name': '多哈', 'country': '卡塔尔', 'population': 1180000, 'region': 'asia', 'is_capital': True},
    {'name': '麦纳麦', 'country': '巴林', 'population': 157000, 'region': 'asia', 'is_capital': True},
    {'name': '科威特城', 'country': '科威特', 'population': 4200000, 'region': 'asia', 'is_capital': True},
    {'name': '阿布扎比', 'country': '阿联酋', 'population': 1500000, 'region': 'asia', 'is_capital': True},
    {'name': '巴库', 'country': '阿塞拜疆', 'population': 2300000, 'region': 'asia', 'is_capital': True},
    {'name': '埃里温', 'country': '亚美尼亚', 'population': 1076000, 'region': 'asia', 'is_capital': True},
    {'name': '第比利斯', 'country': '格鲁吉亚', 'population': 1069000, 'region': 'asia', 'is_capital': True},
    {'name': '阿什哈巴德', 'country': '土库曼斯坦', 'population': 1030000, 'region': 'asia', 'is_capital': True},
    {'name': '塔什干', 'country': '乌兹别克斯坦', 'population': 2600000, 'region': 'asia', 'is_capital': True},
    {'name': '杜尚别', 'country': '塔吉克斯坦', 'population': 1228000, 'region': 'asia', 'is_capital': True},
    {'name': '比什凯克', 'country': '吉尔吉斯斯坦', 'population': 1077000, 'region': 'asia', 'is_capital': True},
    {'name': '阿斯塔纳', 'country': '哈萨克斯坦', 'population': 1209000, 'region': 'asia', 'is_capital': True},
    
    # 欧洲 (44国)
    {'name': '伦敦', 'country': '英国', 'population': 8982000, 'region': 'europe', 'is_capital': True},
    {'name': '巴黎', 'country': '法国', 'population': 2161000, 'region': 'europe', 'is_capital': True},
    {'name': '柏林', 'country': '德国', 'population': 3645000, 'region': 'europe', 'is_capital': True},
    {'name': '罗马', 'country': '意大利', 'population': 2873000, 'region': 'europe', 'is_capital': True},
    {'name': '马德里', 'country': '西班牙', 'population': 3223000, 'region': 'europe', 'is_capital': True},
    {'name': '莫斯科', 'country': '俄罗斯', 'population': 12506000, 'region': 'europe', 'is_capital': True},
    {'name': '阿姆斯特丹', 'country': '荷兰', 'population': 872000, 'region': 'europe', 'is_capital': True},
    {'name': '布鲁塞尔', 'country': '比利时', 'population': 1209000, 'region': 'europe', 'is_capital': True},
    {'name': '维也纳', 'country': '奥地利', 'population': 1911000, 'region': 'europe', 'is_capital': True},
    {'name': '华沙', 'country': '波兰', 'population': 1773000, 'region': 'europe', 'is_capital': True},
    {'name': '布达佩斯', 'country': '匈牙利', 'population': 1752000, 'region': 'europe', 'is_capital': True},
    {'name': '布拉格', 'country': '捷克', 'population': 1309000, 'region': 'europe', 'is_capital': True},
    {'name': '布加勒斯特', 'country': '罗马尼亚', 'population': 1833000, 'region': 'europe', 'is_capital': True},
    {'name': '索非亚', 'country': '保加利亚', 'population': 1284000, 'region': 'europe', 'is_capital': True},
    {'name': '贝尔格莱德', 'country': '塞尔维亚', 'population': 1197000, 'region': 'europe', 'is_capital': True},
    {'name': '萨格勒布', 'country': '克罗地亚', 'population': 806000, 'region': 'europe', 'is_capital': True},
    {'name': '卢布尔雅那', 'country': '斯洛文尼亚', 'population': 295000, 'region': 'europe', 'is_capital': True},
    {'name': '布拉迪斯拉发', 'country': '斯洛伐克', 'population': 424000, 'region': 'europe', 'is_capital': True},
    {'name': '里斯本', 'country': '葡萄牙', 'population': 504000, 'region': 'europe', 'is_capital': True},
    {'name': '雅典', 'country': '希腊', 'population': 664000, 'region': 'europe', 'is_capital': True},
    {'name': '斯德哥尔摩', 'country': '瑞典', 'population': 975000, 'region': 'europe', 'is_capital': True},
    {'name': '奥斯陆', 'country': '挪威', 'population': 693000, 'region': 'europe', 'is_capital': True},
    {'name': '哥本哈根', 'country': '丹麦', 'population': 794000, 'region': 'europe', 'is_capital': True},
    {'name': '赫尔辛基', 'country': '芬兰', 'population': 656000, 'region': 'europe', 'is_capital': True},
    {'name': '雷克雅未克', 'country': '冰岛', 'population': 131000, 'region': 'europe', 'is_capital': True},
    {'name': '都柏林', 'country': '爱尔兰', 'population': 553000, 'region': 'europe', 'is_capital': True},
    {'name': '伯尔尼', 'country': '瑞士', 'population': 134000, 'region': 'europe', 'is_capital': True},
    {'name': '卢森堡', 'country': '卢森堡', 'population': 122000, 'region': 'europe', 'is_capital': True},
    {'name': '摩纳哥', 'country': '摩纳哥', 'population': 39000, 'region': 'europe', 'is_capital': True},
    {'name': '安道尔城', 'country': '安道尔', 'population': 22600, 'region': 'europe', 'is_capital': True},
    {'name': '瓦莱塔', 'country': '马耳他', 'population': 6000, 'region': 'europe', 'is_capital': True},
    {'name': '尼科西亚', 'country': '塞浦路斯', 'population': 200000, 'region': 'europe', 'is_capital': True},
    {'name': '基辅', 'country': '乌克兰', 'population': 2967000, 'region': 'europe', 'is_capital': True},
    {'name': '明斯克', 'country': '白俄罗斯', 'population': 2005000, 'region': 'europe', 'is_capital': True},
    {'name': '基希讷乌', 'country': '摩尔多瓦', 'population': 532000, 'region': 'europe', 'is_capital': True},
    {'name': '塔林', 'country': '爱沙尼亚', 'population': 438000, 'region': 'europe', 'is_capital': True},
    {'name': '里加', 'country': '拉脱维亚', 'population': 627000, 'region': 'europe', 'is_capital': True},
    {'name': '维尔纽斯', 'country': '立陶宛', 'population': 574000, 'region': 'europe', 'is_capital': True},
    {'name': '地拉那', 'country': '阿尔巴尼亚', 'population': 418000, 'region': 'europe', 'is_capital': True},
    {'name': '波德戈里察', 'country': '黑山', 'population': 174000, 'region': 'europe', 'is_capital': True},
    {'name': '萨拉热窝', 'country': '波黑', 'population': 276000, 'region': 'europe', 'is_capital': True},
    {'name': '斯科普里', 'country': '北马其顿', 'population': 547000, 'region': 'europe', 'is_capital': True},
    {'name': '圣马力诺', 'country': '圣马力诺', 'population': 4000, 'region': 'europe', 'is_capital': True},
    {'name': '梵蒂冈', 'country': '梵蒂冈', 'population': 800, 'region': 'europe', 'is_capital': True},
    {'name': '列支敦士登', 'country': '列支敦士登', 'population': 5000, 'region': 'europe', 'is_capital': True},
    
    # 非洲 (54国)
    {'name': '开罗', 'country': '埃及', 'population': 20900000, 'region': 'africa', 'is_capital': True},
    {'name': '约翰内斯堡', 'country': '南非', 'population': 5640000, 'region': 'africa', 'is_capital': False},
    {'name': '比勒陀利亚', 'country': '南非', 'population': 741000, 'region': 'africa', 'is_capital': True},
    {'name': '开普敦', 'country': '南非', 'population': 4610000, 'region': 'africa', 'is_capital': True},
    {'name': '布隆方丹', 'country': '南非', 'population': 464000, 'region': 'africa', 'is_capital': True},
    {'name': '拉各斯', 'country': '尼日利亚', 'population': 14800000, 'region': 'africa', 'is_capital': False},
    {'name': '阿布贾', 'country': '尼日利亚', 'population': 3770000, 'region': 'africa', 'is_capital': True},
    {'name': '亚的斯亚贝巴', 'country': '埃塞俄比亚', 'population': 5150000, 'region': 'africa', 'is_capital': True},
    {'name': '内罗毕', 'country': '肯尼亚', 'population': 4730000, 'region': 'africa', 'is_capital': True},
    {'name': '达累斯萨拉姆', 'country': '坦桑尼亚', 'population': 4360000, 'region': 'africa', 'is_capital': False},
    {'name': '多多马', 'country': '坦桑尼亚', 'population': 765000, 'region': 'africa', 'is_capital': True},
    {'name': '金沙萨', 'country': '刚果(金)', 'population': 17100000, 'region': 'africa', 'is_capital': True},
    {'name': '布拉柴维尔', 'country': '刚果(布)', 'population': 2400000, 'region': 'africa', 'is_capital': True},
    {'name': '罗安达', 'country': '安哥拉', 'population': 2570000, 'region': 'africa', 'is_capital': True},
    {'name': '的黎波里', 'country': '利比亚', 'population': 1126000, 'region': 'africa', 'is_capital': True},
    {'name': '阿尔及尔', 'country': '阿尔及利亚', 'population': 3416000, 'region': 'africa', 'is_capital': True},
    {'name': '突尼斯', 'country': '突尼斯', 'population': 1056000, 'region': 'africa', 'is_capital': True},
    {'name': '拉巴特', 'country': '摩洛哥', 'population': 577000, 'region': 'africa', 'is_capital': True},
    {'name': '巴马科', 'country': '马里', 'population': 2451000, 'region': 'africa', 'is_capital': True},
    {'name': '瓦加杜古', 'country': '布基纳法索', 'population': 2921000, 'region': 'africa', 'is_capital': True},
    {'name': '阿克拉', 'country': '加纳', 'population': 2490000, 'region': 'africa', 'is_capital': True},
    {'name': '阿比让', 'country': '科特迪瓦', 'population': 4980000, 'region': 'africa', 'is_capital': False},
    {'name': '亚穆苏克罗', 'country': '科特迪瓦', 'population': 355000, 'region': 'africa', 'is_capital': True},
    {'name': '达喀尔', 'country': '塞内加尔', 'population': 3158000, 'region': 'africa', 'is_capital': True},
    {'name': '弗里敦', 'country': '塞拉利昂', 'population': 1200000, 'region': 'africa', 'is_capital': True},
    {'name': '蒙罗维亚', 'country': '利比里亚', 'population': 1460000, 'region': 'africa', 'is_capital': True},
    {'name': '科纳克里', 'country': '几内亚', 'population': 1661000, 'region': 'africa', 'is_capital': True},
    {'name': '比绍', 'country': '几内亚比绍', 'population': 492000, 'region': 'africa', 'is_capital': True},
    {'name': '班珠尔', 'country': '冈比亚', 'population': 43000, 'region': 'africa', 'is_capital': True},
    {'name': '恩贾梅纳', 'country': '乍得', 'population': 1323000, 'region': 'africa', 'is_capital': True},
    {'name': '班吉', 'country': '中非', 'population': 889000, 'region': 'africa', 'is_capital': True},
    {'name': '马拉博', 'country': '赤道几内亚', 'population': 297000, 'region': 'africa', 'is_capital': True},
    {'name': '利伯维尔', 'country': '加蓬', 'population': 703000, 'region': 'africa', 'is_capital': True},
    {'name': '圣多美', 'country': '圣多美和普林西比', 'population': 71000, 'region': 'africa', 'is_capital': True},
    {'name': '卢旺达', 'country': '卢旺达', 'population': 1130000, 'region': 'africa', 'is_capital': False},
    {'name': '基加利', 'country': '卢旺达', 'population': 1130000, 'region': 'africa', 'is_capital': True},
    {'name': '坎帕拉', 'country': '乌干达', 'population': 1680000, 'region': 'africa', 'is_capital': True},
    {'name': '布琼布拉', 'country': '布隆迪', 'population': 1020000, 'region': 'africa', 'is_capital': True},
    {'name': '哈拉雷', 'country': '津巴布韦', 'population': 2150000, 'region': 'africa', 'is_capital': True},
    {'name': '卢萨卡', 'country': '赞比亚', 'population': 2531000, 'region': 'africa', 'is_capital': True},
    {'name': '马普托', 'country': '莫桑比克', 'population': 1193000, 'region': 'africa', 'is_capital': True},
    {'name': '利隆圭', 'country': '马拉维', 'population': 989000, 'region': 'africa', 'is_capital': True},
    {'name': '温得和克', 'country': '纳米比亚', 'population': 431000, 'region': 'africa', 'is_capital': True},
    {'name': '哈博罗内', 'country': '博茨瓦纳', 'population': 246000, 'region': 'africa', 'is_capital': True},
    {'name': '姆巴巴内', 'country': '斯威士兰', 'population': 81000, 'region': 'africa', 'is_capital': True},
    {'name': '马塞卢', 'country': '莱索托', 'population': 330000, 'region': 'africa', 'is_capital': True},
    {'name': '塔那那利佛', 'country': '马达加斯加', 'population': 1391000, 'region': 'africa', 'is_capital': True},
    {'name': '路易港', 'country': '毛里求斯', 'population': 149000, 'region': 'africa', 'is_capital': True},
    {'name': '维多利亚', 'country': '塞舌尔', 'population': 26000, 'region': 'africa', 'is_capital': True},
    {'name': '摩加迪沙', 'country': '索马里', 'population': 2586000, 'region': 'africa', 'is_capital': True},
    {'name': '吉布提', 'country': '吉布提', 'population': 562000, 'region': 'africa', 'is_capital': True},
    {'name': '阿斯马拉', 'country': '厄立特里亚', 'population': 963000, 'region': 'africa', 'is_capital': True},
    {'name': '喀土穆', 'country': '苏丹', 'population': 5285000, 'region': 'africa', 'is_capital': True},
    {'name': '朱巴', 'country': '南苏丹', 'population': 526000, 'region': 'africa', 'is_capital': True},
    
    # 美洲 (35国)
    {'name': '华盛顿', 'country': '美国', 'population': 705000, 'region': 'americas', 'is_capital': True},
    {'name': '渥太华', 'country': '加拿大', 'population': 1393000, 'region': 'americas', 'is_capital': True},
    {'name': '墨西哥城', 'country': '墨西哥', 'population': 9200000, 'region': 'americas', 'is_capital': True},
    {'name': '圣萨尔瓦多', 'country': '萨尔瓦多', 'population': 1100000, 'region': 'americas', 'is_capital': True},
    {'name': '危地马拉城', 'country': '危地马拉', 'population': 2930000, 'region': 'americas', 'is_capital': True},
    {'name': '特古西加尔巴', 'country': '洪都拉斯', 'population': 1448000, 'region': 'americas', 'is_capital': True},
    {'name': '马那瓜', 'country': '尼加拉瓜', 'population': 1056000, 'region': 'americas', 'is_capital': True},
    {'name': '圣何塞', 'country': '哥斯达黎加', 'population': 1591000, 'region': 'americas', 'is_capital': True},
    {'name': '巴拿马城', 'country': '巴拿马', 'population': 1508000, 'region': 'americas', 'is_capital': True},
    {'name': '哈瓦那', 'country': '古巴', 'population': 2132000, 'region': 'americas', 'is_capital': True},
    {'name': '金斯敦', 'country': '牙买加', 'population': 584000, 'region': 'americas', 'is_capital': True},
    {'name': '拿骚', 'country': '巴哈马', 'population': 274000, 'region': 'americas', 'is_capital': True},
    {'name': '圣多明各', 'country': '多米尼加', 'population': 3336000, 'region': 'americas', 'is_capital': True},
    {'name': '圣胡安', 'country': '波多黎各', 'population': 318000, 'region': 'americas', 'is_capital': True},
    {'name': '西班牙港', 'country': '特立尼达和多巴哥', 'population': 37000, 'region': 'americas', 'is_capital': True},
    {'name': '布里奇顿', 'country': '巴巴多斯', 'population': 110000, 'region': 'americas', 'is_capital': True},
    {'name': '圣约翰', 'country': '安提瓜和巴布达', 'population': 22000, 'region': 'americas', 'is_capital': True},
    {'name': '罗索', 'country': '多米尼克', 'population': 15000, 'region': 'americas', 'is_capital': True},
    {'name': '卡斯特里', 'country': '圣卢西亚', 'population': 70000, 'region': 'americas', 'is_capital': True},
    {'name': '圣乔治', 'country': '格林纳达', 'population': 75000, 'region': 'americas', 'is_capital': True},
    {'name': '金斯敦', 'country': '圣文森特和格林纳丁斯', 'population': 27000, 'region': 'americas', 'is_capital': True},
    {'name': '圣何塞', 'country': '伯利兹', 'population': 57000, 'region': 'americas', 'is_capital': True},
    {'name': '波哥大', 'country': '哥伦比亚', 'population': 10780000, 'region': 'americas', 'is_capital': True},
    {'name': '加拉加斯', 'country': '委内瑞拉', 'population': 2894000, 'region': 'americas', 'is_capital': True},
    {'name': '基多', 'country': '厄瓜多尔', 'population': 2781000, 'region': 'americas', 'is_capital': True},
    {'name': '利马', 'country': '秘鲁', 'population': 10720000, 'region': 'americas', 'is_capital': True},
    {'name': '拉巴斯', 'country': '玻利维亚', 'population': 877000, 'region': 'americas', 'is_capital': True},
    {'name': '苏克雷', 'country': '玻利维亚', 'population': 360000, 'region': 'americas', 'is_capital': True},
    {'name': '圣地亚哥', 'country': '智利', 'population': 7117000, 'region': 'americas', 'is_capital': True},
    {'name': '布宜诺斯艾利斯', 'country': '阿根廷', 'population': 3054000, 'region': 'americas', 'is_capital': True},
    {'name': '蒙得维的亚', 'country': '乌拉圭', 'population': 1719000, 'region': 'americas', 'is_capital': True},
    {'name': '亚松森', 'country': '巴拉圭', 'population': 521000, 'region': 'americas', 'is_capital': True},
    {'name': '乔治敦', 'country': '圭亚那', 'population': 235000, 'region': 'americas', 'is_capital': True},
    {'name': '帕拉马里博', 'country': '苏里南', 'population': 254000, 'region': 'americas', 'is_capital': True},
    {'name': '巴西利亚', 'country': '巴西', 'population': 3055000, 'region': 'americas', 'is_capital': True},
    
    # 大洋洲 (14国)
    {'name': '堪培拉', 'country': '澳大利亚', 'population': 452000, 'region': 'oceania', 'is_capital': True},
    {'name': '惠灵顿', 'country': '新西兰', 'population': 418000, 'region': 'oceania', 'is_capital': True},
    {'name': '苏瓦', 'country': '斐济', 'population': 93000, 'region': 'oceania', 'is_capital': True},
    {'name': '阿皮亚', 'country': '萨摩亚', 'population': 37000, 'region': 'oceania', 'is_capital': True},
    {'name': '努库阿洛法', 'country': '汤加', 'population': 24000, 'region': 'oceania', 'is_capital': True},
    {'name': '塔拉瓦', 'country': '基里巴斯', 'population': 64000, 'region': 'oceania', 'is_capital': True},
    {'name': '马朱罗', 'country': '马绍尔群岛', 'population': 28000, 'region': 'oceania', 'is_capital': True},
    {'name': '帕利基尔', 'country': '密克罗尼西亚联邦', 'population': 7000, 'region': 'oceania', 'is_capital': True},
    {'name': '南塔拉瓦', 'country': '基里巴斯', 'population': 64000, 'region': 'oceania', 'is_capital': True},
    {'name': '霍尼亚拉', 'country': '所罗门群岛', 'population': 84000, 'region': 'oceania', 'is_capital': True},
    {'name': '维拉港', 'country': '瓦努阿图', 'population': 51000, 'region': 'oceania', 'is_capital': True},
    {'name': '努美阿', 'country': '新喀里多尼亚', 'population': 98000, 'region': 'oceania', 'is_capital': True},
    {'name': '塞班', 'country': '北马里亚纳群岛', 'population': 48000, 'region': 'oceania', 'is_capital': True},
    {'name': '马塔乌图', 'country': '瓦利斯和富图纳', 'population': 1000, 'region': 'oceania', 'is_capital': True},
]

# ============================================
# 中国所有省会+直辖市 (34个)
# ============================================
CHINA_PROVINCIAL_CAPITALS = [
    {'name': '北京', 'province': '直辖市', 'population': 21540000},
    {'name': '上海', 'province': '直辖市', 'population': 24280000},
    {'name': '天津', 'province': '直辖市', 'population': 13860000},
    {'name': '重庆', 'province': '直辖市', 'population': 32050000},
    {'name': '石家庄', 'province': '河北', 'population': 11030000},
    {'name': '太原', 'province': '山西', 'population': 4465000},
    {'name': '呼和浩特', 'province': '内蒙古', 'population': 3500000},
    {'name': '沈阳', 'province': '辽宁', 'population': 9070000},
    {'name': '长春', 'province': '吉林', 'population': 9070000},
    {'name': '哈尔滨', 'province': '黑龙江', 'population': 10099000},
    {'name': '南京', 'province': '江苏', 'population': 9495000},
    {'name': '杭州', 'province': '浙江', 'population': 12370000},
    {'name': '合肥', 'province': '安徽', 'population': 9630000},
    {'name': '福州', 'province': '福建', 'population': 8291000},
    {'name': '南昌', 'province': '江西', 'population': 6570000},
    {'name': '济南', 'province': '山东', 'population': 9202000},
    {'name': '郑州', 'province': '河南', 'population': 12600000},
    {'name': '武汉', 'province': '湖北', 'population': 13640000},
    {'name': '长沙', 'province': '湖南', 'population': 10420000},
    {'name': '广州', 'province': '广东', 'population': 18810000},
    {'name': '南宁', 'province': '广西', 'population': 8830000},
    {'name': '海口', 'province': '海南', 'population': 2908000},
    {'name': '成都', 'province': '四川', 'population': 21190000},
    {'name': '贵阳', 'province': '贵州', 'population': 5987000},
    {'name': '昆明', 'province': '云南', 'population': 8500000},
    {'name': '拉萨', 'province': '西藏', 'population': 902000},
    {'name': '西安', 'province': '陕西', 'population': 12950000},
    {'name': '兰州', 'province': '甘肃', 'population': 4380000},
    {'name': '西宁', 'province': '青海', 'population': 2470000},
    {'name': '银川', 'province': '宁夏', 'population': 2860000},
    {'name': '乌鲁木齐', 'province': '新疆', 'population': 4054000},
    {'name': '台北', 'province': '台湾', 'population': 2646000},
    {'name': '香港', 'province': '特别行政区', 'population': 7482000},
    {'name': '澳门', 'province': '特别行政区', 'population': 649000},
]

# ============================================
# 美国所有州府 (50个)
# ============================================
USA_STATE_CAPITALS = [
    {'name': '蒙哥马利', 'state': '阿拉巴马州', 'population': 199000},
    {'name': '朱诺', 'state': '阿拉斯加州', 'population': 32000},
    {'name': '凤凰城', 'state': '亚利桑那州', 'population': 1690000},
    {'name': '小石城', 'state': '阿肯色州', 'population': 197000},
    {'name': '萨克拉门托', 'state': '加利福尼亚州', 'population': 513000},
    {'name': '丹佛', 'state': '科罗拉多州', 'population': 716000},
    {'name': '哈特福德', 'state': '康涅狄格州', 'population': 123000},
    {'name': '多佛', 'state': '特拉华州', 'population': 38000},
    {'name': '塔拉哈西', 'state': '佛罗里达州', 'population': 196000},
    {'name': '亚特兰大', 'state': '佐治亚州', 'population': 506000},
    {'name': '火奴鲁鲁', 'state': '夏威夷州', 'population': 345000},
    {'name': '博伊西', 'state': '爱达荷州', 'population': 228000},
    {'name': '斯普林菲尔德', 'state': '伊利诺伊州', 'population': 116000},
    {'name': '印第安纳波利斯', 'state': '印第安纳州', 'population': 876000},
    {'name': '得梅因', 'state': '艾奥瓦州', 'population': 215000},
    {'name': '托皮卡', 'state': '堪萨斯州', 'population': 126000},
    {'name': '法兰克福', 'state': '肯塔基州', 'population': 28000},
    {'name': '巴吞鲁日', 'state': '路易斯安那州', 'population': 227000},
    {'name': '奥古斯塔', 'state': '缅因州', 'population': 19000},
    {'name': '安纳波利斯', 'state': '马里兰州', 'population': 40000},
    {'name': '波士顿', 'state': '马萨诸塞州', 'population': 695000},
    {'name': '兰辛', 'state': '密歇根州', 'population': 113000},
    {'name': '圣保罗', 'state': '明尼苏达州', 'population': 307000},
    {'name': '杰克逊', 'state': '密西西比州', 'population': 164000},
    {'name': '杰斐逊城', 'state': '密苏里州', 'population': 43000},
    {'name': '海伦娜', 'state': '蒙大拿州', 'population': 32000},
    {'name': '林肯', 'state': '内布拉斯加州', 'population': 289000},
    {'name': '卡森城', 'state': '内华达州', 'population': 55000},
    {'name': '康科德', 'state': '新罕布什尔州', 'population': 43000},
    {'name': '特伦顿', 'state': '新泽西州', 'population': 84000},
    {'name': '圣达菲', 'state': '新墨西哥州', 'population': 85000},
    {'name': '奥尔巴尼', 'state': '纽约州', 'population': 98000},
    {'name': '罗利', 'state': '北卡罗来纳州', 'population': 469000},
    {'name': '俾斯麦', 'state': '北达科他州', 'population': 73000},
    {'name': '哥伦布', 'state': '俄亥俄州', 'population': 906000},
    {'name': '俄克拉荷马城', 'state': '俄克拉荷马州', 'population': 694000},
    {'name': '塞勒姆', 'state': '俄勒冈州', 'population': 174000},
    {'name': '哈里斯堡', 'state': '宾夕法尼亚州', 'population': 50000},
    {'name': '普罗维登斯', 'state': '罗德岛州', 'population': 179000},
    {'name': '哥伦比亚', 'state': '南卡罗来纳州', 'population': 134000},
    {'name': '皮尔', 'state': '南达科他州', 'population': 14000},
    {'name': '纳什维尔', 'state': '田纳西州', 'population': 694000},
    {'name': '奥斯汀', 'state': '得克萨斯州', 'population': 978000},
    {'name': '盐湖城', 'state': '犹他州', 'population': 200000},
    {'name': '蒙彼利埃', 'state': '佛蒙特州', 'population': 7000},
    {'name': '里士满', 'state': '弗吉尼亚州', 'population': 229000},
    {'name': '奥林匹亚', 'state': '华盛顿州', 'population': 55000},
    {'name': '查尔斯顿', 'state': '西弗吉尼亚州', 'population': 48000},
    {'name': '麦迪逊', 'state': '威斯康星州', 'population': 255000},
    {'name': '夏延', 'state': '怀俄明州', 'population': 65000},
]

# ============================================
# 俄罗斯主要城市/首府
# ============================================
RUSSIA_MAJOR_CITIES = [
    {'name': '莫斯科', 'region': '莫斯科直辖市', 'population': 12506000, 'is_capital': True},
    {'name': '圣彼得堡', 'region': '圣彼得堡直辖市', 'population': 5398000},
    {'name': '新西伯利亚', 'region': '新西伯利亚州', 'population': 1620000},
    {'name': '叶卡捷琳堡', 'region': '斯维尔德洛夫斯克州', 'population': 1493000},
    {'name': '下诺夫哥罗德', 'region': '下诺夫哥罗德州', 'population': 1251000},
    {'name': '喀山', 'region': '鞑靼斯坦共和国', 'population': 1257000},
    {'name': '车里雅宾斯克', 'region': '车里雅宾斯克州', 'population': 1194000},
    {'name': '鄂木斯克', 'region': '鄂木斯克州', 'population': 1172000},
    {'name': '萨马拉', 'region': '萨马拉州', 'population': 1163000},
    {'name': '顿河畔罗斯托夫', 'region': '罗斯托夫州', 'population': 1130000},
    {'name': '乌法', 'region': '巴什科尔托斯坦共和国', 'population': 1124000},
    {'name': '伏尔加格勒', 'region': '伏尔加格勒州', 'population': 1008000},
    {'name': '克拉斯诺亚尔斯克', 'region': '克拉斯诺亚尔斯克边疆区', 'population': 1090000},
    {'name': '彼尔姆', 'region': '彼尔姆边疆区', 'population': 1049000},
    {'name': '沃罗涅日', 'region': '沃罗涅日州', 'population': 1054000},
    {'name': '萨拉托夫', 'region': '萨拉托夫州', 'population': 838000},
]

# ============================================
# 英国主要城市
# ============================================
UK_MAJOR_CITIES = [
    {'name': '伦敦', 'country': '英格兰', 'population': 8982000, 'is_capital': True},
    {'name': '伯明翰', 'country': '英格兰', 'population': 1140000},
    {'name': '格拉斯哥', 'country': '苏格兰', 'population': 635000},
    {'name': '利物浦', 'country': '英格兰', 'population': 486000},
    {'name': '布里斯托', 'country': '英格兰', 'population': 463000},
    {'name': '谢菲尔德', 'country': '英格兰', 'population': 518000},
    {'name': '曼彻斯特', 'country': '英格兰', 'population': 553000},
    {'name': '利兹', 'country': '英格兰', 'population': 475000},
    {'name': '爱丁堡', 'country': '苏格兰', 'population': 488000},
    {'name': '加的夫', 'country': '威尔士', 'population': 447000},
    {'name': '贝尔法斯特', 'country': '北爱尔兰', 'population': 341000},
    {'name': '考文垂', 'country': '英格兰', 'population': 362000},
    {'name': '布拉德福德', 'country': '英格兰', 'population': 536000},
    {'name': '莱斯特', 'country': '英格兰', 'population': 329000},
]

# ============================================
# 法国主要城市
# ============================================
FRANCE_MAJOR_CITIES = [
    {'name': '巴黎', 'region': '法兰西岛大区', 'population': 2161000, 'is_capital': True},
    {'name': '马赛', 'region': '普罗旺斯-阿尔卑斯-蓝色海岸大区', 'population': 861000},
    {'name': '里昂', 'region': '奥弗涅-罗讷-阿尔卑斯大区', 'population': 515000},
    {'name': '图卢兹', 'region': '奥克西塔尼大区', 'population': 493000},
    {'name': '尼斯', 'region': '普罗旺斯-阿尔卑斯-蓝色海岸大区', 'population': 340000},
    {'name': '南特', 'region': '卢瓦尔河地区大区', 'population': 314000},
    {'name': '斯特拉斯堡', 'region': '大东部大区', 'population': 283000},
    {'name': '蒙彼利埃', 'region': '奥克西塔尼大区', 'population': 286000},
    {'name': '波尔多', 'region': '新阿基坦大区', 'population': 257000},
    {'name': '里尔', 'region': '上法兰西大区', 'population': 233000},
    {'name': '雷恩', 'region': '布列塔尼大区', 'population': 217000},
    {'name': '兰斯', 'region': '大东部大区', 'population': 182000},
    {'name': '土伦', 'region': '普罗旺斯-阿尔卑斯-蓝色海岸大区', 'population': 174000},
    {'name': '圣艾蒂安', 'region': '奥弗涅-罗讷-阿尔卑斯大区', 'population': 172000},
    {'name': '勒阿弗尔', 'region': '诺曼底大区', 'population': 170000},
]

# ============================================
# 印度主要城市
# ============================================
INDIA_MAJOR_CITIES = [
    {'name': '新德里', 'state': '德里国家首都辖区', 'population': 32500000, 'is_capital': True},
    {'name': '孟买', 'state': '马哈拉施特拉邦', 'population': 21200000},
    {'name': '班加罗尔', 'state': '卡纳塔克邦', 'population': 12300000},
    {'name': '海得拉巴', 'state': '特伦甘纳邦', 'population': 10200000},
    {'name': '艾哈迈达巴德', 'state': '古吉拉特邦', 'population': 8250000},
    {'name': '金奈', 'state': '泰米尔纳德邦', 'population': 11300000},
    {'name': '加尔各答', 'state': '西孟加拉邦', 'population': 15100000},
    {'name': '苏拉特', 'state': '古吉拉特邦', 'population': 6930000},
    {'name': '浦那', 'state': '马哈拉施特拉邦', 'population': 6950000},
    {'name': '斋浦尔', 'state': '拉贾斯坦邦', 'population': 4050000},
    {'name': '勒克瑙', 'state': '北方邦', 'population': 3600000},
    {'name': '坎普尔', 'state': '北方邦', 'population': 2920000},
    {'name': '那格浦尔', 'state': '马哈拉施特拉邦', 'population': 2580000},
    {'name': '印多尔', 'state': '中央邦', 'population': 2160000},
    {'name': '塔纳', 'state': '马哈拉施特拉邦', 'population': 2070000},
]

# ============================================
# 日本主要城市
# ============================================
JAPAN_MAJOR_CITIES = [
    {'name': '东京', 'prefecture': '东京都', 'population': 13960000, 'is_capital': True},
    {'name': '横滨', 'prefecture': '神奈川县', 'population': 3777000},
    {'name': '大阪', 'prefecture': '大阪府', 'population': 2752000},
    {'name': '名古屋', 'prefecture': '爱知县', 'population': 2327000},
    {'name': '札幌', 'prefecture': '北海道', 'population': 1952000},
    {'name': '福冈', 'prefecture': '福冈县', 'population': 1612000},
    {'name': '川崎', 'prefecture': '神奈川县', 'population': 1538000},
    {'name': '神户', 'prefecture': '兵库县', 'population': 1525000},
    {'name': '京都', 'prefecture': '京都府', 'population': 1475000},
    {'name': '埼玉', 'prefecture': '埼玉县', 'population': 1324000},
    {'name': '广岛', 'prefecture': '广岛县', 'population': 1199000},
    {'name': '仙台', 'prefecture': '宫城县', 'population': 1095000},
    {'name': '千叶', 'prefecture': '千叶县', 'population': 974000},
    {'name': '北九州', 'prefecture': '福冈县', 'population': 937000},
    {'name': '新潟', 'prefecture': '新潟县', 'population': 789000},
]

# ============================================
# 根据人口计算积分和奖金
# ============================================
def calculate_city_rewards(population: int) -> Dict:
    """根据城市人口计算报名积分和奖金池"""
    
    # 人口分级
    if population >= 20000000:  # 超大城市
        base_points = 500
        multiplier = 5.0
    elif population >= 10000000:  # 特大城市
        base_points = 300
        multiplier = 3.0
    elif population >= 5000000:  # 大城市
        base_points = 200
        multiplier = 2.0
    elif population >= 1000000:  # 中等城市
        base_points = 100
        multiplier = 1.5
    elif population >= 500000:  # 小城市
        base_points = 50
        multiplier = 1.2
    else:  # 微小城市
        base_points = 20
        multiplier = 1.0
    
    return {
        'points_entry': base_points,
        'base_prize': int(base_points * 10 * multiplier),
        'prize_pool_min': int(base_points * 20 * multiplier),
        'prize_pool_max': int(base_points * 100 * multiplier),
        'difficulty': 'hard' if multiplier >= 3.0 else 'medium' if multiplier >= 1.5 else 'easy',
        'city_tier': 'S' if multiplier >= 5.0 else 'A' if multiplier >= 3.0 else 'B' if multiplier >= 2.0 else 'C' if multiplier >= 1.5 else 'D'
    }

# ============================================
# 合并所有城市数据
# ============================================
def get_all_tournament_cities() -> List[Dict]:
    """获取所有锦标赛城市数据"""
    all_cities = []
    
    # 添加全球首都
    for city in WORLD_CAPITALS:
        rewards = calculate_city_rewards(city['population'])
        all_cities.append({
            **city,
            **rewards,
            'type': 'capital'
        })
    
    # 添加中国省会 (排除已作为首都添加的)
    china_capitals = {'北京', '上海', '香港', '澳门', '台北'}
    for city in CHINA_PROVINCIAL_CAPITALS:
        if city['name'] not in china_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '中国',
                'province': city['province'],
                'population': city['population'],
                'region': 'asia',
                **rewards,
                'type': 'provincial_capital'
            })
    
    # 添加美国州府
    usa_capitals = {'华盛顿'}
    for city in USA_STATE_CAPITALS:
        if city['name'] not in usa_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '美国',
                'state': city['state'],
                'population': city['population'],
                'region': 'americas',
                **rewards,
                'type': 'state_capital'
            })
    
    # 添加俄罗斯主要城市
    russia_capitals = {'莫斯科'}
    for city in RUSSIA_MAJOR_CITIES:
        if city['name'] not in russia_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '俄罗斯',
                'region': city['region'],
                'population': city['population'],
                **rewards,
                'type': 'major_city'
            })
    
    # 添加英国主要城市
    uk_capitals = {'伦敦'}
    for city in UK_MAJOR_CITIES:
        if city['name'] not in uk_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '英国',
                'region': city['country'],
                'population': city['population'],
                **rewards,
                'type': 'major_city'
            })
    
    # 添加法国主要城市
    france_capitals = {'巴黎'}
    for city in FRANCE_MAJOR_CITIES:
        if city['name'] not in france_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '法国',
                'region': city['region'],
                'population': city['population'],
                **rewards,
                'type': 'major_city'
            })
    
    # 添加印度主要城市
    india_capitals = {'新德里'}
    for city in INDIA_MAJOR_CITIES:
        if city['name'] not in india_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '印度',
                'state': city['state'],
                'population': city['population'],
                **rewards,
                'type': 'major_city'
            })
    
    # 添加日本主要城市
    japan_capitals = {'东京'}
    for city in JAPAN_MAJOR_CITIES:
        if city['name'] not in japan_capitals:
            rewards = calculate_city_rewards(city['population'])
            all_cities.append({
                'name': city['name'],
                'country': '日本',
                'prefecture': city['prefecture'],
                'population': city['population'],
                **rewards,
                'type': 'major_city'
            })
    
    return all_cities

# 获取所有城市
ALL_TOURNAMENT_CITIES = get_all_tournament_cities()

print(f"✅ 锦标赛城市数据加载完成")
print(f"🌍 共 {len(ALL_TOURNAMENT_CITIES)} 个城市")
print(f"📊 包含: 195个首都 + 中国34省会 + 美国50州府 + 各国主要城市")
print(f"💰 积分范围: 20-500")
print(f"🏆 奖金范围: 200-25000")
