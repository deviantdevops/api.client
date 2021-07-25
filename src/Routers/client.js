var express = require('express');
var router = express.Router();
const Validate = require('validate.js');
const Client = require('../Classes/Client');
/**
 * Create a New backend client
 */
router.post('/', function(req, res, next) {
    let params = req.body
    var constraints = {
        "email":{presence: true,type: "string"},
        "app_name":{presence: true, type: "string"},
        "callback":{presence: true, type: "string"},
        "host":{presence: true, type: "string"},
        "ip":{presence: true, type: "string"},
        "is_mobile": {presence: true, type: "boolean"},
        "realm": {type: "string"}
    }
    Validate.async(params, constraints)
        .then( async (success) => {
            (!params.realm)? params.realm = global.config.REALM : '';
            let client = new Client(params);
            let results = await client.create();
            return res.status(200).send(results).end();
        })
        .catch(err => {
            console.log(err)
            return res.status(402).send(err);
        });
});
/**
 * Get a Client and validate
 */
router.get('/', function(req, res, next) {
    let params = req.query
    var constraints = {
        "client_id":{presence: true, type: "string"}  
    }
    Validate.async(params, constraints)
        .then( async (success) => {
            try{
                let doc = await Client.get({key: params.client_id})
                return res.status(200).send(doc).end();
            }catch(error){
                return res.status(404).send('Client not found').end();
            }
        })
        .catch(err => {
            console.log('CLIENT KEY ERROR:', err)
            return res.status(401).send('NOT A VALID CLIENT TOKEN').end()
        })
});

router.post('/validate', function(req, res, next) {
    let params = req.body
    var constraints = {
        "client_key":{presence: true, type: "string"}  
    }
    Validate.async(params, constraints)
        .then( async (success) => {
            try{
                let doc = await Client.validate({client_key: params.client_key})
                return res.status(200).send(doc).end();
            }catch(error){
                return res.status(404).send('Client not found').end();
            }
        })
        .catch(err => {
            console.log('CLIENT KEY ERROR:', err)
            return res.status(401).send('NOT A VALID CLIENT TOKEN').end()
        })
});

/**
 * Initialize a Mobile client.
 * 
 */
router.get('/init', function(req, res, next){
    console.log('CLIENT INIT SYSTEM')
    let params = req.query
    var constraints = {
        "client_id":{presence: true,type: "string"},
        "code_challenge":{presence: true, type: "string"},
        "fingerprint":{presence: true, type: "string"},
    }
    Validate.async(params, constraints)
        .then( async (success) => {
            Client.init({client_id:params.client_id, code_challenge:params.code_challenge, fingerprint:params.fingerprint})
            .then(redirect_url => {
                return res.status(200).send(redirect_url).end()
            })
            .catch(err => {
                console.log('CLIENT ERROR ', err)
                return res.status(401).send('NOT A VALID CLIENT TOKEN').end()
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(402).send(err);
        });
});


module.exports = router;