#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const { createAccount, 
        plant, 
        register } = require('../lib/core')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('account.json')
const db = low(adapter)

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init')
    .description('Initialize config.json')
    .action(() => {
        console.log('initialize config.json')
    })

program
    .command('account <action>')
    .description('Manage accounts')
    .action((action) => {
        switch(action) {
            case 'new':
            createAccount()
            break
    
            case 'list':  
            db.get("accounts").map("address").value().map(address => {
                console.log(`  ` + `${chalk.green(address)}`)    
            });    
            break
  
            default:
            console.log('Not Found Command.')
            break;
        }
    })

program
    .command('plant <action>')
    .arguments('<cmd> [env]')
    .description('Plant branch')
    .action((action, cmd) => {
        if (cmd) {
            plant(action, cmd)
        } else {
            console.log('Not Found Command.')
        }
    })

program
    .command('register <action>')
    .description('Register branch')
    .action((action) => {
        register(action)
    })

program
    .command('console')
    .description('Run YGGDRASH console')
    .option('--url <url>', 'Node url')
    .action((cmd) => {
        require('../lib/repl')(cleanArgs(cmd))
    })

// output help information on unknown commands
program
    .arguments('<command>')
    .action(cmd => {
        program.outputHelp()
        console.log()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`))
        console.log()
    })

program.parse(process.argv)

if(!process.argv.slice(2).length) {
    program.outputHelp()
}

function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
      const key = o.long.replace(/^--/, '')
      // if an option is not present and Command has a method with the same name
      // it should not be copied
      if (typeof cmd[key] !== 'function') {
        args[key] = cmd[key]
      }
    })
    return args
  }
  