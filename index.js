#!/usr/bin/env node

const commander = require('commander');
const InitAction = require('./command/init');

// 查看版本号
commander
    .version(require('./package.json').version)
    .option('-v, --version', '查看版本号');



commander
.command('init <name>') // 定义init命令，<name>为必须参数，在action中的function中获取
.option('-d --dev', '获取开发版本')
.action(InitAction)
// -h
commander.parse(process.argv);