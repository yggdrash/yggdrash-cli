# YGGDRASH CLI
YGGDRASH CLI allows you to communicate with a remote or local node and carry out YGGDRASH-related functionality using an interactive or non-interactive command line tool.

## Requirements
- Node ≥ v10.12.0
- NPM ≥ v6.4.1
- Yarn ≥ 1.12.3

- [YGGDRASH Node](https://github.com/yggdrash/yggdrash)

# Docs
- [Documentation](https://github.com/yggdrash/yggdrash-cli/tree/develop/docs)
- [Getting Start](https://developer.yggdrash.io/)

## Installation
```sh
$ yarn global add @yggdrash/cli
```

## Method
### Wallet
- create - Generate account
- getAccounts - Account list
- getAccount - View specific account
- coinbase - admin account
- clear - clear account

### Node Control
- restart
- setConfig

### STEM
- plant - Transactions that register a branch with the stem

### Branch
- branch init - Create a seed file and a contract template
- branch build - Build the created contract and create a branch file.
- branch deploy - Deploy to node
- transfer - Coin transfer
- transferFrom - Coin transfer
- getBalance - Account Balance Display

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

## Non-Interactive use
```
$ ygg <command> [options]
```

## License
This project is licensed under the [MIT License](LICENSE).
