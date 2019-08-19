#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const exec = require('child_process').exec
const { Ygg } = require("@yggdrash/sdk")
const { db } = require('../lib/db')
const inquirer = require('inquirer')
const { account,
        queries,
        rawTx,
        contract,
        node,
        branch,
        invokeTx
    } = require('../lib/core')

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
    .description('Manage branch')
    .action((action) => {
        if (!account.getAccount(0)) {
            console.log(`\n    ` + chalk.red(`You need an account to create a branch. Please create an account.\n`))
            return false
        }

        switch(action) {
            case 'init':
            exec("ls", (error, ls, stderr) => {
                if (ls) {
                    console.log(`\n    ` + chalk.red(`fatal: destination path is not an empty directory.\n`))
                } else {
                    exec("pwd", (error, pwd, stderr) => {
                        let folderName = pwd.split('/').slice(-1)[0].trim()
                        inquirer.prompt([{
                            name: 'name',
                            type: 'input',
                            message: `Branch name: ${chalk.grey(`(${folderName})`)}`,
                          }]).then((answers) => {
                            let symbol = folderName.length > 3 ? folderName.substring(0,3).toUpperCase() : folderName.toUpperCase()
                            inquirer.prompt([{
                                name: 'symbol',
                                type: 'input',
                                message: `Symbol: ${chalk.grey(`(${symbol})`)}`,
                              }, {
                                name: 'property',
                                type: 'list',
                                message: 'Property:',
                                choices: ['currency', 'exchange', 'dex'],
                                default: 0
                              }]).then((answers1) => {
                                  if (answers1.property === 'currency') {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description:'
                                      }, {
                                        name: 'frontier',
                                        type: 'list',
                                        message: 'Select frontier',
                                        choices: db().get("accounts").map("address").value(),
                                        default: 0
                                      }, {
                                        name: 'total_supply',
                                        type: 'input',
                                        message: 'Total Supply:'
                                      }]).then((answers2) => {
                                            var seed
                                            if(answers.name){
                                                let symbol = answers.name.length > 3 ? answers.name.substring(0,3).toUpperCase() : answers.name.toUpperCase()
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
                                                message: 'Is this OK?'
                                              }]).then((answers3) => {
                                                  if (answers3.ok) {
                                                    console.log(`\n    ` + chalk.green(`✍️  Cloning into 'contract'...\n`))
                                                    branch.init(seed)
                                                  } else {
                                                    console.log('\nAborted.\n\n')
                                                  }
                                              })
                                      })
                                  } else {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description:',
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
                                                console.log(`\n    ` + chalk.green(`✍️  Cloning into 'contract'...\n`))
                                                branch.init(seed)
                                              } else {
                                                console.log(`\n    ` + chalk.red(`Aborted.\n\n`))
                                              }
                                          })
                                      })
                                  }
                              })
                          })
                    })
                }
            })
            break

            case 'build':
            inquirer.prompt([{
                name: 'owner',
                type: 'list',
                message: 'Select branch owner',
                choices: db().get("accounts").map("address").value(),
                default: 0
              }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
              }]).then((answers) => {
                branch.build(answers.owner, answers.password)
              })
            break

            case 'deploy':
            branch.deploy()
            break

            case 'list':
            branch.list(action)
            break
              
            case 'set':
            branch.setBranch(action)
            break
              
            case 'status':
            branch.status()
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'init                      Initialize seed.json')
            console.log(`  ` + 'build                     Create a branch file with seed.json')
            console.log(`  ` + 'deploy                    Deploy to node')
            console.log(`  ` + 'list                      View branch list')
            console.log(`  ` + 'set                       Set branch')
            console.log(`  ` + 'status                    View current branch\n')
            break

            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg branch help                     output usage information\n')
            break
        }
    })

