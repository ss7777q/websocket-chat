const fs = require('fs');
const path = require('path');

// 获取data文件夹路径
const dataDir = path.join(__dirname, 'data');

// 读取data文件夹中的所有JSON文件
fs.readdir(dataDir, (err, files) => {
    if (err) {
        console.error('读取data文件夹失败：', err);
        return;
    }

    // 过滤出JSON文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // 写入fileList.json
    fs.writeFile(
        path.join(dataDir, 'fileList.json'),
        JSON.stringify(jsonFiles, null, 2),
        err => {
            if (err) {
                console.error('写入fileList.json失败：', err);
                return;
            }
            console.log('fileList.json生成成功！');
        }
    );
}); 