@echo off
title 一键启动造梦无双查询服务

echo 正在启动 Node.js 服务器...
start "Node Server" cmd /k node ser1.js

echo 正在启动 ngrok 公网隧道...
start "Ngrok Tunnel" cmd /k ngrok http 3000

echo 服务启动完成！
echo 请查看各窗口的运行状态。
echo - Node.js 服务器窗口显示 "服务器运行中" 即为成功
echo - ngrok 窗口显示 "https://xxxx.ngrok.io" 即为成功
echo 然后访问 ngrok 提供的地址即可使用服务。

pause
