const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

const dataCache = {};

function inferDataType(headers) {
  if (headers.includes('showName') && headers.includes('getDesc')) return 'titles';
  if (headers.includes('attr') && headers.includes('affixAttr')) return 'equipments';
  if (headers.includes('lv') && headers.includes('skillActive')) return 'skills';
  if (headers.includes('hole') && headers.includes('skill')) return 'matrix';
  if (headers.includes('strQuality') && headers.includes('vitQuality')) return 'ride';
  if (headers.includes('dower') && headers.includes('skillPotential')) return 'pet';
  if (headers.includes('expireTime') && headers.includes('itemType')) return 'fashions';
  if (headers.includes('growth') && headers.includes('blessing')) return 'magics';
  if (headers.includes('wingSkill')) return 'wing';
  if (headers.includes('text') && headers.includes('icon')) return 'achievements'; // 新增成就类型
  return null;
}

async function loadAllData() {
  const dataDir = path.join(__dirname, 'data');
  const files = await fs.readdir(dataDir);

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(dataDir, file);
    // 模拟服务器环境
    global.__IS_SERVER__ = true;
    let rawData;
    try {
      rawData = require(filePath);
    } catch (err) {
      console.error(`Error loading ${file}:`, err);
      continue;
    }

    // 检查 rawData 是否为数组
    if (!Array.isArray(rawData)) {
      console.warn(`Invalid data format in ${file}, skipping`);
      continue;
    }

    const headers = rawData[0];
    const rows = rawData.slice(1);
    const dataMap = {};
    rows.forEach(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      dataMap[item.id] = item;
    });

    const type = inferDataType(headers);
    if (type) {
      dataCache[type] = dataMap;
      console.log(`Loaded ${type} from ${file}`);
    } else {
      console.warn(`Unknown data type for file: ${file}`);
    }
  }
}

loadAllData().catch(err => console.error('Failed to load data:', err));

app.use(express.static('public'));

app.get('/api/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const dataMap = dataCache[type];
  if (!dataMap) {
    return res.status(400).json({ error: `Invalid data type: ${type}` });
  }
  const item = dataMap[parseInt(id)];
  if (item) {
    const response = {
      id: item.id,
      name: item.text || item.name || `未知${type}`, // 适应 achievement 的 text 字段
      desc: item.getDesc || item.desc || item.icon || '无描述' // 用 icon 作为备用描述
    };
    res.json(response);
  } else {
    res.status(404).json({ error: `${type} not found` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