program
    .command('account <action>')
    .description('Manage accounts')
    .action((action) => {
        switch(action) {
            case 'new':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: 'Password:'
            }]).then((answers) => {
                account.newAccount(answers.password)
            })
            break
    
            case 'list':  
            account.getAccounts()  
            break

            case 'import':
            inquirer.prompt([{
                name: 'pk',
                type: 'input',
                message: 'private key(without 0x):'
              }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
              }]).then((answers) => {
                    account.importAccount(answers.pk, answers.password)
              })
            break

            case 'export':
            inquirer.prompt([{
                name: 'address',
                type: 'list',
                message: 'Select export address',
                choices: db().get("accounts").map("address").value(),
                default: 0
              }, {
                name: 'key',
                type: 'list',
                message: 'export type',
                choices: ['privatekey', 'keystore'],
                default: 0
              }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
              }]).then((answers) => {
                    account.exportAccount(answers.address, answers.password, answers.key)
              })
            break

            case 'clear':  
            account.clear()
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'new                      Generate new account')
            console.log(`  ` + 'list                     Account list')
            console.log(`  ` + 'import                   Import account')
            console.log(`  ` + 'export                   Export account')
            console.log(`  ` + 'clear                    Delete all account\n')
            break

            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg account help                     output usage information\n')
            break
        }
    })

program
    .command('admin <action>')
    .description('Manage admin account')
    .action((action) => {
        switch(action) {
            case 'get':
            console.log(`  ` + `${chalk.green(account.getAdmin())}`)
            break
    
            case 'set':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: `${chalk.red('Admin password')}`,
              }]).then((answers) => {
                    account.adminVerify(db().get("accounts").map("address").value()[0], answers.password)
                    if (!db().get("accounts").map("address").value()[1]) {
                        console.log(`\n    ` + chalk.red(`There are only admin accounts\n`))
                        return false
                    }
                    inquirer.prompt([{
                        name: 'owner',
                        type: 'list',
                        message: 'Candidate admin',
                        choices: db().get("accounts").map("address").value().slice(1),
                        default: 0
                      }, {
                        name: 'password',
                        type: 'password',
                        message: `${chalk.red('Candidate password')}`,
                      }]).then((answers) => {
                        account.adminVerify(answers.owner, answers.password)
                        account.setAdmin(answers.owner)
                      })
              })
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'get                      Current admin account')
            console.log(`  ` + 'set                      Change admin account\n')
            break
  
            default:
            console.log('  Options:')
            console.log(`\n  ` + 'ygg admin help                     output usage information\n')
            break
        }
    })

program
    .command('node <action>')
    .option('-p, --path <path>', 'path')
    .option('-r, --remote <remote>', 'remote')
    .description('Node Admin Controller')
    .action((action, cmd) => {
        if (db().get("accounts").map("address").value()[0] == null) {
            console.log(`\n  ` + `${chalk.red("Please create a account.\n")}`)
            return false
        }

        switch (action) {
            case 'build':
                node.build(cmd.path)
                return

            case 'status':
                node.status()
                return

            case 'stop':
                node.stop()
                return

            case 'set':
                node.remoteSet(cmd.remote)
                return

            case 'remoteStatus':
                node.remoteStatus()
                return

            case 'sync':
                node.sync()
                return
            default:
            console.log('\nCommands:')
            console.log(`  ` + 'build                      Node build with admin account')
            console.log(`  ` + 'start                      Node start with admin account')
            console.log(`  ` + 'status                     View status node')
            console.log(`  ` + 'stop                       Stop node\n')
            console.log('Options:')
            console.log(`  ` + 'ygg node build -p [node path]')
            console.log(`  ` + 'ㄴ If the yggdrash node already exists, specify the node path\n')

            return
        }

        inquirer.prompt([{
            name: 'password',
            type: 'password',
            message: `${chalk.red('Admin password')}`,
          }]).then((answers) => {
                switch(action) {
                    case 'start':
                    node.start(answers.password, cmd.path)
                    break
                    
                    case 'set':
                    console.log('Not yet')
                    // node.setConfig(cmd.node)
                    break
                }
          })
    })

