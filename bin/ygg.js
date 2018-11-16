#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const exec = require('child_process').exec
const { db } = require('../lib/db')
const { account,
        getBalance,
        transferFrom,
        transfer,
        node,
        branch } = require('../lib/core')

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
    .command('branch <action>')
    .description('create branch')
    .action((action) => {
        const inquirer = require('inquirer');
        switch(action) {
            case 'init':
            exec("ls", (error, ls, stderr) => {
                if (ls) {
                    console.log()
                    console.log(`    ` + chalk.red(`fatal: destination path is not an empty directory.`))
                    console.log()
                } else {
                    exec("pwd", (error, pwd, stderr) => {
                        let folderName = pwd.split('/').slice(-1)[0].trim()
                        inquirer.prompt([{
                            name: 'name',
                            type: 'input',
                            message: `Branch name:(${folderName})`,
                          }]).then((answers) => {
                            inquirer.prompt([{
                                name: 'symbol',
                                type: 'input',
                                message: 'Symbol:',
                              }, {
                                name: 'property',
                                type: 'list',
                                message: 'Property: ',
                                choices: ['currency', 'exchange', 'dex'],
                                default: 0,
                              }]).then((answers1) => {
                                  if (answers1.property === 'currency') {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description: ',
                                      }, {
                                        name: 'frontier',
                                        type: 'list',
                                        message: 'Select frontier',
                                        choices: db().get("accounts").map("address").value(),
                                        default: 0,
                                      }, {
                                        name: 'total_supply',
                                        type: 'input',
                                        message: 'Total Supply: ',
                                      }]).then((answers2) => {
                                            var seed
                                            let symbol = answers1.name.length < 3 ? answers1.name.substring(0,3).toUpperCase() : answers1.name.toUpperCase()
                                            if(answers.name){
                                                if (!answers1.symbol) {
                                                    seed = branch.seed(answers.name, 
                                                                        symbol,
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                } else {
                                                    seed = branch.seed(answers.name, 
                                                                        answers1.symbol, 
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                }
                                            } else {
                                                if (!answers1.symbol) {
                                                    seed = branch.seed(folderName, 
                                                                        symbol,
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                } else {
                                                    seed = branch.seed(folderName, 
                                                                        answers1.symbol, 
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                }
                                            }

                                            inquirer.prompt([{
                                                name: 'ok',
                                                type: 'confirm',
                                                message: 'Is this OK?',
                                              }]).then((answers3) => {
                                                  if (answers3.ok) {
                                                    console.log()
                                                    console.log(`    ` + chalk.green(`✍️  Cloning into 'contract'...`))
                                                    console.log()
                                                    branch.init(seed)
                                                  } else {
                                                    console.log()
                                                    console.log('Aborted.')
                                                    console.log()
                                                    console.log()
                                                  }
                                              })
                                      })
                                  } else {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description: ',
                                      }]).then((answers2) => {
                                        const seed = branch.seed(answers.name ? answers.name : folderName, 
                                                                    answers1.symbol, 
                                                                    answers1.property, 
                                                                    answers2.description, 
                                                                    answers2.frontier, 
                                                                    answers2.total_supply)
                                        inquirer.prompt([{
                                            name: 'ok',
                                            type: 'confirm',
                                            message: 'Is this OK?',
                                          }]).then((answers3) => {
                                              if (answers3.ok) {
                                                console.log()
                                                console.log(`    ` + chalk.green(`✍️  Cloning into 'contract'...`))
                                                console.log()
                                                branch.init(seed)
                                              } else {
                                                console.log()
                                                console.log('Aborted.')
                                                console.log()
                                                console.log()
                                              }
                                          })
                                      })
                                  }
                              })
                          })
                    })
                }
            })
            break;

            case 'build':
            inquirer.prompt([{
                name: 'owner',
                type: 'list',
                message: 'Select branch owner',
                choices: db().get("accounts").map("address").value(),
                default: 0,
              }]).then((answers) => {
                branch.build(answers.owner)
              })
            break;

            case 'deploy':
            inquirer.prompt([{
                name: 'network',
                type: 'list',
                message: 'network',
                choices: ['local', 'testnet(not yet)', 'mainnet(not yet)'],
                default: 0,
              }]).then((answers) => {
                switch(answers.network) {
                    case 'local':
                    branch.deploy('http://localhost:8080') 
                    break
            
                    case 'testnet':  
                    // branch.deploy('http://testnet.yggdrash.io') 
                    console.log('Not yet')
                    break
          
                    case 'mainnet':  
                    // branch.deploy('http://mainnet.yggdrash.io') 
                    console.log('Not yet')
                    break
        
                    default:
                    console.log('Not Found Command.')
                    break;
                }
              });
            break;
              
            default:
            console.log('Not Found Command.')
            break;
        }
    })

program
    .command('account <action>')
    .option('-o, --owner <owner>', 'owner')
    .description('Manage accounts')
    .action((action, cmd) => {
        switch(action) {
            case 'new':
            account.create()
            break
    
            case 'list':  
            account.getAccounts()  
            break
  
            case 'coinbase':  
            cmd.owner ? account.coinbase(cmd.owner) : account.coinbase()
            break

            case 'clear':  
            account.clear()
            break

            default:
            console.log('Not Found Command.')
            break;
        }
    })

program
    .command('stem <action>')
    .option('-o, --owner <owner>', 'owner')
    .option('-s, --seed <seed>', 'seed')
    .option('-n, --net <net>', 'net')
    .option('-b, --branch <branch>', 'branch')
    .description('Plant branch to STEM')
    .action((action, cmd) => {
        if (action === "plant") {
            if(!cmd.owner || !cmd.seed){
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                plant(cmd.owner, cmd.seed, cmd.net)
            }
        } else {
            console.log('Not Found Command.')
        }
    })

program
    .command('sendTransaction <action>')
    .option('-b, --branch <branch>', 'branch')
    .option('-f, --from <from>', 'from')
    .option('-t, --to <to>', 'to')
    .option('-v, --value <value>', 'value')
    .option('-n, --net <net>', 'net')
    .description('Manage transaction')
    .action((action, cmd) => {
        if(action === "transferFrom"){
            if (!cmd.branch || !cmd.from || !cmd.to || !cmd.value) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                transferFrom(cmd.branch, cmd.from, cmd.to, cmd.value, cmd.net)
            }
        } else if(action === "transfer"){
            if (!cmd.branch || !cmd.to || !cmd.value) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                transfer(cmd.branch, cmd.to, cmd.value, cmd.net)
            }
        }
    })

program
    .command('balanceOf <action>')
    .option('-b, --branch <branch>', 'branch')
    .option('-a, --address <address>', 'address')
    .option('-n, --net <net>', 'net')
    .description('Query Balance')
    .action((action, cmd) => {
        if(action === "yeed"){
            if (!cmd.branch || !cmd.address) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                getBalance(cmd.branch, cmd.address, cmd.net)
            }
        }
    })

program
    .command('node <action>')
    .option('-p, --port <port>', 'port')
    .option('-l, --log <log>', 'log')
    .option('-n, --net <net>', 'net')
    .description('Node Admin Controller')
    .action((action, cmd) => {
        if(action === "restart"){
            node.restart(cmd.net)
        } else if(action === "setConfig"){
            if (!cmd.port || !cmd.log) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                node.setConfig(cmd.port, cmd.log, cmd.net)
            }
        } else {
            console.log()
            console.log(`  ` + chalk.red(`Unknown command`))
            console.log()
        }
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
  