const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server');
});
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('新客户端已连接');
    ws.on('message', (message) => {
        console.log(`收到消息: ${message}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(message.toString());
            }
        });
    });
    ws.on('close', () => console.log('客户端断开'));
});
server.listen(3000, () => console.log('服务器运行在 http://localhost:3000'));
