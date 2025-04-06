import { translate } from './translations.js';

const titleData = {
    1010001: "vip1",
    1010002: "vip2",
    1010003: "vip3",
    1010004: "vip4",
    1010005: "vip5",
    1010006: "vip6",
    1010007: "vip7",
    1010008: "vip8",
    1010009: "vip9",
    1020001: "造梦先锋",
    1020002: "战力之王",
    1020003: "战力先锋",
    1020004: "战力斗士",
    1020005: "驭宠之王",
    1020006: "驭宠先锋",
    1020007: "驭宠斗士",
    1020008: "豆战胜佛",
    1020009: "无双爆行者",
    1020010: "造梦管理员",
    1020011: "创作初行者",
    1020191: "白龙0氪速通",
    1020201: "白龙0氪",
    1020301: "白龙",
    1040001: "1",
    1040002: "2",
    1040003: "3",
    1040004: "4",
    1040005: "5",
    1040006: "6",
    1040007: "7",
    1040008: "8",
    1040009: "9",
    1040010: "10",
    1040011: "11",
    1040012: "12",
    1050001: "13",
    1060001: "14",
    1070002: "15",
    1090001: "16",
    1090002: "17",
    1090003: "18",
    1100004: "19",
    1200002: "20"
    // 可以根据你提供的数据添加更多
};

// 获取称号名称的函数
function getTitleName(titleId) {
    return titleData[titleId] || `${translate('unknown')}${translate('title')}(ID:${titleId})`;
}

// 处理玩家数据
export function processData(data) {
    try {
        // 显示基本信息
        displayBasicInfo(data);
        
        // 显示称号信息
        displayTitles(data.titles);
        
        // 显示装备信息
        displayEquipment(data.hero.equipments);
        
        // 显示技能信息
        displaySkills(data.hero.skillPages);
        
        // 显示内丹信息
        displayNeidan(data.hero.neiDanList);
        
        // 显示羽毛信息
        displayFeathers(data.hero.feathers);
        
        // 显示法宝信息
        displayMagics(data.magics);
        
        // 显示翅膀信息
        displayWingbag(data.hero.fashions);
        
        // 显示宠物信息
        displayPet(data.pet);
        
        // 显示坐骑信息
        displayRide(data.ride);
        
        // 显示外丹信息
        displayMeridians(data.meridians);
        
    } catch (error) {
        console.error('数据处理错误:', error);
        alert('数据处理出错，请稍后重试');
    }
}

// 显示基本信息
function displayBasicInfo(data) {
    const basicPane = document.getElementById('basic');
    basicPane.innerHTML = `
        <div class="info-section">
            <h3>${translate('basicInfo')}</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">${translate('name')}：</span>
                    <span class="value">${data.name}</span>
                </div>
                <div class="info-item">
                    <span class="label">UID：</span>
                    <span class="value">${data.uid}</span>
                </div>
                <div class="info-item">
                    <span class="label">${translate('level')}：</span>
                    <span class="value">${data.lv}</span>
                </div>
                <div class="info-item">
                    <span class="label">${translate('vipLevel')}：</span>
                    <span class="value">${data.vipLv}</span>
                </div>
                <div class="info-item">
                    <span class="label">${translate('fightpoint')}：</span>
                    <span class="value">${data.fightpoint}</span>
                </div>
            </div>
        </div>
    `;
}

// 显示称号信息
function displayTitles(titles) {
    const titlesPane = document.getElementById('titles');
    let html = `<div class="info-section"><h3>${translate('titles')}</h3><div class="titles-grid">`;
    
    for (const [id, title] of Object.entries(titles)) {
        html += `
            <div class="title-item">
                <div class="title-id">${translate('id')}: ${id}</div>
                <div class="title-time">${translate('lastUsed')}: ${title.last ? new Date(title.last).toLocaleString() : translate('unused')}</div>
            </div>
        `;
    }
    
    html += '</div></div>';
    titlesPane.innerHTML = html;
}

