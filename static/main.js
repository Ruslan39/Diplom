'use strict';

class Profile {
    constructor({username, name, password}) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.wallet = {};
        this.isCreated = false;
        this.isLogged = false;
    }

    createUser(callback) {
        console.log(`Creating user ${this.username}`);

        return ApiConnector.createUser(this, (err, data) => {
            if (data) {
                this.isCreated = true;
                console.log(`${this.name.firstName} is created!`);
                callback();
            } else {
                console.log(`Failed to create user. User ${this.name.firstName} already exists.`);
            }
        });
    }

    performLogin(callback) {
        if (this.isCreated === true) {
            console.log(`Authorizing user ${this.username}`);

            return ApiConnector.performLogin(this, (err, data) => {
                if (data) {
                    this.isLogged = true;
                    console.log(`${this.name.firstName} is authorized!`);
                    callback();
                } else {
                    console.log(`Failed to authorize user. Please try again.`);
                }
            });

        } else {
            console.log(`User ${this.username} doesn\`t exist`);
        }
    }
 
    addMoney({currency, amount}, callback) {
        if (this.isLogged === true) {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);

            return ApiConnector.addMoney({currency, amount}, (err, data) => {
                if (data) {
                    this.wallet[currency] = amount;
                    console.log(`Added ${amount} of ${currency} to ${this.username}`);
                    callback();
                } else {
                    console.log(`Error during adding money to ${this.name.firstName}`);
                }
            });
        }
    }

    convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {        
        console.log(`Converting ${fromCurrency} to ${targetAmount} Netcoins`);

        let currencyChange = (targetAmount * stocks[99][`NETCOIN_${fromCurrency}`]);
        if (currencyChange > this.wallet[fromCurrency]) {
            console.log(`Error during converting money: not enough money to complete the operation`);

        } else {
            return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
                if (data) {
                    this.wallet[fromCurrency] = this.wallet[fromCurrency] - currencyChange;
                    this.wallet[targetCurrency] = targetAmount;

                    let profileToPrint1 = 'Converted to coins';
                    let profileToPrint2 = {
                        name: this.name,
                        wallet: this.wallet,
                        username: this.username
                    }
                    console.log(profileToPrint1, profileToPrint2);
                    
                    callback();
                } else {
                    console.log(`Error during converting money`);
                }
            });
        }        
    }

    transferMoney({to, amount}, callback) {
        console.log(`Transfering ${amount} of Netcoins to ${to}`);

        if (amount <= this.wallet.NETCOIN) {
            return ApiConnector.transferMoney({to, amount}, (err, data) => {
                if (data) {
                    this.wallet.NETCOIN = this.wallet.NETCOIN - amount;
                    this.wallet.NETCOIN = this.wallet.NETCOIN + amount;     // здесь должен быть Petya, но как получить доступ?
                    
                    console.log(`${this.name.firstName} has got ${amount} NETCOINS`);   // как получить доступ к Petya?
                    callback();
                } else {
                    console.log(`Error during transfering money`);
                }
            });
        } else {
            console.log(`Not enough money to complete the operation`);
        }
    }
}

let stocks = [];

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);

        if (data) {
            for (let i = 0; i < data.length; i++) {
                stocks[i] = data[i];
            }
            callback();
        } else {
            console.log(`Error during getting Stocks info`);
        }  
    });
}

getStocks(function() {
    main();
});

function main() {
    const Ivan = new Profile({
        username: 'ivan',
        name: {firstName: 'Ivan', lastName: 'Chernyshev'},
        password: 'ivanpass'
    });

    const Petya = new Profile({
        username: 'petya',
        name: {firstName: 'Petya', lastName: 'Chernyshev'},
        password: 'petyapass'
    });
    
    Ivan.createUser(function() {
        Ivan.performLogin(function() {
            Ivan.addMoney({currency: 'EUR', amount: 500000}, function() {
                Ivan.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: 2000}, function() {
                    Petya.createUser(function() {
                        Ivan.transferMoney({to: 'petya', amount: 1000}, function() {    //callback to be deleted
                            console.log(Ivan);      //to be deleted
                            console.log(Petya);     //to be deleted
                        });
                    });
                });
            });
        });
    });
   
}