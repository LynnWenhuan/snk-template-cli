const download = require('download-git-repo'); // 从git下载的包
const symbols = require('log-symbols'); // 用于输出图标
const ora = require('ora'); // 用于输出loading
const chalk = require('chalk'); // 用于改变字体颜色

module.exports = function (remote, name, option) {
    const downSpinner = ora('正在下载模版...').start();
    return new Promise((resolve, reject) => {
        download(remote, name, option, err => {
            if (err) {
                downSpinner.fail();
                console.log(symbols.error, chalk(err));
                reject(err);
                return;
            }
            downSpinner.succeed(chalk.green('下载模版成功！'));
            resolve()
        })
    })
}