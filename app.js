// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause
 
const Server = require('./server');

const server_config = {
    // The port at which the backend runs.
    port: 3000,

    // Static files folder name
    static_dir: 'public'
};

const server = new Server(server_config);
server.run(() => {
    console.log(`Server listening at ${server_config.port}`);
});

