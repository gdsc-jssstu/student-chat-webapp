// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause

require('dotenv').config();
const Server = require('./server');

const server_config = {
    // The port at which the backend runs.
    port: 3000,

    // URI to the mongo database
    db: process.env.db || "mongodb://localhost:27017/studentsDB",

    // Static files folder name
    static_dir: 'public',

    secret: process.env.secret || "SUPERSECRET" 
};

const server = new Server(server_config);
server.run(() => {
    console.log(`Server listening at ${server_config.port}`);
});
