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

        return ApiConnector.createUser((this), (err, data) => {
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

            return ApiConnector.performLogin((this), (err, data) => {
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

        let getBestCourse = []; // Подбираем наименьший курс обмена

        for (let i = 0; i < stocks.length; i++) {
            getBestCourse[i] = stocks[i][`NETCOIN_${fromCurrency}`];            
        }
        
        let minCourse = Math.min.apply(null, getBestCourse);

        targetAmount = (this.wallet[fromCurrency] / minCourse);
        console.log(`Converting ${fromCurrency} to ${targetAmount.toFixed(2)} Netcoins`);

        return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
            if (data) {
                this.wallet[fromCurrency] = 0;
                this.wallet[targetCurrency] = targetAmount;                
                console.log(`Converted to coins`);              // почему здесь ${this}, например, не работает???
                //console.log(this.wallet);                     // хотя здесь работает!
                callback();
            } else {
                console.log(`Error during converting money`);
            }
        });
    }

    transferMoney({to, amount}) {
        amount = +(this.wallet[NETCOIN]);
        
        return ApiConnector.transferMoney({to, amount}, (err, data) => {
            if (data) {
                this.wallet[NETCOIN] = 0;
                [to].wallet[NETCOIN] = amount;
                console.log(`${to} has got ${amount} NETCOINS`);
            } else {
                console.log(`Error during transfering money`);
            }
        });
    }
}

let stocks = [];

function getStocks() {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        
        for (let i = 0; i < data.length; i++) {
            stocks[i] = data[i];
        }        
    });
}

getStocks();

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
                Ivan.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: 0}, function() {
                    Petya.createUser(function() {                        
                        Ivan.transferMoney({to: 'Petya', amount: 0});
                    });
                });
            });
        });
    });
   
}

main();