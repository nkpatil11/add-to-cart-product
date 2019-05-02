'use strict';

var all = {
    // MongoDB connection options
    mongo: {
        url: "mongodb://localhost/mynewtask-db"
    },
    seedDB: true,

    server_port: 8080,

    secrets: {
        session: 'mynew-secret'
    },
    expires: {
        expiresIn: '2h'
    },

    // replace with your email-smtp credential
    accessKeyId: 'your_access_key_id',
    secretAccessKey: 'your_secret_access_key',
    serviceUrl: 'serviceurl.com',

    // replace with your email which have access to send email by nodemailer
    email: {
        from: 'your@mail.com'
    },

    // replace with your stripe SECRET KEY
    keySecret: 'sk_test_xxxxxxxxxxxxxYourKeySecret'
};

module.exports = all;