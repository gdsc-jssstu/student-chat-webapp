class Connection {
    constructor() {
        this.init();
    }

    init() {
        this.socket = io();
        this.socket.on('connect', this.on_connect.bind(this));
        this.socket.on('disconnect', this.on_disconnect.bind(this));
        this.socket.on('join', this.on_join.bind(this));
        this.socket.on('leave', this.on_leave.bind(this));
        this.socket.on('msg', this.on_message.bind(this));
    }

    on_connect() {
        console.log('Connected to server');
        if (this.on_connect_callback)
            this.on_connect_callback();
    }

    on_disconnect() {
        console.log('Disconnected from the server.');
        if (this.on_disconnect_callback)
            this.on_disconnect_callback();
    }

    on_join(user) {
        if (this.on_join_callback)
            this.on_join_callback(user);
    }

    on_leave(user) {
        if (this.on_leave_callback)
            this.on_leave_callback(user);
    }

    on_message(msg) {
        console.log(`recieved message from ${msg.username}: ${msg.message}`);
        if (this.on_message_callback)
            this.on_message_callback(msg.username, msg.message)
    }

    on(event, callback) {
        switch(event) {
            case 'connect':
                this.on_connect_callback = callback;
                break;
            case 'disconnect':
                this.on_disconnect_callback = callback;
            case 'join':
                this.on_join_callback = callback;
            case 'leave':
                this.on_leave_callback = callback;
            case 'message':
                this.on_message_callback = callback;
        }
    }

    send(msg) {
        this.socket.send(msg);
    }
}

const connection = new Connection();
const userlist_el = document.getElementById('userlist');
const chatarea_el = document.getElementById('chatarea');
const sendform_el = document.getElementById('sendform');
const msginput_el = document.getElementById('msginput');

const populate_userlist = () => {
    const el = (name) => {
        const containerdiv = document.createElement('div');
        containerdiv.className = "small_box";

        const img = document.createElement('img');
        img.src = "Cartoon-Face-DRAWING-–-STEP-10.jpg";

        const uname = document.createElement('h4');
        uname.appendChild(document.createTextNode(name));

        containerdiv.appendChild(img);
        containerdiv.appendChild(uname);

        return containerdiv;
    }

    fetch('/users').then(res => res.json().then(users => {
        userlist_el.innerHTML = '';
        users.forEach(user => {
            userlist_el.appendChild(el(user));
        });
    }));
};

const add_message = (username, message) => {
    const el = (username, msg) => {
        const containerdiv = document.createElement('div');
        containerdiv.className = "chat";

        const uname_el = document.createElement('h3');
        uname_el.appendChild(document.createTextNode(username));

        const msg_el = document.createElement('p');
        msg_el.appendChild(document.createTextNode(msg));

        containerdiv.appendChild(uname_el);
        containerdiv.appendChild(msg_el);

        return containerdiv;
    };

    chatarea_el.appendChild(el(username, message));
};

document.onload = () => {
    populate_userlist();
};

connection.on('join', () => {
    populate_userlist();
});

connection.on('leave', () => {
    populate_userlist();
});

connection.on('message', (username, message) => {
    add_message(username, message);
});

sendform_el.onsubmit = (e) => {
    e.preventDefault();
    const msg = e.target[0].value;
    connection.send(msg);
    msginput_el.value = "";
};
