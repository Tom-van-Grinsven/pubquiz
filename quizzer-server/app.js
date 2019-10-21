const express           = require('express');
const ws                = require('ws');
const session           = require('express-session');
const bodyParser        = require('body-parser');
const http              = require('http');
const questionRouter    = require('./routes/questions');
const teamsRouter       = require('./routes/teams');

const app = express();

app.use(session({resave: true, saveUninitialized: true, secret: "littlelayerofsecurity"}));

app.use(bodyParser.json());

app.use('/', questionRouter);
app.use('/', teamsRouter);

const httpServer      = http.createServer(app);
const webSocketServer = new ws.Server({
    server: httpServer,
    path: "/random"
});

webSocketServer.on('connection', function connection(websocket) {
    console.log(i++,"CONNECTION CREATED");

    websocket.on('message', function incoming(message) {

    });

    websocket.on('close', function() {
        console.log('CONNECTION FOR ' + websocket.userName + " CLOSED.");
        if(websocket.timeoutObject) {
            clearTimeout(websocket.timeoutObject);
        }
    });
});

const server = app.listen(3000, () => {
    console.log(`game server started on port ${server.address().port}`);
});




