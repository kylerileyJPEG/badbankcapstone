const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url         = 'mongodb+srv://kylechristopherriley:kylechristopherriley@badbank.fdvh7.mongodb.net/?retryWrites=true&w=majority';
let db            = null;
const dbName      = "badbank"

// connect to mongo
const getDbInstance = (config) => new Promise((resolve,reject) => {
    const client = new MongoClient(config.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    client.connect((error) => {
        if(error){
            console.error(error);
            reject(error);
        }
        let db = client.db(config.dbName);
        resolve(db);
    })
})


const doSomeDbOperations = async() => {
    //hardcoding it here, but this config will probably come from environment variables in your project
    const config = {
        dbUrl: "mongodb+srv://kylechristopherriley:kylechristopherriley@badbank.fdvh7.mongodb.net/?retryWrites=true&w=majority",
        dbName: "badbank"
    };

    try{
        const db = await getDbInstance(config);

// create user account
function create(name, email, password){
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// find user account
function find(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({email: email})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

// find user account
function findOne(email){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .findOne({email: email})
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));    
    })
}

// update - deposit/withdraw amount
function update(email, amount){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')            
            .findOneAndUpdate(
                {email: email},
                { $inc: { balance: amount}},
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );            


    });    
}

// all users
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


module.exports = {create, findOne, find, update, all};

}catch(e){
    console.error(`ERROR: `,e);
}

}

doSomeDbOperations();