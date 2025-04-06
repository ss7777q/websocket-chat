// 数据API处理
const dataApi = {
    // 存储所有数据文件的内容
    data: {},

    // 初始化函数，用于加载所有数据文件
    async init() {
        try {
            console.log('开始加载称号数据...');
            
            // 加载 title.js 文件
            const response = await fetch('data/title.e2bcc.js');
            console.log('文件加载状态:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            console.log('文件内容长度:', content.length);
            
            // 提取数组数据
            const arrayMatch = content.match(/var\s+tmp\s*=\s*(\[[\s\S]*\]);/);
            if (arrayMatch) {
                console.log('成功匹配数组数据');
                const arrayContent = arrayMatch[1];
                // 使用eval来解析数组（因为数据中包含特殊格式的对象）
                const array = eval(arrayContent);
                
                // 第一行是字段名
                const fields = array[0];
                console.log('字段名:', fields);
                
                // 将剩余行转换为对象数组,并以id为键创建查找表
                const objects = {};
                array.slice(1).forEach(row => {
                    const obj = {};
                    fields.forEach((field, index) => {
                        obj[field] = row[index];
                    });
                    objects[String(obj.id)] = obj;  // 确保使用字符串作为键
                });

                // 存储转换后的数据
                this.data.title = objects;
                console.log('称号数据加载成功，总数:', Object.keys(objects).length);
                console.log('第一条称号数据:', objects[Object.keys(objects)[0]]);
                return true;
            }
            
            console.error('无法提取称号数据');
            return false;
        } catch (error) {
            console.error('初始化数据API失败：', error);
            return false;
        }
    },

    // 通过ID查找数据
    findById(fileName, id) {
        console.log(`查找数据 - 文件: ${fileName}, ID: ${id}`);
        
        if (!id) {
            console.warn(`查找数据时ID为空`);
            return null;
        }
        
        // 特殊处理称号数据
        if (fileName === 'title') {
            // 从全局configData中获取称号数据
            const titleData = window.configData && window.configData.title;
            if (!titleData) {
                console.error('称号数据未加载');
                return null;
            }
            
            try {
                // 第一行是字段名
                const fields = titleData[0];
                
                // 查找匹配的称号数据
                const titleRow = titleData.find(row => row[0] === Number(id));
                if (!titleRow) {
                    return null;
                }
                
                // 将数组转换为对象
                const titleInfo = {};
                fields.forEach((field, index) => {
                    titleInfo[field] = titleRow[index];
                });
                
                return titleInfo;
            } catch (error) {
                console.error(`处理称号数据(ID: ${id})时出错:`, error);
                return null;
            }
        }
        
        // 处理其他数据
        if (!this.data[fileName]) {
            console.error(`数据文件不存在：${fileName}`);
            return null;
        }
        
        // 将id转换为字符串进行比较
        const strId = String(id);
        console.log(`查找ID ${strId} 在 ${fileName} 中`);
        
        const result = this.data[fileName][strId];
        if (!result) {
            console.log(`在${fileName}中未找到ID：${id}`);
            return null;
        }
        
        console.log(`找到结果:`, result);
        return result;
    },

    // 获取所有可用的数据文件名
    getAvailableFiles() {
        return Object.keys(this.data);
    }
};

export default dataApi; 