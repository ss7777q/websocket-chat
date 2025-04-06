import { translate } from './translations.js';
import { createTranslationManager } from './translationManager.js';
import dataApi from './dataApi.js';

// 全局WebSocket连接
let ws;

// 称号数据
const titleData = {
    "1010001": {"id":1010001,"group":1010001,"name":"vip1","resource":"vip1","level":0,"resourceType":2,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":1,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010001,"getDesc":"VIP等级达到1级"},
    "1010002": {"id":1010002,"group":1010002,"name":"vip2","resource":"vip2","level":0,"resourceType":2,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":2,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010002,"getDesc":"VIP等级达到2级"},
    "1010003": {"id":1010003,"group":1010003,"name":"vip3","resource":"vip3","level":0,"resourceType":2,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":3,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010003,"getDesc":"VIP等级达到3级"},
    "1010004": {"id":1010004,"group":1010004,"name":"vip4","resource":"vip4","resourceSp":"vip4","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":4,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010004,"getDesc":"VIP等级达到4级"},
    "1010005": {"id":1010005,"group":1010005,"name":"vip5","resource":"vip5","resourceSp":"vip5","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":5,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010005,"getDesc":"VIP等级达到5级"},
    "1010006": {"id":1010006,"group":1010006,"name":"vip6","resource":"vip6","resourceSp":"vip6","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":6,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010006,"getDesc":"VIP等级达到6级"},
    "1010007": {"id":1010007,"group":1010007,"name":"vip7","resource":"vip7","resourceSp":"vip7","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":7,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010007,"getDesc":"VIP等级达到7级"},
    "1010008": {"id":1010008,"group":1010008,"name":"vip8","resource":"vip8","resourceSp":"vip8","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":8,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010008,"getDesc":"VIP等级达到8级"},
    "1010009": {"id":1010009,"group":1010009,"name":"vip9","resource":"vip9","resourceSp":"vip9","level":0,"resourceType":1,"show":2,"showName":"特殊称号","showNameIndex":1,"index":1,"type":6,"value":9,"isAuto":1,"time":"VIP等级变更时失效","buteId":1010009,"getDesc":"VIP等级达到9级"}
};

// 辅助函数：获取属性名称
function getAttrName(attrType) {
    const attrNames = {
        "atk": "攻击",
        "def": "防御",
        "hp": "生命",
        "mp": "法力",
        "healHp": "回血",
        "healMp": "回蓝",
        "crit": "暴击",
        "tough": "韧性",
        "dodge": "闪避",
        "hit": "命中",
        "speed": "速度",
        "lucky": "幸运",
        "tenacity": "韧性",
        "guardian": "守护",
        "hitVal": "命中"
    };
    
    return attrNames[attrType] || attrType;
}

// 辅助函数：获取技能名称
function getSkillName(skillId) {
    try {
        // 尝试从window.tmp中直接读取技能名称
        // 注意：skill.js将技能数据加载到window.tmp变量中
        if (window.tmp && Array.isArray(window.tmp)) {
            // 在tmp数组中查找对应ID的技能
            const skillData = window.tmp.find(item => item && item[0] === Number(skillId));
            
            if (skillData) {
                // 技能名称通常在索引1位置
                return skillData[1] || `技能 ${skillId}`;
            }
        }
        
        // 如果找不到技能信息，返回ID
        return `技能 ${skillId}`;
    } catch (error) {
        console.error('获取技能名称出错:', error);
        return `技能 ${skillId}`;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // 初始化数据API
    console.log('开始初始化数据API...');
    const dataLoaded = await dataApi.init();
    console.log('数据API初始化结果:', dataLoaded);
    if (!dataLoaded) {
        console.error('数据文件加载失败');
        alert('数据文件加载失败，部分功能可能无法正常工作');
    }

    // 检查数据是否正确加载
    console.log('可用数据文件:', dataApi.getAvailableFiles());
    console.log('称号数据示例:', dataApi.data.title ? dataApi.data.title[0] : '无数据');

    // 初始化configData对象
    if (!window.configData) {
        window.configData = {};
    }

    // 初始化装备数据
    console.log('检查装备数据是否加载:', window.configData?.equip ? '已加载' : '未加载');
    if (!window.configData.equip) {
        console.warn('装备数据未加载，尝试手动初始化');
        initEquipData();
    }

    // 初始化用户界面组件
    const uidInput = document.getElementById('uidInput');
    const searchButton = document.getElementById('searchButton');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const infoBox = document.getElementById('infoBox');
    const infoContent = document.getElementById('infoContent');
    const closeButton = document.getElementById('closeButton');
    const copyButton = document.getElementById('copyButton');

    // 添加翻译管理器
    const translationManager = createTranslationManager();
    document.body.appendChild(translationManager);

    // 监听翻译更新事件
    window.addEventListener('translationsUpdated', () => {
        // 如果有数据，重新处理显示
        const basicPane = document.getElementById('basic');
        if (basicPane.innerHTML && !basicPane.innerHTML.includes('暂无信息')) {
            processData(window.lastData);
        }
    });

    // 初始化WebSocket连接
    function initWebSocket() {
        if (ws) {
            ws.close();
        }
        
        try {
            ws = new WebSocket('ws://localhost:3000/client');
            
            ws.onopen = () => {
                console.log('已连接到服务器');
                document.getElementById('basic').innerHTML = '<p class="success">已连接到服务器，可以开始查询</p>';
                if (searchButton) searchButton.disabled = false;
            };
            
            ws.onclose = () => {
                console.log('与服务器断开连接');
                document.getElementById('basic').innerHTML = '<p class="error">与服务器断开连接，请刷新页面重试</p>';
                if (searchButton) searchButton.disabled = true;
                // 尝试重新连接
                setTimeout(initWebSocket, 3000);
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket错误:', error);
                document.getElementById('basic').innerHTML = '<p class="error">连接错误，请检查服务器是否运行</p>';
                if (searchButton) searchButton.disabled = true;
            };
            
            ws.onmessage = (event) => {
                try {
                    console.log('收到WebSocket消息:', event.data.substring(0, 100) + '...');
                    const data = JSON.parse(event.data);
                    console.log('解析后的数据类型:', data.type);
                    
                    if (data.error) {
                        console.error('服务器返回错误:', data.message);
                        document.getElementById('basic').innerHTML = `<p class="error">${data.message}</p>`;
                        return;
                    }
                    
                    if (data.type === 'success') {
                        console.log('成功获取玩家数据, 开始处理...');
                        processData(data.data);
                        console.log('玩家数据处理完成');
                    }
                } catch (error) {
                    console.error('解析或处理WebSocket消息时出错:', error);
                    document.getElementById('basic').innerHTML = '<p class="error">数据处理错误: ' + error.message + '</p>';
                }
            };
        } catch (error) {
            console.error('WebSocket连接失败:', error);
            document.getElementById('basic').innerHTML = '<p class="error">连接失败，请检查服务器是否运行</p>';
            if (searchButton) searchButton.disabled = true;
        }
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
        console.log('开始查询玩家信息');
        const uid = uidInput.value.trim();
        if (!uid) {
            alert('请输入玩家UID');
            return;
        }

        document.getElementById('basic').innerHTML = '<p>查询中...</p>';
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('发送查询请求:', uid);
            ws.send(uid);
        } else {
            console.error('WebSocket未连接');
            document.getElementById('basic').innerHTML = '<p class="error">未连接到服务器，请刷新页面重试</p>';
        }
    }

    // 查询按钮点击事件
    if (searchButton) {
        console.log('添加查询按钮事件监听器');
        searchButton.addEventListener('click', fetchPlayerInfo);
    }

    // 回车键触发查询
    if (uidInput) {
        uidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchPlayerInfo();
            }
        });
    }

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
            // 保存最后一次的数据
            window.lastData = data;
            
            if (!data) {
                console.error('未接收到玩家数据');
                document.getElementById('basic').innerHTML = '<p class="error">未接收到玩家数据，请重试</p>';
                return;
            }
            
            console.log('接收到玩家数据，开始处理...');
            console.log('玩家UID:', data.uid);
            console.log('玩家名称:', data.name);
            
            // 显示基本信息
            const basicPane = document.getElementById('basic');
            try {
                basicPane.innerHTML = `
                    <div class="info-section">
                        <h3>${translate('basicInfo')}</h3>
                        <p>${translate('name')}：${data.name || translate('unknown')}</p>
                        <p>UID：${data.uid || translate('unknown')}</p>
                        <p>${translate('vipLevel')}：${data.vipLv || translate('unknown')}</p>
                        <p>${translate('fightpoint')}：${data.fightpoint || translate('unknown')}</p>
                        <p>${translate('ipArea')}：${data.iparea || translate('unknown')}</p>
                        <p>${translate('worldLevel')}：${data.worldLv || translate('unknown')}</p>
                        ${data.matrixId ? `<p>${translate('matrixId')}：${data.matrixId} - ${dataApi.findById('matrix', data.matrixId)?.name || translate('unknown')}</p>` : ''}
                        ${data.wingId ? `<p>${translate('wingId')}：${data.wingId} - ${dataApi.findById('wing', data.wingId)?.name || translate('unknown')}</p>` : ''}
                        ${data.fashionInfo ? `<p>${translate('fashionInfo')}：${translate('id')} ${data.fashionInfo.id} - ${dataApi.findById('fashion', data.fashionInfo.id)?.name || translate('unknown')}, ${translate('exp')} ${data.fashionInfo.exp}</p>` : ''}
                    </div>
                `;
            } catch (error) {
                console.error('基本信息处理错误:', error);
                basicPane.innerHTML = '<p class="error">基本信息处理错误: ' + error.message + '</p>';
            }

            // 处理称号信息
            console.log('玩家数据:', data);
            console.log('称号数据:', data.titles);
            console.log('称号ID:', data.titleId);

            try {
                // 在基本信息中显示当前称号
                if (data.titleId) {
                    // 尝试从不同来源获取称号信息
                    let titleInfo = null;
                    
                    // 方法1：从configData.title数组中查找
                    if (window.configData?.title && Array.isArray(window.configData.title)) {
                        const titleRow = window.configData.title.find(row => row && row[0] === data.titleId);
                        if (titleRow) {
                            titleInfo = {
                                id: titleRow[0],
                                name: titleRow[2] || `称号#${titleRow[0]}`,
                                getDesc: titleRow[22] || ''
                            };
                        }
                    } 
                    // 方法2：从dataApi.data.title对象中查找
                    else if (dataApi.data?.title && typeof dataApi.data.title === 'object') {
                        const title = dataApi.data.title[data.titleId];
                        if (title) {
                            titleInfo = {
                                id: title.id,
                                name: title.name || `称号#${title.id}`,
                                getDesc: title.getDesc || ''
                            };
                        }
                    }
                    
                    if (titleInfo) {
                        basicPane.innerHTML += `
                            <div class="info-section">
                                <h3>${translate('titles')}</h3>
                                <div class="current-title-info">
                                    <p>当前称号：${titleInfo.name}</p>
                                    ${titleInfo.getDesc ? `<p>获取方式：${titleInfo.getDesc}</p>` : ''}
                                </div>
                            </div>
                        `;
                    } else {
                        basicPane.innerHTML += `
                            <div class="info-section">
                                <h3>${translate('titles')}</h3>
                                <p>未知称号(ID: ${data.titleId})</p>
                            </div>
                        `;
                    }
                }
            } catch (error) {
                console.error('称号信息处理错误:', error);
                basicPane.innerHTML += `
                    <div class="info-section">
                        <h3>${translate('titles')}</h3>
                        <p class="error">称号信息处理错误: ${error.message}</p>
                    </div>
                `;
            }

            // 处理称号选项卡
            try {
                const titlesPane = document.getElementById('titles');
                let titlesHtml = `<div class="info-section">
                    <h3>${translate('titles')}</h3>`;

                // 显示所有称号
                if (data.titles && data.titles.list) {
                    titlesHtml += '<div class="titles-grid">';
                    
                    // 遍历所有称号
                    Object.entries(data.titles.list).forEach(([id, titleInfo]) => {
                        try {
                            // 尝试获取称号数据
                            let title = null;
                            
                            // 方法1：从configData.title数组中查找
                            if (window.configData?.title && Array.isArray(window.configData.title)) {
                                const titleRow = window.configData.title.find(row => row && row[0] === parseInt(id));
                                if (titleRow) {
                                    title = {
                                        id: titleRow[0],
                                        name: titleRow[2] || `称号#${titleRow[0]}`,
                                        getDesc: titleRow[22] || ''
                                    };
                                }
                            } 
                            // 方法2：从dataApi.data.title对象中查找
                            else if (dataApi.data?.title && typeof dataApi.data.title === 'object') {
                                const titleData = dataApi.data.title[id];
                                if (titleData) {
                                    title = {
                                        id: titleData.id,
                                        name: titleData.name || `称号#${titleData.id}`,
                                        getDesc: titleData.getDesc || ''
                                    };
                                }
                            }
                            
                            if (title) {
                                titlesHtml += `
                                    <div class="title-item ${id === data.titleId?.toString() ? 'active' : ''}">
                                        <h4>${title.name}</h4>
                                        <p>ID: ${title.id}</p>
                                        ${title.getDesc ? `<p class="title-desc">获取方式：${title.getDesc}</p>` : ''}
                                        ${titleInfo.last ? `<p class="title-time">到期时间：${new Date(titleInfo.last).toLocaleString()}</p>` : '<p class="title-time">永久</p>'}
                                        ${titleInfo.pos ? `<p class="title-pos">位置：${titleInfo.pos}</p>` : ''}
                                        ${id === data.titleId?.toString() ? '<p class="current-title">当前装备</p>' : ''}
                                    </div>
                                `;
                            } else {
                                titlesHtml += `
                                    <div class="title-item ${id === data.titleId?.toString() ? 'active' : ''}">
                                        <h4>未知称号</h4>
                                        <p>ID: ${id}</p>
                                        ${titleInfo.last ? `<p class="title-time">到期时间：${new Date(titleInfo.last).toLocaleString()}</p>` : '<p class="title-time">永久</p>'}
                                        ${titleInfo.pos ? `<p class="title-pos">位置：${titleInfo.pos}</p>` : ''}
                                        ${id === data.titleId?.toString() ? '<p class="current-title">当前装备</p>' : ''}
                                    </div>
                                `;
                            }
                        } catch (error) {
                            console.error(`处理称号ID ${id} 时出错:`, error);
                            titlesHtml += `
                                <div class="title-item">
                                    <h4>处理错误</h4>
                                    <p>ID: ${id}</p>
                                    <p class="error">此称号数据处理出错: ${error.message}</p>
                                </div>
                            `;
                        }
                    });
                    titlesHtml += '</div>';
                } else {
                    titlesHtml += '<p>暂无称号信息</p>';
                }

                titlesHtml += '</div>';
                titlesPane.innerHTML = titlesHtml;
            } catch (error) {
                console.error('称号选项卡处理错误:', error);
                document.getElementById('titles').innerHTML = '<p class="error">称号选项卡处理错误</p>';
            }

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
            let reputationHtml = '<div class="info-section"><h3>信誉分</h3>';
            if (data.reputation) {
                reputationHtml += `
                    <div class="reputation-info">
                        <p>版本：${data.reputation.ver}</p>
                        <p>信誉值：${data.reputation.val}</p>
                        <p>等级：${data.reputation.lv}</p>
                        <p>每日增加：${data.reputation.dayAdd}</p>
                    </div>
                    <div class="reputation-logs">
                        <h4>信誉记录</h4>
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
                reputationHtml += '<p>暂无信誉记录</p>';
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
                            <h4>${translate('normalArena')}</h4>
                            <p>${translate('rank')}：${data.arena.rank}</p>
                            <p>${translate('grading')}：${data.arena.grading}</p>
                            <p>${translate('maxGrading')}：${data.arena.maxGrading}</p>
                        </div>
                    `;
                }
                if (data.petArena) {
                    arenaHtml += `
                        <div class="pet-arena-info">
                            <h4>${translate('petArenaTitle')}</h4>
                            <p>${translate('rank')}：${data.petArena.rank}</p>
                            <p>${translate('grading')}：${data.petArena.grading}</p>
                            <p>${translate('maxGrading')}：${data.petArena.maxGrading}</p>
                        </div>
                    `;
                }
                if (data.skyWar) {
                    arenaHtml += `
                        <div class="sky-war-info">
                            <h4>${translate('skyWarTitle')}</h4>
                            <p>${translate('rank')}：${data.skyWar.rank}</p>
                            <p>${translate('grading')}：${data.skyWar.grading}</p>
                            <p>${translate('maxGrading')}：${data.skyWar.maxGrading}</p>
                            <p>${translate('score')}：${data.skyWar.score}</p>
                            <p>${translate('winRate')}：${data.skyWar.winRto}%</p>
                            <p>${translate('winStreak')}：${data.skyWar.winStreak}</p>
                            <p>${translate('totalWins')}：${data.skyWar.totalSucc}</p>
                            <p>${translate('totalLosses')}：${data.skyWar.totalFail}</p>
                        </div>
                    `;
                }
            } else {
                arenaHtml += '<p>暂无竞技场信息</p>';
            }
            arenaHtml += '</div>';
            arenaPane.innerHTML = arenaHtml;

            // 显示装备信息
            processEquipment(data);

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
                                const skillName = getSkillName(skill.id);
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            });
                        }
                        // 无双技能
                        if (page.makeupSkillIds) {
                            skillsHtml += '<h5>无双技能</h5>';
                            page.makeupSkillIds.forEach(skill => {
                                const skillName = getSkillName(skill.id);
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
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
                            page.passiveSkills.forEach(skillId => {
                                const skillName = getSkillName(skillId);
                                skillsHtml += `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skillId})</span></p>
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
                    Object.entries(data.hero.awakenSkills).forEach(([baseSkillId, skills]) => {
                        // 检查skills是否为数组，如果是数组则获取第二个元素，否则使用整个值
                        const baseSkillName = getSkillName(baseSkillId);
                        let awakenedSkillId;
                        if (Array.isArray(skills)) {
                            awakenedSkillId = skills[1] || skills[0];
                        } else {
                            awakenedSkillId = skills;
                        }
                        const awakenSkillName = getSkillName(awakenedSkillId);
                        
                        skillsHtml += `
                            <div class="skill-item">
                                <p>基础技能：<span class="skill-name">${baseSkillName}</span> <span class="skill-id">(ID: ${baseSkillId})</span></p>
                                <p>觉醒为：<span class="skill-name">${awakenSkillName}</span> <span class="skill-id">(ID: ${awakenedSkillId})</span></p>
                            </div>
                        `;
                    });
                    skillsHtml += '</div>';
                }

                // 额外技能
                if (data.hero.exSkills && Object.keys(data.hero.exSkills).length > 0) {
                    skillsHtml += '<div class="skill-category"><h4>额外技能</h4>';
                    Object.entries(data.hero.exSkills).forEach(([id, skill]) => {
                        const skillName = getSkillName(id);
                        skillsHtml += `
                            <div class="skill-item">
                                <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${id})</span></p>
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
                            ${data.pet.skillActive.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示宠物被动技能
                if (data.pet.skillPassive && data.pet.skillPassive.length > 0) {
                    petHtml += `
                        <div class="pet-skills">
                            <h4>被动技能</h4>
                            ${data.pet.skillPassive.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示宠物特殊技能
                if (data.pet.skillSp && data.pet.skillSp.length > 0) {
                    petHtml += `
                        <div class="pet-skills">
                            <h4>特殊技能</h4>
                            ${data.pet.skillSp.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示宠物装备
                if (data.pet.equipments) {
                    petHtml += `
                        <div class="pet-equips">
                            <h4>${translate('pet_equipment')}</h4>
                            ${Object.entries(data.pet.equipments).map(([slot, equip]) => {
                                const skillName = getSkillName(equip.id);
                                return `
                                    <div class="equipment-item">
                                        <h5>${translate('pet_' + slot)}</h5>
                                        <p>${translate('id')}：${skillName}</p>
                                        <p>${translate('level')}：${equip.lv || '0'}</p>
                                        <p>${translate('exp')}：${equip.exp || '0'}</p>
                                        <p>${translate('part')}：${equip.part || translate('unknown')}</p>
                                        <p>${translate('itemType')}：${equip.itemType || translate('unknown')}</p>
                                        ${equip.attr ? `
                                            <div class="attributes">
                                                <h6>${translate('baseAttr')}：</h6>
                                                ${Object.entries(equip.attr).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${value}</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        ${equip.affixAttr ? `
                                            <div class="attributes">
                                                <h6>${translate('affixAttr')}：</h6>
                                                ${Object.entries(equip.affixAttr).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${value}</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        ${equip.affixAttrPer ? `
                                            <div class="attributes">
                                                <h6>${translate('affixAttrPer')}：</h6>
                                                ${Object.entries(equip.affixAttrPer).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${(value * 100).toFixed(2)}%</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        <p class="equip-time"><span>获得时间：</span>${equip.getTime ? new Date(equip.getTime).toLocaleString() : translate('unknown')}</p>
                                        ${equip.affixLv ? `<p class="affix-level"><span>词缀等级：</span>${equip.affixLv}</p>` : ''}
                                        ${equip.lock !== undefined ? `<p class="lock-status"><span>锁定状态：</span>${equip.lock ? translate('locked') : translate('unlocked')}</p>` : ''}
                                    </div>
                                `;
                            }).join('')}
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
                            ${data.ride.skillActive.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示坐骑被动技能
                if (data.ride.skillPassive && data.ride.skillPassive.length > 0) {
                    rideHtml += `
                        <div class="ride-skills">
                            <h4>被动技能</h4>
                            ${data.ride.skillPassive.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示坐骑特殊技能
                if (data.ride.skillSp && data.ride.skillSp.length > 0) {
                    rideHtml += `
                        <div class="ride-skills">
                            <h4>特殊技能</h4>
                            ${data.ride.skillSp.map(skill => {
                                const skillName = getSkillName(skill.id);
                                return `
                                    <div class="skill-item">
                                        <p><span class="skill-name">${skillName}</span> <span class="skill-id">(ID: ${skill.id})</span></p>
                                        <p>等级：${skill.lv || '0'}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // 显示坐骑装备
                if (data.ride.equipments) {
                    rideHtml += `
                        <div class="ride-equips">
                            <h4>${translate('ride_equipment')}</h4>
                            ${Object.entries(data.ride.equipments).map(([slot, equip]) => {
                                const skillName = getSkillName(equip.id);
                                return `
                                    <div class="equipment-item">
                                        <h5>${translate('ride_' + slot)}</h5>
                                        <p>${translate('id')}：${skillName}</p>
                                        <p>${translate('level')}：${equip.lv || '0'}</p>
                                        <p>${translate('exp')}：${equip.exp || '0'}</p>
                                        <p>${translate('part')}：${equip.part || translate('unknown')}</p>
                                        <p>${translate('itemType')}：${equip.itemType || translate('unknown')}</p>
                                        ${equip.attr ? `
                                            <div class="attributes">
                                                <h6>${translate('baseAttr')}：</h6>
                                                ${Object.entries(equip.attr).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${value}</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        ${equip.affixAttr ? `
                                            <div class="attributes">
                                                <h6>${translate('affixAttr')}：</h6>
                                                ${Object.entries(equip.affixAttr).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${value}</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        ${equip.affixAttrPer ? `
                                            <div class="attributes">
                                                <h6>${translate('affixAttrPer')}：</h6>
                                                ${Object.entries(equip.affixAttrPer).map(([key, value]) => `
                                                    <p class="${key}">${translate(key)}：${(value * 100).toFixed(2)}%</p>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                        <p class="equip-time"><span>获得时间：</span>${equip.getTime ? new Date(equip.getTime).toLocaleString() : translate('unknown')}</p>
                                        ${equip.affixLv ? `<p class="affix-level"><span>词缀等级：</span>${equip.affixLv}</p>` : ''}
                                        ${equip.lock !== undefined ? `<p class="lock-status"><span>锁定状态：</span>${equip.lock ? translate('locked') : translate('unlocked')}</p>` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }
            } else {
                rideHtml += '<p>暂无坐骑信息</p>';
            }
            rideHtml += '</div>';
            ridePane.innerHTML = rideHtml;
        } catch (error) {
            console.error('数据处理错误:', error);
            document.getElementById('basic').innerHTML = '<p class="error">数据处理错误</p>';
        }
    }

    // 调试全局变量
    debugGlobalVariables();
    
    // 只显示基础欢迎信息，等待用户查询
    const basicPane = document.getElementById('basic');
    basicPane.innerHTML = '<p class="welcome">欢迎使用角色信息查询工具，请输入UID进行查询</p>';
});

// 调试全局变量
function debugGlobalVariables() {
    try {
        console.log('========== 调试全局变量 ==========');
        console.log('window.tmp存在:', window.tmp ? '是' : '否');
        if (window.tmp) {
            console.log('window.tmp类型:', Array.isArray(window.tmp) ? '数组' : typeof window.tmp);
            console.log('window.tmp长度:', Array.isArray(window.tmp) ? window.tmp.length : Object.keys(window.tmp).length);
            console.log('window.tmp示例:', window.tmp[0]);
        }
        
        console.log('window.configData存在:', window.configData ? '是' : '否');
        if (window.configData) {
            console.log('configData包含的键:', Object.keys(window.configData).join(', '));
            
            if (window.configData.equip) {
                console.log('configData.equip类型:', Array.isArray(window.configData.equip) ? '数组' : typeof window.configData.equip);
                console.log('configData.equip长度:', Array.isArray(window.configData.equip) ? window.configData.equip.length : Object.keys(window.configData.equip).length);
            }
            
            if (window.configData.title) {
                console.log('configData.title类型:', Array.isArray(window.configData.title) ? '数组' : typeof window.configData.title);
                console.log('configData.title长度:', Array.isArray(window.configData.title) ? window.configData.title.length : Object.keys(window.configData.title).length);
            }
        }
        
        // 查找所有可能包含装备数据的全局变量
        console.log('尝试寻找所有可能包含装备数据的全局变量');
        const globalVars = ['equip', 'equipment', 'equipData', 'equipmentData', 'equips', 'equipments'];
        globalVars.forEach(name => {
            if (window[name]) {
                console.log(`找到可能的装备数据变量: window.${name}`);
                console.log(`window.${name}类型:`, Array.isArray(window[name]) ? '数组' : typeof window[name]);
                console.log(`window.${name}内容示例:`, window[name]);
            }
        });
        
        // 检查script标签加载
        const equipScript = document.querySelector('script[src*="equip"]');
        if (equipScript) {
            console.log('找到装备数据脚本标签:', equipScript.src);
            console.log('脚本加载状态:', equipScript.complete ? '已完成' : '加载中');
        } else {
            console.log('未找到装备数据脚本标签');
        }
        
        console.log('========== 调试结束 ==========');
    } catch (error) {
        console.error('调试全局变量时出错:', error);
    }
}

// 初始化装备数据
function initEquipData() {
    try {
        console.log('开始手动初始化装备数据');
        
        // 检查configData对象是否存在
        if (!window.configData) {
            window.configData = {};
            console.log('创建了configData对象');
        }
        
        // 检查是否已有equip数据
        if (window.configData.equip) {
            console.log('装备数据已存在，长度:', window.configData.equip.length);
            return;
        }
        
        // 尝试从全局变量中获取装备数据
        if (window.tmp) {
            console.log('从全局变量tmp中获取装备数据');
            window.configData.equip = window.tmp;
            console.log('装备数据加载成功，长度:', window.configData.equip.length);
            return;
        }
        
        // 如果找不到数据，创建一个空数组
        window.configData.equip = [];
        console.warn('找不到装备数据，创建了空数组');
    } catch (error) {
        console.error('初始化装备数据时出错:', error);
    }
}

// 获取装备数据
function getEquipData(equipId) {
    if (!equipId) return null;
    
    // 转换为数字
    const numId = parseInt(equipId, 10);
    if (isNaN(numId)) return null;
    
    try {
        // 从configData.equip中查找
        if (window.configData?.equip) {
            console.log(`尝试在configData.equip中查找装备ID: ${numId}`);
            
            // 方法1：直接索引查找
            if (Array.isArray(window.configData.equip) && window.configData.equip[numId]) {
                console.log(`通过直接索引找到装备: ${window.configData.equip[numId][1]}`);
                return window.configData.equip[numId];
            }
            
            // 方法2：遍历查找
            const equipData = window.configData.equip.find(item => item && item[0] === numId);
            if (equipData) {
                console.log(`通过遍历找到装备: ${equipData[1]}`);
                return equipData;
            }
            
            // 方法3：遍历所有项（不区分数组或对象）
            for (const key in window.configData.equip) {
                const item = window.configData.equip[key];
                if (item && item[0] === numId) {
                    console.log(`通过循环找到装备: ${item[1]}`);
                    return item;
                }
            }
            
            console.log(`未找到装备ID ${numId} 的数据`);
        } else {
            console.warn('configData.equip不存在，无法查找装备');
        }
        
        return null;
    } catch (error) {
        console.error(`获取装备ID ${numId} 的数据时出错:`, error);
        return null;
    }
}

// 显示装备信息
function processEquipment(data) {
    try {
        console.log('处理装备信息开始');
        
        const equipmentPane = document.getElementById('equipment');
        let equipmentHtml = '<div class="info-section"><h3>装备信息</h3>';
        
        // 检查是否有英雄装备数据
        if (data.hero && data.hero.equipments) {
            console.log('发现英雄装备数据:', data.hero.equipments);
            equipmentHtml += '<div class="equipment-grid">';
            
            // 装备位置名称映射
            const slotNames = {
                'weapon': '武器',
                'head': '头盔',
                'hand': '护腕',
                'armor': '衣服',
                'foot': '鞋子',
                'jewelry': '饰品'
            };
            
            // 装备品质映射
            const qualityNames = {
                1: '白色',
                2: '绿色',
                3: '蓝色',
                4: '紫色',
                5: '橙色',
                6: '红色'
            };
            
            // 查找装备名称
            function getEquipName(equipId) {
                // 尝试从configData.equip中查找装备信息
                if (window.configData?.equip && Array.isArray(window.configData.equip)) {
                    // 先尝试直接索引
                    if (window.configData.equip[equipId]) {
                        return window.configData.equip[equipId][1] || `装备#${equipId}`;
                    }
                    
                    // 再尝试遍历查找
                    for (const equip of window.configData.equip) {
                        if (equip && equip[0] === equipId) {
                            return equip[1] || `装备#${equipId}`;
                        }
                    }
                }
                
                // 尝试从tmp中查找
                if (window.tmp && Array.isArray(window.tmp)) {
                    for (const equip of window.tmp) {
                        if (equip && equip[0] === equipId) {
                            return equip[1] || `装备#${equipId}`;
                        }
                    }
                }
                
                // 没找到就返回ID
                return `装备#${equipId}`;
            }
            
            // 推测装备品质的函数
            function getEquipQuality(equip) {
                // 通过ID或其他属性推测品质
                if (equip.id >= 8060000) return 6; // 红色
                if (equip.id >= 8050000) return 5; // 橙色
                if (equip.id >= 8040000) return 4; // 紫色
                if (equip.id >= 8030000) return 3; // 蓝色
                if (equip.id >= 8020000) return 2; // 绿色
                return 1; // 白色
            }
            
            // 遍历所有装备槽位
            for (const [slot, equipInfo] of Object.entries(data.hero.equipments)) {
                try {
                    if (!equipInfo || !equipInfo.data) {
                        console.log(`装备槽位 ${slot} 没有有效数据，跳过`);
                        continue;
                    }
                    
                    const slotName = slotNames[slot] || slot;
                    const equip = equipInfo.data;
                    console.log(`处理装备槽位: ${slot}`, equip);
                    
                    // 获取装备品质
                    const quality = getEquipQuality(equip);
                    const qualityName = qualityNames[quality] || '未知';
                    
                    // 获取装备名称
                    const equipName = getEquipName(equip.id);
                    
                    // 构建装备HTML
                    let equipHtml = `
                        <div class="equipment-item has-equip quality-${quality - 1}">
                            <h4>${slotName} - ${equipName}</h4>
                            <div class="equip-basic-info">
                                <p><span>ID：</span>${equip.id}</p>
                                <p><span>等级：</span>${equipInfo.lv || 0}</p>
                                <p><span>位置：</span>${slotName}</p>
                                <p><span>品质：</span>${qualityName}</p>
                            </div>
                    `;
                    
                    // 添加基础属性
                    if (equip.attr && Object.keys(equip.attr).length > 0) {
                        equipHtml += `<div class="equip-attrs"><h5>基础属性</h5>`;
                        for (const [attrName, attrValue] of Object.entries(equip.attr)) {
                            const displayName = getAttrName(attrName);
                            
                            // 检查是否有百分比属性
                            const perValue = equip.attrPer?.[attrName];
                            const perText = perValue !== undefined ? ` +${(perValue * 100).toFixed(1)}%` : '';
                            
                            equipHtml += `<p class="${attrName}"><span>${displayName}：</span>${attrValue}${perText}</p>`;
                        }
                        equipHtml += `</div>`;
                    }
                    
                    // 添加词缀属性
                    if (equip.affixAttr && Object.keys(equip.affixAttr).length > 0) {
                        equipHtml += `<div class="equip-affix"><h5>词缀属性</h5>`;
                        for (const [attrName, attrValue] of Object.entries(equip.affixAttr)) {
                            const displayName = getAttrName(attrName);
                            const valueClass = attrValue < 0 ? 'negative' : '';
                            
                            // 检查是否有百分比属性
                            const perValue = equip.affixAttrPer?.[attrName];
                            const perText = perValue !== undefined ? ` +${(perValue * 100).toFixed(1)}%` : '';
                            
                            equipHtml += `<p class="${attrName} ${valueClass}"><span>${displayName}：</span>${attrValue}${perText}</p>`;
                        }
                        equipHtml += `</div>`;
                    }
                    
                    // 添加宝石信息
                    if (equipInfo.stone && equipInfo.stone.length > 0) {
                        equipHtml += `<div class="equip-stones"><h5>镶嵌宝石</h5>`;
                        equipHtml += `<p><span>宝石数量：</span>${equipInfo.stone.length}</p>`;
                        equipHtml += `<p><span>宝石ID：</span>${equipInfo.stone.join(', ')}</p>`;
                        equipHtml += `</div>`;
                    }
                    
                    // 添加获得时间
                    if (equip.getTime) {
                        const equipTime = new Date(equip.getTime).toLocaleString();
                        equipHtml += `<p class="equip-time"><span>获得时间：</span>${equipTime}</p>`;
                    }
                    
                    // 添加锁定状态和词缀等级
                    let extraInfoHtml = '';
                    if (equip.lock !== undefined) {
                        extraInfoHtml += `<span>锁定: ${equip.lock ? '已锁定' : '未锁定'}</span> | `;
                    }
                    if (equip.affixLv) {
                        extraInfoHtml += `<span>词缀等级: ${equip.affixLv}</span> | `;
                    }
                    if (equip.hole) {
                        extraInfoHtml += `<span>孔数: ${equip.hole}</span>`;
                    }
                    
                    if (extraInfoHtml) {
                        equipHtml += `<p class="equip-extra-info">${extraInfoHtml}</p>`;
                    }
                    
                    equipHtml += `</div>`;
                    equipmentHtml += equipHtml;
                } catch (err) {
                    console.error(`处理装备槽位 ${slot} 时出错:`, err);
                    equipmentHtml += `
                        <div class="equipment-item error">
                            <h4>装备位置: ${slotNames[slot] || slot}</h4>
                            <p class="error-message">加载错误: ${err.message}</p>
                        </div>
                    `;
                }
            }
            
            equipmentHtml += '</div>';
        } else {
            console.log('未找到英雄装备数据');
            equipmentHtml += '<p>暂无装备信息</p>';
        }
        
        equipmentHtml += '</div>';
        equipmentPane.innerHTML = equipmentHtml;
        console.log('处理装备信息完成');
    } catch (error) {
        console.error('显示装备信息时出错:', error);
        const equipmentPane = document.getElementById('equipment');
        if (equipmentPane) {
            equipmentPane.innerHTML = `<div class="info-section"><h3>装备信息</h3><p class="error-message">加载装备信息时出错: ${error.message}</p></div>`;
        }
    }
}