const Router = require('koa-router');
const path = require('path');
const fs = require('fs-extra');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const createExportVisitor = require('./create-export-visitor');
const templateController = require('../../controller/template');

const router = new Router();

/**
 * 创建默认模板
 */
router.get('/default', templateController.default);

/**
 * 创建umi模板
 */
router.get('/umi', templateController.umi);

/**
 * 创建自定义模板
 */
router.get('/custom', async ctx => {
    const { url, folderName, fileName, variable } = ctx.query;
    let targetPath = path.join(process.cwd(), url || '');
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
        const targetUrl = path.join(targetPath, fileName);
        const ast = babelParser.parse(fs.readFileSync(targetUrl, 'utf-8'), {
            sourceType: 'module',
            plugins: [
                'classProperties',
                'jsx',
            ],
        });
        traverse(ast, createExportVisitor(ast, variable));
        const output = generate(ast);
        fs.writeFileSync(targetUrl, output.code);
    }
    ctx.success(200, '创建成功', null);
});

module.exports = router;
