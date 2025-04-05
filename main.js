// 全局WebSocket连接
let ws;

document.addEventListener('DOMContentLoaded', function() {
    const uidInput = document.getElementById('uidInput');
    const searchButton = document.getElementById('searchButton');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const infoBox = document.getElementById('infoBox');
    const infoContent = document.getElementById('infoContent');
    const closeButton = document.getElementById('closeButton');
    const copyButton = document.getElementById('copyButton');

    // 初始化WebSocket连接
    function initWebSocket() {
        ws = new WebSocket('ws://localhost:3000/client');
        
        ws.onopen = () => {
            console.log('已连接到服务器');
            document.getElementById('basic').innerHTML = '<p>已连接到服务器，可以开始查询</p>';
            searchButton.disabled = false;
        };
        
        ws.onclose = () => {
            console.log('与服务器断开连接');
            document.getElementById('basic').innerHTML = '<p class="error">与服务器断开连接，请刷新页面重试</p>';
            searchButton.disabled = true;
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            document.getElementById('basic').innerHTML = '<p class="error">连接错误，请检查服务器是否运行</p>';
            searchButton.disabled = true;
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.error) {
                    document.getElementById('basic').innerHTML = `<p class="error">${data.message}</p>`;
                    return;
                }
                if (data.type === 'success') {
                    processData(data.data);
                }
            } catch (error) {
                console.error('数据处理错误:', error);
                document.getElementById('basic').innerHTML = '<p class="error">数据处理错误</p>';
            }
        };
    }

    // 初始化WebSocket连接
    initWebSocket();

    // 标签页切换功能
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 查询功能
    function fetchPlayerInfo() {
        const uid = uidInput.value.trim();
        if (!uid) {
            alert('请输入玩家UID');
            return;
        }

        document.getElementById('basic').innerHTML = '<p>查询中...</p>';
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(uid);
        } else {
            document.getElementById('basic').innerHTML = '<p class="error">未连接到服务器，请刷新页面重试</p>';
        }
    }

    // 查询按钮点击事件
    searchButton.addEventListener('click', fetchPlayerInfo);

    // 回车键触发查询
    uidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchPlayerInfo();
        }
    });

    // 复制按钮功能
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const textToCopy = infoContent.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('已复制到剪贴板！'))
                .catch(err => alert('复制失败: ' + err));
        });
    }

    // 关闭按钮功能
    closeButton.addEventListener('click', () => {
        infoBox.style.display = 'none';
    });

    // 处理数据并显示
    function processData(data) {
        try {
            // 显示基本信息
            const basicPane = document.getElementById('basic');
            basicPane.innerHTML = `
                <div class="info-section">
                    <h3>基本信息</h3>
                    <p>名称：${data.name || '未知'}</p>
                    <p>UID：${data.uid || '未知'}</p>
                    <p>等级：${data.lv || '未知'}</p>
                    <p>VIP等级：${data.vipLv || '未知'}</p>
                    <p>战斗力：${data.fightpoint || '未知'}</p>
                    <p>IP地区：${data.iparea || '未知'}</p>
                    <p>世界等级：${data.worldLv || '未知'}</p>
                    <p>阵法ID：${data.matrixId || '未知'}</p>
                    <p>翅膀ID：${data.wingId || '未知'}</p>
                    <p>时装信息：ID ${data.fashionInfo ? data.fashionInfo.id : '未知'}, 经验 ${data.fashionInfo ? data.fashionInfo.exp : '未知'}</p>
                </div>
            `;

            // 显示称号信息
            const titlesPane = document.getElementById('titles');
            let titlesHtml = '<div class="info-section"><h3>称号列表</h3>';
            if (data.titles && data.titles.list) {
                titlesHtml += '<div class="titles-grid">';
                for (const [id, title] of Object.entries(data.titles.list)) {
                    titlesHtml += `
                        <div class="title-item">
                            <p>ID：${id}</p>
                            <p>最后使用时间：${title.last ? new Date(title.last).toLocaleString() : '未使用'}</p>
                            ${title.pos ? `<p>位置：${title.pos}</p>` : ''}
                        </div>
                    `;
                }
                titlesHtml += '</div>';
            } else {
                titlesHtml += '<p>暂无称号信息</p>';
            }
            titlesHtml += '</div>';
            titlesPane.innerHTML = titlesHtml;

            // 显示阵法信息
            const matrixPane = document.getElementById('matrix');
            let matrixHtml = '<div class="info-section"><h3>阵法信息</h3>';
            if (data.matrix) {
                for (const [matrixId, matrix] of Object.entries(data.matrix)) {
                    matrixHtml += `
                        <div class="matrix-item">
                            <h4>阵法 ${matrixId}</h4>
                            <p>装备状态：${matrix.equiped ? '已装备' : '未装备'}</p>
                            ${matrix.skill ? `
                                <div class="matrix-skill">
                                    <h5>技能信息</h5>
                                    <p>技能ID：${matrix.skill.id}</p>
                                    <p>等级：${matrix.skill.level}</p>
                                    <p>品质：${matrix.skill.quality}</p>
                                    <p>状态：${matrix.skill.enable ? '启用' : '禁用'}</p>
                                </div>
                            ` : ''}
                            ${Object.keys(matrix.hole).length > 0 ? `
                                <div class="matrix-holes">
                                    <h5>孔位信息</h5>
                                    ${Object.entries(matrix.hole).map(([holeId, hole]) => `
                                        <div class="hole-item">
                                            <p>孔位ID：${holeId}</p>
                                            <p>物品ID：${hole.id}</p>
                                            <p>类型：${hole.type}</p>
                                            <p>等级：${hole.level}</p>
                                            <p>属性：${JSON.stringify(hole.attr)}</p>
                                            <p>成长：${JSON.stringify(hole.growth)}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p>无孔位信息</p>'}
                        </div>
                    `;
                }
            } else {
                matrixHtml += '<p>暂无阵法信息</p>';
            }
            matrixHtml += '</div>';
            matrixPane.innerHTML = matrixHtml;

            // 显示星系信息
            const galaxyPane = document.getElementById('galaxy');
            let galaxyHtml = '<div class="info-section"><h3>星系信息</h3>';
            if (data.galaxyInfo) {
                galaxyHtml += '<div class="galaxy-grid">';
                for (const [id, galaxy] of Object.entries(data.galaxyInfo)) {
                    galaxyHtml += `
                        <div class="galaxy-item">
                            <p>星系ID：${id}</p>
                            <p>品质：${galaxy.quality}</p>
                            <p>卫星等级：${galaxy.satelliteLv}</p>
                        </div>
                    `;
                }
                galaxyHtml += '</div>';
            } else {
                galaxyHtml += '<p>暂无星系信息</p>';
            }
            galaxyHtml += '</div>';
            galaxyPane.innerHTML = galaxyHtml;

            // 显示声望信息
            const reputationPane = document.getElementById('reputation');
            let reputationHtml = '<div class="info-section"><h3>声望信息</h3>';
            if (data.reputation) {
                reputationHtml += `
                    <div class="reputation-info">
                        <p>版本：${data.reputation.ver}</p>
                        <p>声望值：${data.reputation.val}</p>
                        <p>等级：${data.reputation.lv}</p>
                        <p>每日增加：${data.reputation.dayAdd}</p>
                    </div>
                    <div class="reputation-logs">
                        <h4>声望记录</h4>
                        ${data.reputation.logs.map(log => `
                            <div class="log-item">
                                <p>时间：${new Date(log.time).toLocaleString()}</p>
                                <p>数值：${log.val}</p>
                                <p>描述：${log.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                reputationHtml += '<p>暂无声望信息</p>';
            }
            reputationHtml += '</div>';
            reputationPane.innerHTML = reputationHtml;

            // 显示竞技场信息
            const arenaPane = document.getElementById('arena');
            let arenaHtml = '<div class="info-section"><h3>竞技场信息</h3>';
            if (data.arena || data.petArena || data.skyWar) {
                if (data.arena) {
                    arenaHtml += `
                        <div class="arena-info">
                            <h4>普通竞技场</h4>
                            <p>排名：${data.arena.rank}</p>
                            <p>段位：${data.arena.grading}</p>
                            <p>最高段位：${data.arena.maxGrading}</p>
                        </div>
                    `;
                }
                if (data.petArena) {
                    arenaHtml += `
                        <div class="pet-arena-info">
                            <h4>宠物竞技场</h4>
                            <p>排名：${data.petArena.rank}</p>
                            <p>段位：${data.petArena.grading}</p>
                            <p>最高段位：${data.petArena.maxGrading}</p>
                        </div>
                    `;
                }
                if (data.skyWar) {
                    arenaHtml += `
                        <div class="sky-war-info">
                            <h4>天空战场</h4>
                            <p>排名：${data.skyWar.rank}</p>
                            <p>段位：${data.skyWar.grading}</p>
                            <p>最高段位：${data.skyWar.maxGrading}</p>
                            <p>分数：${data.skyWar.score}</p>
                            <p>胜率：${data.skyWar.winRto}</p>
                            <p>连胜：${data.skyWar.winStreak}</p>
                            <p>总胜场：${data.skyWar.totalSucc}</p>
                            <p>总败场：${data.skyWar.totalFail}</p>
                        </div>
                    `;
                }
            } else {
                arenaHtml += '<p>暂无竞技场信息</p>';
            }
            arenaHtml += '</div>';
            arenaPane.innerHTML = arenaHtml;

            // 显示装备信息
            const equipmentPane = document.getElementById('equipment');
            let equipmentHtml = '<div class="info-section"><h3>装备信息</h3>';
            if (data.hero && data.hero.equipments) {
                for (const [slot, equip] of Object.entries(data.hero.equipments)) {
                    equipmentHtml += `
                        <div class="equipment-item">
                            <h4>${slot}</h4>
                            <p>ID：${equip.data ? equip.data.id : '未知'}</p>
                            <p>等级：${equip.lv || '0'}</p>
                            <p>经验：${equip.exp || '0'}</p>
                            <p>基础属性：${equip.data && equip.data.attr ? JSON.stringify(equip.data.attr) : '无'}</p>
                            <p>附加属性：${equip.data && equip.data.affixAttr ? JSON.stringify(equip.data.affixAttr) : '无'}</p>
                            <p>获得时间：${equip.data ? new Date(equip.data.getTime).toLocaleString() : '未知'}</p>
                        </div>
                    `;
                }
            } else {
                equipmentHtml += '<p>暂无装备信息</p>';
            }
            equipmentHtml += '</div>';
            equipmentPane.innerHTML = equipmentHtml;

            // 显示技能信息
            const skillsPane = document.getElementById('skills');
            let skillsHtml = '<div class="info-section"><h3>技能信息</h3>';
            if (data.hero && data.hero.skillPages) {
                // 主动技能页
                if (data.hero.skillPages.pages) {
                    skillsHtml += '<div class="skill-category"><h4>主动技能</h4>';
                    data.hero.skillPages.pages.forEach((page, index) => {
                        skillsHtml += `<div class="skill-page"><h5>技能页 ${index + 1}</h5>`;
                        if (page.skills) {
                            page.skills.forEach(skill => {
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p>技能ID：${skill.id}</p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            });
                        }
                        // 化妆技能
                        if (page.makeupSkillIds) {
                            skillsHtml += '<h5>化妆技能</h5>';
                            page.makeupSkillIds.forEach(skill => {
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p>技能ID：${skill.id}</p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            });
                        }
                        skillsHtml += '</div>';
                    });
                    skillsHtml += '</div>';
                }

                // 被动技能页
                if (data.hero.passiveSkillPages && data.hero.passiveSkillPages.pages) {
                    skillsHtml += '<div class="skill-category"><h4>被动技能</h4>';
                    data.hero.passiveSkillPages.pages.forEach((page, index) => {
                        skillsHtml += `<div class="skill-page"><h5>被动页 ${index + 1}</h5>`;
                        if (page.passiveSkills && page.passiveSkills.length > 0) {
                            page.passiveSkills.forEach(skill => {
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p>技能ID：${skill.id}</p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            });
                        } else {
                            skillsHtml += '<p>暂无被动技能</p>';
                        }
                        skillsHtml += '</div>';
                    });
                    skillsHtml += '</div>';
                }

                // 觉醒技能
                if (data.hero.awakenSkills && Object.keys(data.hero.awakenSkills).length > 0) {
                    skillsHtml += '<div class="skill-category"><h4>觉醒技能</h4>';
                    Object.entries(data.hero.awakenSkills).forEach(([id, skill]) => {
                        skillsHtml += `
                            <div class="skill-item">
                                <p>技能ID：${id}</p>
                                <p>等级：${skill.lv || '0'}</p>
                            </div>
                        `;
                    });
                    skillsHtml += '</div>';
                }

                // 额外技能
                if (data.hero.exSkills && Object.keys(data.hero.exSkills).length > 0) {
                    skillsHtml += '<div class="skill-category"><h4>额外技能</h4>';
                    Object.entries(data.hero.exSkills).forEach(([id, skill]) => {
                        skillsHtml += `
                            <div class="skill-item">
                                <p>技能ID：${id}</p>
                                <p>等级：${skill.lv || '0'}</p>
                            </div>
                        `;
                    });
                    skillsHtml += '</div>';
                }
            } else {
                skillsHtml += '<p>暂无技能信息</p>';
            }
            skillsHtml += '</div>';
            skillsPane.innerHTML = skillsHtml;

            // 显示内丹信息
            const neidanPane = document.getElementById('neidan');
            let neidanHtml = '<div class="info-section"><h3>内丹信息</h3>';
            if (data.hero && data.hero.neiDanList && data.hero.neiDanList.pages) {
                data.hero.neiDanList.pages.forEach((page, index) => {
                    neidanHtml += `
                        <div class="neidan-page">
                            <h4>${page.name || `内丹页 ${index + 1}`}</h4>
                            <p>阴气：${page.yin || '0'}</p>
                            <p>阳气：${page.yang || '0'}</p>
                            ${page.danqi && page.danqi.length > 0 ? `
                                <div class="danqi-list">
                                    <h5>丹气</h5>
                                    ${page.danqi.map(dq => `
                                        <div class="danqi-item">
                                            <p>ID：${dq.id}</p>
                                            <p>类型：${dq.type || '未知'}</p>
                                            ${dq.attr ? `<p>属性：${JSON.stringify(dq.attr)}</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
            } else {
                neidanHtml += '<p>暂无内丹信息</p>';
            }
            neidanHtml += '</div>';
            neidanPane.innerHTML = neidanHtml;

            // 显示羽毛信息
            const feathersPane = document.getElementById('feathers');
            let feathersHtml = '<div class="info-section"><h3>羽毛信息</h3>';
            if (data.hero && data.hero.feathers && data.hero.feathers.length > 0) {
                data.hero.feathers.forEach(feather => {
                    feathersHtml += `
                        <div class="feather-item">
                            <p>ID：${feather.id}</p>
                            <p>属性：${feather.attr ? JSON.stringify(feather.attr) : '无'}</p>
                            <p>战斗力：${feather.fightpoint || '0'}</p>
                        </div>
                    `;
                });
            } else {
                feathersHtml += '<p>暂无羽毛信息</p>';
            }
            feathersHtml += '</div>';
            feathersPane.innerHTML = feathersHtml;

            // 显示法宝信息
            const magicsPane = document.getElementById('magics');
            let magicsHtml = '<div class="info-section"><h3>法宝信息</h3>';
            if (data.magics && data.magics.length > 0) {
                data.magics.forEach(magic => {
                    magicsHtml += `
                        <div class="magic-item">
                            <p>ID：${magic.id}</p>
                            <p>等级：${magic.lv || '0'}</p>
                            <p>成长：${magic.growth || '0'}</p>
                            ${magic.blessing ? `<p>祝福：${magic.blessing.join(', ')}</p>` : ''}
                        </div>
                    `;
                });
            } else {
                magicsHtml += '<p>暂无法宝信息</p>';
            }
            magicsHtml += '</div>';
            magicsPane.innerHTML = magicsHtml;

            // 显示翅膀信息
            const wingbagPane = document.getElementById('wingbag');
            let wingbagHtml = '<div class="info-section"><h3>翅膀信息</h3>';
            if (data.wingBag && data.wingBag.length > 0) {
                wingbagHtml += '<div class="fashion-list">';
                data.wingBag.forEach(wing => {
                    wingbagHtml += `
                        <div class="fashion-item">
                            <p>ID：${wing.id}</p>
                            <p>等级：${wing.lv || '0'}</p>
                            <p>经验：${wing.exp || '0'}</p>
                            ${wing.attr ? `<p>属性：${JSON.stringify(wing.attr)}</p>` : ''}
                        </div>
                    `;
                });
                wingbagHtml += '</div>';
            } else {
                wingbagHtml += '<p>暂无翅膀信息</p>';
            }
            wingbagHtml += '</div>';
            wingbagPane.innerHTML = wingbagHtml;

            // 显示宠物信息
            const petPane = document.getElementById('pet');
            let petHtml = '<div class="info-section"><h3>宠物信息</h3>';
            if (data.pet) {
                petHtml += `
                    <div class="pet-info">
                        <h4>基本信息</h4>
                        <p>宠物数量：${data.petNum || '0'}</p>
                        ${data.pet.id ? `<p>宠物ID：${data.pet.id}</p>` : ''}
                        ${data.pet.name ? `<p>名称：${data.pet.name}</p>` : ''}
                        ${data.pet.star ? `<p>星级：${data.pet.star}</p>` : ''}
                        ${data.pet.lv ? `<p>等级：${data.pet.lv}</p>` : ''}
                        ${data.pet.exp ? `<p>经验：${data.pet.exp}</p>` : ''}
                        ${data.pet.nextLvExp ? `<p>升级所需经验：${data.pet.nextLvExp}</p>` : ''}
                        ${data.pet.pos ? `<p>位置：${data.pet.pos}</p>` : ''}
                        ${data.pet.mood ? `<p>心情：${data.pet.mood}</p>` : ''}
                        ${data.pet.energy ? `<p>能量：${data.pet.energy}</p>` : ''}
                        ${data.pet.energyAdd ? `<p>能量增加：${data.pet.energyAdd}</p>` : ''}
                        ${data.pet.fightpoint ? `<p>战斗力：${data.pet.fightpoint}</p>` : ''}
                        ${data.pet.expireTime ? `<p>过期时间：${data.pet.expireTime === -1 ? '永久' : new Date(data.pet.expireTime).toLocaleString()}</p>` : ''}
                    </div>
                `;

                // 显示宠物品质
                if (data.pet.strQuality || data.pet.vitQuality || data.pet.luckQuality || data.pet.dexQuality) {
                    petHtml += `
                        <div class="pet-quality">
                            <h4>宠物品质</h4>
                            ${data.pet.strQuality ? `<p>力量品质：${data.pet.strQuality}</p>` : ''}
                            ${data.pet.vitQuality ? `<p>体力品质：${data.pet.vitQuality}</p>` : ''}
                            ${data.pet.luckQuality ? `<p>幸运品质：${data.pet.luckQuality}</p>` : ''}
                            ${data.pet.dexQuality ? `<p>敏捷品质：${data.pet.dexQuality}</p>` : ''}
                        </div>
                    `;
                }

                // 显示宠物主动技能
                if (data.pet.skillActive && data.pet.skillActive.length > 0) {
                    petHtml += `
                        <div class="pet-skills">
                            <h4>主动技能</h4>
                            ${data.pet.skillActive.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示宠物被动技能
                if (data.pet.skillPassive && data.pet.skillPassive.length > 0) {
                    petHtml += `
                        <div class="pet-skills">
                            <h4>被动技能</h4>
                            ${data.pet.skillPassive.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示宠物特殊技能
                if (data.pet.skillSp && data.pet.skillSp.length > 0) {
                    petHtml += `
                        <div class="pet-skills">
                            <h4>特殊技能</h4>
                            ${data.pet.skillSp.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示宠物装备
                if (data.pet.equipments) {
                    petHtml += `
                        <div class="pet-equips">
                            <h4>宠物装备</h4>
                            ${Object.entries(data.pet.equipments).map(([slot, equip]) => `
                                <div class="equipment-item">
                                    <h5>${slot}</h5>
                                    <p>装备ID：${equip.id || '未知'}</p>
                                    <p>等级：${equip.lv || '0'}</p>
                                    <p>经验：${equip.exp || '0'}</p>
                                    <p>部位：${equip.part || '未知'}</p>
                                    <p>类型：${equip.itemType || '未知'}</p>
                                    ${equip.attr ? `
                                        <div class="attributes">
                                            <h6>基础属性：</h6>
                                            ${Object.entries(equip.attr).map(([key, value]) => `
                                                <p>${key}: ${value}</p>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    ${equip.affixAttr ? `
                                        <div class="attributes">
                                            <h6>词缀属性：</h6>
                                            ${Object.entries(equip.affixAttr).map(([key, value]) => `
                                                <p>${key}: ${value}</p>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    ${equip.affixAttrPer ? `
                                        <div class="attributes">
                                            <h6>词缀属性百分比：</h6>
                                            ${Object.entries(equip.affixAttrPer).map(([key, value]) => `
                                                <p>${key}: ${(value * 100).toFixed(2)}%</p>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    <p>获得时间：${equip.getTime ? new Date(equip.getTime).toLocaleString() : '未知'}</p>
                                    ${equip.affixLv ? `<p>词缀等级：${equip.affixLv}</p>` : ''}
                                    ${equip.lock !== undefined ? `<p>锁定状态：${equip.lock ? '已锁定' : '未锁定'}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            } else {
                petHtml += '<p>暂无宠物信息</p>';
            }
            petHtml += '</div>';
            petPane.innerHTML = petHtml;

            // 显示坐骑信息
            const ridePane = document.getElementById('ride');
            let rideHtml = '<div class="info-section"><h3>坐骑信息</h3>';
            if (data.ride) {
                rideHtml += `
                    <div class="ride-info">
                        <h4>基本信息</h4>
                        <p>坐骑数量：${data.rideNum || '0'}</p>
                        ${data.ride.id ? `<p>坐骑ID：${data.ride.id}</p>` : ''}
                        ${data.ride.name ? `<p>名称：${data.ride.name}</p>` : ''}
                        ${data.ride.star ? `<p>星级：${data.ride.star}</p>` : ''}
                        ${data.ride.lv ? `<p>等级：${data.ride.lv}</p>` : ''}
                        ${data.ride.exp ? `<p>经验：${data.ride.exp}</p>` : ''}
                        ${data.ride.nextLvExp ? `<p>升级所需经验：${data.ride.nextLvExp}</p>` : ''}
                        ${data.ride.pos ? `<p>位置：${data.ride.pos}</p>` : ''}
                        ${data.ride.mood ? `<p>心情：${data.ride.mood}</p>` : ''}
                        ${data.ride.energy ? `<p>能量：${data.ride.energy}</p>` : ''}
                        ${data.ride.energyAdd ? `<p>能量增加：${data.ride.energyAdd}</p>` : ''}
                        ${data.ride.fightpoint ? `<p>战斗力：${data.ride.fightpoint}</p>` : ''}
                        ${data.ride.expireTime ? `<p>过期时间：${data.ride.expireTime === -1 ? '永久' : new Date(data.ride.expireTime).toLocaleString()}</p>` : ''}
                    </div>
                `;

                // 显示坐骑品质
                if (data.ride.strQuality || data.ride.vitQuality || data.ride.luckQuality || data.ride.dexQuality) {
                    rideHtml += `
                        <div class="ride-quality">
                            <h4>坐骑品质</h4>
                            ${data.ride.strQuality ? `<p>力量品质：${data.ride.strQuality}</p>` : ''}
                            ${data.ride.vitQuality ? `<p>体力品质：${data.ride.vitQuality}</p>` : ''}
                            ${data.ride.luckQuality ? `<p>幸运品质：${data.ride.luckQuality}</p>` : ''}
                            ${data.ride.dexQuality ? `<p>敏捷品质：${data.ride.dexQuality}</p>` : ''}
                        </div>
                    `;
                }

                // 显示坐骑主动技能
                if (data.ride.skillActive && data.ride.skillActive.length > 0) {
                    rideHtml += `
                        <div class="ride-skills">
                            <h4>主动技能</h4>
                            ${data.ride.skillActive.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示坐骑被动技能
                if (data.ride.skillPassive && data.ride.skillPassive.length > 0) {
                    rideHtml += `
                        <div class="ride-skills">
                            <h4>被动技能</h4>
                            ${data.ride.skillPassive.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示坐骑特殊技能
                if (data.ride.skillSp && data.ride.skillSp.length > 0) {
                    rideHtml += `
                        <div class="ride-skills">
                            <h4>特殊技能</h4>
                            ${data.ride.skillSp.map(skill => `
                                <div class="skill-item">
                                    <p>技能ID：${skill.id}</p>
                                    <p>等级：${skill.lv || '0'}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                // 显示坐骑装备
                if (data.ride.equips) {
                    rideHtml += `
                        <div class="ride-equips">
                            <h4>坐骑装备</h4>
                            ${Object.entries(data.ride.equips).map(([slot, equip]) => `
                                <div class="equipment-item">
                                    <h5>${slot}</h5>
                                    <p>等级：${equip.lv || '0'}</p>
                                    <p>经验：${equip.exp || '0'}</p>
                                    ${equip.data ? `
                                        <p>装备ID：${equip.data.id}</p>
                                        <p>部位：${equip.data.part}</p>
                                        <p>类型：${equip.data.itemType}</p>
                                        ${equip.data.attr ? `<p>属性：${JSON.stringify(equip.data.attr)}</p>` : ''}
                                        ${equip.data.affixAttr ? `<p>词缀属性：${JSON.stringify(equip.data.affixAttr)}</p>` : ''}
                                        ${equip.data.affixAttrPer ? `<p>词缀属性百分比：${JSON.stringify(equip.data.affixAttrPer)}</p>` : ''}
                                        ${equip.data.getTime ? `<p>获得时间：${new Date(equip.data.getTime).toLocaleString()}</p>` : ''}
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            } else {
                rideHtml += '<p>暂无坐骑信息</p>';
            }
            rideHtml += '</div>';
            ridePane.innerHTML = rideHtml;

            // 显示经脉信息
            const meridiansPane = document.getElementById('meridians');
            let meridiansHtml = '<div class="info-section"><h3>经脉信息</h3>';
            if (data.meridians && data.meridians.vein) {
                meridiansHtml += '<div class="meridians-list">';
                Object.entries(data.meridians.vein).forEach(([id, vein]) => {
                    meridiansHtml += `
                        <div class="meridian-item">
                            <h4>经脉 ${id}</h4>
                            <p>等级：${vein.level || '0'}</p>
                            <p>阶级：${vein.rank || '0'}</p>
                        </div>
                    `;
                });
                meridiansHtml += '</div>';
            } else {
                meridiansHtml += '<p>暂无经脉信息</p>';
            }
            meridiansHtml += '</div>';
            meridiansPane.innerHTML = meridiansHtml;
        } catch (error) {
            console.error('数据处理错误:', error);
            alert('数据处理出错，请稍后重试');
        }
    }
});
