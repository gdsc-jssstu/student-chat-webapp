// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause
 
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

class Server {
    constructor(config) {
        this.express_app = express();
        this.port = config.port;

        // Set-up express middle-wares
        const app = this.express_app;
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(express.static(config.static_dir));
    }

    run(callback) {
        const port = this.port || 3000;
        this.express_app.listen(port, callback);
    }
}

module.exports = Server;
