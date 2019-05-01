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
    }
};

module.exports = all;