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
const socketio = require('socket.io');

class Client {
    constructor(socket, username) {
        this.socket = socket;
        this.username = username;
    }
}

class Server {
    constructor(config) {
        this.connected_clients = []
        this.express_app = express();
        this.http_server = http.Server(this.express_app);
        this.port = config.port;

        // Set-up express middle-wares
        const app = this.express_app;
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(express.static(config.static_dir));
        app.use(bodyPraser.urlencoded({extended:true}));

        const express_session = session({
          secret: config.secret,
          resave: false,
          saveUninitialized: false
        });

        app.use(express_session);
        app.use(passport.initialize());
        app.use(passport.session());

        // Hook-in express-session to the socket-io Server
        this.sockio = new socketio.Server(this.http_server)
            .use((socket, next) => {
            express_session(socket.request, {}, next);
        });

        mongoose.connect(config.db)

        // Register routes
        this.register_routes();

        // Register socket io listener
        this.register_sockio_listeners();
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
        app.get("/users", (_, res) => res.json(this.get_username_list()));
    }

    register_sockio_listeners() {
        this.sockio.on('connection', (socket) => {
            if (socket.request.session.passport === undefined) {
                socket.disconnect();
                return;
            }
            const username = socket.request.session.passport.user;
            console.log(`[SOCKET LOG] ${username} connected`);
            const client = new Client(socket, username);

            this.connected_clients.push(client);
            this.sockio.emit('join', {username: username});

            socket.on('disconnect', () => {
                console.log(`[SOCKET LOG] ${username} disconnected`);
                this.connected_clients.splice(this.connected_clients.indexOf(client), 1);
                this.sockio.emit('leave', {username: username});
            });

            socket.on('message', (msg) => {
                this.sockio.emit('msg', {
                    username: username,
                    message: msg
                });
            });
        });
    }

    get_username_list() {
        const list = [];
        this.connected_clients.forEach(client => list.push(client.username));
        return list;
    }
    
}

module.exports = Server;
