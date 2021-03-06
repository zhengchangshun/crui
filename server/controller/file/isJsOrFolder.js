const path = require('path');
const fs = require('fs');

module.exports = async function isJsOrFolder(ctx) {
    const base = path.join(process.cwd(), ctx.query.url ? ctx.query.url : '');
    if (fs.existsSync(base)) {
        const stat = fs.statSync(base);
        if (stat.isDirectory()) {
            ctx.success(200, '验证成功', null);
        }
        if (stat.isFile()) {
            if (path.extname(base) === '.js' || path.extname(base) === '.jsx') {
                ctx.success(200, '验证成功', null);
            } else {
                ctx.error(-1, '不是js文件', null);
            }
        }
    } else {
        ctx.error(-1, '找不到该目录', null);
    }
};
