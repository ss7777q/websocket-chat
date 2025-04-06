用于显示造梦无双全部的信息

1.  **安装 Node.js**

    *   确保你的本地环境已经安装了 Node.js。

2.  **安装油猴 (Tampermonkey)**

    *   在你的浏览器中安装油猴插件（Tampermonkey）。

3.  **导入油猴脚本**

    *   将油猴脚本导入到 Tampermonkey 中。

4.  **修改脚本匹配规则**

    *   编辑导入的油猴脚本，将以下 `@match` 规则：

        ```
        // @match        https://client-zmxyol.3304399.net/*
        ```

        修改为：

        ```
        // @match        https://h.api.4399.com/*
        ```

    *   这个修改允许脚本在 `https://h.api.4399.com/g.php?gameId=100060323` 链接中运行。

5.  **运行 Node.js 服务器**

    *   在包含 `ser1.js` 文件的文件夹下，打开命令行终端并执行以下命令：

        ```bash
        node ser1.js
        ```

6.  **打开造梦无双**

    *   打开造梦无双游戏。

7.  **访问本地服务器**

    *   在浏览器中打开以下地址：

        ```
        http://localhost:3000/
        ```

    *   现在，你应该可以看到对应uid的全部信息了

**注意：**

*   请确保 `ser1.js` 文件存在于你执行 `node ser1.js` 命令的目录下。
*   如果 `ser1.js` 需要其他依赖，请确保已经安装。
*   `http://localhost:3000/` 端口可能被占用，请确保没有其他程序占用该端口。
