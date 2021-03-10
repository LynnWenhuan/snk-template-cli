
const shell = require('shelljs')
const symbols = require('log-symbols')
const chalk = require('chalk'); // 用于改变字体颜色
const clone = require('../utils/clone');
const fs = require('fs-extra')
const inquirer = require('inquirer');
var execSync = require('child_process').execSync;
const ora = require('ora'); // 用于输出loading
const remote = 'http://git.sinosafe.com.cn/snk/snk-cli.git';
let branch = 'master';

const questions = [
    {
      type: 'input',
      message: '请输入模板名称:',
      name: 'name',
      validate(val) {
        if (!val) return '模板名称不能为空！';
        if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return '模板名称包含非法字符，请重新输入';
        return true;
      }
    },
    {
      type: 'input',
      message: '请输入模板关键词（;分割）:',
      name: 'keywords'
    },
    {
      type: 'input',
      message: '请输入模板简介:',
      name: 'description'
    },
    {
      type: 'list',
      message: '请选择模板类型:',
      choices: ['响应式', '桌面端', '移动端'],
      name: 'type'
    },
    {
      type: 'list',
      message: '请选择模板分类:',
      choices: ['整站', '单页', '专题'],
      name: 'category'
    },
    {
      type: 'input',
      message: '请输入模板风格:',
      name: 'style'
    },
    {
      type: 'input',
      message: '请输入模板色系:',
      name: 'color'
    },
    {
      type: 'input',
      message: '请输入您的名字:',
      name: 'author'
    }
  ];

const initAction = async (name, option) => {


    // 0.检查git是否可用
    if (!shell.which('git')) {
        shell.echo(symbols.error, '对不起，git命令不可用！')
        shell.exit(1);
    }

    // 1.验证name是否合法
    if (fs.existsSync(name)) {
        shell.echo(symbols.error, `已经存在相同的文件名${name}`)
        return;
    }
    if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
        shell.echo(symbols.error, '名字存在非法字符');
        return;
    }

    // 2.获取option, 确认版本
    if (option.dev) {
        branch = 'devlop'
    }

    // 3.通过用户交互，个性化

    // 通过inquirer获取到用户输入的内容
    const answers = await inquirer.prompt(questions);
    // 将用户的配置打印，确认一下是否正确
    shell.echo('------------------------');
    shell.echo(answers);
    let confirm = await inquirer.prompt([
    {
        type: 'confirm',
        message: '确认创建？',
        default: 'Y',
        name: 'isConfirm'
    }
   ]);
   if (!confirm.isConfirm) return false;

    // 4.clone模版
    await clone(`direct:${remote}#${branch}`, name, { clone: true })

    // 5. 清理文件
    const deleteDir = ['.git', '.gitignore', 'README.md', 'docs']; // 需要清理的文件
    const pwd = shell.pwd();
    deleteDir.map(item => shell.rm('-rf', pwd + `/${name}/${item}`));



    shell.echo(chalk.green(`进入 ${name}: cd ${name}`))
    
    shell.cd(name);//进入`name`目录

    // 6. 下载依赖
    const installSpinner = ora('正在安装依赖...').start();
    try {
        execSync('npm install', { stdio: 'inherit' });
        installSpinner.succeed(chalk.green('依赖安装成功！'));
    } catch (error) {
       shell.echo(symbols.warning, chalk.yellow('自动安装失败，请手动安装！'));
       installSpinner.fail(chalk.red('自动安装依赖失败')); // 安装失败
    }
}

module.exports = initAction;

