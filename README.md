# YGGDRASH CLI
YGGDRASH CLI allows you to communicate with a remote or local node and carry out YGGDRASH-related functionality using an interactive or non-interactive command line tool.

## Requirements
- Node.js
- NPM
- [YGGDRASH Node](https://github.com/yggdrash/yggdrash)

## Installation
```sh
$ npm install -g @yggdrash/cli
```

## Usage
### Interactive use
```
$ ygg console
                           __                __
    __  ______ _____ _____/ /________ ______/ /_
   / / / / __ `/ __ `/ __  / ___/ __ `/ ___/ __ \
  / /_/ / /_/ / /_/ / /_/ / /  / /_/ (__  ) / / /
  \__, /\__, /\__, /\__,_/_/   \__,_/____/_/ /_/
 /____//____//____/

ygg> 
```

#### Example
```
ygg> ygg.fromYeedTransfer(ygg.getAccount(0), "0x407d73d8a49eeb85d32cf465507dd71d507100c1", 100)

{ jsonrpc: '2.0',
  id: 'f799eb35-1ede-485a-8881-1575b29c8cc8',
  result:
   '{[get : {"to":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1","value":"100"}][result : {txhash : 0x76a9fa4681a8abf94618543872444ba079d5302203ac6a5b5b2087a9f56ea8bf}]}' }
```
## Method
```
wallet
createAccount
getAccounts
getAccount
createBranch
createBranchJson
plantToStem
fromYeedTransfer
getYeedBalance
```

## License
This project is licensed under the [MIT License](LICENSE).
