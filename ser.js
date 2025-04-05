const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('客户端已连接');

    ws.on('message', (message) => {
        // 收到网页的 UID 请求，转发给游戏页面
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('客户端已断开');
    });
});

console.log('WebSocket 服务器运行在 ws://localhost:8080');
