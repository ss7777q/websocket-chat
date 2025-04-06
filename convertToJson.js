const fs = require('fs');
const path = require('path');

// 创建 data_json 目录（如果不存在）
const dataJsonDir = path.join(__dirname, 'data_json');
if (!fs.existsSync(dataJsonDir)) {
    fs.mkdirSync(dataJsonDir);
}

// 读取并转换 title.e2bcc.js
const titleJsPath = path.join(__dirname, 'data', 'title.e2bcc.js');
const titleJsonPath = path.join(dataJsonDir, 'title.json');

try {
    const content = fs.readFileSync(titleJsPath, 'utf8');
    const arrayMatch = content.match(/var\s+tmp\s*=\s*(\[[\s\S]*\]);/);
    
    if (arrayMatch) {
        const arrayContent = arrayMatch[1];
        const array = eval(arrayContent);
        
        // 第一行是字段名
        const fields = array[0];
        
        // 将剩余行转换为对象数组,并以id为键创建查找表
        const objects = {};
        array.slice(1).forEach(row => {
            const obj = {};
            fields.forEach((field, index) => {
                obj[field] = row[index];
            });
            objects[String(obj.id)] = obj;
        });

        // 保存为JSON文件
        fs.writeFileSync(titleJsonPath, JSON.stringify(objects, null, 2));
        console.log('成功将称号数据转换为JSON格式');
    } else {
        console.error('无法提取数组数据');
    }
} catch (error) {
    console.error('转换失败:', error);
} 