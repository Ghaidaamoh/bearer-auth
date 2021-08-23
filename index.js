'use strict';

const server = require('./src/server')
require('dotenv').config();

server.start(process.env.PORT)

const { db } = require('./src/models/index');
//the port should be from the .evn file
db.sync()
    .then(() => {
        server.start(3090);
    })
    .catch(console.error);