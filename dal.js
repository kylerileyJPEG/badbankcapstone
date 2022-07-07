const MongoClient = require('mongodb').MongoClient;
const url         = 'mongodb://localhost:27017';
let db            = null;
 

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
    console.log("Connected successfully to db server");
    db = client.db('myproject');
});


function create(name, email, password){
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}


function getBalance(userID) {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .find({"userID": userID})
            .toArray(function(err,user) {
                err ? reject(err) : resolve (user);
            });
    })
}



function updateUserBalance(userID, newBalance){
    return new Promise((resolve, reject) => {    
        const customer = db
            .collection('users')            
            .updateOne({"userID": userID }, {$set : {"balance" : newBalance} })
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });  
    });   
}



function updateActivity(userID, depositDateTime,newBalance ) {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .updateOne({"userID" : userID}, {$push : {"activity" : {"datetime" : depositDateTime, "balance" : newBalance}}})
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });
    })
}

function all(){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}


module.exports = {create, getBalance, updateUserBalance, updateActivity, all};