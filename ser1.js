const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ======== 配置项 ========
const PORT = 3000;
const STATIC_DIR = '.'; // 静态文件目录(与index.html同级)
const GAME_WSS_PATH = '/game-relay'; // 油猴脚本专用连接路径
const CLIENT_WSS_PATH = '/client';   // 前端网页连接路径

// ======== HTTP服务器 ========
const server = http.createServer((req, res) => {
  // 处理静态文件请求
  const filePath = path.join(__dirname, STATIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();

  // MIME类型映射
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    }
  });
});

// ======== 双路WebSocket服务 ========
const wssGame = new WebSocket.Server({ noServer: true });  // 油猴脚本连接池
const wssClient = new WebSocket.Server({ noServer: true }); // 用户连接池

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;

  // 路由到不同WebSocket服务
  if (pathname === GAME_WSS_PATH) {
    wssGame.handleUpgrade(request, socket, head, (ws) => {
      wssGame.emit('connection', ws, request);
    });
  } else if (pathname === CLIENT_WSS_PATH) {
    wssClient.handleUpgrade(request, socket, head, (ws) => {
      wssClient.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// ======== 油猴脚本连接管理 ========
wssGame.on('connection', (ws) => {
  console.log('💻 油猴脚本已连接');

  ws.on('message', (message) => {
    console.log('⬅️ 收到游戏端数据:', message.toString());
    // 广播给所有用户端
    wssClient.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => console.log('💻 油猴脚本断开连接'));
});

// ======== 用户端连接管理 ========
wssClient.on('connection', (ws) => {
  console.log('🌐 新用户已连接');

  ws.on('message', (message) => {
    console.log('↔️ 转发用户请求:', message.toString());
    // 转发给油猴脚本
    if (wssGame.clients.size > 0) {
      wssGame.clients.forEach(game => game.send(message.toString()));
    } else {
      ws.send(JSON.stringify({ 
        error: true,
        message: '游戏服务暂不可用，请稍后重试' 
      }));
    }
  });

  ws.on('close', () => console.log('🌐 用户断开连接'));
});

// ======== 启动服务 ========
server.listen(PORT, () => {
  console.log(`\n🏃 服务器运行中 (端口: ${PORT})`);
  console.log(`💻 油猴脚本连接地址: ws://localhost:${PORT}${GAME_WSS_PATH}`);
  console.log(`🌐 用户访问地址: http://localhost:${PORT}\n`);
});
