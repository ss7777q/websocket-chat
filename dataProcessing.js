// dataProcessing.js

// 直接嵌入称号数据
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

function processData(text) {
    try {
        const response = JSON.parse(text);
        if (response.success) {
            const data = response.data;

            // 基本信息
            document.getElementById('basic').innerHTML = `
                <div class="stat"><span class="stat-name">昵称:</span> <span class="stat-value">${data.name || '未知'}</span></div>
                <div class="stat"><span class="stat-name">UID:</span> <span class="stat-value">${data.uid || '未知'}</span></div>
                <div class="stat"><span class="stat-name">等级:</span> <span class="stat-value">${data.lv || '未知'}</span></div>
                <div class="stat"><span class="stat-name">VIP等级:</span> <span class="stat-value">${data.vipLv || '0'}</span></div>
                <div class="stat"><span class="stat-name">战斗力:</span> <span class="stat-value">${data.fightpoint || '未知'}</span></div>
                <div class="stat"><span class="stat-name">地区:</span> <span class="stat-value">${data.iparea || '未知'}</span></div>
                <div class="stat"><span class="stat-name">公会:</span> <span class="stat-value">${data.leagueName || '无'}</span></div>
                <div class="stat"><span class="stat-name">隐藏VIP:</span> <span class="stat-value">${data.hideVip ? '是' : '否'}</span></div>
            `;

            // 称号（折叠）
            const titlesList = Object.values(data.titles?.list || {});
            let titlesHTML = titlesList.length > 1 ? '' : (titlesList[0] ? `
                <div class="stat"><span class="stat-name">称号ID:</span> <span class="stat-value">${titlesList[0].id}</span></div>
                <div class="stat"><span class="stat-name">称号名称:</span> <span class="stat-value">${getTitleName(titlesList[0].id)}</span></div>
                <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${titlesList[0].pos ? '使用中' : '未使用'}</span></div>
                <div class="stat"><span class="stat-name">到期时间:</span> <span class="stat-value">${titlesList[0].last ? new Date(titlesList[0].last).toLocaleString() : '无'}</span></div>
            ` : '暂无称号');
            if (titlesList.length > 1) {
                titlesHTML = titlesList.map((t, index) => `
                    <button class="collapsible">称号 ${getTitleName(t.id)} ${t.pos ? '(使用中)' : ''}</button>
                    <div class="content">
                        <div class="stat"><span class="stat-name">称号ID:</span> <span class="stat-value">${t.id}</span></div>
                        <div class="stat"><span class="stat-name">称号名称:</span> <span class="stat-value">${getTitleName(t.id)}</span></div>
                        <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${t.pos ? '使用中' : '未使用'}</span></div>
                        <div class="stat"><span class="stat-name">到期时间:</span> <span class="stat-value">${t.last ? new Date(t.last).toLocaleString() : '无'}</span></div>
                    </div>
                `).join('');
            }
            document.getElementById('titles').innerHTML = titlesHTML || '暂无称号';

            // 翅膀（折叠）
            const wingsList = data.wingBag || [];
            let wingsHTML = wingsList.length > 1 ? '' : (wingsList[0] ? `
                <div class="stat"><span class="stat-name">翅膀ID:</span> <span class="stat-value">${wingsList[0].id}</span></div>
                <div class="stat"><span class="stat-name">等级:</span> <span class="stat-value">${wingsList[0].lv || '未知'}</span></div>
                <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${wingsList[0].pos ? '使用中' : '未使用'}</span></div>
                <div class="stat"><span class="stat-name">技能:</span> <span class="stat-value">${wingsList[0].skills?.map(s => `技能${s.wingSkill}: ${s.lv}级`).join(', ') || '无'}</span></div>
            ` : '暂无翅膀');
            if (wingsList.length > 1) {
                wingsHTML = wingsList.map((w, index) => `
                    <button class="collapsible">翅膀 ${w.id} ${w.pos ? '(使用中)' : ''}</button>
                    <div class="content">
                        <div class="stat"><span class="stat-name">翅膀ID:</span> <span class="stat-value">${w.id}</span></div>
                        <div class="stat"><span class="stat-name">等级:</span> <span class="stat-value">${w.lv || '未知'}</span></div>
                        <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${w.pos ? '使用中' : '未使用'}</span></div>
                        <div class="stat"><span class="stat-name">技能:</span> <span class="stat-value">${w.skills?.map(s => `技能${s.wingSkill}: ${s.lv}级`).join(', ') || '无'}</span></div>
                    </div>
                `).join('');
            }
            document.getElementById('wingbag').innerHTML = wingsHTML || '暂无翅膀';

            // 宠物
            const pet = data.pet || {};
            document.getElementById('pet').innerHTML = data.pet ? `
                <div class="stat"><span class="stat-name">名称:</span> <span class="stat-value">${pet.name || '未知'}</span></div>
                <div class="stat"><span class="stat-name">星级:</span> <span class="stat-value">${pet.star || '未知'}</span></div>
                <div class="stat"><span class="stat-name">等级:</span> <span class="stat-value">${pet.lv || '未知'}</span></div>
                <div class="stat"><span class="stat-name">战斗力:</span> <span class="stat-value">${pet.fightpoint || '未知'}</span></div>
                <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${pet.pos ? '使用中' : '未使用'}</span></div>
                <div class="stat"><span class="stat-name">资质:</span> <span class="stat-value">力量:${pet.strQuality || 0}, 体质:${pet.vitQuality || 0}, 气运:${pet.luckQuality || 0}, 敏捷:${pet.dexQuality || 0}</span></div>
                <div class="stat"><span class="stat-name">主动技能:</span> <span class="stat-value">${pet.skillActive?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">被动技能:</span> <span class="stat-value">${pet.skillPassive?.map(s => s).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">特殊技能:</span> <span class="stat-value">${pet.skillSp?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">潜能技能:</span> <span class="stat-value">${pet.skillPotential?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">到期时间:</span> <span class="stat-value">${pet.expireTime === -1 ? '永久' : new Date(pet.expireTime).toLocaleString()}</span></div>
            ` : '未出战宠物';

            // 坐骑
            const ride = data.ride || {};
            document.getElementById('ride').innerHTML = data.ride ? `
                <div class="stat"><span class="stat-name">坐骑ID:</span> <span class="stat-value">${ride.id || '未知'}</span></div>
                <div class="stat"><span class="stat-name">名称:</span> <span class="stat-value">${ride.name || '未知'}</span></div>
                <div class="stat"><span class="stat-name">星级:</span> <span class="stat-value">${ride.star || '未知'}</span></div>
                <div class="stat"><span class="stat-name">等级:</span> <span class="stat-value">${ride.lv || '未知'}</span></div>
                <div class="stat"><span class="stat-name">战斗力:</span> <span class="stat-value">${ride.fightpoint || '未知'}</span></div>
                <div class="stat"><span class="stat-name">状态:</span> <span class="stat-value">${ride.pos ? '使用中' : '未使用'}</span></div>
                <div class="stat"><span class="stat-name">资质:</span> <span class="stat-value">力量:${ride.strQuality || 0}, 体质:${ride.vitQuality || 0}, 气运:${ride.luckQuality || 0}, 敏捷:${ride.dexQuality || 0}</span></div>
                <div class="stat"><span class="stat-name">主动技能:</span> <span class="stat-value">${ride.skillActive?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">被动技能:</span> <span class="stat-value">${ride.skillPassive?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">特殊技能:</span> <span class="stat-value">${ride.skillSp?.map(s => `${s.id}: ${s.lv}级`).join(', ') || '无'}</span></div>
                <div class="stat"><span class="stat-name">到期时间:</span> <span class="stat-value">${ride.expireTime === -1 ? '永久' : new Date(ride.expireTime).toLocaleString()}</span></div>
            ` : '暂无坐骑';

            // 羽毛（折叠）
            const feathersList = data.hero?.feathers || [];
            let feathersHTML = feathersList.length > 1 ? '' : (feathersList[0] ? `
                <div class="stat"><span class="stat-name">羽毛ID:</span> <span class="stat-value">${feathersList[0].id}</span></div>
                <div class="stat"><span class="stat-name">战斗力:</span> <span class="stat-value">${feathersList[0].fightpoint || '未知'}</span></div>
                <div class="stat"><span class="stat-name">属性:</span> <span class="stat-value">${Object.entries(feathersList[0].attr || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}</span></div>
                <div class="stat"><span class="stat-name">属性百分比:</span> <span class="stat-value">${Object.entries(feathersList[0].attrPer || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}</span></div>
                <div class="stat"><span class="stat-name">获取时间:</span> <span class="stat-value">${feathersList[0].getTime ? new Date(feathersList[0].getTime).toLocaleString() : '未知'}</span></div>
            ` : '暂无羽毛');
            if (feathersList.length > 1) {
                feathersHTML = feathersList.map((f, index) => `
                    <button class="collapsible">羽毛 ${f.id} (战斗力: ${f.fightpoint || '未知'})</button>
                    <div class="content">
                        <div class="stat"><span class="stat-name">羽毛ID:</span> <span class="stat-value">${f.id}</span></div>
                        <div class="stat"><span class="stat-name">战斗力:</span> <span class="stat-value">${f.fightpoint || '未知'}</span></div>
                        <div class="stat"><span class="stat-name">属性:</span> <span class="stat-value">${Object.entries(f.attr || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}</span></div>
                        <div class="stat"><span class="stat-name">属性百分比:</span> <span class="stat-value">${Object.entries(f.attrPer || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}</span></div>
                        <div class="stat"><span class="stat-name">获取时间:</span> <span class="stat-value">${f.getTime ? new Date(f.getTime).toLocaleString() : '未知'}</span></div>
                    </div>
                `).join('');
            }
            document.getElementById('feathers').innerHTML = feathersHTML || '暂无羽毛';

            // 阵法
            const meridians = data.meridians || {};
            document.getElementById('meridians').innerHTML = `
                <div class="stat"><span class="stat-name">经脉:</span> <span class="stat-value">${Object.entries(meridians.vein || {}).map(([k, v]) => `经脉${k}: 阶${v.rank} 级${v.level}`).join(', ')}</span></div>
                <div class="stat"><span class="stat-name">镶嵌丹药:</span> <span class="stat-value">${Object.keys(meridians.inlayPill || {}).length > 0 ? JSON.stringify(meridians.inlayPill) : '无'}</span></div>
                <div class="stat"><span class="stat-name">精炼次数:</span> <span class="stat-value">${Object.entries(meridians.refiningNum || {}).map(([k, v]) => `${k}: ${v}次`).join(', ')}</span></div>
            `;

            // 默认显示基本信息
            openTab('basic');
            // 右下角显示完整数据
            infoBox.style.display = 'block';
            infoContent.textContent = JSON.stringify(data, null, 2);

            // 添加折叠功能
            setupCollapsibles();
        } else {
            document.getElementById('basic').innerHTML = `<p class="error">错误: ${response.error}</p>`;
            openTab('basic');
            infoBox.style.display = 'none';
        }
    } catch (e) {
        document.getElementById('basic').innerHTML = `<p class="error">解析错误: ${e.message}</p>`;
        openTab('basic');
        infoBox.style.display = 'none';
    }
}
