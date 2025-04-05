const publicHost = "7652-111-16-245-236.ngrok-free.app";

const ws = new WebSocket(`wss://${publicHost}/client`);
const resultsDiv = document.getElementById('results');
const infoBox = document.getElementById('infoBox');
const infoContent = document.getElementById('infoContent');

ws.onopen = () => {
    resultsDiv.innerHTML = `
        <div class="tab">
            <button class="tab-btn" onclick="openTab('basic')">基本信息</button>
            <button class="tab-btn" onclick="openTab('titles')">称号</button>
            <button class="tab-btn" onclick="openTab('wingbag')">翅膀</button>
            <button class="tab-btn" onclick="openTab('pet')">宠物</button>
            <button class="tab-btn" onclick="openTab('ride')">坐骑</button>
            <button class="tab-btn" onclick="openTab('feathers')">羽毛</button>
            <button class="tab-btn" onclick="openTab('meridians')">内丹</button>
        </div>
        <div id="basic" class="tab-content active">已连接到服务器，请输入UID查询</div>
        <div id="titles" class="tab-content"></div>
        <div id="wingbag" class="tab-content"></div>
        <div id="pet" class="tab-content"></div>
        <div id="ride" class="tab-content"></div>
        <div id="feathers" class="tab-content"></div>
        <div id="meridians" class="tab-content"></div>
    `;
};

ws.onmessage = (event) => {
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => processData(reader.result);
        reader.onerror = () => {
            document.getElementById('basic').innerHTML = '<p class="error">读取数据失败</p>';
            openTab('basic');
            infoBox.style.display = 'none';
        };
        reader.readAsText(event.data);
    } else {
        processData(event.data);
    }
};

ws.onerror = (error) => {
    document.getElementById('basic').innerHTML = '<p class="error">连接错误，请检查服务器</p>';
    openTab('basic');
    infoBox.style.display = 'none';
};

ws.onclose = () => {
    document.getElementById('basic').innerHTML = '<p class="error">连接已关闭</p>';
    openTab('basic');
    infoBox.style.display = 'none';
};
