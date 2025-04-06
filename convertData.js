const fs = require('fs');
const path = require('path');

// 获取data文件夹路径
const dataDir = path.join(__dirname, 'data');
const outputDir = path.join(__dirname, 'data_json');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 读取data文件夹中的所有JS文件
fs.readdir(dataDir, (err, files) => {
    if (err) {
        console.error('读取data文件夹失败：', err);
        return;
    }

    // 过滤出JS文件
    const jsFiles = files.filter(file => file.endsWith('.js'));

    // 处理每个文件
    jsFiles.forEach(file => {
        try {
            // 读取文件内容
            const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
            
            // 提取数组数据
            const arrayMatch = content.match(/var\s+tmp\s*=\s*(\[[\s\S]*\]);/);
            
            if (arrayMatch) {
                // 获取数组部分
                let arrayContent = arrayMatch[1];
                
                // 将数组转换为对象数组
                let array;
                try {
                    // 使用 eval 来解析数组（因为数据中可能包含特殊字符）
                    array = eval(arrayContent);
                    
                    // 第一行是字段名
                    const fields = array[0];
                    
                    // 将剩余行转换为对象数组
                    const objects = array.slice(1).map(row => {
                        const obj = {};
                        fields.forEach((field, index) => {
                            obj[field] = row[index];
                        });
                        return obj;
                    });

                    // 生成新的文件名（移除哈希值）
                    const baseName = file.replace(/\.[a-f0-9]{5,}\.js$/, '');
                    const newFileName = `${baseName}.json`;

                    // 写入JSON文件
                    fs.writeFileSync(
                        path.join(outputDir, newFileName),
                        JSON.stringify(objects, null, 2),
                        'utf8'
                    );

                    console.log(`成功转换：${file} -> ${newFileName}`);
                } catch (evalError) {
                    console.error(`解析数组失败 ${file}:`, evalError);
                }
            } else {
                // 尝试提取JSON数据
                const jsonMatch = content.match(/(?:module\.exports|export default)\s*=\s*({[\s\S]*})/);
                
                if (jsonMatch) {
                    // 获取JSON部分
                    let jsonContent = jsonMatch[1];
                    
                    // 移除可能的尾部分号
                    if (jsonContent.endsWith(';')) {
                        jsonContent = jsonContent.slice(0, -1);
                    }

                    // 生成新的文件名（移除哈希值）
                    const baseName = file.replace(/\.[a-f0-9]{5,}\.js$/, '');
                    const newFileName = `${baseName}.json`;

                    // 写入JSON文件
                    fs.writeFileSync(
                        path.join(outputDir, newFileName),
                        jsonContent,
                        'utf8'
                    );

                    console.log(`成功转换：${file} -> ${newFileName}`);
                } else {
                    console.warn(`无法提取数据：${file}`);
                }
            }
        } catch (error) {
            console.error(`处理文件失败 ${file}:`, error);
        }
    });

    // 生成fileList.json
    const jsonFiles = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.json'));

    fs.writeFileSync(
        path.join(outputDir, 'fileList.json'),
        JSON.stringify(jsonFiles, null, 2),
        'utf8'
    );
    console.log('fileList.json生成成功！');
}); 