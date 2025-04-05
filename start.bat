@echo off
echo 启动所有服务...

:: 设置窗口标题
title 造梦无双查询服务

:: 启动 ser.js (3000 端口)
start "WebSocket Server" cmd /k "node ser1.js"
echo WebSocket 服务启动中...

:: 等待几秒，确保 ser.js 先运行
timeout /t 3 >nul

:: 启动 http-server (8000 端口)
start "HTTP Server" cmd /k "http-server -p 8000"
echo HTTP 服务启动中...

:: 等待几秒，确保 http-server 就绪
timeout /t 3 >nul

:: 启动 ngrok (暴露 8000 端口)
start "Ngrok" cmd /k "ngrok.exe http 8000"
echo Ngrok 服务启动中...

echo 所有服务已启动！
echo 请手动打开游戏页面 (https://client-zmxyol.3304399.net/) 和查询页面 (http://127.0.0.1:8000 或 ngrok 地址)。
pause