// 显示装备信息
function displayEquipment(equipments) {
    const equipmentPane = document.getElementById('equipment');
    let html = `<div class="info-section"><h3>${translate('equipment')}</h3>`;
    
    for (const [slot, equip] of Object.entries(equipments)) {
        html += `
            <div class="equipment-item">
                <h4>${translate(slot)}</h4>
                <div class="equipment-details">
                    <p>${translate('level')}：${equip.lv}</p>
                    <p>${translate('exp')}：${equip.exp}</p>
                    <div class="attributes">
                        <h5>${translate('baseAttr')}：</h5>
                        ${formatAttributes(equip.data.attr)}
                        <h5>${translate('affixAttr')}：</h5>
                        ${formatAttributes(equip.data.affixAttr)}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    equipmentPane.innerHTML = html;
}

// 显示技能信息
function displaySkills(skillPages) {
    const skillsPane = document.getElementById('skills');
    let html = `<div class="info-section"><h3>${translate('skill')}</h3>`;
    
    skillPages.pages.forEach((page, index) => {
        html += `
            <div class="skill-page">
                <h4>${translate('skillPage')} ${index + 1}</h4>
                <div class="skills-list">
                    ${page.skills.map(skill => `
                        <div class="skill-item">
                            <span class="skill-id">${translate('id')}: ${skill.id}</span>
                            <span class="skill-level">${translate('level')}: ${skill.lv}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    skillsPane.innerHTML = html;
}

// 显示内丹信息
function displayNeidan(neiDanList) {
    const neidanPane = document.getElementById('neidan');
    let html = `<div class="info-section"><h3>${translate('neidan')}</h3>`;
    
    neiDanList.pages.forEach((page, index) => {
        html += `
            <div class="neidan-page">
                <h4>${page.name}</h4>
                <div class="neidan-stats">
                    <p>${translate('yin')}：${page.yin}</p>
                    <p>${translate('yang')}：${page.yang}</p>
                </div>
                <div class="danqi-list">
                    ${page.danqi.map(danqi => `
                        <div class="danqi-item">
                            <p>${translate('id')}: ${danqi.id}</p>
                            <p>${translate('type')}: ${danqi.type}</p>
                            <p>${translate('attr')}: ${JSON.stringify(danqi.attr)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    neidanPane.innerHTML = html;
}

// 显示羽毛信息
function displayFeathers(feathers) {
    const feathersPane = document.getElementById('feathers');
    let html = `<div class="info-section"><h3>${translate('feather')}</h3><div class="feathers-grid">`;
    
    feathers.forEach(feather => {
        html += `
            <div class="feather-item">
                <div class="feather-id">${translate('id')}: ${feather.id}</div>
                <div class="feather-attr">
                    ${formatAttributes(feather.attr)}
                </div>
                <div class="feather-fightpoint">${translate('fightpoint')}: ${feather.fightpoint}</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    feathersPane.innerHTML = html;
}

// 显示法宝信息
function displayMagics(magics) {
    const magicsPane = document.getElementById('magics');
    let html = `<div class="info-section"><h3>${translate('magic')}</h3><div class="magics-grid">`;
    
    magics.forEach(magic => {
        html += `
            <div class="magic-item">
                <div class="magic-id">${translate('id')}: ${magic.id}</div>
                <div class="magic-level">${translate('level')}: ${magic.lv}</div>
                <div class="magic-growth">${translate('growth')}: ${magic.growth}</div>
                <div class="magic-blessing">${translate('blessing')}: ${magic.blessing.join(', ')}</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    magicsPane.innerHTML = html;
}

// 辅助函数：获取装备槽位名称
function getEquipmentSlotName(slot) {
    const slotNames = {
        'weapon': '武器',
        'head': '头部',
        'hand': '手部',
        'armor': '护甲',
        'foot': '脚部',
        'jewelry': '饰品'
    };
    return slotNames[slot] || slot;
}

// 辅助函数：格式化属性显示
function formatAttributes(attr) {
    return Object.entries(attr).map(([key, value]) => `
        <div class="attr-item">
            <span class="attr-name">${translate(key)}:</span>
            <span class="attr-value">${value}</span>
        </div>
    `).join('');
}