program
    .command('tx <action>')
    .option('-f, --from <from>', 'from')
    .option('-t, --to <to>', 'to')
    .option('-s, --spender <spender>', 'spender')
    .option('-v, --value <value>', 'value')
    .option('-n, --net <net>', 'net')
    .option('-i, --txId <txId>', 'txId')
    .option('-p, --passwd <password>', 'passwd')
    .description('Manage transaction')
    .action((action, cmd) => {
        if (action === 'help') {
            console.log('\nCommands:')
            console.log(` ` + 'transferFrom                   Send the transaction after specifying the account to send')
            console.log(` ` + 'transfer                       Send transaction to default admin account')
            console.log(` ` + 'approve                        Allow an account to be owned by the owner in the owner\'s account')
            console.log(` ` + 'ex) ygg tx transfer -t 757649D90145e30b567A1f1B97267198Cde5e96c -v 1000')
            console.log(` ` + 'ex) ygg tx transferFrom -f 567A1f1B97267198Cde5e96c757649D90145e30b -t 757649D90145e30b567A1f1B97267198Cde5e96c -v 1000')
            console.log(` ` + 'ex) ygg tx approve -s 757649D90145e30b567A1f1B97267198Cde5e96c -v 1000\n')
            return false
        }
        let accountAddress = account.getAdmin()

        // if (!db().get('currentBranch').value()) {
        //     console.log(chalk.red(`\nThe current branch is not set.`))
        //     console.log(`  ` + `use ${chalk.green('ygg branch set')}\n`)
        //     return false
        // }

        const check = function () {
            if (!cmd.to || !cmd.value) {
                console.log(`\n  ` + chalk.red(`Unknown command\n`))
                console.log('  Options:')
                console.log(`  ` + '-f : from')
                console.log(`  ` + '-t : to')
                console.log(`  ` + '-v : value')
                console.log(`  ` + '-n : network')
                return false
            }
            return true
        }
        switch(action) {
            case 'transferFrom':
            if (!check()) return
            if (cmd.passwd) {
              rawTx.transferFrom(cmd.from, cmd.to, cmd.value, cmd.passwd)
            } else {
              inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: accountAddress + ' password:'
              }]).then((answers) => {
                rawTx.transferFrom(cmd.from, cmd.to, cmd.value, answers.password)
              })
            }
            break

            case 'transfer':
            if (!check()) return
                if (cmd.passwd) {
                  rawTx.transfer(cmd.to, cmd.value, cmd.passwd)
                } else {
                  inquirer.prompt([{
                    name: 'password',
                    type: 'password',
                    message: `${chalk.red(accountAddress + ' password')}`
                  }]).then((answers) => {
                    rawTx.transfer(cmd.to, cmd.value, answers.password)
                  })
                }
            break

            case 'versioning':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: `${chalk.red(accountAddress + ' password')}`
            }]).then((answers) => {
                rawTx.versioning(answers.password)
            })
            break

            case 'approve':
              if (!cmd.spender || !cmd.value) {
                  console.log(`\n  ` + chalk.red(`Unknown command\n`))
                  console.log('  Options:')
                  console.log(`  ` + '-s : spender')
                  console.log(`  ` + '-v : value')
                  console.log(`  ` + '-n : network')
                  return false
              }
              if (cmd.passwd) {
                rawTx.approve(cmd.spender, cmd.value, cmd.passwd)
              } else {
                inquirer.prompt([{
                  name: 'password',
                  type: 'password',
                  message: `${chalk.red('Admin password')}`
                }]).then((answers) => {
                  rawTx.approve(cmd.spender, cmd.value, answers.password)
                })

              }
            break

            case 'create':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: `${chalk.red('Admin password')}`
            }]).then((answers) => {
                // TODO: contract manager에게 브랜치의 컨트랙트 무엇인지 호출
                // const branch = config().get('node').value()[0].branch
                rawTx.create(answers.password)
            })
            break

            case 'get':
                rawTx.getTransaction(cmd.txId)
            break

            case 'receipt':
                rawTx.getTransactionReceipt(cmd.txId)
            break

            case 'logs':
                rawTx.getLogs()
            break

            case 'getPendingTransactionList':
                rawTx.getPendingTransactionList()
            break
            case 'newPendingTransactionFilter':
                rawTx.newPendingTransactionFilter()
            break
            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log(`  ` + 'ygg tx help                     output usage information\n')
            break
        }
    })


