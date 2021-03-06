const path = require('path');
const fs = require('fs-extra');
const codeFormat = require('../../utils/codeFormat');
const oilListpageMap = require('../../templateString/oil-listpage-map');
const oilListpageModel = require('../../templateString/oil-listpage-model');
const oilListpageIndex = require('../../templateString/oil-listage-index');

module.exports = async function listpage(ctx) {
    const { url, name, pageOption, namespace } = ctx.request.body;
    const { formCode, tableCode, popupForms, title, buttons, tableData } = pageOption;
    // map.js
    const popupFormsCode = popupForms.map(item => item.code).join('\n\n');
    const mapBase = path.join(process.cwd(), url, name, 'map.js');
    let mapString = oilListpageMap(formCode, tableCode, popupFormsCode);
    mapString = codeFormat(mapString);

    // model.js
    const popupFormsName = popupForms.map(item => item.name);
    const modelBase = path.join(process.cwd(), url, name, 'model.js');
    let modelString = oilListpageModel(namespace, popupFormsName, tableData);
    modelString = codeFormat(modelString);

    // index.js
    const indexBase = path.join(process.cwd(), url, name, 'index.js');
    let indexString = oilListpageIndex(name, title, namespace, buttons, !!formCode, popupForms);
    indexString = codeFormat(indexString);

    try {
        fs.outputFileSync(mapBase, mapString);
        fs.outputFileSync(modelBase, modelString);
        fs.outputFileSync(indexBase, indexString);
        ctx.success(200, '创建成功', null);
    } catch {
        ctx.success(0, '创建失败', null);
    }
};
