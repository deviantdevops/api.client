
const settings = {
  
    development: {
        APP_KEY:'',
        URL:'http://localhost:7004',
        PORT: 7004,
        DB: {
            LMDB: {
                path: process.env.DB_PATH || './database/store.db',
                compression: true,
                encryptionKey: process.env.DB_KEY || 'UazTcM5s5WE6GZvRYZMcjbzJuhbyXR7P',
                dupSort: false,
                maxDbs: 5,
                maxReaders: 5
            },
            MONGO:{
                HOST: process.env.MONGO_HOST || "",
                USER: process.env.MONGO_USER || "",
                PASSWORD: process.env.MONGO_PASSWORD || "",
                DATABASE: process.env.MONGO_DB || "",
                OPTIONS:{
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                AUTH_MECHANISM: "SCRAM-SHA-256"
            },
            REDIS:{
                HOST: process.env.REDIS_HOST || "",
                PASSWORD: process.env.REDIS_PASSWORD || "",
                PORT: process.env.REDIS_PORT || 6379,
            },
        },
        
        KEYSERVER:"http://localhost:7001",
        API: {
            ROLES: "http://localhost:7005"
        },
        PKI:{
            PUBLIC_KEY: "x1KKEybQogLiCQNOQuWfWmMbu/rLReWSFi7sxv4cUiY=",
            PRIVATE_KEY: "Zo3CllvzmQGX5/mH+OkbzEQg4DI9MayO+LJQ+ziSvvk="
        }
        
    },

    "production": {
        "APP_KEY":{},
        "PORT": 7004,
        "MONGO":{
            "HOST": "localhost",
            "USER": "hibberdk",
            "PASS": "CyberKen10**",
            "DATABASE": "FAFL_001_DE",
            "OPTIONS": {
                "useNewUrlParser": true,
                "useUnifiedTopology": true
            }
        },
        "REDIS":{
            "HOST": "",
            "PASS": ""
        }
    },

    "staging": {
        "APP_KEY":{},
        "PORT": 7004,
        "MONGO":{
            "HOST": "mongodb",
            "USER": "digitalmongo",
            "PASS": "Hbd6ygBJEJgCujLf7u",
            "DATABASE": "FAFL_001_DE",
            "OPTIONS": {
                "useNewUrlParser": true,
                "useUnifiedTopology": true
            }
        },
        "REDIS":{
            "HOST": "",
            "PASS": ""
        }
    }
    
    
};

const config = () => {
    let configuration = settings[process.env.NODE_ENV];
    configuration.APP_NAME = 'DeviantCode Client API';
    configuration.COMPANY_NAME = 'DeviantCode';
    configuration.REALM = '@DeviantCode';
    configuration.COMPANY_URL = 'https://deviant.code';
    global.config = configuration;
}

module.exports = config();