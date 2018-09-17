#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')

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
    .action(action => {
        require('../lib/account')(action)
    })

program
    .command('console')
    .description('Run YGGDRASH console')
    .option('--url <url>', 'Node url')
    .action((cmd) => {
        require('../lib/repl')(cleanArgs(cmd))
    })

program
    .command('tx <action>')
    .option('--from <from>', 'from')
    .option('--to <to>', 'to')
    .option('--value <value>', 'value')
    .description('Manage transaction')
    .action((action, cmd) => {
        require('../lib/stem/txData')(action, cleanArgs(cmd))
    })
    // ex) ygg tx send --from ace --to bob --value 10

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
  