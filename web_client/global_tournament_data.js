/**
 * 命运塔·首登者 - 全球锦标赛数据系统
 * 每个国家至少5场锦标赛
 * 中国31省每省5场锦标赛
 */

const GlobalTournamentData = {
    // 版本信息
    version: '3.10',
    lastUpdate: '2024-03-04',
    
    // 中国31省/直辖市/自治区/特别行政区
    chinaProvinces: [
        { code: 'BJ', name: '北京市', region: '华北' },
        { code: 'TJ', name: '天津市', region: '华北' },
        { code: 'HE', name: '河北省', region: '华北' },
        { code: 'SX', name: '山西省', region: '华北' },
        { code: 'NM', name: '内蒙古自治区', region: '华北' },
        { code: 'LN', name: '辽宁省', region: '东北' },
        { code: 'JL', name: '吉林省', region: '东北' },
        { code: 'HL', name: '黑龙江省', region: '东北' },
        { code: 'SH', name: '上海市', region: '华东' },
        { code: 'JS', name: '江苏省', region: '华东' },
        { code: 'ZJ', name: '浙江省', region: '华东' },
        { code: 'AH', name: '安徽省', region: '华东' },
        { code: 'FJ', name: '福建省', region: '华东' },
        { code: 'JX', name: '江西省', region: '华东' },
        { code: 'SD', name: '山东省', region: '华东' },
        { code: 'HA', name: '河南省', region: '华中' },
        { code: 'HB', name: '湖北省', region: '华中' },
        { code: 'HN', name: '湖南省', region: '华中' },
        { code: 'GD', name: '广东省', region: '华南' },
        { code: 'GX', name: '广西壮族自治区', region: '华南' },
        { code: 'HI', name: '海南省', region: '华南' },
        { code: 'CQ', name: '重庆市', region: '西南' },
        { code: 'SC', name: '四川省', region: '西南' },
        { code: 'GZ', name: '贵州省', region: '西南' },
        { code: 'YN', name: '云南省', region: '西南' },
        { code: 'XZ', name: '西藏自治区', region: '西南' },
        { code: 'SN', name: '陕西省', region: '西北' },
        { code: 'GS', name: '甘肃省', region: '西北' },
        { code: 'QH', name: '青海省', region: '西北' },
        { code: 'NX', name: '宁夏回族自治区', region: '西北' },
        { code: 'XJ', name: '新疆维吾尔自治区', region: '西北' },
        { code: 'HK', name: '香港特别行政区', region: '华南' },
        { code: 'MO', name: '澳门特别行政区', region: '华南' },
        { code: 'TW', name: '台湾省', region: '华东' }
    ],
    
    // 全球主要国家
    countries: [
        { code: 'US', name: '美国', region: '北美洲', cities: ['纽约', '洛杉矶', '芝加哥', '休斯顿', '旧金山'] },
        { code: 'JP', name: '日本', region: '亚洲', cities: ['东京', '大阪', '京都', '横滨', '名古屋'] },
        { code: 'KR', name: '韩国', region: '亚洲', cities: ['首尔', '釜山', '仁川', '大邱', '光州'] },
        { code: 'GB', name: '英国', region: '欧洲', cities: ['伦敦', '曼彻斯特', '伯明翰', '利物浦', '爱丁堡'] },
        { code: 'FR', name: '法国', region: '欧洲', cities: ['巴黎', '马赛', '里昂', '图卢兹', '尼斯'] },
        { code: 'DE', name: '德国', region: '欧洲', cities: ['柏林', '汉堡', '慕尼黑', '科隆', '法兰克福'] },
        { code: 'IT', name: '意大利', region: '欧洲', cities: ['罗马', '米兰', '那不勒斯', '都灵', '佛罗伦萨'] },
        { code: 'ES', name: '西班牙', region: '欧洲', cities: ['马德里', '巴塞罗那', '瓦伦西亚', '塞维利亚', '毕尔巴鄂'] },
        { code: 'RU', name: '俄罗斯', region: '欧洲/亚洲', cities: ['莫斯科', '圣彼得堡', '新西伯利亚', '叶卡捷琳堡', '喀山'] },
        { code: 'IN', name: '印度', region: '亚洲', cities: ['新德里', '孟买', '班加罗尔', '加尔各答', '钦奈'] },
        { code: 'BR', name: '巴西', region: '南美洲', cities: ['圣保罗', '里约热内卢', '巴西利亚', '萨尔瓦多', '福塔莱萨'] },
        { code: 'CA', name: '加拿大', region: '北美洲', cities: ['多伦多', '温哥华', '蒙特利尔', '卡尔加里', '渥太华'] },
        { code: 'AU', name: '澳大利亚', region: '大洋洲', cities: ['悉尼', '墨尔本', '布里斯班', '珀斯', '阿德莱德'] },
        { code: 'TH', name: '泰国', region: '亚洲', cities: ['曼谷', '清迈', '芭提雅', '普吉', '华欣'] },
        { code: 'SG', name: '新加坡', region: '亚洲', cities: ['新加坡'] },
        { code: 'MY', name: '马来西亚', region: '亚洲', cities: ['吉隆坡', '槟城', '马六甲', '新山', '亚庇'] },
        { code: 'VN', name: '越南', region: '亚洲', cities: ['河内', '胡志明市', '岘港', '芽庄', '富国岛'] },
        { code: 'ID', name: '印度尼西亚', region: '亚洲', cities: ['雅加达', '巴厘岛', '泗水', '万隆', '日惹'] },
        { code: 'PH', name: '菲律宾', region: '亚洲', cities: ['马尼拉', '宿务', '达沃', '巴拉望', '长滩岛'] },
        { code: 'MX', name: '墨西哥', region: '北美洲', cities: ['墨西哥城', '瓜达拉哈拉', '蒙特雷', '坎昆', '普埃布拉'] },
        { code: 'EG', name: '埃及', region: '非洲', cities: ['开罗', '亚历山大', '卢克索', '阿斯旺', '沙姆沙伊赫'] },
        { code: 'ZA', name: '南非', region: '非洲', cities: ['约翰内斯堡', '开普敦', '德班', '比勒陀利亚', '伊丽莎白港'] },
        { code: 'TR', name: '土耳其', region: '欧洲/亚洲', cities: ['伊斯坦布尔', '安卡拉', '伊兹密尔', '安塔利亚', '卡帕多奇亚'] },
        { code: 'SA', name: '沙特阿拉伯', region: '亚洲', cities: ['利雅得', '吉达', '麦加', '麦地那', '达曼'] },
        { code: 'AE', name: '阿联酋', region: '亚洲', cities: ['迪拜', '阿布扎比', '沙迦', '阿治曼', '富查伊拉'] },
        { code: 'NZ', name: '新西兰', region: '大洋洲', cities: ['奥克兰', '惠灵顿', '基督城', '皇后镇', '达尼丁'] },
        { code: 'AR', name: '阿根廷', region: '南美洲', cities: ['布宜诺斯艾利斯', '科尔多瓦', '罗萨里奥', '门多萨', '巴里洛切'] },
        { code: 'CL', name: '智利', region: '南美洲', cities: ['圣地亚哥', '瓦尔帕莱索', '康塞普西翁', '安托法加斯塔', '蓬塔阿雷纳斯'] },
        { code: 'NL', name: '荷兰', region: '欧洲', cities: ['阿姆斯特丹', '鹿特丹', '海牙', '乌得勒支', '埃因霍温'] },
        { code: 'SE', name: '瑞典', region: '欧洲', cities: ['斯德哥尔摩', '哥德堡', '马尔默', '乌普萨拉', '林雪平'] },
        { code: 'CH', name: '瑞士', region: '欧洲', cities: ['苏黎世', '日内瓦', '巴塞尔', '伯尔尼', '洛桑'] },
        { code: 'BE', name: '比利时', region: '欧洲', cities: ['布鲁塞尔', '安特卫普', '根特', '布鲁日', '列日'] },
        { code: 'AT', name: '奥地利', region: '欧洲', cities: ['维也纳', '萨尔茨堡', '因斯布鲁克', '格拉茨', '林茨'] },
        { code: 'PL', name: '波兰', region: '欧洲', cities: ['华沙', '克拉科夫', '弗罗茨瓦夫', '格但斯克', '波兹南'] },
        { code: 'UA', name: '乌克兰', region: '欧洲', cities: ['基辅', '哈尔科夫', '敖德萨', '第聂伯罗', '利沃夫'] },
        { code: 'CZ', name: '捷克', region: '欧洲', cities: ['布拉格', '布尔诺', '俄斯特拉发', '皮尔森', '卡罗维发利'] },
        { code: 'HU', name: '匈牙利', region: '欧洲', cities: ['布达佩斯', '德布勒森', '塞格德', '米什科尔茨', '佩奇'] },
        { code: 'GR', name: '希腊', region: '欧洲', cities: ['雅典', '塞萨洛尼基', '帕特雷', '伊拉克利翁', '罗德岛'] },
        { code: 'PT', name: '葡萄牙', region: '欧洲', cities: ['里斯本', '波尔图', '法鲁', '科英布拉', '辛特拉'] },
        { code: 'DK', name: '丹麦', region: '欧洲', cities: ['哥本哈根', '奥胡斯', '欧登塞', '奥尔堡', '埃斯比约'] },
        { code: 'NO', name: '挪威', region: '欧洲', cities: ['奥斯陆', '卑尔根', '特隆赫姆', '斯塔万格', '克里斯蒂安桑'] },
        { code: 'FI', name: '芬兰', region: '欧洲', cities: ['赫尔辛基', '埃斯波', '坦佩雷', '图尔库', '奥卢'] },
        { code: 'IE', name: '爱尔兰', region: '欧洲', cities: ['都柏林', '科克', '戈尔韦', '利默里克', '沃特福德'] },
        { code: 'IL', name: '以色列', region: '亚洲', cities: ['耶路撒冷', '特拉维夫', '海法', '埃拉特', '拿撒勒'] },
        { code: 'QA', name: '卡塔尔', region: '亚洲', cities: ['多哈', '赖扬', '沃克拉', '豪尔', '乌姆赛义德'] },
        { code: 'KW', name: '科威特', region: '亚洲', cities: ['科威特城', '哈瓦利', '萨利米耶', '杰赫拉', '艾哈迈迪'] },
        { code: 'OM', name: '阿曼', region: '亚洲', cities: ['马斯喀特', '萨拉拉', '苏哈尔', '尼兹瓦', '伊卜里'] },
        { code: 'BH', name: '巴林', region: '亚洲', cities: ['麦纳麦', '里法', '穆哈拉格', '伊萨城', '哈马德'] },
        { code: 'JO', name: '约旦', region: '亚洲', cities: ['安曼', '亚喀巴', '伊尔比德', '杰拉什', '佩特拉'] },
        { code: 'LB', name: '黎巴嫩', region: '亚洲', cities: ['贝鲁特', '的黎波里', '西顿', '巴勒贝克', '朱尼耶'] },
        { code: 'MA', name: '摩洛哥', region: '非洲', cities: ['卡萨布兰卡', '马拉喀什', '拉巴特', '非斯', '丹吉尔'] },
        { code: 'TN', name: '突尼斯', region: '非洲', cities: ['突尼斯', '斯法克斯', '苏塞', '凯鲁万', '比塞大'] },
        { code: 'KE', name: '肯尼亚', region: '非洲', cities: ['内罗毕', '蒙巴萨', '基苏木', '纳库鲁', '埃尔多雷特'] },
        { code: 'NG', name: '尼日利亚', region: '非洲', cities: ['拉各斯', '阿布贾', '卡诺', '伊巴丹', '哈科特港'] },
        { code: 'GH', name: '加纳', region: '非洲', cities: ['阿克拉', '库马西', '塔马利', '特马', '塞康第'] },
        { code: 'ET', name: '埃塞俄比亚', region: '非洲', cities: ['亚的斯亚贝巴', '德雷达瓦', '巴赫达尔', '阿瓦萨', '贡德尔'] },
        { code: 'TZ', name: '坦桑尼亚', region: '非洲', cities: ['达累斯萨拉姆', '多多马', '阿鲁沙', '桑给巴尔', '姆万扎'] },
        { code: 'UG', name: '乌干达', region: '非洲', cities: ['坎帕拉', '恩德培', '金贾', '姆巴拉拉', '古卢'] },
        { code: 'ZW', name: '津巴布韦', region: '非洲', cities: ['哈拉雷', '布拉瓦约', '穆塔雷', '奎奎', '圭鲁'] },
        { code: 'ZM', name: '赞比亚', region: '非洲', cities: ['卢萨卡', '恩多拉', '基特韦', '利文斯通', '卡布韦'] },
        { code: 'BW', name: '博茨瓦纳', region: '非洲', cities: ['哈博罗内', '弗朗西斯敦', '莫莱波洛莱', '塞罗韦', '卡萨内'] },
        { code: 'NA', name: '纳米比亚', region: '非洲', cities: ['温得和克', '斯瓦科普蒙德', '沃尔维斯湾', '奥沙卡蒂', '赫鲁特方丹'] },
        { code: 'MZ', name: '莫桑比克', region: '非洲', cities: ['马普托', '贝拉', '楠普拉', '克利马内', '彭巴'] },
        { code: 'MG', name: '马达加斯加', region: '非洲', cities: ['塔那那利佛', '图阿马西纳', '安齐拉纳纳', '马哈赞加', '菲亚纳兰楚阿'] },
        { code: 'MU', name: '毛里求斯', region: '非洲', cities: ['路易港', '居尔皮普', '博巴森', '罗斯希尔', '卡特勒博尔纳'] },
        { code: 'SC', name: '塞舌尔', region: '非洲', cities: ['维多利亚', '博瓦隆', '安塞罗亚莱', '塔卡马卡', '格朗当斯'] },
        { code: 'MV', name: '马尔代夫', region: '亚洲', cities: ['马累', '阿杜', '富瓦穆拉', '库卢杜富菲尤', '蒂纳杜'] },
        { code: 'LK', name: '斯里兰卡', region: '亚洲', cities: ['科伦坡', '康提', '加勒', '贾夫纳', '努沃勒埃利耶'] },
        { code: 'NP', name: '尼泊尔', region: '亚洲', cities: ['加德满都', '博卡拉', '帕坦', '巴克塔普尔', '奇特旺'] },
        { code: 'BT', name: '不丹', region: '亚洲', cities: ['廷布', '帕罗', '普那卡', '旺杜波德朗', '宗萨'] },
        { code: 'BD', name: '孟加拉国', region: '亚洲', cities: ['达卡', '吉大港', '锡尔赫特', '库尔纳', '拉杰沙希'] },
        { code: 'MM', name: '缅甸', region: '亚洲', cities: ['仰光', '曼德勒', '内比都', '蒲甘', '额布里'] },
        { code: 'KH', name: '柬埔寨', region: '亚洲', cities: ['金边', '暹粒', '西哈努克', '马德望', '贡布'] },
        { code: 'LA', name: '老挝', region: '亚洲', cities: ['万象', '琅勃拉邦', '巴色', '沙湾拿吉', '万荣'] },
        { code: 'BN', name: '文莱', region: '亚洲', cities: ['斯里巴加湾', '马来奕', '诗里亚', '都东', '淡布隆'] },
        { code: 'MO', name: '澳门', region: '亚洲', cities: ['澳门半岛', '氹仔', '路环'] },
        { code: 'TW', name: '台湾', region: '亚洲', cities: ['台北', '高雄', '台中', '台南', '花莲'] }
    ],
    
    // 生成锦标赛
    generateTournaments: function() {
        const tournaments = [];
        let id = 1;
        
        // 为中国每个省生成5场锦标赛
        this.chinaProvinces.forEach(province => {
            for (let i = 1; i <= 5; i++) {
                tournaments.push({
                    id: id++,
                    name: `${province.name}第${i}届命运塔锦标赛`,
                    location: province.name,
                    country: '中国',
                    region: province.region,
                    type: 'province',
                    tier: this.getTierByPopulation(province.code),
                    maxPlayers: 100 + Math.floor(Math.random() * 400),
                    entryFee: this.getEntryFeeByTier(this.getTierByPopulation(province.code)),
                    prize: this.getPrizeByTier(this.getTierByPopulation(province.code)),
                    startTime: this.generateStartTime(),
                    status: 'open'
                });
            }
        });
        
        // 为每个国家生成5场锦标赛
        this.countries.forEach(country => {
            country.cities.forEach((city, index) => {
                if (index < 5) { // 只取前5个城市
                    tournaments.push({
                        id: id++,
                        name: `${city}命运塔国际锦标赛`,
                        location: city,
                        country: country.name,
                        region: country.region,
                        type: 'international',
                        tier: ['S', 'A', 'B', 'C', 'D'][index],
                        maxPlayers: 200 + Math.floor(Math.random() * 800),
                        entryFee: [1000, 500, 300, 200, 100][index],
                        prize: [100000, 50000, 30000, 20000, 10000][index],
                        startTime: this.generateStartTime(),
                        status: 'open'
                    });
                }
            });
        });
        
        return tournaments;
    },
    
    // 根据人口确定城市等级
    getTierByPopulation: function(provinceCode) {
        const tierMap = {
            'S': ['BJ', 'SH', 'GD', 'JS', 'ZJ'], // 一线
            'A': ['TJ', 'HE', 'SD', 'HA', 'SC', 'HB', 'HN', 'FJ', 'LN', 'SN'], // 二线
            'B': ['AH', 'JX', 'GX', 'YN', 'GZ', 'SX', 'JL', 'HL', 'CQ', 'GX'], // 三线
            'C': ['GS', 'QH', 'NX', 'XJ', 'XZ', 'NM', 'HI', 'GZ', 'YN', 'AH'] // 四线
        };
        
        for (const [tier, provinces] of Object.entries(tierMap)) {
            if (provinces.includes(provinceCode)) return tier;
        }
        return 'D';
    },
    
    // 根据等级获取报名费
    getEntryFeeByTier: function(tier) {
        const fees = { 'S': 1000, 'A': 500, 'B': 300, 'C': 200, 'D': 100 };
        return fees[tier] || 100;
    },
    
    // 根据等级获取奖金
    getPrizeByTier: function(tier) {
        const prizes = { 'S': 100000, 'A': 50000, 'B': 30000, 'C': 20000, 'D': 10000 };
        return prizes[tier] || 10000;
    },
    
    // 生成开始时间
    generateStartTime: function() {
        const now = new Date();
        const hours = Math.floor(Math.random() * 24);
        const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        now.setHours(hours, minutes, 0, 0);
        return now.toISOString();
    },
    
    // 获取中国锦标赛
    getChinaTournaments: function() {
        return this.generateTournaments().filter(t => t.country === '中国');
    },
    
    // 获取国际锦标赛
    getInternationalTournaments: function() {
        return this.generateTournaments().filter(t => t.country !== '中国');
    },
    
    // 按地区获取锦标赛
    getTournamentsByRegion: function(region) {
        return this.generateTournaments().filter(t => t.region === region);
    },
    
    // 获取统计数据
    getStats: function() {
        const all = this.generateTournaments();
        return {
            total: all.length,
            china: all.filter(t => t.country === '中国').length,
            international: all.filter(t => t.country !== '中国').length,
            byTier: {
                'S': all.filter(t => t.tier === 'S').length,
                'A': all.filter(t => t.tier === 'A').length,
                'B': all.filter(t => t.tier === 'B').length,
                'C': all.filter(t => t.tier === 'C').length,
                'D': all.filter(t => t.tier === 'D').length
            }
        };
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalTournamentData;
}

// 控制台输出统计信息
console.log('全球锦标赛数据系统加载完成');
console.log('统计:', GlobalTournamentData.getStats());
