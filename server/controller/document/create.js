const fs = require('fs');
const astParse = require('../../socket/document/astParse');
const getComponentName = require('../../socket/document/getComponentName');
const createMd = require('../../socket/document/createMd');

module.exports = async function create(ctx) {
    const { file } = ctx.request.files;
    const { output } = ctx.request.body;
    const code = fs.readFileSync(file.path, 'utf-8');
    const fileObj = astParse(null, code);
    const { isFunction, isClass, props, main } = fileObj;
    if (isFunction && !props) {
        // 如果是函数，如果没有props，代表不是函数组件，不生成md
        ctx.status = 400;
        ctx.error(0, '该文件不是组件', null);
    } else if (isClass && !main && !props) {
        // 如果是类，如果没有props且也没有注释，不生成md
        ctx.status = 400;
        ctx.error(0, '暂无解析数据', null);
    } else if (!main && !props) {
        // 不是函数也不是类，可能是工具库文件
        ctx.status = 400;
        ctx.error(0, '该文件不是组件', null);
    } else {
        const name = getComponentName(fileObj);
        createMd(fileObj, name, output);
        ctx.success(200, '成功', null);
    }
};
