const Router = require('koa-router');
const path = require('path');
const fs = require('fs-extra');
const defaultTemplate = require('../../templateString/default-template');
const umiModel = require('../../templateString/umi-model');
const umiTemplate = require('../../templateString/umi-template');

const router = new Router();

/**
 * 创建默认模板
 */
router.get('/default', async ctx => {
    let { url, folderName, fileName, variable } = ctx.query;
    let base = path.join(process.cwd(), url ? url : '');
    variable = variable ? variable : 'Template';

    // 创建文件夹
    if (folderName) {
        base = path.join(base, folderName);
        if (fs.existsSync(base)) {
            ctx.error(0, '该文件夹已存在', null);
            return;
        }
    }
    const script = defaultTemplate(variable);
    fs.outputFileSync(path.join(base, fileName), script);
    ctx.success(200, '创建成功', null);
});

/**
 * 创建umi模板
 */
router.get('/umi', async ctx => {
    let { url, folderName, fileName, variable, namespace, oilConfig } = ctx.query;
    let base = path.join(process.cwd(), url ? url : '');
    variable = variable ? variable : 'Template';
    namespace = namespace ? namespace : 'global';

    // 创建文件夹
    if (folderName) {
        base = path.join(base, folderName);
        if (fs.existsSync(base)) {
            ctx.error(0, '该文件夹已存在', null);
            return;
        }
    }
    const script = umiTemplate(variable, namespace);
    const modelscript = umiModel(namespace, oilConfig);

    fs.outputFileSync(path.join(base, fileName), script);
    fs.outputFileSync(path.join(base, 'model.js'), modelscript);
    ctx.success(200, '创建成功', null);
});

module.exports = router;