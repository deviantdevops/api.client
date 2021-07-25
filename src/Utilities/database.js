const LMDB = require('lmdb');
const rootStore = LMDB.open(global.config.DB.LMDB)
const store = rootStore.openDB('store')
const { v1: uuid } = require('uuid');


module.exports = {
    getDB: (sort = 'asc') => {
        var arr = Array.from(store.getRange());
        arr.sort( (a, b) => a.value.created_at < b.value.created_at && (sort === 'asc')? -1 || 1 : 1 || -1 )
        return arr;
    },

    dbLength:() => {
        var arr = Array.from(store.getRange());
        return arr.length;
    },

    put: ({key, value}) => {
        console.log('Saving new entry', key)
        return new Promise( async (resolve, reject) => {
            if(typeof value !== 'string' || typeof value !== 'String'){
                value = JSON.stringify(value);
            }
            try{
                let results = await store.put( key, value );
                if(results){
                    let record = await module.exports.findOne(key)
                    resolve(record);
                }
            }catch(error){
                console.error('DATABASE ERROR 27:', error);
                reject(error);
            } 
        }) 
    },

    findOne:({key}) => {
        console.log('FINDING ONE:', key)
        return new Promise( (resolve, reject) => {
            var arr = Array.from(store.getRange());
            resolve(arr.find( elem => elem.key === key))
        });
    },

    findMany:(condition) => {
        return new Promise( (resolve, reject) => {
            var arr = Array.from(store.getRange());
            arr
            .filter( entry => entry.key === condition)
            .sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && 1 || -1) //newest -> oldest
            resolve(arr); 
        });
    },

    deleteOne:({key}) => {
        store.remove(key)
    },

    deleteMany: (condition) => {
        return new Promise( (resolve, reject) => {
            let arr = Array.from(store.getRange());
            let arrRemoved = [];
            arr
            .filter( entry => condition)
            .sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && 1 || -1) //newest -> oldest
            arr.forEach(e => {
                arrRemoved.push(e.key)
                store.remove(e.key)
            })
            resolve(arrRemoved); 
        });
    },

    normalize:(str) => {
        str = str.replace(/[.,\/#!@$%\^&\*;:{}=\-_`~()]/g, '')
        str = str.trim();
        str = str.toLowerCase();
        return str;
    }

}






/** 


class DB {

    constructor(){}
    
    getDB(sort = 'asc'){
        var arr = Array.from(store.getRange());
        arr.sort( (a, b) => a.value.created_at < b.value.created_at && (sort === 'asc')? -1 || 1 : 1 || -1 )
        return arr;
    }
   
    dbLength(){
        var arr = Array.from(store.getRange());
        return arr.length;
    }
    
    put({key, value}){
        try{
            this.store.put( key, value );
            return value;
        }catch(error){
            console.error('DATABASE ERROR 27:', error);
            return error;
        } 
    }
    
    search(condition){
        var arr = Array.from(store.getRange());
        arr
        .filter( entry => entry.key === condition)
        .sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && 1 || -1) //newest -> oldest
        return arr; 
    }

    delete({key}){
        store.remove(key)
    }

   


    transactionGenesisBlock(){
        console.log('Setting GENESIS Block')
        transactionStore.ifNoExists('genesis', () => {
            transactionStore.put('genesis', global.config.GENESIS_BLOCK );
        })
        return global.config.GENESIS_BLOCK;
    }

    transactionBlockCount(){
        var arr = Array.from(transactionStore.getRange());
        return arr.length;
    }

    transactionPutBlock(block){
        try{
            transactionStore.put(block.payload.id, block );
            return block;
        }catch(error){
            console.error('DATABASE ERROR 20:', error);
            return error;
        }  
    }
  
    transactionLastBlock(){
        var arr = Array.from(transactionStore.getRange());
        arr.sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && 1 || -1)
        return arr[0].value;
    }

    transactionChain(){
        var arr = Array.from(transactionStore.getRange());
        arr.sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && -1 || 1)
        return arr;
    }

    getWalletTransactions(address){
        var arr = Array.from(transactionStore.getRange());
        arr
        .filter( transaction => transaction.key === address)
        .sort((a, b) => a.value.payload.created_at < b.value.payload.created_at && 1 || -1) //newest -> oldest
        return arr; 
    }

    
}

**/