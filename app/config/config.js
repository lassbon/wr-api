'use strict';

let appName = 'progo or workRaven';
const config = {
    appName: appName,
    environment: process.env.NODE_ENV,
    web: {
        port: process.env.APP_PORT
    },
    mysql: {
        connection: {
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            debug: process.env.DATABASE_DEBUG ? ['ComQueryPacket'] : false
        },
        pool: {
            min: (process.env.DATABASE_POOL_MIN) ? parseInt(process.env.DATABASE_POOL_MIN) : 2,
            max: (process.env.DATABASE_POOL_MAX) ? parseInt(process.env.DATABASE_POOL_MAX) : 2
        }
    },
    logging: {
        file: process.env.LOG_PATH || '/tmp/progo.log',
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN)
    },
    apiTestUser: 
    {
        userFirstname: 'Abayomi', 
        userLastname: 'Rasheed',
        userOthername: 'Abu Mariam',
        userPhoneNumber: '1234567890',
        userAddress: 'Sabo Yaba Lagos',
        userEmail: 'abc@gmail.com',
        userDOB: '27-12-2010',
        country: 'Nigeria',
        state: 'Lagos',
        userImageURL: 'coming soon',
        userAccountNumber: "1234567890",
        userAccountName: 'Abayomi Rasheed',
        userBVN: '120354278',
        termsAndCondition: true,
        isApproved: true,
        isFacebook: false,
        isTwitter: false,
        isGoogle: false,        
        userName: process.env.API_TEST_USER_EMAIL,
        password: process.env.API_TEST_USER_PASSWORD
    }

};

module.exports = config;
