const Router = require('koa-router');
const path = require('path');
const fs = require('fs-extra');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const defaultTemplate = require('../../templateString/default-template');
const umiModel = require('../../templateString/umi-model');
const umiTemplate = require('../../templateString/umi-template');
const createExportVisitor = require('./create-export-visitor');

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

/**
 * 创建自定义模板
 */
router.get('/custom', async ctx => {
    let { url, folderName, fileName, variable } = ctx.query;
    let targetPath = path.join(process.cwd(), url ? url : '');
    // 创建文件夹
    if (folderName) {
        targetPath = path.join(targetPath, folderName);
        if (fs.existsSync(targetPath)) {
            ctx.error(0, '该文件夹已存在', null);
        }
        fs.mkdirSync(targetPath);
    }
    const modelPath = path.join(process.cwd(), '.crui', 'template');

    // 复制文件到目标文件夹
    fs.copySync(modelPath, targetPath);

    if (fileName && variable) {
        const url = path.join(targetPath, fileName);
        const ast = babelParser.parse(fs.readFileSync(url, 'utf-8'), {
            sourceType: 'module',
            plugins: [
                'classProperties',
                'jsx',
            ],
        });
        traverse(ast, createExportVisitor(ast, variable));
        const output = generate(ast);
        fs.writeFileSync(url, output.code);
    }
    ctx.success(200, '创建成功', null);
});

module.exports = router;