// program
//     .command('query <action>')
//     .option('-a, --address <address>', 'address')
//     .option('-o, --owner <owner>', 'owner')
//     .option('-s, --spender <spender>', 'spender')
//     .option('-n, --net <net>', 'net')
//     .option('-i, --id <id>', 'id')
//     .description('Query')
//     .action((action, cmd) => {
//         if (!action || action === 'help') {
//             console.log('  Commands:')
//             console.log(` ` + 'balanceOf                   Enter balance address iquired account')
//             console.log(` ` + 'specification               Show the characteristics of the branch.')
//             console.log(` ` + 'totalSupply                 Show the total supply of the coin branch.')
//             console.log(` ` + 'allowance                   It is possible to see how much the owner gave the quota to a particular address.')
//             console.log(`  ` + 'ex) ygg query balanceOf -a 757649D90145e30b567A1f1B97267198Cde5e96c')
//             console.log(`  ` + 'ex) ygg query allowance -o 757649D90145e30b567A1f1B97267198Cde5e96c -s 757649D90145e30b567A1f1B97267198Cde5e96c\n')
//             console.log('  Opsions:')
//             for (let i in cmd.options) {
//                 console.log(`  ` + cmd.options[i].flags)
//             }
//             return false
//         }
//
//         switch(action) {
//             case 'balanceOf':
//             if(cmd.address) {
//                 query.getBalance(cmd.address)
//             } else {
//                 query.getBalance(account.getAdmin())
//             }
//             break
//             case 'specification':
//             query.specification()
//             break
//             case 'totalSupply':
//             query.totalSupply()
//             break
//             case 'allowance':
//             if (!cmd.owner || !cmd.spender) {
//                 console.log(`\n  ` + chalk.red(`Unknown command\n`))
//                 console.log('  Options:')
//                 console.log(`  ` + '-o : owner')
//                 console.log(`  ` + '-s : spender')
//                 console.log(`  ` + '-n : network\n')
//                 return false
//             }
//                 query.allowance(cmd.owner, cmd.spender)
//                 break
//             case 'feeState':
//                 query.feeState()
//                 break
//             case 'proposeSatatus':
//                 query.proposeSatatus(cmd.id)
//                 break
//             case 'transactionConfirmStatus':
//                 query.transactionConfirmStatus(cmd.id)
//                 break
//             case 'blockNumber':
//                 query.blockNumber()
//                 break
//             case 'curIndex':
//                 query.curIndex()
//                 break
//             default:
//                 console.log("no action")
//         }
//     })

program
    .command('query <action>')
    .option('-c, --contract <contract>', 'contract')
    .option('-m, --method <method>', 'method')
    .option('-p, --params <params>','params')
    .description('Query')
    .action((action, cmd) => {
        let contractName = "YEED"
        if (cmd.contract) {
            contractName = cmd.contract
        }
        let params = {}
        if (cmd.params) {
            params = JSON.parse(cmd.params)
        }
        queries.query(contractName, action, params)
    })

program
    .command('contract <action>')
    .option('-C, --contractId <contractId>', 'contractId')
    .description('Query')
    .action((action, cmd) => {
        if (action == "getContracts") {
            contract.getContracts()
        }
    })

program
    .command('invoke <action>')
    .option('-a, --address <address>', 'address')
    .option('-c, --contract <contract>', 'contract')
    .option('-m, --method <method>', 'method')
    .option('-p, --params <params>','params')
    .option('-o, --passwd <passwd>', 'passwd')
    .description('invoke Transaction')
    .action((action, cmd) => {
        // action is method name
        let accountAddress = account.getAdmin()
        if (cmd.passwd) {
          let contractName = "YEED"
          if (cmd.contract) {
            contractName = cmd.contract
          }
          let params = {}
          if (cmd.params) {
            params = JSON.parse(cmd.params)
          }
          invokeTx.invoke(cmd.passwd, contractName, action, params)
        } else {
          inquirer.prompt([{
            name: 'password',
            type: 'password',
            message: cmd.address ? cmd.address + ' password:' : accountAddress + ' password:'
          }]).then((answers) => {
            let contractName = "YEED"
            if (cmd.contract) {
              contractName = cmd.contract
            }
            let params = {}
            if (cmd.params) {
              params = JSON.parse(cmd.params)
            }

            invokeTx.invoke(answers.address, answers.password, contractName, action, params)
          })
        }
    })
    // {"receiveAddress":"4e5cbe1d0db35add81e7f2840eeb250b5b469161","receiveAsset":"100","receiveChainId":-1,"senderAddress":"101167aaf090581b91c08480f6e559acdd9a3ddd","networkBlockHeight":0,"proposeType":1,"inputData":null,"stakeYeed":"1","blockHeight":1000000,"fee":"10"}

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
        console.log(`\n  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}\n`))
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
