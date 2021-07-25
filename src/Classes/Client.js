const { v1: uuid } = require('uuid');
const axios = require('axios');
const MD5 = require('md5');
const DB = require('../Utilities/database');
const CRYPT = require('@deviantcode/crypt');
const randomstring = require("randomstring");


class Client {

    constructor({email, host, ip, app_name, realm, callback, is_mobile = false}){
        
        this.active = true;
        this.secret = randomstring.generate({
            length: 32,
            charset: 'alphabetic'
        });

        this.email = email,
        this.host= host,
        this.ip = ip,
        this.app_name = app_name,
        this.realm = realm,
        this.callback = callback,
        this.public_key = '',
        this.private_key = '',
        this.is_mobile = is_mobile

    }

    create(){
        console.log('CREATING NEW CLIENT')
        return new Promise( async (resolve, reject) => {
            let pki = await CRYPT.pkiGen();
            let client = {
                payload: {
                    created_at: Date.now(),
                    client_id: uuid(),
                    email: await CRYPT.encrypt(this.email),
                    host: await CRYPT.encrypt(this.host),
                    ip: await CRYPT.encrypt(this.ip),
                    secret: await CRYPT.encrypt(this.secret),
                    app_name: await CRYPT.encrypt(this.app_name),
                    realm: this.realm,
                    callback: await CRYPT.encrypt(this.callback),
                    public_key: await CRYPT.encrypt(pki.public),
                    private_key: await CRYPT.encrypt(pki.private),
                    is_mobile: this.is_mobile,
                },
                updated_at: Date.now(),
                last_use: Date.now(),
                active: this.active
            }
            client.hash = await CRYPT.hash(JSON.stringify(client.payload));
            let token = await CRYPT.sign({
                client_id: client.client_id,
                hash: client.hash
            });
            client.shash = token.token
            //Save Client to DB
            let entry = await DB.put({
                key: client.payload.client_id,
                value: client
            })
            //Generate Client Access Token
            let certPayload = {
                "issued_from": global.config.REALM,
                "client_id": client.payload.client_id,
                "callback": this.callback,
                "created_at": client.payload.created_at,
                "hash": client.hash,
            }
            let client_access_token = await CRYPT.generate(certPayload, 17600);

            let results = {
                client_id: client.payload.client_id,
                secret: this.secret,
                client_key: client_access_token.token,
            }
            resolve(results)

        })  
    }

    static get({key}){
        return new Promise( async (resolve, reject) => {
            let doc = false
            try{
                doc = await DB.findOne({key})
            }catch(error){
                reject(error)
            }
            if(doc.key !== undefined){
                let parsed = JSON.parse(doc.value)
                let hash = await CRYPT.hash(JSON.stringify(parsed.payload));
                //Validate Data
                if(hash !== parsed.hash){
                    reject('Client data has been corrupted')
                }
                //TODO add signature validation here
                //Decrypt payload
                resolve({
                    created_at: parsed.payload.created_at,
                    client_id: parsed.payload.client_id,
                    email: await CRYPT.decrypt(parsed.payload.email),
                    host: await CRYPT.decrypt(parsed.payload.host),
                    ip: await CRYPT.decrypt(parsed.payload.ip),
                    app_name: await CRYPT.decrypt(parsed.payload.app_name),
                    realm: parsed.payload.realm,
                    callback: await CRYPT.decrypt(parsed.payload.callback),
                    public_key: await CRYPT.decrypt(parsed.payload.public_key),
                    is_mobile: parsed.payload.is_mobile, 
                })
            }
        })
    }

    static validate({client_key}){
        return new Promise( async (resolve, reject) => {
            let results = await CRYPT.validate(client_key)
            if(results.decoded !== undefined){
                let data = results.decoded.data
                let client_id = data.payload.client_id;
                try{
                    let client = await module.exports.get({key: client_id})
                    resolve(client)
                }catch(error){
                    consol.log(error)
                    reject()
                } 
            }
            reject()
        })
    }

    update(payload) {

    }

    delete() {

    }

    getall() {
        return new Promise( (resolve, reject) => {
            
        })
    }

    /**
     * For mobile clients we are getting the client model so that we have access to the public key.
     * Generate a random string and send to the client to decrpyt.
     * Mobile client must return the valid answer with the JWT for validation
     */
    static init({client_id, code_challenge, fingerprint}) {
        return new Promise( async (resolve, reject) => {
            module.exports.get({key: client_id})
            .then(async client => {
                let secret = randomstring.generate({
                    length: 64,
                    charset: 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789'
                });
                let encSecret = await CRYPT.naclEncrypt(secret, client.public_key, global.config.PKI.PRIVATE_KEY)
                /**
                 * Generate a JWT using the code_challenge, fingerprint and public_key
                 */
                let payload = {
                    "code_challenge": code_challenge,
                    "client_id": client_id,
                    "secret": secret,
                    "fingerprint": fingerprint,
                }
                let code, access_token;
                try{
                    access_token = await CRYPT.generate(payload)
                }
                catch(error){
                    console.log(error)
                }
                code = access_token.token;
                console.log(Base64.encode(encSecret, true))
                let url = `${client.callback}?code=${code}&secret=${Base64.encode(encSecret, true)}`
                resolve(url)
                return;
            })
            .catch(error => {
                reject(error)
            })
        });
    }

}

module.exports = Client;