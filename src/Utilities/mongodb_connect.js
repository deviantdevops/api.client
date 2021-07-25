const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');

const MONGO = {
    init: async () => {
        return new Promise( async (resolve, reject) => {
            if(global.config.MONGO.USER.length > 0){
                try{
                    await mongoose.connect('mongodb://'+ global.config.MONGO.USER +':'+ global.config.MONGO.PASS +'@'+ global.config.MONGO.HOST +'/'+ global.config.MONGO.DATABASE +'', global.config.MONGO.OPTIONS );
                    let DB = mongoose.connection;
                    DB.on('error', console.error.bind(console, 'connection error:'));
                    DB.on('connecting', function() {console.log('Connecting to MongoDB')});
                    DB.on('connected', function() {console.log('Successfully Connected to MongoDB')});
                    resolve(DB)
                }catch(err){
                    console.log('MONGO ERR: ', err)
                    reject('MONGO ERR: ', err)
                }
            } 
        }); 
    }
}

module.exports = MONGO.init();
