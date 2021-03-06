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
- new - Generate account
- import - Import account
- export - Export account
- getAccounts - Account list
- getAccount - View specific account
- admin - Admin account
- clear - Clear account

### Node Control
The node control is only available in the admin account.
- build
- start
- status
- stop

### STEM(soon)
- plant - Transactions that register a branch with the stem

### Branch
- init - Create a seed file and a contract template
- build - Build the created contract and create a branch file.
- deploy - Deploy to node
- list - View branch
- set - Checked out branch
- status - View current branch

### Transaction
- transfer - Asset transfer
- transferFrom - Set up the account to be transferred and transfer it.
- approve - In my account, grant some rights to the amount of money available to a particular account.

### Query
- balanceOf - Account Balance Display
- specification - It shows the specification of the branch.
- totalSupply - Show the total supply of the branch.
- allowance - It is possible to see how much the owner gave the quota to a particular address.

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

## Non-Interactive use (recommended)
```
$ ygg <command> [options]
```

## License
This project is licensed under the [MIT License](LICENSE).
