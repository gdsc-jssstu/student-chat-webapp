// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause
 
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const http = require('http');

class Server {
    constructor(config) {
        this.express_app = express();
        this.http_server = http.Server(this.express_app);
        this.port = config.port;

        // Set-up express middle-wares
        const app = this.express_app;
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(express.static(config.static_dir));
        // TODO: add those middle wares

        // Register routes
        this.register_routes();
    }

    run(callback) {
        const port = this.port || 3000;
        this.http_server.listen(port, callback);
    }

    register_routes() {
    }
}

module.exports = Server;
