const express           = require('express');
const ws                = require('ws');
const session           = require('express-session');
const bodyParser        = require('body-parser');
const http              = require('http');

const quizRouter        = require('./routes/quizzes');
const categoryRouter    = require('./routes/categories');
const accountRouter     = require('./routes/accounts');
const sessionsRouter    = require('./routes/sessions');
const mongoose          = require('mongoose');

const app = express();

app.use(session({resave: true, saveUninitialized: true, secret: "littlelayerofsecurity"}));

app.use(bodyParser.json());

app.use('/quizzes', quizRouter);
app.use('/categories', categoryRouter);
app.use('/accounts', accountRouter);
app.use('/sessions', sessionsRouter);

const dbName = "quizzer";

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
    mongoose.connect(`mongodb://quizzer-user:supers3cretp4assword!@104.248.87.211:27017/${dbName}`,  {useNewUrlParser: true }, () => {
        console.log(`game server started on port ${server.address().port}`);
    });
});