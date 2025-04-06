// 翻译对象
let translations = {
    // 基本信息
    'basicInfo': '基本信息',
    'name': '名称',
    'level': '等级',
    'vipLevel': 'VIP等级',
    'fightpoint': '战斗力',
    'ipArea': 'IP地区',
    'worldLevel': '世界等级',
    'matrixId': '阵法ID',
    'wingId': '翅膀ID',
    'fashionInfo': '时装信息',
    'unknown': '未知',
    'equipped': '已装备',
    'unequipped': '未装备',
    'enabled': '启用',
    'disabled': '禁用',
    'permanent': '永久',
    'locked': '已锁定',
    'unlocked': '未锁定',
    'noInfo': '暂无信息',

    // 属性
    'id': '编号',
    'exp': '经验',
    'type': '类型',
    'quality': '品质',
    'attr': '属性',
    'growth': '成长',
    'time': '时间',
    'desc': '描述',
    'value': '数值',
    'status': '状态',
    'position': '位置',
    'lastUsed': '最后使用时间',
    'unused': '未使用',

    // 基础属性
    'atk': '攻击',
    'hp': '生命',
    'mp': '法力',
    'def': '防御',
    'healHp': '回血',
    'healMp': '回蓝',
    
    // 特殊属性
    'crit': '暴击',
    'lucky': '幸运',
    'dodge': '闪避',
    'hitVal': '命中',
    'break': '穿透',
    'tenacity': '韧性',
    'guardian': '守护',

    // 装备相关
    'equipment': '装备',
    'hero_weapon': '武器',
    'hero_head': '头盔',
    'hero_hand': '护腕',
    'hero_armor': '衣服',
    'hero_foot': '下装',
    'hero_jewelry': '饰品',

    // 宠物装备相关
    'pet_equipment': '宠物装备',
    'pet_weapon': '宠物武器',
    'pet_head': '宠物头饰',
    'pet_hand': '宠物护手',
    'pet_armor': '宠物铠甲',
    'pet_foot': '宠物足具',
    'pet_jewelry': '宠物饰品',

    // 坐骑装备相关
    'ride_equipment': '坐骑装备',
    'ride_weapon': '坐骑武具',
    'ride_head': '坐骑头甲',
    'ride_hand': '坐骑护具',
    'ride_armor': '坐骑甲胄',
    'ride_foot': '坐骑蹄铁',
    'ride_jewelry': '坐骑饰物',

    // 通用装备属性
    'baseAttr': '基础属性',
    'affixAttr': '词缀属性',
    'affixAttrPer': '词缀属性百分比',
    'affixLevel': '词缀等级',
    'getTime': '获得时间',
    'part': '部位',
    'itemType': '类型',
    'affixLv': '词缀等级',
    'lock': '锁定状态',
    'noEquipInfo': '暂无装备信息',

    // 技能相关
    'skill': '技能',
    'activeSkill': '主动技能',
    'passiveSkill': '被动技能',
    'specialSkill': '特殊技能',
    'makeupSkill': '无双技能',
    'awakenSkill': '觉醒技能',
    'exSkill': '绝技无双',
    'skillPage': '技能页',
    'passivePage': '被动页',
    'noSkillInfo': '暂无技能信息',
    'noPassiveSkills': '暂无被动技能',

    // 宠物和坐骑相关
    'pet': '宠物',
    'ride': '坐骑',
    'mood': '心情',
    'energy': '能量',
    'energyAdd': '能量增加',
    'star': '星级',
    'nextLvExp': '升级所需经验',
    'expireTime': '过期时间',
    'petNum': '宠物数量',
    'rideNum': '坐骑数量',
    'noPetInfo': '暂无宠物信息',
    'noRideInfo': '暂无坐骑信息',

    // 品质相关
    'strQuality': '力量品质',
    'vitQuality': '体力品质',
    'luckQuality': '幸运品质',
    'dexQuality': '敏捷品质',

    // 阵法相关
    'matrix': '阵法',
    'skillInfo': '技能信息',
    'holeInfo': '孔位信息',
    'hole': '孔位',
    'holeId': '孔位ID',
    'noMatrixInfo': '暂无阵法信息',
    'noHoleInfo': '无孔位信息',

    // 内丹相关
    'yin': '阴丹',
    'yang': '阳丹',
    'danqi': '丹气',
    'neidanPage': '内丹页',
    'noNeidanInfo': '暂无内丹信息',

    // 竞技场相关
    'arena': '竞技场',
    'petArena': '斗宠',
    'skyWar': '天道之战',
    'rank': '排名',
    'grading': '段位',
    'maxGrading': '最高段位',
    'score': '分数',
    'winRate': '胜率',
    'winStreak': '连胜',
    'totalWins': '总胜场',
    'totalLosses': '总败场',
    'totalSucc': '总胜场',
    'totalFail': '总败场',
    'winRto': '胜率',
    'normalArena': '仙位',
    'petArenaTitle': '斗宠',
    'skyWarTitle': '天道之战',
    'noArenaInfo': '暂无竞技场信息',

    // 其他系统
    'titles': '称号',
    'reputation': '声望',
    'galaxy': '星核',
    'satellite': '伴星',
    'meridian': '外丹',
    'neidan': '内丹',
    'feather': '羽毛',
    'magic': '法宝',
    'wing': '翅膀',
    'reputationLogs': '声望记录',

    // 提示信息
    'noTitles': '暂无称号信息',
    'noMatrix': '暂无阵法信息',
    'noHoles': '无孔位信息',
    'noGalaxy': '暂无星系信息',
    'noReputation': '暂无声望信息',
    'noFeatherInfo': '暂无羽毛信息',
    'noMagicInfo': '暂无法宝信息',
    'noWingInfo': '暂无翅膀信息',
    'noMeridianInfo': '暂无外丹信息'
};

// 翻译函数
function translate(key) {
    return translations[key] || key;
}

// 更新翻译的函数
function updateTranslations(newTranslations) {
    translations = { ...translations, ...newTranslations };
}

// 获取所有翻译
function getAllTranslations() {
    return { ...translations };
}

// 导出
export { translate, updateTranslations, getAllTranslations }; 