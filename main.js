const copyButton = document.getElementById('copyButton');

async function fetchPlayerInfo() {
    const uid = document.getElementById('uidInput').value.trim();
    if (!uid) {
        document.getElementById('basic').innerHTML = '<p class="error">请输入有效的UID</p>';
        openTab('basic');
        return;
    }
    document.getElementById('basic').innerHTML = '查询中...';
    openTab('basic');
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(uid);
    } else {
        document.getElementById('basic').innerHTML = '<p class="error">未连接到服务器</p>';
    }
}

document.getElementById('queryButton').addEventListener('click', fetchPlayerInfo);
document.getElementById('uidInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchPlayerInfo();
});

copyButton.addEventListener('click', () => {
    const textToCopy = infoContent.textContent;
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('已复制到剪贴板！'))
        .catch(err => alert('复制失败: ' + err));
});
