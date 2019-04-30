'use strict';

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        callback(err, data);
    });
}

class Profile {
    constructor({username, name, password}) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.wallet = {};   // добавил свойства для будущего кошелька валют
    }

    createUser({username, name, password}, callback) {

        console.log(`Creating user ${username}`);

        return ApiConnector.createUser({username, name, password}, (err, data) => {
            console.log(`${name.firstName} is created!`);
            callback(err, data);
        });
    }

    performLogin({username, password}, callback) {
        return ApiConnector.performLogin({username, password}, (err, data) => {
            console.log(`${username} is authorized!`);
            callback(err, data);
        });
    }    

    addMoney({currency, amount}, callback) {
        return ApiConnector.addMoney({currency, amount}, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
        return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
            //const dataToPrint = {name, wallet, username};
            //console.log(`Converted to coins ${dataToPrint}`);     // здесь нужно как-то добавить {name, wallet, username}
            callback(err, data);
        });
    }

    transferMoneyMoney({to, amount}, callback) {
        return ApiConnector.transferMoney({to, amount}, (err, data) => {
            //console.log(`${this.username} has got ${amount} ${wallet}`);      // здесь еще не готово; дописать код
            callback(err, data);
        });
    }
}

function main() {
    const Ivan = new Profile({
        username: 'ivan',
        name: {firstName: 'Ivan', lastName: 'Chernyshev'},
        password: 'ivanpass',
    });

    Ivan.createUser({
        username: 'ivan',
        name: {firstName: 'Ivan', lastName: 'Chernyshev'},
        password: 'ivanapass',
    });
    
    const Petr = new Profile({
        username: 'petya',
        name: {firstName: 'Petya', lastName: 'Chernyshev'},
        password: 'petyapass',
    });
    
    Ivan.createUser({
        username: 'petya',
        name: {firstName: 'Petya', lastName: 'Chernyshev'},
        password: 'petyapass',
    });
    
    Ivan.performLogin({
        username: 'ivan',    
        password: 'ivanpass',
    });
    
    Ivan.addMoney({currency: 'RUB', amount: 100}, (err, data) => {
        if (err) {
            console.error('Error during adding money to Ivan');
            } else {
                console.log(`Added 500000 euros to Ivan`);
        }
    });

    //getStocks();      // здесь еще не готово; дописать код

    //convertMoney(ivan);      // здесь еще не готово; дописать код

    //transferMoney(ivan -> petr);      // здесь еще не готово; дописать код

}

main();