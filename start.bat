@echo off
title 一键启动造梦无双查询服务
cd /d "d:"

cd /d "D:\zmws\data\anyperson"
echo 正在启动 Node.js 服务器...
start "Node Server" cmd /k node ser1.js

echo 正在启动 ngrok 公网隧道...
start "Ngrok Tunnel" cmd /k ngrok http 3000

echo 服务启动完成！
pause
