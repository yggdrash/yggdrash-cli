#!/usr/bin/env node

const program = require('commander')

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init')
    .description('initialize config.json')
    .action(() => {
        console.log('initialize config.json')
    })

program.parse(process.argv)
