// Author: GDSC JSSSTU Core-team
// SPDX-License-Identifier: BSD-2-Clause

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyPraser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const Student = require('./models/StudentSchema')(mongoose, passport);
const UserRoutes = require('./routes/UserRoutes')(Student, passport);
const ApplicationRoutes = require('./routes/ApplicationRoutes')();

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
        app.use(bodyPraser.urlencoded({extended:true}));
        app.use(session({
          secret: config.secret,
          resave: false,
          saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        mongoose.connect(config.db)

        // Register routes
        this.register_routes();
    }

    run(callback) {
        const port = this.port || 3000;
        this.http_server.listen(port, callback);
    }

    register_routes() {
        const app = this.express_app;
        app.post("/register",UserRoutes.registerRoute);
        app.post("/login",UserRoutes.loginRoute);
        app.get("/logout",UserRoutes.logoutRoute);
        app.get("/chat",ApplicationRoutes.chat);
    }
}

module.exports = Server;
