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
    return titleData[titleId] || `未知称号(ID:${titleId})`;
}

// 处理玩家数据
function processData(data) {
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
        
        // 显示经脉信息
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
            <h3>基本信息</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">名称：</span>
                    <span class="value">${data.name}</span>
                </div>
                <div class="info-item">
                    <span class="label">UID：</span>
                    <span class="value">${data.uid}</span>
                </div>
                <div class="info-item">
                    <span class="label">等级：</span>
                    <span class="value">${data.lv}</span>
                </div>
                <div class="info-item">
                    <span class="label">VIP等级：</span>
                    <span class="value">${data.vipLv}</span>
                </div>
                <div class="info-item">
                    <span class="label">战斗力：</span>
                    <span class="value">${data.fightpoint}</span>
                </div>
            </div>
        </div>
    `;
}

// 显示称号信息
function displayTitles(titles) {
    const titlesPane = document.getElementById('titles');
    let html = '<div class="info-section"><h3>称号列表</h3><div class="titles-grid">';
    
    for (const [id, title] of Object.entries(titles)) {
        html += `
            <div class="title-item">
                <div class="title-id">ID: ${id}</div>
                <div class="title-time">最后使用: ${title.last ? new Date(title.last).toLocaleString() : '未使用'}</div>
            </div>
        `;
    }
    
    html += '</div></div>';
    titlesPane.innerHTML = html;
}

// 显示装备信息
function displayEquipment(equipments) {
    const equipmentPane = document.getElementById('equipment');
    let html = '<div class="info-section"><h3>装备信息</h3>';
    
    for (const [slot, equip] of Object.entries(equipments)) {
        html += `
            <div class="equipment-item">
                <h4>${getEquipmentSlotName(slot)}</h4>
                <div class="equipment-details">
                    <p>等级：${equip.lv}</p>
                    <p>经验：${equip.exp}</p>
                    <div class="attributes">
                        <h5>基础属性：</h5>
                        ${formatAttributes(equip.data.attr)}
                        <h5>附加属性：</h5>
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
    let html = '<div class="info-section"><h3>技能信息</h3>';
    
    skillPages.pages.forEach((page, index) => {
        html += `
            <div class="skill-page">
                <h4>技能页 ${index + 1}</h4>
                <div class="skills-list">
                    ${page.skills.map(skill => `
                        <div class="skill-item">
                            <span class="skill-id">ID: ${skill.id}</span>
                            <span class="skill-level">等级: ${skill.lv}</span>
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
    let html = '<div class="info-section"><h3>内丹信息</h3>';
    
    neiDanList.pages.forEach((page, index) => {
        html += `
            <div class="neidan-page">
                <h4>${page.name}</h4>
                <div class="neidan-stats">
                    <p>阴气：${page.yin}</p>
                    <p>阳气：${page.yang}</p>
                </div>
                <div class="danqi-list">
                    ${page.danqi.map(danqi => `
                        <div class="danqi-item">
                            <p>ID: ${danqi.id}</p>
                            <p>类型: ${danqi.type}</p>
                            <p>属性: ${JSON.stringify(danqi.attr)}</p>
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
    let html = '<div class="info-section"><h3>羽毛信息</h3><div class="feathers-grid">';
    
    feathers.forEach(feather => {
        html += `
            <div class="feather-item">
                <div class="feather-id">ID: ${feather.id}</div>
                <div class="feather-attr">
                    ${formatAttributes(feather.attr)}
                </div>
                <div class="feather-fightpoint">战斗力: ${feather.fightpoint}</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    feathersPane.innerHTML = html;
}

// 显示法宝信息
function displayMagics(magics) {
    const magicsPane = document.getElementById('magics');
    let html = '<div class="info-section"><h3>法宝信息</h3><div class="magics-grid">';
    
    magics.forEach(magic => {
        html += `
            <div class="magic-item">
                <div class="magic-id">ID: ${magic.id}</div>
                <div class="magic-level">等级: ${magic.lv}</div>
                <div class="magic-growth">成长: ${magic.growth}</div>
                <div class="magic-blessing">祝福: ${magic.blessing.join(', ')}</div>
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
            <span class="attr-name">${key}:</span>
            <span class="attr-value">${value}</span>
        </div>
    `).join('');
}