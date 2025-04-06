import { updateTranslations, getAllTranslations } from './translations.js';

// 创建翻译管理界面
export function createTranslationManager() {
    const container = document.createElement('div');
    container.className = 'translation-manager';
    container.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    `;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '翻译管理';
    toggleButton.style.marginBottom = '10px';

    const editorContainer = document.createElement('div');
    editorContainer.style.display = 'none';

    const textarea = document.createElement('textarea');
    textarea.style.cssText = `
        width: 300px;
        height: 400px;
        margin-bottom: 10px;
    `;

    const saveButton = document.createElement('button');
    saveButton.textContent = '保存翻译';
    saveButton.style.marginRight = '10px';

    const exportButton = document.createElement('button');
    exportButton.textContent = '导出翻译';

    // 显示当前翻译
    function showCurrentTranslations() {
        const translations = getAllTranslations();
        textarea.value = JSON.stringify(translations, null, 2);
    }

    // 切换显示/隐藏
    toggleButton.addEventListener('click', () => {
        const isHidden = editorContainer.style.display === 'none';
        editorContainer.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            showCurrentTranslations();
        }
    });

    // 保存翻译
    saveButton.addEventListener('click', () => {
        try {
            const newTranslations = JSON.parse(textarea.value);
            updateTranslations(newTranslations);
            alert('翻译已更新！');
            // 触发页面刷新
            window.dispatchEvent(new CustomEvent('translationsUpdated'));
        } catch (error) {
            alert('保存失败：' + error.message);
        }
    });

    // 导出翻译
    exportButton.addEventListener('click', () => {
        const translations = getAllTranslations();
        const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'translations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    editorContainer.appendChild(textarea);
    editorContainer.appendChild(saveButton);
    editorContainer.appendChild(exportButton);
    container.appendChild(toggleButton);
    container.appendChild(editorContainer);

    return container;
} 